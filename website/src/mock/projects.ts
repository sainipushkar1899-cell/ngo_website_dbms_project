/* ─────────────────────────────────────────────────────────────────────────────
   Mock Projects — matches MySQL `projects` table schema
   Fields: project_id, project_name, category, budget, raised,
           percent_funded (derived), location, description, image_slot
   ───────────────────────────────────────────────────────────────────────────── */

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

export const projects: Project[] = [
  {
    project_id: 1,
    project_name: "Shiksha Kiran — Rural Digital Classrooms",
    category: "Education",
    budget: 4_500_000,
    raised: 3_825_000,
    percent_funded: 85,
    location: "Barmer & Jaisalmer, Rajasthan",
    description:
      "Equipping 48 government primary schools in the Thar desert with solar-powered digital classrooms, trained teachers, and a regional learning management system. Targeting 6,200 children in Classes 1–8 with STEM-focused curriculum in Hindi and local dialect.",
    image_slot: "project-1",
  },
  {
    project_id: 2,
    project_name: "Aarogya Setu — Mobile Health Clinics",
    category: "Healthcare",
    budget: 7_200_000,
    raised: 6_120_000,
    percent_funded: 85,
    location: "Sundarbans Delta, West Bengal",
    description:
      "Operating six solar-charged mobile health vans staffed by MBBS doctors and ASHA workers to serve 42 island communities cut off from district hospitals. Priority services: maternal health, immunisation, TB screening, and chronic disease management.",
    image_slot: "project-2",
  },
  {
    project_id: 3,
    project_name: "Jal Jeevan — Borewell & Piped Water Grid",
    category: "Clean Water",
    budget: 9_800_000,
    raised: 9_016_000,
    percent_funded: 92,
    location: "Bundelkhand, Madhya Pradesh",
    description:
      "Installing 18 deep borewells with solar pumps and a gravity-fed piped distribution network across 12 drought-prone villages, providing clean potable water to 11,400 residents. Includes household-level water quality testing kits and a trained village water committee.",
    image_slot: "project-3",
  },
  {
    project_id: 4,
    project_name: "Hastkala — Artisan Cooperative Revival",
    category: "Livelihood",
    budget: 3_200_000,
    raised: 2_176_000,
    percent_funded: 68,
    location: "Kutch, Gujarat",
    description:
      "Reviving traditional Kutchi embroidery, bandhani, and block-printing cooperatives for 320 women artisans. Includes market linkages to urban boutiques and e-commerce platforms, a working-capital microloan fund, and certified skills training in quality control and pricing.",
    image_slot: "project-4",
  },
  {
    project_id: 5,
    project_name: "Vanam — Community Forest Restoration",
    category: "Environment",
    budget: 5_600_000,
    raised: 3_080_000,
    percent_funded: 55,
    location: "Eastern Ghats, Odisha",
    description:
      "Restoring 1,200 hectares of degraded scrub forest in the Eastern Ghats through community-based plantation of 380,000 native saplings. Engages 28 tribal villages as forest custodians, providing livelihood income through bamboo harvesting rights and eco-tourism micro-enterprises.",
    image_slot: "project-5",
  },
  {
    project_id: 6,
    project_name: "Punarjeevan — Cyclone Biparjoy Relief & Rebuild",
    category: "Disaster Relief",
    budget: 12_000_000,
    raised: 11_400_000,
    percent_funded: 95,
    location: "Kutch & Devbhumi Dwarka, Gujarat",
    description:
      "Emergency relief and structured reconstruction for 8,200 households devastated by Cyclone Biparjoy. Phase 1: food kits, tarpaulins, and medical camps. Phase 2: construction of 430 cyclone-resistant homes with engineers and verified material procurement. Phase 3: livelihood restoration grants.",
    image_slot: "project-6",
  },
  {
    project_id: 7,
    project_name: "Aahar Amrit — Mid-Day Meal Fortification",
    category: "Education",
    budget: 2_800_000,
    raised: 1_932_000,
    percent_funded: 69,
    location: "Palghar, Maharashtra",
    description:
      "Transforming government mid-day meal kitchens in 64 tribal schools to serve hot, nutritionally fortified meals. Tackles severe anaemia and stunting among 9,100 Adivasi children while training 190 school cooks in food hygiene and nutrition science.",
    image_slot: "project-7",
  },
  {
    project_id: 8,
    project_name: "Nirmala Ganga — River Health Campaign",
    category: "Environment",
    budget: 6_400_000,
    raised: 2_560_000,
    percent_funded: 40,
    location: "Varanasi & Kanpur Corridor, Uttar Pradesh",
    description:
      "Mobilising 180 riverside communities to monitor industrial discharge, conduct monthly river clean-ups, and advocate for tannery effluent compliance. Partners with IIT Kanpur for real-time water quality sensors at 22 ghats, with data published openly for policy pressure.",
    image_slot: "project-8",
  },
];

export default projects;
