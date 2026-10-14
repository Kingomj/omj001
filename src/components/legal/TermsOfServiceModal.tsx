/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, FileText } from "lucide-react";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-terms-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0D0D] border border-[#222222] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#121212] border border-[#222222] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          aria-label="Close Terms of Service"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 id="modal-terms-title" className="font-display text-2xl font-bold text-white">
              Terms of Service
            </h2>
            <p className="text-xs text-[#A0A0A0]">OMJ Repairs · Lagos, Nigeria</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#A0A0A0] leading-relaxed">
          <p>
            Please read these Terms of Service carefully before submitting a repair request or engaging the services of <strong>OMJ Repairs</strong>.
          </p>

          <h3 className="text-sm font-semibold text-white">1. Service Requests & Diagnosis</h3>
          <p>
            Submitting a repair request or booking an appointment does not constitute a guaranteed repair contract. All services begin with an initial diagnostic phase to determine fault feasibility, hardware viability, and component requirements.
          </p>

          <h3 className="text-sm font-semibold text-white">2. Quotes & Customer Approval</h3>
          <p>
            We do not execute chargeable component replacements or major operating system rebuilds without customer quotation approval. Once diagnostic findings are established, the customer will receive an itemized proposal detailing the repair plan and pricing.
          </p>

          <h3 className="text-sm font-semibold text-white">3. Repair Limitations</h3>
          <p>
            While every effort is made to troubleshoot and restore computer stability, not all devices are repairable. Computers with extensive multi-layer PCB burn, severe liquid corrosion, cracked silicon dies, or obsolete proprietary parts may be deemed uneconomical to repair.
          </p>

          <h3 className="text-sm font-semibold text-white">4. Data Backup Responsibility</h3>
          <p>
            <strong>Customer acknowledgment:</strong> OMJ Repairs does NOT guarantee data recovery. Customers are strongly urged to maintain backups of all essential personal files and databases. OMJ Repairs is not liable for data loss arising from pre-existing disk degradation, corrupted partitions, or unexpected drive failure during stress testing.
          </p>

          <h3 className="text-sm font-semibold text-white">5. Third-Party Hardware & Software Licensing</h3>
          <p>
            Replacement parts (such as SSDs, RAM modules, cooling fans, and power supplies) are sourced from reputable manufacturers. Operating system licenses (Windows, proprietary software) are the legal responsibility of the equipment owner.
          </p>

          <h3 className="text-sm font-semibold text-white">6. Service Availability & Geographic Scope</h3>
          <p>
            Our core operations and physical bench services are located in Lagos, Nigeria. Inquiries outside Lagos are evaluated on a case-by-case basis for remote consultations where technically feasible.
          </p>
        </div>

        <div className="pt-2 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge Terms
          </button>
        </div>
      </div>
    </div>
  );
};
