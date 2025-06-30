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
        console.log('[ServiceWorker] Attempting to cache all specified files.');
        // Menggunakan Promise.allSettled untuk melihat status setiap URL
        // dan logging hasil untuk setiap upaya caching
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url)
            .then(() => {
              console.log(`[ServiceWorker] Successfully cached: ${url}`);
              return { status: 'fulfilled', value: url }; // Menandakan sukses
            })
            .catch(error => {
              console.error(`[ServiceWorker] Failed to cache: ${url} -`, error);
              return { status: 'rejected', reason: { url, error } }; // Menandakan gagal
            });
        });
        return Promise.allSettled(cachePromises); // Menunggu semua upaya caching selesai
      })
      .then(results => {
        // Setelah semua upaya selesai, cek apakah ada yang gagal
        const failed = results.filter(result => result.status === 'rejected');
        if (failed.length > 0) {
          console.error('[ServiceWorker] Some files failed to cache. Details:', failed);
          // Anda bisa memilih untuk tidak melempar error di sini jika ingin Service Worker tetap aktif
          // meskipun beberapa aset gagal di-cache.
        } else {
          console.log('[ServiceWorker] All specified files were successfully added to cache.');
        }
      })
      .catch(error => {
        console.error('[ServiceWorker] Overall caching process failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Log ini akan memberitahu kita apakah permintaan dilayani dari cache
      if (response) {
        console.log(`[ServiceWorker] Serving from cache: ${event.request.url}`);
        return response;
      }
      console.log(`[ServiceWorker] Fetching from network: ${event.request.url}`);
      return fetch(event.request);
    }).catch(error => {
      // Log error jika fetch dari jaringan juga gagal (saat offline)
      console.error(`[ServiceWorker] Fetch failed for ${event.request.url}:`, error);
      // Anda bisa menambahkan respons fallback offline page di sini
      // return caches.match('/offline.html');
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