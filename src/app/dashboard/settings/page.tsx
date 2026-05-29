"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import {
  Settings,
  User,
  CreditCard,
  BarChart3,
  Shield,
  Check,
  Zap,
} from "lucide-react";
import type { UserProfile } from "@/types";
import { PLAN_LIMITS } from "@/types";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    limit: 3,
    features: ["3 generations/month", "All 7 platforms", "Basic support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "/month",
    limit: 25,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
    features: ["25 generations/month", "All 7 platforms", "Generation history", "Priority support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$39",
    period: "/month",
    limit: 100,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    features: ["100 generations/month", "All 7 platforms", "Custom tone/voice", "Production Kit", "Generation history", "API access"],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$79",
    period: "/month",
    limit: 500,
    priceId: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID || "",
    features: ["500 generations/month", "Everything in Pro", "Team access (5 seats)", "Bulk generation", "Dedicated support"],
  },
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createSupabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) setProfile(data as UserProfile);
    setLoading(false);
  }

  async function handlePasswordReset() {
    const supabase = createSupabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) return;

    await supabase.auth.resetPasswordForEmail(session.user.email);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleUpgrade(priceId: string, planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading("");
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const usagePercent = profile
    ? Math.min((profile.generations_used / (PLAN_LIMITS[profile.plan] || 3)) * 100, 100)
    : 0;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted text-sm">Manage your account and subscription.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-1">Email</label>
              <p className="text-sm font-medium">{profile?.email}</p>
            </div>
            <div>
              <label className="block text-xs text-muted uppercase tracking-wider mb-1">Member since</label>
              <p className="text-sm font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              className="text-sm text-primary hover:underline"
            >
              {saved ? "Password reset email sent!" : "Reset password"}
            </button>
          </div>
        </div>

        {/* Usage */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Usage This Month</h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Generations used</span>
              <span className="font-medium">
                {profile?.generations_used || 0} / {PLAN_LIMITS[profile?.plan || "free"]}
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent > 80 ? "bg-danger" : usagePercent > 50 ? "bg-yellow-500" : "bg-primary"
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent > 80 && (
              <p className="text-xs text-danger mt-2">
                You&apos;re running low on generations. Consider upgrading your plan.
              </p>
            )}
          </div>
        </div>

        {/* Current Plan & Upgrade */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Subscription</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => {
              const isCurrent = profile?.plan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`rounded-xl p-4 border transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(124,58,237,0.1)]"
                      : plan.popular
                      ? "border-primary/30 bg-card"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.popular && !isCurrent && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Most Popular</span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" /> Current Plan
                    </span>
                  )}
                  <div className="mt-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-xs text-muted">{plan.period}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1">{plan.name}</p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-muted flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-success shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && plan.id !== "free" && (
                    <button
                      onClick={() => handleUpgrade(plan.priceId || "", plan.id)}
                      disabled={checkoutLoading === plan.id}
                      className="w-full mt-4 py-2 rounded-lg text-xs font-semibold transition-all bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                    >
                      {checkoutLoading === plan.id ? "Loading..." : "Upgrade"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Security</h2>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              SSL encrypted connection
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Data stored securely on Supabase
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Your content is never used for AI training
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card border border-danger/20 rounded-2xl p-6">
          <h2 className="font-semibold text-danger mb-3">Danger Zone</h2>
          <p className="text-sm text-muted">
            To delete your account and all associated data, email{" "}
            <a href="mailto:support@repurposely.co" className="text-primary hover:underline">support@repurposely.co</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
