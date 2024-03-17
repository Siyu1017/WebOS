(() => {
    System.showStartLoading();
    var app = new App('w12-theme');
    app.loadStyles("./system/wos/packages/windows12-theme/app.css", "url", () => {
        setTimeout(() => {
            System.hideStartLoading();
        }, 500)
    });
})();

