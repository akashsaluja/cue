const { app, globalShortcut } = require('electron')


module.exports.registerShortcuts = function (shortcutList) {
    shortcutList.forEach((shortcut) => {
        const reg = globalShortcut.register(shortcut.command, shortcut.callback);
        if (!reg) {
            console.log('registration failed for shortcut ' + shortcut.name);
        }
    });
}
