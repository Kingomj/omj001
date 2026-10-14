/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle, ShieldAlert, ArrowRight, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { BookingRequest } from "../../types";
import { storageService } from "../../services/storageService";
import { BUSINESS_INFO } from "../../data/constants";
import { getBookingWhatsAppUrl } from "../../utils/whatsappHelper";
import {
  fadeInUp,
  fadeInScale,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

export const BookingForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    device: "",
    problem: "",
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    preferredTime: "Morning (09:00 - 12:00)",
    servicePreference: "Technician Drop-off" as BookingRequest["servicePreference"],
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = "Please enter your name.";
    if (!formData.phone.trim()) errs.phone = "Please enter a valid phone number.";
    if (!formData.email.trim()) errs.email = "Please enter your email.";
    if (!formData.device.trim()) errs.device = "Please specify device model (e.g. Dell XPS 13).";
    if (!formData.problem.trim()) errs.problem = "Please provide a brief problem summary.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const booking = storageService.createBooking({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          device: formData.device.trim(),
          problem: formData.problem.trim(),
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          servicePreference: formData.servicePreference,
          additionalInfo: formData.additionalInfo.trim(),
        });

        setSubmittedBooking(booking);
        setIsSubmitting(false);

        // Open WhatsApp directly with all booking details
        const waUrl = getBookingWhatsAppUrl(booking);
        try {
          window.open(waUrl, "_blank");
        } catch {
          // Fallback handled by primary button
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrors({ form: "Something went wrong. Please try again or reach out on WhatsApp." });
      }
    }, 500);
  };

  return (
    <section id="book" className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
            Schedule a Diagnostic Slot
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Book a Repair Session
          </h2>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Reserve workbench time with OMJ Repairs in Lagos. We will review your slot and contact you to confirm availability.
          </p>
        </motion.div>

        {submittedBooking ? (
          <motion.div
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            className="bg-[#0D0D0D] border border-[#00FF66]/40 rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center mx-auto text-[#00FF66]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Booking Request Received</h3>
              <p className="text-sm text-[#00FF66] font-mono-tech">Booking Ref: {submittedBooking.reference}</p>
            </div>

            {/* Exact wording mandated in Section 10 */}
            <p className="text-sm text-white/90 max-w-lg mx-auto bg-[#121212] p-4 rounded-xl border border-[#222222]">
              Your request has been received. OMJ Repairs will contact you to confirm availability and discuss the service.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={getBookingWhatsAppUrl(submittedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send Booking Details to WhatsApp (+234 704 046 8694)</span>
              </a>

              <button
                onClick={() => setSubmittedBooking(null)}
                className="px-5 py-3 text-xs font-semibold text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] rounded-xl transition-colors cursor-pointer"
              >
                Book Another Slot
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            onSubmit={handleSubmit}
            className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-6 sm:p-10 space-y-6 shadow-xl"
            noValidate
          >
            {/* No online payments disclosure mandated in Section 10 */}
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#222222] flex items-center gap-2.5 text-xs text-[#A0A0A0]">
              <ShieldAlert className="w-4 h-4 text-[#00FF66] shrink-0" />
              <span>
                <strong>No upfront online payment:</strong> Pricing is quoted only after proper physical/software diagnosis. Payment is settled upon approved service delivery.
              </span>
            </div>

            {errors.form && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                {errors.form}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="book-fullName" className="block text-xs font-medium text-white mb-1.5">
                  Your Full Name <span className="text-[#00FF66]">*</span>
                </label>
                <input
                  id="book-fullName"
                  type="text"
                  placeholder="e.g., Chioma Okafor"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                    errors.fullName ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="book-phone" className="block text-xs font-medium text-white mb-1.5">
                  Phone / WhatsApp <span className="text-[#00FF66]">*</span>
                </label>
                <input
                  id="book-phone"
                  type="tel"
                  placeholder="e.g., 0812 345 6789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                    errors.phone ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="book-email" className="block text-xs font-medium text-white mb-1.5">
                  Email Address <span className="text-[#00FF66]">*</span>
                </label>
                <input
                  id="book-email"
                  type="email"
                  placeholder="e.g., chioma@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                    errors.email ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="book-device" className="block text-xs font-medium text-white mb-1.5">
                  Device (Make & Model) <span className="text-[#00FF66]">*</span>
                </label>
                <input
                  id="book-device"
                  type="text"
                  placeholder="e.g., HP Envy x360, Lenovo Legion 5"
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                    errors.device ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                  }`}
                />
                {errors.device && <p className="text-[11px] text-red-400 mt-1">{errors.device}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="book-problem" className="block text-xs font-medium text-white mb-1.5">
                Problem Summary <span className="text-[#00FF66]">*</span>
              </label>
              <textarea
                id="book-problem"
                rows={3}
                placeholder="Brief summary of the issue or upgrade you need (e.g., laptop overheating during Zoom calls, SSD upgrade from 256GB to 1TB)."
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                  errors.problem ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                }`}
              />
              {errors.problem && <p className="text-[11px] text-red-400 mt-1">{errors.problem}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="book-preferredDate" className="block text-xs font-medium text-white mb-1.5">
                  Preferred Date
                </label>
                <input
                  id="book-preferredDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                />
              </div>

              <div>
                <label htmlFor="book-preferredTime" className="block text-xs font-medium text-white mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  id="book-preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                >
                  <option value="Morning (09:00 - 12:00)">Morning (09:00 – 12:00)</option>
                  <option value="Afternoon (12:00 - 15:00)">Afternoon (12:00 – 15:00)</option>
                  <option value="Late Afternoon (15:00 - 18:00)">Late Afternoon (15:00 – 18:00)</option>
                </select>
              </div>

              <div>
                <label htmlFor="book-servicePref" className="block text-xs font-medium text-white mb-1.5">
                  Service Preference
                </label>
                <select
                  id="book-servicePref"
                  value={formData.servicePreference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicePreference: e.target.value as BookingRequest["servicePreference"],
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                >
                  <option value="Technician Drop-off">Technician Drop-off</option>
                  <option value="Lagos Pickup Consultation">Lagos Pickup Inquiry</option>
                  <option value="Remote Diagnostic Assessment">Remote Consultation</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="book-additionalInfo" className="block text-xs font-medium text-white mb-1.5">
                Additional Information <span className="text-[#A0A0A0] text-[10px]">(Optional)</span>
              </label>
              <input
                id="book-additionalInfo"
                type="text"
                placeholder="Any special handling notes, charger availability, or location details in Lagos"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] disabled:opacity-50 rounded-xl transition-all duration-150 shadow-[0_0_20px_-3px_rgba(0,255,102,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Scheduling Slot...</span>
              ) : (
                <>
                  <span>Submit Booking Request</span>
                  <Calendar className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};
