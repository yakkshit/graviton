"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  FileCode,
  Palette,
  Settings,
  Radio,
  RadioOff,
  Flame,
  ArrowRight,
  Sparkles,
  Command as CommandIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CommandPaletteDiff {
  id: string;
  filePath: string;
  model: string;
  riskLevel: string;
}

export interface CommandPaletteTheme {
  id: string;
  name: string;
  hex: string;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  pendingDiffs?: CommandPaletteDiff[];
  onSelectDiff?: (filePath: string) => void;
  themes?: CommandPaletteTheme[];
  activeThemeId?: string;
  onSelectTheme?: (themeId: string) => void;
  onOpenSettings?: () => void;
  onDisconnectTunnel?: () => void;
  isTunnelActive?: boolean;
}

type CommandEntry = {
  id: string;
  category: "Diffs" | "Themes" | "Actions";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  action: () => void;
};

/**
 * 21st.dev Raycast-style Command Palette Component
 * Accessible globally via Cmd+K / Ctrl+K with full keyboard navigation.
 */
export function CommandPalette({
  isOpen,
  onClose,
  pendingDiffs = [],
  onSelectDiff,
  themes = [],
  activeThemeId,
  onSelectTheme,
  onOpenSettings,
  onDisconnectTunnel,
  isTunnelActive = false,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items list
  const items: CommandEntry[] = useMemo(() => {
    const list: CommandEntry[] = [];

    // 1. Pending Diffs
    pendingDiffs.forEach((d) => {
      list.push({
        id: `diff-${d.id}`,
        category: "Diffs",
        title: d.filePath,
        subtitle: `Proposed by ${d.model}`,
        icon: <FileCode className="w-4 h-4 text-[var(--color-accent,#38BDF8)] shrink-0" />,
        badge: (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-300">
            {d.riskLevel}
          </span>
        ),
        action: () => {
          onSelectDiff?.(d.filePath);
          onClose();
        },
      });
    });

    // 2. Theme Options
    themes.forEach((t) => {
      const isActive = t.id === activeThemeId;
      list.push({
        id: `theme-${t.id}`,
        category: "Themes",
        title: `Switch Theme: ${t.name}`,
        subtitle: isActive ? "Currently Active" : undefined,
        icon: (
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
            style={{ backgroundColor: t.hex }}
          />
        ),
        badge: isActive ? (
          <span className="text-[10px] text-[var(--color-accent,#38BDF8)] font-mono">
            ACTIVE
          </span>
        ) : undefined,
        action: () => {
          onSelectTheme?.(t.id);
          onClose();
        },
      });
    });

    // 3. System Actions
    list.push({
      id: "action-settings",
      category: "Actions",
      title: "Open Session Settings & Remote Pairing",
      subtitle: "Configure auth key, public tunnel and MCP bridge",
      icon: <Settings className="w-4 h-4 text-neutral-400 shrink-0" />,
      action: () => {
        onOpenSettings?.();
        onClose();
      },
    });

    if (onDisconnectTunnel) {
      list.push({
        id: "action-tunnel",
        category: "Actions",
        title: isTunnelActive ? "Disconnect Public Tunnel" : "Public Tunnel Status",
        subtitle: isTunnelActive ? "Close live localtunnel endpoint" : "Tunnel is currently disabled",
        icon: isTunnelActive ? (
          <RadioOff className="w-4 h-4 text-rose-400 shrink-0" />
        ) : (
          <Radio className="w-4 h-4 text-neutral-400 shrink-0" />
        ),
        action: () => {
          if (isTunnelActive) onDisconnectTunnel();
          onClose();
        },
      });
    }

    return list;
  }, [
    pendingDiffs,
    themes,
    activeThemeId,
    isTunnelActive,
    onSelectDiff,
    onSelectTheme,
    onOpenSettings,
    onDisconnectTunnel,
    onClose,
  ]);

  // Filter based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.subtitle?.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower)
    );
  }, [items, query]);

  // Reset selected index if list length shrinks
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(0);
    }
  }, [filteredItems.length, selectedIndex]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="relative w-full max-w-xl rounded-2xl border border-[var(--color-accent,#38BDF8)]/40 bg-[#0a0a0f]/95 p-2 shadow-2xl shadow-[var(--color-accent,#38BDF8)]/10 backdrop-blur-2xl font-mono overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-3 py-2.5 border-b border-white/10">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command, file, or theme..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-neutral-400 bg-white/5 border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-1 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No matching commands found.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors",
                        isSelected
                          ? "bg-white/[0.08] text-white"
                          : "text-neutral-400 hover:text-neutral-200"
                      )}
                      style={
                        isSelected
                          ? {
                              borderLeft: "3px solid var(--color-accent, #38BDF8)",
                            }
                          : {
                              borderLeft: "3px solid transparent",
                            }
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon}
                        <div className="truncate">
                          <span className="font-medium text-white truncate block">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="text-[10px] text-neutral-500 truncate block">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge}
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-[var(--color-accent,#38BDF8)]" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Shortcuts Footer */}
            <div className="px-3 py-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CommandIcon className="w-3 h-3 text-[var(--color-accent,#38BDF8)]" />
                <span>Graviton Spotlight</span>
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">↑↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-[9px]">↵</kbd>
                  <span>select</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CommandPalette;
