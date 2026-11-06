"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCockpitStore } from "@/lib/cockpit-store";
import { useAccentTheme } from "@/components/theme-provider";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { ShareSessionModal } from "@/components/ShareSessionModal";
import {
  Orbit as OrbitIcon,
  GitBranch,
  Radio,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Share2,
  Globe,
  Lock,
  Command,
} from "lucide-react";

export function TopBar() {
  const { currentAccent } = useAccentTheme();
  const {
    pendingDiffs,
    mcpSessions,
    gitBranch,
    isConnected,
    publicTunnelUrl,
    authToken,
    serverUrl,
    isShareModalOpen,
    setIsShareModalOpen,
  } = useCockpitStore();

  const pendingCount = pendingDiffs.filter((d) => d.status === "pending").length;
  const activeSessionsCount = mcpSessions.filter((s) => s.status === "active").length;

  // Format active endpoint for display
  const displayHost = publicTunnelUrl
    ? publicTunnelUrl.replace(/^https?:\/\//, "")
    : serverUrl.replace(/^wss?:\/\//, "");

  return (
    <>
      <header className="h-14 border-b border-white/10 bg-[#07070a]/95 backdrop-blur-md px-4 flex items-center justify-between select-none z-30">
        {/* Left: Brand + Cockpit identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
            title="Back to Graviton Home"
          >
            <div className="w-7 h-7 rounded-lg border border-white/15 bg-white/4 flex items-center justify-center transition-colors group-hover:border-white/30">
              <OrbitIcon
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                style={{ color: currentAccent.hex }}
              />
            </div>
            <span className="font-sans font-black text-white text-sm tracking-tight hidden sm:inline">
              Graviton
            </span>
          </Link>

          <span className="text-neutral-600">/</span>

          {/* Repository identifier */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/3 border border-white/5 text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-200 font-medium">context-code</span>
            <span className="text-neutral-500">({gitBranch})</span>
          </div>
        </div>

        {/* Center: Live Socket & Tunnel Telemetry */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/60">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
              }`}
            />
            {publicTunnelUrl ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Globe className="w-3 h-3" />
                <span>tunnel:</span>
              </span>
            ) : (
              <span className="text-neutral-300">socket:</span>
            )}
            <span className="text-white font-semibold">{displayHost}</span>
            <span
              className="text-[10px]"
              style={{ color: isConnected ? "#34d399" : "#71717a" }}
            >
              {isConnected ? "LIVE" : "STANDBY"}
            </span>
            {authToken && (
              <span className="text-[10px] text-amber-400/90 flex items-center gap-0.5 ml-1">
                <Lock className="w-2.5 h-2.5" />
                <span>AUTH</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400">
            <Cpu className="w-3.5 h-3.5 text-neutral-400" />
            <span>{activeSessionsCount} MCP Agents Active</span>
          </div>
        </div>

        {/* Right: Notification pills, Share Session & Theme customizer */}
        <div className="flex items-center gap-2.5">
          {/* Share Session / Remote Bridge Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/4 hover:bg-white/8 text-xs font-mono text-neutral-200 hover:text-white transition-all group cursor-pointer"
            title="Share Session & Remote Access"
          >
            <Share2
              className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
              style={{ color: currentAccent.hex }}
            />
            <span className="hidden sm:inline font-medium">Share Session</span>
            {publicTunnelUrl && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          {pendingCount > 0 ? (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border"
              style={{
                backgroundColor: `rgba(${currentAccent.rgb}, 0.12)`,
                borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                color: currentAccent.hex,
              }}
            >
              <Radio className="w-3 h-3 animate-pulse" />
              <span>
                {pendingCount} Pending Intercept{pendingCount > 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>All Clear</span>
            </div>
          )}

          {/* Command Palette Trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("graviton:open-palette"))}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <kbd className="text-[10px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-neutral-300">
              ⌘K
            </kbd>
          </button>

          {/* Dynamic Theme Customizer Drawer */}
          <ThemeCustomizer />

          {/* Marketing Site External Link */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8 text-neutral-400 hover:text-white transition-colors"
            title="Open Graviton Marketing Site"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Share Session & Remote Bridge Modal */}
      <ShareSessionModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
