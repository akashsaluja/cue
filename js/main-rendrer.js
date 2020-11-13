const shortcut = require('./screeshot');
const electron = require('electron');
const repo = require('./repository');
const uuid = require("uuid");
const fs = require("fs")
const path = require('path');


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
                    reminderTime: Date.now() + time * 60 * 1000,
                    notificationSent: false
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
    console.log("Reached here");
    const reminder = arg[0]; // in minutes
    // win = new electron.BrowserWindowProxy({ width: 800, height: 600 })
    // win.loadURL(url.format({
    //     pathname: "file:///" + reminder.imgPath,
    //     protocol: 'file:',
    //     slashes: true
    // }));
    // const win = window.open("file:///" + reminder.imgPath);
    // win.focus();
    console.log("file:///" + reminder.imgPath);
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
                    reminderTime: Date.now() + 5 * 60 * 1000,
                    notificationSent: false
                };
                // Dont save it
                // repo.db.insert(reminder, function (err, docs) {
                //     console.log("Reminder has been persisted");
                // });
                electron.ipcRenderer.send('open-timer-window', reminder);
            });

        }));
});

function poller() {
    repo.db.find({ acknowledged: false, reminderTime: { $lte: Date.now() }, notificationSent: false }, function (err, docs) {
        console.log(docs);
        // docs.forEach(function(obj) {
        //     ids.push(obj.patientId);
        // });
        // console.log(ids);
        if (docs != null && docs.length > 0) {
            docs.forEach((reminder) => {
                notf(reminder);
                const newReminder = Object.assign({}, reminder);
                newReminder.notificationSent = true;
                repo.db.update(reminder, newReminder, {}, function (error, numReplaced) {
                    console.log(numReplaced);
                });
            });
        }
    });

    repo.db.loadDatabase();
    setTimeout(poller, 5000);
}

module.exports.pollDatastoreForAlerts = poller;

function notf(reminder) {
    electron.ipcRenderer.send('raise-notification', reminder);
}
module.exports.createNotification = notf;



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