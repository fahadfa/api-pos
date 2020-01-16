"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("./utils/Log");
var SyncService_1 = require("./sync/SyncService");
var cmd = require("node-cmd");
try {
    new SyncService_1.SyncService();
}
catch (err) {
    Log_1.log.error("SyncService Error: ", err);
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
        Log_1.log.log("warn", "You have a clone of the repository. Use 'git pull' to be up-to-date");
        var spawn = require("child_process").spawn;
        var ls = spawn("git", ["pull"]);
        ls.stdout.on("data", function (data) {
            Log_1.log.warn("stdout: " + data);
        });
        ls.stderr.on("data", function (data) {
            Log_1.log.error("stderr: " + data);
        });
        ls.on("close", function (data) {
            Log_1.log.warn("child process exited with code " + data);
        });
    });
    autoupdater.on("check.up-to-date", function (data) {
        Log_1.log.warn("You have the latest version: " + data);
    });
    autoupdater.on("check.out-dated", function (v_old, v) {
        Log_1.log.warn("Your version is outdated. " + v_old + " of " + v);
        autoupdater.fire("download-update"); // If autoupdate: false, you'll have to do this manually.
        // Maybe ask if the'd like to download the update.
    });
    autoupdater.on("update.downloaded", function () {
        Log_1.log.warn("Update downloaded and ready for install");
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
        cmd.get("sc query  jpos-offline", function (err, data) {
            Log_1.log.error(err);
            Log_1.log.warn(data);
            if (data && data.includes("STOPPED")) {
                cmd.run("net start jpos-offline & net stop jpos-alt");
            }
            else {
                cmd.run("net start jpos-alt & net stop jpos-offline");
            }
        });
        // cmd.get("net stop jpos-offline", (err: any, data: any) => {
        //   log.log("warn", err, data);
        //   cmd.get("net start jpos-offline", (err: any, data: any) => {
        //     log.log("warn", err, data);
        //   });
        // });
        // autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually.
    });
    autoupdater.on("update.not-installed", function () {
        Log_1.log.warn("The Update was already in your folder! It's read for install");
        //autoupdater.fire("extract"); // If autoupdate: false, you'll have to do this manually
    });
    autoupdater.on("update.extracted", function () {
        Log_1.log.warn("Update extracted successfully!");
        Log_1.log.warn("RESTART THE APP!");
    });
    autoupdater.on("download.start", function (data) {
        Log_1.log.warn("Starting downloading: " + data);
    });
    autoupdater.on("download.progress", function (name, perc) {
        process.stdout.write("Downloading " + perc + "%\r\n");
    });
    autoupdater.on("download.end", function (data) {
        Log_1.log.warn("Downloaded " + data);
    });
    autoupdater.on("download.error", function (err) {
        Log_1.log.error("Error when downloading: " + err);
    });
    autoupdater.on("end", function () {
        Log_1.log.warn("The app is ready to function");
    });
    autoupdater.on("error", function (data, e) {
        Log_1.log.error(data, e);
    });
}
catch (err) {
    Log_1.log.error(" autoupdater error: ", err);
}
var cron = require("node-cron");
cron.schedule("*/2 * * * *", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            //if (process.env.ENV_STORE_ID) {
            autoupdater.fire("check");
            //}
        }
        catch (error) {
            Log_1.log.error("******* Error on Downlooad **********");
        }
        return [2 /*return*/];
    });
}); });
// setInterval(() => {
//   try {
//     autoupdater.fire("check");
//   } catch (error) {
//     console.error("******* Error on Downlooad **********");
//   }
// }, 60000);
