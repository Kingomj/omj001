/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Plus, CheckCircle, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomerReview } from "../../types";
import { storageService } from "../../services/storageService";
import {
  fadeInUp,
  fadeInScale,
  staggerContainer,
  staggerItem,
  VIEWPORT_CONFIG,
} from "../../utils/motionPresets";

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formDevice, setFormDevice] = useState("");
  const [formReview, setFormReview] = useState("");
  const [formError, setFormError] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    setReviews(storageService.getAllReviews());
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formReview.trim() || formReview.trim().length < 10) {
      setFormError("Please write at least a few words describing your experience.");
      return;
    }

    storageService.submitReview({
      customerName: formName.trim(),
      rating: formRating,
      deviceOrService: formDevice.trim() || "Computer Repair & Support",
      review: formReview.trim(),
    });

    setReviews(storageService.getAllReviews());
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      setFormName("");
      setFormReview("");
      setFormDevice("");
      setFormRating(5);
      setFormError("");
    }, 1200);
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-[#050505] border-b border-[#222222] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-[#00FF66] font-semibold mb-2">
              Customer Feedback
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Client Experiences
            </h2>
            <p className="mt-3 text-sm text-[#A0A0A0]">
              Transparent feedback from real customers across Lagos. We do not manufacture fake reviews.
            </p>
          </div>

          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.2)] hover:shadow-[0_0_20px_rgba(0,255,102,0.35)]"
            >
              <Plus className="w-4 h-4" />
              <span>Leave a Review</span>
            </button>
          </div>
        </motion.div>

        {/* Empty state or reviews list */}
        {reviews.length === 0 ? (
          <motion.div
            variants={fadeInScale}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="bg-[#0D0D0D] border border-[#222222] rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#222222] flex items-center justify-center mx-auto text-[#00FF66]">
              <MessageSquare className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg font-bold text-white">
              Customer reviews will appear here.
            </h3>

            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              No customer reviews yet. Be one of the first to share your experience with OMJ Repairs in Lagos.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-[#00FF66] bg-[#121212] border border-[#222222] hover:border-[#00FF66]/50 rounded-lg transition-colors cursor-pointer"
              >
                Write First Review
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reviews.map((rev) => (
              <motion.div
                key={rev.id}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0D0D0D] border border-[#222222] hover:border-[#00FF66]/40 transition-colors rounded-xl p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? "fill-amber-400" : "text-[#333333]"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono-tech text-[#A0A0A0]">
                      {rev.date}
                    </span>
                  </div>

                  <p className="text-xs text-white/90 leading-relaxed mb-4">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{rev.customerName}</span>
                    {rev.deviceOrService && (
                      <span className="text-[11px] text-[#A0A0A0]">{rev.deviceOrService}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#00FF66] font-mono-tech flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Leave a Review Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-review-title"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-[#0D0D0D] border border-[#222222] rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-[#A0A0A0] hover:text-white cursor-pointer"
                  aria-label="Close review modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 id="modal-review-title" className="font-display text-xl font-bold text-white">
                  Leave a Genuine Review
                </h2>

                {submittedSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-[#00FF66] mx-auto" />
                    <p className="text-sm font-semibold text-white">Thank you for your feedback!</p>
                    <p className="text-xs text-[#A0A0A0]">Your review has been saved.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4" noValidate>
                    {formError && (
                      <p className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-xs">
                        {formError}
                      </p>
                    )}

                    <div>
                      <label htmlFor="rev-name" className="block text-xs font-medium text-white mb-1">
                        Your Name <span className="text-[#00FF66]">*</span>
                      </label>
                      <input
                        id="rev-name"
                        type="text"
                        placeholder="e.g., Bola Ahmed"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <div>
                      <label htmlFor="rev-device" className="block text-xs font-medium text-white mb-1">
                        Device / Service Repaired
                      </label>
                      <input
                        id="rev-device"
                        type="text"
                        placeholder="e.g., HP Laptop Boot Repair, RAM Upgrade"
                        value={formDevice}
                        onChange={(e) => setFormDevice(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white mb-1">
                        Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= formRating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-[#444444]"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono-tech text-[#A0A0A0] ml-2">
                          {formRating} / 5
                        </span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rev-text" className="block text-xs font-medium text-white mb-1">
                        Your Feedback <span className="text-[#00FF66]">*</span>
                      </label>
                      <textarea
                        id="rev-text"
                        rows={3}
                        placeholder="Tell other Lagos computer owners about your experience with OMJ Repairs..."
                        value={formReview}
                        onChange={(e) => setFormReview(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#121212] border border-[#222222] rounded-lg text-white focus:outline-none focus:border-[#00FF66]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#00FF66] hover:bg-[#00C853] rounded-lg transition-colors cursor-pointer shadow-[0_0_15px_rgba(0,255,102,0.25)]"
                    >
                      Submit Review
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
