"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeftRight } from "lucide-react";

interface ComparisonSliderProps {
    beforeImage: string;
    afterImage: string;
    aspectRatio?: string; // e.g., "aspect-[4/3]"
}

export function ComparisonSlider({ beforeImage, afterImage, aspectRatio = "aspect-[4/3]" }: ComparisonSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = useCallback((clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
        }
    }, []);

    const handleMouseDown = () => setIsDragging(true);
    const handleTouchStart = () => setIsDragging(true);

    const handleMouseUp = useCallback(() => setIsDragging(false), []);
    const handleTouchEnd = useCallback(() => setIsDragging(false), []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    }, [isDragging, handleMove]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (isDragging) handleMove(e.touches[0].clientX);
    }, [isDragging, handleMove]);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleTouchEnd);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    // Click on container to jump
    const handleContainerClick = (e: React.MouseEvent) => {
        handleMove(e.clientX);
    };

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl select-none cursor-crosshair group touch-none`}
            onClick={handleContainerClick}
        >
            {/* After Image (Background) - 0 to 100% visible */}
            <img
                src={afterImage}
                alt="Enhanced"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Foreground) - Clip path based on slider */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img
                    src={beforeImage}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Label for Before */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white/90 text-xs font-bold px-2 py-1 rounded-md pointer-events-none">
                    Original
                </div>
            </div>

            {/* Label for After */}
            <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md text-white/90 text-xs font-bold px-2 py-1 rounded-md pointer-events-none">
                Enhanced
            </div>


            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95">
                    <ArrowLeftRight className="w-4 h-4 text-black" />
                </div>
            </div>
        </div>
    );
}
