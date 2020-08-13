import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class itemTransactionsReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);

      let result: any = this.groupBy(data, function (item: any) {
        return [item.itemid];
      });
      data = [];
      result.map((val: any) => {
        let obj: any = {};
        obj.itemid = val[0].itemid;
        obj.itemNameEn = val[0].itemNameEn;
        obj.itemNameAr = val[0].itemNameAr;
        obj.data = [];
        obj.totalQtyIn = 0;
        obj.totalQtyOut = 0;
        val.map((v: any) => {
          v.qtyIn = parseInt(v.qtyIn);
          v.qtyOut = parseInt(v.qtyOut);
          v.balance = v.qtyIn - v.qtyOut;
          obj.totalQtyIn += v.qtyIn;
          obj.totalQtyOut += v.qtyOut;
          obj.data.push(v);
        });
        obj.totalBalance = obj.totalQtyIn - obj.totalQtyOut;
        data.push(obj);
      });
      let renderData: any = {
        printDate: new Date().toLocaleString(),
        fromDate: params.fromDate,
        toDate: params.toDate,
        status: params.status,
        transType: params.transType,
        batchno: params.batchno ? params.batchno : "ALL",
        product: params.product ? params.product : "ALL",
        color: params.color ? params.color : "ALL",
        inventsizeid: params.inventsizeid ? params.inventsizeid : "ALL",
        user: params.user,
      };
      let warehouse = await this.warehouseName(params.inventlocationid);
      renderData.wareHouseNameAr = warehouse.name;
      renderData.wareHouseNameEn = warehouse.namealias;
      renderData.data = data;

      return renderData;
    } catch (error) {
      throw error;
    }
  }

  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data ? data[0] : {};
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
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "itemtransactions-excel" : "itemtransactions-excel-ar";
    } else {
      file = params.lang == "en" ? "itemtransactions-report" : "itemtransactions-report-ar";
    }
    result.printDate = new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, "");

    if (
      result.batchno == "ALL" ||
      result.product === "ALL" ||
      result.color === "ALL" ||
      result.inventsizeid === "ALL"
    ) {
      let query = `select * from app_lang ap where ap.id = 'ALL' limit 1`;
      let data = await this.db.query(query);
      data = data.length > 0 ? data[0] : {};
      if (result.batchno == "ALL") {
        result.batchno = params.lang == "en" ? data.en : data.ar;
      }
      if (result.product == "ALL") {
        result.product = params.lang == "en" ? data.en : data.ar;
      }
      if (result.color == "ALL") {
        result.color = params.lang == "en" ? data.en : data.ar;
      }
      if (result.inventsizeid == "ALL") {
        result.inventsizeid = params.lang == "en" ? data.en : data.ar;
      }
    }
    console.log(result);
    try {
      return App.HtmlRender(file, result);
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

  async query_to_data(params: any) {
    let query: string = `
    select * from
       (
         select 
         distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.batchno, i.qty, i.sales_line_id)
        i.invoiceid,
        st.transkind as transtype,
        als.en as "statusEn",
        als.ar as "statusAr",
        alt.en as "transkindEn",
        alt.ar as "transkindAr",
        to_char(i.dateinvent, 'YYYY-MM-DD') as date,
        sz.description as "sizeNameEn",
        sz."name"  as "sizeNameAr",
        i.configid,
        i.itemid,
        i.inventsizeid,
        i.batchno,
        case when qty>0 then abs(qty) else 0 end as "qtyIn",
        case when qty<0 then abs(qty) else 0 end as "qtyOut",
        i.inventlocationid as inventlocationid,
        w.name as "wareHouseNameAr",
        w.namealias as "wareHouseNameEn",
        p.itemname as "itemNameAr",
        p.namealias as "itemNameEn"
        from inventtrans i 
        left join inventsize sz on sz.inventsizeid  = i.inventsizeid and sz.itemid = i.itemid
        left join inventlocation w on w.inventlocationid=i.inventlocationid
        left join salestable st on st.salesid = i.invoiceid
        left join inventtable p on p.itemid = i.itemid
        left join app_lang als on als.id = st.status
        left join app_lang alt on alt.id = st.transkind
        where dateinvent >= '${params.fromDate}' ::date and 
        dateinvent < ('${params.toDate}' ::date + '1 day'::interval) and transactionclosed = true  and st.status !='RESERVED' `;

    if (params.inventlocationid == "ALL") {
      const warehouseQuery = `select regionalwarehouse from usergroupconfig where inventlocationid= '${params.key}' limit 1`;
      let regionalWarehouses = await this.db.query(warehouseQuery);
      let inQueryStr = "";
      regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
        inQueryStr += "'" + item + "',";
      });
      inQueryStr += "'" + params.key + "',";
      query += ` and i.inventlocationid in (${inQueryStr.substr(0, inQueryStr.length - 1)}) `;
    } else {
      query += ` and i.inventlocationid='${params.inventlocationid}' `;
    }
    if (params.color) {
      query += ` and  i.configid = '${params.color}' `;
    }
    if (params.product) {
      query += ` and  i.itemid = '${params.product}' `;
    }
    if (params.transType && params.transType != "ALL") {
      query += ` and  st.transkind = '${params.transType}' `;
    }
    if (params.batchno) {
      query += ` and  i.batchno = '${params.batchno}' `;
    }
    if (params.inventsizeid) {
      query += ` and  i.inventsizeid = '${params.inventsizeid}' `;
    }

    query += `) as j `;
    return await this.db.query(query);
  }
}
