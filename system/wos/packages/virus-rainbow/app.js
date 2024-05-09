(() => {
    Object.values(running_apps).forEach(app => {
        if (app.changeTitle instanceof Function) {
            app.changeTitle("Rainbow");
        }
        if (app.changeIcon instanceof Function) {
            app.changeIcon("./system/wos/packages/virus-rainbow/app.webp");
        }
    })

    running_apps_observers.push(() => {
        Object.values(running_apps).forEach(app => {
            if (app.changeTitle instanceof Function) {
                app.changeTitle("Rainbow");
            }
            if (app.changeIcon instanceof Function) {
                app.changeIcon("./system/wos/packages/virus-rainbow/app.webp");
            }
        })
    })

    var a = 0;

    setInterval(() => {
        document.body.style.filter = `hue-rotate(${a}deg)`;
        a += 2.3
    }, 50)
})();