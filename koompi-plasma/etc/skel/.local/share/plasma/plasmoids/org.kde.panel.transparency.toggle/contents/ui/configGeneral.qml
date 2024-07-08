import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import org.kde.kcmutils as KCM
import org.kde.kirigami as Kirigami
import org.kde.plasma.plasmoid

KCM.SimpleKCM {
    id:root
    
    property alias cfg_isBackgroundDisabled: isBackgroundDisabled.checked
    property alias cfg_opacityOverride : opacityOverride.value
    property alias cfg_hideInEditModeEnabled : hideInEditModeEnabled.checked

    Kirigami.FormLayout {

        CheckBox {
            Kirigami.FormData.label: i18n("Hide outside edit mode : ")
            id: hideInEditModeEnabled
            checked: cfg_hideInEditModeEnabled
            onCheckedChanged: cfg_hideInEditModeEnabled = checked
        }

        CheckBox {
            Kirigami.FormData.label: i18n("Hide Bacground : ")
            id: isBackgroundDisabled
            checked: cfg_isBackgroundDisabled
            onCheckedChanged: cfg_isBackgroundDisabled = checked
        }

        Label {
            text: i18n("Opacity Of Panel")
            opacity: 0.7
            Layout.maximumWidth: 300
            wrapMode: Text.Wrap
        }

        Slider {
            id : opacityOverride
            from: 0.1
            to: 1
        }

    }
}
