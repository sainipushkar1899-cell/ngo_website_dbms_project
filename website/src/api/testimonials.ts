/* ─────────────────────────────────────────────────────────────────────────────
   Testimonials API — wraps mock testimonial data with simulated network delay.
   ───────────────────────────────────────────────────────────────────────────── */

import { testimonials } from "../mock/testimonials";
import type { Testimonial } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Returns all testimonials.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    await delay(100);
    return [...testimonials];
  } catch (err) {
    throw new Error(
      `getTestimonials failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
