/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquare } from "lucide-react";
import { BUSINESS_INFO } from "../../data/constants";

interface WhatsAppButtonProps {
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ customMessage }) => {
  const message = customMessage || BUSINESS_INFO.whatsappPrefilledMessages.general;
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-5 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#0D0D0D] hover:bg-[#121212] text-white border border-[#222222] hover:border-[#00FF66] p-3 md:py-2.5 md:px-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-200"
        aria-label="Chat with OMJ Repairs on WhatsApp"
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#00FF66] text-[#050505] shrink-0">
          <MessageSquare className="w-4 h-4 fill-current" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#050505] animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#050505]" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[11px] font-semibold text-white tracking-wide leading-tight">Chat with OMJ</span>
          <span className="text-[10px] text-[#00FF66] leading-tight">Online in Lagos</span>
        </div>
      </a>
    </aside>
  );
};
