(async () => {
    var bgs = [0, 19, 20, 21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35];
    var dark = [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    var current = 0;
    var name = "./system/bg/img$.jpg";
    var app = new App(null, null, {
        x: 0,
        y: 0,
        width: 420,
        height: 300,
        title: "Personalisation",
        icon: "./system/wos/packages/personal/personal.png",
        fullscreenable: false
    })
    var frame = await app.execute(`<div class="personal">
    <div class="personal-group">
        <div class="personal-title">Background</div>
        <div class="personal-background"></div>
    </div>
    <div class="personal-group theme">
        <div class="personal-title">Theme</div>
        <div class="select" data-select="personal-theme">
        <div class="select-default">Choose...</div>
        <div class="select-popup">
            <div class="select-group">
                <div class="select-item selected" value="light">Light</div>
                <div class="select-item" value="dark">Dark</div>
                <div class="select-item disabled" value="custom">Custom</div>
            </div>
    </div>
        </div>
    </div>
    </div>`);
    var delay = (delayInms) => { return new Promise(resolve => setTimeout(resolve, delayInms)); };

    app.loadStyles("./system/wos/packages/personal/app.css", "url");

    frame.elements.window.classList.add("personal-window");
    frame.elements.window.classList.add("wui-system");

    frame.elements.window.style.backdropFilter = `blur(16px) saturate(1.8)`;
    frame.elements.window.style.background = `rgba(241, 241, 241, 0.85)`;

    frame.elements.content.style = `
    display: flex;
    overflow: auto;
    max-height: 100%;
    justify-content: center;
    padding: 1.25rem 2rem 2rem;
    box-sizing: border-box;
    background: none;
`;

    frame.elements.toolbar.style = `background: none;`;

    function load(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', resolve);
            image.addEventListener('error', reject);
            image.src = src;
        });
    }

    bgs.forEach(async (bg, i) => {
        await (frame.elements.content.querySelector(".personal-background").innerHTML += `<button class="personal-theme ${current == i ? "active" : ""}" data-theme="${name.replace("$", bg)}">
        <img src="${name.replace("$", bg)}" class="theme-image"><svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
        <circle cx="8px" cy="8px" r="7px"></circle>
    </svg>
        </button>`);
        var button = frame.elements.content.querySelector(`[data-theme="${name.replace("$", bg)}"]`);
        button.addEventListener("click", async (e) => {
            button.classList.add("loading");
            button.disabled = true;
            current = i;
            // System.showStartLoading();
            await delay(500);
            var image = name.replace("$", bg);
            load(image).then(async () => {
                document.body.style.backgroundImage = `url(${image})`;
                if (dark[i] == 1) {
                    document.documentElement.setAttribute("data-theme", "dark");
                    frame.elements.content.querySelector('[data-select="personal-theme"]').classList.add("dark");
                } else {
                    document.documentElement.setAttribute("data-theme", "light");
                    frame.elements.content.querySelector('[data-select="personal-theme"]').classList.remove("dark");
                }
                frame.elements.content.querySelectorAll(`[data-theme].active`).forEach(btn => {
                    btn.classList.remove("active");
                })
                button.classList.add("active");
                await delay(500);
                button.classList.remove("loading");
                button.disabled = false;
                // System.hideStartLoading();
            });
        });
    })

    S.install();

    async function changeTheme(theme) {
        var index = bgs.includes(theme) ? bgs.indexOf(theme) : theme;
        index = index >= 0 && index < bgs.length ? index : 0;
        current = index;
        var bg = bgs[index];
        var image = name.replace("$", bg);
        return load(image).then(async () => {
            document.body.style.backgroundImage = `url(${image})`;
            if (dark[index] == 1) {
                document.documentElement.setAttribute("data-theme", "dark");
                frame.elements.content.querySelector('[data-select="personal-theme"]').classList.add("dark");
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                frame.elements.content.querySelector('[data-select="personal-theme"]').classList.remove("dark");
            }
        });
    }

    window.webos.personal = {
        changeTheme: changeTheme
    }
})();