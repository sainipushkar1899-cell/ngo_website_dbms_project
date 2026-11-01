/* ─────────────────────────────────────────────────────────────────────────────
   Mock Donations — matches MySQL `donations` table schema
   Fields: donation_id, donor_id, project_id, donation_date, amount
   ───────────────────────────────────────────────────────────────────────────── */

export interface Donation {
  donation_id: number;
  donor_id: number;      // FK → donors.donor_id
  project_id: number;    // FK → projects.project_id
  donation_date: string; // ISO 8601 date string "YYYY-MM-DD"
  amount: number;        // INR
}

export const donations: Donation[] = [
  {
    donation_id: 1,
    donor_id: 3,
    project_id: 6,
    donation_date: "2024-07-04",
    amount: 500_000,
  },
  {
    donation_id: 2,
    donor_id: 5,
    project_id: 6,
    donation_date: "2024-07-06",
    amount: 250_000,
  },
  {
    donation_id: 3,
    donor_id: 8,
    project_id: 3,
    donation_date: "2024-08-12",
    amount: 750_000,
  },
  {
    donation_id: 4,
    donor_id: 1,
    project_id: 1,
    donation_date: "2024-09-01",
    amount: 50_000,
  },
  {
    donation_id: 5,
    donor_id: 2,
    project_id: 2,
    donation_date: "2024-09-15",
    amount: 300_000,
  },
  {
    donation_id: 6,
    donor_id: 10,
    project_id: 2,
    donation_date: "2024-09-20",
    amount: 200_000,
  },
  {
    donation_id: 7,
    donor_id: 4,
    project_id: 2,
    donation_date: "2024-09-28",
    amount: 120_000,
  },
  {
    donation_id: 8,
    donor_id: 6,
    project_id: 4,
    donation_date: "2024-10-05",
    amount: 80_000,
  },
  {
    donation_id: 9,
    donor_id: 7,
    project_id: 5,
    donation_date: "2024-10-18",
    amount: 150_000,
  },
  {
    donation_id: 10,
    donor_id: 9,
    project_id: 7,
    donation_date: "2024-10-22",
    amount: 40_000,
  },
  {
    donation_id: 11,
    donor_id: 1,
    project_id: 3,
    donation_date: "2024-11-03",
    amount: 100_000,
  },
  {
    donation_id: 12,
    donor_id: 5,
    project_id: 1,
    donation_date: "2024-11-11",
    amount: 250_000,
  },
  {
    donation_id: 13,
    donor_id: 2,
    project_id: 8,
    donation_date: "2024-12-01",
    amount: 180_000,
  },
  {
    donation_id: 14,
    donor_id: 3,
    project_id: 7,
    donation_date: "2025-01-08",
    amount: 75_000,
  },
  {
    donation_id: 15,
    donor_id: 10,
    project_id: 5,
    donation_date: "2025-01-20",
    amount: 200_000,
  },
];

export default donations;
