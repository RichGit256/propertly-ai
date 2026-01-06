
const VANCE_API_KEY = process.env.VANCE_API_KEY;
import { SupabaseClient } from "@supabase/supabase-js";

type VanceConfig = {
    name: string;
    config: {
        module: string;
        module_params: Record<string, any>;
    };
};

const MAX_RETRIES = 3;


import axios from "axios";
import FormData from "form-data";

export async function processWithVance(imageFile: File, config: VanceConfig, supabaseClient: SupabaseClient): Promise<string> {
    if (!VANCE_API_KEY) {
        throw new Error("VANCE_API_KEY is not configured");
    }

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[VanceAI] Attempt ${attempt}/${MAX_RETRIES} starting...`);

            // 1. Upload Image using Axios + form-data (Robust Node.js approach)
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadForm = new FormData();
            uploadForm.append("api_token", VANCE_API_KEY);
            uploadForm.append("file", buffer, { filename: imageFile.name, contentType: imageFile.type || "image/jpeg" });

            console.log(`[VanceAI] Uploading image... Name: ${imageFile.name}, Size: ${buffer.length}`);

            const uploadRes = await axios.post("https://api-service.vanceai.com/web_api/v1/upload", uploadForm, {
                headers: {
                    ...uploadForm.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });

            if (uploadRes.data.code !== 200) {
                console.error("[VanceAI] Upload Failed:", uploadRes.data);
                throw new Error(`VanceAI Upload Failed: ${uploadRes.data.msg || "Unknown error"}`);
            }

            const uid = uploadRes.data.data.uid;
            console.log(`[VanceAI] Image uploaded. UID: ${uid}`);

            // 2. Trigger Transformation
            const transformForm = new FormData();
            transformForm.append("api_token", VANCE_API_KEY);
            transformForm.append("uid", uid);
            transformForm.append("jconfig", JSON.stringify(config));

            console.log("[VanceAI] Starting transformation...", JSON.stringify(config));

            const transformRes = await axios.post("https://api-service.vanceai.com/web_api/v1/transform", transformForm, {
                headers: {
                    ...transformForm.getHeaders(),
                }
            });

            if (transformRes.data.code !== 200) {
                console.error("[VanceAI] Transform Failed:", transformRes.data);
                throw new Error(`VanceAI Transform Failed: ${transformRes.data.msg || "Unknown error"}`);
            }

            const transId = transformRes.data.data.trans_id;
            console.log(`[VanceAI] Job started. TransID: ${transId}`);

            // 3. Poll for Progress using Axios
            let attempts = 0;
            while (attempts < 300) {
                await new Promise(r => setTimeout(r, 2000));
                attempts++;

                const progressForm = new FormData();
                progressForm.append("api_token", VANCE_API_KEY);
                progressForm.append("trans_id", transId);

                const progressRes = await axios.post("https://api-service.vanceai.com/web_api/v1/progress", progressForm, {
                    headers: {
                        ...progressForm.getHeaders()
                    }
                });

                const progressData = progressRes.data;

                if (progressData.code !== 200) {
                    console.error("[VanceAI] Progress Check Error:", progressData);
                    continue;
                }

                const status = progressData.data.status;

                if (status === "finish") {
                    console.log("[VanceAI] Job finished. Downloading result...");
                    const downloadUrl = `https://api-service.vanceai.com/web_api/v1/download?trans_id=${transId}&api_token=${VANCE_API_KEY}`;

                    const imageRes = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
                    const imageBuffer = Buffer.from(imageRes.data);
                    const fileName = `vance_enhanced_${transId}_${Date.now()}.png`;

                    console.log("[VanceAI] Uploading result to Supabase Storage...");
                    const { data, error } = await supabaseClient.storage
                        .from('temp-uploads')
                        .upload(fileName, imageBuffer, {
                            contentType: 'image/png',
                            upsert: true
                        });

                    if (error) {
                        console.error("Supabase Upload Error:", error);
                        throw new Error(`Failed to upload enhanced image: ${error.message}`);
                    }

                    const { data: { publicUrl } } = supabaseClient.storage
                        .from('temp-uploads')
                        .getPublicUrl(fileName);

                    console.log("Enhanced URL:", publicUrl);
                    return publicUrl;

                } else if (status === "fatal") {
                    console.error("VanceAI Fatal Error Data:", JSON.stringify(progressData, null, 2));
                    throw new Error(`VanceAI Job Failed Fatal: ${JSON.stringify(progressData)}`);
                }
            }

            throw new Error("VanceAI Timeout");

        } catch (error: any) {
            console.error(`[VanceAI] Attempt ${attempt} failed:`, error.message);
            lastError = error;

            if (attempt < MAX_RETRIES) {
                const delay = attempt * 2000;
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    throw lastError || new Error("VanceAI Failed after multiple attempts");
}
