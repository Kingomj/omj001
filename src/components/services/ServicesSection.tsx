/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Filter, ShieldCheck, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES_DATA } from "../../data/servicesData";
import { ServiceCard } from "./ServiceCard";
import { ServiceModal } from "./ServiceModal";
import { ServiceItem } from "../../types";
import {
  fadeInUp,
  staggerContainer,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

interface ServicesSectionProps {
  onSelectServiceForRepair: (service: ServiceItem) => void;
}

const CATEGORIES = [
  "All",
  "Hardware & Repairs",
  "Operating Systems",
  "Upgrades & Maintenance",
  "Networking & Support",
] as const;

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForRepair }) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filteredServices = SERVICES_DATA.filter((service) => {
    const matchesCategory =
      activeCategory === "All" || service.category === activeCategory;
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
              Lagos Technical Support & Repairs
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Diagnostic-First Computer Services
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A0A0A0]">
              Hardware diagnosis, OS installations, and component upgrades for students, remote workers, gamers, and businesses in Lagos.
            </p>
          </div>

          {/* Pricing Model Disclosure */}
          <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] max-w-md text-xs text-[#A0A0A0] space-y-1 shadow-lg">
            <div className="flex items-center gap-1.5 text-white font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00FF66]" />
              <span>Transparent Quotation Policy</span>
            </div>
            <p>
              We do not post fixed generic prices because repair costs vary by component model, fault depth, and part availability. Contact us for a diagnosis and itemized quotation.
            </p>
          </div>
        </motion.div>

        {/* Filter Controls & Search Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8"
        >
          {/* Category Tabs (Segmented control style) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0D0D0D] border border-[#222222] rounded-xl overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#181818] text-[#00FF66] border border-[#00FF66]/30 shadow-sm"
                    : "text-[#A0A0A0] hover:text-white hover:bg-[#121212]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services (e.g., RAM, Boot, Windows)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#0D0D0D] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:outline-none focus:border-[#00FF66] transition-colors"
            />
          </div>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <motion.div
            variants={staggerContainer(0.08, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onLearnMore={(svc) => setSelectedService(svc)}
                onRequest={(svc) => onSelectServiceForRepair(svc)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center py-16 bg-[#0D0D0D] border border-[#222222] rounded-xl p-8"
          >
            <p className="text-sm text-white font-medium mb-1">No services match your search filter</p>
            <p className="text-xs text-[#A0A0A0] mb-4">Try clearing your search term or selecting another category.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-xs font-semibold text-[#00FF66] bg-[#121212] border border-[#222222] rounded-lg hover:border-[#00FF66]/50 cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Modal for Service Details */}
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onRequestService={(svc) => {
            onSelectServiceForRepair(svc);
            setSelectedService(null);
          }}
        />
      </div>
    </section>
  );
};
