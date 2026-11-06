"use client";

import React, { useState, useEffect } from "react";
import { useCockpitStore } from "@/lib/cockpit-store";
import { useAccentTheme } from "@/components/theme-provider";
import { DiffViewerSkeleton } from "@repo/ui/skeleton";
import {
  FileCode,
  Copy,
  Check,
  Columns,
  List,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Clock,
} from "lucide-react";

export function DiffViewer() {
  const { currentAccent } = useAccentTheme();
  const { activeFilePath, pendingDiffs, isConnected } = useCockpitStore();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"unified" | "split">("unified");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentDiff = pendingDiffs.find((d) => d.filePath === activeFilePath);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(activeFilePath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isInitializing && !isConnected) {
    return <DiffViewerSkeleton lines={14} />;
  }

  if (!currentDiff) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#050508] text-neutral-500 font-mono select-none">
        <FileCode className="w-12 h-12 stroke-[1.2] mb-3 text-neutral-600" />
        <div className="text-sm text-neutral-300 font-bold mb-1">
          {activeFilePath}
        </div>
        <p className="text-xs text-neutral-500 max-w-sm">
          No pending AI diffs for this file. The local AST and git index are
          clean and synchronized.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#050508] select-none font-mono">
      {/* Diff Top Bar */}
      <div className="h-12 border-b border-white/10 bg-[#09090d]/80 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <FileCode className="w-4 h-4 text-neutral-400" />
          <span className="font-semibold text-white">{currentDiff.filePath}</span>
          <button
            type="button"
            onClick={handleCopyPath}
            className="p-1 rounded text-neutral-500 hover:text-white transition-colors"
            title="Copy path"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* View Mode & Model Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/10 bg-white/3 text-neutral-400 text-[11px]">
            <Sparkles className="w-3 h-3" style={{ color: currentAccent.hex }} />
            <span className="text-white font-medium">{currentDiff.model}</span>
          </div>

          <div className="flex items-center rounded-lg border border-white/10 bg-black/60 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("unified")}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === "unified"
                  ? "bg-white/15 text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="Unified View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`p-1 rounded text-xs transition-colors ${
                viewMode === "split"
                  ? "bg-white/15 text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="Split View"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary notification strip */}
      <div
        className="px-4 py-2 border-b text-[11px] flex items-center justify-between"
        style={{
          borderColor: `rgba(${currentAccent.rgb}, 0.2)`,
          backgroundColor: `rgba(${currentAccent.rgb}, 0.04)`,
        }}
      >
        <div className="flex items-center gap-2 truncate">
          <span
            className="font-bold uppercase tracking-wider text-[10px]"
            style={{ color: currentAccent.hex }}
          >
            INTERCEPTED PATCH:
          </span>
          <span className="text-neutral-300 truncate">{currentDiff.summary}</span>
        </div>
        <div className="flex items-center gap-1 text-neutral-500 shrink-0 text-[10px]">
          <Clock className="w-3 h-3" />
          <span>{currentDiff.timestamp}</span>
        </div>
      </div>

      {/* Code comparison editor lines */}
      <div className="flex-1 overflow-y-auto p-4 text-[12px] leading-relaxed">
        <div className="rounded-xl border border-white/10 bg-[#07070a] p-3 space-y-0.5">
          {currentDiff.diffLines.map((line, idx) => {
            if (line.type === "remove") {
              return (
                <div
                  key={idx}
                  className="flex items-center px-2 py-0.5 rounded bg-red-950/30 text-red-300 border-l-2 border-red-500"
                >
                  <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                    {line.oldLine ?? "-"}
                  </span>
                  <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                    {" "}
                  </span>
                  <span className="text-red-400 select-none mr-2 font-bold">-</span>
                  <span className="whitespace-pre truncate">{line.text}</span>
                </div>
              );
            }

            if (line.type === "add") {
              return (
                <div
                  key={idx}
                  className="flex items-center px-2 py-0.5 rounded border-l-2"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.1)`,
                    borderLeftColor: currentAccent.hex,
                    color: "#6ee7b7",
                  }}
                >
                  <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                    {" "}
                  </span>
                  <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                    {line.newLine ?? "+"}
                  </span>
                  <span
                    className="select-none mr-2 font-bold"
                    style={{ color: currentAccent.hex }}
                  >
                    +
                  </span>
                  <span className="whitespace-pre truncate">{line.text}</span>
                </div>
              );
            }

            return (
              <div
                key={idx}
                className="flex items-center px-2 py-0.5 text-neutral-400 hover:bg-white/2"
              >
                <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                  {line.oldLine}
                </span>
                <span className="w-8 text-neutral-600 text-right pr-3 select-none text-[11px]">
                  {line.newLine}
                </span>
                <span className="text-transparent select-none mr-2"> </span>
                <span className="whitespace-pre text-neutral-300 truncate">
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

