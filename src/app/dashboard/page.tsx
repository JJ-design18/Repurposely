"use client";

import { useState, useEffect, useRef } from "react";
import {
  Zap,
  Loader2,
  MessageCircle,
  Film,
  Briefcase,
  Mail,
  FileText,
  Quote,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Camera,
} from "lucide-react";
import ContentCard from "@/components/ContentCard";
import VideoGenerator from "@/components/VideoGenerator";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { GeneratedContent } from "@/types";

const tabs = [
  { id: "twitter", label: "Twitter/X", icon: MessageCircle, count: "5 posts + thread" },
  { id: "tiktok", label: "TikTok", icon: Film, count: "3 scripts" },
  { id: "instagram", label: "Instagram", icon: Camera, count: "2 reels" },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase, count: "1 post" },
  { id: "newsletter", label: "Newsletter", icon: Mail, count: "1 email" },
  { id: "blog", label: "Blog", icon: FileText, count: "outline + intro" },
  { id: "quotes", label: "Quotes", icon: Quote, count: "5 quotes" },
];

const tones = [
  { id: "professional", label: "Professional", desc: "Clean, authoritative, business-friendly" },
  { id: "casual", label: "Casual", desc: "Conversational, friendly, relatable" },
  { id: "hype", label: "High Energy", desc: "Excited, bold, attention-grabbing" },
  { id: "educational", label: "Educational", desc: "Clear, informative, teacher-like" },
  { id: "storyteller", label: "Storyteller", desc: "Narrative-driven, engaging, personal" },
];

function EmptyTab({ platform }: { platform: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <p className="text-muted text-sm">No {platform} content was generated for this video. Try regenerating.</p>
    </div>
  );
}

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"idle" | "transcript" | "generating" | "done">("idle");
  const [error, setError] = useState("");
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [activeTab, setActiveTab] = useState("twitter");
  const [tone, setTone] = useState("casual");
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const toneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  // Close tone dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (toneRef.current && !toneRef.current.contains(e.target as Node)) {
        setShowToneDropdown(false);
      }
    }
    if (showToneDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showToneDropdown]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setContent(null);
    setStep("transcript");

    try {
      const transcriptRes = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const transcriptData = await transcriptRes.json();
      if (!transcriptRes.ok) {
        throw new Error(transcriptData.error || "Failed to get transcript");
      }

      setVideoTitle(transcriptData.title);
      setStep("generating");

      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: transcriptData.transcript,
          title: transcriptData.title,
          tone,
          youtubeUrl: url,
        }),
      });

      const generateData = await generateRes.json();
      if (!generateRes.ok) {
        throw new Error(generateData.error || "Failed to generate content");
      }

      setContent(generateData.content);
      setStep("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg === "The user aborted a request." ? "Request timed out. Try a shorter video." : msg);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  }

  function renderContent() {
    if (!content) return null;

    switch (activeTab) {
      case "twitter":
        if (!content.twitter?.posts?.length) return <EmptyTab platform="Twitter/X" />;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              <h2 className="text-base font-semibold">Standalone Posts</h2>
            </div>
            {content.twitter.posts.map((post, i) => (
              <ContentCard key={i} title={`Tweet ${i + 1}`} content={post} platform="twitter" />
            ))}
            {content.twitter.thread?.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-2 mt-8">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  <h2 className="text-base font-semibold">Thread</h2>
                </div>
                {content.twitter.thread.map((tweet, i) => (
                  <ContentCard key={`thread-${i}`} title={`Thread ${i + 1}/${content.twitter.thread.length}`} content={tweet} platform="twitter" />
                ))}
              </>
            )}
          </div>
        );

      case "tiktok":
        if (!content.tiktok?.scripts?.length) return <EmptyTab platform="TikTok" />;
        return (
          <div className="space-y-6">
            {content.tiktok.scripts.map((script, i) => (
              <div key={i} className="bg-card/50 border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary-light" />
                  <h3 className="text-sm font-semibold">Script {i + 1}</h3>
                </div>
                {script.hook && <ContentCard title="Hook (First 3 seconds)" content={script.hook} platform="tiktok" />}
                {script.body && <ContentCard title="Body" content={script.body} platform="tiktok" />}
                {script.cta && <ContentCard title="Call to Action" content={script.cta} platform="tiktok" />}
                {script.visualNotes && <ContentCard title="Visual Notes" content={script.visualNotes} platform="tiktok" />}
                <VideoGenerator
                  hook={script.hook || ""}
                  body={script.body || ""}
                  cta={script.cta || ""}
                  visualNotes={script.visualNotes || ""}
                  scriptIndex={i + 1}
                />
              </div>
            ))}
          </div>
        );

      case "instagram":
        if (!content.instagram?.reels?.length) return <EmptyTab platform="Instagram" />;
        return (
          <div className="space-y-6">
            {content.instagram.reels.map((reel, i) => (
              <div key={i} className="bg-card/50 border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary-light" />
                  <h3 className="text-sm font-semibold">Reel {i + 1}</h3>
                </div>
                {reel.hook && <ContentCard title="Hook (First 3 seconds)" content={reel.hook} platform="instagram" />}
                {reel.body && <ContentCard title="Body" content={reel.body} platform="instagram" />}
                {reel.cta && <ContentCard title="Call to Action" content={reel.cta} platform="instagram" />}
                {reel.caption && <ContentCard title="Instagram Caption" content={reel.caption} platform="instagram" />}
                <VideoGenerator
                  hook={reel.hook || ""}
                  body={reel.body || ""}
                  cta={reel.cta || ""}
                  visualNotes=""
                  scriptIndex={i + 1}
                />
              </div>
            ))}
          </div>
        );

      case "linkedin":
        if (!content.linkedin) return <EmptyTab platform="LinkedIn" />;
        return <ContentCard title="LinkedIn Post" content={content.linkedin} platform="linkedin" />;

      case "newsletter":
        if (!content.newsletter) return <EmptyTab platform="Newsletter" />;
        return (
          <div className="space-y-4">
            {content.newsletter.subjectLine && <ContentCard title="Subject Line" content={content.newsletter.subjectLine} platform="newsletter" />}
            {content.newsletter.body && <ContentCard title="Email Body" content={typeof content.newsletter.body === "string" ? content.newsletter.body : JSON.stringify(content.newsletter.body)} platform="newsletter" />}
          </div>
        );

      case "blog":
        if (!content.blog) return <EmptyTab platform="Blog" />;
        return (
          <div className="space-y-4">
            {content.blog.title && <ContentCard title="Blog Title" content={content.blog.title} platform="blog" />}
            {content.blog.outline && <ContentCard title="Outline" content={Array.isArray(content.blog.outline) ? content.blog.outline.join("\n") : String(content.blog.outline)} platform="blog" />}
            {content.blog.intro && <ContentCard title="Introduction" content={content.blog.intro} platform="blog" />}
          </div>
        );

      case "quotes":
        if (!content.quotes?.length) return <EmptyTab platform="Quotes" />;
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.quotes.map((quote, i) => (
              <ContentCard key={i} title={`Quote ${i + 1}`} content={quote} platform="quotes" />
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Repurpose a Video</h1>
            <p className="text-muted text-sm">One video in, a week of content out.</p>
          </div>
        </div>
      </div>

      {/* URL Input + Tone */}
      <form onSubmit={handleGenerate} className="mb-8 space-y-4">
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            required
            className="flex-1 bg-card border border-border rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {step === "transcript" ? "Extracting..." : "Generating..."}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Repurpose
              </>
            )}
          </button>
        </div>

        {/* Tone selector */}
        <div className="relative" ref={toneRef}>
          <button
            type="button"
            onClick={() => setShowToneDropdown(!showToneDropdown)}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Tone: <span className="text-foreground font-medium">{tones.find(t => t.id === tone)?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showToneDropdown ? "rotate-180" : ""}`} />
          </button>
          {showToneDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl p-2 shadow-xl z-10 w-72">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { setTone(t.id); setShowToneDropdown(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    tone === t.id ? "bg-primary/10 text-primary" : "hover:bg-card-hover"
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted">{t.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl px-5 py-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Generation failed</p>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <Zap className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <p className="font-semibold text-lg">
            {step === "transcript" ? "Extracting transcript..." : "Generating content..."}
          </p>
          <p className="text-sm text-muted mt-2">
            {step === "transcript"
              ? "Pulling the words from your video."
              : "Crafting platform-native content for 7 platforms. This takes about 30 seconds."}
          </p>
          {step === "generating" && (
            <div className="flex justify-center gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {content && !loading && (
        <div>
          {videoTitle && (
            <div className="mb-6 bg-card/50 border border-border rounded-xl px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider">Generated from</p>
                <p className="font-medium text-sm">{videoTitle}</p>
              </div>
            </div>
          )}

          {/* Platform tabs */}
          <div className="flex gap-1 bg-card border border-border rounded-2xl p-1.5 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]"
                    : "text-muted hover:text-foreground hover:bg-card-hover"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {renderContent()}
        </div>
      )}
    </div>
  );
}
