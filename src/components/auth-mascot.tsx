"use client";

import { cn } from "@/lib/utils";

interface MascotProps {
  focusedField: "email" | "password" | null;
  showPassword?: boolean;
}

export default function AuthMascot({
  focusedField,
  showPassword,
}: MascotProps) {
  const pupilPos = focusedField === "email" ? { x: 0, y: 8 } : { x: 0, y: 0 };

  // LOGIC
  const isCoveringEyes = focusedField === "password" && !showPassword;
  const isPeeking = focusedField === "password" && showPassword;

  return (
    <div className="w-32 h-32 mx-auto relative transition-all duration-500">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* HEAD */}
        <rect
          x="10"
          y="20"
          width="100"
          height="90"
          rx="20"
          className="fill-stone-900 dark:fill-stone-100 transition-colors"
        />

        {/* EARS */}
        <path
          d="M30 20V10M90 20V10"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-stone-900 dark:text-stone-100"
        />
        <circle cx="30" cy="8" r="4" className="fill-primary animate-pulse" />

        {/* FACE SCREEN */}
        <rect
          x="20"
          y="35"
          width="80"
          height="50"
          rx="12"
          className="fill-black dark:fill-stone-900"
        />

        {/* EYES CONTAINER */}
        <g
          className="transition-transform duration-300 ease-out"
          style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}
        >
          {/* Left Eye */}
          <circle cx="40" cy="60" r="10" className="fill-white" />
          <circle cx="40" cy="60" r="4" className="fill-black opacity-80" />

          {/* Right Eye */}
          <circle cx="80" cy="60" r="10" className="fill-white" />
          <circle cx="80" cy="60" r="4" className="fill-black opacity-80" />
        </g>

        {/* HANDS */}
        <path
          d="M10 110 C 10 90, 30 50, 45 50 C 55 50, 55 70, 35 110"
          className={cn(
            "fill-stone-800 dark:fill-stone-300 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isCoveringEyes
              ? "translate-y-[-10px] opacity-100"
              : "translate-y-[120px] opacity-0",
            isPeeking ? "translate-y-[20px]" : "",
          )}
        />
        <path
          d="M110 110 C 110 90, 90 50, 75 50 C 65 50, 65 70, 85 110"
          className={cn(
            "fill-stone-800 dark:fill-stone-300 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isCoveringEyes
              ? "translate-y-[-10px] opacity-100"
              : "translate-y-[120px] opacity-0",
            isPeeking ? "translate-y-[120px] opacity-0" : "",
          )}
        />
      </svg>
    </div>
  );
}
