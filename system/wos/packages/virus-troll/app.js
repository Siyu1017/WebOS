System.showStartLoading();

setTimeout(() => {
    $(".window-background").style.backgroundImage = `url(./system/wos/packages/virus-troll/bg.jpg)`;

    document.querySelector(".window-taskbar").style.background = "rgba(90, 90, 90, .4)";
    document.querySelector(".window-taskbar-system-time").style.color = "rgb(225, 225, 225)";

    var app = new App(null, null, {
        icon: "./system/wos/packages/virus-troll/troll.png"
    });
    app.loadStyles("./system/wos/packages/virus-troll/app.css", "url");
    var browseWindow = app.execute();
    browseWindow.elements.window.remove();
}, 500);

setTimeout(function () {
    System.hideStartLoading();
}, 1500);

setInterval(() => {
    var notification = os.notification.create("./system/wos/packages/virus-troll/troll.png", "Virus - Troll", "You have been hacked!", () => {
        new App("ERROR" + Date.now(), null, {
            x: window.innerWidth * Math.random(),
            y: window.innerHeight * Math.random(),
            width: 240,
            height: 120,
            minimizable: false,
            fullscreenable: false,
            title: "Error",
            icon: "./error.png"
        }).execute('<div style="height: calc(100% - 36px);width: calc(100% - 24px);display: flex;justify-content: center;align-items: center;padding: 18px 12px;user-select: none;-webkit-user-drag: none;"><img src="./error.png" style="width: 36px;height: 36px;margin-right: 6px;-webkit-user-drag: none;"><span style="overflow: hidden;max-height: 4rem;-webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;text-overflow: ellipsis;white-space: normal;word-wrap: break-word;">You have been haked.</span></div>');
    });
})