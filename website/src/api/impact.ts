/* ─────────────────────────────────────────────────────────────────────────────
   Impact API — wraps mock impact data with simulated network delay.
   ───────────────────────────────────────────────────────────────────────────── */

import {
  impactStats,
  beneficiaries_by_country,
  how_money_used,
} from "../mock/impact";
import type { ImpactStats, BeneficiaryByCountry, HowMoneyUsed } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Returns aggregate impact statistics.
 */
export async function getImpactStats(): Promise<ImpactStats> {
  try {
    await delay(100);
    return { ...impactStats };
  } catch (err) {
    throw new Error(
      `getImpactStats failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Returns beneficiary breakdown by country.
 */
export async function getBeneficiariesByCountry(): Promise<
  BeneficiaryByCountry[]
> {
  try {
    await delay(100);
    return [...beneficiaries_by_country];
  } catch (err) {
    throw new Error(
      `getBeneficiariesByCountry failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

/**
 * Returns fund allocation breakdown.
 */
export async function getHowMoneyUsed(): Promise<HowMoneyUsed[]> {
  try {
    await delay(100);
    return [...how_money_used];
  } catch (err) {
    throw new Error(
      `getHowMoneyUsed failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
