document.querySelector(".window-taskbar-return-desktop").addEventListener("click", () => {
    Object.values(running_apps).forEach(app => {
        app.hide();
    })
})