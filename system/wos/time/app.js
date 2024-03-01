(function () {
	Date.prototype.format = function (fmt) { var o = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds() }; if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)); } for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))); } } return fmt; };

	var show = false;

	var app = new App(null, null, {
		showinbar: false,
		x: window.innerWidth,
		toolbar: false
	}).execute(`<div class="wos-time"><div class="wos-time-clock"></div></div>`);
	app.elements.content.style = "padding: 10px;box-sizing: border-box;backdrop-filter: blur(10px);background: rgba(250, 253, 255, 0.91); height: 100%;";
	app.elements.window.style = "display: none; width: fit-content; height: fit-content;box-shadow: 0px 1px 15px 5px rgba(0,0,0,0.12); bottom: 8px; right: 12px;";

	var now = new Date(Date.now());

	var pattern = ["上午 ", "下午 "]

	$(".window-tool-bar-system-time-time").innerHTML = (now.format("hh") < 12 ? pattern[0] : pattern[1]) + (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm"));
	$(".window-tool-bar-system-time-date").innerHTML = now.format("yyyy/MM/dd");

	var last_time = now.format("yyyy/MM/dd hh:mm");
	var last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");
	var app_time_element = app.elements.content.querySelector(".wos-time-clock");

	setInterval(function () {
		var now = new Date(Date.now())
		if (last_whole_time !== now.format("yyyy/MM/dd hh:mm:ss")) {
			app_time_element.innerHTML = now.format("yyyy/MM/dd hh:mm:ss");
			last_whole_time = now.format("yyyy/MM/dd hh:mm:ss");
		}
		if (last_time !== now.format("yyyy/MM/dd hh:mm")) {
			$(".window-tool-bar-system-time-time").innerHTML = (now.format("hh") < 12 ? pattern[0] : pattern[1]) + (now.format("hh") < 13 ? now.format("hh:mm") : new Date(Date.now() - 12 * 1000 * 60 * 60).format("hh:mm"));
			$(".window-tool-bar-system-time-date").innerHTML = now.format("yyyy/MM/dd");
			last_time = now.format("yyyy/MM/dd hh:mm");
		}
	}, 1000);

	$(".window-tool-bar-system").addEventListener("click", () => {
		if (show == false) {
			app.elements.window.style.display = "block";
			app.elements.window.style.zIndex = "1000";
			$(".window-tool-bar-system").classList.add("active");
			show = true;
		} else {
			app.elements.window.style.display = "none";
			$(".window-tool-bar-system").classList.remove("active");
			show = false;
		}

	})

	document.addEventListener("mousedown", (e) => {
		if (app.elements.window.contains(e.target)) return;
		if ($(".window-tool-bar-system").contains(e.target) || e.target == $(".window-tool-bar-system")) return;
		app.elements.window.style.display = "none";
		$(".window-tool-bar-system").classList.remove("active");
		show = false;
	})
})();