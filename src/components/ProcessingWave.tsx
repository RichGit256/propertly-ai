import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProcessingWaveProps {
    imageSrc?: string; // Optional: show the original image with an overlay
}

export function ProcessingWave({ imageSrc }: ProcessingWaveProps) {
    return (
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-black/20 border border-white/10">
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="Processing"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm grayscale"
                />
            )}

            {/* Shimmer Wave Effect */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            {/* Pulsing Center Icon/Text */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/80" />
                </motion.div>
                <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4 text-sm font-medium text-white/80 tracking-widest uppercase"
                >
                    Enhancing Intelligence...
                </motion.p>
            </div>
        </div>
    );
}
