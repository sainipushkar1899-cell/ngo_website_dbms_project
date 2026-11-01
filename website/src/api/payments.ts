/* ─────────────────────────────────────────────────────────────────────────────
   Payments API — src/api/payments.ts
   Handles donation project listings, payment intent creation, QR checkout,
   confirmation, cancellation, and receipt retrieval.
   
   Backed by in-browser localStorage simulation in src/mock/donation.ts so state
   survives page refreshes. Ready to swap for real MySQL endpoints via API_BASE_URL.
   ───────────────────────────────────────────────────────────────────────────── */

import {
  getStoredProjects,
  createMockPaymentIntent,
  getMockPaymentIntent,
  confirmMockPayment,
  cancelMockPaymentIntent,
  getMockReceipt,
} from "../mock/donation";
import type {
  ProjectForDonation,
  PaymentIntent,
  DonationReceipt,
  CreatePaymentIntentRequest,
} from "./types";

/** Artificial delay in milliseconds so loading states and skeletons are visible */
const ARTIFICIAL_DELAY_MS = 250;
const delay = (ms: number = ARTIFICIAL_DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Retrieves the list of projects available for donation.
 * Each project contains budget, raised, remaining, and percent_funded.
 * 
 * Future MySQL route: GET ${API_BASE_URL}/projects/donation
 */
export async function getProjectsForDonation(): Promise<ProjectForDonation[]> {
  await delay(150);
  // Future backend swap:
  // if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
  //   return api<ProjectForDonation[]>('/projects/donation');
  // }
  return getStoredProjects();
}

/**
 * Creates a new payment intent before proceeding to QR checkout.
 * Enforces:
 * - valid amount (min threshold)
 * - amount not exceeding remaining project budget
 * - project not fully funded
 * 
 * Future MySQL route: POST ${API_BASE_URL}/donations/intent
 */
export async function createPaymentIntent(
  payload: CreatePaymentIntentRequest
): Promise<PaymentIntent> {
  await delay();
  // Future backend swap:
  // if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
  //   return api<PaymentIntent>('/donations/intent', { method: 'POST', body: JSON.stringify(payload) });
  // }
  return createMockPaymentIntent(payload);
}

/**
 * Retrieves a payment intent by token.
 * Returns null if the token does not exist.
 * Automatically marks intent as expired if the expiry window has passed.
 * 
 * Future MySQL route: GET ${API_BASE_URL}/donations/intent/:token
 */
export async function getPaymentIntent(
  token: string
): Promise<PaymentIntent | null> {
  await delay(100);
  return getMockPaymentIntent(token);
}

/**
 * Confirms payment once donor scans QR and clicks "I have paid".
 * Idempotent: returns existing paid intent & receipt if already confirmed.
 * Rejects if:
 * - session expired
 * - project became fully funded / over budget in parallel
 * 
 * Future MySQL route: POST ${API_BASE_URL}/donations/confirm
 */
export async function confirmPayment(
  token: string,
  utr?: string
): Promise<{ success: boolean; intent: PaymentIntent; receipt: DonationReceipt }> {
  await delay(600); // realistic payment verification delay
  // Future backend swap:
  // if (import.meta.env.VITE_USE_REAL_BACKEND === 'true') {
  //   return api<{ success: boolean; intent: PaymentIntent; receipt: DonationReceipt }>(
  //     '/donations/confirm',
  //     { method: 'POST', body: JSON.stringify({ token, utr }) }
  //   );
  // }
  return confirmMockPayment(token, utr);
}

/**
 * Cancels a pending payment intent.
 * 
 * Future MySQL route: POST ${API_BASE_URL}/donations/cancel
 */
export async function cancelPaymentIntent(
  token: string
): Promise<PaymentIntent> {
  await delay(150);
  return cancelMockPaymentIntent(token);
}

/**
 * Retrieves an official donation receipt for a completed donation.
 * 
 * Future MySQL route: GET ${API_BASE_URL}/donations/receipt/:token
 */
export async function getReceipt(
  token: string
): Promise<DonationReceipt | null> {
  await delay(100);
  return getMockReceipt(token);
}
