/**
 * Query Selector
 * @returns {HTMLElement}
 */
function $(s, a) {
	return a == true ? document.querySelectorAll(s) : document.querySelector(s);
}

var hot_key = {

}

var last_click_app = null;

var side_data = "";
var max_z_index = 9;

var running_apps = {};

var dragger = (t, c) => {
	c = c || {};
	var target = t,
		config = {
			blur: c.blur || window,
			start: c.start || target,
			end: c.end || window,
			move: c.move || window
		},
		events = {
			"dragstart": {
				target: config.start,
				event: "mousedown"
			},
			"dragging": {
				target: config.move,
				event: "mousemove"
			},
			"dragend": {
				target: config.end,
				event: "mouseup"
			},
			"dragout": {
				target: config.blur,
				event: "blur"
			}
		};

	function on(evt, fn) {
		if (events.hasOwnProperty(evt) == false) return;
		events[evt].target.addEventListener(events[evt].event, e => fn(e));
	}

	function inarea(element1, element2, callback) {
		const rect1 = element1.getBoundingClientRect();
		const rect2 = element2.getBoundingClientRect();
		if (rect1.bottom < rect2.top || rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.left > rect2.right) {
			return false;
		}
		return callback.in();
	}

	/**
	 * Module
	 */

	function getBoxModelData(options) {
		const element = options;
		const computedStyle = window.getComputedStyle(element)

		function getBoxModelValue(type) {
			let keys = ["top", "left", "right", "bottom"]
			if (type !== "position") {
				for (let i = 0; i < keys.length; i++) {
					keys[i] = `${type}-${keys[i]}`
				}
			}
			if (type === "border") {
				for (let i = 0; i < keys.length; i++) {
					keys[i] = `${keys[i]}-width`
				}
			}
			return {
				top: boxModelValue(computedStyle[keys[0]], type),
				left: boxModelValue(computedStyle[keys[1]], type),
				right: boxModelValue(computedStyle[keys[2]], type),
				bottom: boxModelValue(computedStyle[keys[3]], type)
			}
		}

		const boxModel = {
			margin: getBoxModelValue("margin"),
			border: getBoxModelValue("border"),
			padding: getBoxModelValue("padding"),
			content: {
				width: boxModelValue(computedStyle["width"], "content"),
				height: boxModelValue(computedStyle["height"], "content")
			}
		}

		if (computedStyle["position"] !== "static") {
			boxModel.position = getBoxModelValue("position")
		}

		return boxModel
	}

	function boxModelValue(val, type) {
		if (Number.isInteger(val)) return val

		if (!typeof val == "string") return type == "content" ? 0 : 0

		const ret = Number(val.replace('px', ''));
		if (isNaN(ret)) return val

		if (type === "position") return ret

		return ret === 0 ? type == "content" ? 0 : 0 : ret
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	function in_area(element, target, callback, cursor) {
		function offset(el) {
			var rect = el.getBoundingClientRect(),
				scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
				scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
		}

		function getPosition(element) {
			return { x: cursor.pageX, y: cursor.pageY };
			// return { x: offset(element).left, y: offset(element).top };
		}

		var element_position = {
			startX: getPosition(element).x,
			startY: getPosition(element).y,
			endX: getPosition(element).x + element.scrollWidth,
			endY: getPosition(element).y + element.scrollHeight
		}

		var interval = 16;

		var t_info = getBoxModelData(target);

		var target_size = {
			width: t_info.padding.left + t_info.padding.right + t_info.content.width,
			height: t_info.padding.top + t_info.padding.bottom + t_info.content.height
		}
		if (getPosition(target).x >= window.innerWidth - interval) {
			return callback("right");
		} else if (getPosition(target).x <= interval) {
			return callback("left");
		} else if (getPosition(target).y <= interval) {
			return callback("top");
		} else if (getPosition(target).y >= window.innerHeight - interval) {
			return callback("bottom");
		} else {
			return callback(false), side_data = "";
		}
	}

	return {
		On: on,
		InArea: in_area
	}
}

/**
 * Module
 */

function isColorCode(str) {
	const regex = /^(rgb|rgba)\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(0?\.\d+|1(\.0+)?)\s*)?\)$/;
	return regex.test(str);
}

function isRGBColorSimilar(color1, color2, threshold) {
	const rgb1 = color1.match(/\d+/g).map(Number);
	const rgb2 = color2.match(/\d+/g).map(Number);
	const diff = Math.sqrt(
		Math.pow(rgb2[0] - rgb1[0], 2) +
		Math.pow(rgb2[1] - rgb1[1], 2) +
		Math.pow(rgb2[2] - rgb1[2], 2)
	);
	return diff <= threshold;
}

var App_data = {};

/**
 * Open an application
 * @param {Number|String} id 
 * @param {Function} callback 
 * @param {Object} config 
 */

class App {
	constructor(id, callback, config) {
		var hash = (n, c) => { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };
		var options = {
			width: {
				value: 800,
				type: "number",
				name: "width"
			},
			height: {
				value: 600,
				type: "number",
				name: "height"
			},
			x: {
				value: 0,
				type: "number",
				name: "x"
			},
			y: {
				value: 0,
				type: "number",
				name: "y"
			},
			center: {
				value: false,
				type: "boolean",
				name: "center"
			},
			minWidth: {
				value: 0,
				type: "number",
				name: "minWidth"
			},
			minHeight: {
				value: 0,
				type: "number",
				name: "minHeight"
			},
			maxWidth: {
				value: null,
				type: "number",
				name: "maxWidth"
			},
			maxHeight: {
				value: null,
				type: "number",
				name: "maxHeight"
			},
			resizable: {
				value: true,
				type: "boolean",
				name: "resizable"
			},
			movable: {
				value: true,
				type: "boolean",
				name: "movable"
			},
			minimizable: {
				value: true,
				type: "boolean",
				name: "minimizable"
			},
			closable: {
				value: true,
				type: "boolean",
				name: "closable"
			},
			fullscreen: {
				value: false,
				type: "boolean",
				name: "fullscreen"
			},
			fullscreenable: {
				value: true,
				type: "boolean",
				name: "fullscreenable"
			},
			title: {
				value: "Application",
				type: "string",
				name: "title"
			},
			icon: {
				value: "",
				type: "string",
				name: "icon"
			},
			show: {
				value: true,
				type: "boolean",
				name: "show"
			},
			autoHideCursor: {
				value: false,
				type: "boolean",
				name: "autoHideCursor"
			},
			backgroundColor: {
				value: "rgb(241, 241, 241)",
				type: "string",
				name: "backgroundColor"
			},
			hasShadow: {
				value: true,
				type: "boolean",
				name: "hasShadow"
			},
			opacity: {
				value: 1,
				type: "number",
				name: "opacity"
			},
			darkTheme: {
				value: false,
				type: "boolean",
				name: "darkTheme"
			},
			transparent: {
				value: false,
				type: "boolean",
				name: "transparent"
			},
			showinbar: {
				value: true,
				type: "boolean",
				name: "showinbar"
			},
			toolbar: {
				value: true,
				type: "boolean",
				name: "toolbar"
			},
			showloading: {
				value: false,
				type: "boolean",
				name: "showloading"
			},
			loadingColor: {
				value: "#0069c4",
				type: "string",
				name: "loadingColor"
			}
		};
		var settings = {};
		function checkConfig(value, type) {
			return typeof value === type;
		}
		if (!typeof id === "string") return console.error("The parameter Id must be a string.");
		// 註冊應用程式
		if (App_data.hasOwnProperty(id) == true) return console.error("The application's Id has been registered.");
		if (config) {
			if (!Object.prototype.toString.call(config) === '[object Object]') return console.error("Invalid configuration.");
		}
		var color = "rgb(0, 0, 0)";
		var option_value = Object.values(options);
		option_value.forEach(o => {
			if (!config) {
				settings[o.name] = o.value;
			} else {
				if (config.hasOwnProperty(o.name)) {
					if (checkConfig(config[o.name], o.type) == true) {
						if (o.name == "backgroundColor") {
							// 設定項為背景顏色
							if (isColorCode(config[o.name]) == false) {
								// 非正確色碼
								settings[o.name] = o.value;
							} else {
								if (isRGBColorSimilar(config[o.name], "rgb(0, 0, 0)", 255 / 2) == true) {
									color = "rgb(255, 255, 255)";
								}
								settings[o.name] = config[o.name];
							}
						} else {
							settings[o.name] = config[o.name];
						}
					} else {
						settings[o.name] = o.value;
					}
				} else {
					settings[o.name] = o.value;
				}
			}
		});
		this.theme = {
			backgroundColor: settings.backgroundColor,
			color: color
		}
		this.settings = settings;
		this.hash = hash(24, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_")
		return this;
	}
	on(evt, fn) {
	}
	get(id) {
		if (!App_data.contains(id) == true) return;

	}
	close() {
		delete running_apps[this.hash];
		if (this.parent) {
			this.parent.remove();
		}
		if (this.app_icon) {
			this.app_icon.remove();
		}
	}
	loadStyles(content, type, callback = function () {}) {
		if (type == "text") {
			var s_e = document.createElement("style");
			var style = "";
			var content = {
				keys: Object.keys(content),
				values: Object.values(content)
			}
			for (let i = 0; i < content.keys.length; i++) {
				var temp = "";
				for (let j = 0; j < Object.keys(content.values[i]).length; j++) {
					temp += Object.keys(content.values[i])[j] + ":" + Object.values(content.values[i])[j];
				}
				style += `[app-hash-content="${this.hash}"] ${content.keys[i]}{${temp}}`;
			}
			s_e.innerHTML = style;
			document.head.appendChild(s_e);
		} else if (type == "url") {
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = content;
			document.head.appendChild(link);
			link.onload = () => {
				callback();
			}
		}
	}
	execute(con, callback, config) {
		/**
		 * @var {string|HTMLElement} con
		 */
		/**
		 * Dom
		 * @param {string} el 
		 * @param {HTMLElement} ta 
		 * @param {Object} at 
		 * @param {string} inH
		 * @param {string} inT
		 * @param {string} co 
		 * @param {HTMLElement} ot 
		 */
		var child = (el, ta, at, inH, inT, co, ot) => {
			var element = document.createElement(el);
			if (at) {
				var attnam = Object.keys(at);
				var attval = Object.values(at);
				for (let i = 0; i < attnam.length; i++) {
					element.setAttribute(attnam[i], attval[i]);
				}
			}
			if (inH) {
				element.innerHTML = inH;
			}
			if (inT) {
				element.innerText = inT;
			}
			if (co == "before") {
				return ta.insertBefore(element, ot);
			} else if (co == "replace") {
				return ta.replaceChild(ot, element);
			} else {
				return ta.appendChild(element);
			}
		}
		var parent = document.createElement("div");
		var settings = this.settings;
		parent.className = "window-frame-application";
		parent.setAttribute("app-hash-content", this.hash);
		settings.fullscreen == true && parent.classList.add("window-frame-application-full-mode");
		settings.show == true && parent.classList.add("window-frame-application-show");
		parent.style.top = settings.y + "px";
		parent.style.left = settings.x + "px";
		parent.style.width = (settings.width + settings.x < window.innerWidth ? settings.width : window.innerWidth - settings.x) + "px";
		parent.style.height = (settings.height + settings.y < window.innerHeight - 45 ? settings.height : window.innerHeight - settings.y - 45) + "px";
		$(".window-frame").appendChild(parent);

		var toolbar = document.createElement("div");
		var content = document.createElement("div");
		var mask = document.createElement("div");

		toolbar.className = "window-frame-application-toolbar";
		content.className = "window-frame-application-content";
		mask.className = "window-frame-application-content-mask";

		toolbar.style = `background: ${this.theme.backgroundColor}; color: ${this.theme.color}`;

		async function setContent() {
			content.innerHTML = typeof con == "string" ? con : config ? config.remove == true ? (con.innerHTML, con.remove()) : con.innerHTML : con.innerHTML;
		}

		if (settings.toolbar == true) {
			parent.appendChild(toolbar);
		}
		parent.appendChild(content);
		parent.appendChild(mask);

		this.status = {
			drag: false,
			app_position_side: null,
			side_data: null,
			last_x: settings.x,
			last_y: settings.y,
			mouse_x: 0,
			mouse_y: 0,
			last_width: settings.width,
			last_height: settings.height,
			in_full_mode: false,
			frame_exsit: true,
			show: settings.show
		}

		var app_icon = settings.showinbar == true ? child("div", $(".window-tool-bar-applications"), { class: settings.show == true ? "window-tool-bar-application running active" : "window-tool-bar-application running" }, `<div class="window-tool-bar-application-icon"><img class="window-tool-bar-application-icon-image" src="${settings.icon ? settings.icon : "./application.png"}" onerror="this.src='./application.png'"></div>`) : document.createElement("undefined-element");

		var loading = child("div", parent, { class: settings.showloading == true ? "window-frame-application-loading active" : "window-frame-application-loading", style: `background: ${settings.backgroundColor}` }, `<svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
		<circle cx="8px" cy="8px" r="7px" style="stroke: ${settings.loadingColor}"></circle>
	</svg>`);

		this.showLoading = () => {
			loading.classList.add("active");
		}

		this.hideLoading = () => {
			loading.classList.remove("active");
		}

		if (settings.toolbar == true) {
			var title = child("div", toolbar, { class: "window-frame-application-toolbar-title" });
			var drag = child("div", toolbar, { class: "window-frame-application-toolbar-drag" });
			var action = child("div", toolbar, { class: "window-frame-application-toolbar-actions" });

			var icon = child("img", title, { class: "window-frame-application-toolbar-title-icon", src: settings.icon ? settings.icon : "./application.png" });
			var title_text = child("span", title, { class: "window-frame-application-toolbar-title-content" }, settings.title ? settings.title : "Application");

			var mini = settings.minimizable == true ? child("div", action, { class: "window-frame-application-toolbar-action-small window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1"stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6"></path></svg>`) : false;

			var full = settings.fullscreenable == true ? child("div", action, { class: "window-frame-application-toolbar-action-toggle window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" data-svg="unfull"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"></path></svg><svg fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" data-svg="full"><rect x="5" y="6" width="14" height="12"></rect></svg>`) : false;

			var close = settings.closable == true ? child("div", action, { class: "window-frame-application-toolbar-action-close window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`) : false;

			$(".window-tool-bar-application", true).forEach(e => {
				e.classList.remove("active");
			})

			var __drag__ = settings.movable == true ? dragger(drag) : {
				On: function () { },
				InArea: function () { }
			};

			this.app_icon = app_icon;

			var window_width = window.innerWidth;
			var window_height = window.innerHeight;

			if (close != false) {
				close.addEventListener("click", () => {
					parent.remove();
					// $(".window-tool-bar-application").remove();
					this.status.frame_exsit = false;
				})
			}

			if (settings.movable == true) {
				dragger(title).On("dragstart", (e) => {
					$(".window-frame-application-content-mask", true).forEach(e => {
						e.style.display = "block";
					})
					this.status.drag = true;
					this.status.mouse_x = e.pageX;
					this.status.mouse_y = e.pageY;
					this.status.in_full_mode = false;
					$(".window-frame-application", true).forEach(e => {
						e.classList.remove("focus");
					})
					max_z_index++;
					parent.style.zIndex = max_z_index;
					parent.classList.add("focus");
				});

				__drag__.On("dragstart", (e) => {
					$(".window-frame-application-content-mask", true).forEach(e => {
						e.style.display = "block";
					})
					this.status.drag = true;
					this.status.mouse_x = e.pageX;
					this.status.mouse_y = e.pageY;
					this.status.in_full_mode = false;
					$(".window-frame-application", true).forEach(e => {
						e.classList.remove("focus");
					})
					max_z_index++
					parent.style.zIndex = max_z_index;
					parent.classList.add("focus");
				});

				__drag__.On("dragging", (e) => {
					if (this.status.drag == false) return;

					this.status.app_position_side = null;

					if (settings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.add("hide");
						$('[data-svg="full"]').classList.remove("hide");
						$('.window-frame-application-toolbar-action-toggle').classList.remove("window-frame-application-toolbar-action-toggle-full-mode")
					}
					parent.classList.remove("window-frame-application-full-mode");
					parent.style.width = settings.width + "px";
					parent.style.height = settings.height + "px";
					var x = e.pageX,
						y = e.pageY;
					var element_x = parent.offsetLeft,
						element_y = parent.offsetTop;
					var re_x = element_x + (x - this.status.mouse_x);
					var re_y = element_y + (y - this.status.mouse_y);
					parent.style.left = re_x < 0 ? 0 : re_x + parent.offsetWidth > window_width ? window_width : re_x + "px";
					parent.style.top = re_y < 0 ? 0 : re_y + parent.offsetHeight > $(".window-frame").offsetHeight ? $(".window-frame").offsetHeight : re_y + "px";
					this.status.mouse_x = x;
					this.status.mouse_y = y;
					this.status.last_x = parent.offsetLeft;
					this.status.last_y = parent.offsetTop;

					__drag__.InArea($(".window-frame"), parent, (e) => {
						if (e == false) {
							$(".reps").style = "";
							$(".reps").classList.remove("active");
						} else {
							$(".reps").classList.add("active");
							$(".reps").style.zIndex = max_z_index - 1;
							if (e == "right") {
								return $(".reps").style = "width: calc(50vw - 12px); height: calc(100vh - 45px - 16px);bottom: 53px; left: auto; right: 8px; top: 8px; ", this.status.app_position_side = e, this.status.side_data = `bottom: 45px; left: auto; right: 0; top: 0; width: 50vw; height: calc(100vh - 45px);`;
							}
							if (e == "left") {
								return $(".reps").style = "width: calc(50vw - 12px); height: calc(100vh - 45px - 16px);bottom: 53px; left: 8px; right: auto; top: 8px;", this.status.app_position_side = e, this.status.side_data = `bottom: 45px; left: 0; right: auto; top: 0; width: 50vw; height: calc(100vh - 45px);`;
							}
							if (e == "top") {
								return $(".reps").style = "width: calc(100vw - 16px); height: calc((100vh - 45px) / 2 - 12px);bottom: auto; left: 8px; right: 8px; top: 8px; ", this.status.app_position_side = e, this.status.side_data = `bottom: auto; left: 0; right: 0; top: 0; width: 100vw; height: calc((100% - 45px) / 2);`;
							}
							if (e == "bottom") {
								return $(".reps").style = "width: calc(100vw - 16px); height: calc((100vh - 45px) / 2 - 12px);bottom: 53px; left: 8px; right: 8px; top: auto; ", this.status.app_position_side = e, this.status.side_data = `bottom: 45px; left: 0; right: 0; top: auto; width: 100vw; height: calc((100% - 45px) / 2);`;
							}
						}

					}, e);
				});

				__drag__.On("dragend", () => {
					if (this.status.drag == false) return;
					if (this.status.app_position_side !== null) {
						parent.classList.add("window-frame-application-full-mode");
						parent.style = this.status.side_data;
					}
					$(".reps").style = "";
					$(".window-frame-application-content-mask", true).forEach(e => {
						e.style.display = "none";
					})
					this.status.drag = false;
					this.status.app_position_side = null;
					$(".reps").classList.remove("active");
					if (this.status.in_full_mode == true && this.status.frame_exsit == true && settings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.remove("hide");
						$('[data-svg="full"]').classList.add("hide");
					}
					parent.style.zIndex = "none";
					$(".window-frame-application.focus", true).forEach(e => {
						e.classList.remove("focus");
					})
					parent.classList.add("focus");
					if (!this.status.app_position_side) {
						this.status.last_width = parent.scrollWidth;
						this.status.last_height = parent.scrollHeight;
					}
				})

				__drag__.On("dragout", () => {
					$(".window-frame-application-content-mask", true).forEach(e => {
						e.style.display = "none";
					})
					this.status.drag = false;
					this.status.app_position_side = null;
					$(".reps").style = "";
					$(".reps").classList.remove("active");
					if (this.status.in_full_mode == true && this.status.frame_exsit == true && settings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.remove("hide");
						$('[data-svg="full"]').classList.add("hide");
					}
					parent.style.zIndex = "none";
					$(".window-frame-application.focus", true).forEach(e => {
						e.classList.remove("focus");
					})
					parent.classList.add("focus");
				})
			}

			full !== false && full.addEventListener("click", () => {
				if (this.status.in_full_mode == true) {
					this.status.in_full_mode = false;
					parent.classList.remove("window-frame-application-full-mode");
					full.classList.remove("window-frame-application-toolbar-action-toggle-full-mode")
					parent.style.width = this.status.last_width + "px";
					parent.style.height = this.status.last_height + "px";
					parent.style.top = this.status.last_y + "px";
					parent.style.left = this.status.last_x + "px";
				} else {
					this.status.in_full_mode = true;
					parent.classList.add("window-frame-application-full-mode");
					full.classList.add("window-frame-application-toolbar-action-toggle-full-mode");
					parent.style.top = "0";
					parent.style.left = "0";
					parent.style.width = "100vw";
					parent.style.height = $(".window-frame").offsetHeight + "px";
				}
			})

			parent.addEventListener("click", (e) => {
				if (mini != false) {
					if (e.target == mini || mini.contains(e.target)) return;
				}
				$(".window-tool-bar-application", true).forEach(e => {
					e.classList.remove("active");
				})
				this.status.show = true;
				app_icon.classList.add("active");
				max_z_index++;
				parent.style.zIndex = max_z_index;
				parent.classList.add("window-frame-application-show");
			})

			app_icon.addEventListener("click", () => {
				if (last_click_app != this.hash) {
					$(".window-tool-bar-application", true).forEach(e => {
						e.classList.remove("active");
					})
					this.status.show = true;
					app_icon.classList.add("active");
					max_z_index++;
					parent.style.zIndex = max_z_index;
					parent.classList.add("window-frame-application-show");
				} else {
					if (this.status.show == true) {
						this.status.show = false;
						app_icon.classList.remove("active");
						parent.classList.remove("window-frame-application-show");
					} else {
						$(".window-tool-bar-application", true).forEach(e => {
							e.classList.remove("active");
						})
						this.status.show = true;
						app_icon.classList.add("active");
						parent.classList.add("window-frame-application-show");
						max_z_index++;
						parent.style.zIndex = max_z_index;
						parent.classList.add("window-frame-application-show");
					}
				}

				last_click_app = this.hash;
			})

			mini !== false && mini.addEventListener("click", () => {
				parent.classList.remove("window-frame-application-show");
				this.status.show = false;
				app_icon.classList.remove("active");
			})

			close !== false && close.addEventListener("click", () => {
				parent.remove();
				app_icon.remove();
				delete running_apps[this.hash];
				this.status.frame_exsit = false;
			})
		}

		this.hide = () => {
			parent.classList.remove("window-frame-application-show");
			this.status.show = false;
			app_icon.classList.remove("active");
		}

		var toggle_full = {
			enter: function () {
				$('[data-svg="unfull"]').classList.add("hide");
				$('[data-svg="full"]').classList.remove("hide");
				parent.classList.remove("window-frame-application-full-mode");
				$('.window-frame-application-toolbar-action-toggle').classList.remove("window-frame-application-toolbar-action-toggle-full-mode");
			},
			exit: function () {

			}
		}

		parent.addEventListener("click", () => {
			if (parent.classList.contains("focus") && $(".window-frame-application.focus", true).length == 1) return;
			$(".window-frame-application.focus", true).forEach(e => {
				e.classList.remove("focus");
			})
			parent.classList.add("focus");
		})

		window.addEventListener("resize", () => {
			window_width = window.innerWidth;
			window_height = window.innerHeight;
			var element_x = parent.offsetLeft,
				element_y = parent.offsetTop;
			parent.style.left = element_x < 0 ? 0 : parent.offsetWidth + element_x > window_width && window_width - parent.offsetWidth + "px";
			parent.style.top = element_y < 0 ? 0 : parent.offsetHeight + element_y > window_height && window_height - parent.offsetHeight + "px";
		});

		if (document.readyState === 'complete') {
			setContent();
		} else {
			document.onreadystatechange = () => {
				if (document.readyState === 'complete') {
					setContent();
				}
			}
		}

		function changeIcon(url) {
			icon.src = url;
			app_icon.innerHTML = `<div class="window-tool-bar-application-icon"><img class="window-tool-bar-application-icon-image" src="${url}" onerror="this.src='./application.png'"></div>`;
			icon.onerror = () => {
				icon.src = "./application.png"
			}
		}

		function changeTitle(title) {
			if (!title) return;
			title_text.innerHTML = title;
		}

		if (callback) {
			callback();
		}

		max_z_index++;
		parent.style.zIndex = max_z_index;
		last_click_app = this.hash;

		this.parent = parent;

		this.elements = {
			window: parent,
			toolbar: toolbar,
			content: content
		}

		running_apps[this.hash] = this;

		return {
			changeIcon: changeIcon,
			changeTitle: changeTitle,
			elements: {
				window: parent,
				toolbar: toolbar,
				content: content
			}
		}
	}
}

/*
window.addEventListener("mousemove", (e) => {
	if (drag == false) return;

	$('[data-svg="unfull"]').classList.add("hide");
	$('[data-svg="full"]').classList.remove("hide");
	drag_element.classList.remove("window-frame-application-full-mode");
	$('.window-frame-application-toolbar-action-toggle').classList.remove("window-frame-application-toolbar-action-toggle-full-mode")
	drag_element.style.width = "480px";
	drag_element.style.height = "320px";
	var x = e.pageX,
		y = e.pageY;
	var element_x = drag_element.offsetLeft,
		element_y = drag_element.offsetTop;
	var re_x = element_x + (x - mouse_x);
	var re_y = element_y + (y - mouse_y);
	drag_element.style.left = re_x < 0 ? 0 : re_x + drag_element.offsetWidth > window_width ? window_width : re_x + "px";
	drag_element.style.top = re_y < 0 ? 0 : re_y + drag_element.offsetHeight > $(".window-frame").offsetHeight ? $(".window-frame").offsetHeight : re_y + "px";
	mouse_x = x;
	mouse_y = y;
	last_x = drag_element.offsetLeft;
	last_y = drag_element.offsetTop;
})
*/

var script = document.createElement("script");
script.src = "./system/wos/explore/app.js";
document.head.appendChild(script);