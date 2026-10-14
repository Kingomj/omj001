# OMJ Repairs — Official Website

> **"Your Computer. Our Expertise."**  
> **"Diagnose. Repair. Upgrade. Connect."**

A complete, production-ready, responsive business website for **OMJ Repairs**, a Lagos-based computer repair technician and technical support service.

---

## 1. Business Profile

- **Business Name:** OMJ Repairs
- **Specialty:** Computer & laptop hardware diagnostics, boot problem troubleshooting, Windows & Linux installation, macOS support, RAM and SSD upgrades, laptop maintenance, and data recovery assistance.
- **Location:** Lagos, Nigeria
- **Positioning:** Technical diagnostic-first workbench methodology. Identifying root faults methodically rather than blindly swapping parts.
- **Pricing Policy:** No fixed generic prices are publicly displayed. Customers are encouraged to request a diagnosis and quotation based on their machine's specific components and symptoms.

---

## 2. Contact & Social Channels

- **Phone (Voice):** `+234 704 046 8694` (`tel:+2347040468694`)
- **WhatsApp:** `+234 704 046 8694` (`https://wa.me/2347040468694`)
- **Email:** `olubayomosopeoluwa@gmail.com`
- **Instagram:** [https://www.instagram.com/omj.tech?stkn=MTI5dnhlZTV3d3YwdA==](https://www.instagram.com/omj.tech?stkn=MTI5dnhlZTV3d3YwdA==)
- **LinkedIn:** [https://www.linkedin.com/company/omj-repairs](https://www.linkedin.com/company/omj-repairs)
- **Service Hours:** Monday – Saturday: 8:30 AM – 6:30 PM (WAT / GMT+1)

---

## 3. Key Pages & Sections

1. **Top Bar Contract:** Wordmark branding, clean typography navigation, and prominent "Request a Repair" primary CTA.
2. **Hero Section:** High-impact technical visual representation with workstation photography, regional trust markers, and dual action pathways.
3. **Why Choose OMJ Repairs:** 4 pillars: Proper Diagnosis, Hardware Expertise, Multiple Operating Systems, and Clear Communication.
4. **How It Works:** 4-step process (Tell Us What's Wrong → Diagnosis → Quote → Repair) with transparent disclaimers.
5. **Services Section:** 15 distinct technical services with filterable tabs, search bar, comprehensive modals, and non-exaggerated disclaimers.
6. **Repair Request Form & WhatsApp Direct Dispatch:** Full multi-step form with validation, device specifications, photo upload previews, and sequential OMJ reference generator (e.g. `OMJ-000103`). Automatically forwards every request with all device specs, fault symptoms, and Ticket ID straight to the OMJ WhatsApp number (`+234 704 046 8694`).
7. **Book a Repair:** Scheduling interface for workbench drop-off, pickup inquiries, or remote consultations with no upfront online payment lock and direct WhatsApp booking confirmation.
8. **Repair Status Checker:** Interactive 8-phase progression tracker with real-time audit milestones, technician notes, verified diagnostic steps, and direct WhatsApp sync.
9. **WhatsApp-Linked Technician Workspace:** WhatsApp messages sent to the technician include direct deep links (`?admin=true&ref=OMJ-XXXXXX`) that open the ticket on the website immediately. From the technician drawer, the technician can update the stage or checklist and send an instant formatted status report to the client on WhatsApp with one click.
9. **Customer Reviews:** Honest state ("Customer reviews will appear here. No customer reviews yet. Be one of the first to share your experience.") with an interactive "Leave a Review" modal.
10. **About OMJ Repairs:** Factual presentation of key skills and diagnostic philosophy in Lagos, without invented certifications or inflated metrics.
11. **Contact Section:** Direct tap-to-call, click-to-WhatsApp, mailto, and quick message inquiry form.
12. **Legal Pages:** Dedicated Privacy Policy and Terms of Service modals.
13. **Technician Workspace & Service Checklist:** Discreet future-ready administrative drawer in the footer to review logged requests, advance repair stages, toggle per-ticket diagnostic service steps (Power Supply Test, Memory Integrity Check, OS Corruptness Audit, etc.), add bench notes, view bookings, and export database JSON.
14. **Persistent Floating WhatsApp Button:** Accessible with prefilled message.

---

## 4. Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (v4) with dark theme palette (`#050505` canvas, `#00FF66` primary accent, `#121212` structural cards, `#222222` borders)
- **Icons:** Lucide React
- **Storage & Architecture:** Modular repository pattern (`storageService.ts`) with LocalStorage fallback, ready for zero-downtime Firebase Firestore binding.

---

## 5. Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 6. SEO & Metadata

- OpenGraph and Twitter Cards configured for Lagos searches.
- Schema.org `LocalBusiness` JSON-LD structured data embedded in `index.html`.
- Production `robots.txt` and `sitemap.xml` generated in `/public`.
