import { Shortcut, registerShortcuts } from './shortcut';
import { takeFullScreenshot } from './screeshot';
import { ipcRenderer, NativeImage, remote } from 'electron';
import { db } from './repository';
import { v1 } from "uuid";
const fs = require("fs")
import { ReminderType } from './ReminderType';
import { join } from 'path';

pollDatastoreForAlerts();

function takeScreenshotAndSetReminder(time: number) {
    console.log("hello");
    takeFullScreenshot()
        .then(((img: NativeImage) => {
            const fileName = getNameForImage();
            const imgPath = join(__dirname, "../../database/images/" + fileName + ".png");
            console.log(imgPath);
            fs.writeFile(imgPath, img.toPNG(), function (err: any) {
                if (err) throw err
                const reminder: ReminderType = {
                    imgPath: imgPath,
                    inceptionTime: Date.now(),
                    timer: time * 60 * 1000,
                    acknowledged: false,
                    reminderTime: Date.now() + time * 60 * 1000
                };
                db.insert(reminder, function (err: any, docs: any) {
                    console.log("Reminder has been persisted");
                });
            });

        }));
}
ipcRenderer.on('screenshotChannel', (event: any, arg: any) => {
    takeScreenshotAndSetReminder(arg[0]);
});

ipcRenderer.on('notificationClick', (event: any, arg: any) => {
    const reminder: ReminderType = <ReminderType>arg[0]; // in minutes
    window.open("file:///" + reminder.imgPath);
    const newReminder: ReminderType = Object.assign({}, reminder);
    newReminder.acknowledged = true;
    console.log(reminder);
    console.log(newReminder);
    db.update(reminder, newReminder, {}, function (error: any, numReplaced: any) {
        console.log(numReplaced);
    });
});

// Event when a command for generic Timer is recieved, in this we take screenshot, open a window and take input
ipcRenderer.on('genericTimer', (event: any, arg: any) => {

    // const time: number = <number>arg[0]; // in minutes

    takeFullScreenshot()
        .then(((img: NativeImage) => {
            // Open a window here
            const fileName = getNameForImage();
            const imgPath = join(__dirname, "../../database/images/" + fileName + ".png");
            fs.writeFile(imgPath, img.toPNG(), function (err: any) {
                if (err) throw err
                const reminder: ReminderType = {
                    imgPath: imgPath,
                    inceptionTime: Date.now(),
                    timer: 5 * 60 * 1000, // temporary, default reminder
                    acknowledged: false,
                    reminderTime: Date.now() + 5 * 60 * 1000
                };
                // Dont save it
                // db.insert(reminder, function (err: any, docs: any) {
                //     console.log("Reminder has been persisted");
                // });
                ipcRenderer.send('open-timer-window', reminder);
            });

        }));
});

function pollDatastoreForAlerts() {
    db.find({ acknowledged: false, reminderTime: { $lte: Date.now() } }, function (err: any, docs: [any]) {
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

function createNotification(reminder: ReminderType) {
    ipcRenderer.send('raise-notification', reminder);
}


function getNameForImage(): string {
    return v1();
}

export function timerStart(time: number) {
    // Verify time is no.
    const isNumber: boolean = isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    } else {
        // require("electron").remote.getCurrentWindow().minimize();
        takeScreenshotAndSetReminder(time);
        // setTimeout(100, remote.getCurrentWindow().close());
    }

}

export function isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}