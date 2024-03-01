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
        if (!Array.isArray(pkgs)) {
            frame = app.execute(`Failed to load packages.`);
        } else {
            frame = app.execute(`<div class="package-manager"><div class="package-list"></div></div>`);
            initPkgMgr(pkgs);
        }
        window.onresize = () => {
            frame.elements.window.style.left = window.innerWidth / 2 - 210 + "px";
            frame.elements.window.style.top = (window.innerHeight - 45) / 2 - 150 + "px";
        }
        frame.elements.window.classList.add('wui-system');
        return;
    })

    function initPkgMgr(pkgs) {
        pkgs.forEach(async pkg => {
            var pkg_id = randomString(96) + "-" + Date.now();
            console.log(frame)
            await(frame.elements.content.querySelector(".package-list").innerHTML += `<div class="package">
        <div class="package-info">
            <div class="package-name">Name : ${pkg.name}</div>
            <div class="package-author">Author : ${pkg.author}</div>
            <div class="package-version">Version : ${pkg.version}</div>
        </div>
        <div class="package-operate">
            <button class="package-enable wui-button" data-pkg-id="${pkg_id}">Enable</button>
        </div>
        </div>`);
            frame.elements.content.querySelector(`[data-pkg-id='${pkg_id}']`).addEventListener("click", (e) => {
                System.loadSystemApps(pkg.scripts);
            })
        })
    }
})()