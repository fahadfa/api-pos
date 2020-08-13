import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { QuotationReport } from "./QuotationReport";
import { SalesTableDAO } from "../repos/SalesTableDAO";
import { RawQuery } from "../common/RawQuery";
import { CusttableDAO } from "../repos/CusttableDAO";
var QRCode = require("qrcode");

export class TransferOrderReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private quoatationReport: QuotationReport;
  public salestableDAO: SalesTableDAO;
  private rawQuery: RawQuery;
  private custtableDAO: CusttableDAO;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.quoatationReport = new QuotationReport();
    this.salesTableService = new SalesTableService();
    this.salestableDAO = new SalesTableDAO();
    this.rawQuery = new RawQuery();
    this.custtableDAO = new CusttableDAO();
  }

  async execute(params: any) {
    try {
      console.log("TransferOrderReport");
      let id = params.salesId;
      let status: string;
      let data: any = await this.query_to_data(id);
      data = data.length >= 0 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      let shipOrderData: any = await this.db.query(
        `select salesid, custaccount,transkind, inventlocationid from salestable where intercompanyoriginalsalesid = '${id}'`
      );

      console.log(shipOrderData);
      // shipOrderData = shipOrderData.length > 0 ? shipOrderData[0] : null
      if (data.status != "POSTED" && shipOrderData.length != 0) {
        this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
      }
      let salesLine: any = await this.salesline_query_to_data(id);
      // salesLine = salesLine.length > 0 ? salesLine : [];
      data.salesLine = salesLine;
      data.quantity = 0;
      data.salesLine.map((v: any) => {
        data.quantity += parseInt(v.salesQty);
      });
      // data.qr =  await QRCode.toDataURL(JSON.stringify(data));
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
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    console.log(params.lang);
    let file = params.lang == "en" ? "to-en" : "to-ar";
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
              als.en as "statusEn",
              als.ar as "statusAr",              
              alt.en as "transkindEn",
              alt.ar as "transkindAr", 
              st.transkind as transkind,
              st.vatamount as vatamount,
              st.netamount as "netAmount",
              st.disc as disc,
              st.description as notes,
              amount as amount,
              to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
              to_char(st.lastmodifieddate, 'DD-MM-YYYY') as lastmodifieddate,
              st.originalprinted as "originalPrinted",
              st.inventlocationid as "inventLocationId",
              fw.namealias as fwnamealias,
              fw.name as fwname,
              tw.namealias as twnamealias,
              tw.name as twname,
              st.intercompanyoriginalsalesId as "interCompanyOriginalSalesId"
            from salestable st 
              left join inventlocation fw on fw.inventlocationid = st.inventlocationid
              left join inventlocation tw on tw.inventlocationid = st.custaccount            
              left join app_lang als on als.id = st.status
              left join app_lang alt on alt.id = st.transkind
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
            select
            distinct on (ln.id)
            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As "sNo",
            ln.itemid as itemid,
            ln.inventsizeid as inventsizeid,
            ln.configid as configid,
            ln.colorantid,
            to_char(ln.salesqty,'FM999,999,999,999D') as "salesQty",
            b.itemname as "prodNameAr",
            b.namealias as "prodNameEn",
            c.name as "colNameAr",
            c.name as "colNameEn",
            s.description as "sizeNameEn",
            s.name as "sizeNameAr"
            from salesline ln
            inner join inventtable b on b.itemid = ln.itemid
            inner join configtable c on c.configid = ln.configid and c.itemid = ln.itemid
            inner join inventsize s on s.inventsizeid=ln.inventsizeid and s.itemid = ln.itemid
            where ln.salesid = '${id}'
            `;
    return await this.db.query(salesQuery);
  }
}
