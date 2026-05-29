import type { Metadata } from "next";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Target, Heart, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Repurposely — the AI-powered tool that turns one YouTube video into a week of content for 7 platforms.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto flex-1">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Built by a creator,
            <br />
            <span className="gradient-text">for creators.</span>
          </h1>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            We got tired of spending more time repurposing content than actually creating it.
          </p>
        </div>

        {/* Story */}
        <div className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-8 mb-12">
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="space-y-5 text-[15px] text-foreground/70 leading-relaxed">
            <p>
              Every creator knows the feeling. You spend hours making a great YouTube video — researching, scripting, recording, editing. You hit publish. And then you realize... you still need to post on Twitter. And LinkedIn. And TikTok. And send a newsletter. And write a blog post.
            </p>
            <p>
              So you open ChatGPT and start prompting. <span className="text-white font-medium">&ldquo;Turn this into tweets.&rdquo;</span> Copy. Paste. <span className="text-white font-medium">&ldquo;Now make it a LinkedIn post.&rdquo;</span> Copy. Paste. Forty-five minutes later, you&apos;ve got mediocre content on six platforms that all sounds the same.
            </p>
            <p>
              We built Repurposely to kill that workflow. <span className="text-primary font-medium">One URL. Thirty seconds. Content that actually sounds native to each platform</span> — because it&apos;s written for each platform, not just reformatted.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What We Believe</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Target,
                title: "Creators should create",
                desc: "Your time should be spent on ideas, not reformatting the same idea six different ways. Let AI handle the tedious part.",
              },
              {
                icon: Sparkles,
                title: "Platform-native or nothing",
                desc: "A good tweet looks nothing like a good LinkedIn post. Cross-posting identical content is lazy and algorithms punish it.",
              },
              {
                icon: Heart,
                title: "Simple beats complex",
                desc: "No learning curve. No 47-step onboarding. Paste a URL, click a button, copy your content. That's it.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-6 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] group"
              >
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-10 mb-12">
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <h2 className="text-xl font-bold text-center mb-8">By the Numbers</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { number: "6", label: "Platforms per generation" },
              { number: "30s", label: "Average generation time" },
              { number: "10+", label: "Content pieces per video" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold gradient-text mb-1">{stat.number}</div>
                <p className="text-sm text-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-[#111113] border border-[#1e1e24] rounded-2xl px-10 py-8">
            <p className="text-white font-semibold text-lg mb-2">Ready to save 5 hours a week?</p>
            <p className="text-foreground/50 text-sm mb-6">No credit card required.</p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              Start Repurposing Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
