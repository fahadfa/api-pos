import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class SalesOrderReport {
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
      let data: any = await this.query_to_data(id);
      data = data.length >= 1 ? data[0] : {};
      data.paymentMode = data.paymentType == "ONLINE" ? "Online" : data.paymentMode;
      data.paymentModeAr = data.paymentType == "ONLINE" ? "عبر الانترنت" : data.paymentMode;
      console.log(data);
      data.lastmodifieddate = App.convertUTCDateToLocalDate(
        new Date(data.lastmodifieddate),
        parseInt(params.timeZoneOffSet)
      ).toLocaleString();

      if (data.paymentMode != "CASH" && data.paymentMode != "ONLINE") {
        if (data.iscash) {
          data.paymentMode = "Cash";
          data.paymentModeAr = "السيولة النقدية";
        } else {
          data.paymentMode = "Credit";
          data.paymentModeAr = "ائتمان";
        }
      }
      if (data.paymentMode == "CASH") {
        data.paymentMode = "Cash";
        data.paymentModeAr = "السيولة النقدية";
      }
      data.twoCopies = data.originalPrinted ? false : true;
      // console.log(data.status);
      if (data.status != "RESERVED") {
        data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
        if (data.originalPrinted == false) {
          this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "PAID", new Date().toISOString());
        }
      }
      let salesLine: any = await this.salesline_query_to_data(id);
      // console.log(salesLine)
      // salesLine = salesLine.length > 0 ? salesLine : [];
      let list: any[] = [];
      let j = 0;
      // list.push(salesLine.slice(0, 4));
      // console.log(list)
      let chunkArray: any[] = await this.chunkArray(salesLine, 12);
      // console.log(chunkArray)
      list = list.concat(chunkArray);
      // console.log(list);
      let newSalesline: any[] = [];
      let sNo = 1;
      let quantity = 0;
      if (params.type != "mobile") {
        list.map((val: any) => {
          data.vat = val.length > 0 ? val[0].vat : "-";
          val.colorant = val.colorant ? val.colorant : "-";
          let lines: any = {
            amount: parseFloat(data.amount).toFixed(2),
            quantity: 0,
            netAmount: parseFloat(data.netAmount).toFixed(2),
            disc: parseFloat(data.disc).toFixed(2),
            vatamount: parseFloat(data.vatAmount).toFixed(2),
            shippingamount: parseFloat(data.shippingAmount).toFixed(2),
            page: 1,
            totalPages: list.length,
            voucherdiscchecked: data.voucherdiscchecked,
            vouchernum: data.vouchernum,
            salesId: data.salesId,
            custAccount: data.custAccount,
            interCompanyOriginalSalesId: data.interCompanyOriginalSalesId,
            status: data.status,
            transkind: data.transkind,
            customername: data.customername,
            custmobilenumber: data.custmobilenumber,
            cname: data.cname,
            cnamealias: data.cnamealias,
            invoiceAccount: data.invoiceAccount,
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
            vat: data.vat,
            paymentType: data.paymentType,
            shippedDate: data.lastmodifieddate.split(",")[0],
            paymentMode: data.paymentType == "ONLINE" ? "Online" : data.paymentMode,
            paymentModeAr: data.paymentType == "ONLINE" ? "عبر الانترنت" : data.paymentMode,
            cashAmount: data.cashAmount,
            cardAmount: data.cardAmount,
            designServiceRedeemAmount: data.designServiceRedeemAmount,
            redeemAmount: data.redeemAmount,
            lines: []
          };

          data.isbreak = val.length > 5 ? true : false;

          val.map((v: any) => {
            lines.quantity += parseInt(v.salesQty);
            v.colorantid = val.colorant;
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
        // data.salesLine.shippedDate = data.lastmodifieddate.split(",")[0];
        data.quantity = 0;
        data.salesLine.map((v: any) => {
          data.quantity += parseInt(v.quantity);
        });
        return data;
      } else {
        data.salesLine = salesLine;
        // data.salesLine.shippedDate = data.lastmodifieddate.split(",")[0];
        data.quantity = 0;
        data.salesLine.map((v: any) => {
          data.quantity += parseInt(v.salesQty);
        });
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any;

    renderData = result;
    console.log("data:----------", renderData);
    let file = params.lang == "en" ? "test-so-en" : "test-so-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
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
  async query_to_data(id: any) {
    let query = `
            select 
            st.salesid as "salesId",
            st.intercompanyoriginalsalesid as "interCompanyOriginalSalesId",
            st.custaccount as "custAccount",
            st.invoiceaccount as "invoiceAccount",
            st.status as status,
            st.transkind as transkind,
            st.salesname as customername,
            st.mobileno as custmobilenumber,
            to_char(st.vatamount, 'FM999999999990.00')  as vatamount,
            to_char(st.netamount, 'FM999999999990.00')  as "netAmount",
            to_char(st.disc, 'FM999999999990.00')  as disc,
            to_char(st.amount , 'FM999999999990.00') as amount,
            to_char(st.shipping_amount, 'FM999999999990.00') as "shippingAmount",
            st.salesname as cname,
            st.salesname as "cnamealias",
            st.voucherdiscchecked as "voucherdiscchecked",
            st.vouchernum as "vouchernum",
            st.payment_type as "paymentType",
            c.phone as "cphone",
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.lastmodifieddate as lastmodifieddate,
            st.originalprinted as "originalPrinted",
            st.inventlocationid as "inventLocationId",
            w.namealias as wnamealias,
            w.name as wname,
            st.payment as "paymentMode",
            st.iscash as iscash,
            st.createdby,
            st.description as notes,
            to_char(st.cash_amount, 'FM999999999990.00') as "cashAmount",
            to_char(st.card_amount, 'FM999999999990.00') as "cardAmount",
            st.shipping_amount as "shippingAmount",
            to_char(st.online_amount, 'FM999999999990.00') as "onlineAmount",
            to_char(st.design_service_redeem_amount, 'FM999999999990.00') as "designServiceRedeemAmount",
            to_char(st.redeemptsamt, 'FM999999999990.00') as "redeemAmount",
            coalesce(st.deliveryaddress, ' ') || (' ') || coalesce(st.citycode, ' ') || (' ') || coalesce(st.districtcode, ' ') || (' ') || coalesce(st.country_code, ' ') as deliveryaddress,
            concat(d.num,' - ', d.description) as salesman,
            to_char(st.deliverydate, 'DD-MM-YYYY') as "deliveryDate"
            from salestable st 
            left join dimensions d on st.dimension6_ = d.num
            left join inventlocation w on w.inventlocationid = st.inventlocationid
            left join custtable c on c.accountnum = st.custaccount
            left join paymterm p on p.paymtermid = st.payment
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
              select
              distinct
              ln.salesid,
              ln.itemid,
              ln.batchno,
              ln.configid,
              ln.inventsizeid,
              ln.saleslineqty,
              to_char(ln.lineamount, 'FM999999999990.00') as "netAmount",
              to_char(ln.lastmodifieddate, 'DD-MM-YYYY') as "shippingDate",
              to_char(ln.salesqty, 'FM999999999D') as "salesQty",
              to_char(ln.salesprice, 'FM999999999990.00') as salesprice,
              to_char((ln.vatamount/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as "vatAmount",
              to_char((ln.linetotaldisc/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as "lineTotalDisc",
              to_char(ln.colorantprice, 'FM999999999990.00') as colorantprice,
              to_char((ln.lineamount / ln.saleslineqty)*ln.salesqty + (ln.colorantprice*ln.salesqty) - (ln.linetotaldisc / ln.saleslineqty)*ln.salesqty + (ln.vatamount / ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as "lineAmount",
              ln.prodnamear as "prodNameAr",
              ln.prodnameen as "prodNameEn",
              ln.colNameAr as "colNameAr",
              ln.colNameEn as "colNameEn",
              ln.sizeNameEn as "sizeNameEn",
              ln.sizeNameAr as "sizeNameAr",
              to_char((ln.lineamount/ln.saleslineqty)*ln.salesqty + (ln.colorantprice*ln.salesqty) - (ln.linetotaldisc/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as "lineAmountBeforeVat",
              ln.vat as vat,
              ln.colorantid as colorant,
              ln.linenum as linenum
              from
              (
                select distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.qty, i.batchno, i.sales_line_id)
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
                coalesce(sl.lineamount,0) as  lineamount,
                sl.colorantid as  colorantid,
                sl.salesqty as saleslineqty,
                sl.vat as vat,
                sl.linenum,
                sl.lastmodifieddate
                from inventtrans i
                left join salestable st on st.salesid = i.invoiceid
                left join salesline sl on sl.id = i.sales_line_id
                left join inventtable b on i.itemid=b.itemid
                left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid
                left join configtable c on c.configid = i.configid and c.itemid = i.itemid
                
            where invoiceid='${id}'
            ) as ln order by linenum ASC
            `;
    return await this.db.query(salesQuery);
  }
}
