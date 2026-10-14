/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem } from "../types";

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "computer-laptop-repairs",
    title: "Computer & Laptop Repairs",
    category: "Hardware & Repairs",
    iconName: "Wrench",
    shortDesc: "Hardware diagnosis and troubleshooting for laptops and desktop computers in Lagos.",
    fullDesc:
      "Comprehensive bench assessment for laptops and desktop PCs experiencing hardware complications. We diagnose power issues, component failures, intermittent shutdowns, and structural faults, providing practical solutions based on realistic device assessment.",
    features: [
      "Laptop chassis and internal board inspections",
      "Desktop PC component testing",
      "Power delivery & charging port troubleshooting",
      "Display and hinge inspection",
    ],
    disclaimer: "All repairs are subject to initial hardware diagnosis and parts availability.",
  },
  {
    id: "hardware-troubleshooting",
    title: "Hardware Troubleshooting",
    category: "Hardware & Repairs",
    iconName: "Cpu",
    shortDesc: "Diagnose hardware-related problems and identify possible faulty components.",
    fullDesc:
      "Pinpoint failure points across motherboards, power supplies, memory modules, GPUs, and peripherals. We isolate whether issues stem from failing capacitors, bad voltage lines, or incompatible parts before suggesting replacements.",
    features: [
      "Individual component stress testing",
      "Power supply unit (PSU) voltage checks",
      "Faulty motherboard rail isolation",
      "Thermal load diagnostic benchmarking",
    ],
    disclaimer: "Identification of faulty components is subject to technical workbench testing.",
  },
  {
    id: "boot-problem-troubleshooting",
    title: "Boot Problem Troubleshooting",
    category: "Operating Systems",
    iconName: "Power",
    shortDesc: "Help with computers that do not boot, get stuck, or show startup errors.",
    fullDesc:
      "Targeted diagnosis for systems that fail to start up. Whether your computer turns on with no display, hangs at the manufacturer logo, loops in automatic repair, or throws BCD/GRUB startup errors, we determine whether the cause is software corruption or hardware failure.",
    features: [
      "Stuck startup & spinning dots diagnosis",
      "Bootloader (EFI / BCD / GRUB) rebuilds",
      "No POST / beep code evaluation",
      "Automatic repair loop resolution",
    ],
    disclaimer: "Boot problems may be rooted in either file corruption or physical drive degradation.",
  },
  {
    id: "windows-installation",
    title: "Windows Installation & Troubleshooting",
    category: "Operating Systems",
    iconName: "Layers",
    shortDesc: "Installation, reinstallation, recovery, configuration, and troubleshooting of Windows systems.",
    fullDesc:
      "Clean installations, system upgrades, and stability fixes for Windows 10 and Windows 11. Includes clean partitioning, essential runtime installation, driver alignment, and optimization for everyday workflow without unwanted bloatware.",
    features: [
      "Clean Windows 11 & Windows 10 deployment",
      "Corrupted Windows file repair (SFC / DISM)",
      "System update crash and loop resolution",
      "Driver and runtime environment setup",
    ],
    disclaimer: "Valid operating system licensing is required from the client where applicable.",
  },
  {
    id: "linux-installation",
    title: "Linux Installation",
    category: "Operating Systems",
    iconName: "Terminal",
    shortDesc: "Installation and basic configuration of Linux operating systems for developers and users.",
    fullDesc:
      "Setup and configuration of stable Linux distributions including Ubuntu, Fedora, Debian, and Linux Mint. Ideal for software development, programming workstations, lightweight repurposing of older machines, or dual-boot environments.",
    features: [
      "Distribution selection advice for your hardware",
      "Clean disk partitioning and dual-boot setup",
      "Essential proprietary driver installation (Wi-Fi/GPU)",
      "Basic desktop environment optimization",
    ],
    disclaimer: "Hardware compatibility varies depending on manufacturer wireless chips and graphic cards.",
  },
  {
    id: "macos-support",
    title: "macOS Installation / Support",
    category: "Operating Systems",
    iconName: "Laptop",
    shortDesc: "macOS installation and troubleshooting services where technically and legally appropriate.",
    fullDesc:
      "Software recovery, system reinstallation, and basic troubleshooting for genuine Apple MacBooks and iMacs where supported. We help with macOS Recovery issues, account locks resolution assistance (with proof of ownership), and application crashes.",
    features: [
      "macOS recovery and reinstallation via internet recovery",
      "Storage clean-up and permission rebuilds",
      "Peripheral compatibility troubleshooting",
      "Safe mode diagnostics and startup manager support",
    ],
    disclaimer: "Services strictly limited to supported Apple hardware; no unauthorized modifications.",
  },
  {
    id: "ram-upgrades",
    title: "RAM Upgrades",
    category: "Upgrades & Maintenance",
    iconName: "Zap",
    shortDesc: "Help customers upgrade laptop and desktop RAM where the device supports an upgrade.",
    fullDesc:
      "Evaluation and installation of compatible DDR3, DDR4, or DDR5 memory modules. We verify whether your laptop has upgradeable SODIMM slots or soldered memory, identify frequency match and channel balance, and test stability post-installation.",
    features: [
      "Compatibility verification (SODIMM vs soldered)",
      "Dual-channel architecture optimization",
      "Desktop DIMM and workstation memory matching",
      "Memory diagnostic pass after installation",
    ],
    disclaimer: "RAM upgrade capability is hardware-dependent; many ultrabooks feature non-upgradeable soldered RAM.",
  },
  {
    id: "storage-upgrades",
    title: "Storage Upgrades (SSD / HDD)",
    category: "Upgrades & Maintenance",
    iconName: "HardDrive",
    shortDesc: "Upgrade your computer's storage for more space and potentially better performance.",
    fullDesc:
      "Replace slow or aging mechanical hard drives with modern NVMe or SATA Solid State Drives (SSDs). We verify compatibility with your motherboard, install the appropriate storage form factor (M.2 NVMe, SATA 2.5\"), and handle OS deployment.",
    features: [
      "High-speed NVMe PCIe and SATA SSD installations",
      "Drive health inspection (S.M.A.R.T. status check)",
      "Secondary storage drive additions for desktop towers",
      "Partitioning and drive format configuration",
    ],
    disclaimer: "Upgrade your computer's storage for more space and potentially better performance. Specific speed improvements depend on system architecture.",
  },
  {
    id: "os-recovery",
    title: "Operating System Recovery",
    category: "Operating Systems",
    iconName: "RefreshCw",
    shortDesc: "Help diagnose and recover systems experiencing operating-system or boot problems.",
    fullDesc:
      "Diagnostic intervention when your operating system crashes, fails to load user profiles, or encounters critical system registry corruption. We attempt recovery procedures before any destructive reinstall is considered.",
    features: [
      "Corrupted user profile troubleshooting",
      "Registry hive recovery and restore points",
      "Startup repair and recovery environment diagnostics",
      "Kernel panic and critical error assessment",
    ],
    disclaimer: "Recovery success is contingent upon the severity of underlying drive or filesystem degradation.",
  },
  {
    id: "software-driver-installation",
    title: "Software & Driver Installation",
    category: "Upgrades & Maintenance",
    iconName: "Sliders",
    shortDesc: "Installation and configuration of necessary drivers and software utilities.",
    fullDesc:
      "Proper installation of chipset drivers, discrete GPU drivers (Nvidia, AMD, Intel), audio codecs, wireless cards, and productivity suites. Eliminates unknown devices in Device Manager and resolves device conflicts.",
    features: [
      "Manufacturer-verified OEM driver installation",
      "Discrete graphics driver configuration",
      "Audio and Wi-Fi adapter setup",
      "Productivity runtime bundles (Visual C++, .NET)",
    ],
    disclaimer: "Software provided must be legally licensed or open-source.",
  },
  {
    id: "virus-malware-troubleshooting",
    title: "Virus / Malware Troubleshooting",
    category: "Hardware & Repairs",
    iconName: "ShieldAlert",
    shortDesc: "Help diagnose and resolve common malware and unwanted-software problems.",
    fullDesc:
      "Thorough scanning and remediation of adware, browser hijackers, malicious background miners, and stubborn malware causing high CPU usage or system instability. We clean up persistence mechanisms and review startup programs.",
    features: [
      "Deep malware scan with offline bootable utilities",
      "Browser hijacker and rogue extension removal",
      "Unwanted startup item purging",
      "Windows Defender and security configuration check",
    ],
    disclaimer: "Heavily infected systems with compromised system files may require a clean OS reinstallation.",
  },
  {
    id: "laptop-cleaning-maintenance",
    title: "Laptop Cleaning & Maintenance",
    category: "Upgrades & Maintenance",
    iconName: "Sparkles",
    shortDesc: "Basic computer maintenance, internal cleaning, and thermal optimization.",
    fullDesc:
      "Preventive maintenance to combat Lagos dust and heat buildup. Includes careful disassembly, fan cleaning, copper heatsink dust purging, and fresh non-conductive thermal paste application to keep operating temperatures within safe limits.",
    features: [
      "Cooling fan dust and debris extraction",
      "Thermal paste replacement with high-performance compound",
      "Port and exhaust airway clearing",
      "Thermal throttling assessment before and after",
    ],
    disclaimer: "Thermal maintenance lowers operating temperatures but cannot repair already damaged silicon.",
  },
  {
    id: "networking-support",
    title: "Networking Support",
    category: "Networking & Support",
    iconName: "Wifi",
    shortDesc: "Basic computer networking and connectivity troubleshooting for home and remote workers.",
    fullDesc:
      "Troubleshoot laptop Wi-Fi dropping issues, Ethernet port failures, DNS resolution errors, IP conflicts, and router handshake troubles. Ideal for remote workers who need reliable connectivity across Lagos networks.",
    features: [
      "Wi-Fi card driver and power-management fixes",
      "TCP/IP stack and Winsock reset procedures",
      "Static IP and DNS optimization for reliable access",
      "Local file sharing and network discovery setup",
    ],
    disclaimer: "ISP downtime or local cellular network coverage issues are beyond technician control.",
  },
  {
    id: "printer-support",
    title: "Printer Support",
    category: "Networking & Support",
    iconName: "Printer",
    shortDesc: "Basic printer setup, spooler troubleshooting, and driver connectivity support.",
    fullDesc:
      "Resolution of common printer headaches: print spooler crashes, stuck print queues, network printer discovery issues, and proper driver installation for HP, Canon, Epson, and Brother printers.",
    features: [
      "Print spooler service diagnosis and restart",
      "USB and wireless network printer setup",
      "Manufacturer full-feature driver installation",
      "Stuck queue and offline status troubleshooting",
    ],
    disclaimer: "Physical printer hardware damage (broken rollers, dried printheads) is subject to parts availability.",
  },
  {
    id: "data-backup-recovery-assistance",
    title: "Data Backup & Recovery Assistance",
    category: "Networking & Support",
    iconName: "Database",
    shortDesc: "Assist customers with data backup and certain data-recovery situations.",
    fullDesc:
      "Assistance transferring personal files, documents, and pictures to external drives or cloud storage, and recovering files from unbootable computers or unintentionally deleted storage where the drive remains functional.",
    features: [
      "Data migration to external hard drive / SSD",
      "File retrieval from unbootable Windows systems",
      "Assistance setting up automatic backup workflows",
      "Logical partition recovery assistance",
    ],
    disclaimer: "Assistance only. We do NOT promise or guarantee data recovery. Severely physically damaged, water-logged, or clicking drive platters require specialist cleanroom recovery.",
  },
];
