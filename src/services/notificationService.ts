/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RepairRequest, RepairLifecycleStatus } from "../types";
import { BUSINESS_INFO } from "../data/constants";

export interface MockNotification {
  id: string;
  timestamp: string;
  type: "sms" | "email";
  recipient: string;
  recipientName: string;
  reference: string;
  subject?: string;
  message: string;
  status: "delivered" | "sent";
}

const STORAGE_KEYS = {
  NOTIFICATIONS: "omj_notifications_v1",
  AUTO_NOTIFY: "omj_auto_notify_v1",
};

export const notificationService = {
  isAutoNotifyEnabled: (): boolean => {
    if (typeof window === "undefined") return true;
    const val = localStorage.getItem(STORAGE_KEYS.AUTO_NOTIFY);
    return val !== "false"; // Default true
  },

  setAutoNotifyEnabled: (enabled: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.AUTO_NOTIFY, enabled ? "true" : "false");
  },

  getNotifications: (): MockNotification[] => {
    try {
      if (typeof window === "undefined") return [];
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Automatically triggered when ticket status changes in AdminPortal
   */
  notifyStatusChange: (
    repair: RepairRequest,
    previousStatus: string,
    newStatus: RepairLifecycleStatus,
    note?: string
  ): { sms: MockNotification; email: MockNotification } => {
    const now = new Date().toISOString();
    const trackingUrl = `https://omj-repairs.lagos.ng/?ref=${repair.reference}#status`;

    // 1. Generate SMS message
    const smsMessage = `[OMJ Repairs Lagos] Hello ${repair.fullName}, your ${repair.deviceBrand} ${repair.deviceModel} (Ref: ${
      repair.reference
    }) has advanced to "${newStatus}". ${
      note ? `Technician note: "${note}". ` : ""
    }Track progress live: ${trackingUrl} or call ${BUSINESS_INFO.contact.phoneDisplay}.`;

    const smsNotification: MockNotification = {
      id: "sms_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timestamp: now,
      type: "sms",
      recipient: repair.whatsapp || repair.phone,
      recipientName: repair.fullName,
      reference: repair.reference,
      message: smsMessage,
      status: "delivered",
    };

    // 2. Generate Email message
    const emailSubject = `[Status Update: ${newStatus}] ${repair.deviceBrand} ${repair.deviceModel} Repair - Ref ${repair.reference}`;
    const emailMessage = `Dear ${repair.fullName},\n\nThis is an automated update regarding your repair ticket ${repair.reference}.\n\nPrevious Stage: ${previousStatus}\nCurrent Stage: ${newStatus}\nDevice: ${repair.deviceBrand} ${repair.deviceModel}\n\n${
      note ? `Technician Diagnostic Notes:\n${note}\n\n` : ""
    }You can view real-time workbench progress, verified diagnostic tests, and status history at any time on our status checker:\n${trackingUrl}\n\nFor technical inquiries or workshop coordination in Lagos, reply to this email or chat with us on WhatsApp at ${
      BUSINESS_INFO.contact.phoneDisplay
    }.\n\nBest regards,\nLead Technician\nOMJ Repairs, Lagos, Nigeria`;

    const emailNotification: MockNotification = {
      id: "email_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      timestamp: now,
      type: "email",
      recipient: repair.email || "client@omjrepairs.com",
      recipientName: repair.fullName,
      reference: repair.reference,
      subject: emailSubject,
      message: emailMessage,
      status: "delivered",
    };

    // Save to localStorage
    try {
      const existing = notificationService.getNotifications();
      const updated = [smsNotification, emailNotification, ...existing].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));

      // Dispatch event for live UI feedback
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("omj_notification_dispatched", {
            detail: { sms: smsNotification, email: emailNotification },
          })
        );
      }
    } catch (e) {
      console.error("Error saving notification:", e);
    }

    return { sms: smsNotification, email: emailNotification };
  },

  clearNotifications: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  },
};
