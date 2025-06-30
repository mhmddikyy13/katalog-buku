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

const googleFontsUrls = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install event in progress.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Attempting to cache all specified LOCAL files.');
        const localCachePromises = urlsToCache.map(url => {
          return cache.add(url)
            .then(() => {
              console.log(`[ServiceWorker] Successfully cached local: ${url}`);
              return { status: 'fulfilled', value: url };
            })
            .catch(error => {
              console.error(`[ServiceWorker] Failed to cache local: ${url} -`, error);
              return { status: 'rejected', reason: { url, error } };
            });
        });

        return Promise.allSettled(localCachePromises);
      })
      .then(localResults => {
        const failedLocal = localResults.filter(result => result.status === 'rejected');
        if (failedLocal.length > 0) {
          console.error('[ServiceWorker] Some LOCAL files failed to cache. Details:', failedLocal);
        } else {
          console.log('[ServiceWorker] All specified LOCAL files were successfully added to cache.');
        }

        console.log('[ServiceWorker] Attempting to cache Google Fonts (cross-origin).');
        return Promise.allSettled(
            googleFontsUrls.map(url => {
                return caches.open(CACHE_NAME).then(cache => {
                    return fetch(url).then(response => {
                        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                        return cache.put(url, response.clone()).then(() => {
                            console.log(`[ServiceWorker] Successfully cached Google Font: ${url}`);
                            return { status: 'fulfilled', value: url };
                        });
                    });
                }).catch(error => {
                    console.error(`[ServiceWorker] Failed to cache Google Font: ${url} -`, error);
                    return { status: 'rejected', reason: { url, error } };
                });
            })
        );
      })
      .then(fontResults => {
          const failedFonts = fontResults.filter(result => result.status === 'rejected');
          if (failedFonts.length > 0) {
              console.error('[ServiceWorker] Some Google Fonts failed to cache. Details:', failedFonts);
          } else {
              console.log('[ServiceWorker] All specified Google Fonts were successfully added to cache.');
          }
      })
      .catch(error => {
        console.error('[ServiceWorker] Overall installation process failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log(`[ServiceWorker] Serving from cache: ${event.request.url}`);
        return response;
      }
      console.log(`[ServiceWorker] Fetching from network: ${event.request.url}`);
      return fetch(event.request).catch(error => {
        console.error(`[ServiceWorker] Fetch failed for ${event.request.url}:`, error);
        throw error;
      });
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