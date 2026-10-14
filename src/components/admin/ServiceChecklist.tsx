/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Plus,
  RotateCcw,
  Search,
  MessageSquare,
  Sparkles,
  Zap,
  Check,
  Cpu,
  HardDrive,
  ShieldCheck,
  Layers,
  ChevronDown,
} from "lucide-react";
import { DiagnosticCategory, DiagnosticChecklistItem, RepairRequest } from "../../types";
import { storageService } from "../../services/storageService";
import { getClientStatusUpdateWhatsAppUrl } from "../../utils/whatsappHelper";

export interface ServiceChecklistProps {
  repairId: string;
  reference?: string;
  onReferenceChange?: (newReferenceOrId: string) => void;
  onChecklistUpdated?: (updated: DiagnosticChecklistItem[]) => void;
}

const CATEGORIES: ("All" | DiagnosticCategory)[] = [
  "All",
  "Power & Electrical",
  "Memory & Hardware",
  "Storage & Drives",
  "OS & Software",
  "Thermals & Cooling",
  "Bench Stress & Verification",
];

export const ServiceChecklist: React.FC<ServiceChecklistProps> = ({
  repairId,
  reference,
  onReferenceChange,
  onChecklistUpdated,
}) => {
  const activeIdentifier = repairId || reference || "";
  const [checklist, setChecklist] = useState<DiagnosticChecklistItem[]>([]);
  const [currentRepair, setCurrentRepair] = useState<RepairRequest | null>(null);
  const [allRequests, setAllRequests] = useState<RepairRequest[]>([]);
  const [activeCategory, setActiveCategory] = useState<"All" | DiagnosticCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customCat, setCustomCat] = useState<DiagnosticCategory>("Power & Electrical");
  const [customNote, setCustomNote] = useState("");

  const refresh = () => {
    if (!activeIdentifier) return;
    const target = storageService.getRepairById(activeIdentifier);
    setCurrentRepair(target);
    const list = storageService.getChecklistForRepair(activeIdentifier);
    setChecklist(list);
    setAllRequests(storageService.getAllRepairRequests());
    if (onChecklistUpdated) {
      onChecklistUpdated(list);
    }
  };

  useEffect(() => {
    refresh();
    setEditingNoteId(null);
    setShowAddCustom(false);
  }, [repairId, reference]);

  const handleToggle = (stepId: string) => {
    if (!activeIdentifier) return;
    storageService.toggleChecklistItem(activeIdentifier, stepId);
    refresh();
  };

  const handleSaveNote = (stepId: string) => {
    if (!activeIdentifier) return;
    storageService.updateChecklistItemNote(activeIdentifier, stepId, tempNote.trim());
    setEditingNoteId(null);
    refresh();
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !activeIdentifier) return;

    storageService.addCustomChecklistItem(
      activeIdentifier,
      customName.trim(),
      customCat,
      customNote.trim() || undefined
    );
    setCustomName("");
    setCustomNote("");
    setShowAddCustom(false);
    refresh();
  };

  const handleReset = () => {
    if (!activeIdentifier) return;
    const label = currentRepair ? currentRepair.reference : activeIdentifier;
    if (window.confirm(`Reset diagnostic checklist for ${label} to default workbench steps?`)) {
      storageService.resetChecklist(activeIdentifier);
      refresh();
    }
  };

  const handleBatchToggleAll = (targetState: boolean) => {
    if (!activeIdentifier) return;
    const updated = checklist.map((item) => {
      const match = activeCategory === "All" || item.category === activeCategory;
      if (match) {
        return {
          ...item,
          completed: targetState,
          completedAt: targetState ? new Date().toISOString() : undefined,
        };
      }
      return item;
    });

    storageService.updateRepairChecklist(activeIdentifier, updated);
    refresh();
  };

  // Metrics
  const totalCount = checklist.length;
  const completedCount = checklist.filter((item) => item.completed).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Highlight priority checks
  const isHighPriorityCheck = (name: string) => {
    return (
      name.toLowerCase().includes("power supply") ||
      name.toLowerCase().includes("memory integrity") ||
      name.toLowerCase().includes("os corruptness")
    );
  };

  // Filtered items
  const filteredItems = checklist.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.technicianNote && item.technicianNote.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-5">
      {/* Reference Switcher & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00FF66] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Service Checklist
            </span>
            <span className="text-[11px] text-[#A0A0A0]">· Diagnostic Bench</span>
          </div>

          {/* Reference Selector */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs text-[#A0A0A0]">Target Ref:</span>
            {allRequests.length > 1 && onReferenceChange ? (
              <div className="relative inline-block">
                <select
                  value={currentRepair?.id || activeIdentifier}
                  onChange={(e) => onReferenceChange(e.target.value)}
                  className="px-2.5 py-1 text-xs font-mono-tech font-bold text-[#00FF66] bg-[#181818] border border-[#00FF66]/30 rounded-lg focus:outline-none focus:border-[#00FF66] cursor-pointer pr-7"
                >
                  {allRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.reference} — {r.deviceBrand} {r.deviceModel} ({r.fullName})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#00FF66] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <span className="font-mono-tech text-sm font-bold text-[#00FF66] bg-[#181818] px-2 py-0.5 rounded border border-[#222222]">
                {currentRepair?.reference || activeIdentifier}
              </span>
            )}
          </div>
        </div>

        {/* Diagnostic Score & Quick Reset */}
        <div className="flex items-center gap-3">
          <div className="text-left sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5">
              <span className="text-xs font-mono-tech text-[#00FF66] font-bold">
                {completedCount} / {totalCount}
              </span>
              <span className="text-xs text-white font-medium">Passed</span>
            </div>
            <span className="text-[10px] text-[#A0A0A0] block font-mono-tech">
              {completionPercentage}% bench verified
            </span>
          </div>

          {currentRepair && (
            <a
              href={getClientStatusUpdateWhatsAppUrl(currentRepair)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#25D366] hover:bg-[#25D366]/20 bg-[#162219] border border-[#25D366]/40 rounded-lg transition-colors cursor-pointer"
              title="Send Diagnostic Checklist Report to Client via WhatsApp"
              aria-label="Send Diagnostic Checklist Report to Client via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
            </a>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-[#A0A0A0] hover:text-white bg-[#181818] border border-[#222222] rounded-lg transition-colors cursor-pointer"
            title="Reset checklist to standard diagnostic steps"
            aria-label="Reset checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar with Glow */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#181818] rounded-full h-2 overflow-hidden border border-[#222222]">
          <div
            className="bg-gradient-to-r from-[#00C853] via-[#00FF66] to-emerald-300 h-full transition-all duration-300 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Quick Category Tabs & Search Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#1c241e] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                  : "text-[#A0A0A0] hover:text-white hover:bg-[#181818]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#A0A0A0] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search diagnostic check (e.g., Power Supply, Memory, OS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0D0D0D] border border-[#222222] rounded-lg text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
            />
          </div>

          {/* Quick Batch Actions */}
          <button
            type="button"
            onClick={() => handleBatchToggleAll(true)}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-white bg-[#181818] hover:bg-[#222222] border border-[#222222] rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            title="Mark all visible checks as verified"
          >
            Pass All
          </button>
          <button
            type="button"
            onClick={() => handleBatchToggleAll(false)}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-[#A0A0A0] hover:text-white bg-[#181818] hover:bg-[#222222] border border-[#222222] rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            title="Clear verified state on all visible checks"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Checklist Items with Dedicated Sliding Toggles */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A0A0A0] bg-[#0D0D0D] rounded-lg border border-[#222222]">
            No diagnostic steps found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditingNote = editingNoteId === item.id;
            const isPriority = isHighPriorityCheck(item.name);

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.completed
                    ? "bg-[#0c1610] border-[#00FF66]/30 shadow-[0_0_12px_-5px_rgba(0,255,102,0.15)]"
                    : "bg-[#0D0D0D] border-[#222222] hover:border-[#333333]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Step Info & Priority Marker */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-semibold ${
                          item.completed ? "text-white" : "text-[#CCCCCC]"
                        }`}
                      >
                        {item.name}
                      </span>

                      {isPriority && (
                        <span className="text-[10px] uppercase font-mono-tech px-1.5 py-0.2 rounded bg-emerald-950 text-[#00FF66] border border-[#00FF66]/30">
                          Core Test
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-[#A0A0A0] mt-1">
                      <span className="font-mono-tech">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-mono-tech font-medium ${
                          item.completed ? "text-[#00FF66]" : "text-[#666666]"
                        }`}
                      >
                        {item.completed ? "Verified / Passed" : "Pending Inspection"}
                      </span>
                      {item.completed && item.completedAt && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#888888] font-mono-tech">
                            {new Date(item.completedAt).toLocaleTimeString("en-NG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Tactile Toggle Switch & Note Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Note Action */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isEditingNote) {
                          setEditingNoteId(null);
                        } else {
                          setEditingNoteId(item.id);
                          setTempNote(item.technicianNote || "");
                        }
                      }}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        item.technicianNote
                          ? "text-[#00FF66] bg-[#162219] border border-[#00FF66]/30"
                          : "text-[#666666] hover:text-[#A0A0A0] bg-[#161616] border border-[#222222]"
                      }`}
                      title={item.technicianNote ? "Edit note" : "Add bench note"}
                      aria-label={item.technicianNote ? "Edit diagnostic note" : "Add diagnostic note"}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Tactile Toggle Switch Control */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.completed}
                      onClick={() => handleToggle(item.id)}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00FF66] ${
                        item.completed ? "bg-[#00FF66]" : "bg-[#222222]"
                      }`}
                      aria-label={`Toggle verification status for ${item.name}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full bg-[#050505] shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                          item.completed ? "translate-x-5 text-[#00FF66]" : "translate-x-0 text-transparent"
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Technician Note Preview / Inline Edit */}
                {item.technicianNote && !isEditingNote && (
                  <div className="mt-2.5 text-[11px] text-[#A0A0A0] bg-[#151515] p-2 rounded-lg border border-[#222222] flex items-start gap-2">
                    <span className="text-[#00FF66] font-semibold shrink-0">Bench Note:</span>
                    <span className="italic">{item.technicianNote}</span>
                  </div>
                )}

                {isEditingNote && (
                  <div className="mt-2.5 space-y-2 bg-[#151515] p-2.5 rounded-lg border border-[#00FF66]/40">
                    <textarea
                      rows={2}
                      placeholder="Add diagnostic reading or bench finding (e.g. 19.5V confirmed, MemTest 0 errors, DISM clean)..."
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      className="w-full p-2 text-xs bg-[#0D0D0D] border border-[#222222] rounded text-white focus:outline-none focus:border-[#00FF66]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveNote(item.id)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded transition-colors cursor-pointer"
                      >
                        Save Note
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 text-[11px] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Diagnostic Step Toggle */}
      <div className="pt-2 border-t border-[#222222]">
        {!showAddCustom ? (
          <button
            type="button"
            onClick={() => setShowAddCustom(true)}
            className="w-full py-2.5 text-xs font-semibold text-[#00FF66] hover:text-white bg-[#0D0D0D] hover:bg-[#181818] border border-[#222222] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Diagnostic Step to {reference}</span>
          </button>
        ) : (
          <form
            onSubmit={handleAddCustom}
            className="p-3 bg-[#0D0D0D] border border-[#00FF66]/30 rounded-lg space-y-3 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span>New Diagnostic Step for {reference}</span>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-[#A0A0A0] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Step Name (e.g. Ultrasonic PCB Clean)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="px-2.5 py-1.5 text-xs bg-[#181818] border border-[#222222] rounded text-white focus:outline-none focus:border-[#00FF66]"
              />

              <select
                value={customCat}
                onChange={(e) => setCustomCat(e.target.value as DiagnosticCategory)}
                className="px-2.5 py-1.5 text-xs bg-[#181818] border border-[#222222] rounded text-white focus:outline-none focus:border-[#00FF66]"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Initial diagnostic reading / note (Optional)"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#222222] rounded text-white focus:outline-none focus:border-[#00FF66]"
            />

            <button
              type="submit"
              className="w-full py-1.5 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded transition-colors cursor-pointer"
            >
              Add Step to Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
