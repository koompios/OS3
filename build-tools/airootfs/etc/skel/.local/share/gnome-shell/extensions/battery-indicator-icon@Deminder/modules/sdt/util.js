// SPDX-FileCopyrightText: 2023 Deminder <tremminder@gmail.com>
// SPDX-License-Identifier: GPL-3.0-or-later

export const debugMode = false;

/**
 * Log debug message if debug is enabled .
 *
 * @param {...any} args log arguments
 */
export function logDebug(...args) {
  if ('logDebug' in globalThis) {
    globalThis.logDebug(...args);
  } else if (debugMode) {
    console.log('[SDT]', ...args);
  }
}
