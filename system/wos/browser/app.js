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
	<div class="back disabled" data-id="back">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
		</svg>
	</div>
	<div class="forward disabled" data-id="next">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
		</svg>
	</div>
	<div class="refresh" data-id="refresh">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
			stroke="currentColor" width="18" height="18">
			<path
				d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176"
				stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			<path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" stroke-width="1.5"
				stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</div>
	<input type="text" data-id="url-i" autocomplete="off">
</div>
<div class="frame">
	<iframe data-id="browser" hidden></iframe>
	<div class="home" data-id="home">
		<div class="title">Just a web browser</div>
		<div class="description">We can say very responsibly: there are many problems in this web browser.</div>
	</div>
</div>
</div>`);

		(() => {

			function formarString(str) {
				return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
			}
			NProgress.configure({
				showSpinner: false,
				parent: `[app-hash-content='${test.hash}'] .frame`
			});
			var visit_history = [];
			var currentIndex = -1;
			var back = tests.elements.window.querySelector("[data-id='back']");
			var next = tests.elements.window.querySelector("[data-id='next']");
			var home = tests.elements.window.querySelector("[data-id='home']");
			var browser = tests.elements.window.querySelector("[data-id='browser']");

			next.addEventListener("click", () => {
				goForward();
			});
			back.addEventListener("click", () => {
				goBack();
			});
			tests.elements.window.querySelector("[data-id='refresh']").addEventListener("click", () => {
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
				var iframe = tests.elements.window.querySelector('[data-id="browser"]');
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
				tests.elements.window.querySelector("[data-id='refresh']").classList.add("disabled");
			}

			function goForward() {
				if (currentIndex < visit_history.length - 1) {
					currentIndex++;
					loadPage(visit_history[currentIndex]);
					tests.elements.window.querySelector("[data-id='url-i']").value = visit_history[currentIndex];
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
				tests.elements.window.querySelector('[data-id="browser"]').src = tests.elements.window.querySelector('[data-id="browser"]').getAttribute("src");
				if (currentIndex > -1) {
					tests.elements.window.querySelector("[data-id='url-i']").value = visit_history[currentIndex];
					tests.changeTitle(formarString(visit_history[currentIndex]));
				} else {
					tests.elements.window.querySelector("[data-id='url-i']").value = "";
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
						tests.elements.window.querySelector("[data-id='url-i']").value = visit_history[currentIndex];
						tests.changeTitle(formarString(visit_history[currentIndex]));
					} else {
						home.hidden = false;
						browser.hidden = true;
						tests.elements.window.querySelector("[data-id='url-i']").value = "";
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

			tests.elements.window.querySelector("[data-id='url-i']").addEventListener('focus', function () {
				tests.elements.window.querySelector("[data-id='url-i']").select();
			});

			tests.elements.window.querySelector("[data-id='url-i']").addEventListener("keypress", (e) => {
				if (e.keyCode == 13) {
					loadPage(tests.elements.window.querySelector("[data-id='url-i']").value, 1)
				}
			})
			tests.elements.window.querySelector("[data-id='browser']").onload = () => {
				NProgress.done();
				tests.elements.window.querySelector("[data-id='refresh']").classList.remove("disabled");
			};
			tests.elements.window.querySelector("[data-id='browser']").onerror = () => {
				NProgress.done();
				tests.elements.window.querySelector("[data-id='refresh']").classList.remove("disabled");
			};
			tests.elements.window.querySelector("[data-id='refresh']").onclick = () => {
				if (currentIndex > -1) {
					NProgress.set(0);
					NProgress.start();
					tests.elements.window.querySelector("[data-id='refresh']").classList.add("disabled");
				}
			};

			test.loadStyles("./system/wos/browser/app.css", "url", () => {
				test.hideLoading();
			})
		})();
})()