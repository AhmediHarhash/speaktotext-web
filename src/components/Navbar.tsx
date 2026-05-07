'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/lib/content';
import { Wordmark } from './ui/Logo';
import { ButtonLink } from './ui/Button';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      setMenuOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-4 z-50 flex justify-center px-4 transition-all duration-300',
        scrolled && 'top-3'
      )}
    >
      <nav
        className={cn(
          'relative flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/20 px-3 py-2.5 pl-5 shadow-[0_18px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-all duration-300',
          scrolled && 'bg-black/35'
        )}
      >
        <a href="#top" className="flex items-center">
          <Wordmark
            markClassName="h-9 w-9 md:h-[38px] md:w-[38px]"
            textClassName="text-[18px] md:text-[20px]"
          />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-[15px] text-silver-200 transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ButtonLink
          href="/download"
          size="md"
          variant="primary"
          icon={<ArrowUpRight className="h-4 w-4" />}
          analyticsEvent="download_click"
          analyticsLabel="nav_download"
          className="hidden text-sm md:inline-flex"
        >
          Download
        </ButtonLink>

        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-silver-100 backdrop-blur-xl transition hover:bg-white/[0.08] md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-nav-menu"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-[28px] border border-white/10 bg-[#05070D]/95 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.72)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-4 py-3.5 text-[15px] font-medium text-silver-100 transition hover:bg-white/[0.05]"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/download"
                  onClick={() => {
                    trackEvent('download_click', {
                      label: 'mobile_nav_download',
                      href: '/download'
                    });
                    setMenuOpen(false);
                  }}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gold-sheen px-4 py-3 text-[15px] font-semibold text-ink-950 shadow-[0_10px_28px_rgba(212,165,72,0.24)] transition hover:brightness-110"
                >
                  Download
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
