import indexHtml from "./index.html";
import protectedApp from "./app.protected.js";

const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=300",
};

const JS_HEADERS = {
  "content-type": "application/javascript; charset=utf-8",
  "cache-control": "public, max-age=300",
};

function isDocumentRequest(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET, HEAD",
        },
      });
    }

    // Serve the app shell for the homepage, index.html, and client-side routes.
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

    if (url.pathname === "/app.protected.js") {
      return new Response(request.method === "HEAD" ? null : protectedApp, {
        status: 200,
        headers: JS_HEADERS,
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
