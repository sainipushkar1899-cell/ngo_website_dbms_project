/* ─────────────────────────────────────────────────────────────────────────────
   Donation Flow Types — src/pages/donate/types.ts
   ───────────────────────────────────────────────────────────────────────────── */

import type { ProjectForDonation } from "../../api";

export type FlowStep = 1 | 2 | 3 | 4;

export interface DonationState {
  step: FlowStep;
  selectedProject: ProjectForDonation | null;
  amount: number | null;
  donor_name: string;
  email: string;
  phone: string;
}

export type DonationAction =
  | { type: "SET_STEP"; step: FlowStep }
  | { type: "SELECT_PROJECT"; project: ProjectForDonation }
  | { type: "SET_AMOUNT"; amount: number }
  | {
      type: "SET_DETAILS";
      details: { donor_name: string; email: string; phone: string };
    }
  | { type: "RESET" };
