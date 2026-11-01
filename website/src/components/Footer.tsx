import { Link } from 'react-router-dom';
import { NGO } from '../config/ngo';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Causes', to: '/causes' },
  { label: 'Projects', to: '/projects' },
  { label: 'Impact', to: '/impact' },
  { label: 'Donate', to: '/donate' },
  { label: 'Contact', to: '/contact' },
];

const CAUSE_LINKS = [
  { label: 'Education', to: '/causes#education' },
  { label: 'Healthcare', to: '/causes#healthcare' },
  { label: 'Clean Water', to: '/causes#water' },
  { label: 'Livelihood', to: '/causes#livelihood' },
  { label: 'Environment', to: '/causes#environment' },
  { label: 'Disaster Relief', to: '/causes#disaster' },
];

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[
        'inline-flex items-center justify-center w-9 h-9 rounded-full',
        'border border-[var(--border-color)] text-[var(--muted)]',
        'hover:border-[var(--primary-cta)] hover:text-[var(--primary-cta)]',
        'transition-colors duration-200 focus-visible:outline-[var(--primary-cta)]',
      ].join(' ')}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg)]"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Aurora blob decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, var(--aurora-1) 0%, var(--aurora-3) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="section-wrapper relative z-10">

        {/* Brand + tagline */}
        <div className="mb-12 md:mb-16">
          <p className="section-label mb-3">Since {NGO.founding_year}</p>
          <h2
            className="font-display font-bold text-[var(--fg)] leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {NGO.name}
          </h2>
          <p className="mt-3 text-[var(--muted)] text-lg max-w-md">
            {NGO.tagline}
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Column 1: About */}
          <div>
            <h3 className="font-body font-semibold text-sm uppercase tracking-widest text-[var(--fg)] mb-4">
              About
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
              {NGO.mission.slice(0, 160).trimEnd()}…
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap">
              <SocialIcon href={NGO.social.twitter} label="Twitter / X">
                {/* X icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
                </svg>
              </SocialIcon>
              <SocialIcon href={NGO.social.instagram} label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon href={NGO.social.facebook} label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              <SocialIcon href={NGO.social.linkedin} label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
              <SocialIcon href={NGO.social.youtube} label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-body font-semibold text-sm uppercase tracking-widest text-[var(--fg)] mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[var(--muted)] text-sm hover:text-[var(--primary-cta)] transition-colors duration-150 focus-visible:outline-[var(--primary-cta)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Causes */}
          <div>
            <h3 className="font-body font-semibold text-sm uppercase tracking-widest text-[var(--fg)] mb-4">
              Our Causes
            </h3>
            <ul className="space-y-2" role="list">
              {CAUSE_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[var(--muted)] text-sm hover:text-[var(--primary-cta)] transition-colors duration-150 focus-visible:outline-[var(--primary-cta)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-body font-semibold text-sm uppercase tracking-widest text-[var(--fg)] mb-4">
              Contact
            </h3>
            <address className="not-italic space-y-3 text-sm text-[var(--muted)]">
              <p className="leading-relaxed">{NGO.contact.address}</p>
              <p>
                <a
                  href={`mailto:${NGO.contact.email}`}
                  className="hover:text-[var(--primary-cta)] transition-colors duration-150 focus-visible:outline-[var(--primary-cta)]"
                >
                  {NGO.contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${NGO.contact.phone.replace(/\s/g, '')}`}
                  className="hover:text-[var(--primary-cta)] transition-colors duration-150 focus-visible:outline-[var(--primary-cta)]"
                >
                  {NGO.contact.phone}
                </a>
              </p>
              <p className="text-xs pt-1 space-y-1">
                <span className="block">80G: {NGO.registration.section_80g}</span>
                <span className="block">FCRA: {NGO.registration.fcra}</span>
                <span className="block">NGO Darpan: {NGO.registration.ngo_darpan}</span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-color)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <p>
            &copy; {year} {NGO.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            <span className="text-[var(--accent)]">⚠</span>{' '}
            Demo project, not a real organization.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
