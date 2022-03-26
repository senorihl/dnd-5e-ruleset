---
---
const cacheNameVersion = new URL(location).searchParams.get('version') || 'default';

const cacheableFiles = [
{{ "/" | relative_url | jsonify }},
{{ "/assets/js/search-data.json" | relative_url | jsonify }},
{% for document in site.docs %}{{ document.url | relative_url | jsonify }},
{% endfor %}
];

function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches
            .open(cacheNameVersion)
            .then(cache => Promise.all(cacheableFiles.map(f => cache.add(f).catch(e => null))))
            .then(self.skipWaiting)
            .catch(self.skipWaiting)
    );
});

self.addEventListener('activate', function (event) {
event.waitUntil(
    caches.keys().then(function (cacheNames) {
    return Promise.all(
        cacheNames
        .filter(function (cacheName) {
            return cacheNameVersion === cacheName;
        })
        .map(function (cacheName) {
            return caches.delete(cacheName);
        }),
    );
    }),
);
});

self.addEventListener('fetch', function (event) {
event.respondWith(
    caches.open(cacheNameVersion).then(function (cache) {
    return cache.match(event.request).then(function (response) {
        return (
        response ||
        fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
        })
        );
    });
    }),
);
});
