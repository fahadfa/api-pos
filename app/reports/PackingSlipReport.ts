import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class PackingSlipReport {
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
      let data: any = await this.query_to_data(id);
      data = data.length >= 1 ? data[0] : {};
      if (!data.documentStatus) {
        data.documentStatus = data.documentStatus ? data.documentStatus : false;
        this.rawQuery.updateDocumentStatus(params.salesId.toUpperCase());
      }
      let salesLine: any = await this.salesline_query_to_data(id);
      data.salesLine = salesLine;
      // data.quantity = 0;
      // data.salesLine.map((v: any) => {
      //   data.quantity += parseInt(v.salesQty);
      //   v.colorantid = v.colorantid ? v.colorantid : "-";
      // });

      // console.log("----------------------------");
      // console.log(data);
      // console.log("----------------------------");
      // console.log(salesLine)
      // salesLine = salesLine.length > 0 ? salesLine : [];
      let list: any[] = [];
      let j = 0;
      let chunkArray: any[] = await this.chunkArray(salesLine, 12);
      list = list.concat(chunkArray);
      let newSalesline: any[] = [];
      let sNo = 1;
      let quantity = 0;
      list.map((val: any) => {
        val.colorantid = val.colorantid ? val.colorantid : "-";
        let lines: any = {
          amount: parseFloat(data.amount).toFixed(2),
          quantity: 0,
          vatamount: parseFloat(data.vatAmount).toFixed(2),
          page: 1,
          totalPages: list.length,
          voucherdiscchecked: data.voucherdiscchecked,

          salesId: data.salesId,
          custAccount: data.custAccount,
          status: data.status,
          transkind: data.transkind,
          customername: data.customername,
          custmobilenumber: data.custmobilenumber,
          cname: data.cname,
          cnamealias: data.cnamealias,
          cphone: data.cphone,
          createddatetime: data.createddatetime,
          lastmodifieddate: data.lastmodifieddate,
          originalPrinted: data.originalPrinted,
          inventLocationId: data.inventLocationId,
          wnamealias: data.wnamealias,
          wname: data.wname,
          createdby: data.createdby,
          deliveryaddress: data.deliveryaddress,
          salesman: data.salesman,
          notes: data.notes,
          deliveryDate: data.deliveryDate,
          isbreak: data.isbreak,
          vatGrand: data.vatamount,
          paymentType: data.paymentType,
          paymentMode: data.paymentType == "ONLINE" ? "Online" : data.paymentMode,
          paymentModeAr: data.paymentType == "ONLINE" ? "عبر الانترنت" : data.paymentMode,
          lines: [],
        };

        data.isbreak = val.length > 5 ? true : false;

        val.map((v: any) => {
          lines.quantity += parseInt(v.salesQty);
          v.colorantid = v.colorantid;
          v.sNo = sNo;
          lines.lines.push(v);
          sNo += 1;
        });
        lines.page = list.indexOf(val) + 1;
        lines.quantity = lines.quantity + quantity;
        quantity = lines.quantity;
        newSalesline.push(lines);
      });

      data.salesLine = newSalesline;
      data.quantity = 0;
      data.salesLine.map((v: any) => {
        data.quantity += parseInt(v.quantity);
      });
      console.log("----------------------------");
      // console.log(data);
      console.log("----------------------------");
      // console.log(salesLine);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any;

    renderData = result;
    let file = params.lang == "en" ? "packing-slip-en" : "packing-slip-ar";
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
            als.en as "statusEn",
            als.ar as "statusAr",
            alt.en as "transkindEn",
            alt.ar as "transkindAr",
            to_char(st.vatamount, 'FM999999999990.00')  as vatamount,
            to_char(st.netamount, 'FM999999999990.00')  as "netAmount",
            to_char(st.disc, 'FM999999999990.00')  as disc,
            to_char(st.amount , 'FM999999999990.00') as amount,
            st.salesname as cname,
            st.salesname as "cnamealias",
            st.mobileno as "cphone",
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.originalprinted as "originalPrinted",
            st.documentstatus as "documentStatus",
            st.inventlocationid as "inventLocationId",
            st.createdby as createdby,
            st.description as notes,
            w.namealias as wnamealias,
            w.name as wname,
            coalesce(st.deliveryaddress, ' ') || (' ') || coalesce(st.citycode, ' ') || (' ') || coalesce(st.districtcode, ' ') || (' ') || coalesce(st.country_code, ' ') as deliveryaddress,
            concat(d.num,' - ', d.description) as salesman,
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
            ln.salesid,
            ln.itemid,
            ln.batchno,
            ln.colorantid,
            ln.configid,
            ln.inventsizeid,
            to_char(ln.salesqty, 'FM999999999') as "salesQty",
            to_char(ln.salesprice, 'FM999999999990.00') as salesprice,
            to_char(ln.vatamount, 'FM999999999990.00') as "vatAmount",
            to_char((ln.linetotaldisc/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as "lineTotalDisc",
            to_char(ln.colorantprice, 'FM999999999990.00') as colorantprice,
            to_char(((ln.salesprice + ln.colorantprice) 
            + (ln.vatamount) - ((ln.linetotaldisc/ln.saleslineqty)*ln.salesqty)) 
            , 'FM999999999990.00') as "lineAmount",
            ln.prodnamear as "prodNameAr",
            ln.prodnameen as "prodNameEn",
            ln.colNameAr as "colNameAr",
            ln.colNameEn as "colNameEn",
            ln.sizeNameEn as "sizeNameEn",
            ln.sizeNameAr as "sizeNameAr",
            to_char((ln.lineamount - (ln.linetotaldisc/ln.saleslineqty)*ln.salesqty), 'FM999999999990.00') as "lineAmountBeforeVat",
            ln.vat as vat
            from
            (
              select
                distinct on (i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
                i.invoiceid as salesid,
                i.batchno,
                i.itemid,
                i.configid,
                i.inventsizeid,
                st.status as status,
                ABS(i.qty) as salesqty,
                b.itemname as prodnamear,
                b.namealias as prodnameen,
                coalesce(sl.salesprice, 0)  as salesprice,
                coalesce(sl.vatamount, 0)  as vatamount,
                coalesce(sl.linetotaldisc, 0) as linetotaldisc,
                coalesce(sl.colorantprice,0) as colorantprice,
                c.name as colNameAr,
                c.name as colNameEn,
                s.description as sizeNameEn,
                s.name as sizeNameAr,
                sl.lineamount + (sl.colorantprice * sl.salesqty) as  lineamount,
                (
                  CASE
                      WHEN sl.colorantid IS NULL THEN 'N/A'
                      ELSE sl.colorantid
                      END
                ) as colorantid,
                sl.salesqty as saleslineqty,
                sl.vat as vat,
                sl.linenum
                from inventtrans i
                left join salestable st on st.salesid = i.invoiceid
                left join salesline sl on sl.id = i.sales_line_id
                left join inventtable b on i.itemid=b.itemid
                left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid
                left join configtable c on c.configid = i.configid and c.itemid = i.itemid
            where invoiceid='${id}'
            ) as ln
            `;
    return await this.db.query(salesQuery);
  }
  async chunkArray(myArray: any, chunk_size: number) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return await tempArray;
  }
}
