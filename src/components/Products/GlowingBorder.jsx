"use client";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

const MovingGlow = ({
  children,
  duration = 2000,
  rx = "30%",
  ry = "30%",
  className = "",
}) => {
  const pathRef = useRef();
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        <div className={`h-48 w-48 opacity-[0.8] bg-[radial-gradient(#09AFF4_40%,transparent_60%)] ${className}`} />
      </motion.div>
    </>
  );
};

export default function GlowingBorder({ children, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative p-[1px] overflow-hidden rounded-xl border border-border/40">
        <div className="absolute inset-0">
          <MovingGlow duration={4000} rx="12px" ry="12px" />
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
      <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-[#8B4FE4] to-[#E542BE] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
        Best Value
      </div>
    </div>
  );
} 