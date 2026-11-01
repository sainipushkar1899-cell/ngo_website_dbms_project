/* ─────────────────────────────────────────────────────────────────────────────
   Payment Configuration — Aadhara Foundation
   Update these values before going live.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Path to the QR code image in the /public directory.
 * Place your QR image at: website/public/payment-qr.png
 * Then set this to "/payment-qr.png"
 *
 * The QR step renders this image and gracefully falls back to a
 * placeholder box if the file does not exist.
 */
export const QR_IMAGE_PATH = "/payment-qr.png";

/**
 * UPI ID to display below the QR code (for manual entry).
 * Set to "" to hide it from the checkout panel.
 * Example: "donate@aadharafoundation"
 */
export const UPI_ID_DISPLAY = "";

/**
 * Payee name shown below the QR (matches the UPI account display name).
 * Set to "" to hide it from the checkout panel.
 * Example: "Aadhara Foundation"
 */
export const PAYEE_NAME = "";

/**
 * Expiry window for a payment intent in milliseconds.
 * Default: 10 minutes.
 */
export const INTENT_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Minimum donation amount in INR.
 */
export const MIN_DONATION_INR = 10;

/**
 * Quick-pick amounts shown on the Amount step.
 * Values in INR.
 */
export const QUICK_PICK_AMOUNTS = [100, 500, 1000, 2500, 5000, 10000] as const;

/**
 * Impact equivalents — maps an INR amount to a human-readable description.
 * Used on the Amount step to show donors what their contribution does.
 * Ordered ascending; the highest threshold ≤ amount is shown.
 *
 * To customise copy or add new tiers, edit this array only.
 * Components read from here — nothing is hardcoded in UI files.
 */
export interface ImpactEquivalent {
  /** Minimum amount (inclusive) for this tier to show, in INR. */
  threshold: number;
  /** Short action phrase, e.g. "provides" */
  verb: string;
  /** Human-readable description of what the amount funds. */
  description: string;
  /** Optional emoji / icon key for visual reinforcement. */
  emoji: string;
}

export const IMPACT_EQUIVALENTS: ImpactEquivalent[] = [
  {
    threshold: 10,
    verb: "buys",
    description: "a set of school stationery for one child",
    emoji: "✏️",
  },
  {
    threshold: 50,
    verb: "provides",
    description: "a nutritious mid-day meal for five children",
    emoji: "🍱",
  },
  {
    threshold: 100,
    verb: "funds",
    description: "one month of textbooks for a rural student",
    emoji: "📚",
  },
  {
    threshold: 250,
    verb: "covers",
    description: "a doctor's visit for three families in a mobile health camp",
    emoji: "🩺",
  },
  {
    threshold: 500,
    verb: "plants",
    description: "20 native saplings in a degraded forest zone",
    emoji: "🌱",
  },
  {
    threshold: 1000,
    verb: "provides",
    description: "clean drinking water for a family for an entire year",
    emoji: "💧",
  },
  {
    threshold: 2500,
    verb: "funds",
    description: "vocational skills training for one woman artisan",
    emoji: "🧵",
  },
  {
    threshold: 5000,
    verb: "equips",
    description: "a government classroom with digital learning tools",
    emoji: "💻",
  },
  {
    threshold: 10000,
    verb: "sponsors",
    description: "an entire year of education for two children",
    emoji: "🎓",
  },
  {
    threshold: 25000,
    verb: "helps rebuild",
    description: "a disaster-affected home with cyclone-resistant materials",
    emoji: "🏠",
  },
  {
    threshold: 50000,
    verb: "funds",
    description: "a solar-powered borewell serving 200 villagers",
    emoji: "⚡",
  },
];

/**
 * Given an amount, returns the best-matching impact statement.
 * Returns null if amount is below the lowest threshold.
 */
export function getImpactStatement(amount: number): ImpactEquivalent | null {
  const sorted = [...IMPACT_EQUIVALENTS].sort((a, b) => b.threshold - a.threshold);
  return sorted.find((e) => amount >= e.threshold) ?? null;
}
