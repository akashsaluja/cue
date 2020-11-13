const shortcut = require('./js/shortcut');
const electron = require('electron');
const url = require('url')
const path = require('path')
const ramda = require("ramda");


let win;

function createWindow() {
    win = new electron.BrowserWindow({ width: 800, height: 600 })
    win.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }));
    const shortcut1 = { name: "Command + shift + 1", command: "Command+Shift+1", callback: genericTimer };
    const shortcut2 = { name: "Command + shift + 2", command: "Command+Shift+2", callback: screenshotProxy10 };
    // const shortcut3: Shortcut = { name: "Command + shift + 3", command: "Command+Shift+2", callback: screenshotProxy30 };
    shortcut.registerShortcuts([shortcut1, shortcut2]);
    // const reminder = {
    //     imgPath: "/Users/akash/personal/cue/database/images/b7cceba0-65e0-11e8-872a-978fc8e5a7c1.png",
    //     inceptionTime: Date.now(),
    //     timer: 1 * 60 * 1000,
    //     acknowledged: false
    // };
    // createNotification(reminder);
    win.webContents.openDevTools();
    win.minimize();
}

/**
 * Main thread method to take screenshot, raises an event to rendrer process
 */
function screenshotProxy1() {
    win.webContents.send('screenshotChannel', [5]);
}

function screenshotProxy10() {
    win.webContents.send('screenshotChannel', [10]);
}

function genericTimer() {
    openTimerWindow();
}

function screenshotProxy30() {
    win.webContents.send('screenshotChannel', [30]);
}
/**
 * Creates a notification to show to user for a reminder
 */
function createNotification(reminder) {
    const notification = new electron.Notification({ title: "Cue", body: "Hello" });
    // Open a new window when the notification is clicked

    notification.on("click", getClickHandler(reminder));
    notification.show();
}

function getClickHandler(reminder) {
    console.log("Notification clicked");
    const func = ramda.curry(handleClick);
    return func(reminder);
}
function handleClick(reminder, event) {
    console.log("Reminder for: " + reminder);
    console.log(win.webContents);
    win.webContents.send('notificationClick', [reminder]);
    imageWindow = new electron.BrowserWindow({ width: 800, height: 600 });
    imageWindow.loadURL("file:///" + reminder.imgPath);
}

electron.ipcMain.on('raise-notification', function (event, arg) {
    createNotification(arg);
});

function openTimerWindow() {
    // arg is reminder
    let timerWindow = new electron.BrowserWindow({ width: 200, height: 46, frame: false });
    timerWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/html/timer-input.html'),
        protocol: 'file:',
        slashes: true
    }));
    timerWindow.focusOnWebView();
    // win.webContents.openDevTools();
    // timerWindow.focus();
    timerWindow.show();
};







electron.app.on('ready', createWindow);