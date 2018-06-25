const { app, globalShortcut } = require('electron')


export interface Shortcut {
    command: string;
    name: string;
    callback: () => void
};

export function registerShortcuts(shortcutList: Shortcut[]) {
    shortcutList.forEach((shortcut: Shortcut) => {
        const reg = globalShortcut.register(shortcut.command, shortcut.callback);
        if (!reg) {
            console.log('registration failed for shortcut ' + shortcut.name);
        }
    });
}
