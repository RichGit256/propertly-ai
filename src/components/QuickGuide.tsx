"use client";

import { Upload, Sparkles, Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function QuickGuide() {
    const steps = [
        {
            icon: Upload,
            title: "Upload Photo",
            desc: "Drag & drop your listing property image.",
        },
        {
            icon: Sparkles,
            title: "AI Enhance",
            desc: "Choose from Magic or Standard enhancement modes.",
        },
        {
            icon: Download,
            title: "Download",
            desc: "Get your high-resolution, market-ready photo.",
        },
    ];

    return (
        <section className="w-full max-w-5xl mx-auto py-20 px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">How it Works</h2>
                <p className="text-white/50">Three simple steps to perfect real estate photography.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        className="relative flex flex-col items-center text-center space-y-4 group"
                    >
                        <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-white/20 group-hover:bg-white/10 shadow-lg shadow-black/20">
                            <step.icon className="w-10 h-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />

                            <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                                Step {i + 1}
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-white/50 max-w-[200px] mx-auto leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
