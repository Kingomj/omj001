/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Phone,
  Laptop,
  Activity,
  HardDrive,
  Cpu,
  MapPin,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { SeoServicePageData, SEO_SERVICE_PAGES } from "../../data/seoPagesData";
import { BUSINESS_INFO } from "../../data/constants";
import { SeoHead } from "./SeoHead";
import { cleanPhoneNumberForWhatsApp } from "../../utils/whatsappHelper";

interface SeoServicePageProps {
  slug: string;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateServicePage: (slug: string) => void;
  onOpenRepairRequest: () => void;
  onOpenBooking: () => void;
}

export const SeoServicePage: React.FC<SeoServicePageProps> = ({
  slug,
  onNavigateHome,
  onNavigateServicePage,
  onOpenRepairRequest,
  onOpenBooking,
}) => {
  const pageData: SeoServicePageData | undefined = SEO_SERVICE_PAGES[slug];

  if (!pageData) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold">Service Page Not Found</h2>
          <p className="text-xs text-[#A0A0A0]">
            The requested technical repair page could not be located.
          </p>
          <button
            onClick={() => onNavigateHome()}
            className="px-4 py-2 bg-[#00FF66] text-[#050505] rounded-lg text-xs font-bold"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Schema.org Service & Breadcrumb JSON-LD
  const serviceSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: pageData.h1,
      serviceType: pageData.serviceCategory,
      provider: {
        "@type": "LocalBusiness",
        name: BUSINESS_INFO.name,
        telephone: BUSINESS_INFO.contact.phoneTel,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressRegion: "Lagos State",
          addressCountry: "NG",
        },
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Lagos State, Nigeria",
      },
      description: pageData.metaDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://omj-repairs.lagos.ng/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: "https://omj-repairs.lagos.ng/#services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: pageData.h1,
          item: `https://omj-repairs.lagos.ng/${pageData.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased">
      {/* Dynamic SEO Meta & Structured Data */}
      <SeoHead
        title={pageData.title}
        description={pageData.metaDescription}
        canonicalPath={`/${pageData.slug}`}
        type="service"
        schemaData={serviceSchema}
      />

      {/* Top Breadcrumb & Return Bar */}
      <header className="bg-[#0A0A0A] border-b border-[#222222] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigateHome()}
              className="text-[#A0A0A0] hover:text-[#00FF66] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>OMJ Repairs Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#555555]" />
            <span className="text-[#A0A0A0] hidden sm:inline">Lagos Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#555555] hidden sm:inline" />
            <span className="text-[#00FF66] font-medium truncate max-w-[200px] sm:max-w-xs">
              {pageData.h1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhoneNumberForWhatsApp(BUSINESS_INFO.contact.whatsappNumber)}?text=${encodeURIComponent(
                `Hello OMJ Repairs, I am inquiring about your service: ${pageData.h1}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-bold text-[#050505] bg-[#25D366] hover:bg-[#20ba5a] rounded-lg transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp Consult</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pb-20 border-b border-[#1E1E1E] bg-gradient-to-b from-[#0D0D0D] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono-tech uppercase font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Lagos, Nigeria · Hardware & System Workbench</span>
            </div>

            {/* Exactly ONE Clear H1 */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {pageData.h1}
            </h1>

            <p className="text-base sm:text-lg text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
              {pageData.subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenRepairRequest}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] cursor-pointer"
              >
                Request a Repair
              </button>

              <button
                type="button"
                onClick={onOpenBooking}
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl transition-colors cursor-pointer"
              >
                Book Inspection Slot
              </button>
            </div>
          </div>
        </section>

        {/* OVERVIEW & LAGOS CONTEXT */}
        <section className="py-14 sm:py-18 border-b border-[#1E1E1E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Expert Technical Support in Lagos
              </h2>
              {pageData.overviewProse.map((para, i) => (
                <p key={i} className="text-sm sm:text-base text-[#B0B0B0] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Lagos Environmental / Operational Reality Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0C120E] border border-[#00FF66]/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#00FF66]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {pageData.lagosContext.heading}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                {pageData.lagosContext.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {pageData.lagosContext.areas.map((a, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#090D0A] border border-[#18261C] space-y-1">
                    <strong className="text-xs font-bold text-[#00FF66] block">{a.name}</strong>
                    <span className="text-[11px] text-[#888888] leading-tight block">{a.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMMON FAULTS RESOLVED */}
        <section className="py-14 sm:py-18 border-b border-[#1E1E1E] bg-[#080808]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-1.5 font-mono-tech">
                Common Symptoms
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Computer Problems We Troubleshoot & Fix
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pageData.commonIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] hover:border-[#333333] transition-colors space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FF66]" />
                    <h3 className="text-sm font-bold text-white">{issue.title}</h3>
                  </div>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR 4-STEP BENCH WORKFLOW */}
        <section className="py-14 sm:py-18 border-b border-[#1E1E1E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-1.5 font-mono-tech">
                Methodical Diagnostics
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Our 4-Step Technical Workflow
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1">
                No guessing or arbitrary part swapping. Every service follows our structured bench protocol.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pageData.benchProcess.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-2 relative"
                >
                  <span className="font-mono-tech text-2xl font-black text-[#00FF66]/30 block">
                    {step.step}
                  </span>
                  <h3 className="text-xs font-bold text-white">{step.title}</h3>
                  <p className="text-[11px] text-[#888888] leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="py-14 sm:py-18 border-b border-[#1E1E1E] bg-[#080808]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-1.5 font-mono-tech">
                Clear Answers
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {pageData.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#00FF66] shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed pl-6">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED SERVICES INTERNAL LINKS (Crucial for SEO Equity) */}
        <section className="py-14 sm:py-18 border-b border-[#1E1E1E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-1.5 font-mono-tech">
                Internal Links
              </p>
              <h2 className="font-display text-2xl font-bold text-white">
                Related Technical Services in Lagos
              </h2>
              <p className="text-xs text-[#A0A0A0]">
                Explore related diagnostic, upgrade, and maintenance solutions provided by OMJ Repairs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pageData.relatedServiceSlugs.map((relSlug) => {
                const relPage = SEO_SERVICE_PAGES[relSlug];
                if (!relPage) return null;
                return (
                  <button
                    key={relSlug}
                    type="button"
                    onClick={() => {
                      onNavigateServicePage(relSlug);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-4 rounded-xl bg-[#0D0D0D] hover:bg-[#121212] border border-[#222222] hover:border-[#00FF66]/40 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <strong className="text-xs font-bold text-white group-hover:text-[#00FF66] transition-colors block">
                        {relPage.h1}
                      </strong>
                      <span className="text-[11px] text-[#777777] line-clamp-1 mt-0.5">
                        {relPage.subtitle}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-[#00FF66] transition-colors shrink-0 ml-3" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="pt-14 sm:pt-18">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1810] to-[#0A120D] border-2 border-[#00FF66]/30 text-center space-y-5 shadow-[0_0_35px_-5px_rgba(0,255,102,0.2)]">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                Need Fast, Reliable Technical Service in Lagos?
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-xl mx-auto leading-relaxed">
                Whether you drop off your device at our workbench or require remote diagnostics, OMJ Repairs will identify the root problem and deliver clean, transparent solutions.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenRepairRequest}
                  className="px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] cursor-pointer"
                >
                  Submit Repair Request
                </button>

                <a
                  href={`tel:${BUSINESS_INFO.contact.phoneTel}`}
                  className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00FF66]" />
                  <span>Call {BUSINESS_INFO.contact.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
