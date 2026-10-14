/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Wrench,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  Phone,
  ExternalLink,
  ListChecks,
  Activity,
  Plus,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Laptop,
  Calendar,
  Shield,
  Filter,
  Check,
  Eye,
  X,
  Lock,
  Unlock,
  KeyRound,
  ChevronRight,
  User,
  Hash,
  ArrowRight,
  History,
} from "lucide-react";
import { RepairLifecycleStatus, RepairRequest, BookingRequest, ProblemCategory, TechnicianActivityLog } from "../../types";
import { storageService } from "../../services/storageService";
import { REPAIR_STATUS_STEPS, BUSINESS_INFO, PROBLEM_CATEGORIES } from "../../data/constants";
import { ServiceChecklist } from "./ServiceChecklist";
import { ActivityLogSection } from "./ActivityLogSection";
import {
  getClientStatusUpdateWhatsAppUrl,
  cleanPhoneNumberForWhatsApp,
} from "../../utils/whatsappHelper";

interface AdminPortalProps {
  onExit: () => void;
  initialReference?: string | null;
  onViewClientTracking?: (ref: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onExit,
  initialReference,
  onViewClientTracking,
}) => {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("omj_admin_authenticated") === "true";
    }
    return false;
  });
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [showPasscodeText, setShowPasscodeText] = useState(false);

  // Settings / Passcode Change Modal
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [passcodeModalError, setPasscodeModalError] = useState("");
  const [passcodeChangeSuccess, setPasscodeChangeSuccess] = useState(false);
  const [currentActivePasscode, setCurrentActivePasscode] = useState<string>(() => storageService.getAdminPasscode());
  const [showCurrentPasscode, setShowCurrentPasscode] = useState(false);

  // Responsive Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState("");

  // Notification trigger feedback
  const [notificationFeedback, setNotificationFeedback] = useState("");

  // --- WORKSPACE STATE ---
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [activityLogs, setActivityLogs] = useState<TechnicianActivityLog[]>([]);
  const [selectedRepair, setSelectedRepair] = useState<RepairRequest | null>(null);
  const [activeTab, setActiveTab] = useState<"repairs" | "bookings" | "activity">("repairs");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [bookingFilter, setBookingFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [ticketSubTab, setTicketSubTab] = useState<"status" | "checklist" | "audit">("status");

  // Selected Booking Modal / Detail state
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  // Status form state
  const [newStatus, setNewStatus] = useState<RepairLifecycleStatus>("Diagnosis in Progress");
  const [statusNote, setStatusNote] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");

  // New Walk-in Intake Modal state
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [intakeForm, setIntakeForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    whatsapp: "",
    deviceType: "Laptop" as RepairRequest["deviceType"],
    deviceBrand: "",
    deviceModel: "",
    operatingSystem: "Windows 11" as RepairRequest["operatingSystem"],
    problemCategory: "Won't Boot" as ProblemCategory,
    description: "",
    startedWhen: "Recent fault",
    triedAlready: "None",
    preferredContactMethod: "WhatsApp" as RepairRequest["preferredContactMethod"],
    preferredDate: new Date().toISOString().split("T")[0],
  });
  const [intakeSuccess, setIntakeSuccess] = useState<RepairRequest | null>(null);

  const loadData = () => {
    const allRepairs = storageService.getAllRepairRequests();
    const allBookings = storageService.getAllBookings();
    const allLogs = storageService.getActivityLogs();
    setRepairs(allRepairs);
    setBookings(allBookings);
    setActivityLogs(allLogs);

    setSelectedRepair((prev) => {
      if (!prev) {
        if (initialReference) {
          const match = allRepairs.find(
            (r) => r.id === initialReference || r.reference.toUpperCase() === initialReference.toUpperCase()
          );
          if (match) {
            setNewStatus(match.status);
            setStatusNote(match.technicianNotes || "");
            return match;
          }
        }
        return allRepairs[0] || null;
      }
      const updated = allRepairs.find((r) => r.id === prev.id || r.reference === prev.reference);
      return updated || prev;
    });

    if (selectedBooking) {
      const refreshedBooking = allBookings.find((b) => b.id === selectedBooking.id);
      if (refreshedBooking) setSelectedBooking(refreshedBooking);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const handleLiveActivity = () => {
        setActivityLogs(storageService.getActivityLogs());
      };
      window.addEventListener("omj_activity_logged", handleLiveActivity);
      window.addEventListener("omj_data_updated", loadData);
      return () => {
        window.removeEventListener("omj_activity_logged", handleLiveActivity);
        window.removeEventListener("omj_data_updated", loadData);
      };
    }
  }, [initialReference, isAuthenticated]);

  // Handle Authentication Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageService.verifyAdminPasscode(passcodeInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("omj_admin_authenticated", "true");
      setPasscodeError("");
      setPasscodeInput("");
      loadData();
    } else {
      setPasscodeError("Invalid passcode. Please enter the master technician passcode.");
    }
  };

  // Handle Logout / Lock
  const handleLockPortal = () => {
    sessionStorage.removeItem("omj_admin_authenticated");
    setIsAuthenticated(false);
    setPasscodeInput("");
  };

  // Responsive Database Refresh
  const handleRefreshDatabase = () => {
    setIsRefreshing(true);
    loadData();
    const curRepairs = storageService.getAllRepairRequests();
    const curBookings = storageService.getAllBookings();
    const curLogs = storageService.getActivityLogs();
    setRefreshToast(
      `Database Refreshed! Synced ${curRepairs.length} repair tickets, ${curBookings.length} bookings, and ${curLogs.length} audit logs.`
    );
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
    setTimeout(() => {
      setRefreshToast("");
    }, 3500);
  };

  // Handle Passcode Update
  const handleChangePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeModalError("");
    const trimmed = newPasscode.trim();
    if (trimmed.length < 4) {
      setPasscodeModalError("New passcode must be at least 4 characters long.");
      return;
    }
    if (trimmed !== confirmPasscode.trim()) {
      setPasscodeModalError("Passcodes do not match. Please verify your confirmation code.");
      return;
    }
    storageService.setAdminPasscode(trimmed);
    setCurrentActivePasscode(trimmed);
    storageService.logActivity({
      reference: "SECURITY-KEY",
      ticketType: "repair",
      action: "status_change",
      title: "Master Passcode Changed by Owner",
      note: "Admin master access key successfully updated in storage",
      clientName: "Technician Admin",
      technician: "Lead Technician (OMJ)",
    });
    setPasscodeChangeSuccess(true);
    setTimeout(() => {
      setPasscodeChangeSuccess(false);
      setShowPasscodeModal(false);
      setNewPasscode("");
      setConfirmPasscode("");
      setPasscodeModalError("");
    }, 1800);
  };

  // Reset Passcode to Default OMJ2026
  const handleResetPasscodeDefault = () => {
    storageService.resetAdminPasscode();
    setCurrentActivePasscode("OMJ2026");
    storageService.logActivity({
      reference: "SECURITY-KEY",
      ticketType: "repair",
      action: "status_change",
      title: "Master Passcode Reset to Default (OMJ2026)",
      note: "Admin passcode restored to default credentials",
      clientName: "Technician Admin",
      technician: "Lead Technician (OMJ)",
    });
    setPasscodeChangeSuccess(true);
    setTimeout(() => {
      setPasscodeChangeSuccess(false);
      setShowPasscodeModal(false);
      setNewPasscode("");
      setConfirmPasscode("");
      setPasscodeModalError("");
    }, 1800);
  };

  const handleSelectTicket = (repair: RepairRequest) => {
    setSelectedRepair(repair);
    setNewStatus(repair.status);
    setStatusNote(repair.technicianNotes || "");
    setSaveFeedback("");
    setNotificationFeedback("");
    setActiveTab("repairs");
  };

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
      setSaveFeedback(`Status updated to "${newStatus}"! Client tracking page updated.`);
      setNotificationFeedback(
        `📱 Dispatched SMS to ${updated.phone} · 📧 Dispatched Email to ${updated.email}`
      );
      loadData();
      setTimeout(() => setSaveFeedback(""), 5000);
      setTimeout(() => setNotificationFeedback(""), 6000);
    }
  };

  const handleQuickAdvance = (stage: RepairLifecycleStatus) => {
    if (!selectedRepair) return;
    setNewStatus(stage);
    const updated = storageService.updateRepairStatus(
      selectedRepair.reference,
      stage,
      statusNote.trim() || selectedRepair.technicianNotes || undefined
    );
    if (updated) {
      setSelectedRepair(updated);
      setSaveFeedback(`Stage advanced to "${stage}"! Client tracking page updated.`);
      setNotificationFeedback(
        `📱 Dispatched SMS to ${updated.phone} · 📧 Dispatched Email to ${updated.email}`
      );
      loadData();
      setTimeout(() => setSaveFeedback(""), 5000);
      setTimeout(() => setNotificationFeedback(""), 6000);
    }
  };

  const handleBookingStatusChange = (bookingId: string, status: BookingRequest["status"]) => {
    const updated = storageService.updateBookingStatus(bookingId, status);
    if (updated) {
      setSelectedBooking(updated);
      loadData();
    }
  };

  const handleConvertBookingToTicket = (booking: BookingRequest) => {
    const created = storageService.convertBookingToRepairRequest(booking.id);
    if (created) {
      loadData();
      setSelectedBooking(null);
      setSelectedRepair(created);
      setNewStatus(created.status);
      setStatusNote(created.technicianNotes || "");
      setActiveTab("repairs");
    }
  };

  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.fullName.trim() || !intakeForm.phone.trim() || !intakeForm.deviceBrand.trim()) {
      return;
    }

    const created = storageService.createRepairRequest({
      fullName: intakeForm.fullName.trim(),
      phone: intakeForm.phone.trim(),
      email: intakeForm.email.trim() || "walkin@omjrepairs.com",
      whatsapp: intakeForm.whatsapp.trim() || intakeForm.phone.trim(),
      deviceType: intakeForm.deviceType,
      deviceBrand: intakeForm.deviceBrand.trim(),
      deviceModel: intakeForm.deviceModel.trim() || "Standard",
      operatingSystem: intakeForm.operatingSystem,
      problemCategory: intakeForm.problemCategory,
      description: intakeForm.description.trim() || "Walk-in client drop-off for diagnosis.",
      startedWhen: intakeForm.startedWhen.trim(),
      triedAlready: intakeForm.triedAlready.trim(),
      preferredContactMethod: intakeForm.preferredContactMethod,
      preferredDate: intakeForm.preferredDate,
      imageUrls: [],
    });

    setIntakeSuccess(created);
    loadData();
    setSelectedRepair(created);
    setNewStatus(created.status);
    setStatusNote(created.technicianNotes || "");
  };

  // --- FILTERED REPAIRS (via Global / Dedicated Search Bar) ---
  const filteredRepairs = repairs.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.reference.toLowerCase().includes(q) ||
      r.fullName.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      `${r.deviceBrand} ${r.deviceModel}`.toLowerCase().includes(q) ||
      r.problemCategory.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- FILTERED BOOKINGS ---
  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.reference.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.device.toLowerCase().includes(q) ||
      b.problem.toLowerCase().includes(q);

    const matchesFilter = bookingFilter === "All" || b.status === bookingFilter;
    return matchesSearch && matchesFilter;
  });

  // Workbench counts
  const activeCount = repairs.filter((r) => !["Completed", "Cancelled"].includes(r.status)).length;
  const readyCount = repairs.filter((r) => r.status === "Ready for Collection").length;
  const completedCount = repairs.filter((r) => r.status === "Completed").length;

  // ==========================================
  // VIEW 1: AUTHENTICATION GATE (OWNER ACCESS)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center mx-auto text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-mono-tech text-[#00FF66] uppercase font-bold tracking-widest">
                Owner Authentication Gate
              </span>
              <h1 className="font-display text-2xl font-bold text-white mt-1">
                Technician Admin Portal
              </h1>
              <p className="text-xs text-[#A0A0A0] mt-1.5 leading-relaxed">
                Restricted access. Only the authorized technician can record client repair progress and modify workshop data.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {passcodeError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A0A0A0] mb-1.5">
                Master Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscodeText ? "text" : "password"}
                  autoFocus
                  required
                  placeholder="Enter technician passcode..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#141414] border border-[#222222] rounded-xl text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66] font-mono-tech"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscodeText(!showPasscodeText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#777777] hover:text-white cursor-pointer px-1 py-0.5"
                >
                  {showPasscodeText ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-[11px] text-[#666666] mt-1.5 flex items-center justify-between">
                <span>
                  {storageService.isCustomPasscodeSet() ? (
                    <span className="text-amber-400 font-medium">Custom Master Passcode Active</span>
                  ) : (
                    <span>Default passcode: <strong className="text-[#00FF66] font-mono-tech">OMJ2026</strong></span>
                  )}
                </span>
                <span>(Changeable inside)</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Command Center</span>
            </button>
          </form>

          <div className="pt-2 border-t border-[#1C1C1C] text-center">
            <button
              onClick={onExit}
              className="text-xs text-[#A0A0A0] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Customer Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN COMMAND CENTER
  // ==========================================
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col antialiased">
      {/* Top Header Bar */}
      <header className="bg-[#0D0D0D] border-b border-[#222222] sticky top-0 z-40 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Left Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 text-[#A0A0A0] hover:text-white bg-[#121212] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Exit Admin and View Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Customer Website</span>
          </button>

          <div className="flex items-center gap-2 border-l border-[#222222] pl-3">
            <div className="w-7 h-7 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">OMJ Repairs</span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30 font-bold uppercase">
                  Technician Portal
                </span>
              </div>
              <span className="text-[11px] text-[#A0A0A0]">Owner Workbench & Client Status Center</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Requirement 2) */}
        <div className="flex-1 max-w-lg min-w-[240px] mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search logged tickets by Ref (e.g. OMJ-000101), Name, Phone, Brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#141414] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:outline-none focus:border-[#00FF66] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIntakeSuccess(null);
              setShowIntakeModal(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Walk-in Intake</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentActivePasscode(storageService.getAdminPasscode());
              setPasscodeModalError("");
              setNewPasscode("");
              setConfirmPasscode("");
              setShowPasscodeModal(true);
            }}
            className="p-2 text-[#A0A0A0] hover:text-[#00FF66] bg-[#121212] border border-[#222222] hover:border-[#00FF66]/50 rounded-lg transition-colors cursor-pointer"
            title="Change Master Passcode"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRefreshDatabase}
            disabled={isRefreshing}
            className={`p-2 text-[#A0A0A0] hover:text-[#00FF66] bg-[#121212] border border-[#222222] hover:border-[#00FF66]/50 rounded-lg transition-all cursor-pointer ${
              isRefreshing ? "border-[#00FF66] bg-[#00FF66]/10 text-[#00FF66]" : ""
            }`}
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#00FF66]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleLockPortal}
            className="p-2 text-red-400 hover:text-red-300 bg-[#161010] border border-red-900/40 rounded-lg transition-colors cursor-pointer"
            title="Lock Admin Portal (Sign Out)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Responsive Refresh Feedback Banner */}
      {refreshToast && (
        <div className="bg-emerald-950/90 border-b border-[#00FF66]/40 px-4 sm:px-6 py-2 flex items-center justify-between text-xs text-[#00FF66] animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF66]" />
            <span className="font-semibold">{refreshToast}</span>
          </div>
          <button
            onClick={() => setRefreshToast("")}
            className="text-[#A0A0A0] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats & Results Bar */}
      <div className="bg-[#0A0A0A] border-b border-[#222222] px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs overflow-x-auto gap-4">
        <div className="flex items-center gap-6 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0]">Active Repairs:</span>
            <span className="font-mono-tech font-bold text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded">
              {activeCount} active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0]">Ready for Pickup:</span>
            <span className="font-mono-tech font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              {readyCount} devices
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0]">Completed:</span>
            <span className="font-mono-tech font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
              {completedCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0]">Booked Sessions:</span>
            <span className="font-mono-tech font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
              {bookings.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#A0A0A0]">Audit Logs:</span>
            <span className="font-mono-tech font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
              {activityLogs.length} tracked
            </span>
          </div>
        </div>

        {searchQuery && (
          <span className="text-[11px] text-[#A0A0A0] shrink-0 font-mono-tech">
            Search: <strong className="text-white">"{searchQuery}"</strong> ({filteredRepairs.length} repair tickets, {filteredBookings.length} bookings)
          </span>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Queue & Client List */}
        <aside className="w-full lg:w-96 border-r border-[#222222] bg-[#0A0A0A] flex flex-col shrink-0 max-h-screen lg:max-h-[calc(100vh-105px)] overflow-hidden">
          {/* Main Tab Toggle (Tickets / Bookings / Audit Log) */}
          <div className="p-2 border-b border-[#222222] grid grid-cols-3 gap-1.5 bg-[#0C0C0C]">
            <button
              onClick={() => setActiveTab("repairs")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "repairs"
                  ? "bg-[#181818] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                  : "text-[#A0A0A0] hover:text-white"
              }`}
            >
              <Laptop className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tickets ({filteredRepairs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-[#181818] text-purple-400 border border-purple-500/40 shadow-sm"
                  : "text-[#A0A0A0] hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Bookings ({filteredBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("activity")}
              className={`py-2 px-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                activeTab === "activity"
                  ? "bg-[#181818] text-amber-400 border border-amber-500/40 shadow-sm"
                  : "text-[#A0A0A0] hover:text-white"
              }`}
              title="Audit trail of all status changes & technician actions"
            >
              <History className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Audit ({activityLogs.length})</span>
            </button>
          </div>

          {activeTab === "repairs" ? (
            <>
              {/* Filter Pills for Repairs */}
              <div className="p-3 border-b border-[#222222] space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {["All", "Diagnosis in Progress", "Repair in Progress", "Ready for Collection", "Completed"].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2 py-1 text-[10px] rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                          statusFilter === st
                            ? "bg-[#00FF66] text-[#050505] font-bold"
                            : "bg-[#141414] text-[#888888] hover:text-white border border-[#222222]"
                        }`}
                      >
                        {st === "All" ? "All Stages" : st}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Repair Requests List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#181818]">
                {filteredRepairs.length === 0 ? (
                  <div className="p-8 text-center text-[#777777] text-xs space-y-2">
                    <AlertCircle className="w-6 h-6 mx-auto opacity-50" />
                    <p>No repair tickets found matching "{searchQuery}".</p>
                  </div>
                ) : (
                  filteredRepairs.map((r) => {
                    const isSelected = selectedRepair?.id === r.id;
                    const verifiedCount = r.checklist?.filter((c) => c.completed).length || 0;
                    const totalChecks = r.checklist?.length || 11;

                    return (
                      <div
                        key={r.id}
                        onClick={() => handleSelectTicket(r)}
                        className={`p-3.5 transition-colors cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-[#141d16] border-l-4 border-l-[#00FF66]"
                            : "hover:bg-[#121212]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-tech text-xs font-bold text-[#00FF66]">
                            {r.reference}
                          </span>
                          <span className="text-[10px] text-[#777777]">
                            {new Date(r.createdAt).toLocaleDateString("en-NG", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate max-w-[170px]">
                            {r.fullName}
                          </p>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              r.status === "Ready for Collection"
                                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                                : r.status === "Completed"
                                ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                                : "bg-[#1c241e] text-[#00FF66] border border-[#00FF66]/30"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#A0A0A0] truncate">
                          {r.deviceBrand} {r.deviceModel} · {r.problemCategory}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-[#777777] pt-0.5">
                          <span>
                            Bench: {verifiedCount}/{totalChecks} checks
                          </span>
                          <span className="font-mono-tech">{r.phone}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : activeTab === "bookings" ? (
            /* Bookings Tab (Requirement 4) */
            <>
              {/* Filter Pills for Bookings */}
              <div className="p-3 border-b border-[#222222] space-y-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {["All", "Pending Confirmation", "Confirmed", "Completed"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-2 py-1 text-[10px] rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        bookingFilter === st
                          ? "bg-purple-400 text-[#050505] font-bold"
                          : "bg-[#141414] text-[#888888] hover:text-white border border-[#222222]"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings List with Tap-to-View details */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#181818]">
                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center text-[#777777] text-xs space-y-2">
                    <Calendar className="w-6 h-6 mx-auto opacity-50" />
                    <p>No bookings matching "{searchQuery}".</p>
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBooking(b)}
                      className={`p-3.5 space-y-2 transition-colors cursor-pointer ${
                        selectedBooking?.id === b.id
                          ? "bg-[#1a1420] border-l-4 border-l-purple-400"
                          : "hover:bg-[#121212]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-xs font-bold text-purple-400">
                          {b.reference}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                            b.status === "Completed"
                              ? "bg-emerald-400/20 text-emerald-300"
                              : b.status === "Confirmed"
                              ? "bg-blue-400/20 text-blue-300"
                              : "bg-amber-400/20 text-amber-300"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-white">{b.fullName}</p>
                        <p className="text-[11px] text-[#A0A0A0]">{b.device}</p>
                        <p className="text-[11px] text-[#777777] italic truncate">"{b.problem}"</p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#1C1C1C]">
                        <span className="text-[#00FF66]">📅 {b.preferredDate}</span>
                        <span className="text-[#A0A0A0]">{b.preferredTime}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Activity Logs Quick Summary in Sidebar */
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#121212] border border-[#222222] space-y-1">
                <span className="text-[10px] text-[#00FF66] uppercase font-bold tracking-wider font-mono-tech">
                  Audit Trail Monitor
                </span>
                <h4 className="text-xs font-bold text-white">Technician Activity Log</h4>
                <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
                  Chronological audit record of status changes, diagnostic tests, and customer intakes.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-[#777777] uppercase font-bold px-1 block">
                  Recent Actions ({activityLogs.length})
                </span>
                {activityLogs.slice(0, 15).map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      const match = repairs.find(
                        (r) => r.reference.toUpperCase() === l.reference.toUpperCase() || r.id === l.reference
                      );
                      if (match) {
                        handleSelectTicket(match);
                      } else {
                        const matchBooking = bookings.find(
                          (b) => b.reference.toUpperCase() === l.reference.toUpperCase() || b.id === l.reference
                        );
                        if (matchBooking) {
                          setSelectedBooking(matchBooking);
                          setActiveTab("bookings");
                        }
                      }
                    }}
                    className="p-2.5 rounded-xl bg-[#121212] hover:bg-[#181818] border border-[#1E1E1E] transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[10px] font-bold text-[#00FF66]">
                        {l.reference}
                      </span>
                      <span className="text-[9px] text-[#777777]">
                        {new Date(l.timestamp).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-white font-medium truncate">{l.title}</p>
                    <p className="text-[10px] text-[#888888] truncate">{l.clientName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN AREA: Selected Ticket Console OR Responsive Booking Console OR Full Activity Log */}
        <main className="flex-1 overflow-y-auto bg-[#080808] p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === "activity" ? (
            /* FULL ACTIVITY LOG SECTION */
            <ActivityLogSection
              logs={activityLogs}
              onSelectTicket={(ref) => {
                const match = repairs.find(
                  (r) => r.reference.toUpperCase() === ref.toUpperCase() || r.id === ref
                );
                if (match) {
                  handleSelectTicket(match);
                } else {
                  const matchBooking = bookings.find(
                    (b) => b.reference.toUpperCase() === ref.toUpperCase() || b.id === ref
                  );
                  if (matchBooking) {
                    setSelectedBooking(matchBooking);
                    setActiveTab("bookings");
                  }
                }
              }}
              onRefresh={loadData}
            />
          ) : activeTab === "bookings" && selectedBooking ? (
            /* RESPONSIVE BOOKING DETAILS VIEW (Requirement 4) */
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-150">
              <div className="bg-[#0D0D0D] border border-purple-900/40 rounded-2xl p-6 space-y-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tech text-2xl font-bold text-purple-400">
                        {selectedBooking.reference}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          selectedBooking.status === "Completed"
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                            : selectedBooking.status === "Confirmed"
                            ? "bg-blue-400/20 text-blue-300 border border-blue-400/30"
                            : "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      Logged on {new Date(selectedBooking.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleConvertBookingToTicket(selectedBooking)}
                      className="px-3.5 py-2 text-xs font-bold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Convert to Active Repair Ticket</span>
                    </button>
                  </div>
                </div>

                {/* Booking Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#777777] uppercase font-bold block">Client Information</span>
                    <strong className="text-white text-sm block">{selectedBooking.fullName}</strong>
                    <p className="text-[#00FF66] font-mono-tech">{selectedBooking.phone}</p>
                    <p className="text-[#A0A0A0] text-[11px]">{selectedBooking.email}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href={`https://wa.me/${cleanPhoneNumberForWhatsApp(selectedBooking.phone)}?text=${encodeURIComponent(
                          `Hello ${selectedBooking.fullName}, this is OMJ Repairs contacting you regarding your booking ref: ${selectedBooking.reference}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[10px] font-bold text-[#050505] bg-[#25D366] rounded flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${selectedBooking.phone}`}
                        className="px-2.5 py-1 text-[10px] font-semibold text-white bg-[#222222] rounded flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#777777] uppercase font-bold block">Scheduled Appointment</span>
                    <strong className="text-white text-sm block">📅 {selectedBooking.preferredDate}</strong>
                    <p className="text-amber-400 font-medium">🕒 {selectedBooking.preferredTime}</p>
                    <p className="text-[#A0A0A0] text-[11px] pt-1">Preference: {selectedBooking.servicePreference}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-1">
                    <span className="text-[10px] text-[#777777] uppercase font-bold block">Device to Diagnose</span>
                    <strong className="text-white text-sm block">{selectedBooking.device}</strong>
                    <p className="text-[#A0A0A0] text-[11px] italic pt-1">"{selectedBooking.problem}"</p>
                  </div>
                </div>

                {/* Status Advancement for Booking */}
                <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-3">
                  <span className="text-xs font-bold text-white block">
                    Update Booking Status:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(["Pending Confirmation", "Confirmed", "Completed", "Cancelled"] as BookingRequest["status"][]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleBookingStatusChange(selectedBooking.id, st)}
                          className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                            selectedBooking.status === st
                              ? "bg-purple-500 text-white shadow-sm"
                              : "bg-[#1E1E1E] text-[#A0A0A0] hover:text-white border border-[#2A2A2A]"
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedRepair ? (
            /* REPAIR TICKET CONSOLE */
            <div className="max-w-4xl space-y-6 animate-in fade-in duration-150">
              {/* Client Ticket Header Card */}
              <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E1E1E]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono-tech text-2xl font-extrabold text-[#00FF66]">
                        {selectedRepair.reference}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#181818] border border-[#222222] text-[#A0A0A0]">
                        {selectedRepair.deviceType}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mt-1">
                      {selectedRepair.deviceBrand} {selectedRepair.deviceModel} ·{" "}
                      <span className="text-[#A0A0A0] font-normal">{selectedRepair.operatingSystem}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onViewClientTracking && (
                      <button
                        onClick={() => onViewClientTracking(selectedRepair.reference)}
                        className="px-3 py-1.5 text-xs text-[#A0A0A0] hover:text-white bg-[#141414] border border-[#222222] hover:border-[#00FF66]/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="View live page client sees"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#00FF66]" />
                        <span>Preview Client View</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Client Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#121212] border border-[#222222]">
                    <span className="text-[10px] text-[#777777] uppercase block">Customer</span>
                    <strong className="text-white text-sm block mt-0.5">{selectedRepair.fullName}</strong>
                    <span className="text-[#A0A0A0] text-[11px]">{selectedRepair.preferredContactMethod} preferred</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#777777] uppercase block">Phone / WhatsApp</span>
                      <strong className="text-[#00FF66] font-mono-tech text-xs block mt-0.5">
                        {selectedRepair.phone}
                      </strong>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <a
                        href={`https://wa.me/${cleanPhoneNumberForWhatsApp(selectedRepair.whatsapp || selectedRepair.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 text-[10px] font-bold text-[#050505] bg-[#25D366] hover:bg-[#20ba5a] rounded transition-colors inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3 fill-current" />
                        <span>Chat</span>
                      </a>
                      <a
                        href={`tel:${selectedRepair.phone}`}
                        className="px-2 py-0.5 text-[10px] font-semibold text-white bg-[#1E1E1E] hover:bg-[#262626] rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121212] border border-[#222222]">
                    <span className="text-[10px] text-[#777777] uppercase block">Reported Fault</span>
                    <strong className="text-red-400 text-xs block mt-0.5">{selectedRepair.problemCategory}</strong>
                    <span className="text-[#777777] text-[10px] block mt-0.5">Started: {selectedRepair.startedWhen}</span>
                  </div>
                </div>

                {/* Problem Description Box */}
                <div className="p-3.5 rounded-xl bg-[#121212] border border-[#222222] text-xs space-y-1">
                  <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-semibold">
                    Client's Reported Description:
                  </span>
                  <p className="text-white/90 leading-relaxed italic">"{selectedRepair.description}"</p>
                  {selectedRepair.triedAlready && selectedRepair.triedAlready !== "None" && (
                    <p className="text-[11px] text-[#A0A0A0] pt-1">
                      <strong className="text-white">Already Attempted:</strong> {selectedRepair.triedAlready}
                    </p>
                  )}
                </div>
              </div>

              {/* WORKSPACE CONTROLS: Sub-tabs between Status Stage, Diagnostic Checklist, and Ticket Audit Timeline */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 bg-[#0D0D0D] border border-[#222222] rounded-xl">
                <button
                  type="button"
                  onClick={() => setTicketSubTab("status")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    ticketSubTab === "status"
                      ? "bg-[#181818] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                      : "text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>1. Advance Stage & WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTicketSubTab("checklist")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    ticketSubTab === "checklist"
                      ? "bg-[#181818] text-[#00FF66] border border-[#00FF66]/40 shadow-sm"
                      : "text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  <ListChecks className="w-4 h-4" />
                  <span>2. Bench Diagnostic Checklist</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTicketSubTab("audit")}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    ticketSubTab === "audit"
                      ? "bg-[#181818] text-amber-400 border border-amber-500/40 shadow-sm"
                      : "text-[#A0A0A0] hover:text-white"
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>3. Status Audit History ({selectedRepair.statusHistory?.length || 1})</span>
                </button>
              </div>

              {ticketSubTab === "status" ? (
                /* STATUS & WHATSAPP CONSOLE */
                <div className="space-y-5">
                  {/* DIRECT WHATSAPP CLIENT SYNC CARD */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1810] to-[#0A120D] border-2 border-[#25D366]/40 space-y-4 shadow-[0_0_30px_-5px_rgba(37,211,102,0.15)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-[#25D366] animate-pulse" />
                        <h3 className="font-display font-bold text-base text-white">
                          Client WhatsApp Notification
                        </h3>
                      </div>
                      <span className="text-xs font-mono-tech text-[#25D366] font-bold">
                        Target: {selectedRepair.whatsapp || selectedRepair.phone}
                      </span>
                    </div>

                    <p className="text-xs text-[#A0A0A0] leading-relaxed">
                      Whenever you update the status or finish tests on this laptop, click this button to send{" "}
                      <strong className="text-white">{selectedRepair.fullName}</strong> an official WhatsApp report with their current stage, your diagnostic notes, and their live tracking link.
                    </p>

                    <a
                      href={getClientStatusUpdateWhatsAppUrl(selectedRepair)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#050505] text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(37,211,102,0.3)] cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-current shrink-0" />
                      <span>Send Status Update to Client via WhatsApp</span>
                    </a>
                  </div>

                  {/* LIFECYCLE STAGE ADVANCER (Requirement 3: instant client sync) */}
                  <form
                    onSubmit={handleUpdateStatus}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-5 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-display font-bold text-sm text-white">
                          Record Client's Repair Progress
                        </h4>
                        <p className="text-xs text-[#A0A0A0]">
                          Instantly syncs to the client's live tracking view.
                        </p>
                      </div>
                      <span className="text-xs font-mono-tech px-2.5 py-1 rounded-lg bg-[#181818] border border-[#222222] text-[#00FF66] font-bold">
                        Active: {selectedRepair.status}
                      </span>
                    </div>

                    {saveFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-[#00FF66]/50 text-[#00FF66] text-xs flex items-center justify-between gap-2 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="font-bold">{saveFeedback}</span>
                        </div>
                        <a
                          href={getClientStatusUpdateWhatsAppUrl(selectedRepair)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 text-[11px] font-bold text-[#050505] bg-[#25D366] rounded hover:bg-[#20ba5a] inline-flex items-center gap-1 shrink-0"
                        >
                          <MessageSquare className="w-3 h-3 fill-current" />
                          <span>WhatsApp Client Now</span>
                        </a>
                      </div>
                    )}

                    {notificationFeedback && (
                      <div className="p-3 rounded-xl bg-[#091510] border border-[#25D366]/30 text-xs text-[#A0A0A0] flex items-center justify-between gap-2 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#00FF66] animate-ping" />
                          <span className="text-white font-medium">{notificationFeedback}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono-tech text-[#00FF66] font-bold">
                          Automated Dispatch OK
                        </span>
                      </div>
                    )}

                    {/* Quick 1-Tap Stage Advance Buttons */}
                    <div>
                      <span className="text-xs font-medium text-white mb-2 block">
                        Quick 1-Tap Stage Advancement:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {REPAIR_STATUS_STEPS.map((s) => {
                          const isCurrent = newStatus === s.status;
                          return (
                            <button
                              key={s.status}
                              type="button"
                              onClick={() => handleQuickAdvance(s.status)}
                              className={`p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                                isCurrent
                                  ? "bg-[#00FF66] text-[#050505] border-[#00FF66] font-bold shadow-[0_0_15px_rgba(0,255,102,0.25)]"
                                  : "bg-[#121212] text-[#A0A0A0] hover:text-white border-[#222222] hover:border-[#00FF66]/40"
                              }`}
                            >
                              <span className="truncate">{s.status}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technician Bench Notes */}
                    <div>
                      <label className="block text-xs font-medium text-white mb-1.5">
                        Technician Diagnostic Notes (Visible to client on tracker & WhatsApp report):
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g., Motherboard 19V rail tested and working. Replaced thermal paste on CPU/GPU. Reinstalled Windows 11 and verified all hardware diagnostics passed."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-xl text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
                      >
                        Save Progress
                      </button>
                    </div>
                  </form>
                </div>
              ) : ticketSubTab === "checklist" ? (
                /* SERVICE CHECKLIST BENCH */
                <ServiceChecklist
                  repairId={selectedRepair.id}
                  reference={selectedRepair.reference}
                  onReferenceChange={(newRefOrId) => {
                    const match = repairs.find(
                      (r) => r.id === newRefOrId || r.reference.toUpperCase() === newRefOrId.toUpperCase()
                    );
                    if (match) handleSelectTicket(match);
                  }}
                  onChecklistUpdated={() => loadData()}
                />
              ) : (
                /* INDIVIDUAL TICKET AUDIT HISTORY TIMELINE */
                <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-5 shadow-lg animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1E1E1E]">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">
                        Status History & Audit Timeline for {selectedRepair.reference}
                      </h4>
                      <p className="text-xs text-[#A0A0A0]">
                        Complete chronological audit record of status transitions and technician findings.
                      </p>
                    </div>
                    <span className="text-xs font-mono-tech text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30 font-bold">
                      {selectedRepair.statusHistory?.length || 1} Milestones
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedRepair.statusHistory && selectedRepair.statusHistory.length > 0 ? (
                      selectedRepair.statusHistory.map((entry, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shrink-0" />
                              <strong className="text-xs text-white">{entry.status}</strong>
                              <span className="text-[10px] text-[#666666] font-mono-tech">
                                (Milestone #{selectedRepair.statusHistory.length - idx})
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-xs text-[#A0A0A0] italic pl-4 leading-relaxed">
                                "{entry.note}"
                              </p>
                            )}
                          </div>
                          <span className="text-[11px] text-[#777777] font-mono-tech whitespace-nowrap pl-4 sm:pl-0 shrink-0">
                            {new Date(entry.timestamp).toLocaleString("en-NG", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[#777777]">No status history recorded yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-[#777777] text-xs space-y-3">
              <Laptop className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-white font-semibold">Select a repair ticket from the queue on the left.</p>
              <p>Or record a new walk-in client using the top "+ New Walk-in Intake" button.</p>
            </div>
          )}
        </main>
      </div>

      {/* WALK-IN CLIENT INTAKE MODAL */}
      {showIntakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowIntakeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-[#141414] border border-[#222222] text-[#A0A0A0] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[11px] font-mono-tech text-[#00FF66] uppercase font-bold tracking-wider">
                Shop Intake Desk
              </span>
              <h3 className="font-display text-xl font-bold text-white mt-0.5">
                Record Walk-In Client Repair
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Quickly register a device dropped off at your Lagos workshop.
              </p>
            </div>

            {intakeSuccess ? (
              <div className="p-5 rounded-xl bg-[#121212] border border-[#00FF66]/40 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-[#00FF66] mx-auto" />
                <div>
                  <h4 className="font-bold text-white text-base">Client Successfully Registered!</h4>
                  <p className="font-mono-tech text-lg font-bold text-[#00FF66] mt-1">
                    {intakeSuccess.reference}
                  </p>
                </div>

                <a
                  href={`https://wa.me/${cleanPhoneNumberForWhatsApp(intakeSuccess.whatsapp || intakeSuccess.phone)}?text=${encodeURIComponent(
                    `Hello ${intakeSuccess.fullName}, this is OMJ Repairs in Lagos. We have safely checked in your ${intakeSuccess.deviceBrand} ${intakeSuccess.deviceModel} for diagnosis.\n\nYour Official Ticket Reference is: *${intakeSuccess.reference}*.\n\nYou can track your repair progress live anytime here:\n${window.location.origin}/?ref=${intakeSuccess.reference}#status`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] text-[#050505] text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Send Ticket Reference to Client on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowIntakeModal(false)}
                  className="w-full py-2 text-xs text-[#A0A0A0] hover:text-white bg-[#181818] border border-[#222222] rounded-lg cursor-pointer"
                >
                  Close & View in Workspace
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateIntake} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Tunde Balogun"
                      value={intakeForm.fullName}
                      onChange={(e) => setIntakeForm({ ...intakeForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 08021234567"
                      value={intakeForm.phone}
                      onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Device Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dell, HP, Lenovo"
                      value={intakeForm.deviceBrand}
                      onChange={(e) => setIntakeForm({ ...intakeForm, deviceBrand: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Model / Specs</label>
                    <input
                      type="text"
                      placeholder="e.g., Latitude 5420 / Core i5"
                      value={intakeForm.deviceModel}
                      onChange={(e) => setIntakeForm({ ...intakeForm, deviceModel: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Fault Category</label>
                    <select
                      value={intakeForm.problemCategory}
                      onChange={(e) =>
                        setIntakeForm({ ...intakeForm, problemCategory: e.target.value as ProblemCategory })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    >
                      {PROBLEM_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white mb-1">Operating System</label>
                    <select
                      value={intakeForm.operatingSystem}
                      onChange={(e) =>
                        setIntakeForm({
                          ...intakeForm,
                          operatingSystem: e.target.value as RepairRequest["operatingSystem"],
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                    >
                      <option value="Windows 11">Windows 11</option>
                      <option value="Windows 10">Windows 10</option>
                      <option value="macOS">macOS</option>
                      <option value="Linux">Linux</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white mb-1">Reported Symptoms / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Screen flickers when moved, battery dies instantly without AC adapter plugged in."
                    value={intakeForm.description}
                    onChange={(e) => setIntakeForm({ ...intakeForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#141414] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
                >
                  Register Client & Generate Reference
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHANGE PASSCODE MODAL */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0D0D0D] border border-[#222222] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPasscodeModal(false);
                setPasscodeModalError("");
              }}
              className="absolute top-4 right-4 p-2 text-[#777777] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[11px] font-mono-tech text-[#00FF66] uppercase font-bold tracking-wider">
                Security & Master Access
              </span>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">
                Change Master Passcode
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Configure the private password required to enter your Technician Admin Portal.
              </p>
            </div>

            {/* Current Active Code Pill */}
            <div className="p-3 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#777777] text-[10px] uppercase font-bold block">Current Active Passcode</span>
                <span className="font-mono-tech font-bold text-[#00FF66]">
                  {showCurrentPasscode ? currentActivePasscode : "••••••••"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCurrentPasscode(!showCurrentPasscode)}
                className="text-[11px] text-[#A0A0A0] hover:text-white font-medium px-2 py-1 bg-[#1C1C1C] rounded cursor-pointer"
              >
                {showCurrentPasscode ? "Hide" : "Reveal"}
              </button>
            </div>

            {passcodeChangeSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-[#00FF66]/40 text-[#00FF66] text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <strong className="block font-bold">Passcode Updated Successfully!</strong>
                  <span className="text-[11px] text-emerald-300">
                    Your master password is now active. All future logins will require this code.
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePasscodeSubmit} className="space-y-4">
                {passcodeModalError && (
                  <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passcodeModalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-1">
                    New Master Passcode (min 4 characters)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new code (e.g. MyTechPIN2026)"
                    value={newPasscode}
                    onChange={(e) => {
                      setNewPasscode(e.target.value);
                      if (passcodeModalError) setPasscodeModalError("");
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141414] border border-[#222222] rounded-xl text-white font-mono-tech focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-1">
                    Confirm New Passcode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Re-enter new code to confirm"
                    value={confirmPasscode}
                    onChange={(e) => {
                      setConfirmPasscode(e.target.value);
                      if (passcodeModalError) setPasscodeModalError("");
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#141414] border border-[#222222] rounded-xl text-white font-mono-tech focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
                  >
                    Save & Activate Passcode
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPasscodeDefault}
                    className="px-3 py-2.5 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-[#161410] border border-amber-500/30 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    title="Reset to default code (OMJ2026)"
                  >
                    Reset (OMJ2026)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
