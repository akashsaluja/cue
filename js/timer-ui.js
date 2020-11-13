module.exports.timerStart = function (time, unit) {
    // Verify time is no.
    const rendrer = require("./main-rendrer");
    const isNumber = rendrer.isNumeric(time);
    if (!isNumber) {
        alert("Please Enter a no.");
    } else {
        const electron = require("electron");
        electron.remote.getCurrentWindow().hide();
        if (unit == "h") {
            time *= 60;
        } else if (unit == "d") {
            time *= 1440;
        } else if (unit == "w") {
            time *= 10080;
        }
        setTimeout(function () { rendrer.takeScreenshotAndSetReminder(time) }, 200);
        // rendrer.takeScreenshotAndSetReminder(time);
        setTimeout(electron.remote.getCurrentWindow().close, 2000);
    }

}
