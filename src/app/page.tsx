import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import {
  Zap,
  ArrowRight,
  MessageCircle,
  Film,
  Camera,
  Briefcase,
  Mail,
  FileText,
  Quote,
  Check,
  Play,
} from "lucide-react";

const platforms = [
  { icon: MessageCircle, name: "Twitter/X", desc: "5 posts + thread" },
  { icon: Film, name: "TikTok", desc: "3 scripts with hooks" },
  { icon: Camera, name: "Instagram Reels", desc: "2 reels + captions" },
  { icon: Briefcase, name: "LinkedIn", desc: "Engagement post" },
  { icon: Mail, name: "Newsletter", desc: "Email segment" },
  { icon: FileText, name: "Blog", desc: "SEO outline + intro" },
  { icon: Quote, name: "Quotes", desc: "5 shareable quotes" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    generations: "3 videos/month",
    features: ["3 generations/month", "All 7 platforms", "Casual tone only", "Basic support"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    generations: "25 videos/month",
    features: [
      "25 generations/month",
      "All 7 platforms",
      "5 custom tones",
      "Generation history",
      "Priority support",
    ],
    cta: "Start Creating",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/month",
    generations: "100 videos/month",
    features: [
      "100 generations/month",
      "All 7 platforms",
      "5 custom tones",
      "Generation history",
      "Production Kit (voiceover + storyboard)",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$79",
    period: "/month",
    generations: "500 videos/month",
    features: [
      "500 generations/month",
      "Everything in Pro",
      "Dedicated support",
    ],
    cta: "Scale Up",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 mb-8 text-sm text-muted">
            <Play className="w-3.5 h-3.5 text-primary" />
            Built for creators who move fast
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            One video.
            <br />
            <span className="gradient-text">A week of content.</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste your YouTube link and get platform-perfect content for
            Twitter, TikTok, LinkedIn, newsletters, and blogs — in 30 seconds.
            Stop wasting hours repurposing manually.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors pulse-glow"
            >
              Start Repurposing Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-card hover:bg-card-hover border border-border text-foreground px-8 py-4 rounded-xl text-lg font-medium transition-colors"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-muted mt-4">
            No credit card required. 3 free generations.
          </p>
        </div>
      </section>

      {/* Demo mockup */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-muted text-sm">
                https://youtube.com/watch?v=your-video-here
              </div>
              <div className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-semibold">
                Repurpose
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((p) => (
                <div
                  key={p.name}
                  className="bg-background border border-border rounded-lg p-4 flex items-start gap-3"
                >
                  <p.icon className="w-5 h-5 text-primary-light shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-muted">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Three steps. <span className="gradient-text">30 seconds.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Paste your link",
                desc: "Drop any YouTube URL. We extract the transcript automatically — no uploads needed.",
              },
              {
                step: "2",
                title: "AI does the work",
                desc: "Our AI analyzes your content and generates platform-native posts for 6 different channels.",
              },
              {
                step: "3",
                title: "Copy and post",
                desc: "One-click copy for each platform. Edit if you want. Post and watch your reach explode.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-danger uppercase tracking-wider mb-4">
                Without Repurposely
              </h3>
              <ul className="space-y-3">
                {[
                  "3-5 hours manually repurposing each video",
                  "Content sounds the same on every platform",
                  "Miss posting windows while editing",
                  "Burn out from the content grind",
                  "Your best ideas only reach one audience",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted">
                    <span className="text-danger mt-1">x</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-success uppercase tracking-wider mb-4">
                With Repurposely
              </h3>
              <ul className="space-y-3">
                {[
                  "30 seconds to repurpose any video",
                  "Content feels native to each platform",
                  "Post immediately while momentum is hot",
                  "Focus on creating, not reformatting",
                  "Every idea reaches every audience",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-success shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-muted text-center mb-16 text-lg">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col ${
                  plan.highlighted
                    ? "bg-primary/10 border-2 border-primary glow"
                    : "bg-card border border-border"
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-muted mb-6">{plan.generations}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`w-full py-3 rounded-lg text-center font-semibold text-sm transition-colors ${
                    plan.highlighted
                      ? "bg-primary hover:bg-primary-hover text-white"
                      : "bg-card-hover hover:bg-border text-foreground"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stop letting great content die on one platform
          </h2>
          <p className="text-muted text-lg mb-10 leading-relaxed">
            Every video you make has 10+ pieces of content hiding inside it.
            Repurposely pulls them out in seconds.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors pulse-glow"
          >
            Start Repurposing Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
