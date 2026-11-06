"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useAccentTheme } from "@/components/theme-provider";
import {
  AlertTriangle,
  GitCommit,
  GitMerge,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  Activity,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface StepData {
  number: string;
  tag: string;
  title: string;
  description: string;
  badge: string;
}

const STEPS: StepData[] = [
  {
    number: "01",
    tag: "THE CHAOS",
    title: "The bottleneck isn't generating code. It's control.",
    description:
      "When multiple AI agents touch your repository without coordination, race conditions destroy state. Hallucinations overwrite production code silently, context windows fracture, and developer velocity stalls.",
    badge: "UNCONTROLLED DRIFT",
  },
  {
    number: "02",
    tag: "THE MAP",
    title: "We map the entire architecture first.",
    description:
      "Before any model touches a single line, Orbit's high-speed AST scanner builds a complete dependency graph. Every variable, import, and call site is grounded in mathematical truth, eliminating context blindness.",
    badge: "AST GROUND TRUTH",
  },
  {
    number: "03",
    tag: "THE CONTROL",
    title: "Human-in-the-loop, by default.",
    description:
      "Every prompt-driven edit is intercepted at the MCP socket layer before hitting disk. Inspect live unified diffs, run background sandbox tests, and approve or block changes with a single keystroke.",
    badge: "REAL-TIME INTERCEPT",
  },
  {
    number: "04",
    tag: "THE CONFIDENCE",
    title: "Ship with cryptographic certainty.",
    description:
      "Git-native audit trails make every accepted AI contribution an immutable, signed commit. Revert unwanted changes instantly with atomic rollback, and deploy with complete confidence.",
    badge: "IMMUTABLE AUDIT",
  },
];

export function GravityLoop() {
  const { currentAccent } = useAccentTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Listen to scroll progress to update active step
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      // 4 steps distributed evenly across 0.0 to 1.0
      if (progress < 0.28) {
        setActiveStep(0);
      } else if (progress < 0.55) {
        setActiveStep(1);
      } else if (progress < 0.82) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const stepOffset = containerTop + (index / 3) * (containerHeight - window.innerHeight);
    window.scrollTo({ top: stepOffset, behavior: "smooth" });
  };

  return (
    <section
      id="gravity-loop"
      ref={containerRef}
      className="relative min-h-[400vh] bg-[#050505]"
    >
      {/* Sticky Content Container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden will-change-transform">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-cockpit-grid opacity-50 pointer-events-none" />

        {/* Ambient background lighting */}
        <div
          className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: currentAccent.hex }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 md:py-12">
          {/* Section Subhead */}
          <div className="mb-6 md:mb-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentAccent.hex }}
              />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                THE GRAVITY LOOP // HOW ORBIT WORKS
              </span>
            </div>
            <div className="font-mono text-xs text-neutral-500 hidden sm:block">
              PHASE {activeStep + 1} OF 4
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Column: Narrative Steps (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8">
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.number}
                    onClick={() => scrollToStep(idx)}
                    className={`group cursor-pointer transition-all duration-300 relative pl-6 border-l-2 ${
                      isActive
                        ? "opacity-100 scale-[1.01]"
                        : "opacity-35 hover:opacity-70 scale-100"
                    }`}
                    style={{
                      borderLeftColor: isActive
                        ? currentAccent.hex
                        : "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {/* Header: Step Number & Badge */}
                    <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
                      <span
                        className="font-bold tracking-wider"
                        style={{
                          color: isActive ? currentAccent.hex : "#71717a",
                        }}
                      >
                        STEP {step.number}
                      </span>
                      <span className="text-neutral-600">//</span>
                      <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                        {step.tag}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
                      {step.title}
                    </h3>

                    {/* Description - expanded when active */}
                    <p
                      className={`font-mono text-xs sm:text-sm text-neutral-400 leading-relaxed transition-all duration-300 ${
                        isActive ? "block" : "hidden sm:line-clamp-2"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Visual State Container (7 cols) */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="w-full max-w-2xl h-[420px] sm:h-[480px] md:h-[520px] rounded-2xl border border-white/10 bg-[#08080c]/80 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Visualizer Top Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                    <span className="text-neutral-400">
                      ORBIT_TELEMETRY // {STEPS[activeStep]?.tag}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border uppercase"
                    style={{
                      color: currentAccent.hex,
                      borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                      backgroundColor: `rgba(${currentAccent.rgb}, 0.1)`,
                    }}
                  >
                    {STEPS[activeStep]?.badge}
                  </span>
                </div>

                {/* Cross-Fading Step Visuals */}
                <div className="relative flex-1 my-4 overflow-hidden flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeStep === 0 && (
                      <VisualChaos key="chaos" currentAccent={currentAccent} />
                    )}
                    {activeStep === 1 && (
                      <VisualMap key="map" currentAccent={currentAccent} />
                    )}
                    {activeStep === 2 && (
                      <VisualControl key="control" currentAccent={currentAccent} />
                    )}
                    {activeStep === 3 && (
                      <VisualConfidence key="confidence" currentAccent={currentAccent} />
                    )}
                  </AnimatePresence>
                </div>

                {/* Visualizer Footer */}
                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                    <span>Live Cockpit Stream: 60 FPS</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Protocol:</span>
                    <span className="text-neutral-300">MCP-JSON-RPC-2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========================================================================= */
/* VISUALIZER 01: The Chaos (Uncoordinated AI Overwrites & Race Conditions)   */
/* ========================================================================= */
function VisualChaos({ currentAccent }: { currentAccent: { hex: string; rgb: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full flex flex-col justify-between font-mono text-xs select-none"
    >
      <div className="space-y-2.5 overflow-hidden">
        {/* Conflicting log 1 */}
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold flex items-center gap-1.5 text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ERR_RACE_CONDITION [FILE_LOCK_LOST]</span>
            </span>
            <span className="text-red-400/80">14:02:18.012</span>
          </div>
          <div className="text-[11px] text-neutral-300">
            Agent <strong className="text-white">Claude 3.7</strong> and Agent{" "}
            <strong className="text-white">GPT-4o</strong> attempted concurrent writes to{" "}
            <code className="text-red-200 bg-red-900/40 px-1 py-0.5 rounded">src/auth/session.ts</code>
          </div>
        </div>

        {/* Conflicting log 2 */}
        <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-200 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold flex items-center gap-1.5 text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DIRTY_TREE_DRIFT [UNAPPROVED WRITE]</span>
            </span>
            <span className="text-amber-400/80">14:02:19.450</span>
          </div>
          <div className="text-[11px] text-neutral-300">
            23 untracked files modified on branch <code>main</code> without AST dependency verification.
          </div>
        </div>

        {/* Terminal warning feed */}
        <div className="p-3 rounded-lg border border-white/10 bg-black/70 space-y-1 text-neutral-400 text-[11px]">
          <div className="text-red-400">✖ FATAL: Symbol 'verifyJwtSignature' deleted while in use by 8 files.</div>
          <div className="text-neutral-500">→ Breakage at api/routes/billing.ts:14:3</div>
          <div className="text-neutral-500">→ Breakage at middleware/auth-guard.ts:22:9</div>
          <div className="text-amber-300 pt-1 flex items-center gap-2">
            <span className="animate-pulse">●</span>
            <span>Result: Broken builds, degraded hallucinated patches, zero accountability.</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-lg border border-red-500/20 bg-red-500/5 text-center text-red-300 text-[11px]">
        Status: <strong className="text-red-400">CHAOTIC PARALLEL EXECUTION DETECTED</strong>
      </div>
    </motion.div>
  );
}

/* ========================================================================= */
/* VISUALIZER 02: The Map (Orbit AST Dependency Scanner & Central Core)       */
/* ========================================================================= */
function VisualMap({ currentAccent }: { currentAccent: { hex: string; rgb: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full flex flex-col justify-between items-center relative select-none font-mono"
    >
      {/* Interactive Orbiting SVG Graph */}
      <div className="relative w-full h-[280px] sm:h-[300px] flex items-center justify-center">
        {/* Orbital concentric rings */}
        <div
          className="absolute w-[260px] h-[260px] rounded-full border border-dashed opacity-25 animate-[spin_60s_linear_infinite]"
          style={{ borderColor: currentAccent.hex }}
        />
        <div className="absolute w-[180px] h-[180px] rounded-full border border-white/10" />

        {/* Center Node: ORBIT CORE */}
        <div
          className="relative z-20 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-2xl border transition-all"
          style={{
            backgroundColor: "#0d0d12",
            borderColor: currentAccent.hex,
            boxShadow: `0 0 35px rgba(${currentAccent.rgb}, 0.5)`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full mb-1 animate-ping"
            style={{ backgroundColor: currentAccent.hex }}
          />
          <span className="text-xs font-bold text-white tracking-wide">ORBIT</span>
          <span className="text-[9px] text-neutral-400">AST CORE</span>
        </div>

        {/* Satellite Node 1: MCP Socket */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 left-6 sm:left-12 p-2.5 rounded-xl border border-white/10 bg-[#0e0e14] shadow-md flex items-center gap-2 text-xs"
        >
          <Cpu className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
          <div>
            <div className="text-white font-semibold text-[11px]">MCP Gateway</div>
            <div className="text-[9px] text-neutral-400">Socket Port 9120</div>
          </div>
        </motion.div>

        {/* Satellite Node 2: AST Dependency Graph */}
        <motion.div
          animate={{ y: [4, -4, 4] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 right-6 sm:right-12 p-2.5 rounded-xl border border-white/10 bg-[#0e0e14] shadow-md flex items-center gap-2 text-xs"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <div className="text-white font-semibold text-[11px]">AST Parser</div>
            <div className="text-[9px] text-neutral-400">4,120 Symbols</div>
          </div>
        </motion.div>

        {/* Satellite Node 3: Git Branch Monitor */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-2 left-8 sm:left-14 p-2.5 rounded-xl border border-white/10 bg-[#0e0e14] shadow-md flex items-center gap-2 text-xs"
        >
          <GitMerge className="w-3.5 h-3.5 text-purple-400" />
          <div>
            <div className="text-white font-semibold text-[11px]">Git Watcher</div>
            <div className="text-[9px] text-neutral-400">Atomic Index</div>
          </div>
        </motion.div>

        {/* Satellite Node 4: Sandbox Isolator */}
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-2 right-8 sm:right-14 p-2.5 rounded-xl border border-white/10 bg-[#0e0e14] shadow-md flex items-center gap-2 text-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <div>
            <div className="text-white font-semibold text-[11px]">Sandbox Jail</div>
            <div className="text-[9px] text-neutral-400">Zero Host Leak</div>
          </div>
        </motion.div>
      </div>

      <div className="w-full p-2.5 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-between text-xs text-neutral-400">
        <span>Knowledge Graph Completeness:</span>
        <span className="font-bold text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          100% (Grounded)
        </span>
      </div>
    </motion.div>
  );
}

/* ========================================================================= */
/* VISUALIZER 03: The Control (Human-In-The-Loop Live Interception Cockpit)   */
/* ========================================================================= */
function VisualControl({ currentAccent }: { currentAccent: { hex: string; rgb: string } }) {
  const [decision, setDecision] = useState<"pending" | "blocked" | "approved">("pending");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full flex flex-col justify-between font-mono text-xs select-none"
    >
      <div className="space-y-3">
        {/* Interception header */}
        <div
          className="p-3 rounded-xl border flex items-center justify-between"
          style={{
            borderColor: `rgba(${currentAccent.rgb}, 0.35)`,
            backgroundColor: `rgba(${currentAccent.rgb}, 0.08)`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: currentAccent.hex }}
            />
            <div>
              <div className="font-bold text-white text-xs">
                PROMPT DIFF INTERCEPTED
              </div>
              <div className="text-[10px] text-neutral-400">
                Agent: Gemini 2.5 Pro via MCP Tool: <code>write_file</code>
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
            AWAITING DECISION
          </span>
        </div>

        {/* Diff preview box */}
        <div className="p-3 rounded-xl border border-white/10 bg-black/70 space-y-1.5 text-[11px]">
          <div className="text-neutral-500">// Target: lib/db/credentials.ts</div>
          <div className="p-1 rounded bg-red-950/40 text-red-300 border-l-2 border-red-500 truncate">
            <span className="text-red-400 mr-2">-</span>
            <span>const secretKey = "hardcoded-jwt-secret-xyz";</span>
          </div>
          <div
            className="p-1 rounded text-emerald-300 border-l-2 truncate"
            style={{
              backgroundColor: `rgba(${currentAccent.rgb}, 0.12)`,
              borderLeftColor: currentAccent.hex,
            }}
          >
            <span className="text-emerald-400 mr-2">+</span>
            <span>const secretKey = await vault.getSecret("JWT_SIGNING_KEY");</span>
          </div>
        </div>

        {/* Live feedback */}
        {decision === "blocked" && (
          <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-center text-xs">
            ✕ Edit Blocked. Changes discarded from working tree.
          </div>
        )}
        {decision === "approved" && (
          <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs">
            ✓ Edit Approved. Atomic commit applied.
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={() => setDecision("blocked")}
          className="py-2.5 px-4 rounded-xl font-bold text-xs text-white border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>BLOCK & REVERT</span>
        </button>

        <button
          type="button"
          onClick={() => setDecision("approved")}
          className="py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
          style={{
            backgroundColor: currentAccent.hex,
            boxShadow: `0 0 25px rgba(${currentAccent.rgb}, 0.45)`,
          }}
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>APPROVE EDIT</span>
        </button>
      </div>
    </motion.div>
  );
}

/* ========================================================================= */
/* VISUALIZER 04: The Confidence (Verified Git Timeline & Instant Rollback)   */
/* ========================================================================= */
function VisualConfidence({ currentAccent }: { currentAccent: { hex: string; rgb: string } }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full flex flex-col justify-between font-mono text-xs select-none"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-neutral-400 border-b border-white/10 pb-2 text-[11px]">
          <span>GIT TIMELINE // BRANCH: MAIN</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CLEAN & VERIFIED</span>
          </span>
        </div>

        {/* Commit Chain */}
        <div className="space-y-2.5">
          <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                  color: currentAccent.hex,
                }}
              >
                <GitCommit className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-white font-medium text-xs">
                  orbit(vault): migrate secret fetching
                </div>
                <div className="text-[10px] text-neutral-500">
                  sha: <code>9b841e2</code> • Verified by Engineer
                </div>
              </div>
            </div>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded border"
              style={{
                borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                color: currentAccent.hex,
              }}
            >
              APPROVED
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <GitCommit className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-white font-medium text-xs">
                  orbit(ast): update dependency matrix
                </div>
                <div className="text-[10px] text-neutral-500">
                  sha: <code>4f28aa1</code> • Auto-verified tests pass
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400">
              PASSED
            </span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-between opacity-60">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/5 text-neutral-400 flex items-center justify-center">
                <GitCommit className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-white font-medium text-xs">
                  init: establish cockpit baseline
                </div>
                <div className="text-[10px] text-neutral-500">sha: <code>1a09d3b</code></div>
              </div>
            </div>
            <span className="text-[10px] text-neutral-400">STABLE</span>
          </div>
        </div>
      </div>

      {/* Instant Rollback Action Bar */}
      <div className="p-3 rounded-xl border border-white/10 bg-[#0c0c12] flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-300 text-xs">
          <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
          <span>One-Click Revert Buffer:</span>
          <span className="text-white font-semibold">Ready</span>
        </div>
        <button
          type="button"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          Rollback State
        </button>
      </div>
    </motion.div>
  );
}

