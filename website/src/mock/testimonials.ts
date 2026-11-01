/* ─────────────────────────────────────────────────────────────────────────────
   Mock Testimonials — beneficiary and partner voices
   Fields: id, name, role, location, quote, avatar_slot
   ───────────────────────────────────────────────────────────────────────────── */

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  avatar_slot: string;  // placeholder key for avatar image mapping
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Geeta Devi",
    role: "Beneficiary — Clean Water Programme",
    location: "Chhatarpur, Madhya Pradesh",
    quote:
      "Before Aadhara, I walked four kilometres every morning to fetch water from a muddy pond. My daughters missed school because they had to help. Now we have a tap in our courtyard. My daughters have not missed a single day of school this year.",
    avatar_slot: "avatar-1",
  },
  {
    id: 2,
    name: "Ruksana Khatun",
    role: "Artisan & Cooperative Leader — Hastkala Project",
    location: "Bhuj, Gujarat",
    quote:
      "I had been doing this embroidery my whole life, but I was earning ₹80 a day. After joining the cooperative, learning to price my work correctly, and getting access to city buyers, I earned ₹32,000 last month. I bought a sewing machine in my own name.",
    avatar_slot: "avatar-3",
  },
  {
    id: 3,
    name: "Headmaster Prakash Rawat",
    role: "Government School Principal",
    location: "Barmer, Rajasthan",
    quote:
      "I have taught in desert schools for 22 years. I have never seen children so engaged. The solar-powered projectors, the interactive content, the teacher training — it is a transformation, not a donation. Our Class 8 pass rate went from 61% to 89% in one year.",
    avatar_slot: "avatar-2",
  },
  {
    id: 4,
    name: "Arjun Mehta",
    role: "Corporate Donor — Infosys CSR",
    location: "Bengaluru, Karnataka",
    quote:
      "We have given to many NGOs. Aadhara is different — they send us quarterly impact dashboards with GPS-tagged photos, community surveys, and budget-vs-actual breakdowns. I trust them with our CSR money because they treat accountability as a core value, not a formality.",
    avatar_slot: "avatar-2",
  },
  {
    id: 5,
    name: "Dr. Kavitha Nair",
    role: "Medical Volunteer — Aarogya Setu Clinic",
    location: "Sundarbans, West Bengal",
    quote:
      "I spend two weekends a month on the mobile clinic boat. The communities we reach have no other access to a doctor. I have delivered babies, diagnosed diabetes that would have gone undetected for years, and vaccinated children who had never seen a syringe. This is medicine at its most essential.",
    avatar_slot: "avatar-1",
  },
  {
    id: 6,
    name: "Dhirubhai Damor",
    role: "Disaster Relief Recipient",
    location: "Dwarka, Gujarat",
    quote:
      "The cyclone took everything — my walls, my roof, my fishing nets. Aadhara came with food on the second day. By the third month, they had helped us rebuild 14 houses on our street with proper foundations. I do not know if we would have managed without them.",
    avatar_slot: "avatar-2",
  },
];

export default testimonials;
