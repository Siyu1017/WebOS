document.addEventListener("mousemove", (e) => {
    var app = new App("VIRUS" + Date.now(),null,{
    minimizable: false,
    fullscreenable: false,
    icon: "./error.png",
    toolbar: false,
        x: e.clientX,
        y: e.clientY
}).execute('<img src="./error.png" style="width: 36px;height: 36px;-webkit-user-drag: none;">');
app.elements.window.style.width = "fit-content";
app.elements.window.style.heigth = "fit-content";
    app.elements.window.style.pointerEvents = "none"
app.elements.window.style.boxShadow = "none";
    app.elements.content.style.background = "none"
})

for(i =0;i<1000;i++){
var app = new App("VIRUS" + Date.now(),null,{
    minimizable: false,
    fullscreenable: false,
    icon: "./error.png",
    toolbar: false,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
}).execute('<img src="./error.png" style="width: 36px;height: 36px;-webkit-user-drag: none;">');
app.elements.window.style.zIndex = "100";app.elements.window.style.width = "fit-content";
app.elements.window.style.heigth = "fit-content";
    app.elements.window.style.pointerEvents = "none"
app.elements.window.style.boxShadow = "none";
    app.elements.content.style.background = "none"
}