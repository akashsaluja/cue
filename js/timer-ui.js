module.exports.timerStart = function (time) {
    // Verify time is no.
    const rendrer = require("./main-rendrer");
    const isNumber = rendrer.isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    } else {
        const electron = require("electron");
        electron.remote.getCurrentWindow().minimize();
        setTimeout(100, rendrer.takeScreenshotAndSetReminder(time));
        rendrer.takeScreenshotAndSetReminder(time);
        setTimeout(300, remote.getCurrentWindow().close());
    }

}
