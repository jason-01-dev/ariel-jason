"use client";

import { useState } from "react";

type LinkItem = { id?: string; label: string; href: string };

export default function Navbar({
  logoText,
  links,
}: {
  logoText: string;
  links: LinkItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full border-b border-[var(--border)] bg-[rgba(11,15,20,0.92)]"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-[5%] py-3.5">
        <div className="flex items-center gap-2 text-[1.05rem] font-bold text-[#f8fafc]">
          <i className="fa-solid fa-code text-[var(--accent)]" />
          {logoText}
        </div>

        <ul className="hidden items-center gap-5 list-none md:flex">
          {links.map((l) => (
            <li key={l.id ?? l.href + l.label}>
              <a
                href={l.href}
                className="text-[0.88rem] font-medium text-[var(--text-muted)] no-underline transition-colors hover:text-[#f8fafc]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--text-main)] md:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen((v) => !v)}
        >
          <i className={`fas ${open ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>

      {open && (
        <ul className="flex list-none flex-col gap-3 border-b border-[var(--border)] bg-[var(--bg-elevated)] px-[5%] py-4 md:hidden">
          {links.map((l) => (
            <li key={l.id ?? l.href + l.label}>
              <a
                href={l.href}
                className="block py-1 text-[var(--text-muted)] no-underline hover:text-[#f8fafc]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
