/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BookingRequest,
  CustomerReview,
  DiagnosticCategory,
  DiagnosticChecklistItem,
  ProblemCategory,
  RepairLifecycleStatus,
  RepairRequest,
  TechnicianActivityLog,
} from "../types";
import { DEFAULT_DIAGNOSTIC_STEPS } from "../data/constants";
import { notificationService } from "./notificationService";

const STORAGE_KEYS = {
  REPAIR_REQUESTS: "omj_repair_requests_v1",
  BOOKINGS: "omj_bookings_v1",
  REVIEWS: "omj_reviews_v1",
  COUNTER: "omj_repair_counter_v1",
  ADMIN_PASSCODE: "omj_admin_passcode_v1",
  ACTIVITY_LOGS: "omj_activity_logs_v1",
  SYNC_PING: "omj_last_sync_ping_v1",
};

let broadcastChan: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    broadcastChan = new BroadcastChannel("omj_repairs_channel");
  } catch {
    // BroadcastChannel unsupported
  }
}

export function dispatchDataUpdated(reference: string, type: "repair" | "booking" = "repair") {
  if (typeof window !== "undefined") {
    try {
      const payload = { reference, type, timestamp: Date.now() };
      // 1. Same-window event
      window.dispatchEvent(new CustomEvent("omj_data_updated", { detail: payload }));
      // 2. Storage event trigger across tabs
      localStorage.setItem(STORAGE_KEYS.SYNC_PING, JSON.stringify(payload));
      // 3. Broadcast channel across tabs
      if (broadcastChan) {
        broadcastChan.postMessage(payload);
      }
    } catch {
      // Ignore in SSR
    }
  }
}

// Generate default checklist for a new repair
export function createDefaultChecklist(): DiagnosticChecklistItem[] {
  return DEFAULT_DIAGNOSTIC_STEPS.map((step) => ({
    id: step.id,
    name: step.name,
    category: step.category,
    completed: step.defaultCompleted,
  }));
}

// Seed an initial demo request for testing the status checker without fake customer data
const DEMO_REFERENCE = "OMJ-000101";

function initializeStorage() {
  if (typeof window === "undefined") return;

  // Initialize repair counter if missing
  if (!localStorage.getItem(STORAGE_KEYS.COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.COUNTER, "102");
  }

  // Initialize requests with a single system test fixture if completely empty
  if (!localStorage.getItem(STORAGE_KEYS.REPAIR_REQUESTS)) {
    const demoChecklist: DiagnosticChecklistItem[] = createDefaultChecklist().map((item) => {
      if (item.id === "diag_psu") {
        return {
          ...item,
          completed: true,
          completedAt: "2026-10-02T15:20:00Z",
          technicianNote: "19.5V DC verified with digital multimeter under load.",
        };
      }
      if (item.id === "diag_mem") {
        return {
          ...item,
          completed: true,
          completedAt: "2026-10-02T16:45:00Z",
          technicianNote: "16GB SODIMM passed 2 full passes MemTest86 with zero parity errors.",
        };
      }
      if (item.id === "diag_smart") {
        return {
          ...item,
          completed: true,
          completedAt: "2026-10-03T09:15:00Z",
          technicianNote: "SK Hynix 512GB NVMe S.M.A.R.T. health 98%. Zero bad sectors.",
        };
      }
      if (item.id === "diag_os_audit") {
        return {
          ...item,
          completed: false,
          technicianNote: "Corrupted BCD hive identified. Scheduled for DISM repair.",
        };
      }
      return item;
    });

    const demoRequest: RepairRequest = {
      id: "demo-system-001",
      reference: DEMO_REFERENCE,
      fullName: "System Test Verification",
      phone: "+234 704 046 8694",
      email: "olubayomosopeoluwa@gmail.com",
      whatsapp: "+2347040468694",
      deviceType: "Laptop",
      deviceBrand: "Dell",
      deviceModel: "Latitude 5420",
      operatingSystem: "Windows 11",
      problemCategory: "Won't Boot",
      description: "Sample test diagnostic entry. Laptop turns on, fan spins, but Windows boot loop occurs after automatic repair.",
      startedWhen: "2 days ago",
      triedAlready: "Safe mode restart attempt",
      preferredContactMethod: "WhatsApp",
      preferredDate: "2026-10-05",
      status: "Diagnosis in Progress",
      statusHistory: [
        {
          status: "Request Received",
          timestamp: "2026-10-02T10:15:00Z",
          note: "Online repair submission logged.",
        },
        {
          status: "Awaiting Diagnosis",
          timestamp: "2026-10-02T14:30:00Z",
          note: "Device booked in at Lagos workbench.",
        },
        {
          status: "Diagnosis in Progress",
          timestamp: "2026-10-03T09:00:00Z",
          note: "Technician inspecting bootloader BCD records and NVMe partition table.",
        },
      ],
      technicianNotes: "NVMe drive health verified at 98%. EFI partition rebuilding required.",
      checklist: demoChecklist,
      createdAt: "2026-10-02T10:15:00Z",
      updatedAt: "2026-10-03T09:00:00Z",
    };

    localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify([demoRequest]));
  }

  // Bookings list starts empty
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
  }

  // Reviews list starts empty per instructions
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  }

  // Initialize activity audit logs if empty
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    const seedLogs: TechnicianActivityLog[] = [
      {
        id: "act_101",
        timestamp: "2026-10-02T14:30:00Z",
        reference: "OMJ-000101",
        ticketType: "repair",
        action: "intake_created",
        title: "Ticket Intake Logged",
        newStatus: "Request Received",
        note: "System unit and Dell 65W AC adapter checked in for motherboard power rail inspection.",
        clientName: "Tunde Balogun",
        deviceInfo: "Dell Latitude 5420",
        technician: "Lead Technician (OMJ)",
      },
      {
        id: "act_102",
        timestamp: "2026-10-02T15:20:00Z",
        reference: "OMJ-000101",
        ticketType: "repair",
        action: "status_change",
        title: "Status Changed: Request Received → Diagnosis in Progress",
        previousStatus: "Request Received",
        newStatus: "Diagnosis in Progress",
        note: "Disassembled casing. Commenced digital multimeter voltage rail testing.",
        clientName: "Tunde Balogun",
        deviceInfo: "Dell Latitude 5420",
        technician: "Lead Technician (OMJ)",
      },
      {
        id: "act_103",
        timestamp: "2026-10-02T16:45:00Z",
        reference: "OMJ-000101",
        ticketType: "repair",
        action: "checklist_update",
        title: "Bench Check Passed: Memory Integrity Check",
        note: "16GB SODIMM passed 2 full passes MemTest86 with zero parity errors.",
        clientName: "Tunde Balogun",
        deviceInfo: "Dell Latitude 5420",
        technician: "Lead Technician (OMJ)",
      },
      {
        id: "act_104",
        timestamp: "2026-10-03T11:00:00Z",
        reference: "OMJ-000101",
        ticketType: "repair",
        action: "status_change",
        title: "Status Changed: Diagnosis in Progress → Repair in Progress",
        previousStatus: "Diagnosis in Progress",
        newStatus: "Repair in Progress",
        note: "Motherboard shorted ceramic capacitor replaced on 19.5V input rail. Thermal paste renewed.",
        clientName: "Tunde Balogun",
        deviceInfo: "Dell Latitude 5420",
        technician: "Lead Technician (OMJ)",
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(seedLogs));
  }
}

// Generate sequential reference OMJ-XXXXXX
function getNextReference(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COUNTER);
    let count = raw ? parseInt(raw, 10) : 102;
    if (isNaN(count)) count = 102;
    const ref = `OMJ-${String(count).padStart(6, "0")}`;
    localStorage.setItem(STORAGE_KEYS.COUNTER, String(count + 1));
    return ref;
  } catch {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `OMJ-${rand}`;
  }
}

export const storageService = {
  init: initializeStorage,

  getDemoReference: () => DEMO_REFERENCE,

  // --- REPAIR REQUESTS ---
  getAllRepairRequests: (): RepairRequest[] => {
    try {
      initializeStorage();
      const raw = localStorage.getItem(STORAGE_KEYS.REPAIR_REQUESTS);
      const list: RepairRequest[] = raw ? JSON.parse(raw) : [];
      return list.map((r) => ({
        ...r,
        checklist: r.checklist && r.checklist.length > 0 ? r.checklist : createDefaultChecklist(),
      }));
    } catch {
      return [];
    }
  },

  getRepairByReference: (reference: string): RepairRequest | null => {
    const trimmed = reference.trim().toUpperCase();
    const all = storageService.getAllRepairRequests();
    return all.find((r) => r.reference.toUpperCase() === trimmed) || null;
  },

  getRepairById: (idOrReference: string): RepairRequest | null => {
    const trimmed = idOrReference.trim();
    const all = storageService.getAllRepairRequests();
    return (
      all.find(
        (r) => r.id === trimmed || r.reference.toUpperCase() === trimmed.toUpperCase()
      ) || null
    );
  },

  /**
   * Powerful search supporting:
   * 1. Reference: "OMJ-000101", "000101", "101"
   * 2. Phone / WhatsApp: "08012345678", "+234...", "07040468694"
   * 3. Email: "client@..."
   * 4. Full Name: "Tunde"
   */
  searchRepairs: (query: string): RepairRequest[] => {
    const rawQ = query.trim().toLowerCase();
    if (!rawQ) return [];

    const all = storageService.getAllRepairRequests();
    const cleanNumber = rawQ.replace(/[^0-9]/g, "");

    return all.filter((r) => {
      // 1. Exact or partial reference
      const refLower = r.reference.toLowerCase();
      if (refLower.includes(rawQ)) return true;
      // If user typed only digits like "000101" or "101"
      if (cleanNumber.length >= 3 && refLower.includes(cleanNumber)) return true;

      // 2. Phone / WhatsApp match
      const rPhoneClean = (r.phone || "").replace(/[^0-9]/g, "");
      const rWaClean = (r.whatsapp || "").replace(/[^0-9]/g, "");
      if (cleanNumber.length >= 5) {
        if (rPhoneClean.includes(cleanNumber) || cleanNumber.includes(rPhoneClean.slice(-8))) return true;
        if (rWaClean.includes(cleanNumber) || cleanNumber.includes(rWaClean.slice(-8))) return true;
      }

      // 3. Email match
      if (r.email && r.email.toLowerCase().includes(rawQ)) return true;

      // 4. Name match
      if (r.fullName && r.fullName.toLowerCase().includes(rawQ)) return true;

      // 5. Device model / brand match
      if (`${r.deviceBrand} ${r.deviceModel}`.toLowerCase().includes(rawQ)) return true;

      return false;
    });
  },

  createRepairRequest: (
    data: Omit<RepairRequest, "id" | "reference" | "status" | "statusHistory" | "createdAt" | "updatedAt">
  ): RepairRequest => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const ref = getNextReference();
    const now = new Date().toISOString();

    const newRequest: RepairRequest = {
      ...data,
      id: "req_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      reference: ref,
      status: "Request Received",
      statusHistory: [
        {
          status: "Request Received",
          timestamp: now,
          note: "Repair request received and logged in OMJ queue.",
        },
      ],
      checklist: createDefaultChecklist(),
      createdAt: now,
      updatedAt: now,
    };

    all.unshift(newRequest);
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
      dispatchDataUpdated(newRequest.reference, "repair");

      // Audit Log Entry
      storageService.logActivity({
        reference: newRequest.reference,
        ticketType: "repair",
        action: "intake_created",
        title: `New Ticket Logged: ${newRequest.reference}`,
        newStatus: newRequest.status,
        note: newRequest.description,
        clientName: newRequest.fullName,
        deviceInfo: `${newRequest.deviceBrand} ${newRequest.deviceModel}`,
        technician: "Lead Technician (OMJ)",
      });
    } catch (e) {
      console.error("Storage error:", e);
    }

    return newRequest;
  },

  updateRepairStatus: (
    reference: string,
    newStatus: RepairLifecycleStatus,
    note?: string
  ): RepairRequest | null => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const index = all.findIndex((r) => r.reference.toUpperCase() === reference.trim().toUpperCase());

    if (index === -1) return null;

    const current = all[index];
    const now = new Date().toISOString();

    const updated: RepairRequest = {
      ...current,
      status: newStatus,
      technicianNotes: note || current.technicianNotes,
      updatedAt: now,
      statusHistory: [
        ...current.statusHistory,
        {
          status: newStatus,
          timestamp: now,
          note: note || `Status updated to ${newStatus}`,
        },
      ],
    };

    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
      dispatchDataUpdated(updated.reference, "repair");

      // Audit Log Entry
      storageService.logActivity({
        reference: updated.reference,
        ticketType: "repair",
        action: "status_change",
        title: `Status Changed: ${current.status} → ${newStatus}`,
        previousStatus: current.status,
        newStatus: newStatus,
        note: note || `Stage advanced to ${newStatus}`,
        clientName: updated.fullName,
        deviceInfo: `${updated.deviceBrand} ${updated.deviceModel}`,
        technician: "Lead Technician (OMJ)",
      });

      // Automated Mock Notification Dispatch (SMS & Email trigger)
      if (notificationService.isAutoNotifyEnabled()) {
        try {
          notificationService.notifyStatusChange(
            updated,
            current.status,
            newStatus,
            note || undefined
          );
        } catch (notifErr) {
          console.error("Mock notification error:", notifErr);
        }
      }
    } catch (e) {
      console.error("Storage error:", e);
    }

    return updated;
  },

  // --- DIAGNOSTIC SERVICE CHECKLIST ---
  getChecklistForRepair: (idOrReference: string): DiagnosticChecklistItem[] => {
    initializeStorage();
    const repair = storageService.getRepairById(idOrReference);
    if (!repair) return [];

    if (repair.checklist && repair.checklist.length > 0) {
      return repair.checklist;
    }

    // Lazy initialize default checklist if empty
    const defaultList = createDefaultChecklist();
    storageService.updateRepairChecklist(idOrReference, defaultList);
    return defaultList;
  },

  updateRepairChecklist: (idOrReference: string, checklist: DiagnosticChecklistItem[]): RepairRequest | null => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const trimmed = idOrReference.trim();
    const index = all.findIndex(
      (r) => r.id === trimmed || r.reference.toUpperCase() === trimmed.toUpperCase()
    );

    if (index === -1) return null;

    const current = all[index];
    const now = new Date().toISOString();

    const updated: RepairRequest = {
      ...current,
      checklist,
      updatedAt: now,
    };

    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
      dispatchDataUpdated(updated.reference, "repair");
    } catch (e) {
      console.error("Storage error:", e);
    }

    return updated;
  },

  toggleChecklistItem: (
    idOrReference: string,
    stepId: string,
    technicianNote?: string
  ): RepairRequest | null => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const trimmed = idOrReference.trim();
    const index = all.findIndex(
      (r) => r.id === trimmed || r.reference.toUpperCase() === trimmed.toUpperCase()
    );

    if (index === -1) return null;

    const current = all[index];
    const currentList = current.checklist && current.checklist.length > 0
      ? current.checklist
      : createDefaultChecklist();

    const now = new Date().toISOString();
    const updatedList = currentList.map((item) => {
      if (item.id === stepId) {
        const nextCompleted = !item.completed;
        return {
          ...item,
          completed: nextCompleted,
          completedAt: nextCompleted ? now : undefined,
          technicianNote: technicianNote !== undefined ? technicianNote : item.technicianNote,
        };
      }
      return item;
    });

    const updated: RepairRequest = {
      ...current,
      checklist: updatedList,
      updatedAt: now,
    };

    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
    } catch (e) {
      console.error("Storage error:", e);
    }

    return updated;
  },

  updateChecklistItemNote: (
    idOrReference: string,
    stepId: string,
    technicianNote: string
  ): RepairRequest | null => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const trimmed = idOrReference.trim();
    const index = all.findIndex(
      (r) => r.id === trimmed || r.reference.toUpperCase() === trimmed.toUpperCase()
    );

    if (index === -1) return null;

    const current = all[index];
    const currentList = current.checklist && current.checklist.length > 0
      ? current.checklist
      : createDefaultChecklist();

    const now = new Date().toISOString();
    const updatedList = currentList.map((item) => {
      if (item.id === stepId) {
        return {
          ...item,
          technicianNote,
        };
      }
      return item;
    });

    const updated: RepairRequest = {
      ...current,
      checklist: updatedList,
      updatedAt: now,
    };

    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
    } catch (e) {
      console.error("Storage error:", e);
    }

    return updated;
  },

  addCustomChecklistItem: (
    idOrReference: string,
    name: string,
    category: DiagnosticCategory,
    note?: string
  ): RepairRequest | null => {
    initializeStorage();
    const all = storageService.getAllRepairRequests();
    const trimmed = idOrReference.trim();
    const index = all.findIndex(
      (r) => r.id === trimmed || r.reference.toUpperCase() === trimmed.toUpperCase()
    );

    if (index === -1) return null;

    const current = all[index];
    const currentList = current.checklist && current.checklist.length > 0
      ? current.checklist
      : createDefaultChecklist();

    const newItem: DiagnosticChecklistItem = {
      id: "diag_custom_" + Date.now(),
      name,
      category,
      completed: true,
      completedAt: new Date().toISOString(),
      technicianNote: note || undefined,
    };

    const now = new Date().toISOString();
    const updated: RepairRequest = {
      ...current,
      checklist: [...currentList, newItem],
      updatedAt: now,
    };

    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.REPAIR_REQUESTS, JSON.stringify(all));
    } catch (e) {
      console.error("Storage error:", e);
    }

    return updated;
  },

  resetChecklist: (idOrReference: string): RepairRequest | null => {
    return storageService.updateRepairChecklist(idOrReference, createDefaultChecklist());
  },

  // --- BOOKINGS ---
  getAllBookings: (): BookingRequest[] => {
    try {
      initializeStorage();
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  createBooking: (
    data: Omit<BookingRequest, "id" | "reference" | "status" | "createdAt">
  ): BookingRequest => {
    initializeStorage();
    const all = storageService.getAllBookings();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const ref = `BK-${rand}`;
    const now = new Date().toISOString();

    const newBooking: BookingRequest = {
      ...data,
      id: "bk_" + Date.now(),
      reference: ref,
      status: "Pending Confirmation",
      createdAt: now,
    };

    all.unshift(newBooking);
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
      dispatchDataUpdated(newBooking.reference, "booking");
    } catch (e) {
      console.error("Storage error:", e);
    }

    return newBooking;
  },

  updateBookingStatus: (
    idOrReference: string,
    newStatus: BookingRequest["status"]
  ): BookingRequest | null => {
    initializeStorage();
    const all = storageService.getAllBookings();
    const trimmed = idOrReference.trim().toUpperCase();
    const index = all.findIndex(
      (b) => b.id === idOrReference.trim() || b.reference.toUpperCase() === trimmed
    );
    if (index === -1) return null;

    const updated: BookingRequest = {
      ...all[index],
      status: newStatus,
    };
    all[index] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
      dispatchDataUpdated(updated.reference, "booking");

      // Audit Log Entry
      storageService.logActivity({
        reference: updated.reference,
        ticketType: "booking",
        action: "booking_status_change",
        title: `Booking Status Changed: ${all[index].status} → ${newStatus}`,
        previousStatus: all[index].status,
        newStatus: newStatus,
        clientName: updated.fullName,
        deviceInfo: updated.device,
        technician: "Lead Technician (OMJ)",
      });
    } catch (e) {
      console.error("Storage error:", e);
    }
    return updated;
  },

  convertBookingToRepairRequest: (bookingIdOrRef: string): RepairRequest | null => {
    initializeStorage();
    const bookings = storageService.getAllBookings();
    const trimmed = bookingIdOrRef.trim().toUpperCase();
    const booking = bookings.find(
      (b) => b.id === bookingIdOrRef.trim() || b.reference.toUpperCase() === trimmed
    );
    if (!booking) return null;

    // Create a new repair request from this booking
    const created = storageService.createRepairRequest({
      fullName: booking.fullName,
      phone: booking.phone,
      email: booking.email,
      whatsapp: booking.phone,
      deviceType: "Laptop",
      deviceBrand: booking.device.split(" ")[0] || "PC",
      deviceModel: booking.device,
      operatingSystem: "Windows 11",
      problemCategory: "Won't Boot",
      description: `Converted from Booking Ref ${booking.reference}: ${booking.problem}`,
      startedWhen: "Reported on booking",
      triedAlready: "None",
      preferredContactMethod: "WhatsApp",
      preferredDate: booking.preferredDate,
      imageUrls: [],
    });

    // Mark the booking as confirmed/converted
    storageService.updateBookingStatus(booking.reference, "Confirmed");

    // Audit Log Entry
    storageService.logActivity({
      reference: created.reference,
      ticketType: "repair",
      action: "booking_converted",
      title: `Booking ${booking.reference} Converted to Active Repair Ticket`,
      newStatus: created.status,
      note: `Client appointment converted to workshop ticket ${created.reference}`,
      clientName: created.fullName,
      deviceInfo: `${created.deviceBrand} ${created.deviceModel}`,
      technician: "Lead Technician (OMJ)",
    });

    return created;
  },

  // --- ADMIN PASSCODE SECURITY ---
  getAdminPasscode: (): string => {
    if (typeof window === "undefined") return "OMJ2026";
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE) || "OMJ2026";
  },

  isCustomPasscodeSet: (): boolean => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSCODE);
    return Boolean(stored && stored.trim() !== "OMJ2026");
  },

  setAdminPasscode: (newPasscode: string): boolean => {
    if (typeof window === "undefined" || !newPasscode.trim()) return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, newPasscode.trim());
    return true;
  },

  resetAdminPasscode: (): boolean => {
    if (typeof window === "undefined") return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSCODE, "OMJ2026");
    return true;
  },

  verifyAdminPasscode: (input: string): boolean => {
    const current = storageService.getAdminPasscode();
    return input.trim() === current.trim();
  },

  // --- ACTIVITY AUDIT LOGS ---
  getActivityLogs: (): TechnicianActivityLog[] => {
    try {
      initializeStorage();
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      const logs: TechnicianActivityLog[] = raw ? JSON.parse(raw) : [];
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  },

  logActivity: (data: Omit<TechnicianActivityLog, "id" | "timestamp">): TechnicianActivityLog => {
    initializeStorage();
    const all = storageService.getActivityLogs();
    const newLog: TechnicianActivityLog = {
      ...data,
      id: "act_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
    };
    all.unshift(newLog);
    // Retain up to 300 audit logs
    const trimmed = all.slice(0, 300);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(trimmed));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("omj_activity_logged", { detail: { log: newLog } })
        );
      }
    } catch (e) {
      console.error("Activity log error:", e);
    }
    return newLog;
  },

  clearActivityLogs: (): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  // --- REVIEWS ---
  getAllReviews: (): CustomerReview[] => {
    try {
      initializeStorage();
      const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  submitReview: (
    data: Omit<CustomerReview, "id" | "date">
  ): CustomerReview => {
    initializeStorage();
    const all = storageService.getAllReviews();
    const now = new Date().toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const newReview: CustomerReview = {
      ...data,
      id: "rev_" + Date.now(),
      date: now,
    };

    all.unshift(newReview);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(all));
    } catch (e) {
      console.error("Storage error:", e);
    }

    return newReview;
  },

  // Export data for backup
  exportAllData: () => {
    return {
      requests: storageService.getAllRepairRequests(),
      bookings: storageService.getAllBookings(),
      reviews: storageService.getAllReviews(),
      exportedAt: new Date().toISOString(),
    };
  },
};
