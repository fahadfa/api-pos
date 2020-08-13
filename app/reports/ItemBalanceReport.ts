import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class ItemBalanceReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data = await this.data_from_db(params);
      var i = 1;
      let resData: any = [];
      let saleslist: any = { salesgroup: {}, salesdata: [] };
      for (let item of data) {
        item.sNo = i;
        item.availability = parseInt(item.availability);
        item.qtyIn = parseInt(item.qtyIn);
        item.qtyOut = parseInt(item.qtyOut);
        i += 1;
        saleslist = resData.find((ele: any) => ele.salesgroup.itemid == item.itemid);
        if (saleslist) {
          saleslist.salesdata.push(item);
        } else {
          saleslist = { salesgroup: {}, salesdata: [] };
          saleslist.salesgroup.itemid = item.itemid;
          saleslist.salesgroup.nameEn = item.nameEn;
          saleslist.salesgroup.nameAr = item.nameAr;
          saleslist.salesdata.push(item);
          resData.push(saleslist);
        }
      }

      let result = {
        // printDate: new Date().toLocaleString(),
        data: resData,
        user: params.user,
      };

      return result;
    } catch (error) {
      throw error;
    }
  }
  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    renderData.fromDate = params.fromDate;
    renderData.toDate = params.toDate;
    renderData.inventlocationid = params.inventlocationid;
    renderData.printDate = new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, "");

    // console.log(renderData);

    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "itembalance-excel" : "itembalance-excel-ar";
    } else {
      file = params.lang == "en" ? "itembalance-report" : "itembalance-report-ar";
    }
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async data_from_db(params: any) {
    let query = `
    select 
    ib.itemid, ib.configid, ib.inventsizeid, ib.batchno, ib.inventlocationid, 
    sum(qty_in) as "qtyIn",
    sum(qty_out) as "qtyOut",
    (select
      SUM(j.qty) 
      from inventtrans j where j.itemid = ib.itemid and 
      j.configid = ib.configid and 
      j.inventsizeid = ib.inventsizeid and 
      j.batchno = ib.batchno and 
      j.inventlocationid = ib.inventlocationid
      and j.transactionclosed = true and j.reserve_status != 'RESERVED'
      and j.dateinvent <= '${params.toDate}' :: date
      group by j.itemid,  j.configid, j.inventsizeid, j.batchno, j.inventlocationid
      ) as availability,
      bs.namealias as "nameEn",
      bs.itemname as "nameAr",
      w.name as "WareHouseNameAr", 
      w.namealias as "WareHouseNameEn",
      sz.description as "sizeNameEn",
      sz.name as "sizeNameAr",
      ib.location,
       to_char(b.expdate, 'yyyy-MM-dd') as batchexpdate
    from (
      select
      distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
      i.itemid as itemid,
      i.configid as configid,
      i.inventsizeid as inventsizeid,
      i.batchno as batchno,
      case when qty>0 then abs(qty) else 0 end as qty_in,
      case when qty<0 then abs(qty) else 0 end as qty_out,
      i.inventlocationid as inventlocationid,
      i.location as location
  from inventtrans  i
      where i.dateinvent >= '${params.fromDate}' ::date
      AND  i.dateinvent < ('${params.toDate}' ::date + '1 day'::interval) and i.reserve_status != 'RESERVED' `;
    if (params.key == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.inventlocationid}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.inventlocationid + "',";
      query += ` and i.inventlocationid in (${inQueryStr.substr(
        0,
        inQueryStr.length - 1
      )}) and (transactionclosed = true) `;
    } else {
      query += ` and i.inventlocationid='${params.key}' and (transactionclosed = true) `;
    }
    if (params.itemId) {
      query = query + ` and i.itemid = '${params.itemId}'`;
    }
    if (params.configId) {
      query = query + ` and i.configid='${params.configId}'`;
    }
    if (params.inventsizeid) {
      query = query + ` and i.inventsizeid='${params.inventsizeid}'`;
    }
    if (params.batchno) {
      query = query + ` and i.batchno='${params.batchno}'`;
    }
    query =
      query +
      `  ) as ib 
      inner join inventlocation w on w.inventlocationid=ib.inventlocationid
      left join inventbatch b on ib.batchno = b.inventbatchid  and ib.itemid = b.itemid and ib.configid = b.configid 
      left join inventtable bs on ib.itemid = bs.itemid
      left join inventsize sz on sz.inventsizeid = ib.inventsizeid and sz.itemid = ib.itemid
      GROUP BY
      ib.itemid,  ib.configid, 
      ib.inventsizeid, ib.batchno, b.expdate, bs.namealias, 
      bs.itemname, sz.name, sz.description, 
      ib.inventlocationid, w.name, w.namealias, ib.location
                   `;
    let data: any = await this.db.query(query);
    return data;
  }
}
