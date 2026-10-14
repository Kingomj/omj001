/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Variants } from "framer-motion";

/**
 * Standard easing curve for precision tech feel
 * Smooth deceleration with subtle overshoot resistance
 */
export const TECH_EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Standard viewport options for scroll reveals
 * once: true prevents annoying re-trigger on reverse scroll
 * margin: "-60px" triggers comfortably before full entrance
 */
export const VIEWPORT_CONFIG = {
  once: true,
  margin: "-60px",
  amount: 0.15,
};

/**
 * Standard fade in and upward translation
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: TECH_EASE,
    },
  },
};

/**
 * Fade in with subtle scale
 */
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/**
 * Parent container that automatically staggers children
 */
export const staggerContainer = (staggerDelay = 0.1, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/**
 * Child item inside a staggered container
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: TECH_EASE,
    },
  },
};

/**
 * Slide from left (ideal for two-column splits)
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -36,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: TECH_EASE,
    },
  },
};

/**
 * Slide from right (ideal for two-column splits)
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 36,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: TECH_EASE,
    },
  },
};

/**
 * Header text stagger animation for Section title + badge + description
 */
export const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: TECH_EASE,
    },
  },
};
