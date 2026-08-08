const CACHE_NAME = "ot-cache-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log("OT App: caching application files");

                return cache.addAll(APP_FILES);

            })

    );

    // Activate the new service worker immediately
    self.skipWaiting();

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))

            );

        })

    );

    // Take control of open pages immediately
    self.clients.claim();

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                // Use cached file if available
                if (cachedResponse) {

                    return cachedResponse;

                }

                // Otherwise request from server
                return fetch(event.request);

            })

    );

});