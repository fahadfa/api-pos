import { Props } from "../constants/Props";
import { SyncServiceHelper } from "../sync/SyncServiceHelper";
import { SyncService } from "./SyncService";
var moment = require("moment");

const STAGING_ID = "STAGING";
const STORE_ID = process.env.ENV_STORE_ID || "LOCAL";
let log: any;

export class SyncDDLService {
  public sessionInfo: any;

  private db: any;

  constructor(slog) {
    log = slog;
  }

  async execute() {
    log.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    let sync: any = null;
    let currentTime = new Date();
    let sql: any;
    try {
      let stageDb = SyncServiceHelper.StageDBOptions();
      sql = `select * from sync_source
            where id='${STORE_ID}' 
            and (sync_ddl IS NOT NULL or is_reset = true or sync_cmd is not null)`;
      let syncResults: any = await SyncServiceHelper.ExecuteQuery(stageDb, sql);
      syncResults = syncResults.rows;
      syncResults = syncResults.length > 0 ? syncResults[0] : null;
      if (!syncResults) return Promise.resolve("");
      await this.checkAndProceed(syncResults, currentTime);
      log.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
  async checkAndProceed(sync: any, currentTime: Date) {
    log.info(JSON.stringify(sync, null, 2));
    if (sync.is_reset == true) {
      await SyncServiceHelper.UpdateCall("RESET");
      throw "RESET";
    } else {
      if (sync.sync_cmd) {
        await this.cmdExecute(sync);
      } else {
        await this.syncDDL(sync, currentTime);
      }
    }
  }
  async cmdExecute(sync: any) {
    let data: any = sync.sync_cmd;
    SyncService.CmdService(data);
  }

  async syncDDL(sync: any, currentTime: Date) {
    let params = "";
    let sql = "";
    let stageDb = SyncServiceHelper.StageDBOptions();
    let localDb = SyncServiceHelper.LocalDBOptions();
    try {
      params = "";
      sync.sync_ddl.map((ele: any) => {
        params = params + "'" + ele + "',";
      });
      if (params && params.length) params = params.substring(0, params.length - 1);
      sql = " SELECT id,summary FROM sync_ddl WHERE id IN (" + params + ")";
      let syncResults: any = await SyncServiceHelper.ExecuteQuery(stageDb, sql);
      syncResults = syncResults.rows;
      if (syncResults.length == 0) throw Props.RECORD_NOT_FOUND;
      for await (let res of syncResults) {
        try {
          try {
            await SyncServiceHelper.BatchQuery(localDb, [res.summary]);
          } catch (err) {
            log.error(err);
            await SyncServiceHelper.ErrorMessage("DDL", err);
          }
          let syncDDLval: any[] = sync.sync_ddl;
          let index = syncDDLval.indexOf(res.id);
          if (index > -1) syncDDLval.splice(index, 1);
          if (syncDDLval.length == 0) {
            sql = "UPDATE sync_source SET  sync_ddl = NULL WHERE id='" + sync.id + "'";
          } else {
            sql = "UPDATE sync_source SET  sync_ddl= '{" + syncDDLval + "}' WHERE id='" + sync.id + "'";
          }
          await SyncServiceHelper.BatchQuery(stageDb, [sql]);
        } catch (err) {
          log.error(err);
          await SyncServiceHelper.ErrorMessage("DDL", err);
        }
      }
    } catch (err) {
      log.error(err);
      throw err;
    }
  }
}
