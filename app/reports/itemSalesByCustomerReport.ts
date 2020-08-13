import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class itemSalesByCustomerReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);

      let totalQuantity: number = 0;
      let totalLineAmount: number = 0;
      let colorantPrice: number = 0;
      let price: number = 0;
      let vatAmount: number = 0;
      let totalDisc: number = 0;

      data.forEach((v: any) => {
        totalQuantity += v.quantity ? parseInt(v.quantity) : 0;
        totalLineAmount += v.lineAmount ? parseFloat(v.lineAmount) : 0;
        colorantPrice += v.colorantPrice ? parseFloat(v.colorantPrice) : 0;
        price += v.price ? parseFloat(v.price) : 0;
        vatAmount += v.vatAmount ? parseFloat(v.vatAmount) : 0;
        totalDisc += v.totalDisc ? parseFloat(v.totalDisc) : 0;
      });

      let queryCustomer: string = ` select namealias as "nameEn", name as "nameAr" from custtable where accountnum =  '${params.accountnum}'`;
      let userData = await this.db.query(queryCustomer);
      userData = userData.length > 0 ? userData[0] : {};
      console.log(userData);

      let renderData: any = {
        printDate: new Date().toLocaleString(),
        fromDate: params.fromDate,
        toDate: params.toDate,
        status: params.status,
        transType: params.transType,
        color: params.color,
        product: params.product,
        customerName: userData.nameEn ? userData.nameEn : "-",
        customerNameAr: userData.nameAr > 0 ? userData.nameAr : "-",
        totalQuantity: totalQuantity,
        totalLineAmount: totalLineAmount.toFixed(2),
        colorantPrice: colorantPrice.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        totalDisc: totalDisc.toFixed(2),

        user: params.user,
        price: price.toFixed(2),
      };

      renderData.data = data;
      return renderData;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    result.printDate = new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, "");
    // console.log(result.salesLine[0].product.nameEnglish);
    console.log(result);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "itemsalesbycustomer-excel" : "itemsalesbycustomer-excel-ar";
    } else {
      file = params.lang == "en" ? "itemsalesbycustomer-report" : "itemsalesbycustomer-report-ar";
    }
    try {
      return App.HtmlRender(file, result);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query: string = `
            select 
            distinct
                i.itemid, 
                i.name, 
                i.nameAlias as "nameAlias", 
                i.customername as "customerName",
                i.colorantprice as "colorantPrice",
                to_char(sum(i.quantity), 'FM999,999,999,999D') as "quantity", 
                to_char(sum(i.price), 'FM999999999990.00') as price, 
                to_char(sum(i.vatAmount), 'FM999999999990.00') as "vatAmount",
                to_char(sum(i.lineAmount), 'FM999999999990.00') as "lineAmount",
                to_char(sum(i.totalDisc), 'FM999999999990.00') as "totalDisc",
                i.wareHouseNameAr as "wareHouseNameAr", i.wareHouseNameEn as "wareHouseNameEn",
                i.sizeNameEn as "sizeNameEn", 
                i.sizeNameAr as "sizeNameAr",
                i.nameEn as "nameEn", 
                i.nameAr as "nameAr", 
                i.configId as "configId", 
                i.inventsizeid as "inventsizeid",
                i.batchno as batchno
            from( select 
                distinct on (sl.id)
                    s.inventlocationid as inventlocationid,
                    s.custaccount as custaccount,
                    s.salesname as customername,
                    to_char(sl.createddatetime, 'DD-MM-YYYY') as createdDateTime,
                    to_char(sl.lastmodifieddate, 'DD-MM-YYYY') as lastModifiedDate,
                    sl.salesqty as quantity,
                    sl.salesprice as price,
                    sl.vatamount as vatAmount,
                    sl.linetotaldisc as totalDisc,
                    sl.itemid as itemid,
                    sl.colorantprice as colorantprice,
                    ((sl.lineamount - sl.linetotaldisc * sl.salesqty) + (sl.colorantprice * sl.salesqty) + sl.vatamount ) as lineAmount,
                    c.name as name,
                    c.namealias as nameAlias,
                    w.name as wareHouseNameAr,
                    w.namealias as wareHouseNameEn,
                    c.paymmode as paymentMode,
                    sz.description as sizeNameEn,
                    sz.name as sizeNameAr,
                    sz.inventsizeid as inventsizeid,
                    i.batchno,
                    bs.namealias as nameEn,
                    bs.itemname as nameAr,
                    col.configid as configid
                from salesline sl
                inner join salestable s on s.salesid = sl.salesid
                left join inventlocation w on w.inventlocationid=s.inventlocationid
                left join custtable c on c.accountnum=s.custaccount
                left join inventtrans i on i.invoiceid=s.salesid
                left join configtable col on sl.configid = col.configid and sl.itemid = col.itemid
                left join inventsize sz on  sz.itemid = sl.itemid and sz.inventsizeid = sl.inventsizeid
                left join inventtable bs on bs.itemid = sl.itemid
                where s.transkind = 'SALESORDER' and s.status in ('PAID', 'POSTED')
                and sl.lastmodifieddate >= '${params.fromDate}' ::date
                AND  sl.lastmodifieddate < ('${params.toDate}' ::date + '1 day'::interval) 
            `;
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
    if (params.configid) {
      query += ` and  sl.configid = '${params.configid}' `;
    }
    if (params.itemid) {
      query += ` and  sl.itemid = '${params.itemid}' `;
    }
    if (params.transType && params.transType != "ALL") {
      query += ` and  st.transkind = '${params.transType}' `;
    }
    if (params.batchNo) {
      query += ` and  i.batchno = '${params.batchNo}' `;
    }
    if (params.accountnum) {
      query += ` and  ( s.mobileno ='${params.accountnum}' or s.invoiceaccount='${params.accountnum}') `;
    }
    if (params.inventsizeid) {
      query += ` and  i.inventsizeid = '${params.inventsizeid}' `;
    }
    query += `) as i 
            group by i.name, i.nameAlias, i.wareHouseNameAr , 
           i.wareHouseNameEn , i.sizeNameEn, i.sizeNameAr , i.customerName,
           i.nameEn , i.nameAr , i.configId, i.itemid, i.inventsizeid, i.colorantprice, i.batchno `;
    return await this.db.query(query);
  }
}
