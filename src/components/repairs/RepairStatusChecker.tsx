/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Wrench,
  MessageSquare,
  History,
  Activity,
  Laptop,
  Check,
  ChevronRight,
  User,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { REPAIR_STATUS_STEPS, BUSINESS_INFO } from "../../data/constants";
import { RepairLifecycleStatus, RepairRequest } from "../../types";
import { storageService } from "../../services/storageService";
import {
  fadeInUp,
  fadeInScale,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

interface RepairStatusCheckerProps {
  initialReference?: string;
}

export const RepairStatusChecker: React.FC<RepairStatusCheckerProps> = ({ initialReference }) => {
  const [referenceInput, setReferenceInput] = useState(initialReference || "");
  const [searchedRef, setSearchedRef] = useState<string | null>(initialReference || null);
  const [repairRecord, setRepairRecord] = useState<RepairRequest | null>(null);
  const [matchingTickets, setMatchingTickets] = useState<RepairRequest[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setSearched(true);
    setSearchedRef(trimmed);

    setTimeout(() => {
      // 1. First try flexible multi-attribute search
      const results = storageService.searchRepairs(trimmed);
      if (results.length === 1) {
        setRepairRecord(results[0]);
        setMatchingTickets([]);
      } else if (results.length > 1) {
        setMatchingTickets(results);
        setRepairRecord(results[0]); // Default to the most recent one while showing selection tabs
      } else {
        // Fallback exact ID or Ref lookup
        const found = storageService.getRepairById(trimmed);
        setRepairRecord(found);
        setMatchingTickets([]);
      }
      setIsLoading(false);
    }, 200);
  };

  useEffect(() => {
    if (initialReference) {
      setReferenceInput(initialReference);
      performSearch(initialReference);
    }
  }, [initialReference]);

  // Live real-time listener for updates made in Admin Portal (same tab & cross-tab)
  useEffect(() => {
    const handleLiveUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ reference?: string }>;
      const targetRef = customEvent.detail?.reference;

      // Re-fetch the current active record if it was updated or if targetRef matches
      setRepairRecord((current) => {
        if (!current) {
          if (targetRef) return storageService.getRepairById(targetRef);
          return null;
        }
        if (!targetRef || targetRef.toUpperCase() === current.reference.toUpperCase() || targetRef === current.id) {
          return storageService.getRepairById(current.reference) || current;
        }
        return current;
      });
    };

    window.addEventListener("omj_data_updated", handleLiveUpdate);
    window.addEventListener("storage", handleLiveUpdate);

    // Cross-tab BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("omj_repairs_channel");
        bc.onmessage = (msg) => {
          if (msg.data?.reference) {
            handleLiveUpdate(new CustomEvent("omj_data_updated", { detail: msg.data }));
          }
        };
      } catch {
        // Unsupported
      }
    }

    return () => {
      window.removeEventListener("omj_data_updated", handleLiveUpdate);
      window.removeEventListener("storage", handleLiveUpdate);
      if (bc) bc.close();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(referenceInput);
  };

  const getStepIndex = (status: RepairLifecycleStatus): number => {
    return REPAIR_STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const currentStepIndex = repairRecord ? getStepIndex(repairRecord.status) : -1;
  const progressPercent = repairRecord
    ? Math.round(((Math.max(0, currentStepIndex) + 1) / REPAIR_STATUS_STEPS.length) * 100)
    : 0;

  return (
    <section id="status" className="py-16 md:py-24 bg-[#080808] border-b border-[#222222] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
            Real-Time Tracking
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Repair Status Checker
          </h2>
          <p className="mt-3 text-sm text-[#A0A0A0]">
            Enter your OMJ reference code (e.g. <strong className="text-white">OMJ-000101</strong>) or your phone number to inspect real-time workbench diagnostic progress and technician updates.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-6 sm:p-8 shadow-xl mb-8"
        >
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Reference (e.g. OMJ-000101) or Client Phone Number..."
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm font-mono-tech bg-[#121212] border border-[#222222] focus:border-[#00FF66] rounded-xl text-white placeholder-[#555555] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !referenceInput.trim()}
              className="px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] disabled:opacity-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <span>Checking...</span>
              ) : (
                <>
                  <span>Check Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick test prompt for verification */}
          <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-[#A0A0A0] pt-3 border-t border-[#222222]">
            <span>Search by Reference (OMJ-XXXXXX) or Registered Phone Number</span>
            <button
              type="button"
              onClick={() => {
                const demo = storageService.getDemoReference();
                setReferenceInput(demo);
                performSearch(demo);
              }}
              className="text-[#00FF66] hover:underline cursor-pointer"
            >
              Try sample reference: OMJ-000101
            </button>
          </div>
        </motion.div>

        {/* Multi-Ticket Match Selection Banner (when user searches by phone or name) */}
        {matchingTickets.length > 1 && (
          <motion.div
            variants={fadeInScale}
            initial="hidden"
            animate="visible"
            className="mb-6 p-4 rounded-2xl bg-[#121212] border border-[#222222] space-y-3 shadow-lg"
          >
            <span className="text-xs font-bold text-white block">
              Found {matchingTickets.length} Logged Repair Tickets for "{searchedRef}". Select a device to view:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {matchingTickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setRepairRecord(t)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    repairRecord?.reference === t.reference
                      ? "bg-[#18241C] border-[#00FF66] shadow-sm"
                      : "bg-[#0A0A0A] border-[#1E1E1E] hover:border-[#333333]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-xs font-bold text-[#00FF66]">
                        {t.reference}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#161616] text-[#A0A0A0]">
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium mt-1">
                      {t.deviceBrand} {t.deviceModel}
                    </p>
                    <span className="text-[10px] text-[#777777]">{t.problemCategory}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#777777] shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Status Result View */}
        {searched && (
          <div>
            {repairRecord ? (
              <motion.div
                variants={fadeInScale}
                initial="hidden"
                animate="visible"
                className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#A0A0A0] block">Repair Ticket Reference</span>
                      <span className="text-[10px] uppercase font-mono-tech text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-full border border-[#00FF66]/30 font-bold">
                        Live Tracking
                      </span>
                    </div>
                    <span className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-[#00FF66] mt-0.5 block">
                      {repairRecord.reference}
                    </span>
                    <span className="text-xs text-[#A0A0A0] block mt-0.5">
                      Client: <strong className="text-white">{repairRecord.fullName}</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className="text-xs text-[#A0A0A0]">Current Active Stage:</span>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-[#00FF66] bg-[#00FF66]/10 border border-[#00FF66]/30 rounded-xl shadow-[0_0_15px_rgba(0,255,102,0.15)] inline-flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse text-[#00FF66]" />
                      <span>{repairRecord.status}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar (Requirement 1 & 5) */}
                <div className="space-y-2 p-4 rounded-xl bg-[#121212] border border-[#222222]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Overall Repair Progression</span>
                    <span className="font-mono-tech font-bold text-[#00FF66]">
                      Stage {Math.max(1, currentStepIndex + 1)} of {REPAIR_STATUS_STEPS.length} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#1C1C1C] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00C853] to-[#00FF66] transition-all duration-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Device & Ticket Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#121212] border border-[#222222] text-xs">
                  <div>
                    <span className="text-[#A0A0A0] block">Device Information</span>
                    <span className="text-white font-medium">
                      {repairRecord.deviceBrand} {repairRecord.deviceModel}
                    </span>
                    <span className="text-[#777777] text-[11px] block">{repairRecord.deviceType} · {repairRecord.operatingSystem}</span>
                  </div>
                  <div>
                    <span className="text-[#A0A0A0] block">Fault Category</span>
                    <span className="text-red-400 font-medium">{repairRecord.problemCategory}</span>
                    <span className="text-[#777777] text-[11px] block italic truncate">"{repairRecord.description}"</span>
                  </div>
                  <div>
                    <span className="text-[#A0A0A0] block">Last Workbench Update</span>
                    <span className="text-white font-medium font-mono-tech">
                      {new Date(repairRecord.updatedAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* 8-Phase Lifecycle Timeline */}
                <div>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-5 flex items-center justify-between">
                    <span>Repair Lifecycle Phases</span>
                    <span className="text-[#00FF66] font-mono-tech font-normal">
                      ● Active: {repairRecord.status}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {REPAIR_STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div
                          key={step.status}
                          className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                            isCurrent
                              ? "bg-[#161616] border-[#00FF66] shadow-[0_0_15px_-4px_rgba(0,255,102,0.25)]"
                              : isCompleted
                              ? "bg-[#101010] border-[#222222] opacity-80"
                              : "bg-[#0A0A0A] border-[#181818] opacity-40"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono-tech font-bold ${
                              isCurrent
                                ? "bg-[#00FF66] text-[#050505]"
                                : isCompleted
                                ? "bg-emerald-950 text-[#00FF66] border border-[#00FF66]/40"
                                : "bg-[#181818] text-[#555555]"
                            }`}
                          >
                            {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-semibold ${
                                  isCurrent ? "text-[#00FF66]" : isCompleted ? "text-white" : "text-[#777777]"
                                }`}
                              >
                                {step.status}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] uppercase font-mono-tech tracking-wider text-[#00FF66] font-bold">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#A0A0A0] mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Diagnostic Steps from Service Checklist */}
                {repairRecord.checklist && repairRecord.checklist.some((c) => c.completed) && (
                  <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <CheckCircle className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>Verified Workbench Diagnostic Steps</span>
                      </div>
                      <span className="text-[11px] font-mono-tech text-[#00FF66]">
                        {repairRecord.checklist.filter((c) => c.completed).length} / {repairRecord.checklist.length} verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {repairRecord.checklist
                        .filter((c) => c.completed)
                        .map((step) => (
                          <div
                            key={step.id}
                            className="p-2.5 rounded-lg bg-[#0F1410] border border-[#00FF66]/20 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-[#00FF66] shrink-0" />
                              <span className="font-semibold text-white truncate">{step.name}</span>
                            </div>
                            {step.technicianNote && (
                              <p className="text-[11px] text-[#A0A0A0] mt-1 pl-5 italic">
                                {step.technicianNote}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Technician Diagnostic Note */}
                {repairRecord.technicianNotes && (
                  <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Wrench className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span>Technician Diagnostic Notes & Findings</span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed pt-1">
                      {repairRecord.technicianNotes}
                    </p>
                  </div>
                )}

                {/* Milestone History & Audit Timeline (Requirement 1 & 5: See progress perform on ticket) */}
                {repairRecord.statusHistory && repairRecord.statusHistory.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1E1E1E]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white">
                        <History className="w-3.5 h-3.5 text-amber-400" />
                        <span>Technician Progress History & Milestones</span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-[#A0A0A0]">
                        {repairRecord.statusHistory.length} recorded milestones
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {repairRecord.statusHistory.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 rounded-lg bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
                              <strong className="text-white">{m.status}</strong>
                            </div>
                            {m.note && (
                              <p className="text-[11px] text-[#A0A0A0] italic pl-4">
                                "{m.note}"
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-[#777777] font-mono-tech sm:text-right shrink-0">
                            {new Date(m.timestamp).toLocaleString("en-NG", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#222222]">
                  <p className="text-xs text-[#A0A0A0]">
                    Need immediate assistance with this repair?
                  </p>

                  <a
                    href={`https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(
                      BUSINESS_INFO.whatsappPrefilledMessages.repairRef(repairRecord.reference)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={fadeInScale}
                initial="hidden"
                animate="visible"
                className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-8 text-center space-y-4 shadow-xl"
              >
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">No Record Found for &quot;{searchedRef}&quot;</h3>
                <p className="text-xs text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                  We could not find a registered repair ticket matching this reference number or phone number. Please check the code in your confirmation message or contact our Lagos workbench directly.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(
                      `Hello OMJ Repairs, I need help locating my repair status for reference: ${searchedRef}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#121212] border border-[#222222] hover:border-[#00FF66] rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#00FF66]" />
                    <span>Contact Technician on WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
