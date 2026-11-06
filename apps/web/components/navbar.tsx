"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Magnetic } from "@/components/ui/magnetic";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { useAccentTheme } from "@/components/theme-provider";
import { GithubIcon } from "@/components/icons";
import { Orbit as OrbitIcon, ArrowRight, Menu, X } from "lucide-react";

export function Navbar() {
  const { currentAccent } = useAccentTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "The Loop", href: "#gravity-loop" },
    { label: "Architecture", href: "#architecture" },
    { label: "Features", href: "#features" },
    { label: "WebUI Cockpit", href: "#cockpit-preview" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Magnetic attraction */}
          <Magnetic intensity={0.25} range={60}>
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-lg border border-white/10 bg-white/4 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-white/30">
                <div
                  className="absolute inset-0 opacity-40 blur-sm transition-opacity group-hover:opacity-100"
                  style={{
                    backgroundColor: `rgba(${currentAccent.rgb}, 0.3)`,
                  }}
                />
                <OrbitIcon
                  className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180"
                  style={{ color: currentAccent.hex }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  Graviton
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                    style={{ backgroundColor: currentAccent.hex }}
                  />
                </span>
              </div>
            </Link>
          </Magnetic>

          {/* Desktop Navigation Links with Magnetic pull */}
          <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 bg-[#0a0a0a]/70 backdrop-blur-md shadow-inner">
            {navLinks.map((link) => (
              <Magnetic key={link.href} intensity={0.2} range={50}>
                <Link
                  href={link.href}
                  className="px-3.5 py-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/6 block"
                >
                  {link.label}
                </Link>
              </Magnetic>
            ))}
          </nav>

          {/* Right-hand side actions: Theme Engine, GitHub & Magnetic CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Engine Customizer */}
            <ThemeCustomizer />

            {/* GitHub Star Link */}
            <Magnetic intensity={0.2} range={50}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-white/10 bg-white/3 hover:bg-white/8 text-neutral-300 hover:text-white transition-all duration-200 flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              >
                <GithubIcon className="w-4 h-4" />
                <span className="hidden lg:inline text-neutral-400">★</span>
                <span className="hidden lg:inline text-[11px]">1.4k</span>
              </a>
            </Magnetic>

            {/* Primary Magnetic CTA */}
            <Magnetic intensity={0.3} range={70}>
              <a
                href="#get-started"
                className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-300 overflow-hidden cursor-pointer group shadow-lg"
                style={{
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 20px -3px rgba(${currentAccent.rgb}, 0.4)`,
                }}
              >
                <span className="relative z-10 font-mono tracking-tight">
                  Get Started
                </span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeCustomizer />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-white/10 bg-white/4 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-xl border border-white/10 bg-[#0a0a0c]/95 backdrop-blur-2xl space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-mono text-neutral-300 hover:text-white hover:bg-white/6 rounded-lg"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="#get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg text-center text-xs font-semibold text-white font-mono flex items-center justify-center gap-2"
                style={{
                  backgroundColor: currentAccent.hex,
                  boxShadow: `0 0 16px rgba(${currentAccent.rgb}, 0.35)`,
                }}
              >
                <span>Launch Graviton</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
