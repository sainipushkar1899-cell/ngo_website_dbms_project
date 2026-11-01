/* ─────────────────────────────────────────────────────────────────────────────
   Donations API — wraps mock donation data with simulated network delay.
   ───────────────────────────────────────────────────────────────────────────── */

import { donations } from "../mock/donations";
import type { Donation } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Returns all donations.
 */
export async function getDonations(): Promise<Donation[]> {
  try {
    await delay(100);
    return [...donations];
  } catch (err) {
    throw new Error(
      `getDonations failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Returns all donations for a given project_id.
 */
export async function getDonationsByProject(
  project_id: number
): Promise<Donation[]> {
  try {
    await delay(100);
    return donations.filter((d) => d.project_id === project_id);
  } catch (err) {
    throw new Error(
      `getDonationsByProject(${project_id}) failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Returns all donations made by a given donor_id.
 */
export async function getDonationsByDonor(
  donor_id: number
): Promise<Donation[]> {
  try {
    await delay(100);
    return donations.filter((d) => d.donor_id === donor_id);
  } catch (err) {
    throw new Error(
      `getDonationsByDonor(${donor_id}) failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
