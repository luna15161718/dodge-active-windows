callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'alwaysvisible'")
var timer = new QTimer()
var area
timer.interval = 1000
timer.singleShot = true;
timer.timeout.connect(function() {getArea()})
timer.start()

function getArea() {
    area = workspace.clientArea(KWin.MaximizeArea, workspace.activeScreen, workspace.currentDesktop)
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'windowsgobelow'")
    print(area)
    print(workspace.activeWindow)
    workspace.windowActivated.connect(disconnectWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
}

function checkWindow() {
    if (area == null) {
        return
    }
    window = workspace.activeWindow
    print(area.y)
    print(window.frameGeometry.y)
    print(window.frameGeometry.y < area.y)
    if (window.frameGeometry.y < area.y) {
        callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'autohide'")
    }
    else {
        callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'windowsgobelow'")
    }
}

function disconnectWindow() {
    workspace.activeWindow.moveResizedChanged.disconnect(checkWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
    checkWindow()
}
