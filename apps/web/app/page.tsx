"use client";

import { Hero } from "@/components/hero";
import { GravityLoop } from "@/components/gravity-loop";
import { FeatureBento } from "@/components/feature-bento";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-[#EDEDED] overflow-x-clip">
      {/* Phase 3: The Hero Section */}
      <Hero />

      {/* Phase 4: The Scrollytelling Narrative (The Gravity Loop) */}
      <GravityLoop />

      {/* Phase 5: Feature Bento Grid (atomix-ui style) */}
      <FeatureBento />

      {/* Phase 6: Technical Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Phase 7: Footer & Final CTA */}
      <Footer />
    </main>
  );
}
