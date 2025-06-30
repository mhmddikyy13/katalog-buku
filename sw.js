const CACHE_NAME = 'katalog-buku-cache-v2'; 

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/app.webmanifest',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install event in progress.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching all specified files.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Failed to cache files during install:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate event in progress.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});