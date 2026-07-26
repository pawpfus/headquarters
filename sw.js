/* Service Worker HEADQUARTERS — shell offline sederhana.
   - Precache seluruh aset halaman (satu file HTML + font + ikon)
   - Navigasi: network-first, fallback cache saat offline
   - Aset lain same-origin: stale-while-revalidate
   - Link keluar ke tools (origin lain) tidak disentuh */
const VERSION = 'v1.22.0';
const CACHE = `hq-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/fonts.css',
  './vendor/fonts/share-tech-mono-400-latin.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'no-cache' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(req.url, { cache: 'no-cache' });
        if (res.ok) cache.put('./index.html', res.clone());
        return res;
      } catch (err) {
        const hit = await cache.match('./index.html', { ignoreSearch: true });
        return hit || cache.match('./');
      }
    })());
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
