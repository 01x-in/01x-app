"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface O1XLogoProps {
    size?: number;
    color?: string;
    background?: string;
}

export default function O1XLogo({
    size = 40,
    color = "var(--brand)",
    background = "transparent"
}: O1XLogoProps) {
    const circleRef = useRef<HTMLDivElement>(null);
    const barARef = useRef<HTMLDivElement>(null);
    const barBRef = useRef<HTMLDivElement>(null);
    const xContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const circle = circleRef.current;
        const barA = barARef.current;
        const barB = barBRef.current;
        const xContainer = xContainerRef.current;

        if (!circle || !barA || !barB || !xContainer) return;

        // Set transform origins
        gsap.set([circle, xContainer], { transformOrigin: "50% 50%" });
        gsap.set([barA, barB], { transformOrigin: "50% 50%" });

        // Initial states - X container starts at 45° to match tilted bar
        gsap.set(xContainer, { opacity: 0, rotate: 45 });
        gsap.set(barA, { rotate: 0 });
        gsap.set(barB, { rotate: 0 });

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.5,
            defaults: { ease: "power2.inOut" }
        });

        // === PHASE 1: Circle (O) → Bar (1) ===
        tl.to(circle, {
            duration: 0.5,
            scaleX: 0.33,
            borderRadius: "20%"
        })

            // Pause
            .to({}, { duration: 0.2 })

            // === PHASE 2: Bar rotates 45° ===
            .to(circle, {
                duration: 0.3,
                rotate: 45
            })

            // Show X container (already at 45° to match)
            .set(xContainer, { opacity: 1 })
            .set(circle, { opacity: 0 })

            // === PHASE 3: Bars split apart to form X ===
            // Bar A stays at 0° (relative to container at 45° = absolute 45°)
            // Bar B rotates to 90° (relative to container at 45° = absolute 135°)
            .to(barB, {
                duration: 0.3,
                rotate: 90,
                ease: "power2.out"
            })

            // Pause
            .to({}, { duration: 0.2 })

            // === PHASE 4: X spins - starts slow, accelerates dramatically ===
            .to(xContainer, {
                duration: 0.4,
                rotate: 180,
                ease: "power1.in"  // Slow start
            })
            .to(xContainer, {
                duration: 0.3,
                rotate: 540,
                ease: "none"  // Building speed
            })
            .to(xContainer, {
                duration: 0.2,
                rotate: 1080,
                ease: "power2.in"  // Very fast at end
            })

            // === PHASE 5: Fade to circle while still spinning fast ===
            .to(xContainer, {
                duration: 0.15,
                opacity: 0
            }, "<0.05")
            .to(circle, {
                duration: 0.2,
                opacity: 1,
                scaleX: 1,
                rotate: 0,
                borderRadius: "50%"
            }, "<")

            // Reset for next loop
            .set(xContainer, { rotate: 45 })
            .set(barA, { rotate: 0 })
            .set(barB, { rotate: 0 });

        return () => {
            tl.kill();
        };
    }, []);

    const shapeSize = "60%";
    const barWidth = "20%";

    return (
        <div
            style={{
                width: size,
                height: size,
                background,
                display: "grid",
                placeItems: "center"
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative"
                }}
            >
                {/* Circle / Bar (morphs between them) */}
                <div
                    ref={circleRef}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: shapeSize,
                        height: shapeSize,
                        background: color,
                        borderRadius: "50%"
                    }}
                />

                {/* X shape container (rotates as a unit) */}
                <div
                    ref={xContainerRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        opacity: 0
                    }}
                >
                    {/* Bar A - starts at 0°, tilts to 45° */}
                    <div
                        ref={barARef}
                        style={{
                            position: "absolute",
                            width: barWidth,
                            height: shapeSize,
                            background: color,
                            borderRadius: "20%"
                        }}
                    />
                    {/* Bar B - starts at 0°, tilts to -45° */}
                    <div
                        ref={barBRef}
                        style={{
                            position: "absolute",
                            width: barWidth,
                            height: shapeSize,
                            background: color,
                            borderRadius: "20%"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
