"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useAccentTheme } from "@/components/theme-provider";
import {
  FolderGit2,
  Binary,
  Layers,
  Cpu,
  Bot,
  Sliders,
  GitCommit,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  isCentral?: boolean;
}

const PRIMARY_NODES: NodeData[] = [
  {
    id: "codebase",
    title: "Host Codebase",
    subtitle: "Local Git Repository",
    description: "Multi-language source files on physical disk",
    icon: FolderGit2,
  },
  {
    id: "scanner",
    title: "AST Scanner",
    subtitle: "Tree-Sitter + Symbol Map",
    description: "Deep static analysis parses symbols & dependencies",
    icon: Binary,
  },
  {
    id: "context",
    title: "Context Engine",
    subtitle: "Knowledge Graph Vector",
    description: "Synthesizes mathematical architectural ground truth",
    icon: Layers,
  },
  {
    id: "gateway",
    title: "MCP Gateway",
    subtitle: "Model Context Protocol Socket",
    description: "Bidirectional JSON-RPC pipe intercepting agent calls",
    icon: Cpu,
  },
  {
    id: "models",
    title: "AI Models",
    subtitle: "Claude, Gemini, GPT, Ollama",
    description: "Zero direct disk writes; all suggestions sent as diffs",
    icon: Bot,
  },
];

const SECONDARY_NODES: NodeData[] = [
  {
    id: "webui",
    title: "WebUI Control Plane",
    subtitle: "Human Cockpit // Port 9120",
    description: "Real-time diff inspection, policy rules, and manual approvals",
    icon: Sliders,
    isCentral: true,
  },
  {
    id: "auditor",
    title: "Git Auditor",
    subtitle: "Cryptographic Rollback Engine",
    description: "Signed commits, sandbox execution verification, zero drift",
    icon: GitCommit,
  },
];

export function ArchitectureDiagram() {
  const { currentAccent } = useAccentTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="architecture" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#030303] overflow-hidden">
      {/* Background Dot Matrix & Lighting */}
      <div className="absolute inset-0 bg-dot-matrix opacity-25 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[190px] opacity-10 pointer-events-none"
        style={{ backgroundColor: currentAccent.hex }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
            <span>ARCHITECTURE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Built for scale. <br />
            <span
              className="accent-gradient-text"
              style={{
                textShadow: `0 0 35px rgba(${currentAccent.rgb}, 0.35)`,
              }}
            >
              Designed for control.
            </span>
          </h2>
          <p className="font-mono text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Every component engineered for zero-trust AI code execution.
            No direct filesystem mutations without cryptographic audit trails.
          </p>
        </div>

        {/* Desktop Pipeline Diagram */}
        <div className="hidden lg:block relative p-8 rounded-3xl border border-white/10 bg-[#08080c]/85 backdrop-blur-2xl shadow-2xl">
          {/* Row 1: Primary Pipeline Flow */}
          <div className="grid grid-cols-5 gap-4 relative items-center">
            {PRIMARY_NODES.map((node, index) => {
              const Icon = node.icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="relative p-5 rounded-2xl border border-white/10 bg-[#0c0c12] hover:border-white/25 transition-all duration-300 flex flex-col justify-between h-[180px] shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-neutral-300 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-[10px] text-neutral-600">
                        NODE 0{index + 1}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm mb-0.5">
                      {node.title}
                    </div>
                    <div className="font-mono text-[10px] text-neutral-400 line-clamp-1">
                      {node.subtitle}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-neutral-500 line-clamp-2">
                    {node.description}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Flow Connector Line SVG between Row 1 nodes */}
          <div className="absolute top-[125px] left-12 right-12 h-8 pointer-events-none -z-0">
            <svg className="w-full h-8 overflow-visible">
              <line
                x1="0"
                y1="0"
                x2="100%"
                y2="0"
                stroke={`rgba(${currentAccent.rgb}, 0.35)`}
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-dash-flow"
              />
            </svg>
          </div>

          {/* Central Intercept Vertical Branch (Context Engine -> WebUI -> Git Auditor) */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center relative">
            <div className="text-center mb-6">
              <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                <span>REAL-TIME INTERCEPTION CHANNEL</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-2xl w-full">
              {SECONDARY_NODES.map((node, index) => {
                const Icon = node.icon;
                const isCentral = node.isCentral;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.15 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 relative shadow-2xl ${
                      isCentral
                        ? "bg-[#0d0d16] animate-pulse-ring"
                        : "bg-[#0c0c12] border-white/10 hover:border-white/20"
                    }`}
                    style={
                      isCentral
                        ? {
                            borderColor: currentAccent.hex,
                            boxShadow: `0 0 60px rgba(${currentAccent.rgb}, 0.5)`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: isCentral
                            ? currentAccent.hex
                            : "rgba(255,255,255,0.06)",
                          color: isCentral ? "#ffffff" : "#ededed",
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        {isCentral && (
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                            style={{
                              backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                              color: currentAccent.hex,
                            }}
                          >
                            CENTRAL HUB
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-neutral-500">
                          NODE 0{PRIMARY_NODES.length + index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-white text-base mb-1">
                      {node.title}
                    </div>
                    <div className="font-mono text-xs text-neutral-400 mb-2">
                      {node.subtitle}
                    </div>
                    <div className="font-mono text-xs text-neutral-500 leading-relaxed">
                      {node.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Responsive Stack */}
        <div className="block lg:hidden space-y-4">
          {[...PRIMARY_NODES, ...SECONDARY_NODES].map((node, index) => {
            const Icon = node.icon;
            const isCentral = node.isCentral;
            return (
              <div key={node.id} className="relative">
                <div
                  className={`p-5 rounded-2xl border relative ${
                    isCentral
                      ? "bg-[#0d0d16] animate-pulse-ring"
                      : "bg-[#0a0a0e] border-white/10"
                  }`}
                  style={
                    isCentral
                      ? {
                          borderColor: currentAccent.hex,
                          boxShadow: `0 0 35px rgba(${currentAccent.rgb}, 0.4)`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isCentral
                            ? currentAccent.hex
                            : "rgba(255,255,255,0.08)",
                          color: "#ffffff",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {node.title}
                        </div>
                        <div className="font-mono text-[11px] text-neutral-400">
                          {node.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">
                      NODE 0{index + 1}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-neutral-400 pl-11">
                    {node.description}
                  </div>
                </div>

                {index < PRIMARY_NODES.length + SECONDARY_NODES.length - 1 && (
                  <div className="flex justify-center py-1 text-neutral-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

