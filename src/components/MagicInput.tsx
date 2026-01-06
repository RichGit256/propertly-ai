import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicInputProps {
    onSubmit: (prompt: string) => void;
    isSubmitting?: boolean;
}

export function MagicInput({ onSubmit, isSubmitting }: MagicInputProps) {
    const [prompt, setPrompt] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus when component pulses in
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isSubmitting) {
            onSubmit(prompt);
        }
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed bottom-10 left-0 right-0 z-50 px-4 flex justify-center"
        >
            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-2xl group"
            >
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 rounded-full" />

                <div className="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl ring-1 ring-white/5 focus-within:ring-white/20 transition-all">
                    <div className="pl-4 pr-3 text-purple-400">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your edit (e.g., 'Remove the messy cables')..."
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 h-12 px-2"
                        disabled={isSubmitting}
                    />

                    <button
                        type="submit"
                        disabled={!prompt.trim() || isSubmitting}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            prompt.trim()
                                ? "bg-white text-black hover:scale-105 hover:bg-blue-50"
                                : "bg-white/10 text-white/20 cursor-not-allowed"
                        )}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
