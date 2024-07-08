import QtQuick 2.2
import QtQuick.Layouts 1.1
import org.kde.plasma.plasmoid 2.0
import org.kde.plasma.core 2.0 as PlasmaCore
import org.kde.plasma.components 3.0 

PlasmoidItem {

    id : root 

    property bool containmentItemAvailable : true
    property ContainmentItem containmentItem : null
    readonly property int depth : 14
    readonly property var helpMessage : "This Applet is intented for panel"
    readonly property bool editMode : containmentItem.Plasmoid.containment.corona.editMode
    property bool isBackgroundDisabled : plasmoid.configuration.isBackgroundDisabled
    property double opacityOverride : plasmoid.configuration.opacityOverride
    property bool hideInEditModeEnabled : plasmoid.configuration.hideInEditModeEnabled
    // auto toggles at startup
    Component.onCompleted: initializeAppletTimer.start()
    // hides the button in system tray when not in edit mode
    Plasmoid.status: (!editMode && hideInEditModeEnabled) ? PlasmaCore.Types.HiddenStatus : PlasmaCore.Types.PassiveStatus

    Button {
        id : transparencyButton
        icon.name : "settings-app-symbolic"
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.verticalCenter: parent.verticalCenter
        visible : editMode || !hideInEditModeEnabled
        onClicked : {}
    }

    Label {
        id : helpMessageLabel
        anchors.horizontalCenter : parent.horizontalCenter
        anchors.verticalCenter : parent.verticalCenter
        visible : containmentItem == null
        text : root.helpMessage
    }

    function applyBackgroundHint() {
        if ( root.containmentItem == null ) lookForContainer( root.parent , depth ) ;
        if ( root.containmentItem == null ) return ;
        root.containmentItem.Plasmoid.backgroundHints = ( isBackgroundDisabled ) ? PlasmaCore.Types.NoBackground : PlasmaCore.Types.DefaultBackground ;
    }

    function applyOpacity() {
        if ( root.containmentItem == null ) lookForContainer( root.parent , depth ) ;
        if ( root.containmentItem == null ) return ;
        root.containmentItem.opacity = opacityOverride
    }

    function applyConfiguration() {
        applyBackgroundHint()
        applyOpacity()
    }

    function lookForContainer( object , tries ) {
        if ( tries == 0 || object == null ) return ;
        if ( object.toString().indexOf("ContainmentItem_QML") > -1 ) {
            root.containmentItem = object ;
            console.log( "ContainmentItemFound At " + ( depth - tries ) + " recursive call" ) ;
        } else {
            lookForContainer( object.parent , tries-1 ) ;
        }
    }

    onOpacityOverrideChanged : applyOpacity()
    onIsBackgroundDisabledChanged : applyBackgroundHint()

    Timer {
        id: initializeAppletTimer
        interval: 1200

        property int step: 0

        readonly property int maxStep:4

        onTriggered: {
            console.log("enabling transparency mode attempt : " + (step+1) )
            root.applyConfiguration()
            if ( root.containmentItem == null && step<maxStep ) {
                step = step + 1;
                start();
            }
        }

    }

}
