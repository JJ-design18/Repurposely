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

  // srv3 format: <p t="ms" d="ms">...<s>word</s>...</p>
  const pRegex = /<p\s+t="\d+"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(xml)) !== null) {
    const text = decodeEntities(match[1].replace(/<[^>]+>/g, "")).trim();
    if (text) segments.push(text);
  }
  if (segments.length > 0) return segments.join(" ");

  // Classic format: <text start="s" dur="s">content</text>
  const classicRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  while ((match = classicRegex.exec(xml)) !== null) {
    const text = decodeEntities(match[1]).replace(/\n/g, " ").trim();
    if (text) segments.push(text);
  }
  return segments.join(" ");
}

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

async function fetchCaptionText(
  track: CaptionTrack,
  userAgent: string
): Promise<string | null> {
  try {
    const res = await fetch(track.baseUrl, {
      cache: "no-store",
      headers: { "User-Agent": userAgent },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    if (!xml || xml.length < 10) return null;
    const text = parseCaptionXml(xml);
    return text.length > 50 ? text : null;
  } catch {
    return null;
  }
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
    return await fetchCaptionText(track, userAgent);
  } catch {
    return null;
  }
}

async function fetchViaWebPage(videoId: string): Promise<string | null> {
  try {
    const pageRes = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        cache: "no-store",
        headers: {
          "User-Agent": WEB_UA,
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );
    const html = await pageRes.text();

    const startToken = "var ytInitialPlayerResponse = ";
    const startIndex = html.indexOf(startToken);
    if (startIndex === -1) return null;

    const jsonStart = startIndex + startToken.length;
    let depth = 0;
    let jsonEnd = jsonStart;
    for (let i = jsonStart; i < html.length; i++) {
      if (html[i] === "{") depth++;
      else if (html[i] === "}") {
        depth--;
        if (depth === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    const player = JSON.parse(html.slice(jsonStart, jsonEnd));
    const tracks: CaptionTrack[] | undefined =
      player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || tracks.length === 0) return null;

    const track = pickEnglishTrack(tracks);
    return await fetchCaptionText(track, WEB_UA);
  } catch {
    return null;
  }
}

export async function getTranscript(
  videoId: string
): Promise<{ text: string; title: string }> {
  // Try multiple methods in order — first success wins
  const text =
    (await fetchViaInnerTube(videoId, "ANDROID", ANDROID_VERSION, ANDROID_UA)) ||
    (await fetchViaInnerTube(videoId, "IOS", ANDROID_VERSION, IOS_UA)) ||
    (await fetchViaWebPage(videoId));

  if (!text) {
    throw new Error(
      "Could not extract transcript. The video may not have captions or may be restricted."
    );
  }

  // Fetch title via oEmbed
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
