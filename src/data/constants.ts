/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BUSINESS_INFO = {
  name: "OMJ Repairs",
  primaryTagline: "Your Computer. Our Expertise.",
  secondaryTagline: "Diagnose. Repair. Upgrade. Connect.",
  subtitle: "Professional computer repairs, upgrades and technical support in Lagos.",
  heroProse:
    "Whether your computer won't boot, needs an operating-system installation, requires a hardware upgrade, or is simply giving you trouble, OMJ Repairs can help diagnose the problem and find the right solution.",
  trustProse:
    "From boot problems to hardware upgrades, OMJ Repairs focuses on diagnosing the problem and providing a practical solution.",
  location: "Lagos, Nigeria",
  workingHours: "Monday – Saturday: 8:30 AM – 6:30 PM",
  responseTime: "Within 2–4 hours during business hours",

  contact: {
    phoneDisplay: "+234 704 046 8694",
    phoneTel: "+2347040468694",
    whatsappNumber: "2347040468694",
    email: "olubayomosopeoluwa@gmail.com",
    instagramUrl: "https://www.instagram.com/omj.tech?stkn=MTI5dnhlZTV3d3YwdA==",
    linkedinUrl: "https://www.linkedin.com/company/omj-repairs",
  },

  whatsappPrefilledMessages: {
    general: "Hello OMJ Repairs, I need help with my computer.",
    repairRef: (ref: string) => `Hello OMJ Repairs, I am contacting you regarding my repair request: ${ref}`,
    bookingRef: (ref: string) => `Hello OMJ Repairs, I have booked a repair session with reference: ${ref}`,
  },
};

export const PROBLEM_CATEGORIES = [
  "Won't Turn On",
  "Won't Boot",
  "Windows Problem",
  "Blue Screen",
  "Slow Computer",
  "Overheating",
  "No Display",
  "Storage Problem",
  "RAM Problem",
  "Virus/Malware",
  "Networking/Wi-Fi",
  "Software Problem",
  "Upgrade",
  "Other",
] as const;

export const REPAIR_STATUS_STEPS = [
  { status: "Request Received", description: "Form submitted and logged into queue" },
  { status: "Awaiting Diagnosis", description: "Scheduled for hardware/software inspection" },
  { status: "Diagnosis in Progress", description: "Technician actively testing and troubleshooting" },
  { status: "Awaiting Customer Approval", description: "Diagnosis complete and quotation sent" },
  { status: "Repair in Progress", description: "Approved repair or upgrade being performed" },
  { status: "Testing", description: "Bench-testing stability, thermal, and OS load" },
  { status: "Ready for Collection", description: "Device ready for customer pickup or handover" },
  { status: "Completed", description: "Device collected and service verified" },
] as const;

export const DEFAULT_DIAGNOSTIC_STEPS = [
  {
    id: "diag_psu",
    name: "Power Supply Test",
    category: "Power & Electrical" as const,
    defaultCompleted: false,
    description: "Multimeter test on charger voltage output, DC jack continuity, and motherboard VRM rails.",
  },
  {
    id: "diag_board_rail",
    name: "Motherboard Power Rail & Capacitor Test",
    category: "Power & Electrical" as const,
    defaultCompleted: false,
    description: "Inspect 3.3V / 5V / 12V standby rails, short circuits, and capacitor bulges.",
  },
  {
    id: "diag_battery",
    name: "Battery & Charging Circuit Test",
    category: "Power & Electrical" as const,
    defaultCompleted: false,
    description: "Cycle count verification, charging IC handshake, and degradation percentage.",
  },
  {
    id: "diag_mem",
    name: "Memory Integrity Check",
    category: "Memory & Hardware" as const,
    defaultCompleted: false,
    description: "MemTest86+ full diagnostic cycle to detect bad addresses, channel asymmetry, or parity errors.",
  },
  {
    id: "diag_smart",
    name: "Drive S.M.A.R.T. & Bad Sector Health Audit",
    category: "Storage & Drives" as const,
    defaultCompleted: false,
    description: "Inspect drive reallocated sector count, NVMe life remaining, and spare block integrity.",
  },
  {
    id: "diag_storage_speed",
    name: "Storage IOPS & Read/Write Benchmark",
    category: "Storage & Drives" as const,
    defaultCompleted: false,
    description: "Verify sequential and random throughput against expected manufacturer baseline.",
  },
  {
    id: "diag_thermals",
    name: "Cooling Fan & Heat Pipe Thermal Inspection",
    category: "Thermals & Cooling" as const,
    defaultCompleted: false,
    description: "Inspect fan bearing RPM, exhaust fins dust blockage, and thermal paste liquidity.",
  },
  {
    id: "diag_os_audit",
    name: "OS Corruptness Audit",
    category: "OS & Software" as const,
    defaultCompleted: false,
    description: "Run SFC /scannow and DISM restorehealth scans to identify corrupted system manifests.",
  },
  {
    id: "diag_bootloader",
    name: "Bootloader & EFI / BCD Structure Verification",
    category: "OS & Software" as const,
    defaultCompleted: false,
    description: "Verify active ESP partition, BCD hive pointers, and secure boot configuration.",
  },
  {
    id: "diag_malware",
    name: "Malware, Adware & Background Miner Scan",
    category: "OS & Software" as const,
    defaultCompleted: false,
    description: "Scan persistence registry entries, startup tasks, and unauthorized crypto miner processes.",
  },
  {
    id: "diag_drivers",
    name: "Driver Conflict & Device Manager Audit",
    category: "OS & Software" as const,
    defaultCompleted: false,
    description: "Audit chipset, GPU, and wireless driver conflicts or yellow exclamation warnings.",
  },
  {
    id: "diag_stress",
    name: "30-Minute Bench Stress Test Under Load",
    category: "Bench Stress & Verification" as const,
    defaultCompleted: false,
    description: "Simulate sustained CPU/GPU workload while monitoring peak temperatures and voltage stability.",
  },
  {
    id: "diag_peripherals",
    name: "Display, Ports & Wi-Fi Stability Check",
    category: "Bench Stress & Verification" as const,
    defaultCompleted: false,
    description: "Test USB ports, HDMI output, keyboard keys, and 5GHz/2.4GHz Wi-Fi packet stability.",
  },
] as const;
