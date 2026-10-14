/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  X,
  Wrench,
  Download,
  CheckCircle,
  Clock,
  Search,
  MessageSquare,
  Phone,
  RefreshCw,
  ExternalLink,
  ListChecks,
  Activity,
} from "lucide-react";
import { RepairLifecycleStatus, RepairRequest, BookingRequest } from "../../types";
import { storageService } from "../../services/storageService";
import { REPAIR_STATUS_STEPS, BUSINESS_INFO } from "../../data/constants";
import { ServiceChecklist } from "./ServiceChecklist";
import { getClientStatusUpdateWhatsAppUrl } from "../../utils/whatsappHelper";

interface TechnicianDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReferenceForStatus: (ref: string) => void;
  initialReference?: string | null;
}

export const TechnicianDrawer: React.FC<TechnicianDrawerProps> = ({
  isOpen,
  onClose,
  onSelectReferenceForStatus,
  initialReference,
}) => {
  const [activeTab, setActiveTab] = useState<"repairs" | "bookings">("repairs");
  const [ticketViewMode, setTicketViewMode] = useState<"checklist" | "status">("checklist");
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<RepairRequest | null>(null);
  const [newStatus, setNewStatus] = useState<RepairLifecycleStatus>("Diagnosis in Progress");
  const [statusNote, setStatusNote] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");

  const loadData = () => {
    const all = storageService.getAllRepairRequests();
    setRepairs(all);
    setBookings(storageService.getAllBookings());
    setSelectedRepair((prev) => {
      if (!prev) return null;
      return all.find((r) => r.id === prev.id || r.reference === prev.reference) || prev;
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialReference) {
        const found = storageService.getRepairById(initialReference);
        if (found) {
          setSelectedRepair(found);
          setNewStatus(found.status);
          setStatusNote(found.technicianNotes || "");
          setActiveTab("repairs");
        }
      }
    }
  }, [isOpen, initialReference]);

  if (!isOpen) return null;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepair) return;

    const updated = storageService.updateRepairStatus(
      selectedRepair.reference,
      newStatus,
      statusNote.trim() || undefined
    );

    if (updated) {
      setSelectedRepair(updated);
      setUpdateFeedback("Status successfully updated!");
      loadData();
      setTimeout(() => setUpdateFeedback(""), 2500);
    }
  };

  const handleExportData = () => {
    const data = storageService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omj-repairs-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="technician-portal-title"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0D0D] border-l border-[#222222] w-full max-w-2xl h-full flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="p-5 border-b border-[#222222] flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 id="technician-portal-title" className="font-display text-base font-bold text-white">
                OMJ Technician Workspace
              </h2>
              <span className="text-[11px] font-mono-tech text-[#A0A0A0]">
                Workbench Queue & Ticket Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="p-2 text-[#A0A0A0] hover:text-[#00FF66] bg-[#181818] border border-[#222222] rounded-lg transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              title="Export database JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#A0A0A0] hover:text-white bg-[#181818] border border-[#222222] rounded-lg cursor-pointer"
              aria-label="Close Technician Workspace"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 border-b border-[#222222] flex gap-4 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab("repairs");
              setSelectedRepair(null);
            }}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === "repairs"
                ? "text-[#00FF66] border-b-2 border-[#00FF66] font-semibold"
                : "text-[#A0A0A0] hover:text-white"
            }`}
          >
            Repair Requests ({repairs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("bookings");
              setSelectedRepair(null);
            }}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === "bookings"
                ? "text-[#00FF66] border-b-2 border-[#00FF66] font-semibold"
                : "text-[#A0A0A0] hover:text-white"
            }`}
          >
            Scheduled Bookings ({bookings.length})
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === "repairs" ? (
            selectedRepair ? (
              /* Detail / Update Mode */
              <div className="space-y-5 animate-in fade-in duration-150">
                <button
                  onClick={() => setSelectedRepair(null)}
                  className="text-xs text-[#00FF66] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ← Back to repair tickets
                </button>

                <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-lg font-bold text-[#00FF66]">
                      {selectedRepair.reference}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs rounded bg-[#181818] text-white border border-[#222222]">
                      {selectedRepair.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#A0A0A0] block">Customer:</span>
                      <span className="text-white font-medium">{selectedRepair.fullName}</span>
                    </div>
                    <div>
                      <span className="text-[#A0A0A0] block">Contact:</span>
                      <span className="text-white font-medium">{selectedRepair.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#A0A0A0] block">Device:</span>
                      <span className="text-white font-medium">
                        {selectedRepair.deviceBrand} {selectedRepair.deviceModel} ({selectedRepair.deviceType})
                      </span>
                    </div>
                    <div>
                      <span className="text-[#A0A0A0] block">OS:</span>
                      <span className="text-white font-medium">{selectedRepair.operatingSystem}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#222222] text-xs">
                    <span className="text-[#A0A0A0] block">Reported Fault:</span>
                    <p className="text-white mt-0.5">{selectedRepair.description}</p>
                  </div>
                </div>

                {/* Ticket Navigation Tabs */}
                <div className="flex items-center gap-2 p-1 bg-[#121212] border border-[#222222] rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTicketViewMode("checklist")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      ticketViewMode === "checklist"
                        ? "bg-[#1c241e] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                        : "text-[#A0A0A0] hover:text-white"
                    }`}
                  >
                    <ListChecks className="w-4 h-4" />
                    <span>Service Checklist</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketViewMode("status")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      ticketViewMode === "status"
                        ? "bg-[#1c241e] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                        : "text-[#A0A0A0] hover:text-white"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Lifecycle & Stage</span>
                  </button>
                </div>

                {/* WhatsApp Client Direct Sync Card (Always accessible for technician) */}
                <div className="p-4 rounded-xl bg-[#0c1810] border border-[#25D366]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
                      <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider">
                        WhatsApp Client Sync
                      </span>
                    </div>
                    <span className="text-[11px] font-mono-tech text-white">
                      {selectedRepair.whatsapp || selectedRepair.phone}
                    </span>
                  </div>

                  <p className="text-xs text-[#A0A0A0]">
                    Notify <strong className="text-white">{selectedRepair.fullName}</strong> on WhatsApp. Sends current stage (
                    <span className="text-[#00FF66] font-semibold">{selectedRepair.status}</span>
                    ), diagnostic findings, and live tracking link with one tap.
                  </p>

                  <a
                    href={getClientStatusUpdateWhatsAppUrl(selectedRepair)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-[#050505] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.25)] cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send Status Update to Client via WhatsApp</span>
                  </a>
                </div>

                {ticketViewMode === "checklist" ? (
                  /* Dedicated Service Checklist Component */
                  <ServiceChecklist
                    repairId={selectedRepair.id}
                    reference={selectedRepair.reference}
                    onReferenceChange={(newRefOrId) => {
                      const found = repairs.find(
                        (r) => r.id === newRefOrId || r.reference.toUpperCase() === newRefOrId.toUpperCase()
                      );
                      if (found) {
                        setSelectedRepair(found);
                        setNewStatus(found.status);
                        setStatusNote(found.technicianNotes || "");
                      }
                    }}
                    onChecklistUpdated={() => loadData()}
                  />
                ) : (
                  /* Status Update Form */
                  <form
                    onSubmit={handleUpdateStatus}
                    className="p-4 rounded-xl bg-[#121212] border border-[#00FF66]/30 space-y-4"
                  >
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                      Advance Lifecycle Stage
                    </h4>

                    {updateFeedback && (
                      <div className="p-3 rounded-lg bg-emerald-950/80 border border-[#00FF66]/50 text-[#00FF66] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span className="font-semibold">{updateFeedback}</span>
                        </div>
                        <a
                          href={getClientStatusUpdateWhatsAppUrl(selectedRepair)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] font-bold text-[#050505] bg-[#25D366] hover:bg-[#20ba5a] rounded transition-colors inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                        >
                          <MessageSquare className="w-3 h-3 fill-current" />
                          <span>WhatsApp Client</span>
                        </a>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-[#A0A0A0]">Select New Status</label>
                        <span className="text-[10px] text-[#777777]">Tap to quick-select</span>
                      </div>

                      {/* Quick stage selector pills */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {REPAIR_STATUS_STEPS.map((s) => (
                          <button
                            key={s.status}
                            type="button"
                            onClick={() => setNewStatus(s.status)}
                            className={`px-2 py-1 text-[10px] font-medium rounded transition-colors cursor-pointer ${
                              newStatus === s.status
                                ? "bg-[#00FF66] text-[#050505] font-bold shadow-sm"
                                : "bg-[#181818] text-[#A0A0A0] hover:text-white border border-[#222222]"
                            }`}
                          >
                            {s.status}
                          </button>
                        ))}
                      </div>

                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as RepairLifecycleStatus)}
                        className="w-full px-3 py-2 text-xs bg-[#0D0D0D] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                      >
                        {REPAIR_STATUS_STEPS.map((s) => (
                          <option key={s.status} value={s.status}>
                            {s.status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A0A0A0] mb-1">
                        Technician Diagnostic Note (Shown on status tracker & WhatsApp update)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g., Completed motherboard rail testing. NVMe drive replaced, currently restoring Windows 11."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#0D0D0D] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors cursor-pointer"
                      >
                        Save Status
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectReferenceForStatus(selectedRepair.reference);
                          onClose();
                        }}
                        className="text-xs text-[#A0A0A0] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Live in Status Checker</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Repairs List */
              <div className="space-y-3">
                {repairs.length === 0 ? (
                  <p className="text-xs text-[#A0A0A0] text-center py-10">No repair tickets in queue.</p>
                ) : (
                  repairs.map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => {
                        setSelectedRepair(rep);
                        setNewStatus(rep.status);
                        setStatusNote(rep.technicianNotes || "");
                      }}
                      className="p-4 rounded-xl bg-[#121212] border border-[#222222] hover:border-[#00FF66]/50 cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono-tech font-bold text-[#00FF66]">
                          {rep.reference}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#181818] text-white">
                          {rep.status}
                        </span>
                      </div>

                      <div className="text-xs">
                        <span className="text-white font-medium block">
                          {rep.fullName} · {rep.deviceBrand} {rep.deviceModel}
                        </span>
                        <span className="text-[#A0A0A0] line-clamp-1">{rep.description}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#222222] text-[11px]">
                        <span className="text-[#A0A0A0] flex items-center gap-1.5">
                          <ListChecks className="w-3 h-3 text-[#00FF66]" />
                          <span className="font-mono-tech">
                            {rep.checklist?.filter((c) => c.completed).length || 0} /{" "}
                            {rep.checklist?.length || 13} checks verified
                          </span>
                        </span>
                        <span className="text-[#777777] font-mono-tech">
                          {new Date(rep.createdAt).toLocaleDateString("en-NG")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          ) : (
            /* Bookings List */
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <p className="text-xs text-[#A0A0A0] text-center py-10">No scheduled bookings yet.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-[#121212] border border-[#222222] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech font-bold text-white">{b.reference}</span>
                      <span className="text-[#00FF66] font-mono-tech">{b.status}</span>
                    </div>

                    <div>
                      <span className="text-white font-semibold block">{b.fullName} ({b.phone})</span>
                      <span className="text-[#A0A0A0]">{b.device} · {b.problem}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
                      <span>{b.preferredDate} · {b.preferredTime}</span>
                      <span className="text-white">{b.servicePreference}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
