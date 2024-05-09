var gravity = 1;

class physicsOperator {
    constructor(obj, speed = 0, angle = 90) {
        var parent = document.createElement("div");
        var cloneNode = obj.cloneNode(true);
        parent.appendChild(obj.cloneNode(true));
        this.obj = parent;
        this.angle = angle;
        this.speed = speed;
        this.x = getPosition(cloneNode).x;
        this.y = getPosition(cloneNode).y;
        this.obj.style.left = this.x + 'px';
        this.obj.style.top = this.y + 'px';
        // this.vx = Math.cos(this.angle) * this.speed;
        this.vy = this.speed;// Math.sin(this.angle) * this.speed;
    }
    update() {
        this.obj.style.position = "fixed !important";
        if (getPosition(this.obj).y + this.obj.offsetHeight >= window.innerHeight) {
            this.y = window.innerHeight - this.obj.offsetHeight;
            this.vy = 0;
        } else {
            this.vy += gravity;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.obj.style.left = this.x + 'px';
        this.obj.style.top = this.y + 'px';
    }
}

var f = new physicsOperator($0, 0.1);

function af() {
    f.update();
    requestAnimationFrame(af);
}
requestAnimationFrame(af);