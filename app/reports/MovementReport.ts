import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { WorkflowService } from "../services/WorkflowService";
import { getConnection } from "typeorm";

export class MovementReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private rawQuery: RawQuery;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  private workflowService: WorkflowService;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
    this.workflowService = new WorkflowService();
  }

  async execute(params: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let id = params.salesId;
      let status: string;
      let data: any = await this.query_to_data(id);
      data = data.length > 0 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;

      let salesLine: any = await this.salesline_query_to_data(id);
      // salesLine = salesLine.length > 0 ? salesLine : [];
      data.salesLine = salesLine;
      data.quantity = 0;
      data.salesLine.map((v: any) => {
        data.quantity += parseInt(v.salesQty);
      });
      // console.log("===================dffhsafyrkfhiufghllgsh================");
      // if (!data.originalPrinted) {
      if (data.status != "POSTED") {
        let date = new Date().toISOString();
        let query = `UPDATE salestable SET originalprinted = '${true}', status = 'POSTED'`;
        if (date) {
          query += `,lastmodifieddate = '${date}' `;
        }
        query += ` WHERE salesid = '${params.salesId.toUpperCase()}'`;
        await queryRunner.query(query);
        if (data.voucherDiscChecked) {
          let voucherData: any = {
            salesId: data.salesId,
            voucherNum: data.voucherNum,
            custAccount: data.invoiceAccount,
          };
          let query = `
          UPDATE discountvoucher
          SET  salesid='${voucherData.salesId}',
          is_used=0, 
          used_numbers=used_numbers+1
          WHERE voucher_num='${voucherData.voucherNum}';
          `;
          await queryRunner.query(query);
        }
        // this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
        let promiseList: any[] = [];
        if (data.transkind == "INVENTORYMOVEMENT") {
          let reqData = {
            salesId: id,
          };
          await this.workflowService.inventryTransUpdate(reqData);
          // console.log("===================dffhsafyrkfhiufghllgsh================");
          let batches: any[] = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
          console.log(batches);
          let groupData: any[] = await this.groupBy(batches, function (item: any) {
            return [item.itemid, item.batchno, item.configid, item.inventsizeid];
          });
          console.log(groupData);
          let inventoryOnHandBatches: any[] = [];
          groupData.forEach(function (groupitem: any) {
            const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
            groupitem[0].qty = qty;
            inventoryOnHandBatches.push({ ...groupitem[0] });
          });
          for (let item of batches) {
            item.transactionClosed = true;
            // this.inventTransDAO.save(item);
            promiseList.push(this.updateInventoryService.updateInventtransTable(item, false, false, queryRunner));
          }
          for (let item of inventoryOnHandBatches) {
            item.transactionClosed = true;
            // this.inventTransDAO.save(item);
            promiseList.push(this.updateInventoryService.updateInventoryOnhandTable(item, false, queryRunner));
          }
        }
        await Promise.all(promiseList);
      }
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

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    console.log(params.lang);
    let file = params.lang == "en" ? "mo-en" : "mo-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
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
            st.vatamount as vatamount,
            st.netamount as "netAmount",
            st.disc as disc,
            st.salesname as "salesName",
            st.is_movement_in as "isMovementIn",
            st.createdby as createdby,
            st.amount as amount,
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.originalprinted as "originalPrinted",
            st.inventlocationid as "inventLocationId",
            st.description as notes,
            w.namealias as wnamealias,
            w.name as wname,
            st.voucherdiscchecked as "voucherDiscChecked",
            st.vouchernum as "voucherNum",
            st.invoiceaccount as "invoiceAccount",
            mt.movementtype as "movementType",
            mt.movementarabic as "movementTypeAr"
            from salestable st 
            left join inventlocation w on w.inventlocationid = st.inventlocationid
            left join movementtype mt on mt.id = st.movement_type_id
            left join app_lang als on als.id = st.status
            left join app_lang alt on alt.id = st.transkind
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
    select
    distinct
    ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As "sNo",
    ln.salesid,
    ln.itemid,
    ln.batchno,
    ln.configid,
    ln.inventsizeid,
    to_char(ln.salesqty, 'FM999,999,999,990D') as "salesQty",
    to_char(ln.salesprice, 'FFM999999999990.00') as salesprice,
    to_char(ln.vatamount, 'FFM999999999990.00') as "vatAmount",
    to_char(ln.linetotaldisc, 'FFM999999999990.00') as "lineTotalDisc",
    to_char(ln.colorantprice, 'FFM999999999990.00') as colorantprice,
    to_char(((ln.salesqty * (ln.salesprice + ln.colorantprice)) 
    + (ln.salesqty * ln.vatamount) - (ln.salesqty * ln.linetotaldisc)) 
    ,'FFM999999999990.00') as "lineAmount",
    ln.prodnamear as "prodNameAr",
    ln.prodnameen as "prodNameEn",
    ln.colNameAr as "colNameAr",
    ln.colNameEn as "colNameEn",
    ln.sizeNameEn as "sizeNameEn",
    ln.sizeNameAr as "sizeNameAr",
    ln.colorantid as colorant
    from
    (
        select
        distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
        i.invoiceid as salesid,
        i.batchno,
        i.itemid,
        i.configid,
        i.inventsizeid,
        st.status as status,
        i.qty as salesqty,
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
        sl.colorantid as  colorantid,
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
}
