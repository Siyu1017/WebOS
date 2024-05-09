var range = {
    x: [-5, 10],
    y: [-5, 10],
    rotate: 5
}

document.documentElement.style.transition = 'all .1s ease-in-out';
// document.body.style.background = "#000";
document.documentElement.style.background = "#000";

setInterval(() => {
    document.documentElement.style.transform = `translate3d(${range.x[0] + Math.random() * range.x[1]}px, ${range.y[0] + Math.random() * range.y[1]}px, 0px) rotate(${Math.random() * range.rotate / 2 * (Math.random() > 0.5 ? 1 : -1)}deg)`
}, 100)