(async function () {
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

    var browseWindow = await app.execute(`<div class="cmd">
    <div class="terminal">
        <div class="terminal-lines">
            <div class="terminal-group">
                <div class="terminal-line">WebOS [Version 1.0.0]</div>
                <div class="terminal-line">(c) WebOS. All rights reserved.</div>
                <div class="terminal-line"><br></div>
                <div class="terminal-line">WARNING : THIS IS JUST AN EXAMPLE AND MAY NOT BE USED.</div>
            </div>
        </div>
        <input class="terminal-input" disabled>
    </div>
    </div>`);

    function getTextWidth(text, font) {
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    function getCssStyle(element, prop) {
        return window.getComputedStyle(element, null).getPropertyValue(prop);
    }

    function getCanvasFont(el = document.body) {
        const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
        const fontSize = getCssStyle(el, 'font-size') || 'normal';
        const fontFamily = getCssStyle(el, 'font-family') || 'monospace';

        return `${fontWeight} ${fontSize} ${fontFamily}`;
    }

    setTimeout(() => {
        var terminal = browseWindow.elements.content.querySelector(".terminal");
        var terminal_input = browseWindow.elements.content.querySelector(".terminal-input");
        var terminal_lines = browseWindow.elements.content.querySelector(".terminal-lines");

        function getLinePosition() {
            var lines = terminal_lines.querySelectorAll('.terminal-line');
            var line = lines[lines.length - 1];
            return {
                top: line.offsetTop,
                left: line.offsetLeft + getTextWidth(line.innerText, getCanvasFont(line))
            };
        }

        terminal_input.focus(); 

        terminal.addEventListener("keydown", () => {
            terminal_input.focus(); 
        })

        terminal_input.style.position = "absolute";
        terminal_input.style.top = getLinePosition().top + "px";
        terminal_input.style.left = getLinePosition().left + "px";
       // terminal_input.style.width = 0;

        terminal_input.oninput = () => {
            var lines = terminal_lines.querySelectorAll('.terminal-line');
            var line = lines[lines.length - 1];
            line.innerText = terminal_input.value;
            terminal_input.style.position = "absolute";
            terminal_input.style.top = getLinePosition().top + "px";
            terminal_input.style.left = getLinePosition().left + "px";
           // terminal_input.style.width = 0;
        }

    }, 200)
})();