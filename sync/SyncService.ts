import { SyncDMLService } from "./SyncDMLService";
import { SyncDDLService } from "./SyncDDLService";

import { sdlog, smlog, stlog, s1log, sflog } from "../utils/Log";
import { SyncServiceHelper } from "./SyncServiceHelper";
import { SysService } from "../sysService";

const dns = require("dns").promises;
var cron = require("node-cron");
var cmd = require("node-cmd");

let log: any;
export class SyncService {
  private syncDMLService: SyncDMLService;
  private syncDDLService: SyncDDLService;

  constructor(type: string) {
    switch (type) {
      case "D":
        log = sdlog;
        break;
      case "M":
        log = smlog;
        break;
      case "T":
        log = stlog;
        break;
      case "1":
        log = s1log;
        break;
      case "F":
        log = sflog;
        break;
      default:
        break;
    }
    SyncServiceHelper.SetLog(log);
    this.syncDMLService = new SyncDMLService(log);

    this.init(type);
    // log.log("debug", `&&&&&&&&&&&&&&&&&&&&&& ENV_STORE_ID : ${process.env.ENV_STORE_ID} &&&&&&&&&&&&&&&&&&&&&&`);
    // if (process.env.ENV_STORE_ID) {
    //   log.log("info", ">>>>>>>>>>>>>>>>> INIT <<<<<<<<<<<<<<<<<<<");
    //   this.init();
    // }
  }

  async init(type: string) {
    switch (type) {
      case "D":
        this.define();
        break;
      case "M":
        this.master();
        break;
      case "T":
        this.trans();
        break;
      case "1":
        this.priority1();
        break;
      case "F":
        this.fallback();
        break;
      default:
        break;
    }
  }
  async define() {
    this.syncDDLService = new SyncDDLService(log);
    cron.schedule("0 0 0 * * *", async () => {
      await SyncServiceHelper.UpdateCall("RESET");
      log.warn("MID NIGHT RESET SERVER");
      await SysService.ResetService();
    });

    cron.schedule("*/1 * * * *", async () => {
      try {
        log.debug("(((((((((( SYNC START DEFINE))))))))))");
        if (await this.checkInternet()) {
          await this.syncDDLService.execute();
          await this.syncDMLService.deleteExecute();
        } else {
          log.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
        }
        log.debug("(((((((((( SYNC CLOSE DEFINE ))))))))))");
      } catch (error) {
        log.error("--------- CRON DEFINE ERROR ---------");
        log.error(error);
        log.error("--------- CRON DEFINE ERROR ---------");
        if (typeof error == "string" && error == "RESET") {
          log.warn("HARD RESET SERVER");
          await SysService.ResetService();
        }
      }
    });
  }
  async master() {
    let isMasterProceed: Boolean = true;
    cron.schedule("*/19 * * * * *", async () => {
      try {
        if (isMasterProceed == true) {
          isMasterProceed = false;
          log.debug("(((((((((( SYNC START MASTER))))))))))");
          if (await this.checkInternet()) {
            await this.syncDMLService.execute("M");
          } else {
            log.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
          }
          log.debug("(((((((((( SYNC CLOSE MASTER ))))))))))");
          isMasterProceed = true;
        } else {
          log.warn("Master still processing ...................................");
        }
      } catch (error) {
        isMasterProceed = true;
        log.error("--------- CRON MASTER ERROR ---------");
        log.error(error);
        log.error("--------- CRON MASTER ERROR ---------");
      }
    });
  }

  async trans() {
    let isTranscationProceed: Boolean = true;
    cron.schedule("*/17 * * * * *", async () => {
      try {
        if (isTranscationProceed == true) {
          isTranscationProceed = false;
          log.debug("(((((((((( SYNC START TRANS ))))))))))");
          if (await this.checkInternet()) {
            await this.syncDMLService.execute("T");
          } else {
            log.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
          }
          log.debug("(((((((((( SYNC CLOSE TRANS ))))))))))");
          isTranscationProceed = true;
        } else {
          log.warn("TRANSACTION still processing ...................................");
        }
      } catch (error) {
        isTranscationProceed = true;
        log.error("--------- CRON TRANSACTION ERROR ---------");
        log.error(error);
        log.error("--------- CRON TRANSACTION ERROR ---------");
      }
    });
  }

  async priority1() {
    let isPriorityProceed: Boolean = true;
    let toggleSync = "T";
    cron.schedule("*/11 * * * * *", async () => {
      try {
        toggleSync = toggleSync == "M" ? "T" : "M";
        if (isPriorityProceed == true) {
          isPriorityProceed = false;
          log.debug("(((((((((( SYNC START PRIORITY ))))))))))");
          if (await this.checkInternet()) {
            await this.syncDMLService.execute(toggleSync, 1);
          } else {
            log.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
          }
          log.debug("(((((((((( SYNC CLOSE PRIORITY ))))))))))");
          isPriorityProceed = true;
        } else {
          log.warn("PRIORITY still processing ...................................");
        }
      } catch (error) {
        isPriorityProceed = true;
        log.error("--------- CRON PRIORITY ERROR ---------");
        log.error(error);
        log.error("--------- CRON PRIORITY ERROR ---------");
      }
    });
  }

  async fallback() {
    let isFallBackProceed: Boolean = true;
    cron.schedule("*/23 * * * * *", async () => {
      try {
        if (isFallBackProceed == true) {
          isFallBackProceed = false;
          log.debug("(((((((((( SYNC FALLBACK START))))))))))");
          if (await this.checkInternet()) {
            let data: any = await this.syncDMLService.fallBackData();
            log.debug(data);
            if (data && data.id) {
              await this.syncDMLService.execute("M", 0, data);
              await this.syncDMLService.fallBackDataUpdate(data.id);
            }
          } else {
            log.warn(">>>>>>>>>>>>>>>>> No Internet connection <<<<<<<<<<<<<<<<<<<<");
          }
          log.debug("(((((((((( SYNC CLOSE FALLBACK ))))))))))");
          isFallBackProceed = true;
        } else {
          log.warn("FALLBACK still processing ...................................");
        }
      } catch (error) {
        isFallBackProceed = true;
        log.error("--------- CRON FALLBACK ERROR ---------");
        log.error(error);
        log.error("--------- CRON FALLBACK ERROR ---------");
      }
    });
  }

  async checkInternet() {
    return dns
      .lookup("google.com")
      .then(() => true)
      .catch(() => false);
  }

  static async CmdService(cmdObj: any) {
    log.warn(JSON.stringify(cmdObj, null, 2));
    let cmdData = cmdObj.cmd ? cmdObj.cmd : null;
    if (cmdData) {
      if (typeof cmdData == "string") {
        if (cmdData && cmdData.includes("npm")) {
          await SysService.CmdService(cmdData);
          log.warn("cmd: " + cmdData);
          await SyncServiceHelper.UpdateCall("JSON");
          await SysService.ResetService();
        }
      } else if (Array.isArray(cmdData)) {
        for (let ele of cmdData) {
          if (ele && ele.includes("npm")) {
            await SysService.CmdService(ele);
            log.warn("cmd: " + ele);
          }
        }
        await SyncServiceHelper.UpdateCall("JSON");
        await SysService.ResetService();
      }
    }
  }
}
