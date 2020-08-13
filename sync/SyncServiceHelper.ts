import { Client, types, Pool, PoolClient } from "pg";
import * as Config from "../utils/Config";
import { App } from "../utils/App";
import { log as applog } from "../utils/Log";
var format = require("pg-format");
const STORE_ID = process.env.ENV_STORE_ID || "LOCAL";
var moment = require("moment");
types.setTypeParser(1114, function (stringValue) {
  return stringValue.replace(" ", "T");
});
let log: any = applog;
export class SyncServiceHelper {
  public static synTableColumns: string = "*";
  public static synTableName: string = "sync_table";
  public static syncSourceTableName: string = "sync_source";
  //public static syncTargetTableName: string = "";
  public static syncSourceDDLTableName: string = "sync_ddl";
  public static LocalPool: Pool = new Pool(SyncServiceHelper.LocalDBOptions());
  public static StagePool: Pool = new Pool(SyncServiceHelper.StageDBOptions());
  static SetLog(slog) {
    log = slog;
  }
  constructor() {}
  static async BatchQuery(config: any, sqls: any[]) {
    log.info("-------------- Batch Query Starts --------------");
    log.debug("\tHost Query: " + config.host);
    log.debug("\t\tBatch length: " + sqls.length);
    const db = new Client(config);
    try {
      await db.connect();
      let res = null;
      await db.query("BEGIN");
      for await (let sql of sqls) {
        res = await db.query(sql);
      }
      log.info("END");
      await db.query("COMMIT");
    } catch (e) {
      log.error(e);
      try {
        await db.query("ROLLBACK");
      } catch (err) {
        throw err;
      }
      throw e;
    } finally {
      try {
        db.end();
      } catch (err) {
        throw err;
      }
    }
    log.info("-------------- Batch Query Ends --------------");
  }

  static async ExecuteQuery(config: any, sql: string) {
    let showLog: boolean = !(sql.includes("DISTINCT") || sql.includes("sync_table") || sql.includes("sync_source"));
    //let showLog = true;
    if (showLog) log.info("----------------- Query Starts----------------------------");
    //let db: PoolClient = null;
    if (showLog) log.info("\tHost Query: " + config.host);
    if (showLog) log.debug(sql);
    let res = null;
    const db = new Client(config);

    try {
      await db.connect();
      // db =
      //   config.host.indexOf("localhost") != -1
      //     ? await SyncServiceHelper.LocalPool.connect()
      //     : await SyncServiceHelper.StagePool.connect();
      res = await db.query(sql);
      //console.log(res.rows);
      return { metaData: res.fields, rows: res.rows };
    } catch (e) {
      log.error(e);
      throw e;
    } finally {
      //if (db) db.release();
      try {
        db.end();
      } catch (err) {
        throw err;
      }
      if (showLog) log.info("----------------- Query Ends----------------------------");
    }
  }

  static async PrepareQuery(table: any, metaData: any[], rows: any, filterIds: any[], type: string, pk: string) {
    let columns = metaData.map((ele) => ele.name);
    //let idColumn = metaData.find(ele => ele.name == targetPk);
    if (type == "INSERT") {
      var sql = "insert into " + table;
      sql += " ( " + columns.join(",");
      sql += " ) VALUES %L";
      let records: any[] = [];
      let filterRows = rows.filter((ele: any) => filterIds.indexOf(ele[pk]) > -1);

      filterRows.map((ele: any) => {
        for (let key in ele) {
          if (Array.isArray(ele[key])) {
            ele[key] = JSON.stringify(ele[key]);
          }
        }
        records.push(Object.values(ele));
      });
      sql = format(sql, records);
      return sql;
    } else if (type == "UPDATE") {
      let sql = "update " + table + " as t set ";
      for await (let ele of metaData) {
        sql +=
          " " + ele.name + " = cast(c." + ele.name + " as " + SyncServiceHelper.TypeConvertion(ele.data_type) + " ), ";
      }
      sql = sql.substr(0, sql.length - 2) + " ";
      sql += " from ( values %L)";
      sql += " as c (" + columns.join(",") + ") where ";
      sql += "  cast(t." + pk + " as text ) =  cast(c." + pk + " as text )";
      let records: any[] = [];
      let filterRows = rows.filter((ele: any) => filterIds.indexOf(ele[pk]) > -1);

      filterRows.map((ele: any) => {
        for (let key in ele) {
          if (Array.isArray(ele[key])) {
            ele[key] = JSON.stringify(ele[key]);
          }
        }
        records.push(Object.values(ele));
      });
      sql = format(sql, records);
      //  sql = sql.replace(/'t'/g, "'TRUE'");
      //  sql = sql.replace(/'f'/g, "'FALSE'");
      //console.log(sql);
      return sql;
    }
  }
  static TypeConvertion(type: string) {
    switch (type) {
      // case "int":
      //     return "integer";
      // case "int8":
      //     return "bigint";
      // case "int4":
      //     return "bigint";
      // case "bigint":
      //     return "bigint";
      case "bool":
        return "BOOLEAN";
      case "boolean":
        return "BOOLEAN";
      case "varchar":
        return "text";
      // case "date":
      //   return "timestamp";
      default:
        return type;
    }
  }

  static async ChackAvalibleQuery(table: any, metaData: any[], primaryKeys: any, pk: any) {
    let columns = metaData.map((ele) => ele.name);
    //log.info(JSON.stringify(columns));
    var sql = "select DISTINCT " + pk + " from " + table;
    sql += " where " + pk + " in  (%L)";
    sql = format(sql, primaryKeys);
    return Promise.resolve(sql);
  }

  static async TablesList(config: any) {
    let query = `
            SELECT
                tablename
            FROM
                pg_catalog.pg_tables
            WHERE
                schemaname != 'pg_catalog'
            AND schemaname != 'information_schema'
        `;
    const db = new Client(config);
    await db.connect();
    const res = await db.query(query);
    const rows = res.rows;
    await db.end();
    return rows;
  }

  static async MetadataTable(config: any, table: any) {
    let query = `
                SELECT DISTINCT
                C.ordinal_position AS POS,
                  C.column_name              AS NAME,
                      C.is_nullable              AS IS_NULLABLE,
                      C.udt_name                 AS DATA_TYPE,
                      C.character_maximum_length AS MAX_LENGTH,
                      ( CASE
                          WHEN TC.constraint_type = 'PRIMARY KEY' THEN 'ID'
                          WHEN TC.constraint_type = 'UNIQUE' THEN NULL
                          ELSE CCU.table_name
                        END ) AS REF
            FROM   information_schema.columns C
              LEFT JOIN information_schema.key_column_usage AS KCU
                    ON ( KCU.table_name = c.table_name
                          AND KCU.column_name = c.column_name )
              LEFT JOIN information_schema.table_constraints TC
                    ON TC.table_name = C.table_name
                        AND TC.table_catalog = C.table_catalog
                        AND TC.constraint_name = kcu.constraint_name
              LEFT JOIN information_schema.constraint_column_usage CCU
                    ON CCU.constraint_name = TC.constraint_name
                        AND C.table_catalog = CCU.table_catalog
            WHERE  C.table_catalog = '${config.database}'
              AND C.table_name = '${table}'
            ORDER  BY C.ordinal_position;
        `;
    const db = new Client(config);
    await db.connect();
    const res = await db.query(query);
    const rows = res.rows;
    await db.end();
    return rows;
  }

  static async ErrorMessage(type: string, err: any) {
    let sql = `
    INSERT INTO sync_error 
    (id, store_id, "type", error_msg, error_desc) 
    VALUES(
      '${App.UniqueNumber()}', '${STORE_ID}', '${type}', '${JSON.stringify(err)}', '${err.message ? err.message : ""}'
    )
  `;
    await SyncServiceHelper.BatchQuery(SyncServiceHelper.StageDBOptions(), [sql]);
  }
  // static async parallelQuery(query: string[]){
  //     let functionList: any[] = [];
  //
  //     asyncExec.parallel(functionList,  (err: any, results: any[]) =>{
  //
  //     })
  // }

  public static StageDBOptions() {
    return {
      host: Config.stageDbOptions.host,
      port: Config.stageDbOptions.port,
      user: Config.stageDbOptions.username,
      password: Config.stageDbOptions.password,
      database: Config.stageDbOptions.database,
    };
  }

  // public static LocalDBOptions() {
  //   return {
  //     host: "localhost",
  //     port: 5432,
  //     user: "postgres",
  //     password: "Test!234",
  //     database: "jps_prod"
  //   };
  // }

  public static LocalDBOptions() {
    return {
      host: Config.localDbOptions.host,
      port: Config.localDbOptions.port,
      user: Config.localDbOptions.username,
      password: Config.localDbOptions.password,
      database: Config.localDbOptions.database,
    };
  }

  static async UpdateCall(type: string, data?: any) {
    let sql = null;
    let stageDb = SyncServiceHelper.StageDBOptions();
    if (type == "RESET") {
      sql = `UPDATE sync_source SET  is_reset = false, updated_on = '${moment().toISOString()}'  WHERE id='${STORE_ID}' `;
    } else if (type == "CMD") {
      sql = data;
    } else if (type == "JSON") {
      sql = `UPDATE sync_source SET  sync_cmd = null, updated_on = '${moment().toISOString()}'  WHERE id='${STORE_ID}' `;
    } else if (type == "VERSION") {
      sql = `UPDATE sync_source SET  type = 'v${data}', updated_on = '${moment().toISOString()}'  WHERE id='${STORE_ID}' `;
    } else if (type == "MAC") {
      sql = `UPDATE sync_source SET  mac_address = '${data}', updated_on = '${moment().toISOString()}'  WHERE id='${STORE_ID}' `;
    }
    log.info(sql);
    if (sql) {
      await SyncServiceHelper.BatchQuery(stageDb, [sql]);
    }
  }

  static async StoreSource(storeid: string) {
    let sql: any;
    try {
      let stageDb = SyncServiceHelper.StageDBOptions();
      sql = `select * from sync_source where id='${storeid}' `;
      log.info(sql);
      let syncResults: any = await SyncServiceHelper.ExecuteQuery(stageDb, sql);
      syncResults = syncResults.rows;
      syncResults = syncResults.length > 0 ? syncResults[0] : null;
      return Promise.resolve(syncResults);
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}
