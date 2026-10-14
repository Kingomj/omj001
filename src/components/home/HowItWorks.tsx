/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileText, Microscope, Receipt, CheckCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

interface HowItWorksProps {
  onRequestClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onRequestClick }) => {
  const steps = [
    {
      num: "01",
      title: "Tell Us What's Wrong",
      subtitle: "Submit your computer problem through the repair request form.",
      details: "Describe symptoms, device model, and when the issue started so we can prepare.",
      icon: FileText,
    },
    {
      num: "02",
      title: "Diagnosis",
      subtitle: "The device/problem is assessed to identify the likely cause.",
      details: "Hardware components and software integrity are checked methodically at the bench.",
      icon: Microscope,
    },
    {
      num: "03",
      title: "Quote",
      subtitle: "The customer receives information about the recommended repair and pricing.",
      details: "We explain the required steps and estimated cost before proceeding. No surprises.",
      icon: Receipt,
    },
    {
      num: "04",
      title: "Repair",
      subtitle: "Once approved, the repair or service is carried out.",
      details: "Component repair, replacement, or OS setup followed by thorough stability verification.",
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#080808] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
              Simple 4-Step Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How OMJ Repairs Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A0A0A0]">
              From initial issue reporting to bench testing and handover in Lagos.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRequestClick}
              className="px-5 py-2.5 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.25)]"
            >
              Start Step 1
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/40 rounded-xl p-6 relative flex flex-col justify-between transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono-tech font-bold text-[#00FF66]">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-md bg-[#121212] border border-[#222222] flex items-center justify-center text-[#A0A0A0]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm font-medium text-white/90 mb-3">
                    {step.subtitle}
                  </p>
                </div>

                <p className="text-xs text-[#A0A0A0] pt-3 border-t border-[#222222]/80 leading-relaxed">
                  {step.details}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Disclaimer note mandated in Section 8 */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="mt-8 p-4 rounded-lg bg-[#121212] border border-[#222222] flex items-start gap-3"
        >
          <Info className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            <strong className="text-white">Note:</strong> Diagnosis duration and repair quotation depend on the device model, component availability, and the specific nature of the hardware or software problem. Devices requiring in-depth electrical bench testing may require additional evaluation time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
