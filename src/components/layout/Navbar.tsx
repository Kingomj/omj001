/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, Wrench, Calendar, Search, BookOpen } from "lucide-react";
import { BUSINESS_INFO } from "../../data/constants";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onNavigateBlog?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  onNavigateBlog,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#050505]/90 backdrop-blur-md border-b border-[#222222]"
          : "bg-[#050505]/60 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Zone 1: Single text element wordmark (Display face) */}
          <button
            onClick={() => handleLinkClick("home")}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            aria-label="OMJ Repairs Home"
          >
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-[#00FF66] transition-colors">
              OMJ <span className="text-[#00FF66]">REPAIRS</span>
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A0A0A0]" aria-label="Main Navigation">
            <button
              onClick={() => handleLinkClick("home")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "home" ? "text-white font-semibold" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick("services")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "services" ? "text-white font-semibold" : ""
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleLinkClick("about")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "about" ? "text-white font-semibold" : ""
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick("request")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "request" ? "text-[#00FF66] font-semibold" : ""
              }`}
            >
              Repair Request
            </button>
            <button
              onClick={() => handleLinkClick("book")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "book" ? "text-white font-semibold" : ""
              }`}
            >
              Book a Repair
            </button>
            <button
              onClick={() => handleLinkClick("status")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSection === "status" ? "text-[#00FF66] font-semibold" : ""
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Repair Status
            </button>
            <button
              onClick={() => handleLinkClick("contact")}
              className={`hover:text-white transition-colors cursor-pointer ${
                activeSection === "contact" ? "text-white font-semibold" : ""
              }`}
            >
              Contact
            </button>
            {onNavigateBlog && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateBlog();
                }}
                className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                  activeSection === "blog" ? "text-[#00FF66] font-semibold" : ""
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#00FF66]" />
                <span>Tech Guides</span>
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-2 text-xs font-mono-tech font-bold text-[#00FF66] bg-[#121212] hover:bg-[#181818] border border-[#00FF66]/30 hover:border-[#00FF66] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open Technician & Admin Command Center"
            >
              <Wrench className="w-3.5 h-3.5 text-[#00FF66]" />
              <span>Admin Portal</span>
            </button>

            <button
              onClick={() => handleLinkClick("request")}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-all duration-150 shadow-[0_0_15px_-3px_rgba(0,255,102,0.4)] whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <span>Request a Repair</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#00FF66] bg-[#141414] border border-[#00FF66]/30 rounded-lg cursor-pointer"
              title="Admin Portal"
            >
              <Wrench className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLinkClick("request")}
              className="px-3 py-1.5 text-xs font-semibold text-[#050505] bg-[#00FF66] rounded-md whitespace-nowrap"
            >
              Request
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A0A0A0] hover:text-white rounded-lg border border-[#222222] bg-[#0D0D0D] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D] border-b border-[#222222] px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleLinkClick("home")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick("services")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => handleLinkClick("about")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => handleLinkClick("request")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#00FF66] bg-[#00FF66]/10 hover:bg-[#00FF66]/20 transition-colors flex items-center justify-between"
            >
              <span>Repair Request</span>
              <Wrench className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLinkClick("book")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors flex items-center justify-between"
            >
              <span>Book a Repair</span>
              <Calendar className="w-4 h-4 text-[#A0A0A0]" />
            </button>
            <button
              onClick={() => handleLinkClick("status")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors flex items-center justify-between"
            >
              <span>Repair Status</span>
              <Search className="w-4 h-4 text-[#00FF66]" />
            </button>
            <button
              onClick={() => handleLinkClick("reviews")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A0] hover:text-white hover:bg-[#121212] transition-colors"
            >
              Reviews
            </button>
            <button
              onClick={() => handleLinkClick("contact")}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A0] hover:text-white hover:bg-[#121212] transition-colors"
            >
              Contact
            </button>
            {onNavigateBlog && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateBlog();
                }}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#121212] transition-colors flex items-center justify-between"
              >
                <span>Computer Tech Guides</span>
                <BookOpen className="w-4 h-4 text-[#00FF66]" />
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left px-3 py-2.5 rounded-lg text-xs font-mono-tech font-bold text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 hover:bg-[#00FF66]/20 transition-colors flex items-center justify-between mt-1 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#00FF66]" />
                <span>Technician Admin Portal</span>
              </div>
              <span className="text-[10px] bg-[#00FF66]/20 text-[#00FF66] px-1.5 py-0.5 rounded font-bold">
                Owner
              </span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#222222] flex flex-col gap-2">
            <a
              href={`tel:${BUSINESS_INFO.contact.phoneTel}`}
              className="text-center px-4 py-2.5 text-xs font-semibold text-white bg-[#121212] border border-[#222222] rounded-lg hover:border-[#00FF66]/50 transition-colors"
            >
              Call: {BUSINESS_INFO.contact.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(
                BUSINESS_INFO.whatsappPrefilledMessages.general
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center px-4 py-2.5 text-xs font-semibold text-[#050505] bg-[#00FF66] rounded-lg"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
