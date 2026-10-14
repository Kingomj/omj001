/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Calendar,
  Share2,
  MessageSquare,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../../data/blogData";
import { BUSINESS_INFO } from "../../data/constants";
import { SeoHead } from "../seo/SeoHead";
import { cleanPhoneNumberForWhatsApp } from "../../utils/whatsappHelper";

interface BlogPostPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateBlogHub: () => void;
  onNavigateServicePage: (serviceSlug: string) => void;
  onSelectOtherPost: (postSlug: string) => void;
  onOpenRepairRequest: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  slug,
  onNavigateHome,
  onNavigateBlogHub,
  onNavigateServicePage,
  onSelectOtherPost,
  onOpenRepairRequest,
}) => {
  const post: BlogPost | undefined = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-xl font-bold">Article Not Found</h2>
          <p className="text-xs text-[#A0A0A0]">
            The requested technical guide could not be located.
          </p>
          <button
            onClick={onNavigateBlogHub}
            className="px-4 py-2 bg-[#00FF66] text-[#050505] rounded-lg text-xs font-bold"
          >
            Return to Tech Guides Hub
          </button>
        </div>
      </div>
    );
  }

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://omj-repairs.lagos.ng/blog/${post.slug}`,
    },
    author: {
      "@type": "Organization",
      name: BUSINESS_INFO.name,
      url: "https://omj-repairs.lagos.ng",
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: "https://omj-repairs.lagos.ng/assets/images/hero_omj_workspace.jpg",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased">
      <SeoHead
        title={`${post.title} | OMJ Repairs Lagos Tech Guide`}
        description={post.metaDescription}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        schemaData={articleSchema}
      />

      {/* Top Breadcrumbs */}
      <header className="bg-[#0A0A0A] border-b border-[#222222] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onNavigateHome}
              className="text-[#A0A0A0] hover:text-[#00FF66] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#555555]" />
            <button
              onClick={onNavigateBlogHub}
              className="text-[#A0A0A0] hover:text-[#00FF66] transition-colors cursor-pointer"
            >
              Tech Guides
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#555555]" />
            <span className="text-[#00FF66] font-medium truncate max-w-[180px] sm:max-w-xs">
              {post.category}
            </span>
          </div>

          <button
            onClick={onNavigateBlogHub}
            className="text-xs text-[#A0A0A0] hover:text-white transition-colors"
          >
            All Guides
          </button>
        </div>
      </header>

      <main className="flex-1 pb-16">
        {/* ARTICLE HEADER */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-[#777777] font-mono-tech">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(post.publishDate).toLocaleDateString("en-NG", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#777777] font-mono-tech">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Clear Single H1 */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-base text-[#A0A0A0] leading-relaxed border-l-2 border-[#00FF66] pl-4 italic">
              {post.excerpt}
            </p>
          </div>

          {/* ARTICLE BODY SECTIONS */}
          <div className="space-y-10 pt-4 border-t border-[#1C1C1C]">
            {post.content.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {sec.sectionHeading}
                </h2>

                <div className="space-y-3">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base text-[#C0C0C0] leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Practical Tips Box */}
                {sec.tips && sec.tips.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#0C120E] border border-[#00FF66]/30 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#00FF66]">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span>Technician Key Insights</span>
                    </div>
                    <ul className="space-y-1.5 pl-6 list-disc text-xs sm:text-sm text-[#A0A0A0]">
                      {sec.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* RELATED SERVICE CTA BANNER */}
          <div className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c1810] to-[#0A120D] border-2 border-[#00FF66]/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono-tech text-[#00FF66] font-bold uppercase tracking-wider">
              <Wrench className="w-4 h-4" />
              <span>Lagos Workbench Service</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white">
              Need Professional Assistance in Lagos?
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              If your computer is experiencing hardware bottlenecks, overheating, or unbootable operating systems, our technical workbench in Lagos is ready to diagnose and resolve it.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onNavigateServicePage(post.relatedServiceSlug);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-5 py-2.5 text-xs font-bold text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Explore {post.relatedServiceLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/${cleanPhoneNumberForWhatsApp(BUSINESS_INFO.contact.whatsappNumber)}?text=${encodeURIComponent(
                  `Hello OMJ Repairs, I read your guide "${post.title}" and would like to ask about my computer.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#141414] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current text-[#25D366]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* MORE ARTICLES */}
          <div className="pt-8 border-t border-[#1C1C1C] space-y-4">
            <h3 className="font-display text-lg font-bold text-white">
              More Computer Tech Guides
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherPosts.map((op) => (
                <div
                  key={op.slug}
                  onClick={() => {
                    onSelectOtherPost(op.slug);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-4 rounded-xl bg-[#0D0D0D] hover:bg-[#141414] border border-[#222222] transition-colors cursor-pointer space-y-2 group"
                >
                  <span className="text-[10px] text-[#00FF66] font-mono-tech">{op.category}</span>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#00FF66] transition-colors line-clamp-2">
                    {op.title}
                  </h4>
                  <span className="text-[11px] text-[#777777] block font-mono-tech">
                    {op.readTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
