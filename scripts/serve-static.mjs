import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.PORT ?? 3100);
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }

  const candidates = pathname === "/"
    ? [join(root, "index.html")]
    : [target, `${target}.html`, join(target, "index.html")];
  for (const candidate of candidates) {
    try {
      if (!(await stat(candidate)).isFile()) continue;
      const body = await readFile(candidate);
      const ext = extname(candidate);
      const type = candidate.includes("opengraph-image-") ? "image/png" : (types[ext] ?? "application/octet-stream");
      response.writeHead(200, {
        "content-type": `${type}${[".html", ".css", ".js", ".json", ".txt"].includes(ext) ? "; charset=utf-8" : ""}`,
      });
      response.end(body);
      return;
    } catch {
      // Try the next static-export path.
    }
  }

  response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
  response.end(await readFile(join(root, "404.html")));
}).listen(port, () => console.log(`Static export at http://localhost:${port}`));
