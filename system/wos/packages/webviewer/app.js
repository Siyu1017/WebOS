(function () {
    var yt = new App(null, "", {
        width: 420,
        height: 300,
        y: 75,
        x: 120,
        title: "Web Viewer",
        icon: "./system/wos/browser/browser.png",
        showloading: true,
        backgroundColor: "rgb(255, 255, 255)"
    });
    var browseWindow = yt.execute(`<div class="yt-dler"><iframe class="frame" data-id="frame"></iframe><div class="toolbar"><div class="back disabled" data-id="back"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
  </div><div class="forward disabled" data-id="forward"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>
</div><div class="refresh" data-id="refresh"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
<path d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
<path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg></div><div class="path"><input type="text" data-id="path" autocomplete="off" value="/"></div><div class="status notify-icon" data-id="status"></div></div></div>`);

    (() => {
        var frame = browseWindow.elements.window.querySelector('[data-id="frame"]');
        var back = browseWindow.elements.window.querySelector('[data-id="back"]');
        var forward = browseWindow.elements.window.querySelector('[data-id="forward"]');
        var refresh = browseWindow.elements.window.querySelector('[data-id="refresh"]');
        var path = browseWindow.elements.window.querySelector('[data-id="path"]');
        var status = browseWindow.elements.window.querySelector('[data-id="status"]');

        var icons = {
            done: `<svg class="notify-done" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="notify-circle" cx="26" cy="26" r="25" fill="none" /><path class="notify-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>`,
            error: `<svg class="notify-error" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="notify-circle" cx="26" cy="26" r="25" fill="none" /><path class="notify-line" fill="none" d="M17.36,34.736l17.368-17.472" /><path class="notify-line" fill="none" d="M34.78,34.684L17.309,17.316" /></svg>`,
            loading: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" class="notify-loading notify-loading-spinner"></svg>`
        }

        function loadPage() {
            refresh.classList.add("disabled");
            status.innerHTML = icons["loading"];
            if (currentHistory == history.length - 1) {
                forward.classList.add("disabled");
            } else {
                forward.classList.remove("disabled");
            }
            if (currentHistory == 0) {
                back.classList.add("disabled");
            } else {
                back.classList.remove("disabled");
            }
            fetch(history[currentHistory]).then(res => {
                return res.text();
            }).then(res => {
                var title = history[currentHistory];
                var icon = "https://yt-dler.vercel.app/favicon.ico";
                if (res.match(/<title>.*<\/title>/gi)) {
                    title = res.match(/<title>.*<\/title>/gi)[0].replaceAll(/<.?title>/gi, "");
                }
                /*if (res.match(/<link.*rel=('|").*icon.*('|")>/gi)) {
                    icon = "https://yt-dler.vercel.app" + res.match(/<link.*rel=('|").*icon.*('|")>/gi)[0].match(/href=('|").*('|")/gi)[0].replace("href=", "").replaceAll(/('|")/gi, "");
                }*/
                browseWindow.changeTitle(title);
                // browseWindow.changeIcon(icon);
                // console.log(title, icon)
            }).catch(err => {
                console.log(err);
                browseWindow.changeTitle(history[currentHistory]);
            })
            path.value = history[currentHistory];
            frame.src = history[currentHistory];
            frame.onload = () => {
                refresh.classList.remove("disabled");
                status.innerHTML = icons["done"];
            }
            frame.onerror = () => {
                refresh.classList.remove("disabled");
                status.innerHTML = icons["error"];
            }
        }

        var history = ["/"];
        var currentHistory = 0;

        refresh.addEventListener("click", () => {
            loadPage();
        });

        back.addEventListener("click", () => {
            if (currentHistory <= 1) {
                back.classList.add("disabled");
            }
            currentHistory = currentHistory - 1;
            loadPage();
        });

        forward.addEventListener("click", () => {
            if (currentHistory >= history.length - 2) {
                forward.classList.add("disabled");
            }
            currentHistory = currentHistory + 1;
            loadPage();
        });

        path.addEventListener("keypress", (e) => {
            if (e.keyCode == 13) {
                if (path.value == history[currentHistory]) {
                    return loadPage();
                }
                history.splice(currentHistory + 1);
                history.push(path.value);
                console.log(history, path.value);
                currentHistory++;
                loadPage();
            }
        })

        loadPage();

        window.webViewer = {
            open: (url) => {
                history.splice(currentHistory + 1);
                history.push(url);
                console.log(history, url);
                currentHistory++;
                loadPage();
            },
            close: () => {
                yt.close();
            }
        }
    })();

    yt.loadStyles("./system/wos/packages/yt-dler/app.css", "url", () => {
        yt.hideLoading();
    });
})()