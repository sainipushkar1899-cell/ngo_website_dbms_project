/* ─────────────────────────────────────────────────────────────────────────────
   Causes API — wraps mock causes data with simulated network delay.
   ───────────────────────────────────────────────────────────────────────────── */

import { causes } from "../mock/causes";
import type { Cause } from "./types";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Returns all causes (programme pillars).
 */
export async function getCauses(): Promise<Cause[]> {
  try {
    await delay(100);
    return [...causes];
  } catch (err) {
    throw new Error(
      `getCauses failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Returns a single cause by id, or null if not found.
 */
export async function getCause(id: number): Promise<Cause | null> {
  try {
    await delay(100);
    return causes.find((c) => c.id === id) ?? null;
  } catch (err) {
    throw new Error(
      `getCause(${id}) failed: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}
