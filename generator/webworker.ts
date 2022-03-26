import path from "path";
import fs from "fs";
import { createHash } from "crypto";

const jekyllDirectoryPath = path.resolve(
  __dirname.replace("dist/", ""),
  "..",
  "docs"
);

const workerPath = path.resolve(jekyllDirectoryPath, "worker.js");

const headPath = path.resolve(
  jekyllDirectoryPath,
  "_includes",
  "head_custom.html"
);

async function computeMetaHash(
  folder: string,
  inputHash: null | ReturnType<typeof createHash> = null
) {
  const hash = inputHash ? inputHash : createHash("sha256");
  const info = fs.readdirSync(folder, { withFileTypes: true });
  // construct a string from the modification date, the filename and the filesize
  for (let item of info) {
    const fullPath = path.join(folder, item.name);
    if (item.isFile()) {
      const statInfo = await fs.statSync(fullPath);
      // compute hash string name:size:mtime
      const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
      hash.update(fileInfo);
    } else if (item.isDirectory()) {
      // recursively walk sub-folders
      await computeMetaHash(fullPath, hash);
    }
  }
  // if not being called recursively, get the digest and return it as the hash result
  if (!inputHash) {
    return hash.digest();
  }
}

const docsDirectoryPath = path.resolve(jekyllDirectoryPath, "_docs");
computeMetaHash(docsDirectoryPath).then(
  (hash) => {
    const headContent = `<script async defer>
    if ('serviceWorker' in navigator) {
        const registration = navigator.serviceWorker.register(
            '{{ "worker.js?version=${hash?.toString(
              "base64url"
            )}" | relative_url }}',
            {
                scope: '{{ "/" | relative_url }}',
            }
        ).then(function (registration) {
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        }).catch(function (error) {
            console.error("Registration failed with", error)
        });
    }
</script>`;

    fs.writeFileSync(headPath, headContent);
  },
  (err) => {
    console.warn(err);
    const headContent = `<script async defer>
    if ('serviceWorker' in navigator) {
        const registration = navigator.serviceWorker.register(
            '{{ "worker.js" | relative_url }}',
            {
                scope: '{{ "/" | relative_url }}',
            }
        ).then(function (registration) {
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        }).catch(function (error) {
            console.error("Registration failed with", error)
        });
    }
</script>`;

    fs.writeFileSync(headPath, headContent);
  }
);

const content = `---
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
`;

fs.writeFileSync(workerPath, content);
