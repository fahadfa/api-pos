import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class SalesReturnReport {
  public sessionInfo: any;
  private db: any;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);
      data.map((v: any) => {
        v.lastmodifieddate = App.convertUTCDateToLocalDate(
          new Date(v.lastmodifieddate),
          parseInt(params.timeZoneOffSet)
        ).toLocaleString();
        v.phone = v.phone && v.phone != "null" ? v.phone : null;
      });
      return data;
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
    let renderData: any = {
      printDate: App.convertUTCDateToLocalDate(
        new Date(App.DateNow()),
        parseInt(params.timeZoneOffSet)
      ).toLocaleString(),
      fromDate: params.fromDate,
      toDate: params.toDate,
      status: params.status,
      user: params.user,
    };

    console.log(renderData.printDate);
    let warehouse: any = await this.warehouseName(params.inventlocationid);
    renderData.warehouseNameEn = warehouse.namealias;
    renderData.warehouseNameAr = warehouse.name;
    renderData.grossAmount = 0;
    renderData.discount = 0;
    renderData.vatAmount = 0;
    renderData.netAmount = 0;

    result.map((v: any) => {
      renderData.grossAmount += parseFloat(v.grossAmount);
      // renderData.discount += parseFloat(v.discount);
      renderData.discount += Number(v.discount);
      renderData.vatAmount += parseFloat(v.vatAmount);
      renderData.netAmount += parseFloat(v.netAmount);
    });

    renderData.grossAmount = renderData.grossAmount.toFixed(2);
    renderData.discount = renderData.discount.toFixed(2);
    renderData.vatAmount = renderData.vatAmount.toFixed(2);
    renderData.netAmount = renderData.netAmount.toFixed(2);

    // console.log(result.salesLine[0].product.nameEnglish);
    renderData.data = result;
    // console.log(renderData);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "salesreturn-excel" : "salesreturn-excel-ar";
    } else {
      file = params.lang == "en" ? "salesreturn-report" : "salesreturn-report-ar";
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
                s.inventlocationid as "fromWareHouse",
                s.custaccount as "custaccount",
                s.createddatetime as createdDateTime,
                s.lastmodifieddate as lastModifiedDate,
                to_char(coalesce(s.disc, 0) , 'FM999999999990.00') as "discount",
                to_char(s.amount , 'FM999999999990.00') as "netAmount",
                to_char(s.netamount , 'FM999999999990.00') as "grossAmount",
                to_char(s.vatamount , 'FM999999999990.00') as "vatAmount",
                s.status as status,
                als.en as "statusEn",
                als.ar as "statusAr",
                s.salesname as name,
                s.salesname as "nameAlias",
                to_char(s.amount, 'FM999999999990.00') as "netAmount",
                to_char(s.netamount,'FM999999999990.00')  as "grossAmount",
                s.transkind as type,
                alt.en as "transkindEn",
	              alt.ar as "transkindAr",
                w.name as "wareHouseNameAr",
                w.namealias as "wareHouseNameEn",
                c.paymtermid as "paymentMode",
                alp.en as "paymentModeEn",
                alp.ar as "paymentModeAr",
                c.walkincustomer as "walkincustomer",
                c.phone as phone
            from salestable s
              left join inventlocation w on w.inventlocationid=s.inventlocationid
              left join custtable c on c.accountnum=s.custaccount
              left join app_lang als on als.id = s.status
              left join app_lang alt on alt.id = s.transkind
              left join app_lang alp on alp.id = s.payment
            where s.transkind in ('RETURNORDER', 'DESIGNERSERVICERETURN') 
            and s.createddatetime >= '${params.fromDate}' ::date
            AND  s.createddatetime < ('${params.toDate}' ::date + '1 day'::interval) 
            `;
    if (params.status != "ALL") {
      if (params.status == "RESERVED") {
        query += ` and s.status in ('RESERVED') `;
      } else if (params.status == "APPROVED") {
        query += ` and s.status in ('APPROVEDBYRA','APPROVEDBYRM','APPROVED') `;
      }else if (params.status == "SAVED") {
        query += ` and s.status in ('SAVED') `;
      } else if (params.status == "CREATED") {
        query += ` and s.status in ('CREATED') `;
      } else if (params.status == "POSTED") {
        query += ` and s.status in ('POSTED','PAID') `;
      } else if (params.status == "PAID") {
        query += ` and s.status in ('PAID','POSTED') `;
      }
    }
    if (params.inventlocationid == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and s.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` and s.inventlocationid='${params.inventlocationid}' `;
    }
    // if (params.status && params.status != "ALL") {
    //   query += ` and  s.status = '${params.status}' `;
    // }
    if (params.accountnum) {
      query += ` and s.custaccount = '${params.accountnum}'`;
    }
    return await this.db.query(query);
  }
}
