import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    aspectRatio?: string; // e.g. "aspect-[4/3]"
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    aspectRatio = "aspect-[4/3]"
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = 'touches' in event ? event.touches[0].clientX : (event as any).clientX;
        const clampedY = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        setSliderPosition(clampedY * 100);
    };

    const handleMouseDown = () => {
        isDragging.current = true;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    // Global event listeners for drag to continue outside component
    useEffect(() => {
        const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging.current) {
                handleMove(e);
            }
        };
        const handleGlobalUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('touchmove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalUp);
        window.addEventListener('touchend', handleGlobalUp);

        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('touchmove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
            window.removeEventListener('touchend', handleGlobalUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative w-full overflow-hidden rounded-2xl select-none cursor-ew-resize group ${aspectRatio}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <Image
                    src={afterImage}
                    alt="After Enhancement"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded backdrop-blur-md">
                    After
                </div>
            </div>

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                <div className="absolute inset-0 w-full h-full relative">
                    <Image
                        src={beforeImage}
                        alt="Before Enhancement"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded backdrop-blur-md">
                        Before
                    </div>
                </div>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                    <ChevronsLeftRight className="w-4 h-4 text-black" />
                </div>
            </div>
        </div>
    );
}
