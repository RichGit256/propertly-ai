"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifiedPage() {
    const router = useRouter();

    // Optional: Auto-redirect after a few seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-md w-full bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center space-y-8 relative z-10 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 ring-1 ring-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Email Verified!</h1>
                    <p className="text-white/60 text-base leading-relaxed">
                        Your account has been successfully verified. You now have full access to Propertly.ai.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="group flex w-full items-center justify-center gap-2 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98]"
                    >
                        Continue to Dashboard
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="text-xs text-white/30">
                        Redirecting automatically in 5 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
