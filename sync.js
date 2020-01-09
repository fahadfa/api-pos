"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SyncService_1 = require("./sync/SyncService");
try {
    new SyncService_1.SyncService();
}
catch (err) {
    console.error("SyncService Error: ", err);
}
var AutoUpdater = require("auto-updater");
var autoupdater = new AutoUpdater({
    pathToJson: "",
    autoupdate: false,
    checkgit: false,
    jsonhost: "raw.githubusercontent.com",
    contenthost: "codeload.github.com",
    progressDebounce: 1,
    devmode: true
});
// State the events
autoupdater.on("git-clone", function () {
    console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
    var spawn = require("child_process").spawn;
    var ls = spawn("git", ["pull"]);
    ls.stdout.on("data", function (data) {
        console.log("stdout: " + data);
    });
    ls.stderr.on("data", function (data) {
        console.error("stderr: " + data);
    });
    ls.on("close", function (data) {
        console.log("child process exited with code " + data);
    });
});
autoupdater.on("check.up-to-date", function (data) {
    console.info("You have the latest version: " + data);
});
autoupdater.on("check.out-dated", function (v_old, v) {
    console.warn("Your version is outdated. " + v_old + " of " + v);
    autoupdater.fire("download-update"); // If autoupdate: false, you'll have to do this manually.
    // Maybe ask if the'd like to download the update.
});
autoupdater.on("update.downloaded", function () {
    console.log("Update downloaded and ready for install");
    autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on("update.not-installed", function () {
    console.log("The Update was already in your folder! It's read for install");
    autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually.
});
autoupdater.on("update.extracted", function () {
    console.log("Update extracted successfully!");
    console.warn("RESTART THE APP!");
});
autoupdater.on("download.start", function (data) {
    console.log("Starting downloading: " + data);
});
autoupdater.on("download.progress", function (name, perc) {
    process.stdout.write("Downloading " + perc + "%\r\n");
});
autoupdater.on("download.end", function (data) {
    console.log("Downloaded " + data);
});
autoupdater.on("download.error", function (err) {
    console.error("Error when downloading: " + err);
});
autoupdater.on("end", function () {
    console.log("The app is ready to function");
    console.log("The app is ready to function");
});
autoupdater.on("error", function (data, e) {
    console.error(data, e);
});
setInterval(function () {
    try {
        autoupdater.fire("check");
    }
    catch (error) {
        console.error("******* Error on Downlooad **********");
    }
}, 60000);
