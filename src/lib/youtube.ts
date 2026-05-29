const INNERTUBE_API_URL =
  "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const ANDROID_VERSION = "20.10.38";
const ANDROID_UA = `com.google.android.youtube/${ANDROID_VERSION} (Linux; U; Android 14)`;
const IOS_UA = `com.google.ios.youtube/${ANDROID_VERSION} (iPhone16,2; U; CPU iOS 18_0 like Mac OS X)`;
const WEB_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    );
}

function parseCaptionXml(xml: string): string {
  const segments: string[] = [];

  // srv3 format
  const pRegex = /<p\s+t="\d+"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(xml)) !== null) {
    const text = decodeEntities(match[1].replace(/<[^>]+>/g, "")).trim();
    if (text) segments.push(text);
  }
  if (segments.length > 0) return segments.join(" ");

  // Classic format
  const classicRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  while ((match = classicRegex.exec(xml)) !== null) {
    const text = decodeEntities(match[1]).replace(/\n/g, " ").trim();
    if (text) segments.push(text);
  }
  return segments.join(" ");
}

// ── Supadata API (primary — works from any server) ──────────────────

async function fetchViaSupadata(videoId: string): Promise<string | null> {
  const apiKey = process.env.SUPADATA_API_KEY;
  if (!apiKey) {

    return null;
  }

  try {
    const res = await fetch(
      `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
      {
        cache: "no-store",
        headers: { "x-api-key": apiKey },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const text =
      typeof data.content === "string"
        ? data.content
        : Array.isArray(data.content)
          ? data.content.map((s: { text: string }) => s.text).join(" ")
          : null;

    return text && text.length > 50 ? text : null;
  } catch (e) {
    console.error("[SUPADATA] Error:", e);
    return null;
  }
}

// ── InnerTube API (fallback — works locally, blocked on most servers) ──

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
}

function pickEnglishTrack(tracks: CaptionTrack[]): CaptionTrack {
  return (
    tracks.find(
      (t) => t.languageCode === "en" || t.languageCode.startsWith("en")
    ) || tracks[0]
  );
}

async function fetchViaInnerTube(
  videoId: string,
  clientName: string,
  clientVersion: string,
  userAgent: string
): Promise<string | null> {
  try {
    const resp = await fetch(INNERTUBE_API_URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": userAgent,
      },
      body: JSON.stringify({
        context: { client: { clientName, clientVersion } },
        videoId,
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const tracks: CaptionTrack[] | undefined =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || tracks.length === 0) return null;

    const track = pickEnglishTrack(tracks);
    const xmlRes = await fetch(track.baseUrl, {
      cache: "no-store",
      headers: { "User-Agent": userAgent },
    });
    if (!xmlRes.ok) return null;
    const xml = await xmlRes.text();
    if (!xml || xml.length < 10) return null;
    const text = parseCaptionXml(xml);
    return text.length > 50 ? text : null;
  } catch {
    return null;
  }
}

// ── Main export ─────────────────────────────────────────────────────

export async function getTranscript(
  videoId: string
): Promise<{ text: string; title: string }> {

  // 1. Supadata (works from any server)
  // 2. ANDROID InnerTube (works locally)
  // 3. IOS InnerTube (works locally)
  const text =
    (await fetchViaSupadata(videoId)) ||
    (await fetchViaInnerTube(videoId, "ANDROID", ANDROID_VERSION, ANDROID_UA)) ||
    (await fetchViaInnerTube(videoId, "IOS", ANDROID_VERSION, IOS_UA));

  if (!text) {
    throw new Error(
      "Could not extract transcript. Make sure the video has captions enabled."
    );
  }


  // Fetch title
  let title = "Untitled Video";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data = await res.json();
      title = data.title;
    }
  } catch {
    // fallback
  }

  return { text, title };
}
