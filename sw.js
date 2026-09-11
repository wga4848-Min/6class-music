/* 경주월드 체크인 - 최소 서비스 워커
   역할: 캐싱은 하지 않습니다. 실시간 체크인 앱이라 항상 최신 버전 +
   최신 데이터를 받는 게 더 중요하기 때문입니다.
   존재 이유는 단 하나 - 크롬이 "진짜 앱"으로 설치(홈 화면 아이콘,
   주소창 없는 실행)를 허용하려면 fetch 이벤트를 처리하는 서비스
   워커가 있어야 한다는 조건을 충족시키기 위함입니다. */

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => {
  // 아무것도 가로채지 않고 항상 네트워크로 그대로 통과시킵니다.
  e.respondWith(fetch(e.request));
});
