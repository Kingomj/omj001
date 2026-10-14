/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { ServiceItem } from "../../types";

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onRequestService: (service: ServiceItem) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onRequestService }) => {
  if (!service) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0D0D] border border-[#222222] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-[#121212] border border-[#222222] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <span className="text-[11px] font-semibold text-[#00FF66] tracking-wider uppercase">
            {service.category}
          </span>
          <h2 id="modal-service-title" className="font-display text-2xl font-bold text-white mt-1">
            {service.title}
          </h2>
        </div>

        {/* Full description */}
        <p className="text-sm text-[#A0A0A0] leading-relaxed">
          {service.fullDesc}
        </p>

        {/* Included procedures */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Diagnostic & Technical Scope:
          </h3>
          <ul className="space-y-2">
            {service.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#A0A0A0]">
                <CheckCircle className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer if present */}
        {service.disclaimer && (
          <div className="p-3.5 rounded-lg bg-[#121212] border border-[#222222] flex items-start gap-2.5 text-xs text-[#A0A0A0]">
            <AlertCircle className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Service Note:</strong> {service.disclaimer}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onRequestService(service);
              onClose();
            }}
            className="w-full sm:w-auto flex-1 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Request This Service</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
