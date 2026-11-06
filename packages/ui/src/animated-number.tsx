"use client";

import React, { useEffect } from "react";
import { motion, SpringOptions, useSpring, useTransform } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
};

/**
 * 21st.dev Animated Number Component (id: 1429)
 * Smoothly interpolates numerical values with physics-based springs.
 */
export function AnimatedNumber({
  value,
  className,
  springOptions = {
    bounce: 0,
    duration: 1000,
  },
}: AnimatedNumberProps) {
  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={cn("tabular-nums inline-block", className)}>
      {display}
    </motion.span>
  );
}

export default AnimatedNumber;
