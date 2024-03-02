(() => {
    System.showStartLoading();

    document.querySelector(".window-frame").innerHTML = "";

    setTimeout(() => {
        location.reload();
    }, 3000)
})();