const CACHE_NAME = 'katalog-buku-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/app.webmanifest',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Tambahkan cover buku:
  '/images/laskar.jpg',
  '/images/sejarah.jpg',
  '/images/javascript.jpg',
  '/images/harrypotter.jpg',
  '/images/matematika.jpg',
  '/images/filsafat.jpg',
  '/images/alchemist.jpg',
  '/images/pemrograman.jpg',
  '/images/perang.jpg'
];

// Cache saat install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching files...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Ambil dari cache saat offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
