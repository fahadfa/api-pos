import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";

export class ColorantReport {
  public sessionInfo: any;
  private db: any;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);
      let totalQuantity: number = 0;
      let totalAmount: number = 0;
      data.forEach((v: any) => {
        totalQuantity += v.quantity ? parseInt(v.quantity) : 0;
        totalAmount += v.totalAmount ? parseInt(v.totalAmount) : 0;
      });
      let renderData: any = {
        printDate: new Date().toISOString().slice(0, 10),
        fromDate: params.fromDate,
        toDate: params.toDate,
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
        user: params.user,
      };

      renderData.totalQuantity = 0;
      renderData.totalAmount = 0;

      data.map((v: any) => {
        renderData.totalQuantity += parseInt(v.quantity);
        renderData.totalAmount += parseFloat(v.totalAmount);
      });
      renderData.totalAmount = renderData.totalAmount.toFixed(2);

      renderData.data = data;
      return renderData;
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
    // console.log(result);
    let warehouse: any = await this.warehouseName(params.inventlocationid);
    result.warehouseNameEn = warehouse.namealias;
    result.warehouseNameAr = warehouse.name;
    result.printDate = new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, "");
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "colorant-excel" : "colorant-excel-ar";
    } else {
      file = params.lang == "en" ? "colorant-report" : "colorant-report-ar";
    }
    try {
      return App.HtmlRender(file, result);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query: string = `
    select 
        distinct
        sl.salesid as "salesId",
        sl.itemid as itemid,
        sl.colorantid as colorant,
        sl.colorantprice  as price,
        to_char(sl.salesprice,  'FM999999999.00') as "salesPrice",
        to_char(sl.salesqty, 'FM999999990') as quantity,
        to_char((sl.salesqty * sl.colorantprice), 'FM999999990.00') as "totalAmount",
        sl.inventsizeid as inventsizeid,
        sz.description as "sizeNameEn",
        sz."name" as "sizeNameAr",
        w.name as "wareHouseNameAr",
        w.namealias as "wareHouseNameEn"
        from salesline sl
        left join inventlocation w on w.inventlocationid=sl.inventlocationid
        left join inventsize sz on sz.inventsizeid = sl.inventsizeid and sz.itemid = sl.itemid 
        left join salestable st on st.salesid = sl.salesid
        where sl.createddatetime >= '${params.fromDate}' ::date
        and  sl.createddatetime < ('${params.toDate}' ::date + '1 day'::interval)
        and st.transkind != 'SALESQUOTATION' AND st.transkind != 'TRANSFERORDER' and (st.status = 'POSTED' or st.status = 'PAID') AND sl.colorantprice > 0
   `;
    if (params.inventlocationid != "ALL") {
      query += `  and sl.inventlocationid = '${params.inventlocationid}' `;
    }
    if (params.inventlocationid == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and sl.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` and sl.inventlocationid='${params.inventlocationid}' `;
    }
    return await this.db.query(query);
  }
}
