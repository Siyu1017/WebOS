/**
 * Query Selector
 * @returns {HTMLElement}
 */
function $(s, a) {
	return a == true ? document.querySelectorAll(s) : document.querySelector(s);
}

function getJsonFromUrl(url) {
	if (!url) url = location.search;
	var query = url.substr(1);
	var result = {};
	query.split("&").forEach(function (part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

function formatString(str) {
	// console.log(str)
	try {
		return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	} catch (e) {
		return str;
	}
}

var hash = (n, c) => { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };

Date.prototype.format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); } for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); } } return fmt; };

/*

const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			navigator.serviceWorker.register("./sw.js").then(registration => {
				registration.update();

				if (['develop', 'dev', 'beta'].includes(getJsonFromUrl().mode) || ["true", true].includes(getJsonFromUrl().clearCache)) {
					navigator.serviceWorker.controller.postMessage({
						action: "update"
					});
				}

				registration.addEventListener('updatefound', () => {
					const newWorker = registration.installing;
					if (registration.installing) {
						console.log("Service worker installing");
					} else if (registration.waiting) {
						console.log("Service worker installed");
					} else if (registration.active) {
						console.log("Service worker active");
					}
				});
			})
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};

registerServiceWorker();

*/

var os = {};

var hot_key = {

}

var last_click_app = null;

var side_data = "";
var max_z_index = 9;

var running_apps = {};

var animation_setting = {
	duration: 200,
	minScale: 0.2,
	timingFunction: "cubic-bezier(0.56, 0.05, 0.38, 0.91)"
}

var settings = {
	barHeight: 45,
	minOver: 30,
	boundary: 16,
	preview: 6
}

var thumbnail_setting = {
	maxWidth: 210,
	maxHeight: 90,
	padding: {
		top: 6,
		bottom: 6,
		left: 6,
		right: 6
	}
}

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
				event: ["mousedown", "touchstart", "pointerdown"]
			},
			"dragging": {
				target: config.move,
				event: ["mousemove", "touchmove", "pointermove"]
			},
			"dragend": {
				target: config.end,
				event: ["mouseup", "touchend", "pointerup"]
			},
			"dragout": {
				target: config.blur,
				event: ["blur"]
			}
		};

	function on(evt, fn) {
		if (events.hasOwnProperty(evt) == false) return;
		events[evt].event.forEach(event => {
			events[evt].target.addEventListener(event, e => fn(e));
		})
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

function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function getPosition(element) {
	return { x: offset(element).left, y: offset(element).top };
}

function handleImageError(image, failed, alternatives = "./application.png") {
	if (image.getAttribute("src") == alternatives) {
		return image.parentNode.replaceChild(failed, image);
	}
	if (window.navigator.onLine == false) {
		image.parentNode.replaceChild(failed, image);
		window.addEventListener("online", () => {
			if (!failed.parentNode) return;
			if (failed.parentNode.contains(failed)) {
				failed.parentNode.replaceChild(image, failed);
			}
			image.src = alternatives;
		})
		return;
	} else {
		image.src = alternatives;
	}
}

function getStackTrace() {
	var stack;

	try {
		throw new Error('');
	} catch (error) {
		stack = error.stack || '';
	}

	stack = stack.split('\n').map(function (line) { return line.trim(); });
	return stack.splice(stack[0] == 'Error' ? 2 : 1);
}

os.processes = Array(512)

os.process = {
	start: (name) => {

	}
}

os.showSidebar = false;

os.notification = {
	cloneNodes: {},
	cloneNodePositions: {},
	lastCallTime: {},
	notifications: {},
	timeInterval: 100,
	create: async (icon, owner, message, action) => {
		var trace = await getStackTrace();
		if (os.notification.lastCallTime[trace.join("\n")]) {
			if (Date.now() - os.notification.lastCallTime[trace.join("\n")] < os.notification.timeInterval) return;
		}
		os.notification.lastCallTime[trace.join("\n")] = Date.now();

		console.log(trace)

		$(".no-notification").classList.add("hide");

		icon = icon || "./application.png";
		owner = owner.trim().length > 0 ? owner : "Notification";
		message = message.trim().length > 0 ? message : "Notification";
		action = action instanceof Function ? action : function () { };

		var id = hash(120);

		var notification = document.createElement("div");
		var notification_info = document.createElement("div");
		var notification_icon = document.createElement("img");
		var notification_owner = document.createElement("div");
		var notification_time = document.createElement("div");
		var notification_content = document.createElement("div");
		var notification_icon_failed = document.createElement("div");

		notification.className = "notification";
		notification_info.className = "notification-info";
		notification_icon.className = "notification-icon";
		notification_owner.className = "notification-owner";
		notification_time.className = "notification-time";
		notification_content.className = "notification-content";
		notification_icon_failed.className = "notification-icon-failed";

		notification.setAttribute("notification-id", id);

		notification_icon.src = icon;
		notification_icon.onerror = () => {
			handleImageError(notification_icon, notification_icon_failed, "./application.png");
		}
		/*
		notification_icon.onerror = () => {
			if (notification_icon.getAttribute("src") == "./application.png") {
				return notification_info.replaceChild(notification_icon_failed, notification_icon);
			}
			if (window.navigator.onLine == false) {
				notification_info.replaceChild(notification_icon_failed, notification_icon);
				window.addEventListener("online", () => {
					if (notification_info.contains(notification_icon_failed)) {
						notification_info.replaceChild(notification_icon, notification_icon_failed);
					}
					notification_icon.src = "./application.png";
				})
				return;
			} else {
				notification_icon.src = "./application.png";
			}
		}
		*/

		notification_owner.innerHTML = formatString(owner);
		notification_time.innerHTML = new Date().format("hh:mm");
		notification_content.innerHTML = message;

		notification.appendChild(notification_info);
		notification.appendChild(notification_content);

		notification_info.appendChild(notification_icon);
		notification_info.appendChild(notification_owner);
		notification_info.appendChild(notification_time);

		os.notification.notifications[id] = {
			'notification': notification,
			'icon': notification_icon,
			'owner': notification_owner,
			'time': notification_time,
			'content': notification_content,
			'action': action
		};

		notification.addEventListener("click", () => {
			try {
				os.notification.notifications[id]['action']();
			} catch (e) { };
			// $(".window-sidebar").classList.remove("active");
			// os.showSidebar = false;
			os.notification.delete(id);
			if (Object.keys(os.notification.notifications).length == 0) {
				$(".no-notification").classList.remove("hide");
			} else {
				$(".no-notification").classList.add("hide");
			}
		})

		$(".window-sidebar-notifications").insertBefore(notification, $(".window-sidebar-notifications").firstChild);

		setTimeout(() => {
			notification.style.animation = "none";
			notification.style.transform = "scale(1)";
		}, 150)

		if (os.showSidebar == true) {
			if ($(".window-sidebar-notifications").scrollTop < $(".window-sidebar-notifications").offsetHeight * 0.5) {
				$(".window-sidebar-notifications").scrollTo({ 'behavior': 'smooth', 'top': 0 });
			}
		} else {
			var cid = hash(96);
			var cloneNode = notification.cloneNode(true);
			cloneNode.classList.add("popup");
			$(".window-popup-container").appendChild(cloneNode);
			//document.body.appendChild(cloneNode);

			os.notification.cloneNodes[cid] = cloneNode;
			os.notification.cloneNodePositions[cid] = cloneNode;

			setTimeout(() => {
				cloneNode.style.animation = "none";
			}, 250)

			cloneNode.querySelector(".notification-icon").onerror = () => {
				var notification_icon = cloneNode.querySelector(".notification-icon");
				var notification_icon_failed = document.createElement("div");
				notification_icon_failed.className = "notification-icon-failed";
				handleImageError(notification_icon, notification_icon_failed, "./application.png");
			}

			/*
			cloneNode.querySelector(".notification-icon").onerror = () => {
				var notification_icon = cloneNode.querySelector(".notification-icon");
				var notification_info = cloneNode.querySelector(".notification-info");
				if (notification_icon.getAttribute("src") == "./application.png") {
					notification_info.replaceChild(notification_icon_failed, notification_icon);
				}
				if (window.navigator.onLine == false) {
					window.addEventListener("online", () => {
						notification_icon.src = "./application.png";
					})
				} else {
					notification_icon.src = "./application.png";
				}
			}
			*/

			cloneNode.addEventListener("click", () => {
				try {
					os.notification.notifications[id]['action']();
				} catch (e) { };

				os.notification.delete(id);

				if (Object.keys(os.notification.notifications).length == 0) {
					$(".no-notification").classList.remove("hide");
				} else {
					$(".no-notification").classList.add("hide");
				}

				cloneNode.style.animation = "revert-layer";
				cloneNode.classList.add("hide");
				setTimeout(() => {
					cloneNode.remove();
					delete os.notification.cloneNodes[cid];
				}, 500)
			})

			setTimeout(() => {
				cloneNode.style.animation = "revert-layer";
				cloneNode.classList.add("hide");
				setTimeout(() => {
					cloneNode.remove();
					delete os.notification.cloneNodes[cid];
				}, 500)
			}, 5000)
		}

		return id;
	},
	edit: (id, type, content) => {
		var types = ['icon', 'owner', 'content', 'action'];
		if (types.includes(type)) return;
		if (!os.notification.notifications[id]) return;
		if (type == 'icon') {
			os.notification.notifications[id][type].src = content;
		} else if (type == 'action') {
			os.notification.notifications[id][type] = content instanceof Function ? content : function () { };
		} else {
			os.notification.notifications[id][type].innerHTML = content;
		}
	},
	delete: (id) => {
		if (!os.notification.notifications[id]) return;
		var notification = os.notification.notifications[id]['notification']
		notification.style.animation = "revert-layer";
		notification.classList.add("hide");
		delete os.notification.notifications[id];
		setTimeout(() => {
			notification.remove();
		}, 500)
	}
};

window.addEventListener("load", () => {
	var now = new Date(Date.now());
	var pattern = [" AM", " PM"];

	$(".window-taskbar-system-time-time").innerHTML = (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm")) + (now.format("hh") < 12 ? pattern[0] : pattern[1]);
	$(".window-taskbar-system-time-date").innerHTML = now.format("yyyy/MM/dd");

	var last_time = now.format("yyyy/MM/dd hh:mm");
	var last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");

	setInterval(function () {
		var now = new Date(Date.now())
		if (last_whole_time !== now.format("yyyy/MM/dd hh:mm:ss")) {
			last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");
		}
		if (last_time !== now.format("yyyy/MM/dd hh:mm")) {
			$(".window-taskbar-system-time-time").innerHTML = (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm")) + (now.format("hh") < 12 ? pattern[0] : pattern[1]);
			$(".window-taskbar-system-time-date").innerHTML = now.format("yyyy/MM/dd");
			last_time = now.format("yyyy/MM/dd hh:mm");
		}
	}, 1000);

	$(".window-taskbar-system").addEventListener("click", () => {
		if (os.showSidebar == false) {
			$(".window-sidebar").classList.add("active");
			os.showSidebar = true;
			Object.values(os.notification.cloneNodes).forEach((node, i) => {
				node.style.animation = "revert-layer";
				node.classList.add("hide");
				setTimeout(() => {
					node.remove();
					delete os.notification.cloneNodes[Object.keys(os.notification.cloneNodes)[i]];
				}, 500)
			})
			os.notification.cloneNodes = {};
		} else {
			$(".window-sidebar").classList.remove("active");
			os.showSidebar = false;
		}
	})

	document.addEventListener("mousedown", (e) => {
		if ($(".window-taskbar-system").contains(e.target) || e.target == $(".window-taskbar-system") || e.target == $(".window-sidebar") || $(".window-sidebar").contains(e.target)) return;
		$(".window-sidebar").classList.remove("active");
		os.showSidebar = false;
	})

	$(".window-sidebar-calendar-summary").innerHTML = new Date().toLocaleDateString(void 0, {
		weekday: "long",
		month: "long",
		day: "numeric"
	})
})

var App_data = {};

class APP_Mover {
	/**
	 * 
	 * @param {Element} app 
	 * @param {Element} mask 
	 * @param {Element} toolbar 
	 * @param {Element} toolbarControls 
	 * @param {Element} toolbarToggleFull 
	 * @param {Object} config 
	 */
	constructor(app, mask, toolbar, toolbarControls, toolbarToggleFull, config, func, token) {
		var last = {
			x: 0,
			y: 0
		}

		var app_mask = mask;
		var app_pos_preview = $(".reps");
		var app_toolbar = toolbar;
		var app_toolbar_controls = toolbarControls;
		var app_toolbar_toggle_full = toolbarToggleFull;
		var pos = ["lt", "lf", "lb", "rt", "rf", "rb", "f"];
		var app_data = {
			width: 420,
			height: 300,
			x: 0,
			y: 0,
			boundary: null,
			useBoundary: false,
			fullMode: false,
			dragging: false
		}
		if (config.fullscreen == true) {
			app_data.fullMode = true;
			app.style.borderRadius = 0;
			app_data.boundary = "f";
		}
		function Module_Comparator(_custom, _default, _config) {
			var _default_arrs = {
				keys: Object.keys(_default),
				values: Object.values(_default)
			},
				res = {};
			_default_arrs.values.forEach((default_value, i) => {
				if (_custom.hasOwnProperty(_default_arrs.keys[i])) {
					res[_default_arrs.keys[i]] = _custom[_default_arrs.keys[i]]
				} else {
					res[_default_arrs.keys[i]] = default_value;
				}
			})
			return res;
		}
		if (config) {
			if (!Object.prototype.toString.call(config) === '[object Object]') { } else {
				app_data = Module_Comparator(config, app_data);
			}
		}
		console.log(app_data, config)
		var last_pos = null;
		var events = {
			"start": ["mousedown", "touchstart", "pointerdown"],
			"move": ["mousemove", "touchmove", "pointermove"],
			"end": ["mouseup", "touchend", "pointerup", "blur"]
		}

		function formatPos(pos, pre) {
			var res = {
				x: pre == true ? settings.preview : 0,
				y: pre == true ? settings.preview : 0,
				width: pre == true ? window.innerWidth - settings.preview * 2 : window.innerWidth,
				height: pre == true ? (window.innerHeight - settings.barHeight) / 2 - settings.preview * 2 : (window.innerHeight - settings.barHeight) / 2
			}
			if (pos.search("f") > -1) {
				res.height = pre == true ? window.innerHeight - settings.barHeight - settings.preview * 2 : window.innerHeight - settings.barHeight;
			}
			if (pos != "f") {
				res.width = pre == true ? window.innerWidth / 2 - settings.preview * 2 : window.innerWidth / 2;
			}
			if (pos.search("r") > -1) {
				res.x = pre == true ? window.innerWidth / 2 + settings.preview : window.innerWidth / 2;
			}
			if (pos.search("b") > -1) {
				res.y = pre == true ? (window.innerHeight - settings.barHeight) / 2 + settings.preview : (window.innerHeight - settings.barHeight) / 2;
			}
			return pos ? res : null;
		}

		app_toolbar_toggle_full.addEventListener("click", () => {
			if (app_data.boundary == null && app_data.fullMode == false) {
				app_data.useBoundary = false;
			}
			app.style.transition = `all ${animation_setting.duration}ms ${animation_setting.timingFunction}`;
			if (app_data.fullMode == false) {
				app.style.left = formatPos("f").x + "px";
				app.style.top = formatPos("f").y + "px";
				app.style.width = formatPos("f").width + "px";
				app.style.height = formatPos("f").height + "px";
				app.classList.add("window-frame-application-full-mode");
				app_toolbar_toggle_full.classList.add("window-frame-application-toolbar-action-toggle-full-mode");
				// app.style.borderRadius = 0;
				app_data.fullMode = true;
			} else {
				app.style.left = (app_data.useBoundary == true ? formatPos(app_data.boundary).x : app_data.x) + "px";
				app.style.top = (app_data.useBoundary == true ? formatPos(app_data.boundary).y : app_data.y) + "px";
				app.style.width = (app_data.useBoundary == true ? formatPos(app_data.boundary).width : app_data.width) + "px";
				app.style.height = (app_data.useBoundary == true ? formatPos(app_data.boundary).height : app_data.height) + "px";
				app.classList.remove("window-frame-application-full-mode");
				app_toolbar_toggle_full.classList.remove("window-frame-application-toolbar-action-toggle-full-mode");
				app.style.borderRadius = app_data.useBoundary == true ? 0 : "revert-layer";
				app_data.fullMode = false;
			}
			setTimeout(() => {
				app.style.transition = "";
			}, animation_setting.duration)
		})

		function handleStart(e) {
			if (e.target != app_toolbar_controls && app_toolbar_controls.contains(e.target) == false) {
				if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
					var touch = e.touches[0] || e.changedTouches[0];
					e.pageX = touch.pageX;
					e.pageY = touch.pageY;
				}
				last = {
					x: e.pageX,
					y: e.pageY
				}
				$(".window-frame-application-content-mask", true).forEach(mask => {
					mask.style.display = "block";
				})
				$(".window-frame-application.focus", true).forEach(application => {
					application.classList.remove("focus");
				})
				max_z_index += 2;
				app_pos_preview.style.zIndex = max_z_index - 1;
				app.style.zIndex = max_z_index;
				app.classList.add("focus");
				app_data.dragging = true;
				app_mask.style.display = "block";
				app_mask.focus();
			} else {
				app_data.dragging = false;
				app_mask.style.display = "none";
			}
		}

		function handleMove(e) {
			if (app_data.dragging == false) return;
			if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
				var touch = e.touches[0] || e.changedTouches[0];
				e.pageX = touch.pageX;
				e.pageY = touch.pageY;
			}
			app.classList.remove("window-frame-application-full-mode");
			app_toolbar_toggle_full.classList.remove("window-frame-application-toolbar-action-toggle-full-mode");
			app.style.width = app_data.width + "px";
			app.style.height = app_data.height + "px";
			app.style.borderRadius = "revert-layer";
			app.style.pointerEvents = "none";
			app.style.userSelect = "none";
			app.style.boxShadow = "revert-layer";
			app_data.fullMode = false;
			// app.style.zIndex = "3";
			if (getPosition(app).x + e.pageX - last.x < window.innerWidth - settings.minOver && getPosition(app).x + e.pageX - last.x + app.offsetWidth > settings.minOver + app_toolbar_controls.offsetWidth) {
				app.style.left = getPosition(app).x + e.pageX - last.x + "px";
			}
			if (getPosition(app).y + e.pageY - last.y < window.innerHeight - settings.barHeight - settings.minOver && getPosition(app).y + e.pageY - last.y > 0) {
				app.style.top = getPosition(app).y + e.pageY - last.y + "px";
			}
			var temp_pos = "";
			if (e.pageX < settings.boundary || e.pageX > window.innerWidth - settings.boundary || e.pageY < settings.boundary) {
				app_pos_preview.style.left = (e.pageX < 0 ? 0 : e.pageX > window.innerWidth ? window.innerWidth : e.pageX) + "px";
				app_pos_preview.style.top = (e.pageY < 0 ? 0 : e.pageY > window.innerHeight - settings.barHeight ? window.innerHeight - settings.barHeight : e.pageY) + "px";
				app_pos_preview.style.zIndex = max_z_index - 1;
				app_pos_preview.classList.add("active");
				if (e.pageX < settings.boundary) {
					temp_pos += "l";
					if (e.pageY < settings.boundary) {
						temp_pos += "t";
					} else if (e.pageY > window.innerHeight - settings.barHeight - settings.boundary) {
						temp_pos += "b";
					} else {
						temp_pos += "f";
					}
				} else if (e.pageX > window.innerWidth - settings.boundary) {
					temp_pos += "r";
					if (e.pageY < settings.boundary) {
						temp_pos += "t";
					} else if (e.pageY > window.innerHeight - settings.barHeight - settings.boundary) {
						temp_pos += "b";
					} else {
						temp_pos += "f";
					}
				} else {
					temp_pos = "f"
				}
				if (app_data.boundary != temp_pos) {
					app_data.boundary = temp_pos;
				}
				if (last_pos != formatPos(temp_pos)) {
					last_pos = formatPos(temp_pos);
					app_pos_preview.style.left = formatPos(temp_pos, true).x + "px";
					app_pos_preview.style.top = formatPos(temp_pos, true).y + "px";
					app_pos_preview.style.width = formatPos(temp_pos, true).width + "px";
					app_pos_preview.style.height = formatPos(temp_pos, true).height + "px";
				}
			} else {
				app_pos_preview.classList.remove("active");
				app_data.boundary = null;
				app_pos_preview.style.width = "";
				app_pos_preview.style.height = "";
				app_pos_preview.style.left = (e.pageX < 0 ? 0 : e.pageX > window.innerWidth ? window.innerWidth : e.pageX) + "px";
				app_pos_preview.style.top = (e.pageY < 0 ? 0 : e.pageY > window.innerHeight - settings.barHeight ? window.innerHeight - settings.barHeight : e.pageY) + "px";
			}
			last = {
				x: e.pageX,
				y: e.pageY
			}
		}

		function handleEnd() {
			if (app_data.dragging == false) return;
			app_data.x = getPosition(app).x;
			app_data.y = getPosition(app).y;
			if (app_data.boundary != null) {
				app.style.transition = `all ${animation_setting.duration}ms ${animation_setting.timingFunction}`;
				app_data.useBoundary = true
				app.style.left = formatPos(app_data.boundary).x + "px";
				app.style.top = formatPos(app_data.boundary).y + "px";
				app.style.width = formatPos(app_data.boundary).width + "px";
				app.style.height = formatPos(app_data.boundary).height + "px";
				app_data.fullMode = false;
				if (app_data.boundary == "f") {
					app.classList.add("window-frame-application-full-mode");
					app_toolbar_toggle_full.classList.add("window-frame-application-toolbar-action-toggle-full-mode");
					app_data.fullMode = true;
					app_data.useBoundary = false;
				} else {
					app.classList.remove("window-frame-application-full-mode");
					app_toolbar_toggle_full.classList.remove("window-frame-application-toolbar-action-toggle-full-mode");
				}
				app.style.borderRadius = 0;
				app.style.boxShadow = "none";
				setTimeout(() => {
					app.style.transition = "";
				}, animation_setting.duration)
			} else {
				app_data.useBoundary = false;
				app.style.boxShadow = "revert-layer";
			}
			if (app_data.boundary != "f") {
				app_data.x = getPosition(app).x;
				app_data.y = getPosition(app).y;
			}
			$(".window-frame-application-content-mask", true).forEach(e => {
				e.style.display = "none";
			})
			app.style.zIndex = max_z_index;
			$(".window-frame-application.focus", true).forEach(e => {
				e.classList.remove("focus");
			})
			app.classList.add("focus");
			app_data.dragging = false;
			app_mask.style.display = "none";
			app_mask.blur();
			app_pos_preview.classList.remove("active");
			app_pos_preview.style.width = "";
			app_pos_preview.style.height = "";
			app.style.pointerEvents = "unset";
			app.style.userSelect = "unset";
			// app.style.zIndex = "unset";
		}

		events.start.forEach(event => {
			app_toolbar.addEventListener(event, e => handleStart(e))
		})

		events.move.forEach(event => {
			window.addEventListener(event, e => handleMove(e))
		})

		events.end.forEach(event => {
			window.addEventListener(event, e => handleEnd(e))
		})
	}
}

var thumbnail_window = document.createElement("div");
var thumbnail_bar = document.createElement("div");
var thumbnail_icon = document.createElement("img");
var thumbnail_title = document.createElement("div");
var thumbnail_view = document.createElement("div");
var thumbnail_close_button = document.createElement("div");
var thumbnail_app = {};
var thumbnail_queue = {};

thumbnail_window.className = "thumbnail-window";
thumbnail_view.className = "thumbnail-window-view";
thumbnail_bar.className = "thumbnail-window-bar";
thumbnail_icon.className = "thumbnail-window-icon";
thumbnail_title.className = "thumbnail-window-title";
thumbnail_close_button.className = "thumbnail-window-close-button";

thumbnail_window.style.padding = `${thumbnail_setting.padding.top}px ${thumbnail_setting.padding.right}px ${thumbnail_setting.padding.bottom}px ${thumbnail_setting.padding.left}px`;
thumbnail_icon.src = "./application.png";
thumbnail_title.innerHTML = "Application";
thumbnail_close_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;

window.addEventListener("load", () => {
	document.body.appendChild(thumbnail_window);
	thumbnail_window.appendChild(thumbnail_bar);
	thumbnail_window.appendChild(thumbnail_view);

	thumbnail_bar.appendChild(thumbnail_icon);
	thumbnail_bar.appendChild(thumbnail_title);
	thumbnail_bar.appendChild(thumbnail_close_button);
})

function getThumbnailWindowRatio(parent, pt = false) {
	return {
		x: pt == true ? parent.offsetWidth / thumbnail_setting.maxWidth : thumbnail_setting.maxWidth / parent.offsetWidth,
		y: pt == true ? parent.offsetHeight / thumbnail_setting.maxHeight : thumbnail_setting.maxHeight / parent.offsetHeight
	}
}

function closeAppFromThumbnailWindow() {
	thumbnail_app.close();
	thumbnail_window.classList.remove('active');
}

thumbnail_close_button.addEventListener("click", closeAppFromThumbnailWindow);

thumbnail_window.addEventListener("click", (e) => {
	if (e.target == thumbnail_close_button || thumbnail_close_button.contains(e.target)) return;
	if (thumbnail_app != null) {
		$(".window-taskbar-application", true).forEach(e => {
			e.classList.remove("active");
		})
		if (thumbnail_app.status.show == false) {
			thumbnail_app.unminimizeWindow();
		}
		thumbnail_app.status.show = true;
		thumbnail_app.app_icon.classList.add("active");
		max_z_index++;
		thumbnail_app.parent.style.zIndex = max_z_index;
	}
	thumbnail_window.classList.remove("active");
	Object.keys(thumbnail_queue).forEach((item, i) => {
		thumbnail_queue[item] = false;
	})
	thumbnail_app = null;
})

function hideThumbnailWindow() {
	var id = hash(36);
	thumbnail_queue[id] = false;
	setTimeout(() => {
		if (thumbnail_queue[id] == false) {
			thumbnail_window.classList.remove("active");
			thumbnail_app = null;
		}
		delete thumbnail_queue[id];
	}, 200);
}

thumbnail_window.addEventListener("mouseover", () => {
	Object.keys(thumbnail_queue).forEach((item, i) => {
		thumbnail_queue[item] = true;
	})
})

thumbnail_window.addEventListener("mouseleave", () => {
	var id = hash(36);
	thumbnail_queue[id] = false;
	setTimeout(() => {
		if (thumbnail_queue[id] == false) {
			thumbnail_window.classList.remove("active");
			Object.keys(thumbnail_queue).forEach((item, i) => {
				thumbnail_queue[item] = false;
			})
			thumbnail_app = null;
		}
		delete thumbnail_queue[id];
	}, 200);
})

function setThumbnailWindow(app) {
	Object.keys(thumbnail_queue).forEach((item, i) => {
		thumbnail_queue[item] = true;
	})
	thumbnail_window.classList.add("active");
	if (thumbnail_app == app) return;
	console.log(app)
	thumbnail_app = app;
	thumbnail_view.innerHTML = "";
	thumbnail_view.style.maxWidth = thumbnail_setting.maxWidth + "px";
	thumbnail_view.style.maxHeight = thumbnail_setting.maxHeight + "px";
	var ratio = getThumbnailWindowRatio(app.elements.window, true);
	var scale = getThumbnailWindowRatio(app.elements.window).x;
	if (ratio.x < ratio.y) {
		scale = getThumbnailWindowRatio(app.elements.window).y;
	}
	var cloneNode = app.elements.window.cloneNode(true);
	cloneNode.style.position = "static";
	cloneNode.style.transform = `scale(${scale})`;
	cloneNode.style.opacity = "1";
	thumbnail_view.appendChild(cloneNode);
	var left = getPosition(app.app_icon).x + app.app_icon.offsetWidth / 2 - cloneNode.offsetWidth * scale / 2;
	if (left < 12) {
		left = 12;
	}
	thumbnail_window.style.left = left + "px";
	thumbnail_view.style.width = cloneNode.offsetWidth * scale + "px";
	thumbnail_view.style.height = cloneNode.offsetHeight * scale + "px";
	thumbnail_window.style.maxWidth = cloneNode.offsetWidth * scale + thumbnail_setting.padding.left + thumbnail_setting.padding.right + "px";
	thumbnail_window.style.padding = "6px";
	thumbnail_title.innerHTML = app.settings.title.trim() == "" ? "Application" : formatString(app.settings.title || "Application");
	thumbnail_icon.src = app.settings.icon || "./application.png";
}

/**
 * Open an application
 * @param {Number|String} id 
 * @param {Function} callback 
 * @param {Object} config 
 */

// var count = 0;

class App {
	constructor(id, callback, config) {
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
		this.id = id;
		this.settings = settings;
		this.name = this.settings["title"];
		this.hash = hash(24, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_");
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
	loadStyles(content, type, callback = function () { }) {
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
	minimizeWindow = null;
	unminimizeWindow = null;
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
		var appSettings = this.settings;
		parent.className = "window-frame-application";
		parent.setAttribute("app-hash-content", this.hash);
		appSettings.fullscreen == true && parent.classList.add("window-frame-application-full-mode");
		appSettings.show == true && parent.classList.add("window-frame-application-show");
		parent.style.top = appSettings.y + "px";
		parent.style.left = appSettings.x + "px";
		parent.style.width = (appSettings.width + appSettings.x < window.innerWidth ? appSettings.width : window.innerWidth - appSettings.x) + "px";
		parent.style.height = (appSettings.height + appSettings.y < window.innerHeight - 45 ? appSettings.height : window.innerHeight - appSettings.y - 45) + "px";
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

		if (appSettings.toolbar == true) {
			parent.appendChild(toolbar);
		}
		parent.appendChild(content);
		parent.appendChild(mask);

		this.status = {
			drag: false,
			app_position_side: null,
			side_data: null,
			last_x: appSettings.x,
			last_y: appSettings.y,
			mouse_x: 0,
			mouse_y: 0,
			last_width: appSettings.width,
			last_height: appSettings.height,
			in_full_mode: false,
			frame_exsit: true,
			show: appSettings.show
		}

		var app_icon = appSettings.showinbar == true ? child("div", $(".window-taskbar-applications"), { class: appSettings.show == true ? "window-taskbar-application running active" : "window-taskbar-application running" }, `<div class="window-taskbar-application-icon"><img class="window-taskbar-application-icon-image" src="${appSettings.icon ? appSettings.icon : "./application.png"}"></div>`) : document.createElement("undefined-element");

		var loading = child("div", parent, { class: appSettings.showloading == true ? "window-frame-application-loading active" : "window-frame-application-loading", style: `background: ${appSettings.backgroundColor}` }, `<svg class="webos-loading-spinner" height="48" width="48" viewBox="0 0 16 16">
		<circle cx="8px" cy="8px" r="7px" style="stroke: ${appSettings.loadingColor}"></circle>
	</svg>`);

		this.showLoading = () => {
			loading.classList.add("active");
		}

		this.hideLoading = () => {
			loading.classList.remove("active");
		}

		if (appSettings.toolbar == true) {
			var title = child("div", toolbar, { class: "window-frame-application-toolbar-title" });
			var drag = child("div", toolbar, { class: "window-frame-application-toolbar-drag" });
			var action = child("div", toolbar, { class: "window-frame-application-toolbar-actions" });

			var icon = child("img", title, { class: "window-frame-application-toolbar-title-icon", src: appSettings.icon ? appSettings.icon : "./application.png" });

			icon.onerror = () => {
				var error = document.createElement("div");
				error.className = "error-image";
				handleImageError(icon, error, "./application.png");
			}

			var title_text = child("span", title, { class: "window-frame-application-toolbar-title-content" }, appSettings.title ? formatString(appSettings.title) : "Application");

			var mini = appSettings.minimizable == true ? child("div", action, { class: "window-frame-application-toolbar-action-small window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1"stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6"></path></svg>`) : false;

			var full = appSettings.fullscreenable == true ? child("div", action, { class: "window-frame-application-toolbar-action-toggle window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" data-svg="unfull"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"></path></svg><svg fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" data-svg="full"><rect x="5" y="6" width="14" height="12"></rect></svg>`) : false;

			var close = appSettings.closable == true ? child("div", action, { class: "window-frame-application-toolbar-action-close window-frame-application-toolbar-action" }, `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`) : false;

			$(".window-taskbar-application", true).forEach(e => {
				e.classList.remove("active");
			})

			var __drag__ = appSettings.movable == true ? dragger(drag) : {
				On: function () { },
				InArea: function () { }
			};

			this.app_icon = app_icon;

			var window_width = window.innerWidth;
			var window_height = window.innerHeight;

			if (close != false) {
				close.addEventListener("click", () => {
					parent.remove();
					// $(".window-taskbar-application").remove();
					this.status.frame_exsit = false;
				})
			}

			if (appSettings.movable == true) {
				new APP_Mover(parent, mask, toolbar, action, full == false ? document.createElement("div") : full, appSettings)

				/*
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
	
					if (appSettings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.add("hide");
						$('[data-svg="full"]').classList.remove("hide");
						$('.window-frame-application-toolbar-action-toggle').classList.remove("window-frame-application-toolbar-action-toggle-full-mode")
					}
					parent.classList.remove("window-frame-application-full-mode");
					parent.style.width = appSettings.width + "px";
					parent.style.height = appSettings.height + "px";
					var x = e.pageX,
						y = e.pageY;
	
					if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
						var touch = e.touches[0] || e.changedTouches[0];
						x = touch.pageX;
						y = touch.pageY;
					}
	
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
							//if (e == "bottom") {
							//	return $(".reps").style = "width: calc(100vw - 16px); height: calc((100vh - 45px) / 2 - 12px);bottom: 53px; left: 8px; right: 8px; top: auto; ", this.status.app_position_side = e, this.status.side_data = `bottom: 45px; left: 0; right: 0; top: auto; width: 100vw; height: calc((100% - 45px) / 2);`;
							//}
						}
	
					}, {
						pageX: x,
						pageY: y
					});
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
					if (this.status.in_full_mode == true && this.status.frame_exsit == true && appSettings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.remove("hide");
						$('[data-svg="full"]').classList.add("hide");
					}
					parent.style.zIndex = max_z_index;
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
					if (this.status.in_full_mode == true && this.status.frame_exsit == true && appSettings.fullscreenable == true) {
						$('[data-svg="unfull"]').classList.remove("hide");
						$('[data-svg="full"]').classList.add("hide");
					}
					parent.style.zIndex = max_z_index;
					$(".window-frame-application.focus", true).forEach(e => {
						e.classList.remove("focus");
					})
					parent.classList.add("focus");
				})
				*/
			}

			/*
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
			*/

			function minimizeWindow() {
				parent.style.transition = `transform ${animation_setting.duration}ms ${animation_setting.timingFunction}, opacity ${animation_setting.duration / 2}ms ${animation_setting.timingFunction}`;
				parent.style.transform = `translate3d(${(getPosition(app_icon).x - app_icon.offsetWidth / 2) - (getPosition(parent).x)}px, ${window.innerHeight - settings.barHeight - parent.offsetHeight * animation_setting.minScale - getPosition(parent).y}px, 0px) scale(${animation_setting.minScale})`;
				setTimeout(() => {
					parent.style.opacity = 0;
					parent.style.zIndex = 0;
				}, animation_setting.duration * .75);
			}

			function unminimizeWindow() {
				parent.style.transition = `transform ${animation_setting.duration}ms ${animation_setting.timingFunction}, opacity ${animation_setting.duration / 2}ms ${animation_setting.timingFunction}`;
				parent.style.opacity = 1;
				parent.style.transform = `translate3d(0px, 0px, 0px) scale(1)`;
			}

			this.minimizeWindow = minimizeWindow;
			this.unminimizeWindow = unminimizeWindow;

			parent.addEventListener("mousedown", (e) => {
				if (mini != false) {
					if (e.target == mini || mini.contains(e.target)) return;
				}
				$(".window-taskbar-application", true).forEach(e => {
					e.classList.remove("active");
				})
				this.status.show = true;
				app_icon.classList.add("active");
				max_z_index++;
				parent.style.zIndex = max_z_index;
				parent.classList.add("window-frame-application-show");
			})

			/*
			var mouse_enter_time = Date.now();
			var thumbnail = document.createElement("div");
			var thumbnail_bar = document.createElement("div");
			var thumbnail_icon = document.createElement("img");
			var thumbnail_title = document.createElement("div");
			var thumbnail_view = document.createElement("div");

			thumbnail.className = "window-thumbnail";
			thumbnail_view.className = "window-thumbnail-view";
			thumbnail_bar.className = "window-thumbnail-bar";
			thumbnail_icon.className = "window-thumbnail-icon";
			thumbnail_title.className = "window-thumbnail-title";

			thumbnail.style.padding = "6px";
			thumbnail_icon.src = appSettings.icon || "./application.png";
			thumbnail_title.innerHTML = formatString(appSettings.title) || "Application";

			app_icon.appendChild(thumbnail);
			thumbnail.appendChild(thumbnail_bar);
			thumbnail.appendChild(thumbnail_view);

			thumbnail_bar.appendChild(thumbnail_icon);
			thumbnail_bar.appendChild(thumbnail_title);

			var show_thumbnail = false;

			function getThumbnailWindowRatio(pt = false) {
				return {
					x: pt == true ? parent.offsetWidth / thumbnail_setting.maxWidth : thumbnail_setting.maxWidth / parent.offsetWidth,
					y: pt == true ? parent.offsetHeight / thumbnail_setting.maxHeight : thumbnail_setting.maxHeight / parent.offsetHeight
				}
			}

			app_icon.addEventListener("mouseenter", () => {
				mouse_enter_time = Date.now();
			})

			app_icon.addEventListener("mouseover", () => {
				if (show_thumbnail == true) return;
				if (Date.now() - mouse_enter_time > 100) {
					thumbnail.classList.add("active");
					show_thumbnail = true;
					thumbnail_view.innerHTML = "";
					thumbnail_view.style.maxWidth = thumbnail_setting.maxWidth + "px";
					thumbnail_view.style.maxHeight = thumbnail_setting.maxHeight + "px";
					var ratio = getThumbnailWindowRatio(true);
					var scale = getThumbnailWindowRatio().x;
					if (ratio.x < ratio.y) {
						scale = getThumbnailWindowRatio().y;
					}
					var cloneNode = parent.cloneNode(true);
					cloneNode.style.position = "static";
					cloneNode.style.transform = `scale(${scale})`;
					cloneNode.style.opacity = "1";
					thumbnail_view.appendChild(cloneNode);
					thumbnail_view.style.width = cloneNode.offsetWidth * scale + "px";
					thumbnail_view.style.height = cloneNode.offsetHeight * scale + "px";
					thumbnail.style.maxWidth = cloneNode.offsetWidth * scale + thumbnail_setting.padding * 2 + "px";
					thumbnail.style.padding = "6px";
					thumbnail_icon.src = appSettings.icon || "./application.png";
					thumbnail_title.innerHTML = formatString(appSettings.title) || "Application";
				}
			})

			app_icon.addEventListener("mouseleave", () => {
				thumbnail.classList.remove("active");
				show_thumbnail = false;
			})
			*/

			app_icon.addEventListener("mouseover", (e) => {
				setThumbnailWindow(this)
			})

			app_icon.addEventListener("mouseleave", (e) => {
				hideThumbnailWindow()
			})

			this.focusWindow = () => {
				if (last_click_app != this.hash) {
					$(".window-taskbar-application", true).forEach(e => {
						e.classList.remove("active");
					})
					this.status.show = true;
					app_icon.classList.add("active");
					max_z_index++;
					parent.style.zIndex = max_z_index;
					// 
					unminimizeWindow();
					// parent.classList.add("window-frame-application-show");
				} else {
					$(".window-taskbar-application", true).forEach(e => {
						e.classList.remove("active");
					})
					this.status.show = true;
					app_icon.classList.add("active");
					max_z_index++;
					parent.style.zIndex = max_z_index;
					//
					unminimizeWindow();
					// parent.classList.add("window-frame-application-show");
				}

				last_click_app = this.hash;
			}

			app_icon.addEventListener("click", (e) => {
				if (last_click_app != this.hash) {
					$(".window-taskbar-application", true).forEach(e => {
						e.classList.remove("active");
					})
					this.status.show = true;
					app_icon.classList.add("active");
					max_z_index++;
					parent.style.zIndex = max_z_index;
					// 
					unminimizeWindow();
					// parent.classList.add("window-frame-application-show");
				} else {
					if (this.status.show == true) {
						this.status.show = false;
						app_icon.classList.remove("active");
						// 
						minimizeWindow();
						// parent.classList.remove("window-frame-application-show");
					} else {
						$(".window-taskbar-application", true).forEach(e => {
							e.classList.remove("active");
						})
						this.status.show = true;
						app_icon.classList.add("active");
						max_z_index++;
						parent.style.zIndex = max_z_index;
						//
						unminimizeWindow();
						// parent.classList.add("window-frame-application-show");
					}
				}

				last_click_app = this.hash;
			})

			mini !== false && mini.addEventListener("click", () => {
				//
				minimizeWindow();
				// parent.classList.remove("window-frame-application-show");
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

		if (appSettings.showinbar == true) {
			app_icon.querySelector(".window-taskbar-application-icon-image").onerror = () => {
				var error = document.createElement("div");
				error.className = "error-image";
				handleImageError(app_icon.querySelector(".window-taskbar-application-icon-image"), error, "./application.png");
			}
		}

		this.hide = () => {
			this.status.show = false;
			if (this.minimizeWindow != null) {
				this.minimizeWindow();
			} else {
				parent.classList.remove("window-frame-application-show");
			}
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
			appSettings.icon = url;
			app_icon.querySelector(".window-taskbar-application-icon-image").src = url;
			app_icon.querySelector(".window-taskbar-application-icon-image").onerror = () => {
				var error = document.createElement("div");
				error.className = "error-image";
				handleImageError(app_icon.querySelector(".window-taskbar-application-icon-image"), error, "./application.png");
			}
			icon.src = url;
			icon.onerror = () => {
				var error = document.createElement("div");
				error.className = "error-image";
				handleImageError(icon, error, "./application.png");
			}
		}

		function changeTitle(title) {
			if (!title) return;
			appSettings.title = title;
			title_text.innerHTML = formatString(title);
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

os.App = App;

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