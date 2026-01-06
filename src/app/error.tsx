"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6 max-w-md"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <span className="text-3xl">⚠️</span>
                </div>

                <h2 className="text-3xl font-bold">Something went wrong!</h2>
                <p className="text-white/50">
                    We encountered an unexpected error. It's not you, it's us.
                </p>

                <div className="pt-4">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Try again
                    </button>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 p-4 bg-red-950/30 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-red-200 border border-red-900/50">
                        {error.message}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
