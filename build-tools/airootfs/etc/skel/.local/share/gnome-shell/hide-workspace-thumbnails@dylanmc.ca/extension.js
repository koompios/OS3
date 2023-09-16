/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const Main = imports.ui.main;

class Extension {
    constructor() {
        this._oldUpdateShouldShow = null;
    }

    enable() {
        const thumbnailsBox = this._getThumbnailsBox();
        this._oldUpdateShouldShow = thumbnailsBox._updateShouldShow;
        thumbnailsBox._updateShouldShow = () => {
            const shouldShow = false;

            if (thumbnailsBox._shouldShow === shouldShow)
                return;

            thumbnailsBox._shouldShow = shouldShow;
            thumbnailsBox.notify('should-show');
        }
        thumbnailsBox._updateShouldShow();
    }

    disable() {
        const thumbnailsBox = this._getThumbnailsBox();
        thumbnailsBox._updateShouldShow = this._oldUpdateShouldShow;
        thumbnailsBox._updateShouldShow();
    }

    _getThumbnailsBox() {
        const overviewActor = Main.overview._overview;
        return overviewActor.controls._thumbnailsBox;
    }
}

function init() {
    return new Extension();
}
