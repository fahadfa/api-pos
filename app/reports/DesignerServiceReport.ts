import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class DesignerServiceReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private rawQuery: RawQuery;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
  }

  async execute(params: any) {
    try {
      let id = params.salesId;
      let status: string;
      let data: any = await this.salestable_query_to_data(id);
      data = data.length >= 1 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      await this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
      let salesLine: any = await this.salesline_query_to_data(id);
      // salesLine = salesLine.length > 0 ? salesLine : [];
      data.salesLine = salesLine;
      data.quantity = 0;
      data.salesLine.map((v: any) => {
        data.quantity += parseInt(v.salesQty);
      });

      console.log(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any;

    renderData = result;
    let file = params.lang == "en" ? "designer-service-en" : "designer-service-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async salestable_query_to_data(id: any) {
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
    to_char(st.vatamount, 'FM999999999990.00')  as vatamount,
    to_char(st.netamount, 'FM999999999990.00')  as "netAmount",
    to_char(coalesce(st.disc, 0), 'FM999999999990.00')  as disc,
    to_char(st.amount , 'FM999999999990.00') as amount,
    c.name as cname,
    c.namealias as "cnamealias",
    c.phone as "cphone",
    to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
    st.originalprinted as "originalPrinted",
    st.inventlocationid as "inventLocationId",
    w.namealias as wnamealias,
    w.name as wname,
    coalesce(st.deliveryaddress, ' ') || (' ') || coalesce(st.citycode, ' ') || (' ') || coalesce(st.districtcode, ' ') || (' ') || coalesce(st.country_code, ' ') as deliveryaddress,
    d."name" as salesman,
    to_char(st.deliverydate, 'DD-MM-YYYY') as "deliveryDate"
    from salestable st 
    left join inventlocation w on w.inventlocationid = st.inventlocationid
    left join custtable c on c.accountnum = st.custaccount
    left join dimensions d on d.num = st.dimension6_
    left join app_lang als on als.id = st.status
    left join app_lang alt on alt.id = st.transkind
    where salesid='${id}'
    `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
            select
            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As "sNo",
            ln.itemid as itemid,
            cast(ln.salesqty as INTEGER) as "salesQty",
            ln.configid as configid,
            to_char(ln.salesprice , 'FM999,999,999,990D00') as salesprice,
            to_char(ln.linetotaldisc , 'FM999,999,999,990D00') as "lineTotalDisc",
            to_char(ln.vat , 'FM999,999,999,990D00') as vat,
            to_char(ln.vatamount, 'FM999,999,990d00') as "vatAmount",
            to_char(ln.salesprice- ln.linetotaldisc +ln.vatamount, 'FM999,999,999,990D00') as "lineAmount",
            to_char(ln.salesprice- ln.linetotaldisc, 'FM999,999,999,990D00') as "lineAmountBeforeVat",
            dp.name_en as inventsizeid
            from salesline ln
            left join designer_products dp on dp.code = ln.itemid
            where ln.salesid='${id}'
            `;
    return await this.db.query(salesQuery);
  }
}
