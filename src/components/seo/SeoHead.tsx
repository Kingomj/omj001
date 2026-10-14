/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BUSINESS_INFO } from "../../data/constants";

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: "website" | "article" | "service";
  schemaData?: Record<string, any> | Record<string, any>[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = "",
  type = "website",
  schemaData,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper to set or create meta tag
    const setMetaTag = (attrName: "name" | "property", attrValue: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // 2. Set Meta Description
    setMetaTag("name", "description", description);

    // 3. Set Canonical Link
    const origin = typeof window !== "undefined" ? window.location.origin : "https://omj-repairs.lagos.ng";
    const fullCanonicalUrl = `${origin}${canonicalPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullCanonicalUrl);

    // 4. OpenGraph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", fullCanonicalUrl);
    setMetaTag("property", "og:type", type === "article" ? "article" : "website");
    setMetaTag("property", "og:site_name", BUSINESS_INFO.name);
    setMetaTag("property", "og:locale", "en_NG");

    // 5. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

    // 6. Genuine Schema.org Structured Data
    // Baseline Genuine LocalBusiness & Organization JSON-LD
    const baseSchemas: Record<string, any>[] = [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${origin}/#localbusiness`,
        name: BUSINESS_INFO.name,
        description: BUSINESS_INFO.subtitle,
        url: origin,
        telephone: BUSINESS_INFO.contact.phoneTel,
        email: BUSINESS_INFO.contact.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressRegion: "Lagos State",
          addressCountry: "NG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "6.5244",
          longitude: "3.3792",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Lagos",
          },
          {
            "@type": "AdministrativeArea",
            name: "Lagos State",
          },
        ],
        priceRange: "$$",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "08:30",
            closes: "18:30",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: BUSINESS_INFO.name,
        url: origin,
        logo: `${origin}/assets/images/hero_omj_workspace.jpg`,
        sameAs: [
          BUSINESS_INFO.contact.instagramUrl,
          BUSINESS_INFO.contact.linkedinUrl,
        ].filter(Boolean),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: BUSINESS_INFO.contact.phoneTel,
          contactType: "technical support",
          areaServed: "NG",
          availableLanguage: ["English", "Yoruba", "Nigerian Pidgin"],
        },
      },
    ];

    if (schemaData) {
      if (Array.isArray(schemaData)) {
        baseSchemas.push(...schemaData);
      } else {
        baseSchemas.push(schemaData);
      }
    }

    // Injected Dynamic Schema Script tag
    const SCRIPT_ID = "omj-dynamic-seo-schema";
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = SCRIPT_ID;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(baseSchemas);

    return () => {
      // Cleanup script tag on route switch if needed
    };
  }, [title, description, canonicalPath, type, schemaData]);

  return null;
};
