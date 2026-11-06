"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

/**
 * 21st.dev Shimmer Skeleton Base Component
 * Sweeps an animated gradient highlight that subtly adopts the active theme accent.
 */
export function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-white/[0.04]",
        shimmer &&
          "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/[0.08] after:to-transparent",
        className
      )}
      {...props}
    />
  );
}

/**
 * FileTreeSkeleton: Shimmer placeholder state for the repository File Tree
 */
export function FileTreeSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full h-full p-4 space-y-3 font-mono select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>

      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, i) => {
          const indent = (i % 3) * 16;
          return (
            <div
              key={i}
              className="flex items-center gap-2 py-1"
              style={{ paddingLeft: `${indent}px` }}
            >
              <Skeleton className="w-3.5 h-3.5 shrink-0 rounded" />
              <Skeleton
                className="h-3 rounded"
                style={{
                  width: `${50 + ((i * 37) % 45)}%`,
                }}
              />
              {i % 2 === 0 && (
                <Skeleton className="w-2 h-2 rounded-full ml-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * DiffViewerSkeleton: Shimmer placeholder for the central Diff Viewer
 */
export function DiffViewerSkeleton({ lines = 12 }: { lines?: number }) {
  return (
    <div className="w-full h-full flex flex-col font-mono select-none bg-[#050508]">
      {/* Top Bar Skeleton */}
      <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>

      {/* Code Lines Shimmer */}
      <div className="flex-1 p-4 space-y-2.5 overflow-hidden">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-0.5">
            <Skeleton className="h-3 w-6 shrink-0 opacity-40" />
            <Skeleton
              className="h-3 rounded"
              style={{
                width: `${30 + ((i * 47) % 60)}%`,
                opacity: i % 4 === 0 ? 0.35 : 0.7,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

