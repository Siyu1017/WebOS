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
    <input placeholder="Icon" data-element="icon">
    <input placeholder="Title" data-element="host">
    <input placeholder="Message" data-element="message">
    <textarea placeholder="Action" data-element="action"></textarea>
    <button data-element="run">Trigger</button>
    <div data-element="result"><div>`);
    
    var root = browseWindow.elements.window;

    var icon = root.querySelector('[data-element="icon"]')
    var host = root.querySelector('[data-element="host"]')
    var message = root.querySelector('[data-element="message"]')
    var action = root.querySelector('[data-element="action"]')    
    var result = root.querySelector('[data-element="result"]')    

    root.querySelector('[data-element="run"]').addEventListener("click", () => {
        if (icon.value == '' || host.value == '' || message.value == '' || action.value == '') return;
        var func = () => {};
        try {
            func = new Function(action.value);
        } catch {};
        var id = os.notification.create(icon.value, host.value, message.value, func);
        result.innerHTML = id;
    })

    setTimeout(app.hideLoading, 500)
})();