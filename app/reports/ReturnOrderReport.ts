import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import { DesignerserviceRepository } from "../repos/DesignerserviceRepository";
import { SalesLine } from "../../entities/SalesLine";
import { getConnection } from "typeorm";

export class ReturnOrderReport {
  public sessionInfo: any;
  rawQuery: RawQuery;
  private db: any;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  private salesLineDAO: SalesLineDAO;
  private designerServiceDAO: DesignerserviceRepository;
  constructor() {
    this.db = getManager();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.designerServiceDAO = new DesignerserviceRepository();
    this.updateInventoryService = new UpdateInventoryService();
    this.salesLineDAO = new SalesLineDAO();
  }

  async execute(params: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let data: any = await this.query_to_data(params);
      data = data.length > 0 ? data[0] : {};
      data.originalPrinted = data.originalPrinted == null ? false : data.originalPrinted;
      data.vatAmount = Math.round(parseFloat((data.vatAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
      data.ReturnDate = new Date(data.ReturnDate).toLocaleDateString();
      if (data.originalPrinted) {
        data.isCopy = true;
      } else {
        data.isCopy = false;
      }

      let batches = await this.batches_data_to_query(params);
      let result: any = this.groupBy(batches, function (item: any) {
        return [item.itemid, item.batchno, item.configid, item.inventsizeid];
      });
      let new_data: any = [];
      result.forEach(function (groupitem: any) {
        const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
        if (qty > 0) {
          groupitem[0].qty = Math.abs(qty);
          groupitem[0].returnQuantity = 0;
          new_data.push({ ...groupitem[0] });
        }
      });
      let i = 1;
      new_data.forEach((element: any) => {
        element.sNo = i;
        element.price = Math.round(parseFloat((element.price * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
        element.lineAmount =
          Math.round(parseFloat((element.lineAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
        i++;
      });
      data.batches = new_data;
      this.db.query(` update inventtrans set transactionclosed = true where invoiceid='${params.salesId}'`);
      if (data.status != "POSTED") {
        await this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
        let batches: any = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
        for (let item of batches) {
          item.transactionClosed = true;
          // this.inventTransDAO.save(item);
          this.updateInventoryService.updateInventtransTable(item, false, true, queryRunner);
        }
        await this.updateSalesLineData(params.salesId);
        if (data.designServiceRedeemAmount > 0) {
          await this.updateDesignerServiceForCustomer(data);
        }
      }
      let salesLine: any = await this.salesline_query_to_data(params);
      //------implemented for the serial number by: sattar-----/
      let sNo = 1;
      data.vat = salesLine.length > 0 ? salesLine[0].vat : "-";
      salesLine.map((val: any) => {
        val.sNo = sNo;
        sNo += 1;
      });
      //--------------------End-------------------//

      data.salesLine = salesLine;
      data.quantity = 0;
      data.salesLine.map((v: any) => {
        data.quantity += parseInt(v.salesQty);
      });

      // console.log(data);

      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  groupBy(array: any, f: any) {
    let groups: any = {};
    array.forEach(function (o: any) {
      let group: any = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }

  async updateSalesLineData(returnOrderId: any) {
    let returnOrderlLinesQuery: string = `select 
                                                s.intercompanyoriginalsalesid as salesorderid, 
                                                sl.lineamount as lineamount, 
                                                sl.colorantprice colorantprice,
                                                sl.salesqty as salesqty, 
                                                sl.itemid as itemid, 
                                                sl.configid as configid, 
                                                sl.inventsizeid as inventsizeid, 
                                                sl.linetotaldisc as linetotaldisc, 
                                                sl.vatamount as vatamount,
                                                sl.is_item_free as isitemfree,
                                                sl.applied_discounts as applied_discounts,
                                                sl.remainsalesfinancial as remainsalesfinancial
                                                from salesline sl
                                                inner join salestable s on s.salesid = sl.salesid 
                                                where sl.salesid= '${returnOrderId}'
                                                `;
    let returnOrderLines: any = await this.db.query(returnOrderlLinesQuery);

    for (let v of returnOrderLines) {
      // console.log("==================",v)
      let salesline: any = await this.salesLineDAO.findOne({
        isItemFree: v.isitemfree,
        itemid: v.itemid,
        configId: v.configid,
        inventsizeid: v.inventsizeid,
        salesId: v.salesorderid,
      });
      // console.log(salesline);

      salesline.totalReturnedQuantity = parseInt(salesline.totalReturnedQuantity) + parseInt(v.salesqty);
      salesline.totalSettledAmount =
        parseFloat(salesline.totalSettledAmount) +
        parseFloat(v.lineamount) -
        parseFloat(v.linetotaldisc) +
        parseFloat(v.vatamount);
      salesline.lastModifiedDate = new Date();
      salesline.remainSalesFinancial = salesline.remainSalesFinancial
        ? parseInt(salesline.remainSalesFinancial) + parseInt(v.remainsalesfinancial)
        : parseInt(v.remainsalesfinancial);
      await this.salesLineDAO.save(salesline);
    }
  }

  async updateDesignerServiceForCustomer(reqData: any) {
    let designerData: any = await this.db.query(
      ` select * from designerservice where salesorderid = '${reqData.salesOrderId}' `
    );
    designerData = designerData.length > 0 ? designerData[0] : {};
    let designerServiceData: any = {
      custphone: reqData.phone,
      amount: reqData.designServiceRedeemAmount,
      invoiceid: designerData.invoiceid,
      salesorderid: reqData.salesId,
      dataareaid: reqData.dataareaid,
      recordtype: 0,
      settle: 0,
      selectedforsettle: 0,
      createdby: reqData.createdBy,
      createddatetime: new Date(App.DateNow()),
      lastmodifiedby: reqData.createdBy,
      lastmodifieddate: new Date(App.DateNow()),
      customer: {
        accountnum: reqData.invoiceAccount,
      },
    };
    await this.designerServiceDAO.save(designerServiceData);
  }

  async report(result: any, params: any) {
    let renderData: any;

    renderData = result;
    let file = params.lang == "en" ? "ro-en" : "ro-ar";
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
                S.invoiceaccount as "invoiceAccount",
                s.createddatetime as "createdDateTime",
                s.lastmodifieddate as "ReturnDate",
                s.lastmodifieddate as "lastModifiedDate",
                s.status as status,
                als.en as "statusEn",
                als.ar as "statusAr",
                alt.en as "transkindEn",
                alt.ar as "transkindAr",
                s.salesname as name,
                to_char(s.disc, 'FM999999999990.00')  as discount,
                s.mobileno as phone,
                to_char(s.amount , 'FM999999999990.00') as "grossAmount",
                to_char(s.netamount, 'FM999999999990.00') as "netAmount",
                to_char(s.vatamount,  'FM999999999990.00') as "vatAmount",
                to_char(s.cash_amount, 'FM999999999990.00') as "cashAmount",
                to_char(s.card_amount, 'FM999999999990.00') as "cardAmount",
                to_char(s.online_amount, 'FM999999999990.00') as "onlineAmount",
                to_char(s.design_service_redeem_amount, 'FM999999999990.00') as "designServiceRedeemAmount",
                to_char(s.redeemptsamt, 'FM999999999990.00') as "redeemAmount",
                s.originalprinted as "originalPrinted",
                s.createdby as "createdBy",
                s.intercompanyoriginalsalesid as "salesOrderId",
                s.description as notes,
                w.name as "wareHouseNameAr",
                w.namealias as "wareHouseNameEn",
                d."description" as salesman,
                to_char(s.createddatetime, 'DD-MM-YYYY') as createddatetime
                from salestable s
                left join salesline sl on sl.salesid = s.salesid
                left join inventlocation w on w.inventlocationid=s.inventlocationid
                left join custtable c on c.accountnum=s.custaccount
                left join dimensions d on d.num = s.dimension6_
                left join app_lang als on als.id = s.status
                left join app_lang alt on alt.id = s.transkind
            where s.transkind = 'RETURNORDER' and s.salesid = '${params.salesId}' limit 1
            `;
    return await this.db.query(query);
  }
  async batches_data_to_query(params: any) {
    const batchesQuery = `select 
    distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
    i.itemid as itemid,
    bs.name_en as nameEn,
    bs.name_ar as nameAr,
    to_char(i.qty, 'FM999,999,999,999D') as qty,
    i.configid as configid,
    i.inventsizeid as inventsizeid,
    i.invoiceid as invoiceid,
    i.transrefid as transrefid,
    s.name_en as sizenameen,
    s.name_ar as sizenamear,
    i.batchno as batchno,
    b.expdate as batchExpDate,
    b.expdate as batchExpDate,
    sl.salesprice as price,
    sl.lineamount as "lineAmount",
    sl.vatamount as "vatAmount",
    sl.vat as vat
    from inventtrans  i
left join salesline sl on sl.id = i.sales_line_id
left join inventbatch b on i.batchno = b.inventbatchid
left join bases bs on i.itemid = bs.code
left join sizes s on s.code = i.inventsizeid
where   i.invoiceid = '${params.salesId}'`;
    return await this.db.query(batchesQuery);
  }

  async salesline_query_to_data(params: any) {
    let salesQuery = `
    select
    distinct
    ln.salesid,
    ln.itemid,
    ln.batchno,
    ln.configid,
    ln.inventsizeid,
    ln.saleslineqty,
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
      select distinct on (i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.qty, i.batchno, i.sales_line_id)
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
      
  where invoiceid='${params.salesId}'
  ) as ln order by linenum ASC
    
    `;
    return await this.db.query(salesQuery);
  }
}
