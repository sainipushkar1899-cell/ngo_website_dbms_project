/* ─────────────────────────────────────────────────────────────────────────────
   Local Image Registry & Metadata
   Maps keys to local optimized WebP photographs in /images/
   with explicit dimensions and dignified alt text to avoid layout shift (CLS).
   ───────────────────────────────────────────────────────────────────────────── */

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const IMAGES: Record<string, ImageAsset> = {
  // Hero & General
  'hero': {
    src: '/images/hero.webp',
    alt: 'Smiling primary school students in Rajasthan engaged in digital learning with laptops and tablets',
    width: 1200,
    height: 800,
  },
  'about-hero': {
    src: '/images/about-hero.webp',
    alt: 'Aadhara Foundation field workers and village coordinators strategising together in an open workshop',
    width: 1200,
    height: 800,
  },
  'about-community': {
    src: '/images/about-community.webp',
    alt: 'Local self-help group leaders leading a village development assembly',
    width: 800,
    height: 600,
  },

  // Team
  'team-priya': {
    src: '/images/team-priya.webp',
    alt: 'Priya Sharma, Executive Director at Aadhara Foundation',
    width: 400,
    height: 400,
  },
  'team-rajan': {
    src: '/images/team-rajan.webp',
    alt: 'Rajan Verma, Chief Programme Officer',
    width: 400,
    height: 400,
  },
  'team-anika': {
    src: '/images/team-anika.webp',
    alt: 'Anika Patel, Head of Finance & Legal Compliance',
    width: 400,
    height: 400,
  },
  'team-deepak': {
    src: '/images/team-deepak.webp',
    alt: 'Deepak Nair, Director of Partnerships & CSR',
    width: 400,
    height: 400,
  },

  // Causes
  'cause-education': {
    src: '/images/cause-education.webp',
    alt: 'Young students reading textbooks together in a bright, modern classroom',
    width: 800,
    height: 600,
  },
  'cause-healthcare': {
    src: '/images/cause-healthcare.webp',
    alt: 'Community healthcare physician performing a diagnostic check-up with warmth and attentiveness',
    width: 800,
    height: 600,
  },
  'cause-water': {
    src: '/images/cause-water.webp',
    alt: 'Clear, potable water flowing reliably from a newly commissioned solar tap network',
    width: 800,
    height: 600,
  },
  'cause-livelihood': {
    src: '/images/cause-livelihood.webp',
    alt: 'Skilled rural artisan cooperative creating handloom textiles and handicrafts',
    width: 800,
    height: 600,
  },
  'cause-environment': {
    src: '/images/cause-environment.webp',
    alt: 'Local youth planting native indigenous tree saplings in fertile soil',
    width: 800,
    height: 600,
  },
  'cause-disaster': {
    src: '/images/cause-disaster.webp',
    alt: 'Aid response teams providing emergency shelter materials and relief care to affected families',
    width: 800,
    height: 600,
  },

  // Projects (matches project_id 1 to 8)
  'project-1': {
    src: '/images/project-1.webp',
    alt: 'Shiksha Kiran — Rural digital classrooms equipped with smart screens and solar power',
    width: 800,
    height: 600,
  },
  'project-2': {
    src: '/images/project-2.webp',
    alt: 'Aarogya Setu — Mobile healthcare vans bringing physicians and essential medicine to remote deltas',
    width: 800,
    height: 600,
  },
  'project-3': {
    src: '/images/project-3.webp',
    alt: 'Jal Jeevan — Deep borewell solar pump and piped drinking water grid in Bundelkhand',
    width: 800,
    height: 600,
  },
  'project-4': {
    src: '/images/project-4.webp',
    alt: 'Hastkala — Traditional handcraft and artisan cooperative revival in Kutch',
    width: 800,
    height: 600,
  },
  'project-5': {
    src: '/images/project-5.webp',
    alt: 'Vanam — Community-led native forest restoration in the Eastern Ghats of Odisha',
    width: 800,
    height: 600,
  },
  'project-6': {
    src: '/images/project-6.webp',
    alt: 'Punarjeevan — Cyclone-resistant permanent home reconstruction and livelihood grants',
    width: 800,
    height: 600,
  },
  'project-7': {
    src: '/images/project-7.webp',
    alt: 'Aahar Amrit — Fresh, nutritionally fortified mid-day meals served to students',
    width: 800,
    height: 600,
  },
  'project-8': {
    src: '/images/project-8.webp',
    alt: 'Nirmala Ganga — River water monitoring sensors and citizen ecological action',
    width: 800,
    height: 600,
  },

  // Impact countries
  'impact-india': {
    src: '/images/impact-india.webp',
    alt: 'Community-led developmental programmes operating across 14 Indian states',
    width: 800,
    height: 600,
  },
  'impact-nepal': {
    src: '/images/impact-nepal.webp',
    alt: 'Earthquake-resilient school structures and clean mountain water in Nepal',
    width: 800,
    height: 600,
  },
  'impact-bangladesh': {
    src: '/images/impact-bangladesh.webp',
    alt: 'Riverine clinics and primary learning centres in the Char islands of Bangladesh',
    width: 800,
    height: 600,
  },
  'impact-kenya': {
    src: '/images/impact-kenya.webp',
    alt: 'Solar groundwater extraction for pastoralist families in Marsabit, Kenya',
    width: 800,
    height: 600,
  },
  'impact-philippines': {
    src: '/images/impact-philippines.webp',
    alt: 'Artisanal fishery cooperatives and storm-safe houses in Eastern Visayas, Philippines',
    width: 800,
    height: 600,
  },

  // Testimonials / Avatars
  'avatar-1': {
    src: '/images/avatar-1.webp',
    alt: 'Sunita Devi, Community Lead from Barmer, Rajasthan',
    width: 200,
    height: 200,
  },
  'avatar-2': {
    src: '/images/avatar-2.webp',
    alt: 'Arun Mehta, Long-term Monthly Supporter from Mumbai',
    width: 200,
    height: 200,
  },
  'avatar-3': {
    src: '/images/avatar-3.webp',
    alt: 'Meera Sen, Headmistress, Sundarbans, West Bengal',
    width: 200,
    height: 200,
  },

  // How Your Donation Travels (Storytelling steps)
  'step-1': {
    src: '/images/step-1.webp',
    alt: 'Transparent digital intent creation with instant cryptographic transaction token',
    width: 600,
    height: 400,
  },
  'step-2': {
    src: '/images/step-2.webp',
    alt: 'Local community council reviewing priorities and approving resource deployment',
    width: 600,
    height: 400,
  },
  'step-3': {
    src: '/images/step-3.webp',
    alt: 'Direct procurement and field execution with zero middleman dilution',
    width: 600,
    height: 400,
  },
  'step-4': {
    src: '/images/step-4.webp',
    alt: 'Database-logged audit trail, receipt sequence, and public transparency report',
    width: 600,
    height: 400,
  },
};

/**
 * Helper to retrieve image metadata by key or fallback gracefully.
 */
export function getImage(key: string, fallbackAlt: string = 'Aadhara Foundation initiative'): ImageAsset {
  if (IMAGES[key]) {
    return IMAGES[key];
  }
  // Try matching project id numbers, e.g. "project-education-desert" -> "project-1"
  if (key.includes('education') || key.includes('desert')) return IMAGES['project-1'];
  if (key.includes('health') || key.includes('clinic')) return IMAGES['project-2'];
  if (key.includes('water') || key.includes('borewell')) return IMAGES['project-3'];
  if (key.includes('livelihood') || key.includes('artisan')) return IMAGES['project-4'];
  if (key.includes('forest') || key.includes('environment')) return IMAGES['project-5'];
  if (key.includes('cyclone') || key.includes('disaster')) return IMAGES['project-6'];
  if (key.includes('nutrition') || key.includes('meal')) return IMAGES['project-7'];
  if (key.includes('river') || key.includes('ganga')) return IMAGES['project-8'];

  // Default fallback
  return {
    src: '/images/hero.webp',
    alt: fallbackAlt,
    width: 800,
    height: 600,
  };
}
