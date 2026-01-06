
import axios from "axios";

const PEDRA_API_KEY = process.env.PEDRA_API_KEY;
const BASE_URL = "https://app.pedra.ai/api";

type PedraMode = "standard" | "magic";

export async function processWithPedra(imageUrl: string, mode: PedraMode, prompt?: string): Promise<string> {
    if (!PEDRA_API_KEY) {
        throw new Error("PEDRA_API_KEY is not configured");
    }

    // 2. Determine Endpoint and Payload
    let endpoint = "";
    const payload: any = {
        apiKey: PEDRA_API_KEY,
        imageUrl: imageUrl
    };

    if (mode === "magic") {
        if (!prompt) {
            throw new Error("Prompt is required for Magic Mode (Edit with Prompt)");
        }
        endpoint = `${BASE_URL}/edit_via_prompt`;
        payload.prompt = prompt;
    } else {
        // Standard Mode = Automatic Prompt (enhance, fix perspective and make HD)
        // User requested to use "edit via prompt" endpoint for standard mode too to access more features.
        endpoint = `${BASE_URL}/edit_via_prompt`;
        payload.prompt = "enhance, fix perspective and make HD";
    }

    console.log(`[PedraAI] Requesting ${mode} enhancement via ${endpoint}...`);

    try {
        const response = await axios.post(endpoint, payload, {
            headers: {
                "Content-Type": "application/json",
                // "Accept": "application/json" // Usually good practice
            },
            timeout: 60000 // 60s timeout (docs say ~25s)
        });

        console.log("[PedraAI] Response Status:", response.status);
        console.log("[PedraAI] Response Data:", JSON.stringify(response.data).substring(0, 500) + "..."); // Log first 500 chars to debug structure

        // 3. Parse Response
        // Since docs didn't specify, I'll check common fields.
        const responseData = response.data;

        let resultUrl = "";

        if (typeof responseData === 'string' && responseData.startsWith('http')) {
            resultUrl = responseData;
        } else if (responseData.imageUrl) {
            resultUrl = responseData.imageUrl;
        } else if (responseData.url) {
            resultUrl = responseData.url;
        } else if (responseData.output) {
            // "output" key found
            const out = responseData.output;
            if (typeof out === 'string') {
                resultUrl = out;
            } else if (Array.isArray(out) && out.length > 0) {
                if (typeof out[0] === 'string') {
                    resultUrl = out[0];
                } else if (out[0].url) {
                    resultUrl = out[0].url;
                }
            } else if (out.url) {
                resultUrl = out.url;
            } else if (out.imageUrl) {
                resultUrl = out.imageUrl;
            } else if (out.image_url) {
                resultUrl = out.image_url;
            } else if (out.image) {
                resultUrl = out.image;
            }
        } else if (responseData.data && responseData.data.url) {
            resultUrl = responseData.data.url;
        } else if (responseData.data && responseData.data.imageUrl) {
            resultUrl = responseData.data.imageUrl;
        }

        if (!resultUrl) {
            // CRITICAL DEBUG: Include the actual object in the error so we can see it
            const debugStr = JSON.stringify(responseData).substring(0, 200);
            throw new Error(`Could not parse output URL. Struct: ${debugStr}`);
        }

        // Return the final URL
        // Note: If Pedra returns a temporary URL, we might want to upload it to Supabase later.
        // For now, we return it directly as per the previous Vance implementation pattern (which returned the Supabase URL, 
        // but here we might just pass through for speed, or we can upload it if we want persistence).
        // Let's return the URL directly for now.
        return resultUrl;

    } catch (error: any) {
        console.error("[PedraAI] Raw Error:", error);
        if (error.response) {
            console.error("[PedraAI] Response Status:", error.response.status);
            console.error("[PedraAI] Response Data:", error.response.data);
            const detailedMsg = JSON.stringify(error.response.data);
            throw new Error(`Pedra AI Failed (${error.response.status}): ${detailedMsg}`);
        }
        throw new Error(`Pedra AI Failed: ${error.message}`);
    }
}
