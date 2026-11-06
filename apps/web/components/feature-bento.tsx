"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAccentTheme } from "@/components/theme-provider";
import {
  ClaudeIcon,
  GeminiIcon,
  OpenAIIcon,
  OllamaIcon,
  MCPIcon,
} from "@/components/icons";
import {
  Activity,
  GitBranch,
  ShieldCheck,
  Terminal,
  Cpu,
  RotateCcw,
  Sparkles,
  Radio,
  FileCode,
  Check,
} from "lucide-react";

export function FeatureBento() {
  const { currentAccent } = useAccentTheme();

  return (
    <section id="features" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      {/* Background Grid & Lighting */}
      <div className="absolute inset-0 bg-cockpit-grid opacity-30 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ backgroundColor: currentAccent.hex }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-neutral-300">
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
            <span>FEATURES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Everything you need to <br />
            <span
              className="accent-gradient-text"
              style={{
                textShadow: `0 0 35px rgba(${currentAccent.rgb}, 0.35)`,
              }}
            >
              control AI chaos.
            </span>
          </h2>
          <p className="font-mono text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Architected for enterprise velocity and zero hallucination risk.
            A battle-tested cockpit for human-guided multi-model engineering.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ============================================================= */}
          {/* CARD 1 (Large - col-span-2, row-span-2): Multi-Model Hub      */}
          {/* ============================================================= */}
          <motion.div
            whileHover={{ scale: 1.015, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:col-span-2 md:row-span-2 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/30"
            style={{
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top hover accent glow */}
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: currentAccent.hex }}
            />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" style={{ color: currentAccent.hex }} />
                  <span>ORCHESTRATION</span>
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border"
                  style={{
                    color: currentAccent.hex,
                    borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.1)`,
                  }}
                >
                  4 ACTIVE PROVIDERS
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Multi-Model Orchestration
              </h3>
              <p className="text-sm font-mono text-neutral-400 max-w-xl leading-relaxed">
                Connect unlimited AI models via MCP. Each gets isolated
                sandboxes, separate context windows, and model-specific allowlists
                so Claude, Gemini, GPT, and local Ollama instances never collide.
              </p>
            </div>

            {/* Visual Animated Flow Diagram */}
            <div className="my-8 py-6 px-4 rounded-xl border border-white/10 bg-[#09090d]/80 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                {/* 4 Source Model Nodes */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-auto">
                  {/* Claude */}
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3 text-xs font-mono">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <ClaudeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Claude 3.7</div>
                      <div className="text-[10px] text-neutral-500">AST Refactoring</div>
                    </div>
                  </div>

                  {/* Gemini */}
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3 text-xs font-mono">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <GeminiIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Gemini 2.5</div>
                      <div className="text-[10px] text-neutral-500">Long-Context Audit</div>
                    </div>
                  </div>

                  {/* GPT-4o */}
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3 text-xs font-mono">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <OpenAIIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">GPT-4o</div>
                      <div className="text-[10px] text-neutral-500">Fast Tests & Docs</div>
                    </div>
                  </div>

                  {/* Ollama */}
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.04] flex items-center gap-3 text-xs font-mono">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <OllamaIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Ollama Local</div>
                      <div className="text-[10px] text-neutral-500">Offline & Airgapped</div>
                    </div>
                  </div>
                </div>

                {/* Animated Central Converging Conduit */}
                <div className="hidden md:flex flex-col items-center justify-center w-36 relative">
                  <div className="w-full h-0.5 bg-gradient-to-r from-white/20 via-white/50 to-white/20 relative">
                    <motion.div
                      animate={{ x: [-50, 70] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: currentAccent.hex,
                        boxShadow: `0 0 10px ${currentAccent.hex}`,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 mt-2">
                    ISOLATED PIPES
                  </span>
                </div>

                {/* Destination: Central Graviton Cockpit Core */}
                <div
                  className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-2xl relative"
                  style={{
                    backgroundColor: "#08080c",
                    borderColor: currentAccent.hex,
                    boxShadow: `0 0 35px rgba(${currentAccent.rgb}, 0.35)`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center text-white"
                    style={{ backgroundColor: currentAccent.hex }}
                  >
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="font-bold text-white text-sm font-mono">GRAVITON COCKPIT</div>
                  <div className="text-[10px] text-neutral-400 font-mono">Unified Control Plane</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                    <span>● ZERO DRIFT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated sandboxes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strict model quotas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero context bleed</span>
              </div>
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* CARD 2 (Medium - col-span-1): Real-time WebUI Monitor        */}
          {/* ============================================================= */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-white/30"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Radio className="w-4 h-4" style={{ color: currentAccent.hex }} />
                  <span>MONITORING</span>
                </span>
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                    color: currentAccent.hex,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: currentAccent.hex }}
                  />
                  LIVE FEED
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-1.5">
                Real-Time WebUI
              </h3>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                Watch every AI edit as it happens. Block, approve, or modify
                changes in real time before they touch your local git index.
              </p>
            </div>

            {/* Mock Mini File Monitor */}
            <div className="p-3 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-white/5 pb-1.5">
                <span>FILE EVENT STREAM</span>
                <span className="text-emerald-400">SYNCED</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-1 rounded bg-white/[0.04]">
                  <div className="flex items-center gap-2 truncate text-neutral-300">
                    <FileCode className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">src/auth/jwt.ts</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    MODIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded text-neutral-400">
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="truncate">api/v1/routes.ts</span>
                  </div>
                  <span className="text-[9px] text-neutral-500">IDLE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* CARD 3 (Medium - col-span-1): Git-Native Rollbacks            */}
          {/* ============================================================= */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-white/30"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>VERSION CONTROL</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-500">
                  ATOMIC_COMMITS
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-1.5">
                Git-Native Rollbacks
              </h3>
              <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                Every AI decision is an atomic commit. Revert unwanted edits
                instantly with cryptographic precision and zero detached HEAD nightmares.
              </p>
            </div>

            {/* Visual Diff Snippet with Revert Button */}
            <div className="p-3 rounded-xl border border-white/10 bg-[#09090d] font-mono text-xs space-y-2">
              <div className="text-[10px] text-neutral-500">// Instant revert buffer</div>
              <div className="p-1 rounded bg-red-950/30 text-red-300 text-[10px] truncate border-l border-red-500">
                - eval(untrustedAiPromptString);
              </div>
              <div className="p-1 rounded bg-emerald-950/30 text-emerald-300 text-[10px] truncate border-l border-emerald-500">
                + sanitizedExecutor.safeRun();
              </div>
              <button
                type="button"
                className="w-full mt-2 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                style={{
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 15px rgba(${currentAccent.rgb}, 0.35)`,
                }}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert Commit 7b8f2c</span>
              </button>
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* CARD 4 (Small - col-span-1 md:col-span-3 lg:col-span-1): MCP  */}
          {/* ============================================================= */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:col-span-3 lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 flex flex-col justify-between group hover:border-white/30"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>STANDARDS</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-neutral-300">
                  PROTOCOL V1
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: `rgba(${currentAccent.rgb}, 0.2)` }}
                >
                  <MCPIcon className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  MCP Native
                </h3>
              </div>

              <p className="text-xs font-mono text-neutral-400 leading-relaxed mb-4">
                Zero proprietary lock-in. Seamless integration with Cursor,
                Claude Desktop, VS Code, and any Model Context Protocol agent.
              </p>
            </div>

            {/* Terminal Snippet */}
            <div className="p-3 rounded-xl border border-white/10 bg-black/80 font-mono text-xs space-y-1 text-neutral-300">
              <div className="text-[10px] text-neutral-500">$ Terminal</div>
              <div className="text-emerald-400 text-[11px] font-bold">
                graviton start --port 9120
              </div>
              <div className="text-[10px] text-neutral-400">
                ✓ MCP Socket: ready on ws://127.0.0.1:9120
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

