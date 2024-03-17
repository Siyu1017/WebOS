(() => {
    var ys = new App("gs", null, {
        width: window.innerWidth,
        height: window.innerHeight - 45,
        title: "Genshin Impact",
        icon: "./system/wos/packages/genshinimpact/icon.jpg",
        fullscreen: true,
        movable: false,
        fullscreenable: false,
        x: 0,
        y: 0
    });
    ys.loadStyles("./system/wos/packages/genshinimpact/app.css", "url")
    var gameWindow = ys.execute(`<div class="genshin"><img src="./system/wos/packages/genshinimpact/bg.jpg" class="bg"></div>`);

    window.addEventListener("resize", () => {
        gameWindow.elements.window.style.width = window.innerWidth + "px";
        gameWindow.elements.window.style.height = window.innerHeight - 45 + "px";
        gameWindow.elements.window.style.top = "0px";
        gameWindow.elements.window.style.left = "0px";
    }, true)
})()