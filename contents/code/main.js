var panelIds
var panelHeights
var panelLocations
var panelScreens
var areas = []
var timer = new QTimer()
manageTimer()

function DBusCalls() {
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.id])); print(result)", function(returnValue) {panelIds = returnValue})
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.height])); print(result)", function(returnValue) {panelHeights = returnValue})
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.location])); print(result)", function(returnValue) {panelLocations = returnValue})
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.screen])); print(result)", function(returnValue) {panelScreens = returnValue})
    timer.start()
}

function manageTimer() {
    timer.interval = 5000
    timer.singleShot = true;
    timer.timeout.connect(function() {if (panelIds != null && panelHeights != null && panelLocations != null && panelScreens != null) {
    setVisible()} else {
        DBusCalls()
    }})
timer.start()
}

function setVisible() {
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'alwaysvisible')")
    timer.timeout.connect(getArea())
    timer.start()
}

function getArea() {
    panelIds = panelIds.split(",")
    panelHeights = panelHeights.split(",")
    panelLocations = panelLocations.split(",")
    panelScreens = panelScreens.split(",")
    workspace.screens.forEach(screen => areas.push(workspace.clientArea(KWin.FullScreenArea, screen, workspace.currentDesktop)))
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'windowsgobelow')")
    workspace.windowActivated.connect(disconnectWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
    workspace.activeWindow.maximizedChanged.connect(checkWindow)
}

function checkWindow() {
    if (areas == null) {
        return
    }
    window = workspace.activeWindow
    panelIds.forEach((panel, index) => {
        topDiff = -(areas[0].y - areas[panelScreens[index]].y)
        if (panelLocations[index] == "top") {
            if (window.frameGeometry.y < parseInt(panelHeights[index]) + 8 + topDiff && workspace.screens.indexOf(workspace.activeScreen) == panelScreens[index] && !window.desktopWindow) {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
            }
            else {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'windowsgobelow'")
            }
        }
        else {
            bottomDiff = areas[0].height - areas[panelScreens[index]].height - topDiff
            if (window.frameGeometry.y + window.frameGeometry.height > areas[panelScreens[index]].height + parseInt(panelHeights[index]) - 108 + topDiff - bottomDiff && workspace.screens.indexOf(workspace.activeScreen) == panelScreens[index] && !window.desktopWindow) {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
            }
            else {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'windowsgobelow'")
            }
        }
    })
}

function disconnectWindow() {
    workspace.activeWindow.moveResizedChanged.disconnect(checkWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
    workspace.activeWindow.maximizedChanged.disconnect(checkWindow)
    workspace.activeWindow.maximizedChanged.connect(checkWindow)
    checkWindow()
}
