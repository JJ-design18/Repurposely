import Link from "next/link";
import { Zap } from "lucide-react";

export default function PublicNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">Repurposely</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-muted hover:text-foreground transition-colors text-sm">About</Link>
          <Link href="/faq" className="text-muted hover:text-foreground transition-colors text-sm">FAQ</Link>
          <Link href="/#pricing" className="text-muted hover:text-foreground transition-colors text-sm">Pricing</Link>
          <Link href="/contact" className="text-muted hover:text-foreground transition-colors text-sm">Contact</Link>
          <Link href="/auth/login" className="text-muted hover:text-foreground transition-colors text-sm">Log in</Link>
          <Link href="/auth/signup" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
