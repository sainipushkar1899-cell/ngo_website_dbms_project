/* ─────────────────────────────────────────────────────────────────────────────
   Aadhara Foundation — NGO Identity & Configuration
   ───────────────────────────────────────────────────────────────────────────── */

export const NGO = {
  name: "Aadhara Foundation",
  tagline: "Dignity in Every Action. Impact That Endures.",
  founding_year: 2008,

  mission:
    "To restore dignity and expand opportunity for India's most marginalised communities by delivering sustainable, community-led programmes across education, healthcare, clean water, livelihood, environmental stewardship, and disaster relief — guided always by the principle that lasting change must be built from within.",

  vision:
    "A future where every child can learn without hunger, every family can access clean water and primary healthcare, and every community has the resilience to rebuild after any crisis — not because they were rescued, but because they were empowered.",

  values: [
    {
      title: "Dignity First",
      description:
        "Every person we serve is treated with unconditional respect. Aid is a right, not a favour.",
      icon: "Heart",
    },
    {
      title: "Community Ownership",
      description:
        "Sustainable change is designed by communities themselves — we build capacity, not dependency.",
      icon: "Users",
    },
    {
      title: "Radical Transparency",
      description:
        "We publish every rupee received and spent. Our donors and beneficiaries deserve full accountability.",
      icon: "Eye",
    },
    {
      title: "Intersectional Lens",
      description:
        "Gender, caste, disability, and geography shape vulnerability — our solutions account for all of it.",
      icon: "Layers",
    },
    {
      title: "Evidence-Driven",
      description:
        "We measure impact rigorously, publish our failures, and iterate until outcomes are real.",
      icon: "BarChart2",
    },
    {
      title: "Long-term Commitment",
      description:
        "We do not leave when the cameras do. We stay until communities no longer need us.",
      icon: "Anchor",
    },
  ],

  contact: {
    address: "12-B, Bhavani Singh Road, Jaipur, Rajasthan 302 001, India",
    email: "hello@aadharafoundation.org",
    donations_email: "donate@aadharafoundation.org",
    phone: "+91 141 410 5000",
    whatsapp: "+91 98290 50001",
    map_url:
      "https://maps.google.com/?q=12-B+Bhavani+Singh+Road+Jaipur+Rajasthan",
  },

  social: {
    twitter: "https://twitter.com/AadharaFdn",
    instagram: "https://instagram.com/aadhara_foundation",
    facebook: "https://facebook.com/AadharaFoundation",
    linkedin: "https://linkedin.com/company/aadhara-foundation",
    youtube: "https://youtube.com/@AadharaFoundation",
  },

  registration: {
    ngo_darpan: "RJ/2008/0145821",
    fcra: "335410167",
    section_80g: "DIT(E)/2009/RA/JAIPUR/258",
    pan: "AAATА1234Q",
  },

  countries: [
    {
      code: "IN",
      name: "India",
      flag: "🇮🇳",
      programmes: [
        "Education",
        "Healthcare",
        "Clean Water",
        "Livelihood",
        "Environment",
        "Disaster Relief",
      ],
      offices: ["Jaipur (HQ)", "Mumbai", "Delhi", "Chennai", "Bhubaneswar"],
    },
    {
      code: "NP",
      name: "Nepal",
      flag: "🇳🇵",
      programmes: ["Education", "Disaster Relief", "Clean Water"],
      offices: ["Kathmandu"],
    },
    {
      code: "KE",
      name: "Kenya",
      flag: "🇰🇪",
      programmes: ["Clean Water", "Livelihood"],
      offices: ["Nairobi"],
    },
    {
      code: "BD",
      name: "Bangladesh",
      flag: "🇧🇩",
      programmes: ["Education", "Disaster Relief", "Healthcare"],
      offices: ["Dhaka"],
    },
    {
      code: "PH",
      name: "Philippines",
      flag: "🇵🇭",
      programmes: ["Disaster Relief", "Livelihood"],
      offices: ["Cebu"],
    },
  ],

  stats_snapshot: {
    year: 2025,
    total_raised_inr: 48_70_00_000,   // ₹48.7 Cr
    total_beneficiaries: 284_000,
    total_projects_completed: 127,
    active_projects: 23,
    staff_count: 312,
    volunteer_count: 4800,
    corporate_partners: 34,
  },
} as const;

export type NGOType = typeof NGO;
