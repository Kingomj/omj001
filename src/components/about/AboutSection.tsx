/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { BUSINESS_INFO } from "../../data/constants";
import { IMAGES } from "../../assets/images";
import {
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

interface AboutSectionProps {
  onRequestClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onRequestClick }) => {
  const coreSkills = [
    "Computer troubleshooting",
    "Boot problem diagnosis",
    "Windows installation & configuration",
    "Linux installation & deployment",
    "Supported macOS troubleshooting",
    "Laptop RAM upgrades",
    "Laptop SSD/HDD upgrades",
    "Hardware diagnosis",
    "Operating-system troubleshooting",
    "Computer maintenance & cleaning",
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-[#080808] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Workbench */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="rounded-2xl overflow-hidden border border-[#222222] bg-[#0D0D0D] shadow-xl group">
              <div className="relative aspect-[4/3] w-full bg-[#121212] overflow-hidden">
                <img
                  src={IMAGES.aboutBench}
                  alt="OMJ Repairs diagnostic workbench and tools in Lagos Nigeria"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-5 border-t border-[#222222] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
                    Lagos, Nigeria
                  </span>
                  <span className="font-mono-tech text-[#00FF66] text-[11px]">OMJ WORKBENCH</span>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Dedicated diagnostic workspace equipped for board inspections, OS recovery, and precision hardware upgrades.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Factual Skills */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-7 order-1 lg:order-2 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
                About the Business
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                About OMJ Repairs
              </h2>
            </div>

            <p className="text-base text-white/95 leading-relaxed font-medium">
              OMJ Repairs is a Lagos-based computer repair and technical support service focused on diagnosing computer problems, repairing systems, installing operating systems, and helping customers upgrade their machines.
            </p>

            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              We position our service on technical competence and honest evaluation. Rather than hastily swapping components at the client&apos;s expense, we inspect the hardware, isolate the fault, explain the underlying issue in plain English, and provide realistic repair options.
            </p>

            {/* Factual Skills List */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Core Technical Skills:
              </h3>
              <motion.div
                variants={staggerContainer(0.04, 0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_CONFIG}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                {coreSkills.map((skill, i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="flex items-center gap-2 text-xs text-[#A0A0A0]"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#00FF66]" />
                    </div>
                    <span>{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onRequestClick}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.25)] hover:shadow-[0_0_20px_rgba(0,255,102,0.4)]"
              >
                <span>Request a Diagnosis</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${BUSINESS_INFO.contact.phoneTel}`}
                className="px-5 py-3 text-xs font-semibold text-white bg-[#0D0D0D] hover:bg-[#121212] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors"
              >
                Speak Directly to Technician
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
