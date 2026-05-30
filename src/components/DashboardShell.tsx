"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { Zap, LayoutDashboard, History, Settings, LogOut, Sparkles, BookOpen, Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", label: "New Generation", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/guide", label: "Production Guide", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const PLAN_LABELS: Record<string, string> = {
  free: "Free Plan",
  starter: "Starter Plan",
  pro: "Pro Plan",
  agency: "Agency Plan",
};

let supabaseInstance: ReturnType<typeof createSupabaseBrowser> | null = null;
function getSupabase() {
  if (!supabaseInstance) supabaseInstance = createSupabaseBrowser();
  return supabaseInstance;
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/auth/login");
      } else {
        setUser(session.user);
        setLoading(false);
        // Fetch actual plan
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.plan) setPlan(data.plan);
          });
      }
    }).catch(() => {
      router.push("/auth/login");
    });
  }, [router]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.push("/");
  }

  const isPaid = plan !== "free";

  const sidebarContent = (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold">Repurposely</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(124,58,237,0.15)]"
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade prompt — only for free users */}
      {!isPaid && (
        <div className="px-3 mb-3">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted mb-3">Premium AI, Production Kit, and 100 generations/month.</p>
            <Link
              href="/dashboard/settings"
              className="block w-full text-center py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user?.email || "Loading..."}</p>
            <p className="text-[10px] text-muted">{PLAN_LABELS[plan] || "Free Plan"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-muted hover:text-foreground transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-bold">Repurposely</span>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 z-50 w-64 h-full bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-card/50 border-r border-border flex-col shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background md:pt-0 pt-14">
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-screen">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <Zap className="absolute inset-0 m-auto w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
