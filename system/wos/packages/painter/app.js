(() => {
    var w_app = new App("PAINTER" + Date.now(), null, {
        width: 420,
        height: 300,
        title: " ",
        backgroundColor: "rgb(36, 36, 36)",
        icon: "data:image/svg+xml,%3Csvg class='svg-24' height='100' stroke='%23565656' preserveAspectRatio='xMidYMid meet' viewBox='0 0 100 100' width='100' x='0' xmlns='http://www.w3.org/2000/svg' y='0'%3E%3Cpath class='svg-stroke-primary' d='M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='6'%3E%3C/path%3E%3C/svg%3E",
        showloading: true,
        loadingColor: "#fff"
    })

    var app = w_app.execute(`<div class="editor"><div class="bottom"><div class="mode-bar unloaded" id="modes"><div class="modes"><div class="mode active" id="draw" data-popup="pen"><div class="mode-icon"><svg class="svg-24" height="100" preserveaspectratio="xMidYMid meet" viewbox="0 0 100 100" width="100" x="0" xmlns="http://www.w3.org/2000/svg" y="0"><path class="svg-stroke-primary" d="M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"></path></svg></div><div class="mode-popup" popup-name="pen"><div class="pen-size group"><label>Size ( px )</label> <input type="number" min="1" max="48" id="size"></div><div class="pen-color group"><label>Color ( current color : <span class="preview-color" id="preview-color"></span> )</label><div class="colors" id="colors"></div></div></div></div></div><div class="helps"></div></div><div class="drawer unloaded" id="drawer"><div class="drawer-mask" id="mask"><canvas id="canvas" hidden class="canvas"></canvas><canvas id="image" hidden class="canvas"></canvas></div></div></div></div>`);

    app.elements.window.querySelector(".window-frame-application-toolbar-title-icon").src = "data:image/svg+xml,%3Csvg class='svg-24' height='100' stroke='%23eee' preserveAspectRatio='xMidYMid meet' viewBox='0 0 100 100' width='100' x='0' xmlns='http://www.w3.org/2000/svg' y='0'%3E%3Cpath class='svg-stroke-primary' d='M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='6'%3E%3C/path%3E%3C/svg%3E";

    w_app.loadStyles("./system/wos/packages/painter/app.css", "url", () => {
        w_app.hideLoading();
        app.elements.window.querySelector(".window-frame-application-toolbar-title").innerHTML += `<div class="top"><div class="action-bar unloaded" id="actions"><div class="action" data-action="file"><div class="action-title">File</div><div class="action-popup" action-popup="file"><div class="item" disabled="disabled"><div class="command-name">Open ( unfinished )</div><div class="command-key">Ctrl+O</div></div><div class="separation-line"></div><div class="item" disabled="disabled"><div class="command-name">Save ( unfinished )</div><div class="command-key">Ctrl+S</div></div><div class="item" id="download"><div class="command-name">Download</div><div class="command-key">Ctrl+Shift+S</div></div></div></div><div class="action" data-action="edit"><div class="action-title">Edit</div><div class="action-popup" action-popup="edit"><div class="item" disabled="disabled" id="undo"><div class="command-name">Undo</div><div class="command-key">Ctrl+Z</div></div><div class="item" disabled="disabled" id="redo"><div class="command-name">Redo</div><div class="command-key">Ctrl+Y</div></div><div class="separation-line"></div><div class="item" disabled="disabled"><div class="command-name">Cut ( unfinished )</div><div class="command-key">Ctrl+X</div></div><div class="item" disabled="disabled"><div class="command-name">Copy ( unfinished )</div><div class="command-key">Ctrl+C</div></div><div class="item" disabled="disabled"><div class="command-name">Paste ( unfinished )</div><div class="command-key">Ctrl+V</div></div></div></div><div class="action" data-action="version"><div class="action-title">Autocorrect</div><div class="action-popup" action-popup="version" data-select-group-parent="algorithm"><div class="item select selected" data-select-group="algorithm" data-select-value=""><div class="command-name">Close</div></div><div class="item select" data-select-group="algorithm" data-select-value="DouglasPeucker" disabled="disabled"><div class="command-name">Douglas-Peucker algorithm</div></div><div class="item select" data-select-group="algorithm" data-select-value="RamerDouglasPeucker" disabled="disabled"><div class="command-name">Ramer-Douglas-Peucker algorithm</div></div><div class="item select" data-select-group="algorithm" data-select-value="VisvalingamWhyatt" disabled="disabled"><div class="command-name">Visvalingam-Whyatt algorithm</div></div></div></div></div></div>`;

        app.elements.window.classList.add("editor");
        app.elements.window.querySelector(".top").addEventListener("mousedown", (e) => {
            e.stopPropagation();
            e.preventDefault();
        })
        app.elements.window.querySelector(".window-frame-application-toolbar-title-content").remove();

        /**
     * Code by Wetrain (c) 2023
     * All rights reserved.
     */
        "use strict";
        var $ = (e, t) => !0 == t ? app.elements.window.querySelectorAll(e) : app.elements.window.querySelector(e)
            , dragger = (e, t) => {
                if (t = t || {},
                    "object" != typeof $(e) || null === $(e))
                    return console.warn("The parameter target type must be a valid HTMLElement.");
                if (t && "[object Object]" !== Object.prototype.toString.call(t))
                    return console.warn("The parameter config type must be Object.");
                var r = $(e)
                    , n = {
                        blur: t.blur || window,
                        end: t.end || window,
                        move: t.move || window
                    }
                    , o = {
                        dragstart: {
                            target: r,
                            event: ["mousedown", "touchstart"]
                        },
                        dragmove: {
                            target: n.move,
                            event: ["mousemove", "touchmove"]
                        },
                        dragend: {
                            target: n.end,
                            event: ["mouseup", "touchend"]
                        },
                        dragout: {
                            target: n.blur,
                            event: ["blur"]
                        }
                    };
                function a(e, t) {
                    !1 != o.hasOwnProperty(e) && o[e].event.forEach(r => {
                        o[e].target.addEventListener(r, e => t(e))
                    }
                    )
                }
                function u(e) {
                    var t = e.getBoundingClientRect()
                        , r = window.pageXOffset || document.documentElement.scrollLeft
                        , n = window.pageYOffset || document.documentElement.scrollTop;
                    return {
                        top: t.top + n,
                        left: t.left + r
                    }
                }
                function l(e) {
                    return {
                        x: u(e).left,
                        y: u(e).top
                    }
                }
                var g = {
                    dragin: "dragstart",
                    dragover: "dragover",
                    dragout: "dragleave"
                };
                function d(e) {
                    dragging = e ? !0 == e : !0 != dragging
                }
                function c(e, t, r) {
                    !1 != g.hasOwnProperty(e) && null !== t && t.addEventListener(g[e], e => r(e))
                }
                return {
                    On: a,
                    When: c,
                    Toggle: d
                }
            }
            ;
        function createHDCanvas(t, e, a) {
            let r = window.devicePixelRatio || 1;
            t.width = e * r,
                t.height = a * r,
                t.style.width = `${e}px`,
                t.style.height = `${a}px`;
            let i = t.getContext("2d");
            return i.scale(r, r),
                t
        }
        function getDistance(t, e, a) {
            var r = a.x - e.x
                , i = a.y - e.y;
            return Math.abs((i * t.x - r * t.y + a.x * e.y - a.y * e.x) / Math.sqrt(r * r + i * i))
        }
        function simplifyDP(t, e) {
            for (var a = 0, r = 0, i = 1; i < t.length - 1; i++) {
                var n = getDistance(t[i], t[0], t[t.length - 1]);
                n > a && (a = n,
                    r = i)
            }
            if (a > e) {
                var o = t.slice(0, r + 1)
                    , s = t.slice(r)
                    , l = simplifyDP(o, e)
                    , c = simplifyDP(s, e);
                return l.slice(0, l.length - 1).concat(c)
            }
            return [t[0], t[t.length - 1]]
        }
        function DouglasPeucker(t, e) {
            if (!(t.length < 2)) {
                var a = simplifyDP(t, 5);
                e.beginPath(),
                    e.moveTo(a[0].x, a[0].y);
                for (var r = 1; r < a.length - 2; r++) {
                    var i = (a[r].x + a[r + 1].x) / 2
                        , n = (a[r].y + a[r + 1].y) / 2;
                    e.quadraticCurveTo(a[r].x, a[r].y, i, n)
                }
                e.lineTo(a[a.length - 1].x, a[a.length - 1].y),
                    e.stroke()
            }
        }
        function getTriangleArea(t, e, a) {
            return Math.abs((t.x * (e.y - a.y) + e.x * (a.y - t.y) + a.x * (t.y - e.y)) / 2)
        }
        function simplifyVW(t, e) {
            for (var a = [], r = 1; r < t.length - 1; r++) {
                var i = getTriangleArea(t[r - 1], t[r], t[r + 1]);
                a.push(i)
            }
            for (; a.length > 0 && Math.min(...a) < e;) {
                var n = a.indexOf(Math.min(...a));
                t.splice(n + 1, 1),
                    a.splice(n, 1)
            }
            return t
        }
        function VisvalingamWhyatt(t, e) {
            if (!(t.length < 2)) {
                var a = simplifyVW(t, 1);
                e.beginPath(),
                    e.moveTo(a[0].x, a[0].y);
                for (var r = 1; r < a.length - 2; r++) {
                    var i = (a[r].x + a[r + 1].x) / 2
                        , n = (a[r].y + a[r + 1].y) / 2;
                    e.quadraticCurveTo(a[r].x, a[r].y, i, n)
                }
                e.lineTo(a[a.length - 1].x, a[a.length - 1].y),
                    e.stroke()
            }
        }
        function getDistance(t, e, a) {
            var r = a.x - e.x
                , i = a.y - e.y;
            return Math.abs((i * t.x - r * t.y + a.x * e.y - a.y * e.x) / Math.sqrt(r * r + i * i))
        }
        function simplify(t, e) {
            for (var a = 0, r = 0, i = 1; i < t.length - 1; i++) {
                var n = getDistance(t[i], t[0], t[t.length - 1]);
                n > a && (a = n,
                    r = i)
            }
            if (a > e) {
                var o = t.slice(0, r + 1)
                    , s = t.slice(r)
                    , l = simplify(o, e)
                    , c = simplify(s, e);
                return l.slice(0, l.length - 1).concat(c)
            }
            return [t[0], t[t.length - 1]]
        }
        function RamerDouglasPeucker(t, e) {
            if (!(t.length < 2)) {
                var a = simplify(t, 5);
                e.beginPath(),
                    e.moveTo(a[0].x, a[0].y);
                for (var r = 1; r < a.length - 2; r++) {
                    var i = (a[r].x + a[r + 1].x) / 2
                        , n = (a[r].y + a[r + 1].y) / 2;
                    e.quadraticCurveTo(a[r].x, a[r].y, i, n)
                }
                e.lineTo(a[a.length - 1].x, a[a.length - 1].y),
                    e.stroke()
            }
        }
        var colors = ["rgb(0, 0, 0)", "rgb(38, 38, 38)", "rgb(89, 89, 89)", "rgb(140, 140, 140)", "rgb(191, 191, 191)", "rgb(217, 217, 217)", "rgb(233, 233, 233)", "rgb(245, 245, 245)", "rgb(250, 250, 250)", "rgb(255, 255, 255)", "rgb(225, 60, 57)", "rgb(231, 95, 51)", "rgb(235, 144, 58)", "rgb(245, 219, 77)", "rgb(114, 192, 64)", "rgb(89, 191, 192)", "rgb(66, 144, 247)", "rgb(54, 88, 226)", "rgb(106, 57, 201)", "rgb(216, 68, 147)", "rgb(251, 233, 230)", "rgb(252, 237, 225)", "rgb(252, 239, 212)", "rgb(252, 251, 207)", "rgb(231, 246, 213)", "rgb(218, 244, 240)", "rgb(217, 237, 250)", "rgb(224, 232, 250)", "rgb(237, 225, 248)", "rgb(246, 226, 234)", "rgb(255, 163, 158)", "rgb(255, 187, 150)", "rgb(255, 213, 145)", "rgb(255, 251, 143)", "rgb(183, 235, 143)", "rgb(135, 232, 222)", "rgb(145, 213, 255)", "rgb(173, 198, 255)", "rgb(211, 173, 247)", "rgb(255, 173, 210)", "rgb(255, 77, 79)", "rgb(255, 122, 69)", "rgb(255, 169, 64)", "rgb(255, 236, 61)", "rgb(115, 209, 61)", "rgb(54, 207, 201)", "rgb(64, 169, 255)", "rgb(89, 126, 247)", "rgb(146, 84, 222)", "rgb(247, 89, 171)", "rgb(207, 19, 34)", "rgb(212, 56, 13)", "rgb(212, 107, 8)", "rgb(212, 177, 6)", "rgb(56, 158, 13)", "rgb(8, 151, 156)", "rgb(9, 109, 217)", "rgb(29, 57, 196)", "rgb(83, 29, 171)", "rgb(196, 29, 127)", "rgb(130, 0, 20)", "rgb(135, 20, 0)", "rgb(135, 56, 0)", "rgb(97, 71, 0)", "rgb(19, 82, 0)", "rgb(0, 71, 79)", "rgb(0, 58, 140)", "rgb(6, 17, 120)", "rgb(34, 7, 94)", "rgb(120, 6, 80)"]
            , Datas = {
                CanvasSize: {
                    width: 480,
                    height: 320
                },
                Objects: [],
                Status: {
                    drawing: !1,
                    mode: "draw",
                    selected: !1,
                    dragging: !1
                },
                Style: {
                    Stroke: {
                        Color: colors[36],
                        Size: 8
                    },
                    Fill: {
                        Color: "#000"
                    }
                },
                Temp: {
                    Mouse: {
                        x: 0,
                        y: 0
                    },
                    Points: [],
                    Objects: [],
                    ExtremeValue: {
                        x: [0, 0],
                        y: [0, 0]
                    },
                    DIndex: 0,
                    History: []
                },
                Limit: {
                    max: 48,
                    min: 1
                },
                Algorithm: ""
            }
            , $ = (t, e) => !0 == e ? document.querySelectorAll(t) : document.querySelector(t)
            , showActionPopup = !1;
        function drawPoints(t, e, a, i) {
            var o = t
                , r = e;
            !0 != a && createHDCanvas(o, Datas.CanvasSize.width, Datas.CanvasSize.height);
            let s = o.getContext("2d");
            if (1 == i) {
                s.lineWidth = Datas.Style.Stroke.Size,
                    s.strokeStyle = Datas.Style.Stroke.Color;
                var n = r;
                (r = {}).points = n,
                    r.algorithm = Datas.Algorithm
            } else
                s.lineWidth = r.style.strokeWidth,
                    s.strokeStyle = r.style.strokeColor;
            if (s.imageSmoothingEnabled = !0,
                s.lineJoin = "round",
                s.lineCap = "round",
                !0 == a) {
                if ("RamerDouglasPeucker" == r.algorithm)
                    return RamerDouglasPeucker(r.points, s);
                if ("DouglasPeucker" == r.algorithm)
                    return DouglasPeucker(r.points, s);
                if ("VisvalingamWhyatt" == r.algorithm)
                    return VisvalingamWhyatt(r.points, s)
            }
            try {
                if (r.points.length <= 2)
                    s.beginPath(),
                        s.moveTo(r.points[0].x, r.points[0].y),
                        s.lineTo(r.points[1].x, r.points[1].y),
                        s.stroke();
                else
                    for (let d = 0; d < r.points.length - 2; d++)
                        s.beginPath(),
                            0 == d ? (s.moveTo(r.points[d].x, r.points[d].y),
                                s.quadraticCurveTo(r.points[d + 1].x, r.points[d + 1].y, r.points[d + 1].x + (r.points[d + 2].x - r.points[d + 1].x) / 2, r.points[d + 1].y + (r.points[d + 2].y - r.points[d + 1].y) / 2)) : d == r.points.length - 3 ? (s.moveTo(r.points[d].x + (r.points[d + 1].x - r.points[d].x) / 2, r.points[d].y + (r.points[d + 1].y - r.points[d].y) / 2),
                                    s.quadraticCurveTo(r.points[d + 1].x, r.points[d + 1].y, r.points[d + 2].x, r.points[d + 2].y)) : (s.moveTo(r.points[d].x + (r.points[d + 1].x - r.points[d].x) / 2, r.points[d].y + (r.points[d + 1].y - r.points[d].y) / 2),
                                        s.quadraticCurveTo(r.points[d + 1].x, r.points[d + 1].y, r.points[d + 1].x + (r.points[d + 2].x - r.points[d + 1].x) / 2, r.points[d + 1].y + (r.points[d + 2].y - r.points[d + 1].y) / 2)),
                            s.stroke()
            } catch (c) {
                console.log("Error :", c)
            }
        }
        function getPosition(t) {
            function e(t) {
                var e = t.getBoundingClientRect()
                    , a = window.pageXOffset || document.documentElement.scrollLeft
                    , i = window.pageYOffset || document.documentElement.scrollTop;
                return {
                    top: e.top + i,
                    left: e.left + a
                }
            }
            return {
                x: e(t).left,
                y: e(t).top
            }
        }
        document.addEventListener("contextmenu", t => {
            t.preventDefault()
        }
        ),
            window.addEventListener("keydown", t => {
                if (t.ctrlKey) {
                    if (t.preventDefault(),
                        "z" == t.key)
                        return draw.undo();
                    if ("y" == t.key)
                        return draw.redo();
                    if (t.shiftKey && "S" == t.key)
                        return download()
                }
            }
            ),
            $(".action", !0).forEach(t => {
                t.addEventListener("click", () => {
                    showActionPopup = !0,
                        $(".action-popup.active", !0).forEach(t => {
                            t.classList.remove("active")
                        }
                        ),
                        $(`[action-popup="${t.getAttribute("data-action")}"]`).classList.add("active")
                }
                ),
                    t.addEventListener("mousemove", () => {
                        !0 == showActionPopup && ($(".action-popup.active", !0).forEach(t => {
                            t.classList.remove("active")
                        }
                        ),
                            $(".action.active", !0).forEach(t => {
                                t.classList.remove("active")
                            }
                            ),
                            t.classList.add("active"),
                            $(`[action-popup="${t.getAttribute("data-action")}"]`).classList.add("active"))
                    }
                    )
            }
            ),
            document.addEventListener("mousedown", t => {
                var e = !1;
                if ($(".action", !0).forEach(a => {
                    a.contains(t.target) && (e = !0)
                }
                ),
                    !0 != e) {
                    var a = !1;
                    $(".action.popup", !0).forEach(e => {
                        e.contains(t.target) && (a = !0)
                    }
                    ),
                        !1 == a && !0 == showActionPopup && (showActionPopup = !1,
                            $(".action.active", !0).forEach(t => {
                                t.classList.remove("active")
                            }
                            ),
                            $(".action-popup.active", !0).forEach(t => {
                                t.classList.remove("active")
                            }
                            ))
                }
            }
            ),
            $(".mode", !0).forEach(t => {
                t.addEventListener("click", () => {
                    $(".mode.active", !0).forEach(t => {
                        t.classList.remove("active")
                    }
                    ),
                        t.classList.add("active")
                }
                ),
                    t.addEventListener("click", e => {
                        t.getAttribute("data-popup") && !$(`[popup-name="${t.getAttribute("data-popup")}"]`).contains(e.target) && $(`[popup-name="${t.getAttribute("data-popup")}"]`).classList.toggle("active")
                    }
                    )
            }
            ),
            document.addEventListener("mousedown", t => {
                var e = !1
                    , a = !1;
                if ($("[popup-name]", !0).forEach(a => {
                    a.contains(t.target) && (e = !0)
                }
                ),
                    $(".mode", !0).forEach(e => {
                        e.contains(t.target) && (a = !0)
                    }
                    ),
                    !1 == e) {
                    if (!0 == a)
                        return;
                    $(".mode-popup.active", !0).forEach(t => {
                        t.classList.remove("active")
                    }
                    )
                }
            }
            ),
            $("#size").value = Datas.Style.Stroke.Size,
            $("#size").addEventListener("change", () => {
                $("#size").value < Datas.Limit.min && ($("#size").value = Datas.Limit.min),
                    $("#size").value > Datas.Limit.max && ($("#size").value = Datas.Limit.max),
                    Datas.Style.Stroke.Size = $("#size").value
            }
            ),
            $("#preview-color").style.background = Datas.Style.Stroke.Color,
            $("[data-select-group-parent]", !0).forEach(t => {
                $(`[data-select-group="${t.getAttribute("data-select-group-parent")}"]`, !0).forEach(t => {
                    t.addEventListener("click", () => {
                        $(`[data-select-group="${t.getAttribute("data-select-group")}"].selected`, !0).forEach(t => {
                            t.classList.remove("selected")
                        }
                        ),
                            t.classList.add("selected"),
                            Datas.Algorithm = t.getAttribute("data-select-value")
                    }
                    )
                }
                )
            }
            ),
            colors.forEach((t, e) => {
                var a = document.createElement("li");
                a.setAttribute("data-value", t),
                    a.className = "color-block",
                    a.innerHTML = `<div class="color-block-inner" style="background-color: ${t}"></div>`,
                    a.addEventListener("click", () => {
                        $("#preview-color").style.background = t,
                            Datas.Style.Stroke.Color = t
                    }
                    ),
                    $("#colors").appendChild(a)
            }
            );
        var draw = {
            currentIndex: -1,
            canvas: $("#canvas"),
            image: $("#image"),
            mask: $("#mask"),
            async init() {
                function t(t) {
                    "touchend" == t.type && t.preventDefault(),
                        !0 == Datas.Status.drawing && (createHDCanvas(canvas, Datas.CanvasSize.width, Datas.CanvasSize.height),
                            0 != Datas.Temp.DIndex && (Datas.Objects = Datas.Temp.History,
                                createHDCanvas(image, Datas.CanvasSize.width, Datas.CanvasSize.height),
                                Datas.Objects.forEach(t => {
                                    drawPoints(image, t, !0)
                                }
                                ),
                                Datas.Temp.DIndex = 0,
                                Datas.Temp.History = []),
                            draw.currentIndex++,
                            Datas.Status.drawing = !1,
                            Datas.Objects.push({
                                position: {
                                    x: Datas.Temp.ExtremeValue.x[0],
                                    y: Datas.Temp.ExtremeValue.y[0]
                                },
                                size: {
                                    width: Datas.Temp.ExtremeValue.x[1] - Datas.Temp.ExtremeValue.x[0],
                                    height: Datas.Temp.ExtremeValue.y[1] - Datas.Temp.ExtremeValue.y[0]
                                },
                                style: {
                                    strokeColor: Datas.Style.Stroke.Color,
                                    strokeWidth: Datas.Style.Stroke.Size
                                },
                                algorithm: Datas.Algorithm,
                                points: Datas.Temp.Points,
                                image: "image url",
                                rotate: 0,
                                scale: 1,
                                ExtremeValue: Datas.Temp.ExtremeValue
                            }),
                            drawPoints(image, Datas.Temp.Points, !0, 1),
                            $("#redo").setAttribute("disabled", ""))
                }
                $("#drawer").classList.remove("unloaded"),
                    mask.style = `width: ${Datas.CanvasSize.width}px; min-width: calc(4rem + ${Datas.CanvasSize.width}px); min-height: calc(4rem + ${Datas.CanvasSize.height}px)`,
                    canvas.hidden = !1,
                    image.hidden = !1,
                    createHDCanvas(canvas, Datas.CanvasSize.width, Datas.CanvasSize.height),
                    createHDCanvas(image, Datas.CanvasSize.width, Datas.CanvasSize.height);
                var e = dragger("#canvas");
                e.On("dragstart", t => {
                    "touchstart" == t.type && t.preventDefault(),
                        "draw" == Datas.Status.mode ? (Datas.Status.drawing = !0,
                            Datas.Temp.Points = []) : "view" == Datas.Status.mode && (Datas.Status.dragging = !0),
                        Datas.Temp.Mouse = {
                            x: [t.clientX - getPosition(canvas).x],
                            y: [t.clientY - getPosition(canvas).y]
                        },
                        Datas.Temp.ExtremeValue = {
                            x: [t.clientX - getPosition(canvas).x, t.clientX - getPosition(canvas).x],
                            y: [t.clientY - getPosition(canvas).y, t.clientY - getPosition(canvas).y]
                        }
                }
                ),
                    e.On("dragmove", t => {
                        var e;
                        "touchmove" == (e = t).type && e.preventDefault(),
                            !0 == Datas.Status.drawing && (e.clientX - getPosition(canvas).x < Datas.Temp.ExtremeValue.x[0] && (Datas.Temp.ExtremeValue.x[0] = e.clientX - getPosition(canvas).x),
                                e.clientX - getPosition(canvas).x > Datas.Temp.ExtremeValue.x[1] && (Datas.Temp.ExtremeValue.x[1] = e.clientX - getPosition(canvas).x),
                                e.clientY - getPosition(canvas).y < Datas.Temp.ExtremeValue.y[0] && (Datas.Temp.ExtremeValue.y[0] = e.clientY - getPosition(canvas).y),
                                e.clientY - getPosition(canvas).y > Datas.Temp.ExtremeValue.y[1] && (Datas.Temp.ExtremeValue.y[1] = e.clientY - getPosition(canvas).y),
                                Datas.Temp.Points.push({
                                    x: e.clientX - getPosition(canvas).x,
                                    y: e.clientY - getPosition(canvas).y
                                }),
                                Datas.Temp.Mouse = {
                                    x: [e.clientX - getPosition(canvas).x],
                                    y: [e.clientY - getPosition(canvas).y]
                                },
                                $("#undo").removeAttribute("disabled"),
                                drawPoints(canvas, Datas.Temp.Points, !1, 1))
                    }
                    ),
                    e.On("dragend", e => {
                        t(e)
                    }
                    ),
                    e.On("dragout", e => {
                        t(e)
                    }
                    )
            },
            undo() {
                if (-1 == draw.currentIndex)
                    return $("#undo").setAttribute("disabled", "");
                draw.currentIndex--,
                    Datas.Temp.DIndex--,
                    createHDCanvas(image, Datas.CanvasSize.width, Datas.CanvasSize.height),
                    Datas.Temp.History = [],
                    Datas.Objects.forEach((t, e) => {
                        e > draw.currentIndex || (drawPoints(image, t, !0),
                            Datas.Temp.History.push(t))
                    }
                    ),
                    -1 == draw.currentIndex ? $("#undo").setAttribute("disabled", "") : $("#undo").removeAttribute("disabled"),
                    $("#redo").removeAttribute("disabled")
            },
            redo() {
                if (draw.currentIndex == Datas.Objects.length - 1)
                    return $("#redo").setAttribute("disabled", "");
                draw.currentIndex++,
                    Datas.Temp.DIndex++,
                    createHDCanvas(image, Datas.CanvasSize.width, Datas.CanvasSize.height),
                    Datas.Temp.History = [],
                    Datas.Objects.forEach((t, e) => {
                        e > draw.currentIndex || (drawPoints(image, t, !0),
                            Datas.Temp.History.push(t))
                    }
                    ),
                    $("#undo").removeAttribute("disabled"),
                    draw.currentIndex == Datas.Objects.length - 1 ? $("#redo").setAttribute("disabled", "") : $("#redo").removeAttribute("disabled")
            }
        };
        function download(t) {
            var e = draw.image.toDataURL("image/jpeg")
                , a = document.createElement("a");
            a.download = t ? t + ".jpg" : "Untitled.jpg",
                a.href = e,
                a.click()
        }
        $("#download").addEventListener("click", () => {
            download()
        }
        );
        var delay = t => new Promise(e => setTimeout(e, t));
        window.mobileAndTabletCheck = function () {
            var t;
            let e = !1;
            return t = navigator.userAgent || navigator.vendor || window.opera,
                (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0),
                e
        }
            ,
            (async () => {
                if (!0 == mobileAndTabletCheck()) {
                    var t = document.createElement("div");
                    t.className = "--info",
                        t.innerHTML = "<div>請使用電腦瀏覽此頁面</div>",
                        document.body.appendChild(t);
                    return
                }
                await delay(500 * Math.random()),
                    draw.init(),
                    $("#undo").onclick = draw.undo,
                    $("#redo").onclick = draw.redo,
                    setTimeout(() => $(".unloaded", !0).forEach(t => {
                        t.classList.remove("unloaded")
                    }
                    ), 300)
            }
            )();
    });
})();
