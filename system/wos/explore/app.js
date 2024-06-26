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

        $(".window-taskbar").addEventListener("contextmenu", (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            try {
                System.showTaskBarContextMenu([
                /* {
                    type: 'label',
                    header: 'Actions'
                }, {
                    type: 'separation'
                }, */ {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M17 12h-2l-2 5-2-10-2 5H7"/></svg>',
                        header: 'Task Manager',
                        action: () => {
                            System.loadApp(0, ["packages/taskmgr/app"]);
                        }
                    }], e);
            } catch (e) { }
        })

        $(".window-desktop").addEventListener("contextmenu", (e) => {
            if (e.cancelable) {
                e.preventDefault();
            }
            try {
                System.showContextMenu([
                    {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>',
                        header: 'View',
                        disabled: true
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>',
                        header: 'Sort',
                        disabled: true
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
                        header: 'Refresh'
                    }, {
                        type: 'separation'
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>',
                        header: 'New',
                        disabled: true
                    }, {
                        type: 'separation'
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>',
                        header: 'Personalisation',
                        action: () => {
                            System.loadSystemApps(["packages/personal/app"]);
                        }
                    }, {
                        type: 'separation'
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>',
                        header: 'Open in Terminal',
                        action: () => {
                            System.loadSystemApps(["packages/cmd/app"]);
                        }
                    }, {
                        type: 'separation'
                    }, {
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"/><path d="m21 3-9 9"/><path d="M15 3h6v6"/></svg>',
                        header: 'Show other options',
                        disabled: true
                    }], e);
            } catch (e) { }
        })

        window.oncontextmenu = () => {
            return false;
        };

        function getnodeType(node) {
            if (node.nodeType == 1) return node.tagName.toLowerCase();
            else return node.nodeType;
        };
        function clean(node) {
            for (var n = 0; n < node.childNodes.length; n++) {
                var child = node.childNodes[n];
                if (
                    child.nodeType === 8 ||
                    (child.nodeType === 3 && !/\S/.test(child.nodeValue) && child.nodeValue.includes('\n'))
                ) {
                    node.removeChild(child);
                    n--;
                } else if (child.nodeType === 1) {
                    clean(child);
                }
            }
        }

        function parseHTML(str) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(str, 'text/html');
            clean(doc.body);
            return doc.body;
        }

        function attrbutesIndex(el) {
            var attributes = {};
            if (el.attributes == undefined) return attributes;
            for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
                attributes[atts[i].name] = atts[i].value;
            }
            return attributes;
        }
        function patchAttributes(vdom, dom) {
            let vdomAttributes = attrbutesIndex(vdom);
            let domAttributes = attrbutesIndex(dom);
            if (vdomAttributes == domAttributes) return;
            Object.keys(vdomAttributes).forEach((key, i) => {
                //if the attribute is not present in dom then add it
                if (!dom.getAttribute(key)) {
                    dom.setAttribute(key, vdomAttributes[key]);
                } //if the atrtribute is present than compare it
                else if (dom.getAttribute(key)) {
                    if (vdomAttributes[key] != domAttributes[key]) {
                        dom.setAttribute(key, vdomAttributes[key]);
                    }
                }
            });
            Object.keys(domAttributes).forEach((key, i) => {
                //if the attribute is not present in vdom than remove it
                if (!vdom.getAttribute(key)) {
                    dom.removeAttribute(key);
                }
            });
        }

        function diff(vdom, dom) {
            //if dom has no childs then append the childs from vdom
            if (dom.hasChildNodes() == false && vdom.hasChildNodes() == true) {
                for (var i = 0; i < vdom.childNodes.length; i++) {
                    //appending
                    dom.append(vdom.childNodes[i].cloneNode(true));
                }
            } else {
                //if both nodes are equal then no need to compare farther
                if (vdom.isEqualNode(dom)) return;
                //if dom has extra child
                if (dom.childNodes.length > vdom.childNodes.length) {
                    let count = dom.childNodes.length - vdom.childNodes.length;
                    if (count > 0) {
                        for (; count > 0; count--) {
                            dom.childNodes[dom.childNodes.length - count].remove();
                        }
                    }
                }
                //now comparing all childs
                for (var i = 0; i < vdom.childNodes.length; i++) {
                    //if the node is not present in dom append it
                    if (dom.childNodes[i] == undefined) {
                        dom.append(vdom.childNodes[i].cloneNode(true));
                        // console.log("appenidng",vdom.childNodes[i])
                    } else if (getnodeType(vdom.childNodes[i]) == getnodeType(dom.childNodes[i])) {
                        //if same node type
                        //if the nodeType is text
                        if (vdom.childNodes[i].nodeType == 3) {
                            //we check if the text content is not same
                            if (vdom.childNodes[i].textContent != dom.childNodes[i].textContent) {
                                //replace the text content
                                dom.childNodes[i].textContent = vdom.childNodes[i].textContent;
                            }
                        } else {
                            patchAttributes(vdom.childNodes[i], dom.childNodes[i])
                        }
                    } else {
                        //replace
                        dom.childNodes[i].replaceWith(vdom.childNodes[i].cloneNode(true));
                    }
                    if (vdom.childNodes[i].nodeType != 3) {
                        diff(vdom.childNodes[i], dom.childNodes[i])
                    }
                }
            }
        }

        /*
        let vdom = parseHTML(`
        <h1 style="color:green">Hello</h1>
        <p>This is a page</p>
        <p>some more text</p>`);
        
        let dom = document.getElementById('node');
        clean(dom);
        console.log(vdom)
        
        document.querySelector('button').addEventListener('click', function () {
            diff(vdom, dom);
        })
        */

        System.showTaskBarContextMenu = (list, e) => {
            System.hideContextMenu();
            System.hideTaskBarContextMenu();
            $(".window-task-bar-contextmenu").innerHTML = '';

            function parseHTML(str) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(str, 'text/html');
                clean(doc.body);
                return doc.body.firstChild;
            }

            list.forEach(item => {
                try {
                    if (item.type == 'label') {
                        var labelElement = document.createElement('div');
                        labelElement.classList.add("window-task-bar-contextmenu-label");
                        labelElement.innerHTML = formatString(item.header);
                        $(".window-task-bar-contextmenu").appendChild(labelElement);
                    } else if (item.type == 'separation') {
                        var separationElement = document.createElement('div');
                        separationElement.classList.add("window-task-bar-contextmenu-separation");
                        $(".window-task-bar-contextmenu").appendChild(separationElement);
                    } else {
                        var itemElement = document.createElement('div');
                        itemElement.classList.add("window-task-bar-contextmenu-item");
                        if (item.class) {
                            itemElement.classList.add(item.class);
                        }
                        if (item.disabled == true) {
                            itemElement.classList.add("disabled");
                        }
                        itemElement.innerHTML = `
                <div class="window-task-bar-contextmenu-item-icon"></div>
                <div class="window-task-bar-contextmenu-item-header">${formatString(item.header)}</div>
                `;
                        var iconElement = parseHTML(item.icon);
                        iconElement.classList.add("window-task-bar-contextmenu-item-icon-inner");
                        itemElement.querySelector(".window-task-bar-contextmenu-item-icon").appendChild(iconElement);
                        itemElement.addEventListener('click', () => {
                            System.hideTaskBarContextMenu();
                            item.action instanceof Function ? item.action() : null;
                        })
                        $(".window-task-bar-contextmenu").appendChild(itemElement);
                    }
                } catch (e) { }
            })

            try {
                if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
                    var touch = e.touches[0] || e.changedTouches[0];
                    e.pageX = touch.pageX;
                    e.pageY = touch.pageY;
                }

                $(".window-task-bar-contextmenu").style.left = e.pageX + 'px';
            } catch (e) { }

            $(".window-task-bar-contextmenu").style.animation = 'show-task-bar-contextmenu 300ms cubic-bezier(.3,.94,.71,.94) 0s 1 forwards';
            $(".window-task-bar-contextmenu").classList.add("window-task-bar-contextmenu-show");
            $(".window-task-bar-contextmenu").addEventListener("animationend", () => {
                $(".window-task-bar-contextmenu").style.animation = "";
            })

            if (e.pageX + $(".window-task-bar-contextmenu").offsetWidth > window.innerWidth) {
                $(".window-task-bar-contextmenu").style.left = window.innerWidth - $(".window-task-bar-contextmenu").offsetWidth - 8 + 'px';
            }
        }

        System.exitCodes = {
            0: "Runtime Error",
            8: "Maximum Call Stack Size Exceeded"
        }

        System.exit = (exitCode) => {
            document.head.querySelectorAll("style").forEach((style) => {
                style.remove();
            })
            document.body.innerHTML = `
            <div style="font-size: 6rem;margin-bottom: 10px;">:(</div>
            <div style="font-size: 21px;">There is a problem with your device and it must be restarted.</div>
            <div style="font-size: 21px; margin: 0 0 25px;">We are just collecting some error information and we will restart it for you.</div>
            <div style="font-size: 21px; margin: 0 0 25px;" err="p">0% Completed</div>
            <div>Exit Code : ${exitCode}</div>
            <div>Detail : ${System.exitCodes[exitCode] ? System.exitCodes[exitCode] : "Unknow Error"}</div>
            `;

            document.body.style = `position: fixed;top: 0px;left: 0px;z-index: 2147483647;color: rgb(255, 255, 255);width: 100vw;height: 100vh;background: rgb(57, 115, 170) !important;font-family: &quot;Segoe UI&quot;;padding: 0px 4rem;user-select: none;box-sizing: border-box;transition: none !important;`;

            var randomTime = Math.random() * 1000 + 500;

            setTimeout(() => {
                $('[err="p"]').innerHTML = `100% Completed`;
            }, randomTime);

            setTimeout(() => {
                document.body.innerHTML = `<div class="window-loading active" id="loading">
                <img class="webos-loading-image" src="./favicon.ico">
                <svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
                    <circle cx="8px" cy="8px" r="7px"></circle>
                </svg>
            </div>`;
                document.body.style = 'transition: none !important;';
                setTimeout(() => {
                    location.reload();
                }, 1000)
            }, randomTime + 1000);
        }

        System.hideTaskBarContextMenu = () => {
            $(".window-task-bar-contextmenu").classList.remove("window-task-bar-contextmenu-show");
            $(".window-task-bar-contextmenu").innerHTML = '';
        }

        document.addEventListener("click", (e) => {
            if (e.target == $(".window-task-bar-contextmenu") || $(".window-task-bar-contextmenu").contains(e.target)) return;
            System.hideTaskBarContextMenu();
        }, true)


        System.showContextMenu = (list, e) => {
            System.hideContextMenu();
            System.hideTaskBarContextMenu();
            $(".window-contextmenu").innerHTML = '';
            $(".window-contextmenu").classList.add("window-contextmenu-show");
            try {
                if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
                    var touch = e.touches[0] || e.changedTouches[0];
                    e.pageX = touch.pageX;
                    e.pageY = touch.pageY;
                }

                $(".window-contextmenu").style.left = e.pageX + 'px';
                $(".window-contextmenu").style.top = e.pageY + 'px';
            } catch (e) { }

            function parseHTML(str) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(str, 'text/html');
                clean(doc.body);
                return doc.body.firstChild;
            }

            list.forEach(item => {
                try {
                    if (item.type == 'label') {
                        var labelElement = document.createElement('div');
                        labelElement.classList.add("window-contextmenu-label");
                        labelElement.innerHTML = formatString(item.header);
                        $(".window-contextmenu").appendChild(labelElement);
                    } else if (item.type == 'separation') {
                        var separationElement = document.createElement('div');
                        separationElement.classList.add("window-contextmenu-separation");
                        $(".window-contextmenu").appendChild(separationElement);
                    } else {
                        var itemElement = document.createElement('div');
                        itemElement.classList.add("window-contextmenu-item");
                        if (item.class) {
                            itemElement.classList.add(item.class);
                        }
                        if (item.disabled == true) {
                            itemElement.classList.add("disabled");
                        }
                        itemElement.innerHTML = `
                <div class="window-contextmenu-item-icon"></div>
                <div class="window-contextmenu-item-header">${formatString(item.header)}</div>
                `;
                        var iconElement = parseHTML(item.icon);
                        iconElement.classList.add("window-contextmenu-item-icon-inner");
                        itemElement.querySelector(".window-contextmenu-item-icon").appendChild(iconElement);
                        itemElement.addEventListener('click', () => {
                            System.hideContextMenu();
                            item.action instanceof Function ? item.action() : null;
                        })
                        $(".window-contextmenu").appendChild(itemElement);
                    }
                } catch (e) { }
            })
            if (getPosition($(".window-contextmenu")).y + $(".window-contextmenu").offsetHeight > window.innerHeight - settings.barHeight - 8) {
                $(".window-contextmenu").style.top = `${e.pageY - $(".window-contextmenu").offsetHeight}px`
            } 
            if (getPosition($(".window-contextmenu")).y < 0) {
                $(".window-contextmenu").style.top = '8px';
            }
            if (getPosition($(".window-contextmenu")).x + $(".window-contextmenu").offsetWidth > window.innerWidth) {
                $(".window-contextmenu").style.left = `${e.pageX - $(".window-contextmenu").offsetWidth}px`
            }
        }

        System.hideContextMenu = () => {
            $(".window-contextmenu").classList.remove("window-contextmenu-show");
            $(".window-contextmenu").innerHTML = '';
        }

        document.addEventListener("click", (e) => {
            if (e.target == $(".window-contextmenu") || $(".window-contextmenu").contains(e.target)) return;
            System.hideContextMenu();
        }, true)

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