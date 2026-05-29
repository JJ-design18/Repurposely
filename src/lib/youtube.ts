const INNERTUBE_API_URL = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const INNERTUBE_CLIENT_VERSION = "20.10.38";
const INNERTUBE_USER_AGENT = `com.google.android.youtube/${INNERTUBE_CLIENT_VERSION} (Linux; U; Android 14)`;
const WEB_USER_AGENT =
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

  // Try srv3 format first: <p t="ms" d="ms">...<s>word</s>...</p>
  const pRegex = /<p\s+t="\d+"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(xml)) !== null) {
    let text = match[1].replace(/<[^>]+>/g, "");
    text = decodeEntities(text).trim();
    if (text) segments.push(text);
  }

  if (segments.length > 0) return segments.join(" ");

  // Fall back to classic format: <text start="s" dur="s">content</text>
  const classicRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  while ((match = classicRegex.exec(xml)) !== null) {
    let text = decodeEntities(match[1]).replace(/\n/g, " ").trim();
    if (text) segments.push(text);
  }

  return segments.join(" ");
}

async function fetchViaInnerTube(
  videoId: string
): Promise<{ text: string; captionUrl: string } | null> {
  try {
    const resp = await fetch(INNERTUBE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": INNERTUBE_USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "ANDROID",
            clientVersion: INNERTUBE_CLIENT_VERSION,
          },
        },
        videoId,
      }),
    });

    if (!resp.ok) return null;
    const data = await resp.json();
    const tracks =
      data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || tracks.length === 0) return null;

    // Prefer English
    const englishTrack = tracks.find(
      (t: { languageCode: string }) =>
        t.languageCode === "en" || t.languageCode.startsWith("en")
    );
    const track = englishTrack || tracks[0];

    const xmlRes = await fetch(track.baseUrl, {
      headers: { "User-Agent": INNERTUBE_USER_AGENT },
    });
    if (!xmlRes.ok) return null;
    const xml = await xmlRes.text();
    if (!xml || xml.length < 10) return null;

    const text = parseCaptionXml(xml);
    return text.length > 50 ? { text, captionUrl: track.baseUrl } : null;
  } catch {
    return null;
  }
}

async function fetchViaWebPage(
  videoId: string
): Promise<{ text: string } | null> {
  try {
    const pageRes = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: {
          "User-Agent": WEB_USER_AGENT,
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );
    const html = await pageRes.text();

    // Parse player response using brace counting (more reliable than regex)
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
    const tracks =
      player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || tracks.length === 0) return null;

    const englishTrack = tracks.find(
      (t: { languageCode: string }) =>
        t.languageCode === "en" || t.languageCode.startsWith("en")
    );
    const track = englishTrack || tracks[0];

    const xmlRes = await fetch(track.baseUrl, {
      headers: { "User-Agent": WEB_USER_AGENT },
    });
    if (!xmlRes.ok) return null;
    const xml = await xmlRes.text();
    if (!xml || xml.length < 10) return null;

    const text = parseCaptionXml(xml);
    return text.length > 50 ? { text } : null;
  } catch {
    return null;
  }
}

export async function getTranscript(
  videoId: string
): Promise<{ text: string; title: string }> {
  // Try InnerTube API first (most reliable, uses Android client)
  const innerTubeResult = await fetchViaInnerTube(videoId);

  // Fall back to web page scraping
  const result = innerTubeResult || (await fetchViaWebPage(videoId));

  if (!result) {
    throw new Error(
      "Could not extract transcript. The video may not have captions or may be restricted."
    );
  }

  // Fetch title via oEmbed
  let title = "Untitled Video";
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (res.ok) {
      const data = await res.json();
      title = data.title;
    }
  } catch {
    // fallback title
  }

  return { text: result.text, title };
}
