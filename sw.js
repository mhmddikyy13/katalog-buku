self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', function(event) {
  // bisa diisi cache jika mau
});
