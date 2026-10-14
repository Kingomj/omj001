/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Wrench,
  Cpu,
  Power,
  Layers,
  Terminal,
  Laptop,
  Zap,
  HardDrive,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Sparkles,
  Wifi,
  Printer,
  Database,
  ArrowRight,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { ServiceItem } from "../../types";
import { staggerItem } from "../../utils/motionPresets";

interface ServiceCardProps {
  service: ServiceItem;
  onLearnMore: (service: ServiceItem) => void;
  onRequest: (service: ServiceItem) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  Cpu,
  Power,
  Layers,
  Terminal,
  Laptop,
  Zap,
  HardDrive,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Sparkles,
  Wifi,
  Printer,
  Database,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onLearnMore, onRequest }) => {
  const IconComponent = iconMap[service.iconName] || Wrench;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      layout
      className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 rounded-xl p-6 transition-colors duration-200 flex flex-col justify-between group shadow-lg"
    >
      <div>
        {/* Top: Icon & Category Indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center text-[#00FF66] group-hover:scale-105 transition-transform">
            <IconComponent className="w-5 h-5" />
          </div>
          <span className="text-[11px] text-[#A0A0A0] font-mono-tech">
            {service.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#00FF66] transition-colors">
          {service.title}
        </h3>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed line-clamp-3">
          {service.shortDesc}
        </p>
      </div>

      {/* Card Footer: Action Links */}
      <div className="pt-5 mt-4 border-t border-[#222222] flex items-center justify-between">
        <button
          onClick={() => onLearnMore(service)}
          className="text-xs font-medium text-[#A0A0A0] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <button
          onClick={() => onRequest(service)}
          className="text-xs font-semibold text-[#00FF66] hover:text-[#00C853] transition-colors cursor-pointer flex items-center gap-1 group/btn"
        >
          <span>Get Diagnosis</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};
