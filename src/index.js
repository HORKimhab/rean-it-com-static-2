import indexHtml from "./index.html";
// import appJs from "./app.js";
import protectedApp from "./app.protected.js";
import youtubeSyncDataJs from "./youtube-sync-data.js";

const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=300",
};

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "public, max-age=300",
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function isDocumentRequest(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {}),
    },
  });
}

function parsePlaylistId(input) {
  if (!input) return "";

  try {
    const url = new URL(input);
    if (url.hostname.includes("youtube.com") || url.hostname === "youtu.be") {
      return url.searchParams.get("list") || "";
    }
  } catch {
    return input.trim();
  }

  return input.trim();
}

function isoDurationToClock(iso) {
  if (!iso) return "0:00";

  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);
  const total = hours * 3600 + minutes * 60 + seconds;

  if (hours > 0) {
    const hh = String(hours);
    const mm = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const ss = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

async function fetchYouTubeJson(url) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "YouTube API request failed.";
    throw new Error(message);
  }

  return data;
}

async function fetchPlaylistItems(playlistId, apiKey) {
  const items = [];
  let nextPageToken = "";

  do {
    const endpoint = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    endpoint.searchParams.set("part", "snippet,status,contentDetails");
    endpoint.searchParams.set("playlistId", playlistId);
    endpoint.searchParams.set("maxResults", "50");
    endpoint.searchParams.set("key", apiKey);
    if (nextPageToken) endpoint.searchParams.set("pageToken", nextPageToken);

    const payload = await fetchYouTubeJson(endpoint.toString());
    items.push(...(payload.items || []));
    nextPageToken = payload.nextPageToken || "";
  } while (nextPageToken);

  return items;
}

async function fetchVideoDurations(videoIds, apiKey) {
  const map = new Map();

  for (let index = 0; index < videoIds.length; index += 50) {
    const chunk = videoIds.slice(index, index + 50);
    const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
    endpoint.searchParams.set("part", "contentDetails,status");
    endpoint.searchParams.set("id", chunk.join(","));
    endpoint.searchParams.set("maxResults", "50");
    endpoint.searchParams.set("key", apiKey);

    const payload = await fetchYouTubeJson(endpoint.toString());
    for (const item of payload.items || []) {
      map.set(item.id, {
        durationText: isoDurationToClock(item.contentDetails?.duration),
        privacyStatus: item.status?.privacyStatus || "",
      });
    }
  }

  return map;
}

function normalisePlaylistItem(item, durationMap) {
  const snippet = item.snippet || {};
  const resourceId = snippet.resourceId || {};
  const videoId = resourceId.videoId || item.contentDetails?.videoId || "";
  const rawTitle = snippet.title || "Untitled video";
  const title = rawTitle === "Deleted video" ? "Unavailable video" : rawTitle;

  let status = "public";
  if (rawTitle === "Private video") status = "private";
  if (rawTitle === "Deleted video" || rawTitle === "Unavailable video") status = "unavailable";

  const durationMeta = videoId ? durationMap.get(videoId) : null;
  const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
  const statusNote =
    status === "private"
      ? "This playlist item is private. The URL is only useful for accounts that already have access."
      : status === "unavailable"
        ? "This playlist item is unavailable. Its position is preserved for course ordering."
        : watchUrl
          ? `Watch on YouTube: ${watchUrl}`
          : "No playable YouTube URL is available for this item.";

  return {
    position: Number.isFinite(snippet.position) ? snippet.position : 0,
    title,
    status,
    videoId,
    watchUrl,
    durationText: durationMeta?.durationText || "0:00",
    statusNote,
  };
}

async function handlePlaylistRequest(request, env) {
  const apiKey = env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return json(
      { error: "Missing YOUTUBE_API_KEY in the Worker environment." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const playlistId = parsePlaylistId(
    url.searchParams.get("playlistId") || url.searchParams.get("playlist") || "",
  );

  if (!playlistId) {
    return json({ error: "Missing playlistId query parameter." }, { status: 400 });
  }

  try {
    const playlistEndpoint = new URL("https://www.googleapis.com/youtube/v3/playlists");
    playlistEndpoint.searchParams.set("part", "snippet,contentDetails");
    playlistEndpoint.searchParams.set("id", playlistId);
    playlistEndpoint.searchParams.set("maxResults", "1");
    playlistEndpoint.searchParams.set("key", apiKey);

    const playlistPayload = await fetchYouTubeJson(playlistEndpoint.toString());
    const playlist = playlistPayload.items?.[0];

    if (!playlist) {
      return json({ error: "Playlist not found." }, { status: 404 });
    }

    const items = await fetchPlaylistItems(playlistId, apiKey);
    const videoIds = items
      .map((item) => item?.snippet?.resourceId?.videoId || item?.contentDetails?.videoId || "")
      .filter(Boolean);
    const durationMap = await fetchVideoDurations(videoIds, apiKey);

    return json({
      playlist: {
        id: playlist.id,
        title: playlist.snippet?.title || "Untitled playlist",
        description: playlist.snippet?.description || "",
        channelTitle: playlist.snippet?.channelTitle || "",
        itemCount: playlist.contentDetails?.itemCount || items.length,
      },
      items: items
        .map((item) => normalisePlaylistItem(item, durationMap))
        .sort((a, b) => a.position - b.position),
    });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Playlist import failed.",
      },
      { status: 502 },
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET, HEAD",
        },
      });
    }

    if (url.pathname === "/api/youtube/playlist") {
      if (request.method === "HEAD") {
        return new Response(null, { status: 200, headers: JSON_HEADERS });
      }
      return handlePlaylistRequest(request, env);
    }

    // if (url.pathname === "/app.js") {
    //   return new Response(request.method === "HEAD" ? null : appJs, {
    //     status: 200,
    //     headers: JS_HEADERS,
    //   });
    // }

    if (url.pathname === "/youtube-sync-data.js") {
      return new Response(request.method === "HEAD" ? null : youtubeSyncDataJs, {
        status: 200,
        headers: JS_HEADERS,
      });
    }

    if (url.pathname === "/app.protected.js") {
      return new Response(request.method === "HEAD" ? null : protectedApp, {
        status: 200,
        headers: JS_HEADERS,
      });
    }

    if (
      url.pathname === "/" ||
      url.pathname === "/index.html" ||
      isDocumentRequest(request)
    ) {
      return new Response(request.method === "HEAD" ? null : indexHtml, {
        status: 200,
        headers: HTML_HEADERS,
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "cache-control": "no-store",
      },
    });
  },
};
