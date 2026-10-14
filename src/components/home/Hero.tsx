/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ArrowUpRight, Cpu, HardDrive, Zap, ShieldCheck, MapPin, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { BUSINESS_INFO } from "../../data/constants";
import { IMAGES } from "../../assets/images";
import {
  fadeInUp,
  fadeInScale,
  staggerContainer,
  staggerItem,
  slideInLeft,
  slideInRight,
  TECH_EASE,
} from "../../utils/motionPresets";

interface HeroProps {
  onRequestClick: () => void;
  onExploreServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestClick, onExploreServicesClick }) => {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-[#222222]">
      {/* Subtle tech background elements with animated ambient pulse */}
      <div className="absolute inset-0 tech-grid-pattern opacity-40 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#00FF66]/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Regional trust marker in hero */}
            <motion.div
              variants={staggerItem}
              className="inline-flex items-center gap-2 text-xs text-[#A0A0A0] font-medium tracking-wide"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#00FF66] animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>{BUSINESS_INFO.location}</span>
              <span aria-hidden="true">·</span>
              <span>Workbench Diagnostics & Support</span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.08] text-balance"
            >
              Your Computer. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] via-[#00E65C] to-emerald-400">
                Our Expertise.
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="text-lg md:text-xl font-medium text-white/90"
            >
              {BUSINESS_INFO.subtitle}
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="text-sm md:text-base text-[#A0A0A0] leading-relaxed max-w-2xl"
            >
              {BUSINESS_INFO.heroProse}
            </motion.p>

            {/* Action buttons */}
            <motion.div
              variants={staggerItem}
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRequestClick}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-all duration-150 shadow-[0_0_20px_-3px_rgba(0,255,102,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <span>Request a Repair</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreServicesClick}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white hover:text-[#00FF66] bg-[#0D0D0D] hover:bg-[#121212] border border-[#222222] hover:border-[#00FF66]/50 rounded-lg transition-colors cursor-pointer"
              >
                Explore Services
              </motion.button>
            </motion.div>

            {/* Hardware focus markers - Clean text without pill boxes */}
            <motion.div
              variants={staggerItem}
              className="pt-6 border-t border-[#222222]/80"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#A0A0A0]">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <span>CPU & Boards</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <span>NVMe / SSDs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <span>RAM Upgrades</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0" />
                  <span>OS Stability</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Visual hardware anchor */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#222222] bg-[#0D0D0D] group shadow-2xl">
              {/* Photo representation */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-[#121212]">
                <img
                  src={IMAGES.heroWorkspace}
                  alt="OMJ Repairs computer diagnostic technician bench with laptop hardware"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
              </div>

              {/* Hardware diagnostics preview overlay card */}
              <div className="p-5 space-y-3 bg-[#0D0D0D]/95 backdrop-blur-sm border-t border-[#222222]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-[#00FF66]" />
                    Workbench Diagnostic Standards
                  </span>
                  <span className="text-[11px] font-mono-tech text-[#00FF66]">LAGOS · BENCH 01</span>
                </div>

                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Every device undergoes step-by-step diagnostic verification before any part recommendation or component change.
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
                  <span>Tagline: &quot;Diagnose. Repair. Upgrade. Connect.&quot;</span>
                  <span className="text-white font-medium">No blind swaps</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
