var config = {
    cacheName: "webos",
    root: location.host,
    dir: location.pathname.replace("/sw.js", "").slice(location.pathname.split("/")[location.pathname.split("/").length - 1]),
    based_assets: [
        "./",
        "./index.html",
        "./reps.css",
        "./loading.css",
        "./application.css",
        "./system/wos/time/app.css",
        "./util.js",
        "./application.js",
        "./favicon.ico",
        "./manifest.json",
        "./sw.js",
        "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js"
    ]
};

this.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(config.cacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(config.based_assets);
        })
    );
});

function update() {
    caches.keys().then(keys => {
        if (keys.includes(config.cacheName)) {
            caches.open(config.cacheName).then(cc => {
                cc.keys().then(key => {
                    key.forEach(f => {
                        return cc.delete(f);
                    });
                });
            });
            /*
            return Promise.all(keys
                .filter(key => key !== config.cacheName)
                .map(key => caches.delete(key))
            );
            */
        }
    });
}


this.addEventListener('message', function (e) {
    if (e.data.action == 'update') {
        update();
    }
});
this.addEventListener('activate', update);

this.addEventListener('fetch', e => {
    if (!/^https?:$/.test(new URL(e.request.url).protocol)) return;
    e.respondWith(
        caches.match(e.request).then(res => {
            if (e.request.url.indexOf(config.root + config.dir) == -1) {
                console.log(e.request.url, config.root + config.dir)
                return fetch(e.request);
            }
            return res ||
                fetch(e.request)
                    .then(responese => {
                        const responeseClone = responese.clone();
                        caches.open(config.cacheName).then(cache => {
                            // console.log('Installing data', responeseClone.url);
                            cache.put(e.request, responeseClone);
                        })
                        return responese;
                    })
                    .catch(err => {
                        console.log(err);
                    });
        })
    )
});