"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCockpitStore } from "@/lib/cockpit-store";
import { useAccentTheme } from "@/components/theme-provider";
import { reconnectOrbitWebSocket } from "@/lib/socket-client";
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Key,
  ShieldAlert,
  Terminal,
  ExternalLink,
  Eye,
  EyeOff,
  Radio,
  Lock,
} from "lucide-react";

interface ShareSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareSessionModal({ isOpen, onClose }: ShareSessionModalProps) {
  const { currentAccent } = useAccentTheme();
  const { authToken, publicTunnelUrl, serverUrl, isConnected } = useCockpitStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [inputKey, setInputKey] = useState(authToken || "");
  const [inputWsUrl, setInputWsUrl] = useState(serverUrl || "ws://localhost:9121");

  // Keep input in sync with store
  React.useEffect(() => {
    if (authToken) setInputKey(authToken);
  }, [authToken]);

  const effectiveToken = authToken || inputKey || "orbit-session-unauthenticated";
  const effectiveTunnel = publicTunnelUrl || null;

  // Construct the full one-click invite URL for teammates or remote browser
  const webOrigin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
  const shareableInviteUrl = `${webOrigin}?token=${encodeURIComponent(effectiveToken)}${
    effectiveTunnel ? `&ws=${encodeURIComponent(effectiveTunnel)}` : ""
  }`;

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleUpdateAndReconnect = (e: React.FormEvent) => {
    e.preventDefault();
    reconnectOrbitWebSocket(inputKey.trim(), inputWsUrl.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl rounded-2xl bg-[#09090D] border border-white/10 shadow-2xl p-6 overflow-hidden z-10"
            style={{
              boxShadow: `0 0 50px rgba(${currentAccent.rgb}, 0.15)`,
            }}
          >
            {/* Ambient Accent Glow */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: currentAccent.hex }}
            />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.12)`,
                    borderColor: `rgba(${currentAccent.rgb}, 0.3)`,
                    color: currentAccent.hex,
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Share Graviton Session & Remote Bridge
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Connect remote AI agents or collaborate live with teammates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tunnel Status Pill */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 text-xs font-mono">
              <div className="flex items-center gap-2">
                {effectiveTunnel ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-semibold">PUBLIC TUNNEL ACTIVE</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-neutral-300 font-medium">LOCAL NETWORK ONLY</span>
                  </>
                )}
              </div>
              <span className="text-neutral-500 text-[11px]">
                {isConnected ? "Engine Connected" : "Engine Standby"}
              </span>
            </div>

            {/* Public Tunnel / Remote Endpoint */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-mono font-medium text-neutral-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" style={{ color: currentAccent.hex }} />
                <span>Public Tunnel URL</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-neutral-200 select-all overflow-hidden text-ellipsis whitespace-nowrap">
                  {effectiveTunnel ? effectiveTunnel : "Disabled (Launch with: graviton start --tunnel)"}
                </div>
                {effectiveTunnel && (
                  <button
                    type="button"
                    onClick={() => handleCopy(effectiveTunnel, "tunnel")}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedField === "tunnel" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Auth Key Input & Copy */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-mono font-medium text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Session Auth Key (Zero-Trust Token)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showKey ? "Hide" : "Reveal"}</span>
                </button>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste or enter auth token"
                  className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(effectiveToken, "key")}
                  className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === "key" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* One-Click Shareable Link */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-mono font-medium text-neutral-300 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                <span>One-Click Team Pairing Link</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-neutral-300 select-all overflow-hidden text-ellipsis whitespace-nowrap">
                  {shareableInviteUrl}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(shareableInviteUrl, "invite")}
                  className="px-3 py-2 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.15)`,
                    borderColor: `rgba(${currentAccent.rgb}, 0.4)`,
                    color: currentAccent.hex,
                  }}
                >
                  {copiedField === "invite" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono">
                Opens the Cockpit WebUI in your teammate's browser and connects automatically with this key.
              </p>
            </div>

            {/* Remote Cloud MCP Config Snippet */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Remote MCP Agent Config (Claude Desktop / Cursor)</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(
                        {
                          mcpServers: {
                            graviton: {
                              url: `${effectiveTunnel || "http://localhost:9121"}/mcp`,
                              headers: {
                                Authorization: `Bearer ${effectiveToken}`,
                              },
                            },
                          },
                        },
                        null,
                        2
                      ),
                      "mcp"
                    )
                  }
                  className="text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  {copiedField === "mcp" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedField === "mcp" ? "Copied JSON" : "Copy JSON"}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black/80 border border-white/5 text-[11px] font-mono text-neutral-300 overflow-x-auto select-all">
{`{
  "mcpServers": {
    "graviton": {
      "url": "${effectiveTunnel || "http://localhost:9121"}/mcp",
      "headers": {
        "Authorization": "Bearer ${effectiveToken}"
      }
    }
  }
}`}
              </pre>
            </div>

            {/* Security Warning Callout */}
            <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                <strong>SECURITY WARNING:</strong> Anyone with this link and key can view, approve, or block AI edits on your codebase. Only share with trusted team members or authorized cloud agents.
              </p>
            </div>

            {/* Footer / Reconnect Action */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleUpdateAndReconnect}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
              >
                Reconnect With Key
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono font-medium text-white transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

