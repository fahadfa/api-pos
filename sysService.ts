import { ulog as log } from "./utils/Log";
import { SyncServiceHelper } from "./sync/SyncServiceHelper";
import { App } from "./utils/App";
const syslogstr = "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~";
var cmd = require("node-cmd");
var cron = require("node-cron");
const execSync = require("child_process").execSync;

export class SysService {
  static async ResetService() {
    let cmdData = null;
    try {
      cmdData = await SysService.CmdService("sc query  jpos-offline");
    } catch (err) {
      log.error(err);
    }
    if (cmdData && cmdData.includes("STOPPED")) {
      await SysService.CmdService("net start jpos-offline");
      await SysService.CmdService("net stop jpos-alt");
    } else {
      await SysService.CmdService("net start jpos-alt");
      await SysService.CmdService("net stop jpos-offline");
    }
  }

  static async CmdService(cmdCall: string) {
    let retValue = null;
    log.warn(syslogstr);
    try {
      log.warn(cmdCall);
      const code = execSync(cmdCall);
      if (code) {
        retValue = code.toString();
        log.warn(retValue);
        console.log(retValue);
      } else {
        throw "!!!!!  cmd not execute  !!!!!";
      }
    } catch (err) {
      retValue = null;
      log.warn(err);
      throw err;
    } finally {
      log.warn(syslogstr);
    }
    return Promise.resolve(retValue);
  }

  static async SelectedMacAddress(storeid: string) {
    log.info(syslogstr);
    try {
      let data = await SyncServiceHelper.StoreSource(storeid);
      if (data) {
        if (data.mac_address == "own") {
          data.mac_address = await App.getMacAddress();
          await SyncServiceHelper.UpdateCall("MAC", data.mac_address);
        }
        return Promise.resolve(data.mac_address);
      } else {
        return Promise.resolve(null);
      }
    } catch (err) {
      log.warn(err);
      return Promise.resolve(null);
    } finally {
      log.info(syslogstr);
    }
  }
}
