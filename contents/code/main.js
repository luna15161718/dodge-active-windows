callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'alwaysvisible')")
var panelIds
var panelHeights
var panelLocations
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.id])); print(result)", function(returnValue) {panelIds = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.height])); print(result)", function(returnValue) {panelHeights = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.location])); print(result)", function(returnValue) {panelLocations = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.offset])); print(result)", function(returnValue) {panelOffsets = returnValue})

var timer = new QTimer()
var area
timer.interval = 500
timer.singleShot = true;
timer.timeout.connect(function() {getArea()})
timer.start()

function getArea() {
    panelIds = panelIds.split(",")
    //print(panelIds)
    panelHeights = panelHeights.split(",")
    //print(panelHeights)
    panelLocations = panelLocations.split(",")
    //print(panelLocations)
    //print(panelOffsets)
    //print(workspace.clientArea(KWin.FullScreenArea, workspace.activeScreen, workspace.currentDesktop))
    //print(workspace.clientArea(KWin.MaximizeArea, workspace.activeScreen, workspace.currentDesktop))
    workspace.windowList().forEach(window => {
        if (window.resourceClass == "plasmashell" && window.specialWindow) {
            print(window.frameGeometry)
        }
    })
    print(workspace.screens[0].geometry)
    area = workspace.clientArea(KWin.FullScreenArea, workspace.activeScreen, workspace.currentDesktop)
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'windowsgobelow'")
    //print(area)
    //print(workspace.activeWindow)
    workspace.windowActivated.connect(disconnectWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
}

function checkWindow() {
    if (area == null) {
        return
    }
    window = workspace.activeWindow
    //print(area.y)
    //print(window.frameGeometry.y)
    //print(panelById(panels[3]))
    //callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "print(panelById(" + panelIds[3] + ").height)", function(returnValue) {print(returnValue)})
    //panelIds.forEach((panel => print(panelById(panel).y)))
    //print(window.frameGeometry.y < area.y)
    //panelIds.forEach((panel => {if(window.frameGeometry.y < panel.y) {
        //print(panel)
    //}}))
    panelIds.forEach((panel, index) => {
        if (panelLocations[index] == "top") {
            print(window.frameGeometry.y)
            print(parseInt(panelHeights[index]) + 8)
            if (window.frameGeometry.y < parseInt(panelHeights[index]) + 8) {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
            }
            else {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'windowsgobelow'")
            }
        }
        else {
            print(window.frameGeometry.y + window.frameGeometry.height)
            print(area.height + parseInt(panelHeights[index]) - 108)
            if (window.frameGeometry.y + window.frameGeometry.height > area.height + parseInt(panelHeights[index]) - 108) {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
            }
            else {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'windowsgobelow'")
            }
        }
    })
    //if (window.frameGeometry.y < area.y) {
        //callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'autohide'")
    //}
    //else {
        //callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels()[3].hiding = 'windowsgobelow'")
    //}
}

function disconnectWindow() {
    workspace.activeWindow.moveResizedChanged.disconnect(checkWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
    checkWindow()
}
