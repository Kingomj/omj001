/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Upload,
  Image as ImageIcon,
  X,
  Search,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { PROBLEM_CATEGORIES, BUSINESS_INFO } from "../../data/constants";
import { ProblemCategory, RepairRequest, ServiceItem } from "../../types";
import { storageService } from "../../services/storageService";
import {
  getRepairRequestWhatsAppUrl,
  formatRepairRequestWhatsAppMessage,
} from "../../utils/whatsappHelper";
import {
  fadeInUp,
  fadeInScale,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

interface RepairRequestFormProps {
  initialServiceCategory?: ProblemCategory | null;
  onTrackReference?: (reference: string) => void;
}

export const RepairRequestForm: React.FC<RepairRequestFormProps> = ({
  initialServiceCategory,
  onTrackReference,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    whatsapp: "",
    deviceType: "Laptop" as RepairRequest["deviceType"],
    deviceBrand: "",
    deviceModel: "",
    operatingSystem: "Windows 11" as RepairRequest["operatingSystem"],
    problemCategory: (initialServiceCategory || "Won't Boot") as ProblemCategory,
    description: "",
    startedWhen: "",
    triedAlready: "",
    preferredContactMethod: "WhatsApp" as RepairRequest["preferredContactMethod"],
    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    confirmedAccurate: false,
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<RepairRequest | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (initialServiceCategory) {
      setFormData((prev) => ({ ...prev, problemCategory: initialServiceCategory }));
    }
  }, [initialServiceCategory]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Please enter your name.";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Please enter a valid phone number.";
    } else if (formData.phone.replace(/[^0-9]/g, "").length < 8) {
      errs.phone = "Phone number is too short. Include Lagos/Nigeria dial code or digits.";
    }

    if (!formData.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email format.";
    }

    if (!formData.deviceBrand.trim()) {
      errs.deviceBrand = "Please specify device brand (e.g., HP, Dell, Lenovo, Apple).";
    }

    if (!formData.deviceModel.trim()) {
      errs.deviceModel = "Please enter model name or series (e.g., ThinkPad T480, Inspiron 3520).";
    }

    if (!formData.description.trim()) {
      errs.description = "Please describe the problem symptoms.";
    } else if (formData.description.trim().length < 15) {
      errs.description = "Please provide a bit more detail (at least 15 characters) to help diagnosis.";
    }

    if (!formData.startedWhen.trim()) {
      errs.startedWhen = "Please indicate when the problem began (e.g., yesterday, after an update).";
    }

    if (!formData.confirmedAccurate) {
      errs.confirmedAccurate = "Please confirm the accuracy of your provided details.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate image type and size (< 5MB)
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setUploadedPhotos((prev) => [...prev, event.target!.result as string].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const created = storageService.createRepairRequest({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
          deviceType: formData.deviceType,
          deviceBrand: formData.deviceBrand.trim(),
          deviceModel: formData.deviceModel.trim(),
          operatingSystem: formData.operatingSystem,
          problemCategory: formData.problemCategory,
          description: formData.description.trim(),
          startedWhen: formData.startedWhen.trim(),
          triedAlready: formData.triedAlready.trim() || "None",
          preferredContactMethod: formData.preferredContactMethod,
          preferredDate: formData.preferredDate,
          imageUrls: uploadedPhotos,
        });

        setSubmittedRequest(created);
        setIsSubmitting(false);

        // Open WhatsApp directly with all details and ticket ID
        const waUrl = getRepairRequestWhatsAppUrl(created);
        try {
          window.open(waUrl, "_blank");
        } catch {
          // If popup is blocked by browser, user clicks the prominent CTA button
        }
      } catch (err) {
        setIsSubmitting(false);
        setErrors({ form: "Something went wrong. Please try again or contact OMJ Repairs directly." });
      }
    }, 600);
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <section id="request" className="py-16 md:py-24 bg-[#080808] border-b border-[#222222]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
            Online Submission
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Repair Request Form
          </h2>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Provide details about your computer fault. We inspect the problem carefully before quoting and proceeding with any repair in Lagos.
          </p>
        </motion.div>

        {/* Confirmation State upon successful submission */}
        {submittedRequest ? (
          <motion.div
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            className="bg-[#0D0D0D] border border-[#00FF66]/40 rounded-2xl p-6 sm:p-10 shadow-[0_0_30px_-5px_rgba(0,255,102,0.15)] space-y-6"
          >
            <div className="flex items-center gap-3 text-[#00FF66]">
              <div className="w-10 h-10 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Repair Request Received</h3>
                <p className="text-xs text-[#A0A0A0]">Your computer issue has been queued for diagnosis.</p>
              </div>
            </div>

            {/* Reference Number Box */}
            <div className="p-5 rounded-xl bg-[#121212] border border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#A0A0A0] uppercase tracking-wider block">
                  Official Repair Reference
                </span>
                <span className="font-mono-tech text-2xl sm:text-3xl font-bold text-[#00FF66]">
                  {submittedRequest.reference}
                </span>
              </div>

              <button
                onClick={() => handleCopyRef(submittedRequest.reference)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#181818] border border-[#222222] hover:border-[#00FF66]/50 rounded-lg transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedRef ? "Copied!" : "Copy Reference"}</span>
              </button>
            </div>

            {/* Summary Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A0A0A0] p-4 bg-[#121212]/50 rounded-xl border border-[#222222]">
              <div>
                <span className="text-white font-medium block">Customer Name:</span>
                <span>{submittedRequest.fullName}</span>
              </div>
              <div>
                <span className="text-white font-medium block">Device:</span>
                <span>
                  {submittedRequest.deviceBrand} {submittedRequest.deviceModel} ({submittedRequest.deviceType})
                </span>
              </div>
              <div>
                <span className="text-white font-medium block">Reported Fault:</span>
                <span>{submittedRequest.problemCategory}</span>
              </div>
              <div>
                <span className="text-white font-medium block">Preferred Contact:</span>
                <span>{submittedRequest.preferredContactMethod}</span>
              </div>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              OMJ Repairs will review your device symptoms and reach out to you via{" "}
              <strong className="text-white">{submittedRequest.preferredContactMethod}</strong> to confirm diagnosis scheduling.
            </p>

            {/* Primary Action: Send to WhatsApp with full details and Ticket ID */}
            <div className="space-y-2 pt-2">
              <a
                href={getRepairRequestWhatsAppUrl(submittedRequest)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 text-sm font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_25px_rgba(0,255,102,0.35)] flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <MessageSquare className="w-5 h-5 fill-current shrink-0" />
                <span>Send All Details & Ticket ID to WhatsApp</span>
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A0A0A0] px-1">
                <span>
                  Ticket <strong className="text-white font-mono-tech">{submittedRequest.reference}</strong>, device specs & fault details are formatted for WhatsApp.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const text = formatRepairRequestWhatsAppMessage(submittedRequest);
                    navigator.clipboard.writeText(text);
                    setCopiedMessage(true);
                    setTimeout(() => setCopiedMessage(false), 2000);
                  }}
                  className="text-[#00FF66] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedMessage ? "Message Copied!" : "Copy Full Message"}</span>
                </button>
              </div>
            </div>

            {/* Secondary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {onTrackReference && (
                <button
                  onClick={() => onTrackReference(submittedRequest.reference)}
                  className="w-full sm:w-auto flex-1 px-5 py-3 text-xs font-semibold text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#00FF66]" />
                  <span>Check Status Live on Website</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSubmittedRequest(null);
                  setUploadedPhotos([]);
                  setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    whatsapp: "",
                    deviceType: "Laptop",
                    deviceBrand: "",
                    deviceModel: "",
                    operatingSystem: "Windows 11",
                    problemCategory: "Won't Boot",
                    description: "",
                    startedWhen: "",
                    triedAlready: "",
                    preferredContactMethod: "WhatsApp",
                    preferredDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
                    confirmedAccurate: false,
                  });
                }}
                className="w-full sm:w-auto px-4 py-3 text-xs font-medium text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Form */
          <motion.form
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            onSubmit={handleSubmit}
            className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl"
            noValidate
          >
            {errors.form && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Section 1: Customer Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-[#00FF66] uppercase tracking-wider flex items-center gap-2">
                <span>01. Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-fullName" className="block text-xs font-medium text-white mb-1.5">
                    Full Name <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-fullName"
                    type="text"
                    placeholder="e.g., Tunde Adebayo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.fullName ? "border-red-500 focus:border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="req-phone" className="block text-xs font-medium text-white mb-1.5">
                    Phone Number <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-phone"
                    type="tel"
                    placeholder="e.g., 0803 123 4567 or +234..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="req-email" className="block text-xs font-medium text-white mb-1.5">
                    Email Address <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-email"
                    type="email"
                    placeholder="e.g., customer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="req-whatsapp" className="block text-xs font-medium text-white mb-1.5">
                    WhatsApp Number <span className="text-[#A0A0A0] text-[10px]">(If different from phone)</span>
                  </label>
                  <input
                    id="req-whatsapp"
                    type="tel"
                    placeholder="e.g., +234 803 123 4567"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Device Specifications */}
            <div className="space-y-4 pt-4 border-t border-[#222222]">
              <h3 className="text-xs font-semibold text-[#00FF66] uppercase tracking-wider">
                02. Device Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="req-deviceType" className="block text-xs font-medium text-white mb-1.5">
                    Device Type
                  </label>
                  <select
                    id="req-deviceType"
                    value={formData.deviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, deviceType: e.target.value as RepairRequest["deviceType"] })
                    }
                    className="w-full px-3 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop PC">Desktop PC</option>
                    <option value="All-in-One">All-in-One</option>
                    <option value="Custom Build">Custom Build Tower</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="req-deviceBrand" className="block text-xs font-medium text-white mb-1.5">
                    Device Brand <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-deviceBrand"
                    type="text"
                    placeholder="e.g., HP, Dell, Lenovo, Apple"
                    value={formData.deviceBrand}
                    onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.deviceBrand ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.deviceBrand && <p className="text-[11px] text-red-400 mt-1">{errors.deviceBrand}</p>}
                </div>

                <div>
                  <label htmlFor="req-deviceModel" className="block text-xs font-medium text-white mb-1.5">
                    Device Model <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-deviceModel"
                    type="text"
                    placeholder="e.g., Pavilion 15, Latitude 5420"
                    value={formData.deviceModel}
                    onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.deviceModel ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.deviceModel && <p className="text-[11px] text-red-400 mt-1">{errors.deviceModel}</p>}
                </div>

                <div>
                  <label htmlFor="req-operatingSystem" className="block text-xs font-medium text-white mb-1.5">
                    Operating System
                  </label>
                  <select
                    id="req-operatingSystem"
                    value={formData.operatingSystem}
                    onChange={(e) =>
                      setFormData({ ...formData, operatingSystem: e.target.value as RepairRequest["operatingSystem"] })
                    }
                    className="w-full px-3 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                  >
                    <option value="Windows 11">Windows 11</option>
                    <option value="Windows 10">Windows 10</option>
                    <option value="Windows 8/7">Windows 8 / 7</option>
                    <option value="Linux">Linux (Ubuntu/Debian/Fedora)</option>
                    <option value="macOS">macOS</option>
                    <option value="Not Sure / Won't Boot">Not Sure / Won&apos;t Boot</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Problem Description */}
            <div className="space-y-4 pt-4 border-t border-[#222222]">
              <h3 className="text-xs font-semibold text-[#00FF66] uppercase tracking-wider">
                03. Diagnostic Symptoms
              </h3>

              <div>
                <label htmlFor="req-problemCategory" className="block text-xs font-medium text-white mb-1.5">
                  Problem Category <span className="text-[#00FF66]">*</span>
                </label>
                <select
                  id="req-problemCategory"
                  value={formData.problemCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, problemCategory: e.target.value as ProblemCategory })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                >
                  {PROBLEM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="req-description" className="block text-xs font-medium text-white mb-1.5">
                  Describe the Problem <span className="text-[#00FF66]">*</span>
                </label>
                <textarea
                  id="req-description"
                  rows={4}
                  placeholder="Detail the exact behavior: Does it make beeps? Does the screen flicker? Any error codes or blue screen messages? What happened before it started?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                    errors.description ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                  }`}
                />
                {errors.description && <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-startedWhen" className="block text-xs font-medium text-white mb-1.5">
                    When Did the Problem Start? <span className="text-[#00FF66]">*</span>
                  </label>
                  <input
                    id="req-startedWhen"
                    type="text"
                    placeholder="e.g., 2 days ago, after a Windows update, suddenly this morning"
                    value={formData.startedWhen}
                    onChange={(e) => setFormData({ ...formData, startedWhen: e.target.value })}
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#121212] border rounded-lg text-white placeholder-[#555555] focus:outline-none transition-colors ${
                      errors.startedWhen ? "border-red-500" : "border-[#222222] focus:border-[#00FF66]"
                    }`}
                  />
                  {errors.startedWhen && <p className="text-[11px] text-red-400 mt-1">{errors.startedWhen}</p>}
                </div>

                <div>
                  <label htmlFor="req-triedAlready" className="block text-xs font-medium text-white mb-1.5">
                    Has Anything Been Tried Already?
                  </label>
                  <input
                    id="req-triedAlready"
                    type="text"
                    placeholder="e.g., Hard reboot, changed charger, restarted in safe mode"
                    value={formData.triedAlready}
                    onChange={(e) => setFormData({ ...formData, triedAlready: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Service Preferences & Photo Upload */}
            <div className="space-y-4 pt-4 border-t border-[#222222]">
              <h3 className="text-xs font-semibold text-[#00FF66] uppercase tracking-wider">
                04. Service Preferences & Attachments
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="req-preferredContact" className="block text-xs font-medium text-white mb-1.5">
                    Preferred Contact Method
                  </label>
                  <select
                    id="req-preferredContact"
                    value={formData.preferredContactMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContactMethod: e.target.value as RepairRequest["preferredContactMethod"],
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Email">Email</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="req-preferredDate" className="block text-xs font-medium text-white mb-1.5">
                    Preferred Service Date
                  </label>
                  <input
                    id="req-preferredDate"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </div>

              {/* Upload device photos */}
              <div>
                <label className="block text-xs font-medium text-white mb-1.5">
                  Upload Device Photos <span className="text-[#A0A0A0] text-[10px]">(Optional, up to 3 photos of screen error or device)</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 bg-[#121212] border border-dashed border-[#333333] hover:border-[#00FF66] rounded-lg text-xs text-[#A0A0A0] hover:text-white cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#00FF66]" />
                    <span>Choose Photo(s)</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {uploadedPhotos.map((photo, i) => (
                    <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#222222]">
                      <img src={photo} alt={`Uploaded ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white"
                        aria-label="Remove photo"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Checkbox confirmation mandated in Section 9 */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.confirmedAccurate}
                  onChange={(e) => setFormData({ ...formData, confirmedAccurate: e.target.checked })}
                  className="mt-0.5 rounded border-[#333333] bg-[#121212] text-[#00FF66] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#00FF66]"
                />
                <span className="text-xs text-[#A0A0A0] group-hover:text-white transition-colors leading-relaxed">
                  I confirm that the information provided is accurate to the best of my knowledge.
                </span>
              </label>
              {errors.confirmedAccurate && (
                <p className="text-[11px] text-red-400 mt-1 pl-7">{errors.confirmedAccurate}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-150 shadow-[0_0_20px_-3px_rgba(0,255,102,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Diagnosis Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Repair Request</span>
                    <Wrench className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};
