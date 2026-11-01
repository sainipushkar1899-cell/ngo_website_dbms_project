/* ─────────────────────────────────────────────────────────────────────────────
   Mock Impact Data — aggregate stats, country breakdown, fund allocation
   ───────────────────────────────────────────────────────────────────────────── */

export interface ImpactStats {
  total_raised: number;          // INR
  total_projects: number;
  total_beneficiaries: number;
  countries_count: number;
  years_active: number;
}

export interface CountryImpact {
  country: string;
  beneficiary_count: number;
  flag_emoji: string;
  description: string;
}

export interface MoneyUsed {
  category: string;
  percent: number;
  description: string;
}

export const impactStats: ImpactStats = {
  total_raised: 487_000_000,   // ₹48.7 Cr
  total_projects: 127,
  total_beneficiaries: 284_000,
  countries_count: 5,
  years_active: 17,             // founded 2008, active through 2025
};

export const beneficiaries_by_country: CountryImpact[] = [
  {
    country: "India",
    beneficiary_count: 218_000,
    flag_emoji: "🇮🇳",
    description:
      "The heart of our operations — spanning 14 states with deep-rooted programmes in education, healthcare, clean water, and livelihood across rural and tribal India.",
  },
  {
    country: "Nepal",
    beneficiary_count: 28_500,
    flag_emoji: "🇳🇵",
    description:
      "Post-earthquake recovery and school reconstruction projects across Sindhupalchok, Dolakha, and Gorkha districts, now evolving into long-term clean water and girls' education programmes.",
  },
  {
    country: "Bangladesh",
    beneficiary_count: 19_200,
    flag_emoji: "🇧🇩",
    description:
      "Cyclone and flood-resilience programmes in the Char regions of Mymensingh, alongside maternal healthcare clinics and primary school quality-improvement grants.",
  },
  {
    country: "Kenya",
    beneficiary_count: 11_300,
    flag_emoji: "🇰🇪",
    description:
      "Solar-powered borewell and rainwater harvesting projects in the arid counties of Marsabit and Turkana, providing the first reliable clean water source for 22 pastoralist communities.",
  },
  {
    country: "Philippines",
    beneficiary_count: 7_000,
    flag_emoji: "🇵🇭",
    description:
      "Post-typhoon livelihood recovery in Eastern Visayas — boat-building micro-enterprises, fishery cooperatives, and storm-resistant housing grants for coastal families in Samar and Leyte.",
  },
];

export const how_money_used: MoneyUsed[] = [
  {
    category: "Direct Programme Delivery",
    percent: 72,
    description:
      "Salaries of field staff, materials, construction, medical supplies, and technology directly serving beneficiaries — the largest and most protected slice of every rupee donated.",
  },
  {
    category: "Community Capacity Building",
    percent: 10,
    description:
      "Training local leaders, village water committees, school management groups, and women's self-help groups to own and sustain programmes after we exit.",
  },
  {
    category: "Monitoring, Evaluation & Research",
    percent: 7,
    description:
      "Independent impact assessments, field surveys, data management systems, and academic partnerships to ensure every programme produces verified, lasting outcomes.",
  },
  {
    category: "Fundraising & Donor Relations",
    percent: 6,
    description:
      "Communications, campaign costs, donor stewardship, FCRA compliance, and the infrastructure that makes it possible to raise the funds for everything above.",
  },
  {
    category: "Administration & Governance",
    percent: 5,
    description:
      "Office operations, audits, legal compliance, board governance, and the organisational backbone that keeps Aadhara credible and accountable.",
  },
];

export default {
  impactStats,
  beneficiaries_by_country,
  how_money_used,
};
