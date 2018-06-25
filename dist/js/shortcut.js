"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { app, globalShortcut } = require('electron');
;
function registerShortcuts(shortcutList) {
    shortcutList.forEach((shortcut) => {
        const reg = globalShortcut.register(shortcut.command, shortcut.callback);
        if (!reg) {
            console.log('registration failed for shortcut ' + shortcut.name);
        }
    });
}
exports.registerShortcuts = registerShortcuts;
