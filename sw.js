/**
 * Sai Bazaar - Service Worker
 * Manages static asset caching for offline support and speed.
 */

const CACHE_NAME = "saibazaar-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./shop.html",
  "./checkout.html",
  "./contact.html",
  "./admin.html",
  "./css/style.css",
  "./js/app.js",
  "./js/home.js",
  "./js/shop.js",
  "./js/checkout.js",
  "./js/contact.js",
  "./js/admin.js",
  "./assets/owner.jpg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all static assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheKeys) => {
      return Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // Avoid caching non-GET requests or external API/maps requests
  if (event.request.method !== "GET" || event.request.url.includes("google.com/maps")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic assets if they are valid responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
