(async function () {
    var app = new App(null, "", {
        width: 420,
        height: 300,
        y: (window.innerHeight - 45) / 2 - 150,
        x: window.innerWidth / 2 - 210,
        title: "Notification Trigger",
        showloading: true,
        backgroundColor: "rgb(255, 255, 255)"
    });
    
    var browseWindow = await app.execute(`
    <div class="n-t-window">
        <h2>Notification Trigger</h2>
        <div class="group">
            <label>Icon</label>
            <input placeholder="Icon" data-element="icon">
        </div>
        <div class="group">
            <label>Title</label>
            <input placeholder="Title" data-element="host">
        </div>
        <div class="group">
            <label>Message</label>
            <input placeholder="Message" data-element="message">
        </div>
        <div class="group">
            <label>Action</label>
            <textarea placeholder="Action" data-element="action"></textarea>
        </div>
        <button data-element="run" class="wui-button">Trigger</button>
        <div data-element="result"><div>
    </div>`);
    
    var root = browseWindow.elements.window;

    var icon = root.querySelector('[data-element="icon"]')
    var host = root.querySelector('[data-element="host"]')
    var message = root.querySelector('[data-element="message"]')
    var action = root.querySelector('[data-element="action"]')    
    var result = root.querySelector('[data-element="result"]')    

    root.querySelector('[data-element="run"]').addEventListener("click", () => {
        var func = () => {};
        try {
            func = new Function(action.value);
        } catch {};
        var id = os.notification.create(icon.value, host.value, message.value, func);
        result.innerHTML = id;
    })

    app.loadStyles("./system/wos/packages/notify-trigger/app.css", "url", () => {
        setTimeout(app.hideLoading, 500)
    })
})();