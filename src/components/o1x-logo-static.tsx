import React from 'react';

interface O1XLogoStaticProps {
    height?: number;
    color?: string;
    className?: string;
}

export default function O1XLogoStatic({
    height = 40,
    color = "#d7ff00",
    className
}: O1XLogoStaticProps) {
    return (
        <svg
            width={(height * 2.2)}
            height={height}
            viewBox="0 0 220 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="01X Logo"
        >
            {/* 0 (Circle) */}
            <circle cx="50" cy="50" r="30" fill={color} />

            {/* 1 (Bar) */}
            <rect x="100" y="20" width="20" height="60" rx="6" fill={color} />

            {/* X (Crossed Bars) */}
            <g transform="translate(175, 50) scale(1.15)">
                <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(45)" fill={color} />
                <rect x="-10" y="-30" width="20" height="60" rx="6" transform="rotate(-45)" fill={color} />
            </g>
        </svg>
    );
}
