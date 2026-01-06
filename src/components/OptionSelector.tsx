import { motion } from "framer-motion";
import { Wand2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionSelectorProps {
    onSelect: (option: "standard" | "magic") => void;
}

export function OptionSelector({ onSelect }: OptionSelectorProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {/* Option A: Standard Fix */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => onSelect("standard")}
                className="group relative flex flex-col items-start p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-white/20 hover:bg-neutral-800/50 transition-all text-left overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-blue-400" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-2">Standard Fix</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                    Instantly correct lighting, color balance, and perspective.
                    Perfect for quick listing prep.
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <span>1 Credit</span>
                </div>
            </motion.button>

            {/* Option B: Magic Edit */}
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => onSelect("magic")}
                className="group relative flex flex-col items-start p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-purple-500/30 hover:bg-neutral-800/50 transition-all text-left overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-8 h-8 text-purple-400" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-2">Magic Edit</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">
                    Complex changes via AI prompt. Declutter rooms, remove objects,
                    or virtual staging.
                </p>

                <div className="mt-auto flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <span>2 Credits</span>
                </div>
            </motion.button>
        </div>
    );
}
