import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { getConnection } from "typeorm";

export class OrderReceiveReport {
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
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let id = params.salesId;
      let status: string;
      let data: any = await this.query_to_data(id);
      data = data.length >= 1 ? data[0] : {};
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      let salesLine: any = await this.salesline_query_to_data(id);
      // salesLine = salesLine.length > 0 ? salesLine : [];
      let i = 1;
      salesLine.map((v: any) => {
        v.sNo += i;
        i += 1;
      });
      data.salesLine = salesLine;
      data.quantity = 0;
      salesLine.map((v: any) => {
        data.quantity += parseInt(v.salesQty);
      });
      if (data.status != "POSTED") {
        let promiseList = [];
        let date = new Date().toISOString();
        let query = `UPDATE salestable SET originalprinted = '${true}', status = 'POSTED'`;
        if (date) {
          query += `,lastmodifieddate = '${date}' `;
        }
        query += ` WHERE salesid = '${params.salesId.toUpperCase()}'`;
        promiseList.push(queryRunner.query(query));
        // this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
        let batches: any[] = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
        let groupData: any[] = await this.groupBy(batches, function (item: any) {
          return [item.itemid, item.batchno, item.configid, item.inventsizeid];
        });
        let inventoryOnHandBatches: any[] = [];
        groupData.forEach(function (groupitem: any) {
          const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
          groupitem[0].qty = Math.abs(qty);
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
        await Promise.all(promiseList);
      }
      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data ? data[0] : {};
  }

  async transferOrderId(param: string) {
    let query = `select intercompanyoriginalsalesid as transferid from salestable where salesid = '${param}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = result;
    renderData.printDate = renderData.printDate = App.convertUTCDateToLocalDate(
      new Date(App.DateNow()),
      parseInt(params.timeZoneOffSet)
    ).toLocaleString();
    console.log(params.lang);
    let file = params.lang == "en" ? "or-en" : "or-ar";
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
            amount as amount,
            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,
            st.originalprinted as "originalPrinted",
            st.inventlocationid as "inventLocationId",
            st.description as notes,
            fw.namealias as fwnamealias,
            fw.name as fwname,
            tw.namealias as twnamealias,
            tw.name as twname,
            st.intercompanyoriginalsalesid as "interCompanyOriginalSalesId",
            (select intercompanyoriginalsalesid from salestable where salesid = st.intercompanyoriginalsalesid limit 1) as transferid
            from salestable st 
            left join inventlocation fw on fw.inventlocationid = st.custaccount
            left join inventlocation tw on tw.inventlocationid = st.inventlocationid
            left join app_lang als on als.id = st.status
            left join app_lang alt on alt.id = st.transkind
            where salesid='${id}'
            `;
    return await this.db.query(query);
  }
  async salesline_query_to_data(id: any) {
    let salesQuery = `
            select
            ln.salesid,
            ln.itemid,
            ln.batchno,
            ln.configid,
            ln.inventsizeid,
            ln.status,
            ln.colorantid as  colorantid,
            to_char(ln.salesqty, 'FM999,999,999,999D') as "salesQty",
            ln.prodnamear as "prodNameAr",
            ln.prodnameen as "prodNameEn",
            ln.colNameAr as "colNameAr",
            ln.colNameEn as "colNameEn",
            ln.sizeNameEn as "sizeNameEn",
            ln.sizeNameAr as "sizeNameAr"
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
                ABS(i.qty) as salesqty,
                b.itemname as prodnamear,
                b.namealias as prodnameen,
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
