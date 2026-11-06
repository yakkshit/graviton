"use client";

import React, { useState } from "react";
import { useCockpitStore } from "@/lib/cockpit-store";
import { useAccentTheme } from "@/components/theme-provider";
import { sendDecisionToGraviton } from "@/lib/socket-client";
import { AnimatedNumber } from "@repo/ui/animated-number";
import { toast } from "@repo/ui/toast";
import {
  ClaudeIcon,
  GeminiIcon,
  OpenAIIcon,
  OllamaIcon,
} from "@/components/icons";
import {
  Check,
  X,
  RotateCcw,
  Cpu,
  Play,
  Pause,
  Sliders,
  Flame,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";

export function ActionPanel() {
  const { currentAccent } = useAccentTheme();
  const {
    activeFilePath,
    pendingDiffs,
    approveDiff,
    blockDiff,
    rollbackDiff,
    mcpSessions,
    toggleSession,
    setActiveFilePath,
  } = useCockpitStore();

  const [showAffectedFiles, setShowAffectedFiles] = useState(true);

  const currentDiff = pendingDiffs.find((d) => d.filePath === activeFilePath);

  const handleApprove = (id: string) => {
    approveDiff(id);
    sendDecisionToGraviton(id, "approved");
    toast.approved(currentDiff?.filePath);
  };

  const handleBlock = (id: string) => {
    blockDiff(id);
    sendDecisionToGraviton(id, "blocked");
    toast.error("Diff blocked & discarded 🛡️", currentDiff?.filePath);
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case "claude":
        return <ClaudeIcon className="w-4 h-4 text-amber-400" />;
      case "gemini":
        return <GeminiIcon className="w-4 h-4 text-blue-400" />;
      case "gpt":
        return <OpenAIIcon className="w-4 h-4 text-emerald-400" />;
      case "ollama":
        return <OllamaIcon className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getRiskColors = (risk: string) => {
    switch (risk) {
      case "CRITICAL":
        return {
          text: "text-red-400",
          bg: "bg-red-500",
          border: "border-red-500/30",
          badgeBg: "bg-red-500/15",
          pulse: true,
        };
      case "HIGH":
        return {
          text: "text-orange-400",
          bg: "bg-orange-500",
          border: "border-orange-500/30",
          badgeBg: "bg-orange-500/15",
          pulse: false,
        };
      case "MODERATE":
        return {
          text: "text-amber-400",
          bg: "bg-amber-400",
          border: "border-amber-500/30",
          badgeBg: "bg-amber-500/15",
          pulse: false,
        };
      default:
        return {
          text: "text-emerald-400",
          bg: "bg-emerald-400",
          border: "border-emerald-500/30",
          badgeBg: "bg-emerald-500/15",
          pulse: false,
        };
    }
  };

  return (
    <aside className="w-full h-full flex flex-col justify-between bg-[#08080c]/90 border-l border-white/10 p-4 font-mono select-none overflow-y-auto">
      <div className="space-y-5">
        {/* Section Title */}
        <div className="flex items-center justify-between text-xs uppercase text-neutral-400 font-semibold tracking-wider">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
            <span>Human Control Plane</span>
          </span>
          <span className="text-[10px] text-neutral-600">RULE_ENFORCER</span>
        </div>

        {currentDiff ? (
          <div className="space-y-4">
            {/* Status & Model Box */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-[#0d0d12] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 uppercase text-[10px]">
                  Proposing Agent
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor:
                      currentDiff.status === "pending"
                        ? `rgba(${currentAccent.rgb}, 0.15)`
                        : currentDiff.status === "approved"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(239, 68, 68, 0.15)",
                    color:
                      currentDiff.status === "pending"
                        ? currentAccent.hex
                        : currentDiff.status === "approved"
                        ? "#34d399"
                        : "#f87171",
                  }}
                >
                  {currentDiff.status}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center">
                  {getModelIcon(currentDiff.modelType)}
                </div>
                <div>
                  <div className="font-bold text-white text-xs">
                    {currentDiff.model}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {currentDiff.action}
                  </div>
                </div>
              </div>
            </div>

            {/* Real Blast Radius & AST Impact Assessment Gauge */}
            {(() => {
              const colors = getRiskColors(currentDiff.riskLevel);
              const filesCount = currentDiff.impactScore ?? 0;
              return (
                <div className="p-3.5 rounded-xl border border-white/10 bg-[#0d0d12] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 uppercase text-[10px] flex items-center gap-1 font-semibold">
                      <Flame className={`w-3.5 h-3.5 ${colors.text} ${colors.pulse ? "animate-pulse" : ""}`} />
                      <span>AST Blast Radius</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors.text} ${colors.badgeBg} ${colors.border} ${
                        colors.pulse ? "animate-pulse" : ""
                      }`}
                    >
                      {currentDiff.riskLevel}
                    </span>
                  </div>

                  {/* Impact summary line with animated stat counter */}
                  <div className="text-xs text-white font-semibold flex items-center gap-1.5">
                    {filesCount === 0 ? (
                      <span>No dependent files affected</span>
                    ) : (
                      <>
                        <AnimatedNumber
                          value={filesCount}
                          className="text-white font-bold text-sm"
                        />
                        <span>dependent file{filesCount === 1 ? "" : "s"} affected</span>
                      </>
                    )}
                  </div>

                  {/* Dynamic Progress Bar mapped to blast radius */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors.bg} ${colors.pulse ? "animate-pulse" : ""}`}
                      style={{
                        width: `${Math.min(Math.max((filesCount / 20) * 100, 10), 100)}%`,
                      }}
                    />
                  </div>

                  {/* Expandable list of affected files */}
                  {currentDiff.affectedFiles && currentDiff.affectedFiles.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setShowAffectedFiles(!showAffectedFiles)}
                        className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>Dependent Downstream Files ({currentDiff.affectedFiles.length})</span>
                        {showAffectedFiles ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {showAffectedFiles && (
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                          {currentDiff.affectedFiles.map((file) => (
                            <div
                              key={file}
                              onClick={() => setActiveFilePath(file)}
                              className="px-2 py-1 rounded bg-white/3 hover:bg-white/[0.07] text-[10px] text-neutral-300 flex items-center gap-1.5 cursor-pointer truncate transition-colors"
                              title={file}
                            >
                              <FileCode className="w-3 h-3 text-neutral-500 shrink-0" />
                              <span className="truncate">{file}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Decision Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleApprove(currentDiff.id)}
                disabled={currentDiff.status === "approved"}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  currentDiff.status === "approved"
                    ? "opacity-50 cursor-not-allowed bg-emerald-600"
                    : ""
                }`}
                style={
                  currentDiff.status !== "approved"
                    ? {
                        backgroundColor: currentAccent.hex,
                        boxShadow: `0 0 25px rgba(${currentAccent.rgb}, 0.45)`,
                      }
                    : {}
                }
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {currentDiff.status === "approved"
                    ? "Approved & Committed"
                    : "Approve & Apply (⏎)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleBlock(currentDiff.id)}
                disabled={currentDiff.status === "blocked"}
                className={`w-full py-2 px-4 rounded-xl text-xs font-semibold text-neutral-300 border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 hover:text-red-300 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  currentDiff.status === "blocked" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <X className="w-4 h-4 text-red-400" />
                <span>
                  {currentDiff.status === "blocked"
                    ? "Blocked & Discarded"
                    : "Block & Revert (Esc)"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  rollbackDiff(currentDiff.id);
                  toast.rollback(currentDiff.filePath);
                }}
                className="w-full py-1.5 text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Instant Rollback State</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-white/5 bg-white/2 text-xs text-neutral-500 text-center">
            Select a file with active diffs to review proposals.
          </div>
        )}

        {/* MCP Connected Sessions Box */}
        <div className="space-y-2.5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] uppercase text-neutral-400 font-semibold tracking-wider">
            <span>MCP Agent Hub</span>
            <span className="text-[10px] text-neutral-500">Sockets</span>
          </div>

          <div className="space-y-1.5">
            {mcpSessions.map((session) => {
              const isActive = session.status === "active";
              return (
                <div
                  key={session.id}
                  className="p-2.5 rounded-xl border border-white/5 bg-[#09090d] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    {getModelIcon(session.modelType)}
                    <div className="truncate">
                      <div className="text-white font-medium text-[11px] truncate">
                        {session.name}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {session.latencyMs}ms • {session.requestsCount} calls
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSession(session.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isActive
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "border-white/10 text-neutral-500 hover:text-neutral-300"
                    }`}
                    title={isActive ? "Pause Session" : "Resume Session"}
                  >
                    {isActive ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety Policy Status */}
      <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>Security Sandbox:</span>
          <span className="text-emerald-400">ENFORCED</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Zero-Trust Socket:</span>
          <span className="text-white">Active</span>
        </div>
      </div>
    </aside>
  );
}
