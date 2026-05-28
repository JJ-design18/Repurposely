"use client";

import Link from "next/link";
import {
  ArrowRight,
  Download,
  Copy,
  Scissors,
  Music,
  Type,
  Upload,
  Play,
  Eye,
  Mic,
  Film,
  Sparkles,
  Check,
  Clock,
  Layers,
  BookOpen,
} from "lucide-react";

function StepBlock({
  number,
  title,
  time,
  icon: Icon,
  children,
}: {
  number: string;
  title: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-primary font-bold">STEP {number}</span>
            <span className="text-xs text-muted">({time})</span>
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Production Kit Guide</h1>
          <p className="text-muted text-sm">From YouTube video to posted Short in 5 minutes.</p>
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {/* What you get */}
        <section>
          <h2 className="text-xl font-bold mb-4">What&apos;s Inside the Production Kit</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: Mic,
                title: "AI Voiceover MP3",
                desc: "Professional HD voiceover generated from your script. Deep, cinematic voice. Ready to drop into any editor.",
              },
              {
                icon: Type,
                title: "Full Voiceover Script",
                desc: "The expanded, viral-structured script the AI wrote. Copy it for captions or teleprompter use.",
              },
              {
                icon: Eye,
                title: "Scene-by-Scene Storyboard",
                desc: "8-12 scenes with exact B-roll descriptions, text overlays, timing, and transition notes for each moment.",
              },
              {
                icon: Music,
                title: "Music & Style Recommendations",
                desc: "Suggested background music mood and caption style that matches your content.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-xl font-bold mb-2">Step-by-Step: Your First Short</h2>
          <p className="text-muted text-sm mb-6">Follow these steps exactly. Total time: about 5 minutes once you get the hang of it.</p>

          <div className="space-y-6">
            <StepBlock number="0" title="Generate Your Production Kit" time="30 seconds" icon={Sparkles}>
              <ol className="space-y-2 text-sm text-muted">
                {[
                  "Go to your Repurposely dashboard",
                  "Paste any YouTube video URL and hit \"Repurpose\"",
                  "Click the TikTok tab",
                  "Click \"Generate Production Kit\" under any script",
                  "Wait ~20 seconds. Download the MP3 when it's ready.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ol>
            </StepBlock>

            <StepBlock number="1" title="Open CapCut and Create a New Project" time="15 seconds" icon={Film}>
              <div className="space-y-3 text-sm text-muted">
                <p>Download <strong className="text-foreground">CapCut</strong> (free) on your phone or desktop.</p>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Settings to use:</p>
                  <ul className="space-y-1 text-xs">
                    <li>Aspect ratio: <strong>9:16</strong> (vertical)</li>
                    <li>Resolution: <strong>1080 x 1920</strong></li>
                    <li>Frame rate: <strong>30 fps</strong></li>
                  </ul>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="2" title="Import Your Voiceover MP3" time="10 seconds" icon={Download}>
              <div className="space-y-3 text-sm text-muted">
                <p>Drag the MP3 file you downloaded from Repurposely into CapCut&apos;s timeline. This is your audio track — the backbone of the entire Short.</p>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs"><strong className="text-primary">Pro tip:</strong> The voiceover is already structured as a viral script — hook in the first 3 seconds, escalating value, quotable climax. Don&apos;t cut or rearrange it.</p>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="3" title="Add Auto Captions" time="30 seconds" icon={Type}>
              <div className="space-y-3 text-sm text-muted">
                <p>In CapCut, tap <strong className="text-foreground">Text</strong> then <strong className="text-foreground">Auto captions</strong>. CapCut will transcribe your voiceover automatically.</p>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Caption style that works best:</p>
                  <ul className="space-y-1 text-xs">
                    <li>Font: <strong>Bold sans-serif</strong> (Montserrat, Bebas Neue, or CapCut&apos;s default bold)</li>
                    <li>Size: <strong>Large</strong> — readable on phone</li>
                    <li>Position: <strong>Center of screen</strong>, slightly above middle</li>
                    <li>Style: <strong>Word-by-word highlight</strong> (CapCut has this built in)</li>
                    <li>Color: <strong>White text with black outline</strong> or highlight key words in yellow/green</li>
                  </ul>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs"><strong className="text-primary">Pro tip:</strong> Highlight 1-2 key words per caption in a different color. The Production Kit tells you which words to emphasize in each scene&apos;s text overlay.</p>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="4" title="Add B-Roll Footage (Follow the Storyboard)" time="2-3 minutes" icon={Layers}>
              <div className="space-y-3 text-sm text-muted">
                <p>This is where the storyboard saves you hours. Open it in Repurposely and go scene by scene.</p>
                <div className="bg-background rounded-lg p-4 border border-border space-y-3">
                  <p className="text-xs font-semibold text-foreground">For each scene in the storyboard:</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2"><span className="text-primary font-bold">1.</span> Read the B-roll description (e.g., &ldquo;person scrolling through online store on phone&rdquo;)</div>
                    <div className="flex gap-2"><span className="text-primary font-bold">2.</span> Find a matching clip. Three free sources:</div>
                    <ul className="ml-6 space-y-1">
                      <li><strong>CapCut&apos;s built-in stock footage</strong> — tap &ldquo;Stock&rdquo; in the media panel</li>
                      <li><strong>Pexels.com</strong> — search and download free HD clips</li>
                      <li><strong>Pixabay.com</strong> — another free stock footage site</li>
                    </ul>
                    <div className="flex gap-2"><span className="text-primary font-bold">3.</span> Drop the clip into the timeline to match the scene&apos;s duration</div>
                    <div className="flex gap-2"><span className="text-primary font-bold">4.</span> Repeat for each scene. 8-12 clips total = a dynamic, fast-cut Short</div>
                  </div>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs"><strong className="text-primary">Pro tip:</strong> Each clip should be 3-5 seconds max. Fast cuts keep viewers watching. Never let one clip sit for more than 5 seconds or people will scroll past.</p>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="5" title="Add Background Music" time="30 seconds" icon={Music}>
              <div className="space-y-3 text-sm text-muted">
                <p>The Production Kit tells you the recommended music mood. Search CapCut&apos;s music library for that vibe.</p>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">Audio rules:</p>
                  <ul className="space-y-1 text-xs">
                    <li>Music volume: <strong>10-20%</strong> — voice is king</li>
                    <li>Voiceover volume: <strong>100%</strong></li>
                    <li>Pick a track with a <strong>build and drop</strong> — it should peak when your climax line hits</li>
                    <li>No lyrics in the music — it competes with the voiceover</li>
                  </ul>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="6" title="Add Text Overlays (Optional but Powerful)" time="1 minute" icon={Scissors}>
              <div className="space-y-3 text-sm text-muted">
                <p>Each scene in the storyboard has a &ldquo;Text Overlay&rdquo; field — short, bold phrases like &ldquo;THE REAL SECRET&rdquo; or &ldquo;NOBODY TALKS ABOUT THIS.&rdquo;</p>
                <p>Add these as separate text elements in CapCut, positioned at the top or center of the screen. Use a big, bold font.</p>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs"><strong className="text-primary">Pro tip:</strong> You don&apos;t need text overlays on every scene. Use them on the hook (scene 1), the biggest revelation (mid-video), and the climax. 3-4 total is the sweet spot.</p>
                </div>
              </div>
            </StepBlock>

            <StepBlock number="7" title="Export and Post Everywhere" time="30 seconds" icon={Upload}>
              <div className="space-y-3 text-sm text-muted">
                <p>Export your video from CapCut:</p>
                <div className="bg-background rounded-lg p-4 border border-border">
                  <ul className="space-y-1 text-xs">
                    <li>Resolution: <strong>1080 x 1920</strong></li>
                    <li>Frame rate: <strong>30 fps</strong></li>
                    <li>Format: <strong>MP4</strong></li>
                  </ul>
                </div>
                <p>Then upload to:</p>
                <ul className="space-y-1 text-xs">
                  <li className="flex gap-2"><Check className="w-3 h-3 text-success mt-0.5" /><strong>YouTube Shorts</strong> — upload as a Short (under 60 seconds)</li>
                  <li className="flex gap-2"><Check className="w-3 h-3 text-success mt-0.5" /><strong>TikTok</strong> — post directly</li>
                  <li className="flex gap-2"><Check className="w-3 h-3 text-success mt-0.5" /><strong>Instagram Reels</strong> — post as a Reel</li>
                </ul>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                  <p className="text-xs"><strong className="text-primary">Pro tip:</strong> Post the same Short to all 3 platforms but change the caption and hashtags for each one. Repurposely already generated platform-specific captions for you in the Twitter and LinkedIn tabs.</p>
                </div>
              </div>
            </StepBlock>
          </div>
        </section>

        {/* What makes a Short go viral */}
        <section>
          <h2 className="text-xl font-bold mb-4">What Makes a Short Go Viral</h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            {[
              { title: "Hook in 0-3 seconds", desc: "Viewers decide to watch or swipe in the first 3 seconds. Your Production Kit script is designed with a pattern-interrupting hook that creates a curiosity gap." },
              { title: "Fast cuts, never boring", desc: "Change the visual every 3-5 seconds. The storyboard gives you 8-12 scenes — that's a new clip every few seconds, which keeps viewers locked in." },
              { title: "Captions are non-negotiable", desc: "81% of viral Shorts use on-screen text. Most people watch on mute. Bold, word-by-word captions make your content work with sound on OR off." },
              { title: "One quotable climax line", desc: "Every viral Short has one moment people screenshot or replay. Your script builds to a single powerful line near the end." },
              { title: "Loop potential", desc: "The best Shorts feel seamless when they replay. If a viewer watches twice, the algorithm pushes it harder. Our scripts are designed to loop naturally." },
              { title: "Music supports, never overpowers", desc: "Background music should be at 10-20% volume. The voice is the star. Pick tracks with a build that peaks at your climax line." },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <Play className="w-4 h-4 text-primary shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
