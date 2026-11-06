"use client";

import React from "react";
import Link from "next/link";
import { useAccentTheme } from "@/components/theme-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { GithubIcon, TwitterXIcon, DiscordIcon } from "@/components/icons";
import { Orbit as OrbitIcon, ArrowRight, Terminal } from "lucide-react";

export function Footer() {
  const { currentAccent } = useAccentTheme();

  return (
    <footer className="relative bg-[#020202] text-neutral-400 border-t border-white/10 overflow-hidden font-mono">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-cockpit-grid opacity-20 pointer-events-none" />

      {/* ================================================================= */}
      {/* 1. FINAL CTA SECTION                                              */}
      {/* ================================================================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center space-y-8">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-87.5 rounded-full blur-[160px] opacity-25 pointer-events-none"
          style={{ backgroundColor: currentAccent.hex }}
        />

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/3 text-xs text-neutral-300">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentAccent.hex }}
            />
            <span>TAKE BACK YOUR VELOCITY</span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans">
            Stop letting AI drive blind.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Join the developers shipping with confidence. Self-host Graviton and
            reclaim absolute control over every prompt and every patch.
          </p>
        </div>

        {/* Large Magnetic CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Magnetic intensity={0.3} range={80}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 shadow-2xl transition-all duration-300 cursor-pointer group"
              style={{
                backgroundColor: currentAccent.hex,
                boxShadow: `0 0 40px -5px rgba(${currentAccent.rgb}, 0.55)`,
              }}
            >
              <span>Deploy Your Cockpit</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Magnetic>

          <Magnetic intensity={0.2} range={60}>
            <div className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 bg-white/3 text-xs text-neutral-300">
              <Terminal className="w-4 h-4 text-neutral-500" />
              <span>bunx @yakkshit/graviton@latest</span>
            </div>
          </Magnetic>
        </div>

        <p className="text-xs text-neutral-500">
          Open source under MIT. Self-hosted. Free forever.
        </p>
      </div>

      {/* ================================================================= */}
      {/* 2. FOOTER NAVIGATION & BRANDING                                    */}
      {/* ================================================================= */}
      <div className="relative z-10 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand Column (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/4 flex items-center justify-center">
                <OrbitIcon
                  className="w-4 h-4"
                  style={{ color: currentAccent.hex }}
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Graviton
              </span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Your code is the center. AI orbits it. You control the gravity.
              The self-hosted multi-model AI coding cockpit for developers who ship.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-neutral-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg border border-white/10 bg-white/2 hover:bg-white/6 hover:text-white transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="p-2 rounded-lg border border-white/10 bg-white/2 hover:bg-white/6 hover:text-white transition-colors"
              >
                <TwitterXIcon className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="p-2 rounded-lg border border-white/10 bg-white/2 hover:bg-white/6 hover:text-white transition-colors"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links: Product */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#gravity-loop" className="hover:text-white transition-colors">
                  The Gravity Loop
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-white transition-colors">
                  Changelog (v1.0.0)
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Company */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Graviton
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Engineering Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers (We're Hiring)
                </a>
              </li>
            </ul>
          </div>

          {/* Links: Legal & Security */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Security & Legal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Zero Data Retention
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Self-Hosting Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>© 2026 Graviton Technologies Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: currentAccent.hex }}
            />
            <span>All systems nominal // MCP v1.30</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

