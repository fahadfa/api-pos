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

export class MovementLinesReport {
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
    try {
      console.log("===================================", params);
      let data: any = await this.query_to_data(params);
      data.map((item: any) => {
        item.Quantity = parseInt(item.Quantity);
        item.createddatetime = App.convertUTCDateToLocalDate(
          new Date(item.createddatetime),
          parseInt(params.timeZoneOffSet)
        ).toLocaleDateString();
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any;
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData = {
      data: result,
      fromDate: params.fromDate,
      toDate: params.toDate,
      wareHouseId: params.inventlocationid,
      status: params.status,
      printDate: App.convertUTCDateToLocalDate(new Date(App.DateNow()), parseInt(params.timeZoneOffSet))
        .toLocaleDateString()
        .replace(/T/, " ") // replace T with a space
        .replace(/\..+/, ""),
    };
    console.log(params.lang);
    let file = "";
    if (params.type == "excel") {
      file = params.lang == "en" ? "mol-en-excel" : "mol-ar-excel";
    } else {
      file = params.lang == "en" ? "mol-en-report" : "mol-ar-report";
    }
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

  async query_to_data(params: any) {
    let query: string = `
            select 
            distinct
            sl.salesid as "salesId",
            sl.itemid,
            i.itemname as "ItemNameAr",
            i.namealias as "ItemNameEn", 
            sl.configid,
            sl.inventsizeid,
            sl.salesqty "Quantity",
            s.custaccount,
            s.status,
            al.en as "statusEn",
            al.ar as "statusAr",
            s.dimension6_ as salesman,
            s.createddatetime,
            sl.inventlocationid,
            d."name" as "salesmanEn",
            d.description as "salesmanAr",
            m.movementtype as "movementtypeEn",
            m.movementarabic as "movementtypeAr",
            w.namealias as wnamealias,
            w.name as wname
            from salesline sl
            inner join salestable s on s.salesid = sl.salesid 
            inner join movementtype m on m.id = s.movement_type_id
            left join app_lang al on al.id = s.status
            left join inventtable i on i.itemid = sl.itemid 
            left join dimensions d on d.num = s.dimension6_ 
            left join inventlocation w on w.inventlocationid = sl.inventlocationid
            where s.transkind in ('INVENTORYMOVEMENT')
            and s.lastmodifieddate >= '${params.fromDate}' ::date
            AND  s.lastmodifieddate < ('${params.toDate}' ::date + '1 day'::interval) 
            `;
    if (params.inventlocationid && params.inventlocationid == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and s.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else if (params.inventlocationid) {
      query += ` and s.inventlocationid='${params.inventlocationid}' `;
    }

    if (params.movementType) {
      query += ` and s.movement_type_id = '${params.movementType}' `;
    }

    if (params.status && params.status != "ALL") {
      query += ` and s.status in ('${params.status}') `;
    }

    if (params.accountnum) {
      query += ` and (s.custaccount = '${params.accountnum}' or s.mobileno ='${params.accountnum}' or s.invoiceaccount='${params.accountnum}') `;
    }
    if (params.salesmanid) {
      query += ` and (s.dimension6_ = '${params.salesmanid}') `;
    }
    query += ` order by s.createddatetime ASC `;

    return await this.db.query(query);
  }
}
