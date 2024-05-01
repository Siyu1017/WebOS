(function () {
	Date.prototype.format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); } for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); } } return fmt; };

	var show = false;

	/*
	var app = new App(null, null, {
		showinbar: false,
		x: window.innerWidth,
		toolbar: false
	}).execute(`<div class="wos-time"><div class="wos-time-clock"></div></div>`);
	*/

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	app.elements.content.style = "padding: 10px;box-sizing: border-box;backdrop-filter: blur(16px) saturate(1.8);background: rgb(241 241 241 / 71%);height: 100%;";
	app.elements.window.style = "display: block;width: fit-content;box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 15px 5px;bottom: 8px;transition: all 0.15s ease-in-out 0s;height: calc(100% - 16px);left: calc(-173px + 100vw);z-index: 15;border: 1px solid #c2c2c2;width: 240px;";
	*/
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*
	app.elements.window.classList.add("wos-time-window");
	app.elements.content.classList.add("wos-time-content");

	var now = new Date(Date.now());

	var pattern = [" AM", " PM"]

	$(".window-taskbar-system-time-time").innerHTML = (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm")) + (now.format("hh") < 12 ? pattern[0] : pattern[1]);
	$(".window-taskbar-system-time-date").innerHTML = now.format("yyyy/MM/dd");

	var last_time = now.format("yyyy/MM/dd hh:mm");
	var last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");
	var app_time_element = app.elements.content.querySelector(".wos-time-clock");

	app.elements.window.style.left = `calc(100vw + ${app.elements.window.offsetWidth}px)`;
	app.elements.window.style.display = "block";

	setInterval(function () {
		var now = new Date(Date.now())
		if (last_whole_time !== now.format("yyyy/MM/dd hh:mm:ss")) {
			app_time_element.innerHTML = now.format("yyyy/MM/dd hh:mm:ss");
			last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");
		}
		if (last_time !== now.format("yyyy/MM/dd hh:mm")) {
			$(".window-taskbar-system-time-time").innerHTML = (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm")) + (now.format("hh") < 12 ? pattern[0] : pattern[1]);
			$(".window-taskbar-system-time-date").innerHTML = now.format("yyyy/MM/dd");
			last_time = now.format("yyyy/MM/dd hh:mm");
		}
	}, 1000);

	$(".window-taskbar-system").addEventListener("click", () => {
		if (show == false) {
			// app.elements.window.style.zIndex = max_z_index + 1;
			// app.elements.window.style.left = `calc(100vw - ${app.elements.window.offsetWidth + 8}px)`;
			// $(".window-taskbar-system").classList.add("active");
			$(".window-sidebar").classList.add("active");
			show = true;
		} else {
			// app.elements.window.style.left = `calc(100vw + ${app.elements.window.offsetWidth}px)`;
			// $(".window-taskbar-system").classList.remove("active");
			$(".window-sidebar").classList.remove("active");
			show = false;
		}

	})

	window.onresize = () => {
		if (show == true) {
			app.elements.window.style.left = `calc(100vw - ${app.elements.window.offsetWidth + 8}px)`;
		} else {
			app.elements.window.style.left = `calc(100vw + ${app.elements.window.offsetWidth}px)`;
		}
	}

	document.addEventListener("mousedown", (e) => {
		if (app.elements.window.contains(e.target)) return;
		if ($(".window-taskbar-system").contains(e.target) || e.target == $(".window-taskbar-system") || e.target == $(".window-sidebar") || $(".window-sidebar").contains(e.target)) return;
		// app.elements.window.style.display = "none";
		// app.elements.window.style.left = `calc(100vw + ${app.elements.window.offsetWidth}px)`;
		// $(".window-taskbar-system").classList.remove("active");
		$(".window-sidebar").classList.remove("active");
		show = false;
	})

	*/
})();