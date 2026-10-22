/* Service Worker HEADQUARTERS — shell offline sederhana.
   - Precache seluruh aset halaman (satu file HTML + font + ikon)
   - Navigasi: network-first berbatas waktu, fallback cache saat offline
   - Aset lain same-origin: stale-while-revalidate
   - Link keluar ke tools (origin lain) tidak disentuh

   PRINSIP: cache boleh gagal, halaman tidak. Di mode penyamaran, saat kuota
   penuh, atau saat penyimpanan diblokir kebijakan, caches.open() dan
   caches.match() sama-sama bisa MENOLAK. Dulu penolakan itu merambat ke
   respondWith() — artinya halaman atau app.js gagal dimuat sama sekali, bukan
   sekadar kehilangan kemampuan offline. Semua sentuhan cache di bawah ini
   dibungkus supaya kegagalannya selalu turun ke jaringan biasa. */
const VERSION = 'v1.95.0';
const CACHE = `hq-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './vendor/fonts.css',
  './vendor/fonts/share-tech-mono-400-latin.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

/* --- pembungkus aman: tak satu pun boleh melempar ke pemanggilnya --- */
const safeCache = () => caches.open(CACHE).catch(() => null);
const safeMatch = (cache, req, opts) => {
  if (!cache) return Promise.resolve(undefined);
  try { return cache.match(req, opts).catch(() => undefined); }
  catch (e) { return Promise.resolve(undefined); }
};
const safePut = (cache, req, res) => {
  if (!cache) return;
  try { cache.put(req, res).catch(() => {}); } catch (e) {}
};

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    try {
      const c = await caches.open(CACHE);
      /* Dicache SATU PER SATU, bukan addAll: dengan addAll satu aset yang gagal
         membatalkan SELURUH precache dan service worker tak pernah aktif — jadi
         satu berkas hilang diam-diam mematikan kemampuan offline seluruhnya. */
      await Promise.all(ASSETS.map((u) =>
        c.add(new Request(u, { cache: 'no-cache' })).catch(() => {})));
    } catch (e) { /* penyimpanan ditolak → jalan tanpa precache */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE)
        .map((k) => caches.delete(k).catch(() => {})));
    } catch (e) {}
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await safeCache();
      // Jaringan tetap diutamakan, TAPI dibatasi waktu: di sinyal buruk halaman
      // tidak boleh menggantung padahal salinan cache yang sehat sudah ada.
      const net = fetch(req.url, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok) safePut(cache, './index.html', res.clone());
        return res;
      });
      net.catch(() => {});            // cegah unhandledrejection saat kita memilih cache
      const TIMEOUT = 3000;
      try {
        return await Promise.race([
          net,
          new Promise((_, rej) => setTimeout(() => rej(new Error('slow-network')), TIMEOUT)),
        ]);
      } catch (err) {
        const hit = (await safeMatch(cache, './index.html', { ignoreSearch: true }))
                 || (await safeMatch(cache, './'));
        return hit || net;            // tanpa cache → tetap tunggu jaringan apa adanya
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await safeCache();
    const cached = await safeMatch(cache, req);
    if (cached) {
      fetch(req).then((res) => {      // perbarui diam-diam di belakang layar
        if (res && res.ok) safePut(cache, req, res.clone());
      }).catch(() => {});
      return cached;
    }
    const res = await fetch(req);     // tanpa salinan → jaringan apa adanya
    if (res && res.ok) safePut(cache, req, res.clone());
    return res;
  })());
});
