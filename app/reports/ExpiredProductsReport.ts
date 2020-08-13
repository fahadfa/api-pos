import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class ExpiredProductsReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation`;
    if (param.toUpperCase() !== "ALL") {
      query += ` where inventlocationid ='${param}' limit 1`;
    }

    let data = await this.db.query(query);
    return data ? data[0] : {};
  }

  async report(result: any, params: any) {
    let warehouse: any = await this.warehouseName(params.inventlocationid);
    console.log(warehouse);
    console.log(params);
    let renderData: any = {
      printDate: new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, ""),
      date: params.date,
      // inventlocationid: params.inventlocationid,
      user: params.user,
    };

    if (params.inventlocationid === "ALL") {
      let query = `select * from app_lang ap where ap.id = '${params.inventlocationid}' limit 1`;
      let data = await this.db.query(query);
      data = data.length > 0 ? data[0] : {};
      renderData.inventlocationid = params.lang == "en" ? data.en : data.ar;
    }
    // console.log(result.salesLine[0].product.nameEnglish);

    renderData.warehouseNameEn = warehouse.namealias;
    renderData.warehouseNameAr = warehouse.name;
    console.log(renderData);
    renderData.data = result;

    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "expiredproducts-excel" : "expiredproducts-excel-ar";
    } else {
      file = params.lang == "en" ? "expiredproducts-report" : "expiredproducts-report-ar";
    }
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query: string = `
    select 
    i.itemid as itemid, 
    i.configid as configid, 
    to_char(sum(qtyin), 'FM999,999,999.') as "qtyIn", 
    to_char(sum(qtyout), 'FM999,999,999.') as "qtyOut", 
    to_char((sum(qtyin)+sum(qtyout)), 'FM999,999,999.') as balance,
    i.inventsizeid as inventsizeid,
    sizenameen as "sizeNameEn",
    sizenamear as "sizeNameAr",
    nameen as "nameEn",
    namear as "nameAr",
    wareHouseNameAr as "wareHouseNameAr",
    wareHouseNameEn as "wareHouseNameEn",
    locationNameAr as "locationNameAr",
    locationNameEn as "locationNameEn",
    to_char(i.datestatus, 'yyyy-MM-dd') as "lastModifiedDate",
    i.batchno as batchno,
    to_char(i.expdate, 'yyyy-MM-dd') as "expDate",
    DATE_PART('day',  to_char(i.expdate, 'yyyy-MM-dd')::timestamp - now()::timestamp) as "expDays" from (
    select 
    i.itemid as itemid,
    coalesce(case when i.qty > 0 then sum(i.qty) end, 0) as qtyin,
    coalesce(case when i.qty < 0 then sum(i.qty) end, 0) as qtyout,
    i.configid as configid,
    i.inventsizeid as inventsizeid,
    i.batchno as batchno,
    s.description as sizenameen,
    s."name" as sizenamear,
    bs.namealias as nameEn,
    bs.itemname as nameAr,
    w.name as wareHouseNameAr,
    w.namealias as wareHouseNameEn,
    w.name as locationNameAr,
    w.namealias as locationNameEn,
    i.datestatus as datestatus,
    b.expdate as expdate
    from inventtrans  i
    left join inventbatch b on i.batchno = b.inventbatchid
    left join inventtable bs on i.itemid = bs.itemid
    left join inventsize s on s.inventsizeid = i.inventsizeid and s.itemid = i.itemid
    left join inventlocation w on w.inventlocationid=i.inventlocationid
    where ((reserve_status!='UNRESERVED' AND reserve_status != 'SAVED') or reserve_status is null) and
    b.expdate <= ('${params.date}' ::date + '1 day'::interval) and i.transactionclosed = true `;

    if (params.inventlocationid == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and i.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` and i.inventlocationid='${params.inventlocationid}' `;
    }

    query += ` group by i.itemid, i.qty,
    i.inventsizeid, i.configid,  i.batchno, b.expdate, s.name, s.description, bs.namealias, bs.itemname, i.datestatus, w.name, w.namealias
    order by b.expdate ASC ) as i 
    
      group by i.itemid, 
    i.inventsizeid, i.configid,  i.batchno, sizenameen, sizenamear, nameEn,nameAr, i.datestatus, wareHouseNameAr, wareHouseNameEn, locationNameAr, locationNameEn, i.expdate
    order by i.expdate ASC`;

    return await this.db.query(query);
  }
}
