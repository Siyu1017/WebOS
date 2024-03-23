(async function () {
    var app = new App(null, "", {
        width: 420,
        height: 300,
        y: (window.innerHeight - 45) / 2 - 150,
        x: window.innerWidth / 2 - 210,
        title: "Command",
        showloading: true,
        backgroundColor: "rgb(40,44,52)",
        icon: "./system/wos/packages/cmd/cmd.png"
    });

    const HACK_PANEL_VERSION = "1.2.0";

    await fetch("./system/wos/packages/cmd/app.css").then(res => {
        return res.text();
    }).then(content => {
        var style = document.createElement("style");
        style.innerHTML = `[app-hash-content="${app.hash}"] { ${content} }`;
        document.head.appendChild(style);
    }).finally(() => {
        return;
    })


    var browseWindow = await app.execute(`<div class="cmd">
    <div class="terminal">
        <div class="terminal-lines"></div>
        <div class="terminal-typein">
            <span class="terminal-path"></span>
            <textarea class="terminal-input"></textarea>
        </div>
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

    function formatString(str) {
        console.log(str)
        try {
            return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

        } catch (e) {
            return str;
        }
    }

    setTimeout(async () => {
        var terminal = browseWindow.elements.content.querySelector(".terminal");
        var terminal_input = browseWindow.elements.content.querySelector(".terminal-input");
        var terminal_typein = browseWindow.elements.content.querySelector(".terminal-typein");
        var terminal_lines = browseWindow.elements.content.querySelector(".terminal-lines");

        var pkgs;

        var randomString = function (count, chars) {
            var chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                result = '',
                length = chars.length;
            for (let i = 0; i < count; i++) {
                result += chars.charAt(Math.floor(Math.random() * length));
            }
            return result;
        }

        function getLinePosition() {
            var groups = terminal_lines.querySelectorAll('.terminal-group');
            var group = groups[groups.length - 1];
            return {
                top: group.offsetTop + group.scrollHeight,
                left: group.offsetLeft // + getTextWidth(line.innerText, getCanvasFont(line))
            };
        }

        function isFunction(functionToCheck) {
            return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
        }

        var type_history = [""];
        var current_index = 0;

        Date.prototype.format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); } for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); } } return fmt; };

        function initHackPanel() {
            terminal_lines.innerHTML =
                `                                      
<div class="terminal-group">
            <div class="terminal-typed">
                <div class="terminal-line">WebOS Command [Version ${HACK_PANEL_VERSION}]</div>
                <div class="terminal-line">(c) WebOS. All rights reserved.</div>
                <!--div class="terminal-line"><br></div>
                <div class="terminal-line">░▒█░▒█░█▀▀▄░▒█▀▀▄░▒█░▄▀░░░▒█▀▀█░█▀▀▄░▒█▄░▒█░▒█▀▀▀░▒█░░░</div>
                <div class="terminal-line">░▒█▀▀█▒█▄▄█░▒█░░░░▒█▀▄░░░░▒█▄▄█▒█▄▄█░▒█▒█▒█░▒█▀▀▀░▒█░░░</div>
                <div class="terminal-line">░▒█░▒█▒█░▒█░▒█▄▄▀░▒█░▒█░░░▒█░░░▒█░▒█░▒█░░▀█░▒█▄▄▄░▒█▄▄█</div-->
                <div class="terminal-line"><br></div>
                <div class="terminal-line">WARNING : THIS APPLICATION IS UNSAFE.</div>
            </div></div>
`;
        }

        initHackPanel();

        var generateResponse = (id) => {
            var parent = terminal_lines.querySelector(`[data-id="${id}"]`);
            var createLine = (content, type = "default") => {
                parent.innerHTML += `<div class="terminal-line terminal-line-${type}">${content}</div>`;
                if (terminal.scrollTop >= terminal.scrollHeight - terminal.offsetHeight * 2) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            }
            var createLineFromArray = (array, type) => {
                array.forEach(line => {
                    createLine(line, type);
                })
            }
            var createTable = (table) => {
                var titles = Object.keys(table);
                var rows = Object.values(table);
                var html = "";
                titles.forEach((title, i) => {
                    var temp = "";
                    rows[i].forEach(row => {
                        temp += `<div class="terminal-row">${row}</div>`;
                    })
                    html += `<div class="terminal-col"><div class="terminal-row">${title}</div>${temp}</div>`;
                });
                parent.innerHTML += `<div class="terminal-table">${html}</div>`;
            }
            return { id, parent, createLine, createLineFromArray, createTable }
        }

        var isNumber = function isNumber(value) {
            return typeof value === 'number' && isFinite(value);
        }

        var isNumberObject = function isNumberObject(n) {
            return (Object.prototype.toString.apply(n) === '[object Number]');
        }

        var isCustomNumber = function isCustomNumber(n) {
            return isNumber(n) || isNumberObject(n);
        }

        var command_list = {
            package: {
                install: (content, id) => {
                    var api = generateResponse(id);
                    if (content == "all") {
                        pkgs.forEach(pkg => {
                            System.loadSystemApps(pkg.scripts);
                        })
                        api.createLine(`${pkgs.length} package(s) installed.`);
                    } else if (pkgs[content]) {
                        System.loadSystemApps(pkgs[content].scripts);
                        api.createLine(`Package "${content}" installed.`);
                    } else {
                        var script = null;
                        var name = null;
                        pkgs.forEach(pkg => {
                            if (pkg.name == content) {
                                script = pkg.scripts;
                                name = pkg.name;
                            }
                        })
                        if (script != null) {
                            return System.loadSystemApps(script, () => {
                                api.createLine(`Package "${formatString(name)}" installed.`);
                            });
                        } else {
                            return api.createLineFromArray([
                                `Please use "package install [all|index|name]" to install the packages,`,
                                `and use "package list" to list all the packages`
                            ], "error");
                        }
                    }
                },
                list: (content, id) => {
                    var api = generateResponse(id);
                    var table = {
                        name: [],
                        index: []
                    };
                    pkgs.forEach((pkg, i) => {
                        table.name.push(pkg.name)
                        table.index.push(i)
                    })
                    api.createTable(table)
                    return;
                }
            },
            version: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([`Version: ${HACK_PANEL_VERSION}`])
            }
            ,
            date: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([new Date(Date.now()).format("yyyy/MM/dd")])
            }
            ,
            time: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([new Date(Date.now()).format("hh:mm:ss")])
            }
            ,
            help: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray(Object.keys(command_list).sort())
            },
            clear: () => {
                setTimeout(() => {
                    initHackPanel();
                }, 500)
            },
            prank: (content, id) => {
                var api = generateResponse(id);
                var line_length = isCustomNumber(content) ? content : 300;
                var created = 0;
                function write() {
                    api.createLine(randomString(terminal_lines.offsetWidth / 7.5));
                    created++;
                    if (created < line_length) {
                        setTimeout(write, 50);
                    }
                }
                write();
            }
        }

        function cmdParser(cmd, id, current = command_list) {
            console.log(cmd)
            var api = generateResponse(id);
            if (current[cmd[0]]) {
                if (isFunction(current[cmd[0]])) {
                    return current[cmd[0]](cmd.slice(1).join(" "), id);
                } else if (cmd.length == 1) {
                    var list = Object.keys(current[cmd[0]]);
                    if (list.length == 0) {
                        api.createLineFromArray([
                            `'${formatString(cmd.join(" "))}' is not recognized as an internal or external command,`,
                            `operable program or batch file.`,
                            '',
                            `Type "help" for available commands`
                        ], "error")
                    } else if (list.length > 0) {
                        api.createLineFromArray(Object.keys(current[cmd[0]]));
                    } else {
                        api.createLineFromArray([
                            `'${formatString(cmd.join(" "))}' is not recognized as an internal or external command,`,
                            `operable program or batch file.`,
                            '',
                            `Type "help" for available commands`
                        ], "error")
                    }
                } else {
                    cmdParser(cmd.slice(1), id, current[cmd[0]]);
                }
            } else {
                api.createLineFromArray([
                    `'${formatString(Array.isArray(cmd) ? cmd.join(" ") : "")}' is not recognized as an internal or external command,`,
                    `operable program or batch file.`,
                    '',
                    `Type "help" for available commands`
                ], "error");
            }
        }

        terminal_input.focus();

        var focused = true;
        var path = 'W:\\Cloud\\Users\\Anonymous';

        terminal.addEventListener("click", () => {
            focused = true;
        })

        document.addEventListener("click", (e) => {
            if (!browseWindow.elements.window.contains(e.target) && e.target != browseWindow.elements.window) {
                focused = false;
            }
        })

        function moveCaretToEnd(el) {
            if (typeof el.selectionStart == "number") {
                el.selectionStart = el.selectionEnd = el.value.length;
            } else if (typeof el.createTextRange != "undefined") {
                el.focus();
                var range = el.createTextRange();
                range.collapse(false);
                range.select();
            }
        }

        document.addEventListener("keydown", (e) => {
            if (focused == true) {
                if (e.keyCode == 38) {
                    current_index > 0 ? (current_index--) : current_index;
                    terminal_input.value = type_history[current_index];
                    // terminal_input.selectionStart = terminal_input.value.length;
                    e.preventDefault();
                    moveCaretToEnd(terminal_input);
                }

                if (e.keyCode == 40) {
                    current_index < type_history.length - 1 ? (current_index++) : current_index;
                    terminal_input.value = type_history[current_index];
                    // terminal_input.selectionStart = terminal_input.value.length;
                    e.preventDefault();
                    moveCaretToEnd(terminal_input);
                }

                setTimeout(() => {
                    terminal_typein.style.height = "10px";
                    terminal_typein.style.height = terminal_input.scrollHeight + 'px';
                }, 100);
            }
            if (focused == true && !e.ctrlKey) {
                terminal_input.focus();
            }
        })

        var terminal_path = terminal.querySelector(".terminal-typein .terminal-path");
        terminal_path.innerHTML = formatString(path + ">");

        /*terminal_input.style.position = "absolute";
            terminal_input.style.top = getLinePosition().top + "px";
            terminal_input.style.left = getLinePosition().left + "px";*/
        // terminal_input.style.width = 0;

        terminal_input.onpaste = (event) => {
            setTimeout(() => {
                terminal_typein.style.height = "10px";
                terminal_typein.style.height = terminal_input.scrollHeight + 'px';
            }, 100);
            setTimeout(() => {
                terminal.scrollTop = terminal.scrollHeight;
            }, 200)
        }

        const observer = new ResizeObserver(resizeHandler);
        observer.observe(terminal_input);

        let isResizing = false;
        async function resizeHandler() {
            setTimeout(() => {
                terminal_typein.style.height = terminal_input.scrollHeight + 'px';
            }, 100);
            /*if (isResizing == true) return;
            isResizing = true;
            terminal_input.style.height = terminal_input.scrollHeight + 'px';
            setTimeout(() => {
                isResizing = false;
            }, 200)*/

        }

        var randomString = function (count, chars) {
            var chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                result = '',
                length = chars.length;
            for (let i = 0; i < count; i++) {
                result += chars.charAt(Math.floor(Math.random() * length));
            }
            return result;
        }

        terminal_input.onkeypress = (e) => {
            // console.log(e.keyCode, e.key, e.which)
            if (e.keyCode == 13 && !e.shiftKey) {
                var lines = terminal_input.value.split("\n");
                var line_id = randomString(96);
                var html = "";
                lines.forEach((line, i) => {
                    if (i == 0) {
                        var line = line.split(" ");
                        html += `<div class="terminal-line"><span class="terminal-line-warning">${formatString(line[0])}</span> ${formatString(line.slice(1).join(' '))}</div>`;
                    } else {
                        html += `<div class="terminal-line">${formatString(line)}</div>`
                    }
                })
                terminal_lines.innerHTML += `<div class="terminal-group" style="margin: 0"><span class="terminal-path">${formatString(path + ">")}</span><div class="terminal-typed">${html}</div></div><div class="terminal-group" style="flex-direction: column;" data-id="${line_id}"></div>`;

                if (terminal_input.value.trim().length > 0) {
                    cmdParser(terminal_input.value.trim().split(" "), line_id);
                } else {
                    terminal_lines.querySelector(`[data-id="${line_id}"]`).remove();
                }
                /*console.log(result)
                Array.isArray(result) && result.forEach(line => {
                    print += `<div class="terminal-line">${line == "" ? "<br>" : formatString(line)}</div>`
                });*/


                type_history.push(terminal_input.value)
                terminal_input.value = "";
                setTimeout(() => {
                    terminal.scrollTop = terminal.scrollHeight;
                }, 200)
                e.preventDefault();
                current_index = type_history.length;
            }

            setTimeout(() => {
                terminal_typein.style.height = "10px";
                terminal_typein.style.height = terminal_input.scrollHeight + 'px';
            }, 100);
        }

        await fetch("./system/packages.json").then(res => {
            return res.json();
        }).then(content => {
            pkgs = content;
        }).finally(() => {
            app.hideLoading();
            return;
        });

        app.hideLoading();
    }, 200)
}
)();
