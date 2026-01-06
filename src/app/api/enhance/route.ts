import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { processWithPedra } from "@/lib/pedra";

export async function POST(req: NextRequest) {
    try {
        // 1. Initialize Supabase to get the current user
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options });
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing user sessions.
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.delete({ name, ...options });
                        } catch (error) {
                            // The `delete` method was called from a Server Component.
                            // This can be ignored.
                        }
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log("[API/Enhance] Guest user detected. Blocking access.");
            return NextResponse.json({ error: "Authentication required to use this feature." }, { status: 401 });
        }

        // 2. Check User Credits (Only if user is logged in)
        let creditsRemaining = null;
        if (user) {
            const { data: creditData, error: creditError } = await supabase
                .from("user_credits")
                .select("credits_remaining")
                .eq("user_id", user.id)
                .single();

            if (creditError || !creditData) {
                console.error("Credit Fetch Error:", creditError);
                // Don't block if just fetching credits fails, but maybe log it.
                // For safety, if logged in but can't fetch credits, maybe strict check? 
                // Let's assume strict for logged in users to prevent free abuse if they are logged in.
                return NextResponse.json({ error: "Could not fetch user credits." }, { status: 500 });
            }

            if (creditData.credits_remaining < 1) {
                return NextResponse.json({ error: "Insufficient credits. Please upgrade to continue." }, { status: 402 });
            }
            creditsRemaining = creditData.credits_remaining;
        }

        // 3. Process Request (Parsing)
        const formData = await req.formData();
        const image = formData.get("image") as File;
        const prompt = formData.get("prompt") as string;
        const mode = formData.get("mode") as "standard" | "magic";

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        console.log(`[API/Enhance] User: ${user?.email || "Guest"} | Credits: ${creditsRemaining ?? "N/A"} | Mode: ${mode}`);

        // 4. AI Processing
        let enhancedUrl: string;

        try {
            // Upload to Supabase Storage to get a Public URL for Pedra
            // This avoids sending massive Base64 strings which can cause 500 errors
            const fileName = `upload_${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabase.storage
                .from('temp-uploads')
                .upload(fileName, buffer, {
                    contentType: image.type,
                    upsert: true
                });

            if (uploadError) {
                console.error("Supabase Upload Error:", uploadError);
                throw new Error("Failed to upload image for processing");
            }

            const { data: { publicUrl: sourceImageUrl } } = supabase.storage
                .from('temp-uploads')
                .getPublicUrl(fileName);

            console.log("[API/Enhance] Uploaded source image to:", sourceImageUrl);

            // Call Pedra with the URL
            enhancedUrl = await processWithPedra(sourceImageUrl, mode, prompt);

        } catch (err: any) {
            console.error("[API/Enhance] Pedra AI Error:", err);
            return NextResponse.json({ error: "Enhancement failed: " + err.message }, { status: 500 });
        }

        // 5. Deduct Credit (Only if user is logged in)
        let newBalance = creditsRemaining;
        if (user) {
            const deductionAmount = mode === "magic" ? 2 : 1;
            const { data: balance, error: deductError } = await supabase
                .rpc('decrement_credits', { amount: deductionAmount });

            if (deductError) {
                console.error("Credit Deduction Error:", deductError);
                return NextResponse.json({ error: "Transaction failed. Please try again." }, { status: 500 });
            }
            newBalance = balance;

            // Log to History
            await supabase.from("user_edits").insert({
                user_id: user.id,
                original_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2668&auto=format&fit=crop", // Mock original
                enhanced_url: enhancedUrl,
                mode: mode
            });
        }

        return NextResponse.json({
            success: true,
            sessionId: crypto.randomUUID(),
            enhancedUrl: enhancedUrl,
            creditsRemaining: newBalance // The RPC returns the new balance
        });

    } catch (error) {
        console.error("[API/Enhance] Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
