function randomPosition(app) {
    app.style.left = `${getPosition(app).x + Math.random() * 10 * (Math.random() > 0.5 ? -1 : 1)}px`;
    app.style.top = `${getPosition(app).y + Math.random() * 10 * (Math.random() > 0.5 ? -1 : 1)}px`;
}

document.querySelectorAll(".window-frame-application").forEach(app => {
    app.addEventListener("mouseenter", () => {
        randomPosition(app)
    })

    app.addEventListener("mousemove", () => {
        randomPosition(app)
    })
})

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
        if (!obj || obj.nodeType !== 1) return;

        if (MutationObserver) {
            // define a new observer
            var mutationObserver = new MutationObserver(callback)

            // have the observer observe for changes in children
            mutationObserver.observe(obj, { childList: true, subtree: true })
            return mutationObserver
        }

        // browser support fallback
        else if (window.addEventListener) {
            obj.addEventListener('DOMNodeInserted', callback, false)
            obj.addEventListener('DOMNodeRemoved', callback, false)
        }
    }
})();


observeDOM(document.querySelector(".window-frame"), () => {
    document.querySelectorAll(".window-frame-application").forEach(app => {
        app.addEventListener("mouseenter", () => {
            randomPosition(app)
        })
    
        app.addEventListener("mousemove", () => {
            randomPosition(app)
        })
    })
})

