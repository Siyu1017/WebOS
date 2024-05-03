(async function () {
    const mode = ".";

    var explore_datas = {
        executing_apps: [],
    }
    var delay = (delayInms) => { return new Promise(resolve => setTimeout(resolve, delayInms)); };
    var System = {};

    window.webos = {};

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
            System.loadApp(curr + 1, arr, callback);
        }
    }

    System.showStartLoading = () => {
        $("#loading").classList.add("active");
    }

    System.hideStartLoading = () => {
        $("#loading").classList.remove("active");
    }

    System.loadSystemApps = (apps, callback = function () { }) => {
        var loaded = 0;
        System.loadApp(0, apps, () => {
            loaded++;
            if (loaded == apps.length) {
                callback();
            }
        })
    }

    window.onload = async () => {
        var explore = new App(null, null, {
            showinbar: false,
            toolbar: false,
            show: false
        })
        explore.execute("Test");

        $(".window-taskbar").addEventListener('wheel', function (event) {
            var delta = event.deltaY || event.detail || event.wheelDelta;
            if (delta < 0) {
                $(".window-taskbar-applications").scrollTo({
                    behavior: "smooth",
                    left: $(".window-taskbar-applications").scrollLeft - 300
                })
            } else {
                $(".window-taskbar-applications").scrollTo({
                    behavior: "smooth",
                    left: $(".window-taskbar-applications").scrollLeft + 300
                })
            }
            event.preventDefault();
        });

        window.oncontextmenu = () => { return false; };

        document.onclick = () => {
            $(".window-contextmenu").classList.remove("window-contextmenu-show");
        }

        window.onerror = (message) => {
            var notification = os.notification.create("./error.png", "Error", message);

            console.log(notification);
            
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

        await System.loadApp(0, ["fs/app", "pkgmgr/app", "time/app", "gotodesktop/app"], async () => {
            if (getJsonFromUrl().command) {
                window._cmdcallback = (api) => {
                    var lines = getJsonFromUrl().command;
                    lines.split('\\n').forEach(line => {
                        api.runCommand(line);
                    })
                };
                await System.loadSystemApps(["packages/cmd/app"], () => {
                    window._cmdcallback = undefined;
                });
            }
        });

        (async (status) => {
            await delay(500);
            System.hideStartLoading();
            await delay(1000);
            var notification = os.notification.create("./application.png", "Explore", "Initialization completed!");
        })();

        function openFullscreen() {
            var elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }

        document.querySelector('[data-action="explore:enable-fullscreen"]').addEventListener("click", (e) => {
            try {
                openFullscreen();
                document.querySelector(".window-alert-container").classList.add("hide");
            } catch (e) {
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
                }).execute('<div style="height: calc(100% - 36px);width: calc(100% - 24px);display: flex;justify-content: center;align-items: center;padding: 18px 12px;user-select: none;-webkit-user-drag: none;"><img src="./error.png" style="width: 36px;height: 36px;margin-right: 6px;-webkit-user-drag: none;"><span style="overflow: hidden;max-height: 4rem;-webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;text-overflow: ellipsis;white-space: normal;word-wrap: break-word;">' + e.message + "</span></div>");
            }
        })

        window.focus();

        if (mode != "dev") {
            window.addEventListener('keydown', (event) => {
                if (event.key === 'F11') {
                    document.documentElement.requestFullscreen();
                    event.preventDefault();
                }
            });

            window.addEventListener("fullscreenchange", (e) => {
                if (document.fullscreenElement) {
                    document.querySelector(".window-alert-container").classList.add("hide");
                } else {
                    document.querySelector(".window-alert-container").classList.remove("hide");
                }
            })
        } else {
            document.querySelector(".window-alert-container").classList.add("hide");
        }

        /*
        var checkOrientation = function () {
            mode = Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait';
            if (mode == 'landscape') {
                document.querySelector(".window-alert-container").classList.add("hide");
            } else {
                document.querySelector(".window-alert-container").classList.remove("hide");
            }
        };

        checkOrientation();

        window.addEventListener("resize", checkOrientation, false);
        window.addEventListener("orientationchange", checkOrientation, false);
        */
    }

    window.System = System;
})()