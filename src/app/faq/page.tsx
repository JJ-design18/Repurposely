import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { ArrowRight, Zap } from "lucide-react";

const faqs = [
  {
    q: "What is Repurposely?",
    a: "Paste a YouTube URL, get ready-to-post content for Twitter, TikTok, LinkedIn, newsletters, blogs, and quotes. One click, 30 seconds, 10+ pieces of content.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "Speed and quality. We extract the transcript, analyze the full video, and write platform-native content for 6 platforms in one click. No prompting, no copy-pasting, no formatting.",
  },
  {
    q: "Does it work with any YouTube video?",
    a: "Any public video with captions enabled. That includes auto-generated captions, which most videos have.",
  },
  {
    q: "What's the Production Kit?",
    a: "A downloadable voiceover MP3 plus a scene-by-scene storyboard that tells you exactly how to make a YouTube Short in CapCut in 5 minutes.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. 3 generations per month, all 6 platforms, no credit card required.",
  },
  {
    q: "What counts as one generation?",
    a: "One YouTube URL = one generation. Each generation gives you content for all 6 platforms — that's 10+ pieces of content.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts. Cancel from your Settings page and keep access until the end of your billing period.",
  },
  {
    q: "Do you store my videos?",
    a: "No. We only process the transcript text. We never download or store the actual video.",
  },
];

export default function FAQPage() {
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
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-foreground/60 text-lg">
            Everything you need to know.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-6 hover:border-primary/40 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.08)] group"
            >
              {/* Purple accent line */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[15px] text-white mb-2">{faq.q}</h3>
                  <p className="text-[14px] text-foreground/70 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[#111113] border border-[#1e1e24] rounded-2xl px-10 py-8">
            <p className="text-white font-semibold text-lg mb-2">Still have a question?</p>
            <p className="text-foreground/50 text-sm mb-6">We usually respond within 24 hours.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/contact"
                className="bg-[#1e1e24] hover:bg-[#2a2a32] border border-[#2a2a32] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Contact Us
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                Try It Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
