"use client";

import Image from "next/image";

interface LoadingSpinnerProps {
  text?: string;
  imageSrc?: string;
  size?: number; // size in pixels (width & height)
}

export default function LoadingSpinner({
  text = "Loading...",
  imageSrc = "/images/m-logo.png",
  size = 64,
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#f3f4f691] z-50">
      <div
        className="relative animate-coin-flip"
        style={{ width: size, height: size }}
      >
        <Image
          src={imageSrc}
          alt="Loading..."
          fill
          sizes={`${size}px`}
          style={{
            objectFit: "contain",
            backfaceVisibility: "visible",
            transformStyle: "preserve-3d",
          }}
        />
      </div>
      <p className="text-center p-8 text-lg">{text}</p>
    </div>
  );
}
