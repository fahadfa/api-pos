import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { SalesTableDAO } from "../repos/SalesTableDAO";
import { RawQuery } from "../common/RawQuery";
import { CusttableDAO } from "../repos/CusttableDAO";

export class QuotationReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  public salestableDAO: SalesTableDAO;
  private rawQuery: RawQuery;
  private custtableDAO: CusttableDAO;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.salestableDAO = new SalesTableDAO();
    this.rawQuery = new RawQuery();
    this.custtableDAO = new CusttableDAO();
  }

  async execute(params: any) {
    try {
      let id = params.salesId;
      let status: string;
      let data: any = await this.query_to_data(id);
      data = data.length >= 1 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      if (data.originalPrinted && data.status == "CONVERTED") {
        status = "CONVERTED";
        await this.rawQuery.updateSalesTable(id.toUpperCase(), status);
        data.isCopy = true;
      } else if (data.originalPrinted && data.status == "CREATED") {
        status = "POSTED";
        await this.rawQuery.updateSalesTable(id.toUpperCase(), status);
        data.isCopy = true;
      } else if (data.originalPrinted == false && data.status == "CONVERTED") {
        status = "CONVERTED";
        await this.rawQuery.updateSalesTable(id.toUpperCase(), status);
        data.isCopy = false;
      } else if (data.originalPrinted == false && data.status == "CREATED") {
        status = "POSTED";
        await this.rawQuery.updateSalesTable(id.toUpperCase(), status, new Date().toISOString());
        data.isCopy = true;
      } else if (data.status == "SAVED") {
        status = "POSTED";
        await this.rawQuery.updateSalesTable(id.toUpperCase(), status, new Date().toISOString());
        data.isCopy = true;
      }
      let salesLine: any = await this.salesline_query_to_data(id);
      data.vat = salesLine.length > 0 ? salesLine[0].vat : "-";
      data.salesLine = salesLine;
      data.quantity = 0;
      let i = 1;
      data.salesLine.map((v: any) => {
        v.sNo = i;
        i += 1;
        data.quantity += parseInt(v.salesQty);
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    console.log(params.lang);
    let file = params.lang == "en" ? "sq-en" : "sq-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(id: any) {
    let query = `
            select 
            st.salesid as "salesId",
            st.custaccount as "custAccount",
            st.status as status,
            st.transkind as transkind,
            st.salesname as customername,
            st.mobileno as custmobilenumber,
            to_char(st.vatamount, 'FM999999999990.00')  as vatamount,
            to_char(st.netamount, 'FM999999999990.00')  as "netAmount",
            to_char(st.disc, 'FM999999999990.00')  as disc,
            to_char(st.amount , 'FM999999999990.00') as amount,
            st.createdby as "createdBy",
            c.name as cname,
            c.namealias as "cnamealias",
            c.phone as "cphone",
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.originalprinted as "originalPrinted",
            st.inventlocationid as "inventLocationId",
            w.namealias as wnamealias,
            w.name as wname,
            concat(d.num,' - ', d.description) as salesman
            from salestable st 
            left join dimensions d on st.dimension6_ = d.num
            left join inventlocation w on w.inventlocationid = st.inventlocationid
            left join custtable c on c.accountnum = st.custaccount
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
            select
            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As "sNo",
            ln.itemid as itemid,
            ln.inventsizeid as inventsizeid,
            ln.configid as configid,
            to_char(ln.salesqty, 'FM999,999,999D') as "salesQty",
            to_char(ln.salesprice, 'FM999999999990.00') as salesprice,
            ln.vat as vat,
            to_char(ln.vatamount, 'FM999999999990.00') as "vatAmount",
            to_char(ln.linetotaldisc, 'FM999999999990.00') as "lineTotalDisc",
            to_char(ln.colorantprice, 'FM999999999990.00') as colorantprice,
            to_char((ln.salesprice * ln.salesqty) + (ln.colorantprice  * ln.salesqty) + ln.vatamount - ln.linetotaldisc, 'FM999999999990.00') as "lineAmount",
            b.itemname as "prodNameAr",
            b.namealias as "prodNameEn",
            c."name" as "colNameAr",
            c."name" as "colNameEn",
            s.description as "sizeNameEn",
            s."name" as "sizeNameAr",
            to_char(coalesce(ln.lineamount,0) - coalesce(ln.linetotaldisc,0)+  coalesce(ln.colorantprice * ln.salesqty,0), 'FM999999999990.00') as "lineAmountBeforeVat",
            ln.vat as vat,
            ln.colorantid as colorant,
            ln.linenum as linenum
            from salesline ln
            inner join inventtable b on b.itemid = ln.itemid
            inner join configtable c on c.configid = ln.configid and c.itemid = ln.itemid
            inner join inventsize s on s.inventsizeid=ln.inventsizeid and s.itemid = ln.itemid 
            where ln.salesid = '${id}'
            `;
    return await this.db.query(salesQuery);
  }
}
