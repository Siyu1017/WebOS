(async function (callback = function () { }) {
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

    const CMD_VERSION = "1.0.0";

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

    function omitString(org) {
        if (org.length <= 21) return org;
        return org.slice(0, 11) + "…" + org.slice(-9)
    }

    function formatString(str, omit = false) {
        // console.log(str)
        try {
            if (omit == true) {
                str = omitString(str);
            }
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

        function initCmd() {
            terminal_lines.innerHTML =
                `                                      
<div class="terminal-group">
            <div class="terminal-typed">
                <div class="terminal-line">WebOS Command [Version ${CMD_VERSION}]</div>
                <div class="terminal-line">(c) WebOS. All rights reserved.</div>
                <div class="terminal-line"><br></div>
                <div class="terminal-line">Type "help" for available commands</div>
            </div></div>
`;
        }

        initCmd();

        function generateResponse(id) {
            var parent = terminal_lines.querySelector(`[data-id="${id}"]`);
            var createLine = (content, type = "default", format = false) => {
                parent.innerHTML += `<div class="terminal-line terminal-line-${type}">${format == true ? formatString(content) : content}</div>`;
                if (terminal.scrollTop >= terminal.scrollHeight - terminal.offsetHeight * 2) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            }
            var createLineFromArray = (array, type, format = false) => {
                array.forEach(line => {
                    createLine(line, type, format);
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
            var createCustomTable = () => {
                var table = document.createElement("div");
                table.className = "terminal-table";
                var createCol = (classList = []) => {
                    var col = document.createElement("div");
                    classList.concat(["terminal-col"]).forEach(item => {
                        col.classList.add(item);
                    })
                    table.appendChild(col);
                    var createRow = (content, classList = [], format = false) => {
                        var row = document.createElement("div");
                        classList.concat(["terminal-row"]).forEach(item => {
                            row.classList.add(item);
                        })
                        row.innerHTML = format == true ? formatString(content) : content;
                        col.appendChild(row);
                    }
                    return { createRow };
                }
                parent.appendChild(table);
                return { table, createCol };
            }
            return { id, parent, createLine, createLineFromArray, createTable, createCustomTable }
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
                    var mode = "--none";
                    content.split(" ").forEach(obj => {
                        var temp = obj.match(/--[A-z0-9-]+/gi) || null;
                        if (temp != null) {
                            mode = temp[temp.length - 1];
                        }
                    })
                    if (content == "all") {
                        // Install all
                        pkgs.forEach(pkg => {
                            System.loadSystemApps(pkg.scripts);
                        })
                        api.createLine(`${pkgs.length} package(s) installed.`, "green");
                    } else if (mode.search("--multiple") > -1) {
                        // Install multiple packages
                        var content = content.replace(mode, "");
                        var mode = mode.replace("--multiple", "");
                        mode = mode.replace("-", "");
                        if (mode != "index" && mode != "name") {
                            return api.createLineFromArray([
                                `The type "${mode}" doesn't exist.`,
                                `Please use "package install <packages> --multiple-<type>" to install multiple packages.`,
                                `<packages> : Use spaces to separate indexes or names`,
                                `<type> : index, name`,
                            ], "red", true);
                        }
                        var specified = content.trim().split(" ");
                        var pkg_count = 0;
                        pkgs.forEach((pkg, i) => {
                            console.log(i, ",", specified.includes(i.toString()), ",", specified.includes(pkg.name))
                            if (mode == "index") {
                                if (specified.includes(i.toString())) {
                                    pkg_count++;
                                    System.loadSystemApps(pkg.scripts, () => {
                                        api.createLine(`Package "${formatString(i)}" installed.`, "green");
                                    });
                                }
                            } else if (mode == "name") {
                                if (specified.includes(pkg.name)) {
                                    pkg_count++;
                                    System.loadSystemApps(pkg.scripts, () => {
                                        api.createLine(`Package "${formatString(pkg.name)}" installed.`, "green");
                                    });
                                }
                            }
                        })
                        if (pkg_count == 0) {
                            api.createLine(`No packages found.`, "red");
                        }
                    } else if (pkgs[content]) {
                        // Install by index
                        System.loadSystemApps(pkgs[content].scripts);
                        api.createLine(`Package "${content}" installed.`, "green");
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
                            // Install by name
                            return System.loadSystemApps(script, () => {
                                api.createLine(`Package "${formatString(name)}" installed.`, "green");
                            });
                        } else {
                            return api.createLineFromArray([
                                `'${formatString(content)}' is not a available package.`,
                                `Please use "package install [all|index|name] [--multiple-[index|name]]" to install the packages,`,
                                `and use "package list" to list all the packages.`
                            ], "red");
                        }
                    }
                },
                list: (content, id) => {
                    var api = generateResponse(id);
                    var table = {
                        "Name": [],
                        "Index": []
                    };
                    pkgs.forEach((pkg, i) => {
                        table["Name"].push(pkg.name)
                        table["Index"].push(i)
                    })
                    api.createTable(table)
                    return;
                },
                __err: (content, id, code) => {
                    var api = generateResponse(id);
                    return api.createLineFromArray([
                        `'${formatString(content)}' is not a valid package command.`,
                        `Please use "package install [all|index|name] [--multiple-[index|name]]" to install the packages,`,
                        `and use "package list" to list all the packages.`
                    ], "red");
                }
            },
            color: (content, id) => {
                var api = generateResponse(id);
                var colors = ["red", "yellow", "green", "white", "default"];

                if (!colors[Number(content.trim())] || content.trim().length < 1) {
                    api.createLineFromArray([
                        `Please use "color <code>" to set the color of the terminal.`,
                        `<code> : Displayed as follows.`
                    ], "red", true);
                    var table = api.createCustomTable();
                    var color_col = table.createCol();
                    var code_col = table.createCol();

                    color_col.createRow("Colors");
                    code_col.createRow("Codes");

                    colors.forEach((color, i) => {
                        color_col.createRow(color, [`terminal-line-${color}`]);
                        code_col.createRow(i);
                    })
                    return;
                } else {
                    if (colors[Number(content.trim())] == "default") {
                        document.head.querySelectorAll(`[data-element="terminal-style"]`).forEach(style => {
                            style.remove();
                        })
                    } else {
                        var style = document.createElement("style");
                        style.setAttribute("data-element", "terminal-style");
                        style.innerHTML = `[app-hash-content="${app.hash}"] .terminal * {
                        --terminal-border-color: var(--terminal-color-${colors[Number(content.trim())]});
                        color: var(--terminal-color-${colors[Number(content.trim())]}) !important;
                    }`;
                        document.head.appendChild(style);
                    }
                }
            },
            version: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([`Version: ${CMD_VERSION}`])
            },
            date: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([new Date(Date.now()).format("yyyy/MM/dd")])
            },
            time: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray([new Date(Date.now()).format("hh:mm:ss")])
            },
            help: (content, id) => {
                var api = generateResponse(id);
                return api.createLineFromArray(Object.keys(command_list).sort())
            },
            clear: () => {
                setTimeout(() => {
                    initCmd();
                }, 500)
            },
            prank: (content, id) => {
                var api = generateResponse(id);
                var line_length = isCustomNumber(content) ? content : 1000;
                var created = 0;
                function write() {
                    api.createLine(randomString(terminal_lines.offsetWidth / 7.5));
                    created++;
                    if (created < line_length) {
                        setTimeout(write, 25);
                    }
                }
                write();
            },
            net: {
                open: (content, id) => {
                    var api = generateResponse(id);
                    System.loadSystemApps(["packages/webviewer/app"], () => {
                        window.webViewer.open(content);
                        api.createLine(`Opened "<a href="${content}" target="_blank">${formatString(content)}</a>" successfully.`);
                    });
                }
            },
            exit: (content, id) => {
                app.close();
            },
            run: (content, id) => {
                var command = content.split(" ")[0].split(".");
                var api = generateResponse(id);
                if (command[0] == "webos") {
                    command = command.slice(1);
                    console.log(command)
                    if (!window.webos[command[0]]) {
                        console.log(1)
                        return api.createLine(`Missing script: "${content}"`, "red", true);
                    }
                    if (typeof window.webos[command[0]][command[1]] != "function") {
                        console.log(2, typeof window.webos[command[0]][command[1]], command[1])
                        return api.createLine(`Missing script: "${content}"`, "red", true);
                    }
                    return window.webos[command[0]][command[1]](content.replace(content.split(" ")[0], "").trim());
                }
            },
            kill: (content, id) => {
                var api = generateResponse(id);
                if (content.trim().length == 0) {
                    var table = api.createCustomTable();
                    var name_col = table.createCol();
                    var hash_col = table.createCol();

                    name_col.createRow("Name");
                    hash_col.createRow("Hash");

                    Object.values(running_apps).forEach(app => {
                        name_col.createRow(app.name ? app.name : " ");
                        hash_col.createRow(app.hash ? app.hash : " ");
                    })

                    return;
                }
                if (content.trim() == "all") {
                    Object.values(running_apps).forEach(app => {
                        app.close();
                        api.createLine(`App [ ${app.name} ] has been killed.`, "green");
                    })
                }
                if (!running_apps[content.trim()]) {
                    return api.createLine(`App [ ${content.trim()} ] doesn't exist.`, "red");
                }
                running_apps[content.trim()].close();
                return api.createLine(`App [ ${content.trim()} ] has been killed.`, "green");
            }
        }

        function cmdParser(cmd, id, current = command_list) {
            console.log(cmd)
            var api = generateResponse(id);
            if (current[cmd[0]]) {
                if (isFunction(current[cmd[0]]) && current[cmd[0]].name.slice(0, 2) != "__") {
                    return current[cmd[0]](cmd.slice(1).join(" "), id);
                } else if (cmd.length == 1) {
                    var list = Object.keys(current[cmd[0]]);
                    if (list.length < 1) {
                        if (isFunction(current["__err"])) {
                            current["__err"](current[cmd[0]].name.slice(0, 2) == "__" ? cmd.join(" ") : cmd.slice(1).join(" "), id, "0");
                        } else {
                            api.createLineFromArray([
                                `'${formatString(cmd.join(" "))}' is not recognized as an internal or external command,`,
                                `operable program or batch file.`,
                                '',
                                `Type "help" for available commands`
                            ], "red")
                        }
                    } else {
                        var command_list = Object.keys(current[cmd[0]]);
                        command_list.forEach((command, i) => {
                            if (command.slice(0, 2) == "__") {
                                command_list.splice(i, 1);
                            }
                        })
                        api.createLineFromArray(command_list);
                    }
                } else {
                    cmdParser(cmd.slice(1), id, current[cmd[0]]);
                }
            } else {
                if (isFunction(current["__err"])) {
                    return current["__err"](Array.isArray(cmd) ? cmd.join(" ") : "", id, "0");
                } else {
                    api.createLineFromArray([
                        `'${formatString(Array.isArray(cmd) ? cmd.join(" ") : ""/*, true*/)}' is not recognized as an internal or external command,`,
                        `operable program or batch file.`,
                        '',
                        `Type "help" for available commands`
                    ], "red");
                }
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
                    current_index < type_history.length - 1 ? (current_index++) : (current_index = type_history.length - 1);
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
                e.preventDefault();
                runCommand(terminal_input.value);
                /*
                var lines = terminal_input.value.split("\n");
                var line_id = randomString(96);
                var html = "";
                lines.forEach((line, i) => {
                    if (i == 0) {
                        var line = line.split(" ");
                        html += `<div class="terminal-line"><span class="terminal-line-yellow">${formatString(line[0])}</span> ${formatString(line.slice(1).join(' '))}</div>`;
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
                */
                // ---------------------------------------------------------------- //
                /*console.log(result)
                Array.isArray(result) && result.forEach(line => {
                    print += `<div class="terminal-line">${line == "" ? "<br>" : formatString(line)}</div>`
                });*/
                // ---------------------------------------------------------------- //
                /*
                                type_history.push(terminal_input.value)
                                terminal_input.value = "";
                                setTimeout(() => {
                                    terminal.scrollTop = terminal.scrollHeight;
                                }, 200)
                                e.preventDefault();
                                current_index = type_history.length;
                                */
            }

            setTimeout(() => {
                terminal_typein.style.height = "10px";
                terminal_typein.style.height = terminal_input.scrollHeight + 'px';
            }, 100);
        }

        var cmd = {
            commands: {},
            print: async (content) => {
                function isFile(input) {
                    if ('File' in window && input instanceof File)
                        return true;
                    else return false;
                }

                function isBlob(input) {
                    if ('Blob' in window && input instanceof Blob)
                        return true;
                    else return false;
                }

                if (isBlob(content) || isFile(content)) {
                    var reader = new FileReader();
                    reader.onload = function () {
                        content = reader.result;
                        console.log(content);
                    }
                    await reader.readAsText(content);
                } else {
                    console.log(content);
                }
            },
            prompt: (tip) => {
                
            },
            hook: (name, object) => {
                commands[name] = commands[name] ? _.mergeDeep(commands[name], object) : object;
            }
        };

        function commandParser(command) {
            var api = generateResponse(id);
            if (current[cmd[0]]) {
                if (isFunction(current[cmd[0]]) && current[cmd[0]].name.slice(0, 2) != "__") {
                    return current[cmd[0]](cmd.slice(1).join(" "), id);
                } else if (cmd.length == 1) {
                    var list = Object.keys(current[cmd[0]]);
                    if (list.length < 1) {
                        if (isFunction(current["__err"])) {
                            current["__err"](current[cmd[0]].name.slice(0, 2) == "__" ? cmd.join(" ") : cmd.slice(1).join(" "), id, "0");
                        } else {
                            api.createLineFromArray([
                                `'${formatString(cmd.join(" "))}' is not recognized as an internal or external command,`,
                                `operable program or batch file.`,
                                '',
                                `Type "help" for available commands`
                            ], "red")
                        }
                    } else {
                        var command_list = Object.keys(current[cmd[0]]);
                        command_list.forEach((command, i) => {
                            if (command.slice(0, 2) == "__") {
                                command_list.splice(i, 1);
                            }
                        })
                        api.createLineFromArray(command_list);
                    }
                } else {
                    cmdParser(cmd.slice(1), id, current[cmd[0]]);
                }
            } else {
                if (isFunction(current["__err"])) {
                    return current["__err"](Array.isArray(cmd) ? cmd.join(" ") : "", id, "0");
                } else {
                    api.createLineFromArray([
                        `'${formatString(Array.isArray(cmd) ? cmd.join(" ") : ""/*, true*/)}' is not recognized as an internal or external command,`,
                        `operable program or batch file.`,
                        '',
                        `Type "help" for available commands`
                    ], "red");
                }
            }
        }

        function runCommand(command) {
            var lines = command.split("\n");
            var line_id = randomString(96);
            var html = "";
            lines.forEach((line, i) => {
                if (i == 0) {
                    var line = line.split(" ");
                    html += `<div class="terminal-line"><span class="terminal-line-yellow">${formatString(line[0])}</span> ${formatString(line.slice(1).join(' '))}</div>`;
                } else {
                    html += `<div class="terminal-line">${formatString(line)}</div>`
                }
            })
            terminal_lines.innerHTML += `<div class="terminal-group" style="margin: 0"><span class="terminal-path">${formatString(path + ">")}</span><div class="terminal-typed">${html}</div></div><div class="terminal-group" style="flex-direction: column;" data-id="${line_id}"></div>`;

            if (command.trim().length > 0) {
                cmdParser(command.trim().split(" "), line_id);
            } else {
                terminal_lines.querySelector(`[data-id="${line_id}"]`).remove();
            }
            /*console.log(result)
            Array.isArray(result) && result.forEach(line => {
                print += `<div class="terminal-line">${line == "" ? "<br>" : formatString(line)}</div>`
            });*/


            type_history.push(command)
            terminal_input.value = "";
            setTimeout(() => {
                terminal.scrollTop = terminal.scrollHeight;
            }, 200)
            current_index = type_history.length;
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

        window.webos.cmd = {
            runCommand
        }

        return callback({ runCommand });
    }, 200)
}
)(window._cmdcallback || function () { });
