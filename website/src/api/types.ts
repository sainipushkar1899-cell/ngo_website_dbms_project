/* ─────────────────────────────────────────────────────────────────────────────
   API Types — mirrors the MySQL schema and mock data structures exactly.
   These are the canonical type definitions for the entire API layer.
   ───────────────────────────────────────────────────────────────────────────── */

// ─── Core DB entity types ────────────────────────────────────────────────────

export interface Donor {
  donor_id: number;
  donor_name: string;
  email: string;
  phone: string;
}

export type ProjectCategory =
  | "Education"
  | "Healthcare"
  | "Clean Water"
  | "Livelihood"
  | "Environment"
  | "Disaster Relief";

export interface Project {
  project_id: number;
  project_name: string;
  category: ProjectCategory;
  budget: number;           // total target in INR
  raised: number;           // amount raised so far in INR
  percent_funded: number;   // derived: Math.round((raised / budget) * 100)
  location: string;
  description: string;
  image_slot: string;       // placeholder key for image mapping
}

export interface Donation {
  donation_id: number;
  donor_id: number;       // FK → donors.donor_id
  project_id: number;     // FK → projects.project_id
  donation_date: string;  // ISO 8601 date string "YYYY-MM-DD"
  amount: number;         // INR
}

export interface Beneficiary {
  beneficiary_id: number;
  beneficiary_name: string;
  location: string;
  project_id: number;     // FK → projects.project_id
}

export type PaymentIntentStatus = "pending" | "paid" | "failed" | "expired";

export interface ProjectForDonation {
  project_id: number;
  project_name: string;
  category: string;
  budget: number;
  raised: number;
  remaining: number;
  percent_funded: number;
}

export interface PaymentIntent {
  token: string;
  donor_name: string;
  email: string;
  phone: string;
  project_id: number;
  project_name: string;
  amount: number;
  status: PaymentIntentStatus;
  created_at: string;
  expires_at: string;
  utr?: string;
  updated_at?: string;
}

export interface DonationReceipt {
  receipt_no: string;
  donation_id: string;
  donation_date: string;
  donor_name: string;
  project_name: string;
  amount: number;
}

// ─── Impact data types ───────────────────────────────────────────────────────

export interface ImpactStats {
  total_raised: number;
  total_projects: number;
  total_beneficiaries: number;
  countries_count: number;
  years_active: number;
}

export interface BeneficiaryByCountry {
  country: string;
  beneficiary_count: number;
  flag_emoji: string;
  description: string;
}

export interface HowMoneyUsed {
  category: string;
  percent: number;
  description: string;
}

// ─── Content types ───────────────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar_slot: string;  // placeholder key for avatar image mapping
}

export interface Cause {
  id: number;
  title: string;
  category: string;
  description: string;
  icon_name: string;        // Lucide icon name (string key)
  project_count: number;
  beneficiary_count: number;
  image_slot: string;       // placeholder key for cause image
  color: string;            // tailwind/hex accent colour for this cause card
}

// ─── Generic API wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ─── Request types ───────────────────────────────────────────────────────────

export interface CreatePaymentIntentRequest {
  donor_name: string;
  email: string;
  phone: string;
  project_id: number;
  amount: number;
}

export interface ConfirmPaymentRequest {
  token: string;
  payment_method: "upi" | "card";
  upi_id?: string;          // required when payment_method === 'upi'
}
