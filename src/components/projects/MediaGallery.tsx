"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MediaGalleryProps {
    images: string[];
    title: string;
    className?: string;
}

export function MediaGallery({ images, title, className }: MediaGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    if (!images.length) return null;

    const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
        if (e.key === "Escape") setLightboxOpen(false);
    };

    return (
        <>
            <div className={cn("relative group", className)}>
                {/* Main image */}
                <div
                    className="relative rounded-xl overflow-hidden bg-muted/40 cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
                    aria-label={`View screenshot ${activeIndex + 1} of ${images.length}`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[activeIndex]}
                        alt={`${title} screenshot ${activeIndex + 1}`}
                        className="w-full object-cover aspect-video"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />

                    {/* Nav arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-background/80 p-1.5 shadow-md"
                                aria-label="Previous screenshot"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-background/80 p-1.5 shadow-md"
                                aria-label="Next screenshot"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                            {/* Dot indicators */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all",
                                            i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        )}
                                        aria-label={`Go to screenshot ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                        {images.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={cn(
                                    "shrink-0 rounded-md overflow-hidden w-16 h-10 border-2 transition-all",
                                    i === activeIndex ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                                )}
                                aria-label={`View screenshot ${i + 1}`}
                                aria-pressed={i === activeIndex}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt={`${title} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal
                    aria-label="Screenshot lightbox"
                    tabIndex={-1}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/10"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Close lightbox"
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prev(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors"
                                aria-label="Previous screenshot"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); next(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors"
                                aria-label="Next screenshot"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[activeIndex]}
                        alt={`${title} screenshot ${activeIndex + 1}`}
                        className="max-h-[85vh] max-w-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                        {activeIndex + 1} / {images.length}
                    </span>
                </div>
            )}
        </>
    );
}
