"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Subtle y offset; keep small for product feel */
  y?: number;
  once?: boolean;
}

/**
 * Viewport reveal — content is visible by default so SSR/headless never ships blank.
 * Motion only enhances; reduced-motion gets a short opacity crossfade.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-8% 0px -4% 0px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={
        reduce
          ? { opacity: 0.85 }
          : { opacity: 0.01, transform: `translateY(${y}px)` }
      }
      animate={
        inView
          ? { opacity: 1, transform: "translateY(0px)" }
          : reduce
            ? { opacity: 0.85 }
            : { opacity: 0.01, transform: `translateY(${y}px)` }
      }
      transition={{
        duration: reduce ? 0.2 : 0.55,
        delay: reduce ? 0 : delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Base delay before first child */
  delay?: number;
  /** Gap between children */
  stagger?: number;
}

export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.06,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  const reduce = useReducedMotion();
  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={
            reduce
              ? { opacity: 0.9 }
              : { opacity: 0.01, transform: "translateY(12px)" }
          }
          animate={
            inView
              ? { opacity: 1, transform: "translateY(0px)" }
              : reduce
                ? { opacity: 0.9 }
                : { opacity: 0.01, transform: "translateY(12px)" }
          }
          transition={{
            duration: reduce ? 0.15 : 0.45,
            delay: reduce ? 0 : delay + i * stagger,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
