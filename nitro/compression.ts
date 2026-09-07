import { promisify } from "node:util";
import { brotliCompress, gzip, constants as zlibConstants } from "node:zlib";

import { definePlugin } from "nitro";

/*
 * Compression de la réponse HTML rendue à la volée (SSR).
 *
 * `compressPublicAssets` (voir vite.config.ts) ne couvre que les fichiers
 * statiques du dossier public. Le document HTML, lui, est généré à chaque
 * requête : sans ce plugin il part non compressé (~37 Kio → ~13 Kio en brotli),
 * ce que PageSpeed signale sous « latence de la demande de document ».
 *
 * On ne touche qu'aux réponses HTML : les server functions (JSON), les
 * redirections et les assets déjà encodés passent sans modification.
 */

const brotli = promisify(brotliCompress);
const gz = promisify(gzip);

const MIN_BYTES = 1024;

function pickEncoding(accept: string | null): "br" | "gzip" | null {
  if (!accept) return null;
  const value = accept.toLowerCase();
  if (value.includes("br")) return "br";
  if (value.includes("gzip")) return "gzip";
  return null;
}

async function compressHtmlResponses(
  event: { req: { method: string; headers: Headers } },
  next: () => Promise<unknown>,
): Promise<unknown> {
  const result = await next();

  if (!(result instanceof Response) || !result.body) return result;
  if (event.req.method !== "GET" && event.req.method !== "HEAD") return result;
  if (result.headers.has("Content-Encoding")) return result;

  const type = result.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) return result;

  const encoding = pickEncoding(event.req.headers.get("Accept-Encoding"));
  if (!encoding) return result;

  const body = new Uint8Array(await result.arrayBuffer());
  if (body.byteLength < MIN_BYTES) {
    return new Response(body, {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers,
    });
  }

  const compressed =
    encoding === "br"
      ? await brotli(body, {
          params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 },
        })
      : await gz(body, { level: 6 });

  const headers = new Headers(result.headers);
  headers.set("Content-Encoding", encoding);
  headers.set("Content-Length", String(compressed.byteLength));
  headers.append("Vary", "Accept-Encoding");
  headers.delete("ETag");

  return new Response(compressed, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}

export default definePlugin((nitroApp) => {
  // `nitroApp.h3.use()` n'existe pas dans cette version beta de Nitro : on
  // s'insère en tête de la file des middlewares globaux de H3.
  const h3 = nitroApp.h3 as unknown as { ["~middleware"]: unknown[] };
  h3["~middleware"].unshift(compressHtmlResponses);
});
