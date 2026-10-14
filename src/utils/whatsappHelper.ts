/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BUSINESS_INFO } from "../data/constants";
import { BookingRequest, RepairRequest } from "../types";

/**
 * Normalizes phone numbers to standard international WhatsApp format without '+' or spaces.
 * Specifically handles Nigerian mobile numbers (e.g., 080..., 070..., 090..., 081...).
 */
export function cleanPhoneNumberForWhatsApp(raw: string): string {
  if (!raw) return BUSINESS_INFO.contact.whatsappNumber;
  let digits = raw.replace(/\D/g, "");

  // If local Nigerian format (e.g. 07040468694), replace leading 0 with 234
  if (digits.startsWith("0") && digits.length === 11) {
    digits = "234" + digits.slice(1);
  } else if (!digits.startsWith("234") && digits.length === 10) {
    digits = "234" + digits;
  }

  return digits || BUSINESS_INFO.contact.whatsappNumber;
}

/**
 * Gets base URL safely across browser and server-side preview environments.
 */
function getBaseUrl(overrideUrl?: string): string {
  if (overrideUrl) return overrideUrl.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://omjrepairs.com";
}

/**
 * Formats a comprehensive, professional WhatsApp message containing ALL details and Ticket ID
 * for the technician when a new repair request is submitted.
 */
export function formatRepairRequestWhatsAppMessage(
  request: RepairRequest,
  customBaseUrl?: string
): string {
  const baseUrl = getBaseUrl(customBaseUrl);
  const adminPortalLink = `${baseUrl}/?admin=true&ref=${encodeURIComponent(request.reference)}`;
  const liveTrackingLink = `${baseUrl}/?ref=${encodeURIComponent(request.reference)}#status`;

  return [
    `🛠️ *NEW COMPUTER REPAIR REQUEST* 🛠️`,
    `*Ticket Reference:* ${request.reference}`,
    `*Date Logged:* ${new Date(request.createdAt).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`,
    ``,
    `👤 *CUSTOMER INFORMATION*`,
    `• *Full Name:* ${request.fullName}`,
    `• *Phone Call:* ${request.phone}`,
    `• *WhatsApp:* ${request.whatsapp || request.phone}`,
    `• *Email:* ${request.email}`,
    `• *Preferred Contact:* ${request.preferredContactMethod}`,
    ``,
    `💻 *DEVICE DETAILS*`,
    `• *Device Type:* ${request.deviceType}`,
    `• *Brand & Model:* ${request.deviceBrand} ${request.deviceModel}`,
    `• *Operating System:* ${request.operatingSystem}`,
    ``,
    `⚠️ *FAULT & DIAGNOSIS SUMMARY*`,
    `• *Fault Category:* ${request.problemCategory}`,
    `• *Problem Began:* ${request.startedWhen}`,
    `• *Attempted Already:* ${request.triedAlready || "None"}`,
    `• *Detailed Description:*`,
    `"${request.description}"`,
    ``,
    `📅 *Preferred Service Date:* ${request.preferredDate || "Earliest available"}`,
    ``,
    `───────────────────────`,
    `⚡ *TECHNICIAN DIRECT TICKET LINK:*`,
    adminPortalLink,
    ``,
    `🔍 *CUSTOMER LIVE TRACKER:*`,
    liveTrackingLink,
  ].join("\n");
}

/**
 * Generates the direct WhatsApp URL to send the complete repair request to OMJ Repairs.
 */
export function getRepairRequestWhatsAppUrl(
  request: RepairRequest,
  customBaseUrl?: string
): string {
  const message = formatRepairRequestWhatsAppMessage(request, customBaseUrl);
  const targetNumber = BUSINESS_INFO.contact.whatsappNumber;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a comprehensive WhatsApp message for a booked repair session.
 */
export function formatBookingWhatsAppMessage(
  booking: BookingRequest,
  customBaseUrl?: string
): string {
  const baseUrl = getBaseUrl(customBaseUrl);
  const adminPortalLink = `${baseUrl}/?admin=true&tab=bookings`;

  return [
    `📅 *NEW REPAIR SESSION BOOKING* 📅`,
    `*Booking Reference:* ${booking.reference}`,
    `*Date Logged:* ${new Date(booking.createdAt).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`,
    ``,
    `👤 *CLIENT DETAILS*`,
    `• *Name:* ${booking.fullName}`,
    `• *Phone:* ${booking.phone}`,
    `• *Email:* ${booking.email}`,
    ``,
    `💻 *DEVICE & PROBLEM*`,
    `• *Device:* ${booking.device}`,
    `• *Reported Fault:* "${booking.problem}"`,
    ``,
    `🗓️ *SCHEDULED TIME*`,
    `• *Date:* ${booking.preferredDate}`,
    `• *Time Slot:* ${booking.preferredTime}`,
    `• *Location:* Lagos Workbench / Drop-off`,
    ``,
    `───────────────────────`,
    `⚡ *TECHNICIAN WORKSPACE:*`,
    adminPortalLink,
  ].join("\n");
}

/**
 * Generates the direct WhatsApp URL for a new booking.
 */
export function getBookingWhatsAppUrl(
  booking: BookingRequest,
  customBaseUrl?: string
): string {
  const message = formatBookingWhatsAppMessage(booking, customBaseUrl);
  const targetNumber = BUSINESS_INFO.contact.whatsappNumber;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a message that the technician can send directly to the CLIENT on WhatsApp
 * to update them on their repair status and diagnostic checklist progress.
 */
export function formatClientStatusUpdateWhatsAppMessage(
  request: RepairRequest,
  customBaseUrl?: string
): string {
  const baseUrl = getBaseUrl(customBaseUrl);
  const liveTrackingLink = `${baseUrl}/?ref=${encodeURIComponent(request.reference)}#status`;

  // Checklist verified count
  const checklist = request.checklist || [];
  const completedChecks = checklist.filter((c) => c.completed);
  const totalChecks = checklist.length;

  const lines = [
    `Hello *${request.fullName}*, this is OMJ Repairs in Lagos.`,
    ``,
    `Here is an official status update regarding your computer (*${request.deviceBrand} ${request.deviceModel}*):`,
    ``,
    `🏷️ *Ticket Reference:* ${request.reference}`,
    `⚡ *Current Status:* *${request.status}*`,
  ];

  if (request.technicianNotes && request.technicianNotes.trim()) {
    lines.push(``);
    lines.push(`🔧 *Technician Diagnostic Note:*`);
    lines.push(`"${request.technicianNotes.trim()}"`);
  }

  if (completedChecks.length > 0) {
    lines.push(``);
    lines.push(`✅ *Diagnostic Benchmark Progress:* ${completedChecks.length}/${totalChecks} checks verified.`);
    // List up to 3 recently verified checks
    const highlights = completedChecks.slice(0, 3).map((c) => `• ${c.name}`);
    lines.push(highlights.join("\n"));
  }

  lines.push(``);
  lines.push(`🔍 *Track Your Repair Progress Live Anytime:*`);
  lines.push(liveTrackingLink);
  lines.push(``);
  lines.push(`Feel free to reply here if you have any questions.`);
  lines.push(`*OMJ Repairs* · Professional Computer Repairs in Lagos`);

  return lines.join("\n");
}

/**
 * Generates the WhatsApp URL to send the status update directly to the CLIENT's WhatsApp number.
 */
export function getClientStatusUpdateWhatsAppUrl(
  request: RepairRequest,
  customBaseUrl?: string
): string {
  const message = formatClientStatusUpdateWhatsAppMessage(request, customBaseUrl);
  const clientPhone = cleanPhoneNumberForWhatsApp(request.whatsapp || request.phone);
  return `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;
}
