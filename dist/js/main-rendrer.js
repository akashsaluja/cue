"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const screeshot_1 = require("./screeshot");
const electron_1 = require("electron");
const repository_1 = require("./repository");
const uuid_1 = require("uuid");
const fs = require("fs");
const path_1 = require("path");
pollDatastoreForAlerts();
function takeScreenshotAndSetReminder(time) {
    console.log("hello");
    screeshot_1.takeFullScreenshot()
        .then(((img) => {
        const fileName = getNameForImage();
        const imgPath = path_1.join(__dirname, "../../database/images/" + fileName + ".png");
        console.log(imgPath);
        fs.writeFile(imgPath, img.toPNG(), function (err) {
            if (err)
                throw err;
            const reminder = {
                imgPath: imgPath,
                inceptionTime: Date.now(),
                timer: time * 60 * 1000,
                acknowledged: false,
                reminderTime: Date.now() + time * 60 * 1000
            };
            repository_1.db.insert(reminder, function (err, docs) {
                console.log("Reminder has been persisted");
            });
        });
    }));
}
electron_1.ipcRenderer.on('screenshotChannel', (event, arg) => {
    takeScreenshotAndSetReminder(arg[0]);
});
electron_1.ipcRenderer.on('notificationClick', (event, arg) => {
    const reminder = arg[0]; // in minutes
    window.open("file:///" + reminder.imgPath);
    const newReminder = Object.assign({}, reminder);
    newReminder.acknowledged = true;
    console.log(reminder);
    console.log(newReminder);
    repository_1.db.update(reminder, newReminder, {}, function (error, numReplaced) {
        console.log(numReplaced);
    });
});
// Event when a command for generic Timer is recieved, in this we take screenshot, open a window and take input
electron_1.ipcRenderer.on('genericTimer', (event, arg) => {
    // const time: number = <number>arg[0]; // in minutes
    screeshot_1.takeFullScreenshot()
        .then(((img) => {
        // Open a window here
        const fileName = getNameForImage();
        const imgPath = path_1.join(__dirname, "../../database/images/" + fileName + ".png");
        fs.writeFile(imgPath, img.toPNG(), function (err) {
            if (err)
                throw err;
            const reminder = {
                imgPath: imgPath,
                inceptionTime: Date.now(),
                timer: 5 * 60 * 1000,
                acknowledged: false,
                reminderTime: Date.now() + 5 * 60 * 1000
            };
            // Dont save it
            // db.insert(reminder, function (err: any, docs: any) {
            //     console.log("Reminder has been persisted");
            // });
            electron_1.ipcRenderer.send('open-timer-window', reminder);
        });
    }));
});
function pollDatastoreForAlerts() {
    repository_1.db.find({ acknowledged: false, reminderTime: { $lte: Date.now() } }, function (err, docs) {
        console.log(docs);
        // docs.forEach(function(obj) {
        //     ids.push(obj.patientId);
        // });
        // console.log(ids);
        if (docs != null && docs.length > 0) {
            docs.forEach((reminder) => {
                createNotification(reminder);
            });
        }
    });
    setTimeout(pollDatastoreForAlerts, 60000);
}
function createNotification(reminder) {
    electron_1.ipcRenderer.send('raise-notification', reminder);
}
function getNameForImage() {
    return uuid_1.v1();
}
function timerStart(time) {
    // Verify time is no.
    const isNumber = isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    }
    else {
        // require("electron").remote.getCurrentWindow().minimize();
        takeScreenshotAndSetReminder(time);
        // setTimeout(100, remote.getCurrentWindow().close());
    }
}
exports.timerStart = timerStart;
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
