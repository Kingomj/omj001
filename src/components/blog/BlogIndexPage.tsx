/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronRight,
  Sparkles,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { BLOG_POSTS, BlogPost } from "../../data/blogData";
import { BUSINESS_INFO } from "../../data/constants";
import { SeoHead } from "../seo/SeoHead";

interface BlogIndexPageProps {
  onNavigateHome: () => void;
  onSelectPost: (slug: string) => void;
  onNavigateServicePage: (slug: string) => void;
}

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({
  onNavigateHome,
  onSelectPost,
  onNavigateServicePage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "All",
    "Hardware & Upgrades",
    "Cooling & Maintenance",
    "Power & Protection",
    "Windows & Troubleshooting",
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const blogHubSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "OMJ Repairs Computer Tech Guides & Lagos Hardware Advice",
    description: "Practical computer repair guides, SSD upgrade advice, laptop cooling tutorials, and power protection tips for Lagos users.",
    url: "https://omj-repairs.lagos.ng/blog",
    publisher: {
      "@type": "LocalBusiness",
      name: BUSINESS_INFO.name,
      telephone: BUSINESS_INFO.contact.phoneTel,
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#FFFFFF] flex flex-col antialiased">
      <SeoHead
        title="Computer Tech Guides & Hardware Advice | OMJ Repairs Lagos"
        description="Practical computer repair guides, SSD upgrade advice, laptop cooling tutorials, and power surge protection tips tailored for computer users in Lagos, Nigeria."
        canonicalPath="/blog"
        type="website"
        schemaData={blogHubSchema}
      />

      {/* Top Breadcrumb Bar */}
      <header className="bg-[#0A0A0A] border-b border-[#222222] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onNavigateHome}
              className="text-[#A0A0A0] hover:text-[#00FF66] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>OMJ Repairs Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#555555]" />
            <span className="text-[#00FF66] font-medium">Tech Guides & Articles</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="text-xs text-[#A0A0A0] hover:text-white transition-colors"
          >
            Back to Homepage
          </button>
        </div>
      </header>

      <main className="flex-1 pb-16">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden pt-12 pb-14 border-b border-[#1E1E1E] bg-gradient-to-b from-[#0D0D0D] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono-tech uppercase font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lagos Computer Maintenance & Technical Guides</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Hardware Knowledge & Repair Guides
            </h1>

            <p className="text-sm sm:text-base text-[#A0A0A0] max-w-2xl mx-auto leading-relaxed">
              Straightforward, genuinely helpful technical guides written from our Lagos workbench. Learn how to protect your electronics, speed up slow laptops, and avoid common repair scams.
            </p>

            {/* Search Input */}
            <div className="max-w-md mx-auto pt-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles by topic, e.g. SSD, Overheating, Blue Screen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#121212] border border-[#222222] rounded-xl text-white placeholder-[#666666] focus:outline-none focus:border-[#00FF66] transition-colors"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER PILLS */}
        <section className="py-6 border-b border-[#1E1E1E] bg-[#080808]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#00FF66] text-[#050505] font-bold"
                    : "bg-[#141414] text-[#A0A0A0] hover:text-white border border-[#222222]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-[#777777] text-xs space-y-2">
                <BookOpen className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-white font-semibold">No articles found matching "{searchQuery}".</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="text-[#00FF66] hover:underline"
                >
                  Clear search and filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    onClick={() => onSelectPost(post.slug)}
                    className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/50 transition-all flex flex-col justify-between group cursor-pointer shadow-lg space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#141414] border border-[#222222] text-[#00FF66]">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#777777] font-mono-tech">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <h2 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#00FF66] transition-colors leading-snug">
                        {post.title}
                      </h2>

                      <p className="text-xs text-[#A0A0A0] leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#666666] font-mono-tech">
                        Published {new Date(post.publishDate).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <span className="font-bold text-[#00FF66] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
