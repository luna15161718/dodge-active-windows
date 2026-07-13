callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'alwaysvisible'")
var timer = new QTimer()
timer.interval = 1000
timer.singleShot = true;
timer.timeout.connect(function() {var area = workspace.clientArea(KWin.MaximizeArea, workspace.activeScreen, workspace.currentDesktop); callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'windowsgobelow'")})
timer.start()

function checkWindow() {
    var window = workspace.activeWindow
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

workspace.activeWindow.moveResizedChanged.connect(checkWindow)