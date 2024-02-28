var arr = ['blur(1px)', 'brightness(0.5)', 'contrast(0.5)', 'drop-shadow(2px 4px 6px black)', 'grayscale(1)', 'hue-rotate(45deg)', 'invert(1)', 'opacity(0.5)', 'saturate(0.5)', 'sepia(1)'];
var last = 0;

function random() {
    var num = Math.floor(Math.random() * arr.length);
    /*if (num == last) {
        random();
    }
    last = num;*/
    return num;
}

setInterval(()=>{
    document.documentElement.style.filter = arr[random()];
}, 1000);
