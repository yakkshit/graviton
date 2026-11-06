"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAccentTheme } from "@/components/theme-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { GithubIcon } from "@/components/icons";
import {
  ArrowRight,
  Check,
  Copy,
  Terminal,
  ShieldAlert,
  GitBranch,
  Cpu,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
} from "lucide-react";

export function Hero() {
  const { currentAccent } = useAccentTheme();
  const [copied, setCopied] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText("bunx @yakkshit/graviton@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center overflow-hidden bg-cockpit-grid">
      {/* Dynamic ambient radial lighting matching current accent */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-180 h-130 rounded-full blur-[170px] pointer-events-none transition-all duration-700 opacity-25"
        style={{ backgroundColor: currentAccent.hex }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center space-y-8">
        {/* Release Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-md text-xs font-mono"
        >
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: currentAccent.hex }}
          />
          <span className="text-neutral-300 font-medium">Graviton v1.0.0 Now Available</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Self-Hosted Multi-Model Cockpit</span>
        </motion.div>

        {/* Massive H1 with Staggered Reveal */}
        <div className="space-y-3 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05]"
          >
            Your code is the center.
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]"
          >
            <span
              className="accent-gradient-text transition-all duration-300"
              style={{
                textShadow: `0 0 45px rgba(${currentAccent.rgb}, 0.5)`,
              }}
            >
              AI orbits it.
            </span>
          </motion.h1>
        </div>

        {/* Monospace Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="font-mono text-sm sm:text-base lg:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          The self-hosted, multi-model AI coding cockpit. Watch, approve, block,
          and roll back every change in real time.
        </motion.p>

        {/* CTAs & Quick Install Command */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md"
        >
          {/* Primary Magnetic Button */}
          <Magnetic intensity={0.3} range={75}>
            <a
              href="#gravity-loop"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm text-white flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: currentAccent.hex,
                boxShadow: `0 0 35px -5px rgba(${currentAccent.rgb}, 0.6)`,
              }}
            >
              <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
              <span className="font-semibold tracking-wide">Launch Cockpit</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>

          {/* Secondary GitHub Button */}
          <Magnetic intensity={0.2} range={60}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm text-neutral-300 border border-white/10 bg-white/3 hover:bg-white/8 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </Magnetic>
        </motion.div>

        {/* Fast CLI Copy Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="pt-2"
        >
          <div
            onClick={handleCopyInstall}
            className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-[#08080a] text-xs font-mono text-neutral-400 hover:border-white/25 hover:text-neutral-200 cursor-pointer transition-all shadow-inner"
          >
            <Terminal className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
            <span>bunx @yakkshit/graviton@latest</span>
            <button
              type="button"
              className="p-1 rounded text-neutral-500 group-hover:text-neutral-300 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* 3D Tilted Interactive WebUI Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full pt-10"
        >
          <HeroMockup />
        </motion.div>
      </div>
    </section>
  );
}

/**
 * 3D Tilted Interactive Graviton WebUI Mockup
 */
function HeroMockup() {
  const { currentAccent } = useAccentTheme();
  const [activeTab, setActiveTab] = useState<"diff" | "graph" | "audit">("diff");
  const [status, setStatus] = useState<"intercepted" | "approved" | "blocked">(
    "intercepted"
  );

  return (
    <div className="relative mx-auto max-w-5xl perspective-[2000px]">
      {/* Outer ambient glow reacting to accent */}
      <div
        className="absolute -inset-2 rounded-3xl blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${currentAccent.hex}, transparent 70%)`,
        }}
      />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          scale: 1.03,
          rotateX: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        }}
        style={{
          transform: "rotateX(8deg)",
          transformStyle: "preserve-3d",
          boxShadow: `0 0 80px rgba(${currentAccent.rgb}, 0.3)`,
        }}
        className="relative rounded-2xl border border-white/15 bg-[#09090c]/90 backdrop-blur-2xl overflow-hidden transition-all duration-500 will-change-transform"
      >
        {/* Title Bar */}
        <div className="px-4 py-3 border-b border-white/10 bg-[#0d0d12]/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
            <span className="ml-3 font-mono text-xs text-neutral-400 hidden sm:inline">
              graviton-cockpit // session-id: ctx-9482-mcphub
            </span>
          </div>

          {/* Model telemetry indicators */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentAccent.hex }}
              />
              <span className="text-[11px] text-neutral-400">MODELS:</span>
              <span className="text-[11px] font-semibold text-white">
                Claude 3.7 + Gemini 2.5
              </span>
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-neutral-400 hidden md:inline">
              AST REWRITE INTERCEPT
            </span>
          </div>
        </div>

        {/* Cockpit Body (3 Panes: Tree, Editor Diff, Action Control) */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-105 text-left font-mono">
          {/* Pane 1: File Architecture Tree (3 cols) */}
          <div className="hidden md:flex md:col-span-3 border-r border-white/10 bg-[#07070a]/60 p-4 flex-col justify-between">
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Target Repository</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="p-1.5 rounded bg-white/4 text-white flex items-center gap-2">
                  <span className="text-neutral-500">📁</span>
                  <span>src/orchestrator</span>
                </div>
                <div
                  className="p-1.5 rounded flex items-center justify-between text-xs transition-colors"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.1)`,
                    color: currentAccent.hex,
                    borderLeft: `2px solid ${currentAccent.hex}`,
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>📄</span>
                    <span className="truncate">executor.ts</span>
                  </div>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                    DIFF
                  </span>
                </div>
                <div className="p-1.5 rounded text-neutral-400 hover:text-white flex items-center gap-2">
                  <span className="text-neutral-500">📄</span>
                  <span>mcp-gateway.ts</span>
                </div>
                <div className="p-1.5 rounded text-neutral-400 hover:text-white flex items-center gap-2">
                  <span className="text-neutral-500">📄</span>
                  <span>memory-vault.ts</span>
                </div>
              </div>
            </div>

            {/* Tree Footer / Health */}
            <div className="p-2.5 rounded-lg border border-white/5 bg-white/2 text-[11px] text-neutral-400 space-y-1">
              <div className="flex justify-between">
                <span>Git Status:</span>
                <span className="text-emerald-400 font-semibold">● CLEAN_SYNC</span>
              </div>
              <div className="flex justify-between">
                <span>AST Graph:</span>
                <span className="text-neutral-300">4,120 Nodes</span>
              </div>
            </div>
          </div>

          {/* Pane 2: Live Code Diff Interceptor (6 cols) */}
          <div className="col-span-1 md:col-span-6 bg-[#0a0a0e] p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">src/orchestrator/</span>
                  <span className="text-white font-semibold">executor.ts</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Intercepted Live Edit</span>
                </span>
              </div>

              {/* Diff Code Lines */}
              <div className="space-y-1 text-[11px] leading-relaxed select-none">
                <div className="text-neutral-500">// Intercepted change from Claude 3.7 Sonnet via MCP</div>
                <div className="text-neutral-400">
                  <span className="text-neutral-600 mr-2">41</span>
                  <span>export async function executePlan(plan: ExecutionPlan) &#123;</span>
                </div>
                <div className="text-neutral-400">
                  <span className="text-neutral-600 mr-2">42</span>
                  <span className="pl-4">const sandbox = await initSandbox();</span>
                </div>
                {/* Removed Unsafe Code */}
                <div className="p-1 rounded bg-red-950/40 text-red-300 border-l-2 border-red-500">
                  <span className="text-red-500 mr-2">-</span>
                  <span>&nbsp;&nbsp;await dangerouslyExecSystemProcess(plan.script);</span>
                </div>
                {/* Graviton Injected Safe Code */}
                <div
                  className="p-1 rounded text-emerald-300 border-l-2"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.12)`,
                    borderLeftColor: currentAccent.hex,
                  }}
                >
                  <span className="text-emerald-400 mr-2">+</span>
                  <span>&nbsp;&nbsp;await sandbox.runIsolatedWithRollback(plan.script);</span>
                </div>
                <div className="text-neutral-400">
                  <span className="text-neutral-600 mr-2">44</span>
                  <span className="pl-4">return sandbox.telemetrySnapshot();</span>
                </div>
                <div className="text-neutral-400">
                  <span className="text-neutral-600 mr-2">45</span>
                  <span>&#125;</span>
                </div>
              </div>
            </div>

            {/* Interception banner */}
            <div
              className="mt-4 p-2.5 rounded-lg border text-xs flex items-center justify-between"
              style={{
                borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                backgroundColor: `rgba(${currentAccent.rgb}, 0.05)`,
              }}
            >
              <span className="text-neutral-300 text-[11px]">
                Policy: <strong className="text-white">Strict Sandbox Isolation</strong>
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: currentAccent.hex }}
              >
                AWAITING HUMAN APPROVAL
              </span>
            </div>
          </div>

          {/* Pane 3: Control & Action Plane (3 cols) */}
          <div className="col-span-1 md:col-span-3 bg-[#08080c]/90 p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                <span>Control Plane</span>
              </div>

              {/* Agent card */}
              <div className="p-3 rounded-lg border border-white/10 bg-white/3 space-y-1.5">
                <div className="text-[10px] text-neutral-500 uppercase">Proposing Agent</div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>Claude 3.7 Sonnet</span>
                </div>
                <div className="text-[10px] text-neutral-400">MCP Protocol: Direct Socket</div>
              </div>

              {/* Risk Level */}
              <div className="p-3 rounded-lg border border-white/10 bg-white/3 space-y-1.5">
                <div className="text-[10px] text-neutral-500 uppercase">Impact Assessment</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-medium">Risk Score</span>
                  <span className="text-xs font-bold text-amber-400">MODERATE (34)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full w-[34%]" />
                </div>
              </div>
            </div>

            {/* Human-In-The-Loop Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setStatus("approved")}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                style={{
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 20px -3px rgba(${currentAccent.rgb}, 0.5)`,
                }}
              >
                <Check className="w-3.5 h-3.5 stroke-3" />
                <span>Approve & Apply (⏎)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("blocked")}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium text-neutral-300 border border-white/10 bg-white/4 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Block Edit (Esc)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("intercepted")}
                className="w-full py-1.5 text-[11px] text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rollback Branch</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle grid reflection below the mockup */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-24 opacity-15 blur-md overflow-hidden transform-[scaleY(-1)]"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${currentAccent.rgb}, 0.6) 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

