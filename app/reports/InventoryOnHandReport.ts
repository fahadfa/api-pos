import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
export class InventoryOnHandReport {
  public sessionInfo: any;
  private db: any;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    // try {
    let data: any = await this.query_to_data(params);
    var i = 1;
    var sum = 0;
    data = data.filter((item: any) => Number.parseFloat(item.totalAvailable) >= 0);
    for (let item of data) {
      item.sNo = i;
      i += 1;
      item.batchCheck = params.batchCheck;
      sum += Number.parseFloat(item.physicalAvailable);
    }
    let result = {
      printDate: new Date().toLocaleString(),
      data: data,
      sum: sum,
      batchCheck: params.batchCheck ? params.batchCheck : false,
      user: params.user,
    };
    return result;
    // } catch (error) {
    //   throw error;
    // }
  }

  async report(result: any, params: any) {
    let renderData: any;
    console.log(params);
    renderData = result;
    (renderData.printDate = new Date(params.printDate)
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "")),
      console.log(params.lang);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "onhandinventory-excel" : "onhandinventory-excel-ar";
    } else {
      file = params.lang == "en" ? "onhandinventory-report" : "onhandinventory-report-ar";
    }

    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query = `select
    i.itemid as itemid,
    bs.namealias as nameEn,
    bs.itemname as nameAr,
    sum(i.qty_in-i.qty_out-i.qty_reserved) as "physicalAvailable",
    i.configid as configid,
    i.inventsizeid as inventsizeid,
    ${
      params.batchCheck
        ? `i.batchno as batchno,
    to_char(b.expdate, 'yyyy-MM-dd') as batchexpdate,`
        : ``
    }
    sum(i.qty_reserved) as "reservedQuantity",
    sum(i.qty_in-i.qty_out) as "totalAvailable",
    w.name as WareHouseNameAr, 
    w.namealias as WareHouseNameEn
    from inventory_onhand as i
    left join inventbatch b on i.batchno = b.inventbatchid and i.itemid = b.itemid
    inner join inventtable bs on i.itemid = bs.itemid
    inner join inventlocation w on w.inventlocationid=i.inventlocationid
`;

    if (params.key == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      console.log(regionalWarehouses);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.inventlocationid + "',";
      query += ` where i.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` where i.inventlocationid='${params.key}'  `;
    }
    if (params.itemId) {
      query = query + ` and LOWER(i.itemid) = LOWER('${params.itemId}')`;
    }
    if (params.configId) {
      query = query + ` and LOWER(i.configid)=LOWER('${params.configId}')`;
    }
    if (params.inventsizeid) {
      query = query + ` and LOWER(i.inventsizeid)=LOWER('${params.inventsizeid}')`;
    }
    if (params.batchno && params.batchCheck) {
      query = query + ` and LOWER(i.batchno)=LOWER('${params.batchno}') `;
    }

    query += `  GROUP BY bs.itemname, bs.namealias, w.name, w.namealias,
i.itemid, i.configid, i.inventsizeid ${params.batchCheck ? `, i.batchno, b.expdate` : ``} `;

    query += ` ${
      params.withZero ? `having sum(i.qty_in-i.qty_out) >= 0` : ` having sum(i.qty_in-i.qty_out) > 0 `
    } order by i.itemid `;

    return await this.db.query(query);
  }
}
