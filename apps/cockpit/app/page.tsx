"use client";

import React, { useEffect, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { FileTree } from "@/components/FileTree";
import { DiffViewer } from "@/components/DiffViewer";
import { ActionPanel } from "@/components/ActionPanel";
import { useCockpitStore } from "@/lib/cockpit-store";
import { initGravitonWebSocket } from "@/lib/socket-client";
import { MOCK_INCOMING_DIFFS } from "@/lib/mock-engine";
import { useAccentTheme } from "@/components/theme-provider";
import { toast } from "@repo/ui/toast";
import { CommandPalette } from "@repo/ui/command-palette";
import { ShieldAlert } from "lucide-react";

export default function CockpitPage() {
  const { currentAccent, setAccentById, presets } = useAccentTheme();
  const {
    injectNewDiff,
    isConnected,
    authError,
    pendingDiffs,
    setActiveFilePath,
    publicTunnelUrl,
    setPublicTunnelUrl,
    setIsShareModalOpen,
  } = useCockpitStore();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Initialize real WebSocket client to Graviton Engine
  useEffect(() => {
    const cleanup = initGravitonWebSocket("ws://localhost:9121");
    return cleanup;
  }, []);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = () => setIsCommandPaletteOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("graviton:open-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("graviton:open-palette", handleCustomOpen);
    };
  }, []);

  // Graceful fallback mock simulator when server is not actively connected
  useEffect(() => {
    if (isConnected || authError) return; // If real backend is connected or auth failed, don't inject mocks

    let mockIndex = 0;
    const interval = setInterval(() => {
      if (mockIndex < MOCK_INCOMING_DIFFS.length) {
        const template = MOCK_INCOMING_DIFFS[mockIndex]!;
        const newDiff = {
          ...template,
          id: `diff-${Date.now()}`,
          timestamp: "Just now",
        };
        injectNewDiff(newDiff);
        toast.diff(newDiff.model, newDiff.filePath);
        mockIndex++;
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [injectNewDiff, isConnected, authError]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#050508] text-white">
      {/* Top Header */}
      <TopBar />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        pendingDiffs={pendingDiffs.map((d) => ({
          id: d.id,
          filePath: d.filePath,
          model: d.model,
          riskLevel: d.riskLevel,
        }))}
        onSelectDiff={(path) => setActiveFilePath(path)}
        themes={presets.map((p) => ({
          id: p.id,
          name: p.name,
          hex: p.hex,
        }))}
        activeThemeId={currentAccent.id}
        onSelectTheme={(id) => {
          setAccentById(id);
          const matched = presets.find((p) => p.id === id);
          if (matched) {
            toast.success("Theme accent switched", matched.name);
          }
        }}
        onOpenSettings={() => setIsShareModalOpen(true)}
        isTunnelActive={Boolean(publicTunnelUrl)}
        onDisconnectTunnel={() => {
          setPublicTunnelUrl(null);
          toast.info("Public tunnel disconnected");
        }}
      />

      {/* Auth Error Banner if rejected by Graviton Core */}
      {authError && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-rose-300 z-20">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Access Denied:</strong> {authError} Click{" "}
              <strong
                className="text-white underline cursor-pointer"
                onClick={() => setIsShareModalOpen(true)}
              >
                Share Session
              </strong>{" "}
              in the top bar to update your key.
            </span>
          </div>
        </div>
      )}

      {/* 3-Column Native Cockpit App Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Repository File Tree & MCP Filters */}
        <div className="w-64 sm:w-72 md:w-80 shrink-0 h-full">
          <FileTree />
        </div>

        {/* Center: Live Unified Diff Viewer */}
        <main className="flex-1 h-full min-w-0">
          <DiffViewer />
        </main>

        {/* Right: Human-In-The-Loop Action Center */}
        <div className="w-72 sm:w-80 md:w-96 shrink-0 h-full">
          <ActionPanel />
        </div>
      </div>
    </div>
  );
}
