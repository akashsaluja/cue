"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function timerStart(time) {
    // Verify time is no.
    const rendrer = require("./main-rendrer");
    const isNumber = rendrer.isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    }
    else {
        const electron = require("electron");
        electron.remote.getCurrentWindow().minimize();
        rendrer.takeScreenshotAndSetReminder(time);
        // setTimeout(100, remote.getCurrentWindow().close());
    }
}
exports.timerStart = timerStart;
