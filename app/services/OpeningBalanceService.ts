// let sql = require("mssql");
import { App } from "../../utils/App";
import { Inventorytrans } from "../../entities/InventTrans";
import { ColorsDAO } from "../repos/ColorsDAO";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { InventoryOnhandDAO } from "../repos/InventoryOnhandDAO";
import { RawQuery } from "../common/RawQuery";
import { InventoryOnhand } from "../../entities/InventoryOnhand";
import * as Config from "../../utils/Config";
import { Props } from "../../constants/Props";
import uuid = require("uuid");
import * as fs from "fs";
import { log } from "../../utils/Log";

// let mssqlDbOptions = {
//   username: 'sysoffline',
//   password: 'binjzrpos',
//   host: 'localhost',
//   database: 'DAX',
//   port: 1433
// }

// let mssqlDbOptions = {
//   username: "SA",
//   password: "Jazeera123",
//   host: "3.80.2.102",
//   database: "jpos_dev",
//   port: 1433
// };
// let mssqlDbOptions = Config.mssqlDbOptions

// let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;
// const query = "SELECT name FROM sys.databases";

export class OpeningBalanceService {
  public sessionInfo: any;
  private inventtransDAO: InventorytransDAO;
  private rawQuery: RawQuery;
  private inventoryTrans: Inventorytrans;
  private inventoryOnhandDAO: InventoryOnhandDAO;
  private pool: any;
  constructor() {
    // this.run();
    this.inventtransDAO = new InventorytransDAO();
    this.rawQuery = new RawQuery();
    this.inventoryTrans = new Inventorytrans();
    this.inventoryOnhandDAO = new InventoryOnhandDAO();
  }
  run = async () => {
    try {
      const mssqlClient = require("mssql/msnodesqlv8");
      const connectionString =
        "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 10.0.1600}";
      // const connectionString = mssqlString;
      this.pool = new mssqlClient.ConnectionPool(connectionString);
    } catch (err) {
      log.error(err);
      this.pool = null;
    }
  };
  async getOpeningBalance(reqData: any) {
    try {
      //await sql.connect();
      // const conn = new sql.connect(config);
      log.info(reqData);
      const fs = require("fs");
      let rawdata = {
        date: reqData.date,
        inventlocationid: this.sessionInfo.inventlocationid,
        dataareaid: this.sessionInfo.dataareaid,
        host: reqData.server,
        username: reqData.username,
        password: reqData.password,
        database: reqData.database,
      };
      let syncDataDate = JSON.stringify(rawdata);
      log.info(syncDataDate);
      fs.writeFile(`${__dirname}/data.json`, syncDataDate, (err: any) => {
        if (err) {
          log.error(err);
        } else {
          log.info("Successfully wrote file");
        }
      });
      return await this.get_open_bal_data_for_onhand(rawdata);
      //});
      // log.info(conn);
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  async save(reqData: any[]) {
    try {
      await this.rawQuery.deleteBalances(this.sessionInfo.inventlocationid);
      let chunkData: any = await this.chunkArray(reqData, 100);
      for (let item of chunkData) {
        item.map((v: any) => {
          v.id = uuid() + App.UniqueCode();
          v.dateinvent = new Date(App.DateNow());
          v.datephysical = new Date(App.DateNow());
          v.transactionClosed = true;
          v.invoiceid = "OPEN_BALANCE";
          v.inventlocationid = this.sessionInfo.inventlocationid;
          v.dataareaid = "ajp";
        });
        let inventtransData: any = await this.inventtransDAO.savearr(item);
        // }
        // let fs = require("fs");
        // let jsonString = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
        // let dateObj = JSON.parse(jsonString);
        // dateObj.date = new Date().toISOString().slice(0, 10);
        // let onhandData = await this.get_open_bal_data_for_onhand(dateObj);
        // chunkData = await this.chunkArray(onhandData, 100);
        // for (let item of chunkData) {
        item.map((v: any) => {
          v.id = uuid() + App.UniqueCode();
          v.qtyIn = v.qty;
          v.qtyOut = 0;
          v.qtyReserved = 0;
          v.updatedOn = new Date(App.DateNow());
          v.updatedBy = this.sessionInfo.userName;
          v.name = "OPEN_BALANCE";
          v.inventlocationid = this.sessionInfo.inventlocationid;
          v.dataareaid = "ajp";
        });
        let onhandInventoryData: any = await this.inventoryOnhandDAO.savearr(item);
      }

      const child_process = require("child_process");
      let syncFile = `${__dirname}/SyncPrevTransactionsServices.ts`;
      syncFile = fs.existsSync(syncFile)
        ? `${__dirname}/SyncPrevTransactionsServices.ts`
        : `${__dirname}/SyncPrevTransactionsServices.js`;
      child_process.fork(syncFile);
      let returnData = { message: "SAVED_SUCCESSFULLY" };
      return returnData;
    } catch (err) {
      log.error(err);
      throw err;
    }
  }

  async chunkArray(myArray: any, chunk_size: number) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return await tempArray;
  }

  async get_open_bal_data_for_onhand(reqData: any) {
    try {
      const mssqlClient = require("mssql");
      // const connectionString =
      //   "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 10.0.1600}";
      const mssqlString = `mssql://${reqData.username}:${reqData.password}@${reqData.host}/${reqData.database}`;
      // log.info(mssqlString);
      const connectionString = mssqlString;
      this.pool = new mssqlClient.ConnectionPool(connectionString);
      await this.pool.connect();
      const query = `SELECT
    ITEMID as itemid, 
    ConfigId as configid, 
    InventSizeId as inventsizeid, 
    BatchNo as batchno, 
    SUM(qty) as qty
    FROM INVENTTRANS i
    where i.ITEMID NOT LIKE 'HSN%' and i.DATEPHYSICAL < '${reqData.date}'
    group by i.ITEMID, i.ConfigId, i.InventSizeId, i.BatchNo HAVING sum(QTY) >0 `;
      //await sql.query(connectionString, query, (err:any, rows:any) => {
      let rows = await this.pool.request().query(query);
      await this.pool.close();
      let result: any = rows.recordset;
      result.map((v: any) => {
        if (v.qty > 0 && v.qty < 1) {
          v.qty = 1;
        }
      });
      return result;
    } catch (err) {
      log.error(err);
      throw { message: "INVALID_CREDENTIALS" };
    }
  }

  async check_data_complete() {
    const fs = require("fs");
    // log.info("88888888888888888888888888888888888888888888888888888888888888888888888");
    try {
      // log.info(fs.existsSync(`${__dirname}/data.json`));
      if (fs.existsSync(`${__dirname}/data.json`)) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      log.error(err);
      throw err;
    }
  }
}
