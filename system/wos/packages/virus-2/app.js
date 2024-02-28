setInterval(()=>{
    new App("ERROR" + Date.now(),null,{
        x: window.innerWidth * Math.random(),
        y: window.innerHeight * Math.random(),
        width: 240,
        height: 120,
        minimizable: false,
        fullscreenable: false,
        title: "Error",
        icon: "./error.png"
    }).execute('<div style="height: calc(100% - 36px);width: calc(100% - 24px);display: flex;justify-content: center;align-items: center;padding: 18px 12px;user-select: none;-webkit-user-drag: none;"><img src="./error.png" style="width: 36px;height: 36px;margin-right: 6px;-webkit-user-drag: none;"><span style="overflow: hidden;max-height: 4rem;-webkit-line-clamp: 2;display: -webkit-box;-webkit-box-orient: vertical;text-overflow: ellipsis;white-space: normal;word-wrap: break-word;">You have been haked.</span></div>');
}, 100)
