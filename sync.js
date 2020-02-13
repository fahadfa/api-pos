"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("./utils/Log");
var SyncService_1 = require("./sync/SyncService");
var cmd = require("node-cmd");
try {
    new SyncService_1.SyncService();
}
catch (err) {
    Log_1.ulog.error("SyncService Error: ", err);
}
try {
    var AutoUpdater = require("auto-updater");
    var autoupdater = new AutoUpdater({
        pathToJson: "",
        autoupdate: false,
        checkgit: false,
        jsonhost: "raw.githubusercontent.com",
        contenthost: "codeload.github.com",
        progressDebounce: 1,
        devmode: false
    });
    // State the events
    autoupdater.on("git-clone", function () {
        Log_1.ulog.log("warn", "You have a clone of the repository. Use 'git pull' to be up-to-date");
        var spawn = require("child_process").spawn;
        var ls = spawn("git", ["pull"]);
        ls.stdout.on("data", function (data) {
            Log_1.ulog.warn("stdout: " + data);
        });
        ls.stderr.on("data", function (data) {
            Log_1.ulog.error("stderr: " + data);
        });
        ls.on("close", function (data) {
            Log_1.ulog.warn("child process exited with code " + data);
        });
    });
    autoupdater.on("check.up-to-date", function (data) {
        Log_1.ulog.warn("You have the latest version: " + data);
    });
    autoupdater.on("check.out-dated", function (v_old, v) {
        Log_1.ulog.warn("Your version is outdated. " + v_old + " of " + v);
        autoupdater.fire("download-update"); // If autoupdate: false, you'll have to do this manually.
        // Maybe ask if the'd like to download the update.
    });
    autoupdater.on("update.downloaded", function () {
        Log_1.ulog.warn("Update downloaded and ready for install");
        var AdmZip = require("adm-zip");
        var fs = require("fs");
        var fileName = null;
        fs.readdirSync("./").forEach(function (file) {
            if (file.endsWith(".zip")) {
                fileName = file;
            }
        });
        var zip = new AdmZip(__dirname + "/" + fileName);
        zip.extractAllTo("../", true);
        fs.unlinkSync(__dirname + "/" + fileName);
        // cmd.get("npm i", (npmerr: any, npmdata: any) => {
        //   if (npmerr) log.error(npmerr);
        //   log.info(npmdata);
        cmd.get("sc query  jpos-offline", function (err, data) {
            if (err)
                Log_1.ulog.error(err);
            Log_1.ulog.warn(data);
            if (data && data.includes("STOPPED")) {
                Log_1.ulog.warn("net start jpos-offline");
                cmd.run("net start jpos-offline");
                setTimeout(function () {
                    Log_1.ulog.warn("net stop jpos-alt");
                    cmd.run("net stop jpos-alt");
                }, 1000);
            }
            else {
                Log_1.ulog.warn("net start jpos-alt");
                cmd.run("net start jpos-alt");
                setTimeout(function () {
                    Log_1.ulog.warn("net stop jpos-offline");
                    cmd.run("net stop jpos-offline");
                }, 1000);
            }
        });
        // });
        // cmd.get("net stop jpos-offline", (err: any, data: any) => {
        //   log.log("warn", err, data);
        //   cmd.get("net start jpos-offline", (err: any, data: any) => {
        //     log.log("warn", err, data);
        //   });
        // });
        // autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually.
    });
    autoupdater.on("update.not-installed", function () {
        Log_1.ulog.warn("The Update was already in your folder! It's read for install");
        //autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually
    });
    autoupdater.on("update.extracted", function () {
        Log_1.ulog.warn("Update extracted successfully!");
        Log_1.ulog.warn("RESTART THE APP!");
    });
    autoupdater.on("download.start", function (data) {
        Log_1.ulog.warn("Starting downloading: " + data);
    });
    autoupdater.on("download.progress", function (name, perc) {
        process.stdout.write("Downloading " + perc + "%\r\n");
    });
    autoupdater.on("download.end", function (data) {
        Log_1.ulog.warn("Downloaded " + data);
    });
    autoupdater.on("download.error", function (err) {
        Log_1.ulog.error("Error when downloading: " + err);
    });
    autoupdater.on("end", function () {
        Log_1.ulog.warn("The app is ready to function");
    });
    autoupdater.on("error", function (data, e) {
        Log_1.ulog.error(data, e);
    });
}
catch (err) {
    Log_1.ulog.error(" autoupdater error: ", err);
}
var cron = require("node-cron");
cron.schedule("* * * * *", function () {
    try {
        autoupdater.fire("check");
    }
    catch (error) {
        Log_1.ulog.error("******* Error on Downlooad **********");
    }
});
// setInterval(() => {
//   try {
//     autoupdater.fire("check");
//   } catch (error) {
//     console.error("******* Error on Downlooad **********");
//   }
// }, 60000);
