"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastType = "diff" | "approved" | "rollback" | "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners: Set<ToastListener> = new Set();

  private notify() {
    this.listeners.forEach((l) => l([...this.toasts]));
  }

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  add(toast: Omit<ToastItem, "id"> & { id?: string }): string {
    const id = toast.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newItem: ToastItem = {
      ...toast,
      id,
      duration: toast.duration ?? 4500,
    };
    // Keep max 5 toasts visible at once
    this.toasts = [newItem, ...this.toasts.slice(0, 4)];
    this.notify();

    if (newItem.duration && newItem.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newItem.duration);
    }

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastManager = new ToastManager();

export const toast = {
  custom: (item: Omit<ToastItem, "id">) => toastManager.add(item),
  diff: (model: string, filePath?: string) =>
    toastManager.add({
      type: "diff",
      title: `New diff proposed by ${model}`,
      description: filePath ? `Target: ${filePath}` : "Awaiting your human-in-the-loop review",
      duration: 5000,
    }),
  approved: (filePath?: string) =>
    toastManager.add({
      type: "approved",
      title: "Change approved ✅",
      description: filePath ? `Committed patch to ${filePath}` : "Diff applied and snapshotted to git",
      duration: 4000,
    }),
  rollback: (filePath?: string) =>
    toastManager.add({
      type: "rollback",
      title: "Rollback completed ↩️",
      description: filePath ? `Restored clean state for ${filePath}` : "Reverted to previous safe git snapshot",
      duration: 4000,
    }),
  success: (title: string, description?: string) =>
    toastManager.add({
      type: "success",
      title,
      description,
      duration: 4000,
    }),
  error: (title: string, description?: string) =>
    toastManager.add({
      type: "error",
      title,
      description,
      duration: 6000,
    }),
  info: (title: string, description?: string) =>
    toastManager.add({
      type: "info",
      title,
      description,
      duration: 4000,
    }),
  dismiss: (id: string) => toastManager.dismiss(id),
};

export interface ToasterProps {
  position?: "bottom-right" | "top-right" | "top-center" | "bottom-center";
  className?: string;
}

/**
 * 21st.dev Premium Sonner-style Toaster
 * Renders glassmorphic, animated notification cards with dynamic theme accent support.
 */
export function Toaster({
  position = "bottom-right",
  className,
}: ToasterProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  const positionClasses = {
    "bottom-right": "bottom-5 right-5 items-end",
    "top-right": "top-5 right-5 items-end",
    "top-center": "top-5 left-1/2 -translate-x-1/2 items-center",
    "bottom-center": "bottom-5 left-1/2 -translate-x-1/2 items-center",
  }[position];

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "diff":
        return <Sparkles className="w-4 h-4 text-[var(--color-accent,#38BDF8)] animate-pulse" />;
      case "approved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "rollback":
        return <RotateCcw className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case "info":
      case "success":
      default:
        return <Info className="w-4 h-4 text-[var(--color-accent,#38BDF8)]" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case "approved":
        return "border-emerald-500/40 shadow-emerald-500/10";
      case "rollback":
        return "border-amber-500/40 shadow-amber-500/10";
      case "error":
        return "border-rose-500/40 shadow-rose-500/10";
      case "diff":
      default:
        return "border-[var(--color-accent,#38BDF8)]/50 shadow-[var(--color-accent,#38BDF8)]/15";
    }
  };

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed z-[100] pointer-events-none flex flex-col gap-2.5 max-w-sm w-full p-2 select-none",
        positionClasses,
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={cn(
              "pointer-events-auto w-full rounded-xl border bg-[#0a0a0f]/95 backdrop-blur-xl p-3.5 shadow-2xl transition-colors",
              getBorderColor(item.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white tracking-tight">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => toastManager.dismiss(item.id)}
                className="shrink-0 p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

