(() => {
    var style = document.createElement('style');
    style.innerHTML = `body * {
        background: #000 !important;
        color: #000 !important;
        border: none !important;
        backdrop-filter: none !important;
        transition: none !important;
        cursor: wait !important;
    }`;
    document.head.appendChild(style);

    var time = 0;

    function changeStyle() {
        $(".window-background").style.display = $(".window-background").style.display == "block" ? "none" : "block";
        $(".window-frame").style.display = $(".window-frame").style.display == "block" ? "none" : "block";
        time ++;
        if (time < 50) {
            setTimeout(changeStyle, Math.random() * 300 + 100);
        } else {
            System.exit(0);
        }        
    }

    document.documentElement.style.cursor = "wait";

    changeStyle()
})();