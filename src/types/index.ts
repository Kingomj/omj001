/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProblemCategory =
  | "Won't Turn On"
  | "Won't Boot"
  | "Windows Problem"
  | "Blue Screen"
  | "Slow Computer"
  | "Overheating"
  | "No Display"
  | "Storage Problem"
  | "RAM Problem"
  | "Virus/Malware"
  | "Networking/Wi-Fi"
  | "Software Problem"
  | "Upgrade"
  | "Other";

export type RepairLifecycleStatus =
  | "Request Received"
  | "Awaiting Diagnosis"
  | "Diagnosis in Progress"
  | "Awaiting Customer Approval"
  | "Repair in Progress"
  | "Testing"
  | "Ready for Collection"
  | "Completed";

export interface StatusHistoryEntry {
  status: RepairLifecycleStatus;
  timestamp: string;
  note?: string;
}

export type DiagnosticCategory =
  | "Power & Electrical"
  | "Memory & Hardware"
  | "Storage & Drives"
  | "Thermals & Cooling"
  | "OS & Software"
  | "Bench Stress & Verification";

export interface DiagnosticChecklistItem {
  id: string;
  name: string;
  category: DiagnosticCategory;
  completed: boolean;
  completedAt?: string;
  technicianNote?: string;
}

export interface RepairRequest {
  id: string;
  reference: string; // e.g., OMJ-000123
  fullName: string;
  phone: string;
  email: string;
  whatsapp: string;
  deviceType: "Laptop" | "Desktop PC" | "All-in-One" | "Custom Build" | "Other";
  deviceBrand: string;
  deviceModel: string;
  operatingSystem: "Windows 11" | "Windows 10" | "Windows 8/7" | "Linux" | "macOS" | "Not Sure / Won't Boot";
  problemCategory: ProblemCategory;
  description: string;
  startedWhen: string;
  triedAlready: string;
  preferredContactMethod: "WhatsApp" | "Phone Call" | "Email";
  preferredDate: string;
  imageUrls?: string[];
  status: RepairLifecycleStatus;
  statusHistory: StatusHistoryEntry[];
  technicianNotes?: string;
  checklist?: DiagnosticChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  email: string;
  device: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  servicePreference: "Technician Drop-off" | "Lagos Pickup Consultation" | "Remote Diagnostic Assessment";
  additionalInfo?: string;
  status: "Pending Confirmation" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number; // 1-5
  review: string;
  date: string;
  deviceOrService?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: "Hardware & Repairs" | "Operating Systems" | "Upgrades & Maintenance" | "Networking & Support";
  iconName: string;
  disclaimer?: string;
  features: string[];
}

export type ActivityActionType =
  | "status_change"
  | "checklist_update"
  | "note_added"
  | "intake_created"
  | "booking_converted"
  | "booking_status_change";

export interface TechnicianActivityLog {
  id: string;
  timestamp: string;
  reference: string;
  ticketType: "repair" | "booking";
  action: ActivityActionType;
  title: string;
  previousStatus?: string;
  newStatus?: string;
  note?: string;
  clientName: string;
  deviceInfo?: string;
  technician: string;
}
