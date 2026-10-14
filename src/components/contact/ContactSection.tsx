/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
  Linkedin,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { BUSINESS_INFO } from "../../data/constants";
import {
  fadeInUp,
  slideInLeft,
  slideInRight,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

export const ContactSection: React.FC = () => {
  const [quickName, setQuickName] = useState("");
  const [quickPhone, setQuickPhone] = useState("");
  const [quickMessage, setQuickMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleQuickContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickMessage.trim()) return;

    const fullMsg = `Hello OMJ Repairs, my name is ${quickName.trim()} (${quickPhone.trim() || "No phone provided"}). I have an inquiry: ${quickMessage.trim()}`;
    const url = `https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(fullMsg)}`;

    setSentSuccess(true);
    setTimeout(() => {
      window.open(url, "_blank");
      setSentSuccess(false);
      setQuickName("");
      setQuickPhone("");
      setQuickMessage("");
    }, 600);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
            Get in Touch
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Contact OMJ Repairs
          </h2>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Reach out directly for computer repair inquiries, diagnostic questions, or to discuss your machine in Lagos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Contact Channels Column */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-6 space-y-4"
          >
            {/* WhatsApp Card */}
            <div className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 rounded-xl p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66] shrink-0 group-hover:bg-[#00FF66]/20 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A0A0A0] uppercase font-semibold tracking-wider block">
                    WhatsApp Chat
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {BUSINESS_INFO.contact.phoneDisplay}
                  </span>
                </div>
              </div>

              <a
                href={`https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(
                  BUSINESS_INFO.whatsappPrefilledMessages.general
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-[0_0_12px_rgba(0,255,102,0.2)]"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Phone Call Card */}
            <div className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 rounded-xl p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center text-white shrink-0 group-hover:border-[#00FF66]/30 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A0A0A0] uppercase font-semibold tracking-wider block">
                    Phone Call
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {BUSINESS_INFO.contact.phoneDisplay}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${BUSINESS_INFO.contact.phoneTel}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Call Now</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 rounded-xl p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#121212] border border-[#222222] flex items-center justify-center text-white shrink-0 group-hover:border-[#00FF66]/30 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-[#A0A0A0] uppercase font-semibold tracking-wider block">
                    Direct Email
                  </span>
                  <span className="text-sm font-semibold text-white break-all">
                    {BUSINESS_INFO.contact.email}
                  </span>
                </div>
              </div>

              <a
                href={`mailto:${BUSINESS_INFO.contact.email}`}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>Send Email</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Location & Social Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <MapPin className="w-4 h-4 text-[#00FF66]" />
                  <span>Location</span>
                </div>
                <p className="text-xs text-[#A0A0A0]">{BUSINESS_INFO.location}</p>
                <p className="text-[11px] text-[#666666] pt-1">
                  Serving students, remote staff, and businesses in Lagos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <Clock className="w-4 h-4 text-[#00FF66]" />
                  <span>Operating Hours</span>
                </div>
                <p className="text-xs text-[#A0A0A0]">{BUSINESS_INFO.workingHours}</p>
                <p className="text-[11px] text-[#666666] pt-1">
                  West Africa Time (WAT / GMT+1)
                </p>
              </div>
            </div>

            {/* Social media links */}
            <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex items-center justify-between">
              <span className="text-xs text-white font-medium">Follow OMJ Repairs:</span>
              <div className="flex items-center gap-3">
                <a
                  href={BUSINESS_INFO.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white bg-[#121212] border border-[#222222] hover:border-[#00FF66]/30 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram</span>
                </a>
                <a
                  href={BUSINESS_INFO.contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white bg-[#121212] border border-[#222222] hover:border-[#00FF66]/30 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Instant Message Card */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="lg:col-span-6 bg-[#0D0D0D] border border-[#222222] rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Send a Quick Message
            </h3>
            <p className="text-xs text-[#A0A0A0] mb-6">
              Have a quick question before requesting a repair? Type your message below to send directly via WhatsApp.
            </p>

            <form onSubmit={handleQuickContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="quick-name" className="block text-xs font-medium text-white mb-1.5">
                  Your Name
                </label>
                <input
                  id="quick-name"
                  type="text"
                  placeholder="e.g., Kemi"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div>
                <label htmlFor="quick-phone" className="block text-xs font-medium text-white mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  id="quick-phone"
                  type="tel"
                  placeholder="e.g., 080..."
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div>
                <label htmlFor="quick-msg" className="block text-xs font-medium text-white mb-1.5">
                  Message / Question
                </label>
                <textarea
                  id="quick-msg"
                  rows={4}
                  placeholder="Ask about RAM upgrade options, boot failure, or dropping off your PC in Lagos..."
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.25)]"
              >
                {sentSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message on WhatsApp</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
