/*
 *   Copyright 2016 David Edmundson <davidedmundson@kde.org>
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License as
 *   published by the Free Software Foundation; either version 2 or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the
 *   Free Software Foundation, Inc.,
 *   51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
 
import QtQuick 2.8
import QtQuick.Layouts 1.1
import QtQuick.Controls 2.5
import org.kde.plasma.core 2.0

Column {

        id: container
        y: 100
        anchors.horizontalCenter: parent.horizontalCenter
        
        property date dateTime: new Date()
        property color color: "white"
        property alias timeFont: time.font
        property alias dateFont: date.font
        property int timeFontSize: 14
        property int dateFontSize: 11
        Timer {
            interval: 100; running: true; repeat: true;
            onTriggered: container.dateTime = new Date()
        }
        Text {
            id: time
            anchors {
                horizontalCenter: parent.horizontalCenter
            }

            color: container.color
            text : Qt.formatTime(container.dateTime, "hh:mm")
            font.pointSize: 65
        }
        Text {
            id: date
            anchors.horizontalCenter: parent.horizontalCenter
            color: container.color
            text : Qt.formatDate(container.dateTime, Qt.DefaultLocaleLongDate)
            font.pointSize: 15
        }
    }



