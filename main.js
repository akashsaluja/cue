"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shortcut_1 = require("./js/shortcut");
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var url = require('url');
var path = require('path');
var ipcMain = require('electron').ipcMain;
var win;
function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    shortcut_1.registerShortcuts();
    // win.webContents.openDevTools();
}
app.on('ready', createWindow);
