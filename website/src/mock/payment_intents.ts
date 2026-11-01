/* ─────────────────────────────────────────────────────────────────────────────
   Mock Payment Intent Store
   Simulates a server-side payment session for the donation flow.
   Token → Intent map with createIntent() and getIntent() helpers.
   ───────────────────────────────────────────────────────────────────────────── */

export type IntentStatus =
  | "pending"      // created, awaiting donor confirmation
  | "processing"   // donor confirmed, payment gateway called
  | "succeeded"    // payment captured successfully
  | "failed"       // gateway returned failure
  | "cancelled";   // donor abandoned / manually cancelled

export interface PaymentIntent {
  token: string;          // opaque unique token (UUID-like)
  donor_id: number | null; // null if guest donor (account created on success)
  project_id: number;
  project_name: string;
  amount: number;          // INR, paise-accurate (no decimals for INR)
  status: IntentStatus;
  created_at: string;      // ISO 8601 datetime string
  updated_at?: string;     // ISO 8601 datetime string, set on status change
  metadata?: Record<string, string>; // optional key-value bag (e.g. utm_source)
}

/* ─── Token Generator ─────────────────────────────────────────────────────────
   Generates a pseudo-random opaque token suitable for mock/dev use.
   In production, use crypto.randomUUID() or a server-issued token.
   ───────────────────────────────────────────────────────────────────────────── */
function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("")
    )
    .join("-");
}

/* ─── In-Memory Store ─────────────────────────────────────────────────────────
   A Map is used as the backing store. In a real app this would be
   Redis, a DB table, or a server session.
   ───────────────────────────────────────────────────────────────────────────── */
export const intentStore = new Map<string, PaymentIntent>();

/* ─── Seed: Pre-populate a few intents for demo/testing purposes ─────────────── */
const _seedIntents: PaymentIntent[] = [
  {
    token: "pi-seed-0001-demo-aadharafoundation",
    donor_id: 1,
    project_id: 6,
    project_name: "Punarjeevan — Cyclone Biparjoy Relief & Rebuild",
    amount: 5000,
    status: "succeeded",
    created_at: "2024-07-04T09:15:00.000Z",
    updated_at: "2024-07-04T09:16:42.000Z",
  },
  {
    token: "pi-seed-0002-demo-aadharafoundation",
    donor_id: 2,
    project_id: 1,
    project_name: "Shiksha Kiran — Rural Digital Classrooms",
    amount: 2500,
    status: "succeeded",
    created_at: "2024-09-15T11:30:00.000Z",
    updated_at: "2024-09-15T11:31:18.000Z",
  },
  {
    token: "pi-seed-0003-demo-aadharafoundation",
    donor_id: null,
    project_id: 3,
    project_name: "Jal Jeevan — Borewell & Piped Water Grid",
    amount: 1000,
    status: "pending",
    created_at: "2025-01-20T14:00:00.000Z",
  },
];

_seedIntents.forEach((intent) => intentStore.set(intent.token, intent));

/* ─── createIntent() ──────────────────────────────────────────────────────────
   Creates a new payment intent, stores it, and returns it.
   Throws if required fields are missing or amount is invalid.
   ───────────────────────────────────────────────────────────────────────────── */
export function createIntent(params: {
  donor_id: number | null;
  project_id: number;
  project_name: string;
  amount: number;
  metadata?: Record<string, string>;
}): PaymentIntent {
  if (!params.project_id) throw new Error("createIntent: project_id is required");
  if (!params.project_name) throw new Error("createIntent: project_name is required");
  if (!params.amount || params.amount <= 0)
    throw new Error("createIntent: amount must be a positive number");

  const intent: PaymentIntent = {
    token: generateToken(),
    donor_id: params.donor_id ?? null,
    project_id: params.project_id,
    project_name: params.project_name,
    amount: Math.round(params.amount), // ensure integer INR
    status: "pending",
    created_at: new Date().toISOString(),
    ...(params.metadata ? { metadata: params.metadata } : {}),
  };

  intentStore.set(intent.token, intent);
  return intent;
}

/* ─── getIntent() ─────────────────────────────────────────────────────────────
   Retrieves an intent by token. Returns undefined if not found.
   ───────────────────────────────────────────────────────────────────────────── */
export function getIntent(token: string): PaymentIntent | undefined {
  return intentStore.get(token);
}

/* ─── updateIntentStatus() ────────────────────────────────────────────────────
   Updates the status of an existing intent.
   Returns the updated intent, or throws if token not found.
   ───────────────────────────────────────────────────────────────────────────── */
export function updateIntentStatus(
  token: string,
  status: IntentStatus
): PaymentIntent {
  const intent = intentStore.get(token);
  if (!intent) throw new Error(`updateIntentStatus: token "${token}" not found`);

  const updated: PaymentIntent = {
    ...intent,
    status,
    updated_at: new Date().toISOString(),
  };
  intentStore.set(token, updated);
  return updated;
}

/* ─── listIntents() ───────────────────────────────────────────────────────────
   Returns all intents as an array. Useful for admin/debug views.
   ───────────────────────────────────────────────────────────────────────────── */
export function listIntents(): PaymentIntent[] {
  return Array.from(intentStore.values());
}
