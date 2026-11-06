"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAccentTheme } from "@/components/theme-provider";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  Sparkles,
  RotateCcw,
  Sliders,
} from "lucide-react";

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const {
    currentAccent,
    setAccentById,
    presets,
  } = useAccentTheme();

  return (
    <Sheet>
      <SheetTrigger
        type="button"
        aria-label="Open Theme Customizer"
        className="relative group p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-200 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer"
      >
        <Palette className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-black"
          style={{ backgroundColor: currentAccent.hex }}
        />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#0a0a0c]/95 border-l border-white/10 backdrop-blur-2xl text-white p-6 overflow-y-auto"
      >
        <SheetHeader className="space-y-1.5 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: currentAccent.hex,
                boxShadow: `0 0 14px ${currentAccent.hex}`,
              }}
            />
            <SheetTitle className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Cockpit Appearance
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs font-mono text-neutral-400">
            Real-time theme engine & multi-frequency accent synthesizer
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-7">
          {/* Accent Color Swatches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                <span>Telemetry Accent Color</span>
              </label>
              <span className="font-mono text-xs text-neutral-400">
                {currentAccent.hex}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {presets.map((preset) => {
                const isSelected = currentAccent.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setAccentById(preset.id)}
                    className={`group relative flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-white/30 bg-white/[0.06] shadow-sm"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                        style={{
                          backgroundColor: preset.hex,
                          boxShadow: isSelected
                            ? `0 0 16px ${preset.hex}`
                            : "none",
                        }}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {preset.name}
                          {isSelected && (
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 line-clamp-1">
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Mode Switcher */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Interface Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("dark")}
                className={`border text-xs flex items-center gap-1.5 cursor-pointer ${
                  theme === "dark"
                    ? "border-white/40 bg-white/[0.1] text-white"
                    : "border-white/10 bg-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("light")}
                className={`border text-xs flex items-center gap-1.5 cursor-pointer ${
                  theme === "light"
                    ? "border-white/40 bg-white/[0.1] text-white"
                    : "border-white/10 bg-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme("system")}
                className={`border text-xs flex items-center gap-1.5 cursor-pointer ${
                  theme === "system"
                    ? "border-white/40 bg-white/[0.1] text-white"
                    : "border-white/10 bg-transparent text-neutral-400 hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>System</span>
              </Button>
            </div>
          </div>

          {/* Live Preview Widget */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Real-Time Component Preview</span>
            </label>
            <div className="p-4 rounded-xl border border-white/10 bg-black/60 relative overflow-hidden">
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
                style={{ backgroundColor: currentAccent.hex }}
              />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">graviton.cockpit // status</span>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                      color: currentAccent.hex,
                      border: `1px solid rgba(${currentAccent.rgb}, 0.3)`,
                    }}
                  >
                    ● SYNCHRONIZED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all shadow-md cursor-pointer"
                    style={{
                      backgroundColor: currentAccent.hex,
                      boxShadow: `0 0 16px rgba(${currentAccent.rgb}, 0.45)`,
                    }}
                  >
                    Approve Diff
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08]"
                  >
                    Rollback
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAccentById("blue");
                setTheme("dark");
              }}
              className="w-full text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1.5 border border-white/5 hover:border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Graviton Defaults</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
