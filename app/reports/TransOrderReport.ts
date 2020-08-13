import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class TransOrderReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);
      data.map((item: any) => {
        item.statusVal = params.lang == "en" ? item.statusEn : item.statusAr;
        item.createddatetime = App.convertUTCDateToLocalDate(
          new Date(item.createddatetime),
          parseInt(params.timeZoneOffSet)
        ).toLocaleString();
        item.lastmodifieddate = App.convertUTCDateToLocalDate(
          new Date(item.lastmodifieddate),
          parseInt(params.timeZoneOffSet)
        ).toLocaleString();
        item.deliverydate = App.convertUTCDateToLocalDate(
          new Date(item.deliverydate),
          parseInt(params.timeZoneOffSet)
        ).toLocaleString();
      });

      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data ? data[0] : {};
  }

  async report(result: any, params: any) {
    if (params.status) {
      let query = `select * from app_lang ap where ap.id = '${params.status}' limit 1`;
      let data = await this.db.query(query);
      data = data.length > 0 ? data[0] : {};
      params.status = params.lang == "en" ? data.en : data.ar;
    }
    console.log(params);
    let renderData: any = {
      printDate: App.convertUTCDateToLocalDate(new Date(App.DateNow()), parseInt(params.timeZoneOffSet))
        .toLocaleDateString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, ""),

      fromDate: params.fromDate,
      toDate: params.toDate,
      status: params.status,
      fromWareHouseId: params.fromWareHouseId,
      toWareHouseId: params.toWareHouseId,
      user: params.user,
    };
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData.data = result;
    renderData.total = 0;
    result.map((v: any) => {
      renderData.total += parseInt(v.quantity);
    });
    // console.log(renderData);
    let file: string;
    if (params.type == "excel") {
      if (params.transkind == "ORDERSHIPMENT") {
        file = params.lang == "en" ? "odorder-excel" : "osorder-excel-ar";
      } else if (params.transkind == "ORDERRECEIVE") {
        file = params.lang == "en" ? "ororder-excel" : "ororder-excel-ar";
      } else {
        file = params.lang == "en" ? "transorder-excel" : "transorder-excel-ar";
      }
    } else {
      if (params.transkind == "ORDERSHIPMENT") {
        file = params.lang == "en" ? "osorder-report" : "osorder-report-ar";
      } else if (params.transkind == "ORDERRECEIVE") {
        file = params.lang == "en" ? "ororder-report" : "ororder-report-ar";
      } else {
        file = params.lang == "en" ? "transorder-report" : "transorder-report-ar";
      }
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
                distinct
                  s.salesid as "salesId",
                  s.createddatetime as "createddatetime",
                  s.lastmodifieddate as "lastmodifieddate",
                  s.lastmodifieddate as "deliverydate",
                  s.status as status,
                  als.en as "statusEn",
                  als.ar as "statusAr",                  
                  alt.en as "transkindEn",
                  alt.ar as "transkindAr",
                  
            `;
    if (params.transkind == "TRANSFERORDER" || params.transkind == "ORDERSHIPMENT") {
      query += `
              s.inventlocationid as "fromWareHouse",
                    s.custaccount as "ToWareHouse",
                    fwh.name as "fromWareHouseNameAr",
                    fwh.namealias as "fromWareHouseNameEn",
                    twh.name as "toWareHouseNameAr",
                    twh.namealias as "toWareHouseNameEn",
                    (select to_char(sum(sl.salesqty), 'FM999999990.00') from salesline sl where sl.salesid=s.salesid) as quantity
              from salestable s
                  left join inventlocation fwh on fwh.inventlocationid=s.inventlocationid
                  left join inventlocation twh on twh.inventlocationid=s.custaccount
                  left join app_lang als on als.id = s.status
                  left join app_lang alt on alt.id = s.transkind
              where  s.createddatetime >= '${params.fromDate}' ::date
                AND  s.createddatetime < ('${params.toDate}' ::date + '1 day'::interval) 
            `;
    } else {
      query += `
                  s.inventlocationid as "ToWareHouse",
                        s.custaccount as "fromWareHouse",
                        fwh.name as "fromWareHouseNameAr",
                        fwh.namealias as "fromWareHouseNameEn",
                        twh.name as "toWareHouseNameAr",
                        twh.namealias as "toWareHouseNameEn",
                        (select to_char(sum(sl.salesqty), 'FM999999990.00') from salesline sl where sl.salesid=s.salesid) as quantity
                  from salestable s
                      left join inventlocation twh on twh.inventlocationid=s.inventlocationid
                      left join inventlocation fwh on fwh.inventlocationid=s.custaccount
                      left join app_lang als on als.id = s.status
                      left join app_lang alt on alt.id = s.transkind
                  where  s.createddatetime >= '${params.fromDate}' ::date
                  AND  s.createddatetime < ('${params.toDate}' ::date + '1 day'::interval) 
             `;
    }

    if (params.fromWareHouseId == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and s.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` and s.inventlocationid='${params.fromWareHouseId}' `;
    }
    if (params.transkind == "ORDERSHIPMENT") {
      query += ` and s.transkind in ('ORDERSHIPMENT') and s.status in ('SHIPPED', 'POSTED')  `;
    } else if (params.transkind == "ORDERRECEIVE") {
      query += ` and s.transkind in ('ORDERRECEIVE') and s.status in ('RECEIVED', 'POSTED')  `;
    } else if (params.transkind == "TRANSFERORDER") {
      query += ` and s.transkind in ('TRANSFERORDER') `;
      if (params.status != "ALL") {
        query += ` AND  s.status = '${params.status}' `;
      }
    } else {
      if (params.status != "ALL") {
        query += ` AND  s.status = '${params.status}' `;
      }
      query += `and s.transkind in ('TRANSFERORDER') `;
    }
    if (params.toWareHouseId == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and s.custaccount in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      if (params.toWareHouseId) {
        query += ` and s.custaccount='${params.toWareHouseId}' `;
      }
    }
    return await this.db.query(query);
  }
}
