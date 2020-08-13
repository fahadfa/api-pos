import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { getConnection } from "typeorm";

export class PurchaseReturnReport {
  public sessionInfo: any;
  rawQuery: RawQuery;
  private db: any;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  constructor() {
    this.db = getManager();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
  }

  async execute(params: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let data: any = await this.query_to_data(params);

      data[0].originalPrinted = data[0].originalPrinted == null ? false : data[0].originalPrinted;
      data[0].vatAmount = Math.round(parseFloat((data[0].vatAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
      data[0].ReturnDate = new Date(data[0].ReturnDate).toLocaleDateString();
      if (data[0].originalPrinted) {
        data[0].isCopy = true;
      } else {
        data[0].isCopy = false;
      }
      let batches: any = await this.batches_query_to_data(params);
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
      // let i = 1;
      // new_data.forEach((element: any) => {
      //     element.sNo = i;
      //     i++;
      // });
      data[0].batches = new_data;
      this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED");
      this.db.query(` update inventtrans set transactionclosed = true where invoiceid='${params.salesId}'`);
      if (!data.isCopy) {
        // if (data.transkind == "INVENTORYMOVEMENT") {
        let batches: any = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
        for (let item of batches) {
          item.transactionClosed = true;
          // this.inventTransDAO.save(item);
          this.updateInventoryService.updateInventtransTable(item, false, true, queryRunner);
        }
        // }
      }
      await queryRunner.commitTransaction();
      return data[0];
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

  async report(result: any, params: any) {
    let renderData: any;

    renderData = result;
    let file = params.lang == "en" ? "pr-en" : "pr-ar";
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
                s.createddatetime as "ReturnDate",
                s.lastmodifieddate as "lastModifiedDate",
                s.status as status,
                als.en as "statusEn",
                als.ar as "statusAr",
                alt.en as "transkindEn",
                alt.ar as "transkindAr",
                s.disc as discount,
                v.name as name,
                v.namealias as "nameAlias",
                v.phone as phone,
                s.amount as "netAmount",
                s.netamount as "grossAmount",
                s.vatamount as "vatAmount",
                s.originalprinted as "originalPrinted",
                s.createdby as "createdBy",
                s.intercompanyoriginalsalesid as "purchaseOrderId",
                w.name as "wareHouseNameAr",
                w.namealias as "wareHouseNameEn"
                from salestable s
                left join inventlocation w on w.inventlocationid=s.inventlocationid
                left join vendortable v on v.accountnum=s.custaccount
                left join app_lang als on als.id = s.status
                left join app_lang alt on alt.id = s.transkind
            where s.transkind = 'PURCHASERETURN' and s.salesid = '${params.salesId}' limit 1
            `;
    return await this.db.query(query);
  }
  async batches_query_to_data(params: any) {
    const batchesQuery = `select 
            ROW_NUMBER()  OVER (ORDER BY  invoiceid) As "sNo",
            i.itemid as itemid,
            bs.namealias as nameEn,
            bs.itemname as nameAr,
            to_char(ABS(i.qty), 'FM999,999,999,999D') as qty,
            i.configid as configid,
            i.inventsizeid as inventsizeid,
            i.invoiceid as invoiceid,
            i.transrefid as transrefid,
            s.description as sizenameen,
            s.name as sizenamear,
            i.batchno as batchno,
            b.expdate as batchExpDate,
            cast((select salesprice from salesline sl where sl.salesid=i.invoiceid and sl.itemid = i.itemid and sl.configid=i.configid and sl.inventsizeid=i.inventsizeid) as decimal(10,2)) as price,
            cast((select lineamount from salesline sl where sl.salesid=i.invoiceid and sl.itemid = i.itemid and sl.configid=i.configid and sl.inventsizeid=i.inventsizeid) as decimal(10,2)) as "lineAmount",
            cast((select vatamount from salesline sl where sl.salesid=i.invoiceid and sl.itemid = i.itemid and sl.configid=i.configid and sl.inventsizeid=i.inventsizeid) as decimal(10,2)) as "vatAmount"
        from inventtrans  i
        left join inventbatch b on i.batchno = b.inventbatchid
        left join inventtable bs on i.itemid = bs.itemid
        left join inventsize s on s.inventsizeid = i.inventsizeid and s.itemid = i.itemid
        where  ((reserve_status!='UNRESERVED' AND reserve_status != 'SAVED') or reserve_status is null)  and i.invoiceid = '${params.salesId}'`;
    return await this.db.query(batchesQuery);
  }
}
