/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, ShieldCheck } from "lucide-react";
import { BUSINESS_INFO } from "../../data/constants";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-privacy-title"
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
          aria-label="Close Privacy Policy"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#00FF66]/10 border border-[#00FF66]/30 flex items-center justify-center text-[#00FF66]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 id="modal-privacy-title" className="font-display text-2xl font-bold text-white">
              Privacy Policy
            </h2>
            <p className="text-xs text-[#A0A0A0]">OMJ Repairs · Lagos, Nigeria</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-[#A0A0A0] leading-relaxed">
          <p>
            This Privacy Policy explains how <strong>OMJ Repairs</strong> handles customer information submitted through repair request forms, booking sessions, and direct communication channels.
          </p>

          <h3 className="text-sm font-semibold text-white">1. Information We Collect</h3>
          <p>
            When you submit a repair inquiry or book a service session, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your name, phone number, email address, and WhatsApp contact details.</li>
            <li>Information about your computer hardware, operating system, and reported faults.</li>
            <li>Any diagnostic photos or screenshots you choose to attach.</li>
          </ul>

          <h3 className="text-sm font-semibold text-white">2. How Your Information Is Used</h3>
          <p>
            Information submitted through our website is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to your initial inquiry and diagnostic requests.</li>
            <li>Perform technical hardware and software troubleshooting.</li>
            <li>Schedule drop-offs, pickups, or repair sessions in Lagos.</li>
            <li>Communicate quotation estimates, repair milestones, and testing outcomes.</li>
          </ul>

          <h3 className="text-sm font-semibold text-white">3. Device Data & Confidentiality</h3>
          <p>
            OMJ Repairs respects your privacy. During bench diagnosis and operating-system troubleshooting, the technician will only access directories necessary to diagnose system stability or verify hardware functionality. We never sell, lease, or distribute your personal documents, contacts, or photos to third parties.
          </p>

          <h3 className="text-sm font-semibold text-white">4. Customer Data Responsibility</h3>
          <p>
            While we take care when handling customer machines, customers remain responsible for backing up crucial data prior to leaving devices for repair. Hardware failures (such as failing SSDs or corrupt sectors) can deteriorate unpredictably during diagnostic testing.
          </p>

          <h3 className="text-sm font-semibold text-white">5. Contact Regarding Privacy</h3>
          <p>
            For any questions regarding your data, please contact OMJ Repairs at{" "}
            <a href={`mailto:${BUSINESS_INFO.contact.email}`} className="text-[#00FF66] hover:underline">
              {BUSINESS_INFO.contact.email}
            </a>.
          </p>
        </div>

        <div className="pt-2 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
