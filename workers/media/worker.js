// Cloudflare Worker "bi-media": serves the site's media from the bi-media R2 bucket.
// Binding: MEDIA -> R2 bucket bi-media. Only keys under m/ are public; originals/ stays private as a backup.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, ETag, Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { ...CORS, Allow: 'GET, HEAD, OPTIONS' } });
    }

    const key = decodeURIComponent(new URL(request.url).pathname.slice(1));
    if (!key.startsWith('m/') || key.includes('..')) return new Response('Not found', { status: 404, headers: CORS });

    const wantsRange = request.headers.has('Range');
    const object =
      request.method === 'HEAD'
        ? await env.MEDIA.head(key)
        : await env.MEDIA.get(key, { range: wantsRange ? request.headers : undefined, onlyIf: request.headers });
    if (!object) return new Response('Not found', { status: 404, headers: CORS });

    const headers = new Headers(CORS);
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');

    if (request.method === 'HEAD') {
      headers.set('Content-Length', String(object.size));
      return new Response(null, { status: 200, headers });
    }
    // A failed If-None-Match / If-Modified-Since precondition returns metadata without a body
    if (!('body' in object)) return new Response(null, { status: 304, headers });

    if (wantsRange && object.range) {
      // R2 reports either { offset, length } or { suffix }; unused fields may be present but undefined
      const r = object.range;
      const start = r.suffix !== undefined ? object.size - r.suffix : (r.offset ?? 0);
      const length = r.suffix !== undefined ? r.suffix : (r.length ?? object.size - start);
      headers.set('Content-Range', `bytes ${start}-${start + length - 1}/${object.size}`);
      headers.set('Content-Length', String(length));
      return new Response(object.body, { status: 206, headers });
    }
    headers.set('Content-Length', String(object.size));
    return new Response(object.body, { status: 200, headers });
  },
};
