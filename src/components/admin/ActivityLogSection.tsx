/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  History,
  Activity,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Laptop,
  Download,
  Trash2,
  Check,
  AlertCircle,
  Calendar,
  ExternalLink,
  FileText,
  Printer,
} from "lucide-react";
import { TechnicianActivityLog, ActivityActionType } from "../../types";
import { storageService } from "../../services/storageService";
import { exportAuditLogPdf } from "../../utils/pdfExportHelper";

interface ActivityLogSectionProps {
  logs: TechnicianActivityLog[];
  onSelectTicket?: (reference: string) => void;
  onRefresh?: () => void;
}

export const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({
  logs,
  onSelectTicket,
  onRefresh,
}) => {
  const [filterAction, setFilterAction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedExport, setCopiedExport] = useState(false);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.reference.toLowerCase().includes(q) ||
      log.clientName.toLowerCase().includes(q) ||
      (log.deviceInfo && log.deviceInfo.toLowerCase().includes(q)) ||
      (log.note && log.note.toLowerCase().includes(q)) ||
      log.title.toLowerCase().includes(q);

    let matchesFilter = true;
    if (filterAction === "status_change") {
      matchesFilter = log.action === "status_change";
    } else if (filterAction === "checklist_update") {
      matchesFilter = log.action === "checklist_update";
    } else if (filterAction === "intakes") {
      matchesFilter = log.action === "intake_created" || log.action === "booking_converted";
    } else if (filterAction === "bookings") {
      matchesFilter = log.ticketType === "booking" || log.action === "booking_status_change";
    }

    return matchesSearch && matchesFilter;
  });

  // Calculate audit statistics
  const statusChangesCount = logs.filter((l) => l.action === "status_change").length;
  const checklistCount = logs.filter((l) => l.action === "checklist_update").length;
  const intakeCount = logs.filter(
    (l) => l.action === "intake_created" || l.action === "booking_converted"
  ).length;

  const handleExportPdf = () => {
    const filterLabel =
      filterAction === "status_change"
        ? "Status Stage Transitions"
        : filterAction === "checklist_update"
        ? "Diagnostic Bench Checks"
        : filterAction === "intakes"
        ? "Client Intakes & Converted"
        : "All Technician Activity Logs";
    exportAuditLogPdf(filteredLogs.length > 0 ? filteredLogs : logs, filterLabel);
  };

  const handleCopySummary = () => {
    const textSummary = logs
      .slice(0, 50)
      .map(
        (l) =>
          `[${new Date(l.timestamp).toLocaleString("en-NG")}] [${l.reference}] ${l.title} (Client: ${
            l.clientName
          }) - ${l.note || "No note"}`
      )
      .join("\n");

    navigator.clipboard.writeText(textSummary);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Audit Header Banner */}
      <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
              <History className="w-4 h-4" />
            </div>
            <h2 className="font-display text-lg font-bold text-white">
              Technician Activity & Status Audit Log
            </h2>
          </div>
          <p className="text-xs text-[#A0A0A0] mt-1">
            Immutable audit record tracking every lifecycle transition, diagnostic check, and client note made by the technician.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 text-xs text-white bg-[#141414] hover:bg-[#1A1A1A] border border-[#222222] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Copy audit log text"
          >
            <Check className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>{copiedExport ? "Copied 50 Logs!" : "Copy Text Log"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.25)] flex items-center gap-1.5 cursor-pointer"
            title="Export official printable PDF audit report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Audit PDF</span>
          </button>
        </div>
      </div>

      {/* Audit Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] text-[#777777] uppercase font-bold block">Status Transitions</span>
          <span className="font-mono-tech text-xl font-bold text-[#00FF66]">{statusChangesCount}</span>
          <span className="text-[10px] text-[#666666] block">Stage advancements</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] text-[#777777] uppercase font-bold block">Diagnostic Checks</span>
          <span className="font-mono-tech text-xl font-bold text-amber-400">{checklistCount}</span>
          <span className="text-[10px] text-[#666666] block">Hardware & bench tests</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] text-[#777777] uppercase font-bold block">Intakes & Converted</span>
          <span className="font-mono-tech text-xl font-bold text-purple-400">{intakeCount}</span>
          <span className="text-[10px] text-[#666666] block">New client tickets</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] text-[#777777] uppercase font-bold block">Total Audit Entries</span>
          <span className="font-mono-tech text-xl font-bold text-blue-400">{logs.length}</span>
          <span className="text-[10px] text-[#666666] block">Tracked technician actions</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0D0D0D] border border-[#222222] rounded-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "all", label: "All Audit Actions" },
            { id: "status_change", label: "Status Changes Only" },
            { id: "checklist_update", label: "Bench Diagnostic Checks" },
            { id: "intakes", label: "Ticket Intakes" },
            { id: "bookings", label: "Bookings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterAction(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterAction === tab.id
                  ? "bg-[#00FF66] text-[#050505] font-bold"
                  : "bg-[#141414] text-[#888888] hover:text-white border border-[#222222]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#777777] self-end sm:self-auto font-mono-tech">
          Showing {filteredLogs.length} of {logs.length} entries
        </span>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-[#777777] text-xs bg-[#0D0D0D] border border-[#222222] rounded-2xl space-y-2">
            <History className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-white font-medium">No activity log entries match the current filter.</p>
            <p>Any status change or diagnostic toggle you perform will appear here automatically.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const dateObj = new Date(log.timestamp);
            const formattedTime = dateObj.toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const formattedDate = dateObj.toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const isStatusChange = log.action === "status_change";
            const isChecklist = log.action === "checklist_update";
            const isIntake = log.action === "intake_created" || log.action === "booking_converted";

            return (
              <div
                key={log.id}
                className="bg-[#0D0D0D] border border-[#222222] hover:border-[#333333] rounded-2xl p-4 sm:p-5 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#1A1A1A]">
                  <div className="flex items-center gap-2.5">
                    {/* Action Icon / Tag */}
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isStatusChange
                          ? "bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30"
                          : isChecklist
                          ? "bg-amber-400/10 text-amber-300 border border-amber-400/30"
                          : isIntake
                          ? "bg-purple-400/10 text-purple-300 border border-purple-400/30"
                          : "bg-blue-400/10 text-blue-300 border border-blue-400/30"
                      }`}
                    >
                      {log.action.replace("_", " ")}
                    </span>

                    {/* Ticket Reference Link */}
                    <button
                      type="button"
                      onClick={() => onSelectTicket && onSelectTicket(log.reference)}
                      className="font-mono-tech text-xs font-bold text-white hover:text-[#00FF66] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      title="Open ticket details in workspace"
                    >
                      <span>{log.reference}</span>
                      <ExternalLink className="w-3 h-3 text-[#777777]" />
                    </button>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#777777] font-mono-tech">
                    <Clock className="w-3.5 h-3.5 text-[#555555]" />
                    <span>
                      {formattedDate} at {formattedTime}
                    </span>
                  </div>
                </div>

                {/* Main Action Content */}
                <div className="space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex flex-wrap items-center gap-2">
                    <span>{log.title}</span>
                  </h4>

                  {/* Status Transition Badges (If status change) */}
                  {isStatusChange && log.previousStatus && log.newStatus && (
                    <div className="flex items-center gap-2 pt-1 pb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#141414] text-[#888888] border border-[#222222]">
                        {log.previousStatus}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#00FF66]" />
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c241e] text-[#00FF66] border border-[#00FF66]/30">
                        {log.newStatus}
                      </span>
                    </div>
                  )}

                  {/* Technician Note */}
                  {log.note && (
                    <div className="p-2.5 rounded-xl bg-[#121212] border border-[#1E1E1E] text-xs text-white/90 italic">
                      "{log.note}"
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#777777] pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 font-medium">👤 Client: {log.clientName}</span>
                    {log.deviceInfo && <span>· 💻 {log.deviceInfo}</span>}
                  </div>

                  <span className="text-[10px] text-[#555555] font-mono-tech">
                    Audited by: {log.technician}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
