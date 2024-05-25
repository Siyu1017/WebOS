(() => {
    var app = new App("taskmgr", "", {
        width: 420,
        height: 300,
        y: 48,
        x: 124,
        title: "Task Manager",
        icon: "./system/wos/packages/taskmgr/app.png"
    });

    app.loadStyles("./system/wos/packages/taskmgr/app.css", "url")

    var browseWindow = app.execute(`
    <div class="taskmgr wui-system">
        <div class="tasks">
            <div class="tasks-header">
                <div class="task-name">Name</div>
                <div class="task-status">Status</div>
            </div>
            <div class="tasks-list" data-element="tasks">
                <!--div class="task">
                    <div class="task-name">
                        <img class="task-icon" src="./system/wos/packages/taskmgr/app.png">
                        <div class="task-title">Task Manager</div>
                    </div>
                    <div class="task-status">Active</div>
                </div>
                <div class="task">
                    <div class="task-name">
                        <img class="task-icon" src="./application.png">
                        <div class="task-title">Explorer</div>
                    </div>
                    <div class="task-status">Background</div>
                </div-->
            </div>
        </div>
    </div>
    `);

    browseWindow.elements.window.classList.add('taskmgr-window');

    var tasks = {};

    running_apps_observers.push(() => {
        Object.keys(tasks).forEach(task => {
            if (!running_apps[task]) {
                tasks[task].remove();
                delete tasks[task];
            }
        })

        Object.values(running_apps).forEach((app, i) => {
            createTaskElement(app, i);
        })
    })

    Object.values(running_apps).forEach((app, i) => {
        createTaskElement(app, i);
    })

    function createTaskElement(app, index) {
        if (!_.isElement(tasks[Object.keys(running_apps)[index]])) {
            var taskElement = document.createElement("div");
            taskElement.className = "task";
            browseWindow.elements.window.querySelector('[data-element="tasks"]').appendChild(taskElement);
            tasks[Object.keys(running_apps)[index]] = taskElement;
        }

        tasks[Object.keys(running_apps)[index]].innerHTML = `
        <div class="task-name">
            <img class="task-icon" src="${app.settings.icon || "./application.png"}">
            <div class="task-title">${formatString(app.settings.title)}</div>
        </div>
        <div class="task-status">Active</div>
        `;

        tasks[Object.keys(running_apps)[index]].addEventListener("contextmenu", (e) => {
            handleContextMenuEvent(e, tasks[Object.keys(running_apps)[index]], Object.values(running_apps)[index]);
        })
    }

    function stopTask(taskElement, app) {
        taskElement.remove();
        delete taskElement;
        app.close();
        delete app;
    }

    function handleContextMenuEvent(e, taskElement, app) {
        if (e.cancelable) {
            e.preventDefault();
        }
        try {
            System.showContextMenu([{
                type: 'label',
                header: app.settings.title
            }, {
                type: 'separation'
            }, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
                header: 'Refresh Tasks',
                action: () => {
                    Object.keys(tasks).forEach(task => {
                        if (!running_apps[task]) {
                            tasks[task].remove();
                            delete tasks[task];
                        }
                    })

                    Object.values(running_apps).forEach((app, i) => {
                        createTaskElement(app, i);
                    })
                }
            }, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
                header: 'View Details',
                action: () => {
                    var task = new App(null, null, {
                        title: `Task Details - ${app.settings.title}`,
                        icon: "./system/wos/packages/taskmgr/app.png",
                        width: 280,
                        height: 360,
                        fullscreenable: false,
                        minimizable: false,
                        y: (window.innerHeight - 45) / 2 - 180,
                        x: window.innerWidth / 2 - 140,
                    });
                    var browserWindow = task.execute(`
                    <div class="task-details-container">
                        <div class="task-details-header">${formatString(app.settings.title)}</div>
                        <div class="task-details">
                            <div class="task-detail-labels">
                                <span class="task-detail-label">Title : </span>
                                <span class="task-detail-label">Icon : </span>
                                <span class="task-detail-label">X : </span>
                                <span class="task-detail-label">Y : </span>
                                <span class="task-detail-label">Width : </span>
                                <span class="task-detail-label">Height : </span>
                                <span class="task-detail-label">Resizable : </span>
                                <span class="task-detail-label">Movable : </span>
                                <span class="task-detail-label">Minimizable : </span>
                                <span class="task-detail-label">Fullscreenable : </span>
                                <span class="task-detail-label">Closable : </span>
                                <span class="task-detail-label">Stack Trace : </span>
                            </div>
                            <div class="task-detail-values">
                                <span class="task-detail-value">${formatString(app.settings.title)}</span>
                                <span class="task-detail-value">${formatString(app.settings.icon)}</span>
                                <span class="task-detail-value">${formatString(app.settings.x)}</span>
                                <span class="task-detail-value">${formatString(app.settings.y)}</span>
                                <span class="task-detail-value">${formatString(app.settings.width)}</span>
                                <span class="task-detail-value">${formatString(app.settings.height)}</span>
                                <span class="task-detail-value">${formatString(app.settings.resizable)}</span>
                                <span class="task-detail-value">${formatString(app.settings.movable)}</span>
                                <span class="task-detail-value">${formatString(app.settings.minimizable)}</span>
                                <span class="task-detail-value">${formatString(app.settings.fullscreenable)}</span>
                                <span class="task-detail-value">${formatString(app.settings.closable)}</span>
                                <span class="task-detail-value">${formatString(app.stackTrace)}</span>
                            </div>
                        </div>
                    </div>
                    `);

                    browserWindow.elements.window.classList.add("wui-system-light")
                    browserWindow.elements.toolbar.querySelector('.window-frame-application-toolbar-title').style.maxWidth = 'calc(100% - 60px)';
                }
            }, {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',
                header: 'Stop Task',
                action: () => {
                    stopTask(taskElement, app)
                    /*tasks[Object.keys(running_apps)[i]].remove();
                    delete tasks[Object.keys(running_apps)[i]];*/
                },
                class: 'error',
            }], e);
        } catch (e) { };
    }

    app.hideLoading();
})();