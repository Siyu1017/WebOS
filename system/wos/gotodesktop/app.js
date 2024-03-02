document.querySelector(".window-tool-bar-return-desktop").addEventListener("click", () => {
    Object.values(running_apps).forEach(app => {
        app.hide();
    })
})