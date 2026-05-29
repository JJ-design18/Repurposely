"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">Repurposely</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted hover:text-foreground transition-colors text-sm">
              {l.label}
            </Link>
          ))}
          <Link href="/auth/login" className="text-muted hover:text-foreground transition-colors text-sm">Log in</Link>
          <Link href="/auth/signup" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Get Started Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-1" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-muted hover:text-foreground transition-colors text-sm py-1">
              {l.label}
            </Link>
          ))}
          <Link href="/auth/login" onClick={() => setOpen(false)} className="block text-muted hover:text-foreground transition-colors text-sm py-1">Log in</Link>
          <Link href="/auth/signup" onClick={() => setOpen(false)} className="block text-center bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2">
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
