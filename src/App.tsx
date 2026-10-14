/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { WhatsAppButton } from "./components/ui/WhatsAppButton";
import { Hero } from "./components/home/Hero";
import { WhyChooseUs } from "./components/home/WhyChooseUs";
import { HowItWorks } from "./components/home/HowItWorks";
import { TrustSection } from "./components/home/TrustSection";
import { ServicesSection } from "./components/services/ServicesSection";
import { RepairRequestForm } from "./components/repairs/RepairRequestForm";
import { BookingForm } from "./components/booking/BookingForm";
import { RepairStatusChecker } from "./components/repairs/RepairStatusChecker";
import { ReviewsSection } from "./components/reviews/ReviewsSection";
import { AboutSection } from "./components/about/AboutSection";
import { ContactSection } from "./components/contact/ContactSection";
import { PrivacyPolicyModal } from "./components/legal/PrivacyPolicyModal";
import { TermsOfServiceModal } from "./components/legal/TermsOfServiceModal";
import { TechnicianDrawer } from "./components/admin/TechnicianDrawer";
import { AdminPortal } from "./components/admin/AdminPortal";
import { SeoServicePage } from "./components/seo/SeoServicePage";
import { BlogIndexPage } from "./components/blog/BlogIndexPage";
import { BlogPostPage } from "./components/blog/BlogPostPage";
import { SEO_SERVICE_PAGES } from "./data/seoPagesData";
import { ProblemCategory, ServiceItem } from "./types";
import { storageService } from "./services/storageService";

type AppRoute =
  | { type: "home" }
  | { type: "seo_service"; slug: string }
  | { type: "blog_index" }
  | { type: "blog_post"; slug: string };

function parseRouteFromLocation(): AppRoute {
  if (typeof window === "undefined") return { type: "home" };
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "");
    if (slug) return { type: "blog_post", slug };
  }
  if (pathname === "/blog") {
    return { type: "blog_index" };
  }
  const potentialSlug = pathname.replace(/^\//, "");
  if (potentialSlug && potentialSlug in SEO_SERVICE_PAGES) {
    return { type: "seo_service", slug: potentialSlug };
  }
  return { type: "home" };
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(parseRouteFromLocation);
  const [activeSection, setActiveSection] = useState("home");
  const [prefilledProblem, setPrefilledProblem] = useState<ProblemCategory | null>(null);
  const [lookupReference, setLookupReference] = useState<string>("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminPortalActive, setIsAdminPortalActive] = useState(false);
  const [adminInitialRef, setAdminInitialRef] = useState<string | null>(null);

  const navigateTo = (path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", path);
      setRoute(parseRouteFromLocation());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRouteFromLocation());
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    storageService.init();

    // Check for WhatsApp deep links (?admin=true&ref=OMJ-XXXXXX or ?ref=OMJ-XXXXXX or #admin)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get("admin") || params.get("technician") || params.get("tech");
      const refParam = params.get("ref") || params.get("ticket") || params.get("id");

      if (adminParam === "true" || adminParam === "1" || window.location.hash === "#admin") {
        setIsAdminPortalActive(true);
        if (refParam) {
          setAdminInitialRef(refParam);
        }
      } else if (refParam) {
        setLookupReference(refParam);
        setTimeout(() => {
          scrollToSection("status");
        }, 150);
      }
    }

    // Intersection observer for section tracking
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const sectionIds = ["home", "services", "about", "request", "book", "status", "reviews", "contact"];
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navOffset = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 50);
  };

  const handleSelectServiceForRepair = (service: ServiceItem) => {
    // Map service to a relevant ProblemCategory
    let cat: ProblemCategory = "Other";
    if (service.id === "boot-problem-troubleshooting") cat = "Won't Boot";
    else if (service.id === "windows-installation") cat = "Windows Problem";
    else if (service.id === "ram-upgrades") cat = "RAM Problem";
    else if (service.id === "storage-upgrades") cat = "Storage Problem";
    else if (service.id === "virus-malware-troubleshooting") cat = "Virus/Malware";
    else if (service.id === "networking-support") cat = "Networking/Wi-Fi";
    else if (service.id === "laptop-cleaning-maintenance") cat = "Overheating";
    else if (service.id === "hardware-troubleshooting") cat = "Won't Turn On";
    else cat = "Upgrade";

    setPrefilledProblem(cat);
    scrollToSection("request");
  };

  const handleTrackReference = (reference: string) => {
    setLookupReference(reference);
    scrollToSection("status");
  };

  // If in dedicated Admin Portal view
  if (isAdminPortalActive) {
    return (
      <AdminPortal
        onExit={() => setIsAdminPortalActive(false)}
        initialReference={adminInitialRef}
        onViewClientTracking={(ref) => {
          setIsAdminPortalActive(false);
          setLookupReference(ref);
          setTimeout(() => {
            scrollToSection("status");
          }, 100);
        }}
      />
    );
  }

  // 1. Dedicated SEO Service Page Route (/computer-repair-lagos, etc.)
  if (route.type === "seo_service") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#050505]">
        <SeoServicePage
          slug={route.slug}
          onNavigateHome={(sec) => {
            navigateTo("/");
            if (sec) setTimeout(() => scrollToSection(sec), 150);
          }}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
          onOpenRepairRequest={() => {
            navigateTo("/");
            setTimeout(() => scrollToSection("request"), 150);
          }}
          onOpenBooking={() => {
            navigateTo("/");
            setTimeout(() => scrollToSection("book"), 150);
          }}
        />

        <Footer
          onNavigate={(sec) => {
            navigateTo("/");
            setTimeout(() => scrollToSection(sec), 150);
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenAdmin={() => setIsAdminPortalActive(true)}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
          onNavigateBlog={(slug) => navigateTo(slug ? "/blog/" + slug : "/blog")}
        />

        <WhatsAppButton />
        <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        <TechnicianDrawer
          isOpen={isAdminOpen}
          initialReference={adminInitialRef}
          onClose={() => {
            setIsAdminOpen(false);
            setAdminInitialRef(null);
          }}
          onSelectReferenceForStatus={(ref) => {
            navigateTo("/");
            setLookupReference(ref);
            setTimeout(() => scrollToSection("status"), 150);
          }}
        />
      </div>
    );
  }

  // 2. Tech Guides Blog Hub Route (/blog)
  if (route.type === "blog_index") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#050505]">
        <BlogIndexPage
          onNavigateHome={() => navigateTo("/")}
          onSelectPost={(slug) => navigateTo("/blog/" + slug)}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
        />

        <Footer
          onNavigate={(sec) => {
            navigateTo("/");
            setTimeout(() => scrollToSection(sec), 150);
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenAdmin={() => setIsAdminPortalActive(true)}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
          onNavigateBlog={(slug) => navigateTo(slug ? "/blog/" + slug : "/blog")}
        />

        <WhatsAppButton />
        <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        <TechnicianDrawer
          isOpen={isAdminOpen}
          initialReference={adminInitialRef}
          onClose={() => {
            setIsAdminOpen(false);
            setAdminInitialRef(null);
          }}
          onSelectReferenceForStatus={(ref) => {
            navigateTo("/");
            setLookupReference(ref);
            setTimeout(() => scrollToSection("status"), 150);
          }}
        />
      </div>
    );
  }

  // 3. Individual Blog Article Route (/blog/:slug)
  if (route.type === "blog_post") {
    return (
      <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#050505]">
        <BlogPostPage
          slug={route.slug}
          onNavigateHome={() => navigateTo("/")}
          onNavigateBlogHub={() => navigateTo("/blog")}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
          onSelectOtherPost={(slug) => navigateTo("/blog/" + slug)}
          onOpenRepairRequest={() => {
            navigateTo("/");
            setTimeout(() => scrollToSection("request"), 150);
          }}
        />

        <Footer
          onNavigate={(sec) => {
            navigateTo("/");
            setTimeout(() => scrollToSection(sec), 150);
          }}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenAdmin={() => setIsAdminPortalActive(true)}
          onNavigateServicePage={(slug) => navigateTo("/" + slug)}
          onNavigateBlog={(slug) => navigateTo(slug ? "/blog/" + slug : "/blog")}
        />

        <WhatsAppButton />
        <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
        <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        <TechnicianDrawer
          isOpen={isAdminOpen}
          initialReference={adminInitialRef}
          onClose={() => {
            setIsAdminOpen(false);
            setAdminInitialRef(null);
          }}
          onSelectReferenceForStatus={(ref) => {
            navigateTo("/");
            setLookupReference(ref);
            setTimeout(() => scrollToSection("status"), 150);
          }}
        />
      </div>
    );
  }

  // 4. Default Main Homepage
  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#050505]">
      {/* Top Navbar Contract */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={() => setIsAdminPortalActive(true)}
        onNavigateBlog={() => navigateTo("/blog")}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <div id="home">
          <Hero
            onRequestClick={() => scrollToSection("request")}
            onExploreServicesClick={() => scrollToSection("services")}
          />
        </div>

        <WhyChooseUs />

        <HowItWorks onRequestClick={() => scrollToSection("request")} />

        <TrustSection />

        <ServicesSection onSelectServiceForRepair={handleSelectServiceForRepair} />

        <RepairRequestForm
          initialServiceCategory={prefilledProblem}
          onTrackReference={handleTrackReference}
        />

        <BookingForm />

        <RepairStatusChecker initialReference={lookupReference} />

        <ReviewsSection />

        <AboutSection onRequestClick={() => scrollToSection("request")} />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenAdmin={() => setIsAdminPortalActive(true)}
        onNavigateServicePage={(slug) => navigateTo("/" + slug)}
        onNavigateBlog={(slug) => navigateTo(slug ? "/blog/" + slug : "/blog")}
      />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Legal & Technician Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <TechnicianDrawer
        isOpen={isAdminOpen}
        initialReference={adminInitialRef}
        onClose={() => {
          setIsAdminOpen(false);
          setAdminInitialRef(null);
        }}
        onSelectReferenceForStatus={(ref) => {
          setLookupReference(ref);
          scrollToSection("status");
        }}
      />
    </div>
  );
}
