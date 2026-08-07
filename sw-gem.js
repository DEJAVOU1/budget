// Service Worker — Gem's Budget App
// Update CACHE_VERSION every time you upload a new Gems-budget.html
const CACHE_VERSION = 'v1';
const CACHE_NAME = 'gems-budget-' + CACHE_VERSION;
const APP_URL = '/budget/Gems-budget.html';

// Install: cache the app file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.add(APP_URL))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, but always revalidate in background
self.addEventListener('fetch', event => {
  if (!event.request.url.includes('Gems-budget.html')) {
    return; // only intercept the app file
  }
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        });
        return cached || fetchPromise;
      })
    )
  );
});
