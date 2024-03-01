(function () {
    var app = new App(null, "", {
        width: 420,
        height: 300,
        y: (window.innerHeight - 45) / 2 - 150,
        x: window.innerWidth / 2 - 210,
        title: "Command",
        backgroundColor: "rgb(24, 24, 24)",
        icon: "./system/wos/packages/cmd/cmd.png"
    });

    app.loadStyles("./system/wos/packages/cmd/app.css", "url");

    var browseWindow = app.execute(`<div class="cmd">
    <div class="terminal">
        <div class="terminal-lines">
            <div class="terminal-line">$</div>
        </div>
        <input class="terminal-input">
    </div>
    </div>`);
})();