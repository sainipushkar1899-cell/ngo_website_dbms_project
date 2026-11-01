/* ─────────────────────────────────────────────────────────────────────────────
   Mock Beneficiaries — matches MySQL `beneficiaries` table schema
   Fields: beneficiary_id, beneficiary_name, location, project_id
   ───────────────────────────────────────────────────────────────────────────── */

export interface Beneficiary {
  beneficiary_id: number;
  beneficiary_name: string;
  location: string;
  project_id: number;    // FK → projects.project_id
}

export const beneficiaries: Beneficiary[] = [
  {
    beneficiary_id: 1,
    beneficiary_name: "Chavi Kumari",
    location: "Barmer, Rajasthan",
    project_id: 1,
  },
  {
    beneficiary_id: 2,
    beneficiary_name: "Ramesh Bhil",
    location: "Jaisalmer, Rajasthan",
    project_id: 1,
  },
  {
    beneficiary_id: 3,
    beneficiary_name: "Fatima Begum",
    location: "Gosaba Island, West Bengal",
    project_id: 2,
  },
  {
    beneficiary_id: 4,
    beneficiary_name: "Sukumar Mandal",
    location: "Patharpratima, West Bengal",
    project_id: 2,
  },
  {
    beneficiary_id: 5,
    beneficiary_name: "Geeta Devi",
    location: "Chhatarpur, Madhya Pradesh",
    project_id: 3,
  },
  {
    beneficiary_id: 6,
    beneficiary_name: "Mohan Lal Ahirwar",
    location: "Tikamgarh, Madhya Pradesh",
    project_id: 3,
  },
  {
    beneficiary_id: 7,
    beneficiary_name: "Ruksana Khatun",
    location: "Bhuj, Gujarat",
    project_id: 4,
  },
  {
    beneficiary_id: 8,
    beneficiary_name: "Savitaben Rabari",
    location: "Anjar, Kutch, Gujarat",
    project_id: 4,
  },
  {
    beneficiary_id: 9,
    beneficiary_name: "Janu Majhi",
    location: "Koraput, Odisha",
    project_id: 5,
  },
  {
    beneficiary_id: 10,
    beneficiary_name: "Dhirubhai Damor",
    location: "Dwarka, Gujarat",
    project_id: 6,
  },
  {
    beneficiary_id: 11,
    beneficiary_name: "Meena Vasave",
    location: "Jawhar, Palghar, Maharashtra",
    project_id: 7,
  },
  {
    beneficiary_id: 12,
    beneficiary_name: "Sanjay Warli",
    location: "Vikramgad, Palghar, Maharashtra",
    project_id: 7,
  },
];

export default beneficiaries;
