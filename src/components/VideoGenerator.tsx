"use client";

import { useState } from "react";
import {
  Film,
  Download,
  Copy,
  Check,
  Mic,
  Eye,
  Type,
  Music,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

interface Scene {
  narration: string;
  broll: string;
  textOverlay: string;
  duration: number;
  notes: string;
}

interface Storyboard {
  scenes: Scene[];
  captionStyle: string;
  musicMood: string;
}

interface VideoGeneratorProps {
  hook: string;
  body: string;
  cta: string;
  visualNotes: string;
  scriptIndex: number;
}

export default function VideoGenerator({
  hook,
  body,
  cta,
  visualNotes,
  scriptIndex,
}: VideoGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{
    voiceoverScript: string;
    audioUrl: string;
    storyboard: Storyboard;
  } | null>(null);
  const [error, setError] = useState("");
  const [copiedScript, setCopiedScript] = useState(false);
  const [showStoryboard, setShowStoryboard] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult(null);
    setProgress("Writing viral script...");

    const timers = [
      setTimeout(() => setProgress("Generating HD voiceover..."), 5000),
      setTimeout(() => setProgress("Building scene-by-scene storyboard..."), 15000),
    ];

    try {
      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook, body, cta, visualNotes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");

      setResult(data);
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProgress("");
    } finally {
      setLoading(false);
      timers.forEach(clearTimeout);
    }
  }

  async function copyScript() {
    if (!result) return;
    await navigator.clipboard.writeText(result.voiceoverScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  }

  async function copyCaptions() {
    if (!result?.storyboard?.scenes) return;
    const captions = result.storyboard.scenes
      .map((s) => s.textOverlay)
      .filter(Boolean)
      .join("\n");
    await navigator.clipboard.writeText(captions);
  }

  if (!result && !loading) {
    return (
      <div className="mt-4">
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-purple-500 text-white hover:opacity-90 transition-all hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]"
        >
          <Sparkles className="w-4 h-4" />
          Generate Production Kit for Script {scriptIndex}
        </button>
        <p className="text-xs text-muted mt-2">
          Get a voiceover MP3 + scene-by-scene storyboard to make a Short in
          under 5 minutes
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-4 bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{progress}</p>
            <p className="text-xs text-muted mt-0.5">
              About 20 seconds. Creating your voiceover and storyboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const totalDuration = result.storyboard?.scenes?.reduce(
    (sum, s) => sum + (s.duration || 3),
    0
  ) || 0;

  return (
    <div className="mt-4 space-y-4">
      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Production Kit Header */}
      <div className="bg-gradient-to-br from-primary/10 to-purple-500/5 border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Production Kit Ready</h3>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            ~{totalDuration}s Short
          </span>
        </div>
        <p className="text-xs text-muted mb-4">
          Everything you need to create a professional YouTube Short in under 5
          minutes.
        </p>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2">
          <a
            href={result.audioUrl}
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Voiceover MP3
          </a>
          <button
            onClick={copyScript}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-card border border-border hover:bg-card-hover transition-colors"
          >
            {copiedScript ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Full Script
              </>
            )}
          </button>
          <button
            onClick={copyCaptions}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-card border border-border hover:bg-card-hover transition-colors"
          >
            <Type className="w-4 h-4" />
            Copy Caption Text
          </button>
        </div>
      </div>

      {/* Voiceover Script */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Mic className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold">Voiceover Script</h4>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {result.voiceoverScript}
        </p>
      </div>

      {/* Storyboard */}
      {result.storyboard?.scenes?.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setShowStoryboard(!showStoryboard)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-card-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-semibold">
                Scene-by-Scene Storyboard
              </h4>
              <span className="text-xs text-muted">
                {result.storyboard.scenes.length} scenes
              </span>
            </div>
            {showStoryboard ? (
              <ChevronUp className="w-4 h-4 text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted" />
            )}
          </button>

          {showStoryboard && (
            <div className="px-5 pb-5 space-y-3">
              {result.storyboard.scenes.map((scene, i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-xl p-4 flex gap-4"
                >
                  {/* Scene number */}
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                    {i + 1}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Narration */}
                    <p className="text-sm text-foreground/90 italic">
                      &ldquo;{scene.narration}&rdquo;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {/* B-roll */}
                      <div className="bg-card rounded-lg p-2.5">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
                          B-Roll
                        </p>
                        <p className="text-xs">{scene.broll}</p>
                      </div>

                      {/* Text overlay */}
                      <div className="bg-card rounded-lg p-2.5">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
                          Text Overlay
                        </p>
                        <p className="text-xs font-bold">
                          {scene.textOverlay}
                        </p>
                      </div>

                      {/* Duration + notes */}
                      <div className="bg-card rounded-lg p-2.5">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
                          {scene.duration}s — Notes
                        </p>
                        <p className="text-xs text-muted">
                          {scene.notes || "Standard cut"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Music & Caption style */}
              <div className="flex gap-3 mt-2">
                {result.storyboard.musicMood && (
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-background rounded-lg px-3 py-2">
                    <Music className="w-3 h-3" />
                    Music: {result.storyboard.musicMood}
                  </div>
                )}
                {result.storyboard.captionStyle && (
                  <div className="flex items-center gap-1.5 text-xs text-muted bg-background rounded-lg px-3 py-2">
                    <Type className="w-3 h-3" />
                    Captions: {result.storyboard.captionStyle}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How to use this */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-card-hover transition-colors"
        >
          <h4 className="text-sm font-semibold">
            How to Make Your Short in 5 Minutes
          </h4>
          {showInstructions ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {showInstructions && (
          <div className="px-5 pb-5 space-y-3">
            {[
              {
                step: "1",
                title: "Import the voiceover",
                desc: "Open CapCut (free). Create new project. Import the MP3 voiceover file you downloaded.",
              },
              {
                step: "2",
                title: "Add auto captions",
                desc: 'Tap "Text" then "Auto captions." CapCut will transcribe the voiceover. Pick a bold, large caption style.',
              },
              {
                step: "3",
                title: "Add B-roll footage",
                desc: "Follow the storyboard above. Use CapCut's built-in stock footage, or search Pexels.com for free clips. Drop each clip to match the scene timing.",
              },
              {
                step: "4",
                title: "Add background music",
                desc: `Search CapCut's music library for "${result.storyboard?.musicMood || "cinematic motivational"}" tracks. Keep it low — voice is king.`,
              },
              {
                step: "5",
                title: "Export and post",
                desc: "Export at 1080x1920 (9:16). Upload to YouTube Shorts, TikTok, and Instagram Reels.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Regenerate */}
      <button
        onClick={handleGenerate}
        className="text-xs text-muted hover:text-primary transition-colors"
      >
        Regenerate with a different style
      </button>
    </div>
  );
}
