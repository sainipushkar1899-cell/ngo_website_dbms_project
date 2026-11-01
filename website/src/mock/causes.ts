/* ─────────────────────────────────────────────────────────────────────────────
   Mock Causes — six programme pillars for the "Our Causes" section
   Fields: id, title, category, description, icon_name, project_count,
           beneficiary_count, image_slot, color
   ───────────────────────────────────────────────────────────────────────────── */

export interface Cause {
  id: number;
  title: string;
  category: string;
  description: string;
  icon_name: string;       // Lucide icon name (string key)
  project_count: number;
  beneficiary_count: number;
  image_slot: string;      // placeholder key for cause image
  color: string;           // tailwind/hex accent colour for this cause card
}

export const causes: Cause[] = [
  {
    id: 1,
    title: "Education for Every Child",
    category: "Education",
    description:
      "We believe every child deserves a quality education regardless of caste, gender, or geography. Our programmes build and upgrade schools, train teachers, provide digital learning tools, and combat dropout with community mentoring — reaching the last child in the most remote classrooms.",
    icon_name: "BookOpen",
    project_count: 34,
    beneficiary_count: 82_000,
    image_slot: "cause-education",
    color: "#2d5a27",
  },
  {
    id: 2,
    title: "Healthcare Without Barriers",
    category: "Healthcare",
    description:
      "Distance, cost, and stigma should never decide who lives and who dies. Mobile clinics, community health workers, and telemedicine kiosks bring primary care, maternal services, and mental health support to millions who would otherwise go without.",
    icon_name: "HeartPulse",
    project_count: 22,
    beneficiary_count: 61_000,
    image_slot: "cause-healthcare",
    color: "#c0392b",
  },
  {
    id: 3,
    title: "Clean Water & Sanitation",
    category: "Clean Water",
    description:
      "Water is not charity — it is a right. We drill borewells, build piped systems, install biosand filters, and train village committees to maintain infrastructure long after we leave. Clean water means girls stay in school, mothers survive childbirth, and children stop dying of diarrhoea.",
    icon_name: "Droplets",
    project_count: 19,
    beneficiary_count: 55_000,
    image_slot: "cause-water",
    color: "#1a6ea8",
  },
  {
    id: 4,
    title: "Sustainable Livelihoods",
    category: "Livelihood",
    description:
      "Poverty is broken by economic agency, not dependency. We link artisans to markets, train farmers in regenerative agriculture, establish women's self-help groups, and provide microloans with mentorship — because a family with income makes its own choices.",
    icon_name: "Sprout",
    project_count: 28,
    beneficiary_count: 47_500,
    image_slot: "cause-livelihood",
    color: "#8B6914",
  },
  {
    id: 5,
    title: "Environmental Stewardship",
    category: "Environment",
    description:
      "The communities most vulnerable to climate change contribute least to it. We restore forests, protect wetlands, install solar microgrids, and embed climate resilience into every programme — because healthy ecosystems are the ultimate safety net for the world's poorest.",
    icon_name: "TreePine",
    project_count: 15,
    beneficiary_count: 24_000,
    image_slot: "cause-environment",
    color: "#4a8c3f",
  },
  {
    id: 6,
    title: "Disaster Relief & Recovery",
    category: "Disaster Relief",
    description:
      "When cyclones, floods, and earthquakes strike, the poorest lose everything. We respond within 48 hours with relief supplies, medical teams, and psychosocial support — then stay for years to rebuild cyclone-resistant homes, restore livelihoods, and strengthen community resilience.",
    icon_name: "ShieldAlert",
    project_count: 9,
    beneficiary_count: 14_500,
    image_slot: "cause-disaster",
    color: "#7c3aed",
  },
];

export default causes;
