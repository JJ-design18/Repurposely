import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { buildPromptBatch1, buildPromptBatch2, buildPromptBatch3 } from "@/lib/prompts";
import { getAuthUser } from "@/lib/auth";
import { createSupabaseServer } from "@/lib/supabase-server";
import { hasFeature, canUseTones } from "@/lib/plans";
import { PLAN_LIMITS } from "@/types";
import type { GeneratedContent } from "@/types";

export const maxDuration = 60;

function repairJSON(raw: string): string {
  let s = raw.trim();
  const openBraces = (s.match(/{/g) || []).length;
  const closeBraces = (s.match(/}/g) || []).length;
  const openBrackets = (s.match(/\[/g) || []).length;
  const closeBrackets = (s.match(/]/g) || []).length;

  for (let i = 0; i < openBrackets - closeBrackets; i++) s += "]";
  for (let i = 0; i < openBraces - closeBraces; i++) s += "}";
  s = s.replace(/,\s*([}\]])/g, "$1");
  return s;
}

function safeParse(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(repairJSON(raw));
  }
}

const SYSTEM_MSG =
  "You are a content creator. Output ONLY valid JSON. No markdown. No code fences. Complete ALL sections. NEVER use: unlock, leverage, dive in, game-changer, embark, delve, explore, journey, elevate, harness, navigate, landscape, utilize, comprehensive. Write like a real human. Contractions always. Short sentences.";

export async function POST(req: NextRequest) {
  // Auth check
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcript, title, tone, youtubeUrl } = await req.json();

    if (!transcript || !title) {
      return NextResponse.json(
        { error: "Transcript and title are required" },
        { status: 400 }
      );
    }

    // Enforce generation limits
    const supabase = await createSupabaseServer();
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, generations_used, generations_reset_at")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Monthly quota reset (check-on-read — no cron required).
    // If the billing period has elapsed, zero the counter and roll the window forward.
    if (
      !profile.generations_reset_at ||
      new Date(profile.generations_reset_at) <= new Date()
    ) {
      const nextReset = new Date();
      nextReset.setMonth(nextReset.getMonth() + 1);
      await supabase
        .from("profiles")
        .update({ generations_used: 0, generations_reset_at: nextReset.toISOString() })
        .eq("id", user.id);
      profile.generations_used = 0;
    }

    const limit = PLAN_LIMITS[profile.plan] || PLAN_LIMITS.free;
    if (profile.generations_used >= limit) {
      return NextResponse.json(
        { error: `You've reached your ${profile.plan} plan limit of ${limit} generations/month. Upgrade for more.` },
        { status: 403 }
      );
    }

    // Cap transcript size
    const safeTranscript = transcript.slice(0, 50000);

    const openai = getOpenAI();
    // Enforce tone gating server-side — free users get casual only
    const t = canUseTones(profile.plan) ? (tone || "casual") : "casual";

    // Pro/Agency get gpt-4o (better quality), Free/Starter get gpt-4o-mini
    const model = hasFeature(profile.plan, "pro") ? "gpt-4o" : "gpt-4o-mini";

    const [result1, result2, result3] = await Promise.all([
      openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_MSG },
          { role: "user", content: buildPromptBatch1(safeTranscript, title, t) },
        ],
        temperature: 0.8,
        max_tokens: 8000,
        response_format: { type: "json_object" },
      }),
      openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_MSG },
          { role: "user", content: buildPromptBatch2(safeTranscript, title, t) },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
      openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_MSG },
          { role: "user", content: buildPromptBatch3(safeTranscript, title, t) },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
    ]);

    const raw1 = result1.choices[0]?.message?.content;
    const raw2 = result2.choices[0]?.message?.content;
    const raw3 = result3.choices[0]?.message?.content;

    if (!raw1 || !raw2 || !raw3) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    const batch1 = safeParse(raw1);
    const batch2 = safeParse(raw2);
    const batch3 = safeParse(raw3);

    const content: GeneratedContent = {
      twitter: batch1.twitter as GeneratedContent["twitter"],
      tiktok: batch1.tiktok as GeneratedContent["tiktok"],
      instagram: batch1.instagram as GeneratedContent["instagram"],
      linkedin: batch2.linkedin as string,
      newsletter: batch2.newsletter as GeneratedContent["newsletter"],
      blog: batch3.blog as GeneratedContent["blog"],
      quotes: batch3.quotes as string[],
    };

    // Save to history server-side
    await supabase.from("projects").insert({
      user_id: user.id,
      youtube_url: youtubeUrl || "",
      video_title: title,
      transcript: safeTranscript.slice(0, 10000),
      generated_content: content,
      status: "completed",
    });

    // Atomic-ish usage increment (server-side, not client)
    await supabase
      .from("profiles")
      .update({ generations_used: profile.generations_used + 1 })
      .eq("id", user.id);

    return NextResponse.json({ content });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Generation error:", errMsg);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
