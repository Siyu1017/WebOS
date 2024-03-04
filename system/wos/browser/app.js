(function () {
	var test = new App(null, "", {
		width: 420,
		height: 300,
		y: 75,
		x: 120,
		title: "Web Browser",
		icon: "./system/wos/browser/browser.png",
		showloading: true,
		backgroundColor: "rgb(255, 255, 255)"
	});
	var tests = test.execute(`<div class="browser">
<div class="tools">
	<div class="back disabled" id="back">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
		</svg>
	</div>
	<div class="forward disabled" id="next">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
		</svg>
	</div>
	<div class="refresh" id="refresh">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor" width="18" height="18">
			<path
				d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
				stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" stroke-width="1.5"
				stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</div>
	<input type="text" id="url-i" autocomplete="off">
</div>
<div class="frame">
	<iframe id="browser" hidden></iframe>
	<div class="home" id="home">
		<div class="title">Just a web browser</div>
		<div class="description">We can say very responsibly: there are many problems in this web browser.</div>
	</div>
</div>
</div>`, () => {

		function formarString(str) {
			return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		}
		NProgress.configure({
			showSpinner: false,
			parent: ".frame"
		});
		var visit_history = [];
		var currentIndex = -1;
		var back = document.getElementById("back");
		var next = document.getElementById("next");

		next.addEventListener("click", () => {
			goForward();
		});
		back.addEventListener("click", () => {
			goBack();
		});
		document.getElementById("refresh").addEventListener("click", () => {
			reload();
		});

		function loadPage(url, type) {
			home.hidden = true;
			browser.hidden = false;
			if (type == 1) {
				if (url != visit_history[visit_history.length - 1]) {
					addToHistory(url);
				}
			}
			var iframe = document.getElementById('browser');
			iframe.src = url;
			if (currentIndex > -1) {
				back.classList.remove("disabled");
			} else {
				back.classList.add("disabled");
			}
			if (currentIndex + 1 < visit_history.length) {
				next.classList.remove("disabled");
			} else {
				next.classList.add("disabled");
			}
			tests.changeTitle(formarString(url));
			NProgress.set(0);
			NProgress.start();
			document.getElementById("refresh").classList.add("disabled");
		}

		function goForward() {
			if (currentIndex < visit_history.length - 1) {
				currentIndex++;
				loadPage(visit_history[currentIndex]);
				document.getElementById("url-i").value = visit_history[currentIndex];
			}
			if (currentIndex > -1) {
				back.classList.remove("disabled");
			} else {
				back.classList.add("disabled");
			}
			if (currentIndex + 1 < visit_history.length) {
				next.classList.remove("disabled");
			} else {
				next.classList.add("disabled");
			}
			tests.changeTitle(formarString(visit_history[currentIndex]));
		}

		function reload() {
			document.getElementById('browser').src = document.getElementById('browser').getAttribute("src");
			if (currentIndex > -1) {
				document.getElementById("url-i").value = visit_history[currentIndex];
				tests.changeTitle(formarString(visit_history[currentIndex]));
			} else {
				document.getElementById("url-i").value = "";
				tests.changeTitle("Web Browser");
			}
		}

		function goBack() {
			if (currentIndex > -1) {
				currentIndex--;
				if (currentIndex > -1) {
					home.hidden = true;
					browser.hidden = false;
					loadPage(visit_history[currentIndex]);
					document.getElementById("url-i").value = visit_history[currentIndex];
					tests.changeTitle(formarString(visit_history[currentIndex]));
				} else {
					home.hidden = false;
					browser.hidden = true;
					document.getElementById("url-i").value = "";
					tests.changeTitle("Web Browser");
				}
			}
			if (currentIndex > -1) {
				back.classList.remove("disabled");
			} else {
				back.classList.add("disabled");
			}
			if (currentIndex + 1 < visit_history.length) {
				next.classList.remove("disabled");
			} else {
				next.classList.add("disabled");
			}
		}

		function addToHistory(url) {
			visit_history.splice(currentIndex + 1);
			visit_history.push(url);
			currentIndex++;
			tests.changeTitle(formarString(visit_history[currentIndex]));
		}

		document.getElementById("url-i").addEventListener('focus', function () {
			document.getElementById("url-i").select();
		});

		document.getElementById("url-i").addEventListener("keypress", (e) => {
			if (e.keyCode == 13) {
				loadPage(document.getElementById("url-i").value, 1)
			}
		})
		document.getElementById("browser").onload = () => {
			NProgress.done();
			document.getElementById("refresh").classList.remove("disabled");
		};
		document.getElementById("browser").onerror = () => {
			NProgress.done();
			document.getElementById("refresh").classList.remove("disabled");
		};
		document.getElementById("refresh").onclick = () => {
			if (currentIndex > -1) {
				NProgress.set(0);
				NProgress.start();
				document.getElementById("refresh").classList.add("disabled");
			}
		};

		test.loadStyles("./system/wos/browser/app.css", "url", () => {
			test.hideLoading();
		})
	})
})()