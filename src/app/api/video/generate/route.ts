import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";

const VIDEOS_DIR = path.join(process.cwd(), "public", "videos");

export async function POST(req: NextRequest) {
  try {
    const { hook, body, cta, visualNotes } = await req.json();

    if (!hook || !body) {
      return NextResponse.json(
        { error: "Hook and body are required" },
        { status: 400 }
      );
    }

    if (!existsSync(VIDEOS_DIR)) {
      await mkdir(VIDEOS_DIR, { recursive: true });
    }

    const id = crypto.randomUUID().slice(0, 8);
    const openai = getOpenAI();

    // Step 1: Expand into a natural-sounding voiceover script
    const expandResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You write voiceover scripts for YouTube Shorts. You sound like a real creator teaching their audience — confident, direct, like you know what you're talking about because YOU do this stuff.

CRITICAL: You are the expert. You are teaching. Never say "this person said" or "in this video." YOU are sharing YOUR knowledge.

Take the script below and expand it into a 45-60 second voiceover.

VOICE RULES:
- First person. "I", "you", "we". Direct to camera energy.
- Contractions always: "don't", "can't", "it's", "you're"
- Start sentences with: "Look,", "Here's the thing,", "Most people", "But", "So"
- Short sentences. Under 12 words each. Punch. Punch. Punch.
- Ask rhetorical questions: "You know what that means?"
- Sound like you've DONE this, not like you READ about it
- NEVER say: "unlock", "leverage", "journey", "game-changer", "dive in", "explore"

STRUCTURE:
- Hook (keep as-is)
- Problem: why most people fail at this (2 sentences)
- 3 rapid tips/steps (2 sentences each, specific)
- Payoff: the result when you do this right (1 sentence)
- CTA (1 sentence)

OUTPUT: ONLY the spoken words. No labels. No directions. 140-180 words.`,
        },
        {
          role: "user",
          content: `Hook: ${hook}\nBody: ${body}\nCTA: ${cta}\n\nExpand this into a natural, human-sounding 45-60 second voiceover.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 450,
    });

    const voiceoverScript =
      expandResponse.choices[0]?.message?.content ||
      `${hook}... ${body}... ${cta}`;

    // Step 2: Generate the voiceover audio
    // "echo" voice sounds most natural and human
    const ttsResponse = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "echo",
      input: voiceoverScript,
      response_format: "mp3",
      speed: 1.05,
    });

    const audioFilename = `voiceover_${id}.mp3`;
    const audioPath = path.join(VIDEOS_DIR, audioFilename);
    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());
    await writeFile(audioPath, audioBuffer);

    // Step 3: Generate scene-by-scene storyboard with B-roll directions
    const storyboardResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional video editor creating a shot-by-shot storyboard for a YouTube Short / TikTok.

Given a voiceover script, create a scene-by-scene production guide. For EACH scene:
- What the narrator is saying during this scene (the exact line from the script)
- What B-roll footage to show (be SPECIFIC and LITERAL — describe filmable scenes, not abstract concepts)
- What text overlay to show on screen (bold, short, 3-5 words max)
- Duration estimate in seconds
- Any transition or effect notes

Create 8-12 scenes total. The scenes should flow like a real TikTok — fast cuts, visually dynamic, never boring.

Return JSON:
{
  "scenes": [
    {
      "narration": "exact line being spoken",
      "broll": "specific visual description for this moment",
      "textOverlay": "SHORT BOLD TEXT",
      "duration": 3,
      "notes": "transition or effect suggestion"
    }
  ],
  "captionStyle": "recommended caption style for this content",
  "musicMood": "recommended background music mood"
}`,
        },
        {
          role: "user",
          content: `Voiceover script:\n${voiceoverScript}\n\nVideo topic: ${hook}\nVisual notes from creator: ${visualNotes || "cinematic, engaging"}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    let storyboard = { scenes: [], captionStyle: "", musicMood: "" };
    try {
      storyboard = JSON.parse(
        storyboardResponse.choices[0]?.message?.content || "{}"
      );
    } catch {
      /* use empty storyboard */
    }

    return NextResponse.json({
      voiceoverScript,
      audioUrl: `/videos/${audioFilename}`,
      storyboard,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Production kit error:", errMsg);
    return NextResponse.json(
      { error: `Production kit failed: ${errMsg}` },
      { status: 500 }
    );
  }
}
