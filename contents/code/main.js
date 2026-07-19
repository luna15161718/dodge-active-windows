callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'alwaysvisible')")
//workspace.screens.forEach(screen => print(screen))
var panelIds
var panelHeights
var panelLocations
var panelScreens
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.id])); print(result)", function(returnValue) {panelIds = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.height])); print(result)", function(returnValue) {panelHeights = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.location])); print(result)", function(returnValue) {panelLocations = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.offset])); print(result)", function(returnValue) {panelOffsets = returnValue})
callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "const result = []; panels().forEach((panel) => result.push([panel.screen])); print(result)", function(returnValue) {panelScreens = returnValue})

var timer = new QTimer()
var areas = []
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
    //workspace.windowList().forEach(window => {
        //if (window.resourceClass == "plasmashell" && window.specialWindow) {
            //print(window.frameGeometry)
        //}
    //})
    //print(workspace.screens[0].geometry)
    workspace.screens.forEach(screen => areas.push(workspace.clientArea(KWin.FullScreenArea, screen, workspace.currentDesktop)))
    //print(areas)
    panelScreens = panelScreens.split(",")
    //print(panelScreens)
    //print(areas)
    //area = workspace.clientArea(KWin.FullScreenArea, workspace.activeScreen, workspace.currentDesktop)
    callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panels().forEach(panel => panel.hiding = 'windowsgobelow')")
    //print(area)
    //print(workspace.activeWindow)
    workspace.windowActivated.connect(disconnectWindow)
    workspace.activeWindow.moveResizedChanged.connect(checkWindow)
}

function checkWindow() {
    if (areas == null) {
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
    //print(panelHeights[2])
    //print(window.frameGeometry.y - 200)
    panelIds.forEach((panel, index) => {
        topDiff = -(areas[0].y - areas[panelScreens[index]].y)
        //print(topDiff)
        //print(bottomDiff)

        //print(panelLocations[index])
        if (panelLocations[index] == "top") {
            //print(1)
            print(topDiff)

            print(window.frameGeometry.y)
            print(parseInt(panelHeights[index]) + 8 + topDiff)
            if (window.frameGeometry.y < parseInt(panelHeights[index]) + 8 + topDiff && workspace.screens.indexOf(workspace.activeScreen) == panelScreens[index]) {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
                //print(1)
            }
            else {
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'windowsgobelow'")
                //print(2)
            }
        }
        else {
            bottomDiff = areas[0].height - areas[panelScreens[index]].height - topDiff
            //print(window.frameGeometry.y + window.frameGeometry.height)
            //print(areas[panelScreens[index]].height + parseInt(panelHeights[index]) + 108 + topDiff - bottomDiff)
            //print(bottomDiff)

            if (window.frameGeometry.y + window.frameGeometry.height > areas[panelScreens[index]].height + parseInt(panelHeights[index]) - 108 + topDiff - bottomDiff && workspace.screens.indexOf(workspace.activeScreen) == panelScreens[index]) {
                //print(1)
                callDBus("org.kde.plasmashell", "/PlasmaShell", "org.kde.PlasmaShell", "evaluateScript", "panelById(" + panelIds[index] + ").hiding = 'autohide'")
            }
            else {
                //print(2)
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
