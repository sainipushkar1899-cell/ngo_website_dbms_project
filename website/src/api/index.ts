/* ─────────────────────────────────────────────────────────────────────────────
   API Index — re-exports all types and functions from every API module.
   Import from here for a clean single-entry-point: import { getProjects } from '@/api'
   ───────────────────────────────────────────────────────────────────────────── */

export type {
  Donor,
  Project,
  ProjectCategory,
  Donation,
  Beneficiary,
  PaymentIntent,
  PaymentIntentStatus,
  ProjectForDonation,
  DonationReceipt,
  ImpactStats,
  BeneficiaryByCountry,
  HowMoneyUsed,
  Testimonial,
  Cause,
  ApiResponse,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest,
} from "./types";

export { API_BASE_URL, api } from "./config";

export { getProjects, getProject, getProjectsByCategory } from "./projects";

export {
  getImpactStats,
  getBeneficiariesByCountry,
  getHowMoneyUsed,
} from "./impact";

export {
  getDonations,
  getDonationsByProject,
  getDonationsByDonor,
} from "./donations";

export { getTestimonials } from "./testimonials";

export { getCauses, getCause } from "./causes";

export {
  getProjectsForDonation,
  createPaymentIntent,
  getPaymentIntent,
  confirmPayment,
  cancelPaymentIntent,
  getReceipt,
} from "./payments";
