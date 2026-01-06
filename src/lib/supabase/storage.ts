import { supabase } from "./client";

export async function uploadImage(file: File): Promise<{ path: string; url: string } | null> {
    if (!supabase) {
        console.warn("Supabase not initialized, using mock upload.");
        return new Promise(resolve => setTimeout(() => resolve({
            path: `mock/${file.name}`,
            url: URL.createObjectURL(file)
        }), 1000));
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from('temp-uploads')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
    }

    // Get public URL (assuming bucket is public)
    const { data: { publicUrl } } = supabase.storage
        .from('temp-uploads')
        .getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
}
