"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface AccentColorPreset {
  id: string;
  name: string;
  hex: string;
  rgb: string;
  description: string;
}

export const ACCENT_PRESETS: AccentColorPreset[] = [
  {
    id: "blue",
    name: "Electric Blue",
    hex: "#3B82F6",
    rgb: "59, 130, 246",
    description: "Default cockpit telemetry & control frequency",
  },
  {
    id: "green",
    name: "Terminal Green",
    hex: "#10B981",
    rgb: "16, 185, 129",
    description: "Low-level kernel monitor & audit pass state",
  },
  {
    id: "purple",
    name: "Neon Purple",
    hex: "#A855F7",
    rgb: "168, 85, 247",
    description: "Multi-model neural synthesizer & MCP uplink",
  },
  {
    id: "yellow",
    name: "Cyber Yellow",
    hex: "#EAB308",
    rgb: "234, 179, 8",
    description: "Real-time diff intercept & human-in-loop warning",
  },
  {
    id: "crimson",
    name: "Crimson",
    hex: "#EF4444",
    rgb: "239, 68, 68",
    description: "Git rollback, branch lockdown & hard intercept",
  },
];

interface AccentThemeContextType {
  currentAccent: AccentColorPreset;
  setAccentById: (id: string) => void;
  presets: AccentColorPreset[];
  glowStrength: number;
  setGlowStrength: (strength: number) => void;
}

const AccentThemeContext = createContext<AccentThemeContextType>({
  currentAccent: ACCENT_PRESETS[0]!,
  setAccentById: () => {},
  presets: ACCENT_PRESETS,
  glowStrength: 1,
  setGlowStrength: () => {},
});

export function useAccentTheme() {
  return useContext(AccentThemeContext);
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [currentAccent, setCurrentAccent] = useState<AccentColorPreset>(
    ACCENT_PRESETS[0]!
  );
  const [glowStrength, setGlowStrength] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("orbit-accent-preset");
    if (stored) {
      const match = ACCENT_PRESETS.find((p) => p.id === stored);
      if (match) {
        applyAccent(match);
        setCurrentAccent(match);
      }
    } else {
      applyAccent(ACCENT_PRESETS[0]!);
    }
  }, []);

  const applyAccent = (preset: AccentColorPreset) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--color-accent", preset.hex);
      document.documentElement.style.setProperty(
        "--color-accent-rgb",
        preset.rgb
      );
      document.documentElement.style.setProperty("--primary", preset.hex);
      document.documentElement.style.setProperty("--ring", preset.hex);
    }
  };

  const setAccentById = (id: string) => {
    const match = ACCENT_PRESETS.find((p) => p.id === id);
    if (match) {
      setCurrentAccent(match);
      applyAccent(match);
      localStorage.setItem("orbit-accent-preset", id);
    }
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      <AccentThemeContext.Provider
        value={{
          currentAccent,
          setAccentById,
          presets: ACCENT_PRESETS,
          glowStrength,
          setGlowStrength,
        }}
      >
        {children}
      </AccentThemeContext.Provider>
    </NextThemesProvider>
  );
}

