/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, ShieldAlert, Cpu, Wrench } from "lucide-react";
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

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
                Engineering Discipline
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
                Professional Technical Support
              </h2>
            </div>

            <p className="text-base sm:text-lg text-white/95 leading-relaxed font-medium">
              &ldquo;{BUSINESS_INFO.trustProse}&rdquo;
            </p>

            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              In Lagos, many computer owners waste money on premature motherboard or screen replacements when the actual failure is a corrupted bootloader, damaged RAM contact, or choked cooling fan. At OMJ Repairs, our priority is testing the machine first, establishing root causes, and recommending realistic, cost-conscious solutions.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                <span className="text-xs text-[#A0A0A0]">
                  <strong className="text-white">Honest Feasibility Advice:</strong> If a device is economically beyond practical repair, we tell you candidly rather than incurring futile repair expenses.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                <span className="text-xs text-[#A0A0A0]">
                  <strong className="text-white">Privacy & Data Handling:</strong> Your personal drives, files, and privacy are treated with strict confidentiality during any troubleshooting session.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                <span className="text-xs text-[#A0A0A0]">
                  <strong className="text-white">Post-Repair Verification:</strong> Devices are tested under operating load to ensure thermal and operating stability prior to return.
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden border border-[#222222] bg-[#0D0D0D] shadow-lg"
                >
                  <img
                    src={IMAGES.serviceHardware}
                    alt="Precision computer motherboard diagnostic inspection"
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
                    <span className="text-white font-medium block">Component Diagnosis</span>
                    <span>Precision multimeters & ESD handling</span>
                  </div>
                </motion.div>

                <div className="p-4 rounded-xl border border-[#222222] bg-[#0D0D0D] space-y-2">
                  <div className="flex items-center gap-2 text-[#00FF66]">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">System Architecture</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Compatibility-checked memory & NVMe bus lines for stable everyday computing.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 sm:pt-10">
                <div className="p-4 rounded-xl border border-[#222222] bg-[#0D0D0D] space-y-2">
                  <div className="flex items-center gap-2 text-[#00FF66]">
                    <Wrench className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">Lagos Support Hub</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    Dedicated support for students, remote professionals, and small businesses across Lagos.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden border border-[#222222] bg-[#0D0D0D] shadow-lg"
                >
                  <img
                    src={IMAGES.serviceLaptop}
                    alt="Thermal paste application and laptop cooling maintenance"
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-3 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
                    <span className="text-white font-medium block">Thermal Maintenance</span>
                    <span>Dust removal & cooling restoration</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
