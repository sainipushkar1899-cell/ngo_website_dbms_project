/* ─────────────────────────────────────────────────────────────────────────────
   Mock Donation Data & LocalStorage Store — src/mock/donation.ts
   Inline project, intent, and receipt data simulating MySQL database state.
   All data survives page refreshes via localStorage.
   ───────────────────────────────────────────────────────────────────────────── */

import { INTENT_EXPIRY_MS, MIN_DONATION_INR } from "../config/payment";

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_PROJECTS_KEY = "aadhara_mock_projects";
const STORAGE_INTENTS_KEY = "aadhara_mock_intents";
const STORAGE_RECEIPTS_KEY = "aadhara_mock_receipts";

// ─── Types (field names match MySQL schema exactly) ───────────────────────────

export interface DonationProject {
  project_id: number;
  project_name: string;
  category: string;
  budget: number;        // INR
  raised: number;        // INR
  remaining: number;     // budget - raised
  percent_funded: number;
}

export interface DonationIntent {
  token: string;
  donor_name: string;
  email: string;
  phone: string;
  project_id: number;
  project_name: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "expired";
  created_at: string;
  expires_at: string;
  utr?: string;
}

export interface DonationReceipt {
  receipt_no: string;
  donation_id: string;
  donation_date: string; // "YYYY-MM-DD"
  donor_name: string;
  project_name: string;
  amount: number;
}

// ─── Initial Seed Project data ────────────────────────────────────────────────

export const DONATION_PROJECTS: DonationProject[] = [
  {
    project_id: 1,
    project_name: "Shiksha Kiran — Rural Digital Classrooms",
    category: "Education",
    budget: 4_500_000,
    raised: 3_825_000,
    remaining: 675_000,
    percent_funded: 85,
  },
  {
    project_id: 2,
    project_name: "Aarogya Setu — Mobile Health Clinics",
    category: "Healthcare",
    budget: 7_200_000,
    raised: 6_120_000,
    remaining: 1_080_000,
    percent_funded: 85,
  },
  {
    project_id: 3,
    project_name: "Jal Jeevan — Borewell & Piped Water Grid",
    category: "Clean Water",
    budget: 9_800_000,
    raised: 9_016_000,
    remaining: 784_000,
    percent_funded: 92,
  },
  {
    project_id: 4,
    project_name: "Hastkala — Artisan Cooperative Revival",
    category: "Livelihood",
    budget: 3_200_000,
    raised: 2_176_000,
    remaining: 1_024_000,
    percent_funded: 68,
  },
  {
    project_id: 5,
    project_name: "Vanam — Community Forest Restoration",
    category: "Environment",
    budget: 5_600_000,
    raised: 3_080_000,
    remaining: 2_520_000,
    percent_funded: 55,
  },
  {
    project_id: 6,
    project_name: "Punarjeevan — Cyclone Biparjoy Relief",
    category: "Disaster Relief",
    budget: 12_000_000,
    raised: 12_000_000,
    remaining: 0,
    percent_funded: 100,
  },
  {
    project_id: 7,
    project_name: "Aahar Amrit — Mid-Day Meal Fortification",
    category: "Education",
    budget: 2_800_000,
    raised: 1_932_000,
    remaining: 868_000,
    percent_funded: 69,
  },
  {
    project_id: 8,
    project_name: "Nirmala Ganga — River Health Campaign",
    category: "Environment",
    budget: 6_400_000,
    raised: 2_560_000,
    remaining: 3_840_000,
    percent_funded: 40,
  },
];

// ─── Category icon + colour map ───────────────────────────────────────────────

export const CATEGORY_META: Record<
  string,
  { emoji: string; color: string; bg: string }
> = {
  Education:       { emoji: "📚", color: "#2d5a27", bg: "#f0f7ee" },
  Healthcare:      { emoji: "🩺", color: "#b5453f", bg: "#fdf1f0" },
  "Clean Water":   { emoji: "💧", color: "#1a6fb5", bg: "#eef5fc" },
  Livelihood:      { emoji: "🧵", color: "#8B6914", bg: "#fdf7e8" },
  Environment:     { emoji: "🌱", color: "#4a8c3f", bg: "#edf7ec" },
  "Disaster Relief": { emoji: "🏠", color: "#7d4e24", bg: "#fdf3ec" },
};

// ─── Token + receipt number generators ───────────────────────────────────────

export function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segs = [8, 4, 4, 4, 12];
  return segs
    .map((n) =>
      Array.from({ length: n }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("")
    )
    .join("-");
}

export function generateReceiptNo(): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const r = Math.floor(Math.random() * 999999).toString().padStart(6, "0");
  return `RCT-${d}-${r}`;
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/** Format INR: ₹1,23,456 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Short token display: first 8 chars uppercase */
export function shortToken(token: string): string {
  return token.slice(0, 8).toUpperCase();
}

// ─── LocalStorage Helpers ─────────────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Non-fatal if storage quota is full
  }
}

// ─── Store Accessors ──────────────────────────────────────────────────────────

export function getStoredProjects(): DonationProject[] {
  const stored = readJSON<DonationProject[] | null>(STORAGE_PROJECTS_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }
  // Initialize default
  writeJSON(STORAGE_PROJECTS_KEY, DONATION_PROJECTS);
  return DONATION_PROJECTS;
}

export function saveStoredProjects(projects: DonationProject[]): void {
  writeJSON(STORAGE_PROJECTS_KEY, projects);
}

export function getStoredIntents(): Record<string, DonationIntent> {
  return readJSON<Record<string, DonationIntent>>(STORAGE_INTENTS_KEY, {});
}

export function saveStoredIntent(intent: DonationIntent): void {
  const intents = getStoredIntents();
  intents[intent.token] = intent;
  writeJSON(STORAGE_INTENTS_KEY, intents);
}

export function getStoredReceipts(): Record<string, DonationReceipt> {
  return readJSON<Record<string, DonationReceipt>>(STORAGE_RECEIPTS_KEY, {});
}

export function saveStoredReceipt(token: string, receipt: DonationReceipt): void {
  const receipts = getStoredReceipts();
  receipts[token] = receipt;
  writeJSON(STORAGE_RECEIPTS_KEY, receipts);
}

// ─── Store Operations with Realistic Validations ──────────────────────────────

export function createMockPaymentIntent(payload: {
  donor_name: string;
  email: string;
  phone: string;
  project_id: number;
  amount: number;
}): DonationIntent {
  const { donor_name, email, phone, project_id, amount } = payload;
  const projects = getStoredProjects();
  const project = projects.find((p) => p.project_id === project_id);

  if (!project) {
    throw new Error(`Project with ID ${project_id} not found.`);
  }

  if (project.remaining <= 0) {
    throw new Error(`"${project.project_name}" is already fully funded.`);
  }

  if (amount < MIN_DONATION_INR) {
    throw new Error(`Minimum donation amount is ${formatINR(MIN_DONATION_INR)}.`);
  }

  if (amount > project.remaining) {
    throw new Error(
      `Amount exceeds remaining budget. Only ${formatINR(project.remaining)} is needed to fully fund this project.`
    );
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + INTENT_EXPIRY_MS);

  const intent: DonationIntent = {
    token: generateToken(),
    donor_name: donor_name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    project_id,
    project_name: project.project_name,
    amount,
    status: "pending",
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };

  saveStoredIntent(intent);
  return intent;
}

export function getMockPaymentIntent(token: string): DonationIntent | null {
  const intents = getStoredIntents();
  const intent = intents[token];
  if (!intent) return null;

  // Auto-expire check
  if (intent.status === "pending") {
    const isExpired = new Date().getTime() > new Date(intent.expires_at).getTime();
    if (isExpired) {
      intent.status = "expired";
      saveStoredIntent(intent);
    }
  }

  return intent;
}

export function confirmMockPayment(
  token: string,
  utr?: string
): { success: boolean; intent: DonationIntent; receipt: DonationReceipt } {
  const intents = getStoredIntents();
  const intent = intents[token];

  if (!intent) {
    throw new Error(`Payment session not found for token "${token}".`);
  }

  // Idempotency: if already paid, return existing state and receipt
  if (intent.status === "paid") {
    const receipts = getStoredReceipts();
    const existingReceipt = receipts[token] || {
      receipt_no: generateReceiptNo(),
      donation_id: token,
      donation_date: new Date().toISOString().slice(0, 10),
      donor_name: intent.donor_name,
      project_name: intent.project_name,
      amount: intent.amount,
    };
    return { success: true, intent, receipt: existingReceipt };
  }

  // Check if session expired
  const isExpired = new Date().getTime() > new Date(intent.expires_at).getTime();
  if (intent.status === "expired" || isExpired) {
    intent.status = "expired";
    saveStoredIntent(intent);
    throw new Error(
      "This payment session has expired. Please initiate a new donation from the donation page."
    );
  }

  if (intent.status === "failed") {
    throw new Error("This payment session has been cancelled or has failed.");
  }

  // Check project budget constraints (concurrency simulation)
  const projects = getStoredProjects();
  const projectIndex = projects.findIndex((p) => p.project_id === intent.project_id);
  if (projectIndex === -1) {
    throw new Error("Associated project was not found.");
  }

  const project = projects[projectIndex];
  if (project.remaining < intent.amount) {
    throw new Error(
      `Project became fully funded or amount exceeds remaining budget. Only ${formatINR(project.remaining)} remains.`
    );
  }

  // Update project
  project.raised += intent.amount;
  project.remaining = Math.max(0, project.budget - project.raised);
  project.percent_funded = Math.min(100, Math.round((project.raised / project.budget) * 100));
  projects[projectIndex] = project;
  saveStoredProjects(projects);

  // Update intent
  intent.status = "paid";
  if (utr?.trim()) {
    intent.utr = utr.trim();
  }
  saveStoredIntent(intent);

  // Generate and store receipt
  const receipt: DonationReceipt = {
    receipt_no: generateReceiptNo(),
    donation_id: String(Math.floor(100000 + Math.random() * 900000)),
    donation_date: new Date().toISOString().slice(0, 10),
    donor_name: intent.donor_name,
    project_name: intent.project_name,
    amount: intent.amount,
  };

  saveStoredReceipt(token, receipt);

  return { success: true, intent, receipt };
}

export function cancelMockPaymentIntent(token: string): DonationIntent {
  const intents = getStoredIntents();
  const intent = intents[token];
  if (!intent) {
    throw new Error(`Payment session not found for token "${token}".`);
  }

  if (intent.status === "pending") {
    intent.status = "failed";
    saveStoredIntent(intent);
  }
  return intent;
}

export function getMockReceipt(token: string): DonationReceipt | null {
  const receipts = getStoredReceipts();
  return receipts[token] || null;
}
