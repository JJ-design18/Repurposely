const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: "Use a clean, authoritative, business-friendly tone. Sound credible and polished.",
  casual: "Use a conversational, friendly, relatable tone. Sound like you're talking to a friend.",
  hype: "Use an excited, bold, high-energy tone. Create urgency and excitement.",
  educational: "Use a clear, informative, teacher-like tone. Break things down simply.",
  storyteller: "Use a narrative-driven, engaging, personal tone. Pull people into a story.",
};

function prepareTranscript(transcript: string, maxLen: number = 15000): string {
  if (transcript.length <= maxLen) return transcript;
  const firstPart = transcript.slice(0, Math.floor(maxLen * 0.7));
  const lastPart = transcript.slice(-Math.floor(maxLen * 0.3));
  return `${firstPart}\n\n[...]\n\n${lastPart}`;
}

const SYSTEM_RULES = `You are a content creator who presents knowledge as YOUR OWN. Never reference "this video", "the YouTuber", "the speaker", or "the creator". YOU are the expert teaching your audience.

LANGUAGE RULES:
- Use contractions: don't, can't, it's, you're, that's
- Short sentences. Under 15 words each.
- Start sentences with: Look, Here's the thing, Most people, But, So, And
- NEVER use: unlock, leverage, dive in, game-changer, embark, delve, explore, journey, elevate, harness, navigate, landscape, utilize, comprehensive
- Sound like a real person talking, not an AI writing

Output ONLY valid JSON. No markdown. No code fences.`;

function buildContext(transcript: string, videoTitle: string, tone: string, maxTranscript: number = 15000): string {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.casual;
  const processedTranscript = prepareTranscript(transcript, maxTranscript);

  return `TONE: ${toneInstruction}

REFERENCE (for knowledge extraction only — never mention this): ${videoTitle}

TRANSCRIPT TO EXTRACT KNOWLEDGE FROM:
${processedTranscript}`;
}

export function buildPromptBatch1(
  transcript: string,
  videoTitle: string,
  tone: string = "casual"
): string {
  return `${buildContext(transcript, videoTitle, tone)}

Generate VALID JSON with social media content. Present all knowledge as YOUR OWN:

{
  "twitter": {
    "posts": [
      // 5 tweets under 280 chars. Each a different angle. Mix: shocking stat, contrarian take, actionable tip, quotable line, "most people think X but actually Y". YOU are saying these — not quoting someone.
    ],
    "thread": [
      // 8-10 tweet thread numbered 1/, 2/, etc. YOU are teaching a lesson. Tweet 1 = hook. Tweets 2-8 = build with specific details, numbers, steps. Tweet 9 = surprising takeaway. Tweet 10 = CTA.
    ]
  },
  "tiktok": {
    "scripts": [
      // 3 scripts. YOU are the creator teaching on camera/voiceover. Each script 150-200 words.
      // Format: Hook (1 sentence, stops scroll) → Body (120-170 words, YOU teaching 3-4 specific tips/steps with real details) → CTA (1 sentence)
      {
        "hook": "// 1 sentence under 15 words. YOU making a bold claim or calling out a mistake. Not about a video — about the TOPIC.",
        "body": "// 120-170 words. YOU teaching. 'Here's the thing. Most people do X. But that doesn't work because Y. What you actually need to do is Z. Step one... Step two... Step three... And the result? You get...' Use specific numbers, tools, methods. Short sentences. Confident. Direct.",
        "cta": "// 1 sentence. 'Follow for more' or 'Save this' or 'Comment if you want the full breakdown'.",
        "visualNotes": "// Scene-by-scene: '0-3s: [visual], text: [HOOK]. 3-15s: [visual], text: [key phrase]. 15-35s: [visual per tip]. 35-50s: [result visual]. 50-60s: [CTA on screen].'"
      }
    ]
  },
  "instagram": {
    "reels": [
      // 2 Reels scripts. YOU are the expert. Each 130-180 words. More polished than TikTok.
      {
        "hook": "// 1 sentence. YOU sharing insight: 'Here's what nobody tells you about X' or 'I tested X and here's what happened'.",
        "body": "// 100-150 words. Mini-lesson structure: 'Most people think X. Wrong. Here's what works. First... Second... Third... The result is...' Specific details. Confident tone.",
        "cta": "// 1 sentence. 'Save this for later' or 'Send to someone who needs this'.",
        "caption": "// 200-350 words. Instagram caption. YOU writing. Hook line. 2-3 paragraphs with insight. 'Key takeaways:' with 3-4 bullet points. Question to drive comments. 8-12 hashtags at end."
      }
    ]
  }
}`;
}

export function buildPromptBatch2(
  transcript: string,
  videoTitle: string,
  tone: string = "casual"
): string {
  return `${buildContext(transcript, videoTitle, tone, 8000)}

Generate VALID JSON. Present knowledge as YOUR OWN:

{
  "linkedin": "// 1500-2000 chars. Bold opening. 3-4 paragraphs with specific insights. Line breaks. End with question.",
  "newsletter": {
    "subjectLine": "// Under 50 chars. Curiosity gap.",
    "body": "// 400-600 words. Hook, 3 insights with details, key takeaways as bullets, one action step."
  }
}`;
}

export function buildPromptBatch3(
  transcript: string,
  videoTitle: string,
  tone: string = "casual"
): string {
  return `${buildContext(transcript, videoTitle, tone, 8000)}

Generate VALID JSON. Present knowledge as YOUR OWN:

{
  "blog": {
    "title": "// SEO title. 'How to...' or 'X Ways to...' format.",
    "outline": [
      // 8 specific section headings that reference actual content from the transcript.
    ],
    "intro": "// 200-300 words. Hook with bold claim. Why this matters. Preview what reader learns."
  },
  "quotes": [
    // 5 quotable insights. 1-2 sentences each. Specific substance. YOUR words.
  ]
}`;
}
