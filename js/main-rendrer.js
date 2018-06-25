const shortcut = require('./screeshot');
const electron = require('electron');
const repo = require('./repository');
const uuid = require("uuid");
const fs = require("fs")
const path = require('path');

pollDatastoreForAlerts();

module.exports.takeScreenshotAndSetReminder = function (time) {
    console.log("hello");
    shortcut.takeFullScreenshot()
        .then(((img) => {
            console.log("Screenshot Taken");
            const fileName = getNameForImage();
            const imgPath = path.join(__dirname, "../database/images/" + fileName + ".png");
            console.log(imgPath);
            fs.writeFile(imgPath, img.toPNG(), function (err) {
                if (err) throw err
                const reminder = {
                    imgPath: imgPath,
                    inceptionTime: Date.now(),
                    timer: time * 60 * 1000,
                    acknowledged: false,
                    reminderTime: Date.now() + time * 60 * 1000
                };
                repo.db.insert(reminder, function (err, docs) {
                    console.log("Reminder has been persisted");
                });
            });

        }));
}
electron.ipcRenderer.on('screenshotChannel', (event, arg) => {
    takeScreenshotAndSetReminder(arg[0]);
});

electron.ipcRenderer.on('notificationClick', (event, arg) => {
    const reminder = arg[0]; // in minutes
    window.open("file:///" + reminder.imgPath);
    const newReminder = Object.assign({}, reminder);
    newReminder.acknowledged = true;
    console.log(reminder);
    console.log(newReminder);
    repo.db.update(reminder, newReminder, {}, function (error, numReplaced) {
        console.log(numReplaced);
    });
});

// Event when a command for generic Timer is recieved, in this we take screenshot, open a window and take input
electron.ipcRenderer.on('genericTimer', (event, arg) => {

    // const time: number = <number>arg[0]; // in minutes

    takeFullScreenshot()
        .then(((img) => {
            // Open a window here
            const fileName = getNameForImage();
            const imgPath = join(__dirname, "../database/images/" + fileName + ".png");
            fs.writeFile(imgPath, img.toPNG(), function (err) {
                if (err) throw err
                const reminder = {
                    imgPath: imgPath,
                    inceptionTime: Date.now(),
                    timer: 5 * 60 * 1000, // temporary, default reminder
                    acknowledged: false,
                    reminderTime: Date.now() + 5 * 60 * 1000
                };
                // Dont save it
                // repo.db.insert(reminder, function (err, docs) {
                //     console.log("Reminder has been persisted");
                // });
                electron.ipcRenderer.send('open-timer-window', reminder);
            });

        }));
});

function pollDatastoreForAlerts() {
    repo.db.find({ acknowledged: false, reminderTime: { $lte: Date.now() } }, function (err, docs) {
        console.log(docs);
        // docs.forEach(function(obj) {
        //     ids.push(obj.patientId);
        // });
        // console.log(ids);
        if (docs != null && docs.length > 0) {
            docs.forEach((reminder) => {
                createNotification(reminder);
            })
        }
    });
    setTimeout(pollDatastoreForAlerts, 60000);
}

function createNotification(reminder) {
    electron.ipcRenderer.send('raise-notification', reminder);
}


function getNameForImage() {
    return uuid.v1();
}

module.exports.timerStart = function (time) {
    // Verify time is no.
    const isNumber = isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    } else {
        // require("electron").remote.getCurrentWindow().minimize();
        takeScreenshotAndSetReminder(time);
        // setTimeout(100, remote.getCurrentWindow().close());
    }

}

module.exports.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}