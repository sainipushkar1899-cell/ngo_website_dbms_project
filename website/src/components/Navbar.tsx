import { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NGO } from '../config/ngo';

interface NavItem {
  label: string;
  to: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Causes', to: '/causes' },
  { label: 'Projects', to: '/projects' },
  { label: 'Impact', to: '/impact' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Escape key closes menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll listener for backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const nameParts = NGO.name.split(' ');
  const logoLine1 = nameParts[0];
  const logoLine2 = nameParts.slice(1).join(' ');

  return (
    <>
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <header
        className={[
          'fixed top-0 left-0 right-0 z-[var(--z-modal)] transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md shadow-[0_1px_0_var(--border-color)]'
            : '',
        ].join(' ')}
        role="banner"
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-[1440px] mx-auto">

          {/* Logo */}
          <Link
            to="/"
            aria-label={`${NGO.name} — home`}
            className="group flex flex-col leading-none select-none"
            onClick={closeMenu}
          >
            <span
              className="font-display font-bold text-[var(--fg)] tracking-tight"
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.25rem)' }}
            >
              {logoLine1}
            </span>
            <span
              className="font-display font-normal text-[var(--primary-cta)] tracking-widest uppercase"
              style={{ fontSize: 'clamp(0.6rem, 0.7vw, 0.75rem)', letterSpacing: '0.18em' }}
            >
              {logoLine2}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  [
                    'text-sm font-medium tracking-wide transition-colors duration-200',
                    'relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:bg-[var(--primary-cta)] after:transition-[width] after:duration-300',
                    isActive
                      ? 'text-[var(--primary-cta)] after:w-full'
                      : 'text-[var(--fg)] hover:text-[var(--primary-cta)] after:w-0 hover:after:w-full',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-4">
            <Link
              to="/donate"
              className="primary-button primary-button-sm hidden md:inline-flex"
            >
              Donate Now
            </Link>

            {/* Hamburger button */}
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="md:hidden relative w-8 h-6 flex flex-col justify-between focus-visible:outline-[var(--primary-cta)]"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={[
                  'block w-full h-[2px] bg-[var(--fg)] origin-center transition-transform duration-300',
                  menuOpen ? 'translate-y-[11px] rotate-45' : '',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-full h-[2px] bg-[var(--fg)] transition-opacity duration-200',
                  menuOpen ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />
              <span
                className={[
                  'block w-full h-[2px] bg-[var(--fg)] origin-center transition-transform duration-300',
                  menuOpen ? '-translate-y-[11px] -rotate-45' : '',
                ].join(' ')}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Fullscreen curtain (mobile) ──────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="fixed inset-0 z-[calc(var(--z-modal)-1)] md:hidden pointer-events-none"
      >
        {/* Curtain panel */}
        <div
          className="absolute inset-0 bg-[var(--fg)] flex flex-col justify-center px-8 transition-[clip-path] duration-700"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.9,0,0.1,1)',
            clipPath: menuOpen
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            pointerEvents: menuOpen ? 'auto' : 'none',
          }}
        >
          {/* Nav links */}
          <nav aria-label="Mobile navigation links">
            <ul className="list-none flex flex-col gap-2" role="list">
              {NAV_ITEMS.map(({ label, to }, i) => (
                <li
                  key={to}
                  className="overflow-hidden"
                  aria-hidden={!menuOpen}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={closeMenu}
                    tabIndex={menuOpen ? 0 : -1}
                    className={({ isActive }) =>
                      [
                        'block font-display font-bold text-[var(--bg)] leading-none py-1',
                        'transition-colors duration-200 focus-visible:outline-[var(--bg)]',
                        isActive ? 'text-[color-mix(in_srgb,var(--bg)_70%,var(--primary-cta))]' : '',
                      ].join(' ')
                    }
                    style={{
                      fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                      transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
                      transition: `transform 0.5s cubic-bezier(0.7,0,0.3,1) ${0.3 + i * 0.05}s`,
                    }}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Donate CTA inside curtain */}
          <div className="mt-8 overflow-hidden">
            <Link
              to="/donate"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className="primary-button"
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(100%)',
                transition: `transform 0.5s cubic-bezier(0.7,0,0.3,1) ${0.3 + NAV_ITEMS.length * 0.05}s`,
                display: 'inline-flex',
              }}
            >
              Donate Now
            </Link>
          </div>

          {/* Tagline at bottom */}
          <p
            className="absolute bottom-10 left-8 right-8 text-[color-mix(in_srgb,var(--bg)_40%,transparent)] text-sm font-body"
            style={{
              opacity: menuOpen ? 1 : 0,
              transition: `opacity 0.4s ease ${0.5 + NAV_ITEMS.length * 0.05}s`,
            }}
          >
            {NGO.tagline}
          </p>
        </div>
      </div>
    </>
  );
}

export default Navbar;
