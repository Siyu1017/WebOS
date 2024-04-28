(() => {
    var w_app = new App("PAINTER" + Date.now(), null, {
        width: 420,
        height: 300,
        title: "Painter",
        backgroundColor: "rgb(36, 36, 36)",
        icon: "data:image/svg+xml,%3Csvg class='svg-24' height='100' stroke='%23565656' preserveAspectRatio='xMidYMid meet' viewBox='0 0 100 100' width='100' x='0' xmlns='http://www.w3.org/2000/svg' y='0'%3E%3Cpath class='svg-stroke-primary' d='M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='6'%3E%3C/path%3E%3C/svg%3E",
        showloading: true,
        loadingColor: "#fff"
    })

    var app = w_app.execute(`<div class="editor"><div class="bottom"><div class="mode-bar unloaded" id="modes"><div class="modes"><div class="mode" data-mode="select"><div class="mode-icon"><svg class="svg-24" height="24" preserveaspectratio="xMidYMid meet" viewbox="0 0 100 100" width="24" x="0" xmlns="http://www.w3.org/2000/svg" y="0" fill="currentColor"><path class="svg-stroke-primary" d="M64,64,56.8,82.1,42.3,42.3,82.1,56.8Zm0,0L82.1,82.1M35.8,17.9l2.8,10.5M28.4,38.6,17.9,35.8M60.2,24.4l-7.6,7.7M32.1,52.6l-7.7,7.6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"></path></svg></div></div><div class="mode active" data-mode="draw" data-popup="pen"><div class="mode-icon"><svg class="svg-24" height="100" preserveaspectratio="xMidYMid meet" viewbox="0 0 100 100" width="100" x="0" xmlns="http://www.w3.org/2000/svg" y="0"><path class="svg-stroke-primary" d="M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="6"></path></svg></div><div class="mode-popup" popup-name="pen"><div class="pen-size group"><label>Size ( px )</label> <input type="number" min="1" max="48" id="size"></div><div class="pen-color group"><label>Color ( current color : <span class="preview-color" id="preview-color"></span> )</label><div class="colors" id="colors"></div></div></div></div></div><div class="helps"></div></div><div class="painter unloaded" id="painter"><div class="painter-mask" id="mask"><canvas id="mp" hidden class="canvas"></canvas><canvas id="select" hidden class="canvas"></canvas><canvas id="canvas" hidden class="canvas"></canvas><canvas id="image" hidden class="canvas"></canvas></div></div></div></div>`);

    app.elements.window.querySelector(".window-frame-application-toolbar-title-icon").src = "data:image/svg+xml,%3Csvg class='svg-24' height='100' stroke='%23eee' preserveAspectRatio='xMidYMid meet' viewBox='0 0 100 100' width='100' x='0' xmlns='http://www.w3.org/2000/svg' y='0'%3E%3Cpath class='svg-stroke-primary' d='M61.5,25.9,74,38.5M66.8,20.6A8.9,8.9,0,0,1,79.3,33.2L30.5,82H18.1V69.3Z' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='6'%3E%3C/path%3E%3C/svg%3E";

    w_app.loadStyles("./system/wos/packages/painter/app.css", "url", () => {
        w_app.hideLoading();
        app.elements.window.querySelector(".window-frame-application-toolbar-title").innerHTML += `<div class="top"><div class="action-bar unloaded" id="actions"><div class="action" data-action="file"><div class="action-title">File</div><div class="action-popup" action-popup="file"><div class="item" disabled="disabled"><div class="command-name">Open ( unfinished )</div><div class="command-key">Ctrl+O</div></div><div class="separation-line"></div><div class="item" disabled="disabled"><div class="command-name">Save ( unfinished )</div><div class="command-key">Ctrl+S</div></div><div class="item popup" id="download"><div class="command-name">Download</div><div class="command-key">Ctrl+Shift+S</div></div></div></div><div class="action" data-action="edit"><div class="action-title">Edit</div><div class="action-popup" action-popup="edit"><div class="item" disabled="disabled" id="undo"><div class="command-name">Undo</div><div class="command-key">Ctrl+Z</div></div><div class="item" disabled="disabled" id="redo"><div class="command-name">Redo</div><div class="command-key">Ctrl+Y</div></div><div class="separation-line"></div><div class="item" disabled="disabled"><div class="command-name">Cut ( unfinished )</div><div class="command-key">Ctrl+X</div></div><div class="item" disabled="disabled"><div class="command-name">Copy ( unfinished )</div><div class="command-key">Ctrl+C</div></div><div class="item" disabled="disabled"><div class="command-name">Paste ( unfinished )</div><div class="command-key">Ctrl+V</div></div></div></div><div class="action" data-action="version"><div class="action-title">Autocorrect</div><div class="action-popup" action-popup="version" data-select-group-parent="algorithm"><div class="item select" data-select-group="algorithm" data-select-value=""><div class="command-name">Close</div></div><div class="item select selected" data-select-group="algorithm" data-select-value="DouglasPeucker"><div class="command-name">Douglas-Peucker algorithm</div></div><div class="item select" data-select-group="algorithm" data-select-value="RamerDouglasPeucker"><div class="command-name">Ramer-Douglas-Peucker algorithm</div></div><div class="item select" data-select-group="algorithm" data-select-value="VisvalingamWhyatt"><div class="command-name">Visvalingam-Whyatt algorithm</div></div></div></div></div>`;

        app.elements.window.classList.add("editor");
        app.elements.window.querySelector(".top").addEventListener("mousedown", (e) => {
            e.stopPropagation();
            e.preventDefault();
        })
        app.elements.window.querySelector(".window-frame-application-toolbar-title-content").remove();

        /**
     * Code by Siyu1017 (c) 2023 - 2024
     * All rights reserved.
     */
       (()=>{"use strict";(()=>{var e=(e,t)=>1==t?document.querySelectorAll(e):document.querySelector(e);const t=(t,a)=>{if(a=a||{},"object"!=typeof e(t)||null===e(t))return console.warn("The parameter target type must be a valid HTMLElement.");if(a&&"[object Object]"!==Object.prototype.toString.call(a))return console.warn("The parameter config type must be Object.");var i=e(t),r={blur:a.blur||window,end:a.end||window,move:a.move||window},n={dragstart:{target:i,event:["mousedown","touchstart"]},dragmove:{target:r.move,event:["mousemove","touchmove"]},dragend:{target:r.end,event:["mouseup","touchend"]},dragout:{target:r.blur,event:["blur"]}},o={dragin:"dragstart",dragover:"dragover",dragout:"dragleave"};return{On:function(e,t){0!=n.hasOwnProperty(e)&&n[e].event.forEach((a=>{n[e].target.addEventListener(a,(e=>t(e)))}))},When:function(e,t,a){0!=o.hasOwnProperty(e)&&null!==t&&t.addEventListener(o[e],(e=>a(e)))},Toggle:function(e){dragging=e?1==e:1!=dragging}}};function a(e,t,a){const i=window.devicePixelRatio||1;return e.width=t*i,e.height=a*i,e.style.width=`${t}px`,e.style.height=`${a}px`,e.getContext("2d").scale(i,i),e}function i(e,t){for(var a,r,n,o,s,l,c,d=0,m=0,u=1;u<e.length-1;u++){var g=(a=e[u],r=e[0],void 0,void 0,void 0,void 0,o=(n=e[e.length-1]).x-r.x,s=n.y-r.y,l=Math.sqrt(o*o+s*s),c=(s*a.x-o*a.y+n.x*r.y-n.y*r.x)/l,Math.abs(c));g>d&&(d=g,m=u)}if(d>t){var v=e.slice(0,m+1),x=e.slice(m),p=i(v,t),y=i(x,t);return p.slice(0,p.length-1).concat(y)}return[e[0],e[e.length-1]]}function r(e,t){var a=i(e,5);t.beginPath(),t.moveTo(a[0].x,a[0].y);for(var r=1;r<a.length-1;r++){var n=(a[r].x+a[r+1].x)/2,o=(a[r].y+a[r+1].y)/2;t.quadraticCurveTo(a[r].x,a[r].y,n,o)}t.lineTo(a[a.length-1].x,a[a.length-1].y),t.stroke()}var n=["rgb(0, 0, 0)","rgb(38, 38, 38)","rgb(89, 89, 89)","rgb(140, 140, 140)","rgb(191, 191, 191)","rgb(217, 217, 217)","rgb(233, 233, 233)","rgb(245, 245, 245)","rgb(250, 250, 250)","rgb(255, 255, 255)","rgb(225, 60, 57)","rgb(231, 95, 51)","rgb(235, 144, 58)","rgb(245, 219, 77)","rgb(114, 192, 64)","rgb(89, 191, 192)","rgb(66, 144, 247)","rgb(54, 88, 226)","rgb(106, 57, 201)","rgb(216, 68, 147)","rgb(251, 233, 230)","rgb(252, 237, 225)","rgb(252, 239, 212)","rgb(252, 251, 207)","rgb(231, 246, 213)","rgb(218, 244, 240)","rgb(217, 237, 250)","rgb(224, 232, 250)","rgb(237, 225, 248)","rgb(246, 226, 234)","rgb(255, 163, 158)","rgb(255, 187, 150)","rgb(255, 213, 145)","rgb(255, 251, 143)","rgb(183, 235, 143)","rgb(135, 232, 222)","rgb(145, 213, 255)","rgb(173, 198, 255)","rgb(211, 173, 247)","rgb(255, 173, 210)","rgb(255, 77, 79)","rgb(255, 122, 69)","rgb(255, 169, 64)","rgb(255, 236, 61)","rgb(115, 209, 61)","rgb(54, 207, 201)","rgb(64, 169, 255)","rgb(89, 126, 247)","rgb(146, 84, 222)","rgb(247, 89, 171)","rgb(207, 19, 34)","rgb(212, 56, 13)","rgb(212, 107, 8)","rgb(212, 177, 6)","rgb(56, 158, 13)","rgb(8, 151, 156)","rgb(9, 109, 217)","rgb(29, 57, 196)","rgb(83, 29, 171)","rgb(196, 29, 127)","rgb(130, 0, 20)","rgb(135, 20, 0)","rgb(135, 56, 0)","rgb(97, 71, 0)","rgb(19, 82, 0)","rgb(0, 71, 79)","rgb(0, 58, 140)","rgb(6, 17, 120)","rgb(34, 7, 94)","rgb(120, 6, 80)"],o={CanvasSize:{width:640,height:360},Objects:[],Status:{drawing:!1,mode:"draw",selected:!1,dragging:!1},Style:{Stroke:{Color:n[36],Size:8},Fill:{Color:"#000"}},Temp:{Mouse:{x:0,y:0},Points:[],Objects:[],ExtremeValue:{x:[0,0],y:[0,0]},DIndex:0,History:[]},Limit:{max:48,min:1},Algorithm:"DouglasPeucker"};window.Datas=o;var s=(e,t)=>1==t?document.querySelectorAll(e):document.querySelector(e),l=!1,c=null;s('[data-mode="select"]').addEventListener("click",(()=>{o.Status.mode="select"})),s('[data-mode="draw"]').addEventListener("click",(()=>{o.Status.mode="draw",c=null,a(mp,o.CanvasSize.width,o.CanvasSize.height),a(select,o.CanvasSize.width,o.CanvasSize.height)})),document.addEventListener("contextmenu",(e=>{e.preventDefault()}));var d=!1,m=null,u=0;function g(e,t,i,n){1!=i&&a(e,o.CanvasSize.width,o.CanvasSize.height);const s=e.getContext("2d");var l={lineWidth:o.Style.Stroke.Size,strokeStyle:o.Style.Stroke.Color,fillStyle:o.Style.Stroke.Color};if(1==n){var c=t;(t={}).points=c,t.algorithm=o.Algorithm}else l.lineWidth=t.style.strokeWidth,l.strokeStyle=t.style.strokeColor,l.fillStyle=t.style.strokeColor;if(s.lineWidth=l.lineWidth,s.strokeStyle=l.strokeStyle,s.fillStyle=l.fillStyle,s.imageSmoothingEnabled=!0,s.lineJoin="round",s.lineCap="round",0!=t.points.length){if(1==t.points.length)return s.beginPath(),s.arc(t.points[0].x,t.points[0].y,l.lineWidth/2,0,2*Math.PI,!0),void s.fill();if(2==t.points.length)return s.beginPath(),s.moveTo(t.points[0].x,t.points[0].y),s.lineTo(t.points[1].x,t.points[1].y),void s.stroke();if(1==i){if("RamerDouglasPeucker"==t.algorithm)return r(t.points,s);if("DouglasPeucker"==t.algorithm)return function(e,t){var a=function(e,t){const a=e[0],i=e[e.length-1],r=[a];for(let t=1;t<e.length-1;t++){const u=e[t];n=u,o=a,l=void 0,c=void 0,d=void 0,m=void 0,l=(s=i).x-o.x,c=s.y-o.y,d=Math.sqrt(l*l+c*c),m=(c*n.x-l*n.y+s.x*o.y-s.y*o.x)/d,Math.abs(m)>5&&r.push(u)}var n,o,s,l,c,d,m;return r.push(i),r}(e);t.beginPath(),t.moveTo(a[0].x,a[0].y);for(var i=1;i<a.length-1;i++){var r=(a[i].x+a[i+1].x)/2,n=(a[i].y+a[i+1].y)/2;t.quadraticCurveTo(a[i].x,a[i].y,r,n)}t.lineTo(a[a.length-1].x,a[a.length-1].y),t.stroke()}(t.points,s);if("VisvalingamWhyatt"==t.algorithm)return function(e,t){var a=function(e,t){for(var a,i,r,n=[],o=1;o<e.length-1;o++){var s=(a=e[o-1],i=e[o],r=e[o+1],Math.abs((a.x*(i.y-r.y)+i.x*(r.y-a.y)+r.x*(a.y-i.y))/2));n.push(s)}for(;n.length>0&&Math.min(...n)<1;){var l=n.indexOf(Math.min(...n));e.splice(l+1,1),n.splice(l,1)}return e}(e);t.beginPath(),t.moveTo(a[0].x,a[0].y);for(var i=1;i<a.length-1;i++){var r=(a[i].x+a[i+1].x)/2,n=(a[i].y+a[i+1].y)/2;t.quadraticCurveTo(a[i].x,a[i].y,r,n)}t.lineTo(a[a.length-1].x,a[a.length-1].y),t.stroke()}(t.points,s)}try{for(let e=0;e<t.points.length-1;e++)s.beginPath(),0==e?(s.moveTo(t.points[e].x,t.points[e].y),s.quadraticCurveTo(t.points[e+1].x,t.points[e+1].y,t.points[e+1].x+(t.points[e+2].x-t.points[e+1].x)/2,t.points[e+1].y+(t.points[e+2].y-t.points[e+1].y)/2)):e==t.points.length-2?(s.moveTo(t.points[e].x+(t.points[e+1].x-t.points[e].x)/2,t.points[e].y+(t.points[e+1].y-t.points[e].y)/2),s.quadraticCurveTo(t.points[e+1].x,t.points[e+1].y,t.points[e].x+.75*(t.points[e+1].x-t.points[e].x),t.points[e].y+.75*(t.points[e+1].y-t.points[e].y))):(s.moveTo(t.points[e].x+(t.points[e+1].x-t.points[e].x)/2,t.points[e].y+(t.points[e+1].y-t.points[e].y)/2),s.quadraticCurveTo(t.points[e+1].x,t.points[e+1].y,t.points[e+1].x+(t.points[e+2].x-t.points[e+1].x)/2,t.points[e+1].y+(t.points[e+2].y-t.points[e+1].y)/2)),s.stroke()}catch(e){console.log("Error :",e)}}}function v(e){function t(e){var t=e.getBoundingClientRect(),a=window.pageXOffset||document.documentElement.scrollLeft,i=window.pageYOffset||document.documentElement.scrollTop;return{top:t.top+i,left:t.left+a}}return{x:t(e).left,y:t(e).top}}function x(){var e=o.Objects;if(e.length<1)return{sx:0,sy:0,ex:0,ey:0};var t={minX:e[0].ExtremeValue.x[0],minY:e[0].ExtremeValue.y[0],maxX:e[0].ExtremeValue.x[1],maxY:e[0].ExtremeValue.y[1]};return e.forEach((e=>{e.ExtremeValue.x[0]<=t.minX&&(t.minX=e.ExtremeValue.x[0]),e.ExtremeValue.x[1]>=t.maxX&&(t.maxX=e.ExtremeValue.x[1]),e.ExtremeValue.y[0]<=t.minY&&(t.minY=e.ExtremeValue.y[0]),e.ExtremeValue.y[1]>=t.maxY&&(t.maxY=e.ExtremeValue.y[1])})),{sx:t.minX,ex:t.maxX,sy:t.minY,ey:t.maxY}}function p(e,t,i=!1,r=!0){1==r&&a(e,o.CanvasSize.width,o.CanvasSize.height);var n=e.getContext("2d");n.beginPath(),n.fillStyle="rgb(178,204,255)",n.lineWidth=1==i?1:1.5,n.strokeStyle="rgb(178,204,255)",n.moveTo(t.x[0],t.y[0]),n.lineTo(t.x[1],t.y[0]),n.lineTo(t.x[1],t.y[1]),n.lineTo(t.x[0],t.y[1]),n.lineTo(t.x[0],t.y[0]),n.stroke(),n.closePath()}window.addEventListener("keydown",(e=>{if(e.ctrlKey){if(e.preventDefault(),1==d)return;if("z"==e.key)return y.undo();if("y"==e.key)return y.redo();if(e.shiftKey&&"S"==e.key)return h()}})),s(".action",!0).forEach((e=>{e.addEventListener("click",(()=>{l=!0,s(".action-popup.active",!0).forEach((e=>{e.classList.remove("active")})),s(`[action-popup="${e.getAttribute("data-action")}"]`).classList.add("active")})),e.addEventListener("mousemove",(()=>{1==l&&(s(".action-popup.active",!0).forEach((e=>{e.classList.remove("active")})),s(".action.active",!0).forEach((e=>{e.classList.remove("active")})),e.classList.add("active"),s(`[action-popup="${e.getAttribute("data-action")}"]`).classList.add("active"))}))})),document.addEventListener("mousedown",(e=>{var t=!1;if(s(".action",!0).forEach((a=>{a.contains(e.target)&&(t=!0)})),1!=t){var a=!1;s(".action.popup",!0).forEach((t=>{t.contains(e.target)&&(a=!0)})),0==a&&1==l&&(l=!1,s(".action.active",!0).forEach((e=>{e.classList.remove("active")})),s(".action-popup.active",!0).forEach((e=>{e.classList.remove("active")})))}})),s(".mode",!0).forEach((e=>{e.addEventListener("click",(()=>{s(".mode.active",!0).forEach((e=>{e.classList.remove("active")})),s(".mode-popup.active",!0).forEach((e=>{e.classList.remove("active")})),e.classList.add("active"),e.querySelector(".mode-popup")&&e.querySelector(".mode-popup").classList.add("active")}))})),document.addEventListener("mousedown",(e=>{var t=!1,a=!1;if(s("[popup-name]",!0).forEach((a=>{a.contains(e.target)&&(t=!0)})),s(".mode",!0).forEach((t=>{t.contains(e.target)&&(a=!0)})),0==t){if(1==a)return;s(".mode-popup.active",!0).forEach((e=>{e.classList.remove("active")}))}})),s("#size").value=o.Style.Stroke.Size,s("#size").addEventListener("change",(()=>{s("#size").value<o.Limit.min&&(s("#size").value=o.Limit.min),s("#size").value>o.Limit.max&&(s("#size").value=o.Limit.max),o.Style.Stroke.Size=s("#size").value})),s("#preview-color").style.background=o.Style.Stroke.Color,s("[data-select-group-parent]",!0).forEach((e=>{s(`[data-select-group="${e.getAttribute("data-select-group-parent")}"]`,!0).forEach((e=>{e.addEventListener("click",(()=>{s(`[data-select-group="${e.getAttribute("data-select-group")}"].selected`,!0).forEach((e=>{e.classList.remove("selected")})),e.classList.add("selected"),o.Algorithm=e.getAttribute("data-select-value")}))}))})),n.forEach(((e,t)=>{var a=document.createElement("li");a.setAttribute("data-value",e),a.className="color-block",a.innerHTML=`<div class="color-block-inner" style="background-color: ${e}"></div>`,a.addEventListener("click",(()=>{s("#preview-color").style.background=e,o.Style.Stroke.Color=e})),s("#colors").appendChild(a)}));var y={currentIndex:-1,canvas:s("#canvas"),image:s("#image"),select:s("#select"),mp:s("#mp"),mask:s("#mask"),init:async()=>{s("#painter").classList.remove("unloaded"),mask.style=`width: ${o.CanvasSize.width}px; min-width: calc(4rem + ${o.CanvasSize.width}px); min-height: calc(4rem + ${o.CanvasSize.height}px)`,canvas.hidden=!1,image.hidden=!1,mp.hidden=!1,select.hidden=!1,a(canvas,o.CanvasSize.width,o.CanvasSize.height),a(image,o.CanvasSize.width,o.CanvasSize.height);var e=t("#canvas"),i={x:0,y:0};function r(e){1==d&&(o.Objects[u]=m,a(mp,o.CanvasSize.width,o.CanvasSize.height),a(image,o.CanvasSize.width,o.CanvasSize.height),o.Objects.forEach(((e,t)=>{t>y.currentIndex||g(image,e,!0)})),o.Status.drawing=!1),m=null,d=!1}function n(e){e.type,1==o.Status.drawing&&"draw"==o.Status.mode&&(a(canvas,o.CanvasSize.width,o.CanvasSize.height),0!=o.Temp.DIndex&&(o.Objects=o.Temp.History,a(image,o.CanvasSize.width,o.CanvasSize.height),o.Objects.forEach((e=>{g(image,e,!0)})),o.Temp.DIndex=0,o.Temp.History=[]),y.currentIndex++,o.Temp.ExtremeValue.x[0]-=o.Style.Stroke.Size/2+4,o.Temp.ExtremeValue.x[1]+=o.Style.Stroke.Size/2+4,o.Temp.ExtremeValue.y[0]-=o.Style.Stroke.Size/2+4,o.Temp.ExtremeValue.y[1]+=o.Style.Stroke.Size/2+4,o.Status.drawing=!1,o.Objects.push({position:{x:o.Temp.ExtremeValue.x[0],y:o.Temp.ExtremeValue.y[0]},size:{width:o.Temp.ExtremeValue.x[1]-o.Temp.ExtremeValue.x[0],height:o.Temp.ExtremeValue.y[1]-o.Temp.ExtremeValue.y[0]},style:{strokeColor:o.Style.Stroke.Color,strokeWidth:o.Style.Stroke.Size},algorithm:o.Algorithm,points:o.Temp.Points,image:"image url",rotate:0,scale:1,ExtremeValue:o.Temp.ExtremeValue}),g(image,o.Temp.Points,!0,!0),s("#redo").setAttribute("disabled",""))}e.On("dragstart",(e=>{if("select"==o.Status.mode){var t=o.Objects;if(t.length<1)return;a(mp,o.CanvasSize.width,o.CanvasSize.height);var r={x:e.clientX-v(select).x,y:e.clientY-v(select).y};i={x:e.clientX,y:e.clientY};var n=!1,s=x();if(m=t[0],u=0,t.forEach(((e,t)=>{t>y.currentIndex||e.ExtremeValue.x[0]<r.x&&r.x<e.ExtremeValue.x[1]&&e.ExtremeValue.y[0]<r.y&&r.y<e.ExtremeValue.y[1]&&(n=!0,(s.ex-s.sx)*(s.ey-s.sy)>=(e.ExtremeValue.x[1]-e.ExtremeValue.x[0])*(e.ExtremeValue.y[1]-e.ExtremeValue.y[0])&&(m=e,u=t,s={sx:e.ExtremeValue.x[0],sy:e.ExtremeValue.y[0],ex:e.ExtremeValue.x[1],ey:e.ExtremeValue.y[1]}))})),0==n)return c=null,void a(select,o.CanvasSize.width,o.CanvasSize.height);c=m,d=!0;var l=[...o.Objects];a(mp,o.CanvasSize.width,o.CanvasSize.height),a(image,o.CanvasSize.width,o.CanvasSize.height),l.splice(u,1),l.forEach(((e,t)=>{t>y.currentIndex-1||g(image,e,!0)})),g(mp,o.Objects[u],!0),p(select,o.Objects[u].ExtremeValue,!0)}})),e.On("dragmove",(e=>{!function(e){1==d&&(a(mp,o.CanvasSize.width,o.CanvasSize.height),m.points.forEach(((t,a)=>{m.points[a]={x:t.x+e.clientX-i.x,y:t.y+e.clientY-i.y}})),m.ExtremeValue.x[0]+=e.clientX-i.x,m.ExtremeValue.x[1]+=e.clientX-i.x,m.ExtremeValue.y[0]+=e.clientY-i.y,m.ExtremeValue.y[1]+=e.clientY-i.y,g(mp,m,!0),p(select,m.ExtremeValue,!0),i={x:e.clientX,y:e.clientY})}(e)})),e.On("dragend",(e=>{r()})),e.On("dragout",(e=>{r()})),canvas.addEventListener("mousemove",(e=>{if("select"==o.Status.mode&&0==d){var t=[...o.Objects];if(!(t.length<1)){a(select,o.CanvasSize.width,o.CanvasSize.height);var i={x:e.clientX-v(select).x,y:e.clientY-v(select).y},r=!1,n=x(),s=t[0];if(t.forEach(((e,t)=>{t>y.currentIndex||e.ExtremeValue.x[0]<i.x&&i.x<e.ExtremeValue.x[1]&&e.ExtremeValue.y[0]<i.y&&i.y<e.ExtremeValue.y[1]&&(r=!0,(n.ex-n.sx)*(n.ey-n.sy)>(e.ExtremeValue.x[1]-e.ExtremeValue.x[0])*(e.ExtremeValue.y[1]-e.ExtremeValue.y[0])&&(s=e,n={sx:e.ExtremeValue.x[0],sy:e.ExtremeValue.y[0],ex:e.ExtremeValue.x[1],ey:e.ExtremeValue.y[1]}))})),null!=c&&p(select,c.ExtremeValue,!0),0!=r){var l={x:[n.sx,n.ex],y:[n.sy,n.ey]};c!=s&&p(select,l,!1,!1)}}}}));var l=t("#canvas");l.On("dragstart",(e=>{"touchstart"==e.type&&e.preventDefault(),"draw"==o.Status.mode&&(o.Status.drawing=!0,o.Temp.Points=[{x:e.clientX-v(canvas).x,y:e.clientY-v(canvas).y}],o.Temp.Mouse={x:[e.clientX-v(canvas).x],y:[e.clientY-v(canvas).y]},o.Temp.ExtremeValue={x:[e.clientX-v(canvas).x,e.clientX-v(canvas).x],y:[e.clientY-v(canvas).y,e.clientY-v(canvas).y]},g(canvas,o.Temp.Points,!1,!0))})),l.On("dragmove",(e=>{!function(e){"touchmove"==e.type&&e.preventDefault(),1==o.Status.drawing&&"draw"==o.Status.mode&&(e.clientX-v(canvas).x<o.Temp.ExtremeValue.x[0]&&(o.Temp.ExtremeValue.x[0]=e.clientX-v(canvas).x),e.clientX-v(canvas).x>o.Temp.ExtremeValue.x[1]&&(o.Temp.ExtremeValue.x[1]=e.clientX-v(canvas).x),e.clientY-v(canvas).y<o.Temp.ExtremeValue.y[0]&&(o.Temp.ExtremeValue.y[0]=e.clientY-v(canvas).y),e.clientY-v(canvas).y>o.Temp.ExtremeValue.y[1]&&(o.Temp.ExtremeValue.y[1]=e.clientY-v(canvas).y),o.Temp.Points.push({x:e.clientX-v(canvas).x,y:e.clientY-v(canvas).y}),o.Temp.Mouse={x:[e.clientX-v(canvas).x],y:[e.clientY-v(canvas).y]},s("#undo").removeAttribute("disabled"),g(canvas,o.Temp.Points,!1,!0))}(e)})),l.On("dragend",(e=>{n(e)})),l.On("dragout",(e=>{n(e)}))},undo:()=>{if(-1==y.currentIndex)return s("#undo").setAttribute("disabled","");y.currentIndex--,o.Temp.DIndex--,a(image,o.CanvasSize.width,o.CanvasSize.height),o.Temp.History=[],o.Objects.forEach(((e,t)=>{t>y.currentIndex||(g(image,e,!0),o.Temp.History.push(e))})),-1==y.currentIndex?s("#undo").setAttribute("disabled",""):s("#undo").removeAttribute("disabled"),s("#redo").removeAttribute("disabled")},redo:()=>{if(y.currentIndex==o.Objects.length-1)return s("#redo").setAttribute("disabled","");y.currentIndex++,o.Temp.DIndex++,a(image,o.CanvasSize.width,o.CanvasSize.height),o.Temp.History=[],o.Objects.forEach(((e,t)=>{t>y.currentIndex||(g(image,e,!0),o.Temp.History.push(e))})),s("#undo").removeAttribute("disabled"),y.currentIndex==o.Objects.length-1?s("#redo").setAttribute("disabled",""):s("#redo").removeAttribute("disabled")}};function h(e){var t=y.image.toDataURL("image/jpeg"),a=document.createElement("a");a.download=e?e+".jpg":"Untitled.jpg",a.href=t,a.click()}s("#download").addEventListener("click",(()=>{h()})),window.mobileAndTabletCheck=function(){let e=!1;var t;return t=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0),e},(async()=>{var e;await(e=500*Math.random(),new Promise((t=>setTimeout(t,e)))),y.init(),s("#undo").onclick=y.undo,s("#redo").onclick=y.redo,setTimeout((()=>s(".unloaded",!0).forEach((e=>{e.classList.remove("unloaded")}))),300)})()})()})();
//# sourceMappingURL=index.734aa0.js.map
    });
})();
