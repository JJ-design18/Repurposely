"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { canViewHistory } from "@/lib/plans";
import {
  History,
  ExternalLink,
  Trash2,
  Calendar,
  MessageCircle,
  Film,
  Briefcase,
  Mail,
  FileText,
  Quote,
  Camera,
  ChevronRight,
  Inbox,
} from "lucide-react";
import ContentCard from "@/components/ContentCard";
import type { GeneratedContent, Project } from "@/types";

const platformTabs = [
  { id: "twitter", label: "Twitter/X", icon: MessageCircle },
  { id: "tiktok", label: "TikTok", icon: Film },
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "linkedin", label: "LinkedIn", icon: Briefcase },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "quotes", label: "Quotes", icon: Quote },
];

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("twitter");
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const supabase = createSupabaseBrowser();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    const user = session.user;

    // Check plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    setUserPlan(profile?.plan || "free");

    if (!canViewHistory(profile?.plan || "free")) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setProjects((data || []) as Project[]);
    setLoading(false);
  }

  async function deleteProject(id: string) {
    const supabase = createSupabaseBrowser();
    await supabase.from("projects").delete().eq("id", id);
    setProjects(projects.filter((p) => p.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function renderExpandedContent(content: GeneratedContent) {
    const noContent = <ContentCard title="No Content" content="No content generated for this platform." platform={activeTab} />;
    switch (activeTab) {
      case "twitter":
        if (!content.twitter?.posts?.length) return noContent;
        return (
          <div className="space-y-3">
            {content.twitter.posts.map((post, i) => (
              <ContentCard key={i} title={`Tweet ${i + 1}`} content={post} platform="twitter" />
            ))}
          </div>
        );
      case "tiktok":
        if (!content.tiktok?.scripts?.length) return noContent;
        return (
          <div className="space-y-3">
            {content.tiktok.scripts.map((script, i) => (
              <ContentCard key={i} title={`Script ${i + 1} — Hook`} content={script.hook} platform="tiktok" />
            ))}
          </div>
        );
      case "instagram":
        if (!content.instagram?.reels?.length) return noContent;
        return (
          <div className="space-y-3">
            {content.instagram.reels.map((reel, i) => (
              <ContentCard key={i} title={`Reel ${i + 1} — Hook`} content={`${reel.hook}\n\n${reel.body}\n\nCTA: ${reel.cta}\n\nCaption: ${reel.caption}`} platform="instagram" />
            ))}
          </div>
        );
      case "linkedin": {
        const text = typeof content.linkedin === "string" ? content.linkedin : JSON.stringify(content.linkedin || "");
        return <ContentCard title="LinkedIn Post" content={text || "No content generated."} platform="linkedin" />;
      }
      case "newsletter": {
        const body = typeof content.newsletter?.body === "string" ? content.newsletter.body : JSON.stringify(content.newsletter?.body || "");
        return <ContentCard title="Email Body" content={body || "No content generated."} platform="newsletter" />;
      }
      case "blog": {
        const intro = typeof content.blog?.intro === "string" ? content.blog.intro : JSON.stringify(content.blog?.intro || "");
        return <ContentCard title="Blog Intro" content={intro || "No content generated."} platform="blog" />;
      }
      case "quotes":
        if (!Array.isArray(content.quotes) || !content.quotes.length) return noContent;
        return (
          <div className="space-y-3">
            {content.quotes.map((q, i) => (
              <ContentCard key={i} title={`Quote ${i + 1}`} content={q} platform="quotes" />
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

  if (userPlan && !canViewHistory(userPlan)) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Generation History</h1>
        </div>
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <History className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">History is a Starter feature</h3>
          <p className="text-muted text-sm mb-6">Upgrade to Starter to save and revisit all your past generations.</p>
          <a href="/dashboard/settings" className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors">
            Upgrade to Starter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Generation History</h1>
          <p className="text-muted text-sm">{projects.length} generation{projects.length !== 1 ? "s" : ""} total</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <Inbox className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No generations yet</h3>
          <p className="text-muted text-sm">Your repurposed content will show up here after your first generation.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/30">
              {/* Project header */}
              <button
                onClick={() => {
                  setExpandedId(expandedId === project.id ? null : project.id);
                  setActiveTab("twitter");
                }}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${project.status === "completed" ? "bg-success" : project.status === "failed" ? "bg-danger" : "bg-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{project.video_title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(project.created_at)}
                    </span>
                    <a
                      href={project.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Video
                    </a>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                  className="text-muted hover:text-danger transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className={`w-4 h-4 text-muted transition-transform ${expandedId === project.id ? "rotate-90" : ""}`} />
              </button>

              {/* Expanded content */}
              {expandedId === project.id && project.generated_content && (
                <div className="px-5 pb-5 border-t border-border pt-4">
                  <div className="flex gap-1 bg-background rounded-xl p-1 mb-4 overflow-x-auto">
                    {platformTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? "bg-primary text-white"
                            : "text-muted hover:text-foreground hover:bg-card-hover"
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {renderExpandedContent(project.generated_content as GeneratedContent)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
