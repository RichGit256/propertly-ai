import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BentoItem {
    id: string;
    src: string;
    span?: "col-span-1" | "col-span-2"; // Simple span control
    rowSpan?: "row-span-1" | "row-span-2";
}

interface BentoGridProps {
    items: BentoItem[];
    onItemClick?: (id: string) => void;
}

export function BentoGrid({ items, onItemClick }: BentoGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4 max-w-5xl mx-auto w-full">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                    className={cn(
                        "relative group overflow-hidden rounded-3xl bg-neutral-900 border border-white/5 cursor-pointer",
                        item.span || "col-span-1",
                        item.rowSpan || "row-span-1"
                    )}
                    onClick={() => onItemClick?.(item.id)}
                >
                    <Image
                        src={item.src}
                        alt="Gallery Item"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
            ))}
        </div>
    );
}
