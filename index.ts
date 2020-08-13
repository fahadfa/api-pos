import "reflect-metadata";
import AppExpress from "./apex/AppExpress";
import { createConnection, AdvancedConsoleLogger } from "typeorm";
import * as Config from "./utils/Config";
import { log } from "./utils/Log";
import { WatcherInit } from "./utils/Watcher";
//import { main } from "./sync";
var http = require("http");
import { getItem, setItem, StoreInIt } from "./utils/Store";
import { App } from "./utils/App";
import { SysService } from "./sysService";
const port = 5000;
const ENV_STORE_ID = process.env ? process.env.ENV_STORE_ID : null;
let count: number = 0;
Config.setEnvConfig();
let conn: any = null;
let run = async () => {
  try {
    log.log(Config.dbOptions);
    if (!conn || !conn.isConnected) {
      WatcherInit();
      conn = await createConnection(Config.dbOptions);
    }

    log.debug(" ************************************** " + conn.isConnected);
    if (conn && conn.isConnected) {
      let appExpress = new AppExpress();
      let express = appExpress.express;
      let httpServer = http.Server(express);
      // const io = require("socket.io")(httpServer);
      // io.on("connection", function(socket: any) {
      //   console.log("Client connected!");
      //   socket.on("message", function(data: any) {
      //     console.log("Sending update!");
      //     socket.emit("update", "Working!");
      //   });
      // });
      express.use("/api", (req: any, res: any, next: any) => {
        if (ENV_STORE_ID) {
          let diff = syncTimeDiff();
          log.warn("sync Time Diff:", diff);
          if (diff > 5) {
            log.error("----->: sync time start : " + diff);
            sync();
          }
        }
        next();
      });
      httpServer.listen(port, async (err: any) => {
        if (err) {
          log.error(err);
          throw err;
        }

        return log.log(
          "info",
          `
                    ***********************************************
                            server is listening on ${port}
                    ***********************************************
          `
        );
      });
    }
  } catch (error) {
    log.error(error);
    setTimeout(() => {
      if (count <= 5) {
        count += 1;
        log.error("================ " + count);
        run();
      } else {
        log.error(error);
      }
    }, 5000);
  }
};
run();

var sync = async () => {
  const child_process = require("child_process");
  const fs = require("fs");

  let syncFileUpdate = `${__dirname}/update.ts`;
  syncFileUpdate = fs.existsSync(syncFileUpdate) ? `${__dirname}/update.ts` : `${__dirname}/update.js`;
  child_process.fork(syncFileUpdate);
  log.warn("syncFileUpdate:", syncFileUpdate);

  let syncDFile = `${__dirname}/syncD.ts`;
  syncDFile = fs.existsSync(syncDFile) ? `${__dirname}/syncD.ts` : `${__dirname}/syncD.js`;
  child_process.fork(syncDFile);
  log.warn("syncDFile:", syncDFile);

  let macAddress = {
    systemAddress: await App.getMacAddress(),
    storeId: ENV_STORE_ID,
    selectAddress: await SysService.SelectedMacAddress(ENV_STORE_ID),
  };
  console.log(JSON.stringify(macAddress));
  log.warn(JSON.stringify(macAddress));
  if (true) {
    //if (macAddress.selectAddress && macAddress.systemAddress && macAddress.selectAddress == macAddress.systemAddress) {
    let syncMFile = `${__dirname}/syncM.ts`;
    syncMFile = fs.existsSync(syncMFile) ? `${__dirname}/syncM.ts` : `${__dirname}/syncM.js`;
    child_process.fork(syncMFile);
    log.warn("syncMFile:", syncMFile);

    let syncTFile = `${__dirname}/syncT.ts`;
    syncTFile = fs.existsSync(syncTFile) ? `${__dirname}/syncT.ts` : `${__dirname}/syncT.js`;
    child_process.fork(syncTFile);
    log.warn("syncTFile:", syncTFile);

    let sync1File = `${__dirname}/sync1.ts`;
    sync1File = fs.existsSync(sync1File) ? `${__dirname}/sync1.ts` : `${__dirname}/sync1.js`;
    child_process.fork(sync1File);
    log.warn("syncFile:", sync1File);

    let syncFFile = `${__dirname}/syncF.ts`;
    syncFFile = fs.existsSync(syncFFile) ? `${__dirname}/syncF.ts` : `${__dirname}/syncF.js`;
    child_process.fork(syncFFile);
    log.warn("syncFile:", syncFFile);
  } else {
    try {
      log.error("Duplicate-Storeid: " + macAddress.storeId);
      log.error(JSON.stringify(macAddress));
      await App.SendMail(
        "searneni@jazeeratech.in; nreddy@jazeeratech.in; sprasad@jazeeratech.in;",
        "auto: duplicate-storeid: " + macAddress.storeId,
        "duplicate-store-id",
        macAddress
      );
    } catch (err) {
      log.error(err);
    }
  }
};

var syncTimeDiff = () => {
  try {
    let lastSyncDate = getItem("syncdate", "index -> cron");
    log.warn("Last sync time: ", lastSyncDate);
    lastSyncDate = new Date(lastSyncDate);
    let diff = (new Date().getTime() - lastSyncDate.getTime()) / 60000;
    return diff;
  } catch (error) {
    log.error(error);
    StoreInIt();
    return 0;
  }
};

try {
  // let MacAddress = async () => {
  //   let macAddress = {
  //     systemAddress: await App.getMacAddress(),
  //     storeId: ENV_STORE_ID,
  //     selectAddress: await SysService.SelectedMacAddress(ENV_STORE_ID),
  //   };
  //   log.warn(JSON.stringify(macAddress));

  //   if (macAddress.selectAddress && macAddress.systemAddress && macAddress.selectAddress == macAddress.systemAddress) {
  //     console.log("proceed");
  //   } else {
  //     try {
  //       log.error("auto: duplicate-dtoreid: " + macAddress.storeId);
  //       log.error(JSON.stringify(macAddress));
  //       await App.SendMail(
  //         "searneni@jazeeratech.in; nreddy@jazeeratech.in; sprasad@jazeeratech.in;",
  //         "Duplicate-Storeid: " + macAddress.storeId,
  //         "duplicate-store-id",
  //         macAddress
  //       );
  //     } catch (err) {
  //       log.error(err);
  //     }
  //   }
  // };
  // MacAddress();
  log.info(`ENV_STORE_ID: ${ENV_STORE_ID}`);
  if (ENV_STORE_ID) {
    let lastSyncDate = null;
    let diff = null;
    StoreInIt();
    sync();
  }
} catch (error) {
  log.error("Sync Error");
  log.error(error);
}

process.on("uncaughtException", function (err) {
  log.error("Caught exception: " + err);
  setTimeout(() => {
    if (count <= 5) {
      count += 1;
      log.error("================ " + count);
      run();
    } else {
      log.error(err);
    }
  }, 5000);
});
