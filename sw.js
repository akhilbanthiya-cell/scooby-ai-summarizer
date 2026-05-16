const CACHE = 'scooby-v12';
const ASSETS = [
  './index.html',
  './live-transcript.html',
  './manifest.json',
  './scooby-icon.png',
  './scooby-icon-full.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  /* Network-first for API calls, cache-first for app shell */
  if (e.request.url.includes('api.mistral.ai') ||
      e.request.url.includes('api.openai.com') ||
      e.request.url.includes('api.groq.com') ||
      e.request.url.includes('generativelanguage.googleapis.com') ||
      e.request.url.includes('api.anthropic.com') ||
      e.request.url.includes('api.cohere.ai') ||
      e.request.url.includes('esm.sh')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
