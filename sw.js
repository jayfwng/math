// 서비스 워커: 한 번 열어 본 화면은 인터넷이 없어도 열려요. (네트워크 우선 → 실패하면 저장본)
const CACHE = 'math-v2';
const CORE = ['./', 'index.html', 'css/style.css', 'js/app.js', 'js/engine.js', 'js/store.js', 'js/tex.js', 'js/rng.js', 'js/lib.js', 'js/fig.js', 'content/index.js', 'content/map.js', 'content/m1-a.js', 'content/m1-b.js', 'content/m1-c.js', 'content/m1-d.js', 'content/m2-a.js', 'content/m2-b.js', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => { })).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
  );
});
