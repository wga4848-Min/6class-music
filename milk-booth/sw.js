/* 우유팩 부스 — 한 번 열면 인터넷 없이도 실행되도록 저장해 둠 */
const V = 'milk-booth-v1', FONTS = 'milk-booth-fonts';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-any-192.png', './icons/icon-any-512.png',
  './icons/icon-maskable-192.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    if (r.mode === 'navigate') {
      // 저장된 앱을 바로 열고, 인터넷이 되면 뒤에서 새 버전을 받아 둠(다음 실행부터 적용)
      e.respondWith(caches.open(V).then(c => c.match('./index.html').then(hit => {
        const net = fetch(r, { cache: 'no-cache' }).then(res => { if (res.ok) c.put('./index.html', res.clone()); return res; });
        if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
        return net;
      })));
      return;
    }
    e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r)));
    return;
  }
  if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(caches.open(FONTS).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; });
      if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
      return net;
    })));
  }
});
