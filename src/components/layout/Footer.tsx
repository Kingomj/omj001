/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Linkedin,
  Shield,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { BUSINESS_INFO } from "../../data/constants";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onNavigateServicePage?: (slug: string) => void;
  onNavigateBlog?: (slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onNavigateServicePage,
  onNavigateBlog,
}) => {
  const handleServiceClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateServicePage) {
      onNavigateServicePage(slug);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = `/${slug}`;
    }
  };

  const handleBlogClick = (slug?: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigateBlog) {
      onNavigateBlog(slug);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = slug ? `/blog/${slug}` : "/blog";
    }
  };
  return (
    <footer className="bg-[#050505] text-[#A0A0A0] border-t border-[#222222] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Taglines (col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                OMJ <span className="text-[#00FF66]">REPAIRS</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-white">
              &ldquo;{BUSINESS_INFO.primaryTagline}&rdquo;
            </p>

            <p className="text-xs text-[#00FF66] font-mono-tech">
              &ldquo;{BUSINESS_INFO.secondaryTagline}&rdquo;
            </p>

            <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-sm">
              Professional computer hardware troubleshooting, operating system installation, boot problem diagnosis, and component upgrades in Lagos, Nigeria.
            </p>

            <div className="flex items-center gap-2 text-xs text-white pt-2">
              <MapPin className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>{BUSINESS_INFO.location}</span>
            </div>
          </div>

          {/* Quick Links (col 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services & Diagnosis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About OMJ Repairs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("request")}
                  className="hover:text-white transition-colors cursor-pointer text-[#00FF66]"
                >
                  Request a Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("book")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book a Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("status")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Repair Status Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("reviews")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact (col 8-10) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={`https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(
                    BUSINESS_INFO.whatsappPrefilledMessages.general
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>WhatsApp: {BUSINESS_INFO.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BUSINESS_INFO.contact.phoneTel}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Phone: {BUSINESS_INFO.contact.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_INFO.contact.email}`}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span className="break-all">{BUSINESS_INFO.contact.email}</span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-[#777777] block">Hours of Operation:</span>
              <span className="text-xs text-white/80">{BUSINESS_INFO.workingHours}</span>
            </div>
          </div>

          {/* Social & Legal (col 11-12) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex flex-col space-y-2">
              <a
                href={BUSINESS_INFO.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-[#555555]" />
              </a>

              <a
                href={BUSINESS_INFO.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3 h-3 text-[#555555]" />
              </a>
            </div>

            <div className="pt-4 border-t border-[#222222] space-y-2 text-xs">
              <button
                onClick={onOpenPrivacy}
                className="block hover:text-white transition-colors cursor-pointer text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={onOpenTerms}
                className="block hover:text-white transition-colors cursor-pointer text-left"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Lagos Repair Services & Tech Guides SEO Links */}
        <div className="pt-10 mt-10 border-t border-[#222222] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-xs">
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Lagos Repair Services
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/computer-repair-lagos"
                  onClick={(e) => handleServiceClick("computer-repair-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Computer Repair Lagos (Desktop & Hardware)
                </a>
              </li>
              <li>
                <a
                  href="/laptop-repair-lagos"
                  onClick={(e) => handleServiceClick("laptop-repair-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Laptop Repair Lagos (Dell, HP, Lenovo, ThinkPad)
                </a>
              </li>
              <li>
                <a
                  href="/boot-problem-repair-lagos"
                  onClick={(e) => handleServiceClick("boot-problem-repair-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Boot Problem & Blue Screen Repair Lagos
                </a>
              </li>
              <li>
                <a
                  href="/computer-maintenance-lagos"
                  onClick={(e) => handleServiceClick("computer-maintenance-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Computer Maintenance & Dust Cleaning Lagos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              OS Installations & Upgrades
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/ssd-upgrade-lagos"
                  onClick={(e) => handleServiceClick("ssd-upgrade-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Solid State Drive (SSD) Upgrades Lagos
                </a>
              </li>
              <li>
                <a
                  href="/ram-upgrade-lagos"
                  onClick={(e) => handleServiceClick("ram-upgrade-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  RAM Memory Upgrades (DDR4 & DDR5) Lagos
                </a>
              </li>
              <li>
                <a
                  href="/windows-installation-lagos"
                  onClick={(e) => handleServiceClick("windows-installation-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Clean Windows 11 & Windows 10 Installation
                </a>
              </li>
              <li>
                <a
                  href="/linux-installation-lagos"
                  onClick={(e) => handleServiceClick("linux-installation-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Linux Setup & Dual-Boot (Ubuntu, Fedora, Mint)
                </a>
              </li>
              <li>
                <a
                  href="/macos-support-lagos"
                  onClick={(e) => handleServiceClick("macos-support-lagos", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  macOS Support & MacBook Troubleshooting
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Computer Tech Guides & Advice
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="/blog/ssd-vs-hdd-upgrade-lagos-guide"
                  onClick={(e) => handleBlogClick("ssd-vs-hdd-upgrade-lagos-guide", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  SSD vs HDD: Highest-Impact Speed Boost in Lagos
                </a>
              </li>
              <li>
                <a
                  href="/blog/prevent-laptop-overheating-lagos-dust-climate"
                  onClick={(e) => handleBlogClick("prevent-laptop-overheating-lagos-dust-climate", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Managing Laptop Thermals in Lagos Dust & Humidity
                </a>
              </li>
              <li>
                <a
                  href="/blog/generator-power-surges-computer-psu-protection"
                  onClick={(e) => handleBlogClick("generator-power-surges-computer-psu-protection", e)}
                  className="hover:text-[#00FF66] transition-colors block"
                >
                  Generator Voltage Spikes & Power Supply Protection
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  onClick={(e) => handleBlogClick(undefined, e)}
                  className="text-[#00FF66] hover:underline font-semibold block pt-1"
                >
                  Browse All Computer Tech Guides →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Future-Ready Technician Workspace Switcher */}
        <div className="pt-10 mt-10 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 OMJ Repairs. All rights reserved. Lagos, Nigeria.</p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#666666]">
              Designed for reliability and transparent diagnosis.
            </span>

            {/* Discreet future-ready admin portal trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-1 text-[#444444] hover:text-[#00FF66] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
              title="Technician Portal"
              aria-label="Technician Admin Tools"
            >
              <Wrench className="w-3 h-3" />
              <span>Technician Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
