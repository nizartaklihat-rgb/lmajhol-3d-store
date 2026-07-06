'use client';

import { motion } from 'framer-motion';

export function Navbar({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold tracking-ultra text-white">
            LM
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Morocco / Essentials</p>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-white">LMAJHOL</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.28em] text-white/60 md:flex">
          <a href="#experience" className="transition hover:text-white">Experience</a>
          <a href="#collection" className="transition hover:text-white">Collection</a>
          <a href="#story" className="transition hover:text-white">Story</a>
          <a href="#order" className="transition hover:text-white">Commander</a>
        </nav>

        <button
          onClick={onOrderClick}
          className="rounded-full border border-white/20 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:scale-[1.02]"
        >
          Commander
        </button>
      </div>
    </motion.header>
  );
}
