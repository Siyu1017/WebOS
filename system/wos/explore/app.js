(async function () {
    var explore_datas = {
        executing_apps: [],
    }
    var delay = (delayInms) => { return new Promise(resolve => setTimeout(resolve, delayInms)); };
    var System = {};

    /*
    System.loadApp = function (app) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = "./system/wos/" + app + ".js";
            document.head.appendChild(script);
            script.onload = () => {
                resolve(true);
            };
        });
    }
    */

    System.loadApp = async function (curr = 0, arr, callback = function () { }) {
        var script = document.createElement("script");
        script.src = "./system/wos/" + arr[curr] + ".js";
        document.head.appendChild(script);
        script.onload = () => {
            if (curr == arr.length - 1) {
                return callback();
            }
            System.loadApp(curr + 1, arr);
        }
    }

    System.showStartLoading = () => {
        $("#loading").classList.add("active");
    }

    System.hideStartLoading = () => {
        $("#loading").classList.remove("active");
    }

    System.loadSystemApps = (apps, callback) => {
        System.loadApp(0, apps, callback)
    }
    window.onload = async () => {
        var explore = new App(null, null, {
            showinbar: false,
            toolbar: false,
            show: false
        })
        explore.execute("Test");

        $(".window-tool-bar").addEventListener('wheel', function (event) {
            var delta = event.deltaY || event.detail || event.wheelDelta;
            if (delta < 0) {
                $(".window-tool-bar-applications").scrollTo({
                    behavior: "smooth",
                    left: $(".window-tool-bar-applications").scrollLeft - 300
                })
            } else {
                $(".window-tool-bar-applications").scrollTo({
                    behavior: "smooth",
                    left: $(".window-tool-bar-applications").scrollLeft + 300
                })
            }
            event.preventDefault();
        });

        window.oncontextmenu = () => { return false; };

        document.onclick = () => {
            $(".window-contextmenu").classList.remove("window-contextmenu-show");
        }

        window.onerror = (message) => {
            new App("ERROR" + Date.now(), null, {
                x: window.innerWidth / 2 - 120,
                y: (window.innerHeight - 45) / 2 - 60,
                width: 240,
                height: 120,
                movable: false,
                minimizable: false,
                fullscreenable: false,
                title: "Error",
                icon: "./error.png"
            }).execute('<div style="height: calc(100% - 36px);width: calc(100% - 24px);display: flex;justify-content: center;align-items: center;padding: 18px 12px;user-select: none;-webkit-user-drag: none;"><img src="./error.png" style="width: 36px;height: 36px;margin-right: 6px;-webkit-user-drag: none;"><span style="overflow: hidden;max-height: 4rem;-webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;text-overflow: ellipsis;white-space: normal;word-wrap: break-word;">' + message + "</span></div>");
        }

        function imgLoad(url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = 'blob';
                request.onload = function () {
                    if (request.status === 200) {
                        resolve(request.response);
                    } else {
                        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
                    }
                };
                request.onerror = function () {
                    reject(Error('There was a network error.'));
                };
                request.send();
            });
        }
        imgLoad("./application.png")

        await System.loadApp(0, ["pkgmgr/app", "time/app", "gotodesktop/app"]);
        (async (status) => {
            await delay(500)
            System.hideStartLoading();
        })()
    }

    window.System = System;
})()