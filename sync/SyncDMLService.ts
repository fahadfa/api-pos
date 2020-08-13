import { SyncServiceHelper } from "../sync/SyncServiceHelper";
import { Client, types } from "pg";
import { Props } from "../constants/Props";
import { App } from "../utils/App";
var moment = require("moment");

const STAGING_ID = "STAGING";
const STORE_ID = process.env.ENV_STORE_ID || "LOCAL-TEST";
let log: any;
export class SyncDMLService {
  public sessionInfo: any;
  //private db: any;

  constructor(slog) {
    log = slog;
  }

  async deleteExecute() {
    log.info(
      "#################### DeleteExecute " + STORE_ID + " - " + new Date().toISOString() + " #######################"
    );
    try {
      let stageDbConfig = SyncServiceHelper.StageDBOptions();
      let localDbConfig = SyncServiceHelper.LocalDBOptions();
      let sql = `SELECT table_id, table_name, table_value, deleted_on FROM sync_delete_data order by deleted_on asc limit 250`;
      let syncResults: any = await SyncServiceHelper.ExecuteQuery(localDbConfig, sql);
      syncResults = syncResults ? syncResults.rows : [];
      syncResults = syncResults.length > 0 ? syncResults : null;
      log.debug(JSON.stringify(syncResults, null, 2));
      if (!syncResults) return Promise.resolve("");
      let sysDeleteQuery = this.buildDMLSyncDeleteQuery(syncResults);
      await SyncServiceHelper.BatchQuery(stageDbConfig, sysDeleteQuery);
      let tableDeleteQuery = this.buildDMLDeleteQuery(syncResults);
      await SyncServiceHelper.BatchQuery(localDbConfig, tableDeleteQuery);
    } catch (err) {
      log.warn(":::::::::::::::::::CATCH DELETE BLOCK START ::::::::::::::::::::::");
      log.error(err);
      throw err;
    }

    log.info("#################### DeleteExecute #######################");
  }

  async execute(type: string, priority: number = 9, fallback?: any) {
    log.info("###########################################");
    // App.Sleep(2000);
    log.debug("!!!!!!!!!!!!!!!!!!!! " + STORE_ID + " - " + new Date().toISOString() + "!!!!!!!!!!!!!!!!!!!!");
    let stageDbConfig = SyncServiceHelper.StageDBOptions();
    let localDbConfig = SyncServiceHelper.LocalDBOptions();
    let sql: any = `SELECT to_char (now(), 'YYYY-MM-DD"T"HH24:MI:SS') as utc_date`;
    let utcDate = await SyncServiceHelper.ExecuteQuery(stageDbConfig, sql);
    let utcDateTime = utcDate.rows[0]["utc_date"];
    let currentTime = moment().toISOString();
    log.info(`Db Date: ${utcDateTime}`);
    log.info(`Sys Date: ${currentTime}`);
    // log.info("currentTime Date: ", currentTime);
    if (App.DaysDiff(new Date(utcDateTime), new Date(currentTime)) != 0) {
      log.error("+++++++++++++++++++++++ INVALID DATE SYNC +++++++++++++++++++++++");
      return Promise.resolve("");
    }
    try {
      if (stageDbConfig.host == localDbConfig.host) throw { message: "Invalid DB config Data" };
      if (fallback == null) {
        if (type == "M") {
          sql = ` select * from sync_table 
          where (target_id = '${STORE_ID}' ) 
          and active = true 
          and priority = ${priority} 
          order by updated_on  ASC 
          limit 1`;
        } else {
          sql = ` select * from sync_table 
          where (source_id = '${STORE_ID}' ) 
          and active = true 
          and priority = ${priority}
          order by updated_on  ASC 
          limit 1`;
        }
      } else {
        sql = ` select * from sync_table 
        where (target_id = '${STORE_ID}' ) 
        and active = true 
        and map_table = '${fallback.table_name}' 
        order by updated_on  ASC 
        limit 1`;
      }

      let syncResults: any = await SyncServiceHelper.ExecuteQuery(stageDbConfig, sql);
      syncResults = syncResults ? syncResults.rows : [];
      syncResults = syncResults.length > 0 ? syncResults[0] : null;
      log.debug(JSON.stringify(syncResults, null, 2));
      if (!syncResults) return Promise.resolve("");
      //syncResults.last_update = moment(syncResults.last_update).format();
      //syncResults.last_update = new Date(syncResults.last_update).toISOString();
      if (syncResults.source_id != syncResults.target_id) {
        let sourceDB = syncResults.source_id == STAGING_ID ? stageDbConfig : localDbConfig;
        let targetDB = syncResults.target_id == STORE_ID ? localDbConfig : stageDbConfig;

        // if (syncResults.source_id != STAGING_ID) {
        //   syncResults.last_update = moment(syncResults.last_update)
        //     .format()
        //     .split("+")[0];
        // }

        log.warn("\n\n((((((<<<< " + syncResults.map_table + "::" + syncResults.last_update + " >>>>))))))\n\n");
        if (fallback != null) {
          syncResults.cond = fallback.cond;
          syncResults.last_update = fallback.from_date;
          log.debug(JSON.stringify(syncResults, null, 2));
        }
        await this.syncDb(sourceDB, targetDB, syncResults, currentTime);
      }
    } catch (error) {
      log.error(error);
      throw error;
    }
    log.info("###########################################");
  }

  async syncDb(sourceDb: any, targetDb: any, sync: any, currentTime: string) {
    //console.table(sync);
    //if (sync.source_id != STAGING_ID || sync.source_id == STAGING_ID) throw "simple throw";
    let updateSyncConfig = SyncServiceHelper.StageDBOptions();
    let batchSql: any[] = [];
    let sql: any;
    let isChunkEnd = false;
    let offset: number = 0;
    let isTableUpdated = true;
    let lastUpdate = currentTime;
    //let lastUpdate = await this.buildLastUpdatedDate(sourceDb, sync);
    log.info("************* Last Update: " + lastUpdate + " *************");
    try {
      let rowsAvalible: any = null;
      let rowsNotAvalible: any = null;
      while (isChunkEnd == false) {
        log.info("************* ***** *************");
        rowsAvalible = null;
        rowsNotAvalible = null;
        batchSql = [];
        sql = this.buildDMLSelectQuery(sync, offset);
        const soruceRes: any = await SyncServiceHelper.ExecuteQuery(sourceDb, sql);
        if (soruceRes && soruceRes.rows.length != 0) {
          let rowsLength = soruceRes.rows.length;
          let primaryKeys = soruceRes.rows.map((ele: any) => ele[sync.map_pk]);
          sql = await SyncServiceHelper.ChackAvalibleQuery(
            sync.map_table,
            soruceRes.metaData,
            primaryKeys,
            sync.map_pk
          );
          let res: any = await SyncServiceHelper.ExecuteQuery(targetDb, sql);
          rowsAvalible = res.rows.map((ele: any) => ele[sync.map_pk]);
          rowsNotAvalible = primaryKeys.filter((ele: any) => rowsAvalible.indexOf(ele) < 0);
          log.debug("\t\tUpdate Records: " + sync.map_table + " --> " + rowsAvalible.length);
          log.debug("\t\tInsert Records: " + sync.map_table + " --> " + rowsNotAvalible.length);

          let metaDataTable: any = await SyncServiceHelper.MetadataTable(targetDb, sync.map_table);

          if (rowsAvalible && rowsAvalible.length > 0) {
            sql = await SyncServiceHelper.PrepareQuery(
              sync.map_table,
              metaDataTable,
              soruceRes.rows,
              rowsAvalible,
              "UPDATE",
              sync.map_pk
            );
            batchSql.push(sql);
          }
          if (rowsNotAvalible && rowsNotAvalible.length > 0) {
            sql = await SyncServiceHelper.PrepareQuery(
              sync.map_table,
              metaDataTable,
              soruceRes.rows,
              rowsNotAvalible,
              "INSERT",
              sync.map_pk
            );
            batchSql.push(sql);
          }
          if (batchSql && batchSql.length > 0) {
            await SyncServiceHelper.BatchQuery(targetDb, batchSql);
          }
          offset = offset + this.limitData;
          log.warn("Offset: " + offset);
          /** check loop ends */
          if (rowsLength < this.limitData) {
            log.debug("completed batch data ...");
            isChunkEnd = true;
          }
        } else {
          isTableUpdated = false;
          log.debug("No data found...");
          isChunkEnd = true;
        }
        log.info("************* ***** *************");
      }
      log.debug(":::::::::::::::::::UPDATE " + sync.id + " START ::::::::::::::::::::::");
      let updateQuery = null;
      if (isTableUpdated == true) {
        updateQuery = `update sync_table set last_update = '${lastUpdate}', updated_on = '${currentTime}'  where id='${sync.id}'`;
      } else {
        updateQuery = `update sync_table set  updated_on = '${currentTime}'  where id='${sync.id}'`;
      }
      await SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery]);
      log.debug(":::::::::::::::::::UPDATE " + sync.id + " END ::::::::::::::::::::::\n\n");
    } catch (err) {
      log.warn(":::::::::::::::::::CATCH BLOCK START ::::::::::::::::::::::");
      log.error(err);
      let updateQuery = null;
      if (err == Props.RECORD_NOT_FOUND) {
        updateQuery = `update sync_table set updated_on = '${currentTime}'  where id='${sync.id}'`;
      } else {
        updateQuery = `update sync_table set updated_on = '${currentTime}'  where id='${sync.id}'`;
      }
      await SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery]);
      await SyncServiceHelper.ErrorMessage("DML", err);
      log.warn(":::::::::::::::::::CATCH BLOCK ENDS ::::::::::::::::::::::");
      throw err;
    }
  }
  private limitData: number = 1000;

  async fallBackData() {
    let stageDbConfig = SyncServiceHelper.StageDBOptions();
    let sql = `select *  from sync_fallback where target_id='${STORE_ID}' and is_synced = false order by from_date asc limit 1`;
    try {
      const soruceRes: any = await SyncServiceHelper.ExecuteQuery(stageDbConfig, sql);
      if (soruceRes && soruceRes.rows && soruceRes.rows[0]) {
        return soruceRes.rows[0];
      } else {
        return null;
      }
    } catch (err) {
      throw err;
    }
  }

  async fallBackDataUpdate(id: string) {
    let stageDbConfig = SyncServiceHelper.StageDBOptions();
    let sql = `update sync_fallback set is_synced = true  where id = '${id}'`;
    try {
      const soruceRes: any = await SyncServiceHelper.BatchQuery(stageDbConfig, [sql]);
    } catch (err) {
      throw err;
    }
  }

  private async buildLastUpdatedDate(sourceDb: any, sync: any) {
    let sql = `select ${sync.sync_column} as updated_date from ${sync.map_table} order by  ${sync.sync_column} desc limit 1`;
    try {
      const soruceRes: any = await SyncServiceHelper.ExecuteQuery(sourceDb, sql);
      if (soruceRes && soruceRes.rows && soruceRes.rows[0]) {
        return soruceRes.rows[0]["updated_date"];
      } else {
        return moment().toISOString();
      }
    } catch (err) {
      throw err;
    }
  }

  private buildDMLSelectQuery(sync: any, offset: number) {
    let sql = `select * from ${sync.map_table} where ${sync.cond}  
    and ${sync.sync_column} > '${sync.last_update}' 
    offset ${offset} limit ${this.limitData}`;
    return sql;
  }
  private buildDMLSyncDeleteQuery(deleteData: any[]) {
    let list: any[] = [];
    deleteData.map((val: any) => {
      list.push(`delete from ${val.table_name} where ${val.table_id}='${val.table_value}'`);
    });
    return list;
  }
  private buildDMLDeleteQuery(deleteData: any[]) {
    let list: any[] = [];
    deleteData.map((val: any) => {
      list.push(
        `delete from sync_delete_data where table_name='${val.table_name}' and table_id='${val.table_id}' and table_value='${val.table_value}'`
      );
    });
    return list;
  }
}
