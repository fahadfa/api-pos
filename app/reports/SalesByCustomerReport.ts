import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { App } from "../../utils/App";
var moment = require("moment");
export class SalesByCustomerReport {
  private db: any;
  constructor() {
    this.db = getManager();
  }
  /**
   * data structure.
   {
      headers: {},
      data:[
        {
          salesgroup: {},
          salesdata: []
        }
      ]
    }
   * @param params 
   */
  async execute(params: any) {
    // console.log(params);
    let result: any = {};
    result.headers = {};
    result.data = [];
    let saleslist: any = { salesgroup: {}, salesdata: [] };

    let rows = await this.salesData(params);

// console.log("--------------sssss--------");
// console.log(params);
// console.log("------------sssss----------");

    if (rows && rows[0]) {
      result.headers.wnamealias = rows[0].wnamealias;
      result.headers.wname = rows[0].wname;
      result.headers.fromDate = params.fromDate;
      result.headers.toDate = params.toDate;
      result.headers.salesman = params.salesmanid ? rows[0].salesman : "ALL";
      // result.headers.printtime = moment().format("HH:mm:ss");
      // result.headers.printdate = moment().format("DD-MM-YY");
    }else{
      result.headers.wnamealias = params.inventlocationid;
      // result.headers.wname = params.viewType;
      result.headers.fromDate = params.fromDate;
      result.headers.toDate = params.toDate;
      result.headers.salesman = params.salesmanid ? rows[0].salesman : "ALL";
      // result.headers.printtime = moment().format("HH:mm:ss");
      // result.headers.printdate = moment().format("DD-MM-YY");
    }


    for (let item of rows) {
      saleslist = result.data.find((ele: any) => ele.salesgroup.salesman == item.salesman);
      if (saleslist) {
        this.updateAmount(saleslist, item);
        saleslist.salesdata.push(item);
      } else {
        saleslist = { salesgroup: {}, salesdata: [] };
        saleslist.salesgroup.salesman = item.salesman;
        saleslist.salesgroup.amount = 0;
        saleslist.salesgroup.netamount = 0;
        saleslist.salesgroup.vatamount = 0;
        saleslist.salesgroup.disc = 0;
        this.updateAmount(saleslist, item);
        saleslist.salesdata.push(item);
        result.data.push(saleslist);
      }
    }
    for (let saleslist of result.data) {
      saleslist.salesgroup.amount = Number(saleslist.salesgroup.amount).toFixed(2);
      saleslist.salesgroup.netamount = Number(saleslist.salesgroup.netamount).toFixed(2);
      saleslist.salesgroup.vatamount = Number(saleslist.salesgroup.vatamount).toFixed(2);
      saleslist.salesgroup.disc = Number(saleslist.salesgroup.disc).toFixed(2);
    }

    return result;
  }
  updateAmount(saleslist: any, item: any) {
    saleslist.salesgroup.amount += Number.parseFloat(item.amount);
    saleslist.salesgroup.netamount += Number.parseFloat(item.netamount);
    saleslist.salesgroup.vatamount += Number.parseFloat(item.vatamount);
    saleslist.salesgroup.disc += Number.parseFloat(item.disc);
  }
  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    renderData.printDate= new Date(params.printDate)
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "")
    console.log(params.lang);
    let file = params.lang == "en" ? "sales-by-customer-en" : "sales-by-customer-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }

  async salesData(params: any) {
    let sql = `
      select
        st.salesname as customername,
        als.en as "statusEn",
        als.ar as "statusAr",
        alt.en as "transkindEn",
        alt.ar as "transkindAr",
        to_char(sum(st.vatamount), 'FM999999999990.00') as vatamount,
        to_char(sum(st.netamount), 'FM999999999990.00') as "netamount",
        to_char(sum(st.disc), 'FM999999999990.00') as disc,
        to_char(sum(st.amount) , 'FM999999999990.00') as amount,
        w.namealias as wnamealias,
        w.name as wname,
        d.description as salesman
      from
        salestable st
      left join inventlocation w on
        w.inventlocationid = st.inventlocationid
      inner join dimensions d on
        d.num = st.dimension6_
      left join app_lang als on als.id = st.status
      left join app_lang alt on alt.id = st.transkind
      where
        1 = 1
        and st.status not in ('RESERVED')
        and st.lastmodifieddate between '${params.fromDate}' and ('${params.toDate}'::date + '2 day'::interval)
        and st.inventlocationid = '${params.inventlocationid}'
  `;
    if (params.salesmanid) {
      sql = sql + ` and d.num = '${params.salesmanid}' `;
    }
    sql =
      sql +
      ` 
    group by st.salesname, w.namealias, w.name, d.description, als.en, als.ar, alt.en, alt.ar 
    order by customername`;
    let rows = await this.db.query(sql);
    return rows;
  }
}
