import { AnimatePresence, motion } from "framer-motion";
import { Upload, Sparkles, Image as ImageIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface LiquidDropZoneProps {
    onFileSelect: (files: File[]) => void;
    isProcessing: boolean;
}

export function LiquidDropZone({ onFileSelect, isProcessing }: LiquidDropZoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);

    // Drag handlers
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(Array.from(e.dataTransfer.files));
        }
    }, [onFileSelect]);

    const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(Array.from(e.target.files));
        }
    }, [onFileSelect]);

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <motion.div
                layout
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500",
                    isDragActive
                        ? "border-primary/50 bg-primary/5 scale-[1.02]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]",
                    isProcessing ? "opacity-50 pointer-events-none" : ""
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                {/* Liquid/Ripple Background Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {isDragActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"
                        />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center py-24 px-4 text-center space-y-6">
                    <div className="relative">
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isDragActive ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(255,255,255,0.3)]" : "bg-white/10 text-white shadow-xl"
                        )}>
                            {isDragActive ? (
                                <Sparkles className="w-10 h-10 animate-pulse" />
                            ) : (
                                <Upload className="w-10 h-10" />
                            )}
                        </div>

                        {/* Ripple rings */}
                        <div className={cn(
                            "absolute inset-0 -z-10 rounded-2xl border border-white/20 scale-110 opacity-0 transition-all duration-1000",
                            "group-hover:scale-150 group-hover:opacity-100 group-hover:animate-ripple"
                        )} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold tracking-tight">
                            {isDragActive ? "Drop to Enhance" : "Upload Property Images"}
                        </h3>
                        <p className="text-muted-foreground text-base max-w-sm mx-auto">
                            Drag & drop your real estate photos here, or tap to browse.
                            <span className="block text-xs mt-2 opacity-60">Supports JPG, PNG, WEBP (Max 25MB)</span>
                        </p>
                    </div>
                </div>

                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={onFileInput}
                />
            </motion.div>
        </div>
    );
}
