(async function () {
    var pkgs = '';
    var frame = '';
    var app = new App(null, "", {
        width: 420,
        height: 300,
        fullscreenable: false,
        closable: false,
        movable: false,
        minimizable: false,
        y: (window.innerHeight - 45) / 2 - 150,
        x: window.innerWidth / 2 - 210,
        title: "Package Manager"
    });

    var local_pkgs = {};

    app.loadStyles("./system/wos/pkgmgr/app.css", "url");

    var randomString = function (count, chars) {
        var chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            result = '',
            length = chars.length;
        for (let i = 0; i < count; i++) {
            result += chars.charAt(Math.floor(Math.random() * length));
        }
        return result;
    }
    await fetch("./system/packages.json").then(res => {
        return res.json();
    }).then(content => {
        pkgs = content;
    }).finally(() => {
        frame = app.execute(`
            <div class="package-manager">
                <div class="package-switch">
                    <div class="package-type ${Array.isArray(pkgs) ? "active" : ""}" data-btn="cloud">Cloud</div>
                    <div class="package-type ${Array.isArray(pkgs) ? "" : "active"}" data-btn="local">Local</div>
                </div>
                <div class="package-lists">
                    <div class="package-list ${Array.isArray(pkgs) ? "active" : ""}" data-origin="cloud"></div>
                    <div class="package-list ${Array.isArray(pkgs) ? "" : "active"}" data-origin="local">
                        <label>File</label>
                        <input type="file" class="package-upload">
                        <label>App Name</label>
                        <input type="text" data-element="app">
                        <div class="wui-button" data-element="add-local-app">Add</div>
                        <div class="local-packages"></div>
                    </div>
                </div>
            </div>`);
        window.addEventListener("resize", () => {
            frame.elements.window.style.left = window.innerWidth / 2 - 210 + "px";
            frame.elements.window.style.top = (window.innerHeight - 45) / 2 - 150 + "px";
        }, true)
        frame.elements.window.classList.add('wui-system-light');
        initPkgMgr(pkgs);
        return;
    })

    function initPkgMgr(pkgs) {
        var local_app_filename = 'Application';
        var local_app_fid = hash(96);
        var local_app_url = "";
        var add_local_file = async (url, filename, fid) => {
            var pkg = document.createElement("div");
            pkg.className = "package local";
            pkg.innerHTML = `
            <div class="package-info">
            <div class="package-name">Name : ${filename}</div>
            </div>
            <div class="package-operate">
            <button class="package-enable wui-button lcoal" data-btn-id="${fid}"><span class="package-enable-title">Enable</span><svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px"></circle>
            </svg></button>
            </div>`

            frame.elements.content.querySelector('.local-packages').appendChild(pkg);



            var button = frame.elements.content.querySelector(`[data-btn-id='${fid}']`);
            button.addEventListener("click", (e) => {
                var script = document.createElement("script");
                script.src = url;
                document.head.appendChild(script);
            });

            return;
        }

        function readSingleFile(e) {
            var file = e.target.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                try {
                    var contents = e.target.result;
                    var blob = new Blob([contents], { type: 'text/javascript' });
                    var url = URL.createObjectURL(blob);
                    var fid = hash(96);
                    var filename = fid;
                    frame.elements.content.querySelector('[data-element="app"]').value = filename;
                    var fullPath = frame.elements.content.querySelector('input[type="file"]').value;
                    if (fullPath) {
                        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                        filename = fullPath.substring(startIndex);
                        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                            filename = filename.substring(1);
                        }
                        frame.elements.content.querySelector('[data-element="app"]').value = filename;
                    }

                    local_pkgs[fid] = {
                        blob, url, filename
                    }
                    local_app_filename = filename;
                    local_app_fid = fid;
                    local_app_url = url;
                } catch (e) {
                    console.log(e)
                }
            };
            reader.readAsText(file);
        }

        frame.elements.content.querySelectorAll('[data-btn]').forEach(btn => {
            btn.addEventListener("click", () => {
                frame.elements.content.querySelectorAll('[data-btn].active').forEach(active => {
                    active.classList.remove("active");
                })
                frame.elements.content.querySelectorAll('[data-origin].active').forEach(list => {
                    list.classList.remove("active");
                })
                btn.classList.add("active");
                frame.elements.content.querySelector(`[data-origin="${btn.getAttribute("data-btn")}"]`).classList.add("active");
            })
        })

        frame.elements.content.querySelector('.package-upload').addEventListener('change', (e) => {
            readSingleFile(e);
        });

        frame.elements.content.querySelector('[data-element="add-local-app"]').addEventListener("click", () => {
            add_local_file(local_app_url, frame.elements.content.querySelector('[data-element="app"]').value, local_app_fid);
        })

        if (Array.isArray(pkgs)) {
            pkgs.forEach(async pkg => {
                var pkg_id = randomString(96) + "-" + Date.now();
                console.log(frame)
                await (frame.elements.content.querySelector('[data-origin="cloud"]').innerHTML += `<div class="package ${pkg.disabled == true ? "disabled" : ""}" ${pkg.disabled == true ? "data-disabled" : ""}>
        <div class="package-info">
            <div class="package-name">Name : ${pkg.name}</div>
            <div class="package-author">Author : ${pkg.author}</div>
            <div class="package-version">Version : ${pkg.version}</div>
        </div>
        <div class="package-operate">
            <button class="package-enable wui-button" data-btn-id="${pkg_id}" ${pkg.disabled == true ? "disabled" : ""}><span class="package-enable-title">Enable</span><svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
            <circle cx="8px" cy="8px" r="7px"></circle>
        </svg></button>
        </div>
        </div>`);
                var button = frame.elements.content.querySelector(`[data-btn-id='${pkg_id}']`);
                button.addEventListener("click", (e) => {
                    button.classList.add("loading");
                    button.disabled = true;
                    setTimeout(() => {
                        System.loadSystemApps(pkg.scripts, () => {
                            button.classList.remove("loading");
                            button.disabled = false;
                        });
                    }, 100)
                });
            })
        } else {
            var notification = os.notification.create("./application.png", "Package Manager", "Failed to load cloud apps.", () => {
                app.focusWindow();
                frame.elements.content.querySelector('[data-btn="cloud"]').click();
            });

            frame.elements.content.querySelector('[data-origin="cloud"]').innerHTML = `<div style="text-align: center;font-size: 18px;font-weight: 600;color: rgb(226 26 26);">Failed to load cloud apps.</div>`;
        }
        window.onoffline = () => {
            frame.elements.content.querySelectorAll(`[data-btn-id]:not(.local)`).forEach(button => {
                button.classList.remove("loading");
                button.disabled = true;
            })
            frame.elements.content.querySelectorAll('.package:not(.local)').forEach(package => {
                package.classList.add("disabled");
            })
        }
        window.ononline = () => {
            frame.elements.content.querySelectorAll(`.package:not([data-disabled]) [data-btn-id]`).forEach(button => {
                button.classList.remove("loading");
                button.disabled = false;
            })
            frame.elements.content.querySelectorAll('.package:not([data-disabled])').forEach(package => {
                package.classList.remove("disabled");
            })
        }
    }
})()