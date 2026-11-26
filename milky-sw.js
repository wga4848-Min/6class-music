/* MILKY UP 부스 예약 앱 서비스 워커 (milky-booth.html과 같은 폴더)
   - 관리자 태블릿에 '앱'으로 설치될 수 있게 함
   - 차례 알림을 알림창으로 띄움
   캐시는 하지 않음: 실시간 예약 앱이라 항상 최신 화면·데이터를 받음 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return; // Firebase 등 외부 요청은 건드리지 않음
  e.respondWith(fetch(r));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.includes("milky-booth") && "focus" in c) return c.focus();
    return self.clients.openWindow("./milky-booth.html");
  }));
});
