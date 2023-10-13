// 定义要缓存的资源
const cacheName = 'my-pwa-cache-v1';
const cacheFiles = [
  '/',
  '/index.html',
  '/logo1.png',
  '/assets/*',
  '/static/*'
];

// 安装Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(cacheFiles);
    })
  );
});

// 拦截网络请求并从缓存中响应
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});