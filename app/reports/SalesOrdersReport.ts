import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class SalesOrdersReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);

      data.map((v: any) => {
        v.paymentMode = v.paymentType == "ONLINE" ? "Online" : v.paymentMode;
        v.paymentTypeAr = v.paymentType == "ONLINE" ? "عبر الانترنت" : v.paymentMode;
        v.paymentMode = v.iscash ? "CASH" : v.paymtermid;
        v.paymentModeAr = v.iscash ? "السيولة النقدية" : v.paymtermid;
        v.grossAmount = v.grossAmount ? v.grossAmount : 0;
        v.discount = v.discount ? v.discount : 0;
        v.vatAmount = v.vatAmount ? v.vatAmount : 0;
        v.netAmount = v.netAmount ? v.netAmount : 0;
        v.lastmodifieddate = App.convertUTCDateToLocalDate(
          new Date(v.lastmodifieddate),
          parseInt(params.timeZoneOffSet)
        ).toLocaleString();
        v.phone = v.phone && v.phone != "null" ? v.phone : null;
      });

      let resData: any = {
        grossAmount: 0,
        discount: 0,
        vatAmount: 0,
        netAmount: 0,
        cashAmount: 0,
        cardAmount: 0,
        designServiceRedeemAmount: 0,
        redeemAmount: 0,
      };
      data.map((v: any) => {
        resData.grossAmount += parseFloat(v.grossAmount);
        resData.discount += parseFloat(v.discount);
        resData.vatAmount += parseFloat(v.vatAmount);
        resData.netAmount += parseFloat(v.netAmount);
      });

      resData.grossAmount = resData.grossAmount.toFixed(2);
      resData.discount = resData.discount.toFixed(2);
      resData.vatAmount = resData.vatAmount.toFixed(2);
      resData.netAmount = resData.netAmount.toFixed(2);

      resData.cashAmount = resData.cashAmount.toFixed(2);
      resData.cardAmount = resData.cardAmount.toFixed(2);
      resData.designServiceRedeemAmount = resData.designServiceRedeemAmount.toFixed(2);
      resData.redeemAmount = resData.redeemAmount.toFixed(2);

      // console.log("salesorders  ", data);
      resData.data = data;
      return resData;
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
    (result.printDate = new Date().toLocaleString()),
      (result.fromDate = params.fromDate),
      (result.toDate = params.toDate),
      // (result.status = params.status),
      (result.status = "");
    if (params.status != "ALL") {
      if (params.status == "RESERVED") {
        result.status += "RESERVED";
      } else if (params.status == "SAVED") {
        result.status += "SAVED";
      } else if (params.status == "CREATED") {
        result.status += "CREATED";
      } else if (params.status == "POSTED") {
        result.status += "POSTED/PAID";
      } else if (params.status == "PAID") {
        result.status += "PAID/POSTED";
      }
    }
    result.user = params.user;
    // renderData.total = 0;
    (result.printDate = new Date(params.printDate)
      .toISOString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "")),
      console.log(params.lang);
    console.log(result);

    // console.log(result.salesLine[0].product.nameEnglish);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "salesorder-excel" : "salesorder-excel-ar";
    } else {
      file = params.lang == "en" ? "salesorder-report" : "salesorder-report-ar";
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
              s.salesid as "salesId",
              s.dimension6_ as "salesManId",
              s.inventlocationid as "fromWareHouse",
              s.custaccount as "custaccount",
              to_char(s.createddatetime, 'DD-MM-YYYY') as "createddatetime",
              s.lastmodifieddate as "lastmodifieddate",
              s.status as status,              
              als.en as "statusEn",
              als.ar as "statusAr",              
              alt.en as "transkindEn",
              alt.ar as "transkindAr",
              to_char(s.disc , 'FM999999999990.00') as discount,
              s.salesname as name,
              s.salesname as "nameAlias",
              to_char(s.amount , 'FM999999999990.00') as "grossAmount",
              to_char(s.netamount , 'FM999999999990.00') as "netAmount",
              to_char(s.vatamount , 'FM999999999990.00') as "vatAmount",
              w.name as "wareHouseNameAr",
              w.namealias as "wareHouseNameEn",
              s.payment as "paymentMode",
              alp.en as "paymentModeEn",
            	alp.ar as "paymentModeAr",              
              c.walkincustomer as "walkincustomer",
              s.mobileno as phone,
              s.createddatetime,
              s.iscash,
              c.paymtermid,
              s.transkind as type,
              s.payment_type as "paymentType",
              s.voucherdiscchecked as "voucherdiscchecked",
              s.vouchernum as "vouchernum",
              s.cash_amount as "cashAmount",
              s.card_amount as "cardAmount",
              s.shipping_amount as "shippingAmount",
              s.online_amount as "onlineAmount",
              s.redeemptsamt as "redeemAmount",
              s.design_service_redeem_amount as "designServiceRedeemAmount",
              coalesce(s.deliveryaddress, '') || coalesce(s.citycode, '') || coalesce(s.districtcode, '') || coalesce(s.country_code, '') as deliveryaddress,
              concat(d.num,' - ', d.description) as salesman
            from salestable s
              left join inventlocation w on w.inventlocationid=s.inventlocationid
              left join custtable c on c.accountnum=s.custaccount
              left join app_lang als on als.id = s.status
              left join app_lang alt on alt.id = s.transkind
              left join app_lang alp on alp.id = s.payment
              left join dimensions d on s.dimension6_ = d.num
            where s.transkind in ('SALESORDER', 'DESIGNERSERVICE')
            and s.lastmodifieddate >= '${params.fromDate}' ::date
            AND  s.lastmodifieddate < ('${params.toDate}' ::date + '1 day'::interval) 
            `;
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

    if (params.status != "ALL") {
      if (params.status == "RESERVED") {
        query += ` and s.status in ('RESERVED') `;
      } else if (params.status == "SAVED") {
        query += ` and s.status in ('SAVED') `;
      } else if (params.status == "CREATED") {
        query += ` and s.status in ('CREATED') `;
      } else if (params.status == "POSTED") {
        query += ` and s.status in ('POSTED','PAID') `;
      } else if (params.status == "PAID") {
        query += ` and s.status in ('PAID','POSTED') `;
      }
    }

    if (params.paymentMode != "ALL") {
      if (params.paymentMode == "CASH") {
        query += ` and (s.iscash = true or c.paymtermid = 'CASH') `;
      } else if (params.paymentMode == "CREDIT") {
        query += ` and s.iscash != true and c.paymtermid != 'CASH' `;
      }
    }
    if (params.accountnum) {
      query += ` and (s.custaccount = '${params.accountnum}' or s.mobileno ='${params.accountnum}' or s.invoiceaccount='${params.accountnum}') `;
    }
    query += ` order by s.createddatetime ASC`;

    return await this.db.query(query);
  }
}
