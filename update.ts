import { ulog as log } from "./utils/Log";
import { getItem, setItem } from "./utils/Store";
import { SyncServiceHelper } from "./sync/SyncServiceHelper";
import { SysService } from "./sysService";
var cron = require("node-cron");

var UpdateSyncService = () => {
  try {
    var AutoUpdater = require("auto-updater");
    var autoupdater = new AutoUpdater({
      pathToJson: "",
      autoupdate: false,
      checkgit: false,
      jsonhost: "raw.githubusercontent.com",
      contenthost: "codeload.github.com",
      progressDebounce: 1,
      devmode: false,
    });

    // State the events
    autoupdater.on("git-clone", function () {
      log.log("warn", "You have a clone of the repository. Use 'git pull' to be up-to-date");
      const { spawn } = require("child_process");
      const ls = spawn("git", ["pull"]);

      ls.stdout.on("data", (data: any) => {
        log.warn(`stdout: ${data}`);
      });

      ls.stderr.on("data", (data: any) => {
        log.error(`stderr: ${data}`);
      });

      ls.on("close", (data: any) => {
        log.warn(`child process exited with code ${data}`);
      });
    });

    autoupdater.on("check.up-to-date", (data: any) => {
      log.warn("You have the latest version: " + data);
    });
    autoupdater.on("check.out-dated", (v_old: any, v: any) => {
      log.warn("Your version is outdated. " + v_old + " of " + v);
      autoupdater.fire("download-update");
    });
    autoupdater.on("update.downloaded", () => {
      log.warn("Update downloaded and ready for install");
      extratFolder();
    });

    autoupdater.on("update.not-installed", function () {
      log.warn("The Update was already in your folder! It's read for install");
      extratFolder();
    });
    autoupdater.on("update.extracted", function () {
      log.warn("Update extracted successfully!");
      log.warn("RESTART THE APP!");
    });
    autoupdater.on("download.start", (data: any) => {
      log.warn("Starting downloading: " + data);
    });
    autoupdater.on("download.progress", (name: any, perc: any) => {
      process.stdout.write("Downloading " + perc + "%\r\n");
    });
    autoupdater.on("download.end", (data: any) => {
      log.warn("Downloaded " + data);
    });
    autoupdater.on("download.error", (err: any) => {
      log.error("Error when downloading: " + err);
      setTimeout(() => {
        SysService.ResetService();
      }, 60000);
    });
    autoupdater.on("end", function () {
      log.warn("The app is ready to function");
    });
    autoupdater.on("error", (data: any, e: any) => {
      log.error(data, e);
    });
  } catch (err) {
    log.error(" autoupdater error: ");
    log.error(err);
  }

  cron.schedule("*/3 * * * *", () => {
    try {
      setItem("syncdate", new Date().toISOString(), "sync -> cron");
      autoupdater.fire("check");
    } catch (error) {
      log.error(error);
      log.error("******* Error on Downlooad **********");
    }
  });
};

var AdmZip = require("adm-zip");
var fs = require("fs");
var extratFolder = () => {
  let fileName = null;
  fs.readdirSync("./").forEach((file: any) => {
    if (file.endsWith(".zip")) {
      fileName = file;
    }
  });
  var zip = new AdmZip(__dirname + "/" + fileName);
  zip.extractAllTo("../", true);
  fs.unlinkSync(__dirname + "/" + fileName);
  SysService.ResetService();
};

// export var UpdateService = () => {
//   cmd.get("sc query  jpos-offline", (err: any, data: any) => {
//     if (err) log.error(err);
//     log.warn(data);
//     if (data && data.includes("STOPPED")) {
//       log.warn("net start jpos-offline");
//       cmd.run("net start jpos-offline");
//       setTimeout(() => {
//         log.warn("net stop jpos-alt");
//         cmd.run("net stop jpos-alt");
//       }, 1000);
//     } else {
//       log.warn("net start jpos-alt");
//       cmd.run("net start jpos-alt");
//       setTimeout(() => {
//         log.warn("net stop jpos-offline");
//         cmd.run("net stop jpos-offline");
//       }, 1000);
//     }
//   });
// };

var main = () => {
  log.info("Update Started ... ");
  // cmd.get("npm run env | grep npm_package_version | cut -d '=' -f 2", (err: any, data: any) => {
  //   log.info("Version: " + data);
  //   if (!err) {
  //     SyncServiceHelper.UpdateCall("VERSION", data);
  //   } else {
  //     log.error(err);
  //   }
  // });
  try {
    let data = fs.readFileSync("./package.json", "utf8");
    data = JSON.parse(data);
    log.info("Version: " + data.version);
    SyncServiceHelper.UpdateCall("VERSION", data.version);
  } catch (err) {
    log.error(err);
  }
  setItem("syncdate", new Date().toISOString(), "sync -> main");
  try {
    UpdateSyncService();
  } catch (err) {
    log.error("Update Sync Service error ");
  }
};



main();
