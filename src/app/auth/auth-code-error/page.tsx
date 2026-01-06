"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card border border-white/10 rounded-2xl p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-white">Verification Link Expired</h1>
                    <p className="text-white/60 text-sm leading-relaxed">
                        This usually happens if the link was already clicked or has expired.
                        <br /><br />
                        <strong>Good news:</strong> You might already be verified! Try signing in or check if you are already logged in at the top right.
                    </p>
                </div>

                <Link
                    href="/"
                    className="block w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
