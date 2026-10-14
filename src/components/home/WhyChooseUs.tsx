/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Microscope, Cpu, Layers, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: Microscope,
      title: "Proper Diagnosis",
      description: "We focus on identifying the underlying problem before recommending a solution.",
      detail: "Avoid unnecessary component replacements through methodical hardware and system root-cause testing.",
    },
    {
      icon: Cpu,
      title: "Hardware Expertise",
      description: "Computer hardware troubleshooting, RAM upgrades and storage upgrades.",
      detail: "Careful bench handling with anti-static protection, thermal optimization, and verified part compatibility.",
    },
    {
      icon: Layers,
      title: "Multiple Operating Systems",
      description: "Windows, Linux and supported macOS installation and troubleshooting.",
      detail: "Clean installs, bootloader repair, driver configuration, and stability verification across platforms.",
    },
    {
      icon: MessageSquare,
      title: "Clear Communication",
      description: "Customers should understand the problem and proposed solution before proceeding.",
      detail: "Plain-language explanations, realistic timeline estimates, and straightforward quotation before work begins.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="max-w-3xl mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
            Why Choose OMJ Repairs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built on diagnosis, not guesswork.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A0A0A0]">
            We treat your computer with engineering discipline. No hurried part-swapping without verified faults.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 rounded-xl p-6 transition-colors duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center text-[#00FF66] group-hover:scale-110 transition-transform mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-white/90 mb-3 leading-snug">
                    {item.description}
                  </p>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed pt-3 border-t border-[#222222]/60">
                  {item.detail}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
