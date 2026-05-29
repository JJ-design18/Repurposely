import { NextRequest, NextResponse } from "next/server";
import { extractVideoId, getTranscript } from "@/lib/youtube";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const { text, title } = await getTranscript(videoId);

    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: "Could not extract transcript. The video may not have captions." },
        { status: 400 }
      );
    }

    return NextResponse.json({ transcript: text, title, videoId });
  } catch (error) {
    console.error("Transcript error:", error);
    return NextResponse.json(
      { error: "Failed to extract transcript. Make sure the video has captions enabled." },
      { status: 500 }
    );
  }
}
