import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RedeemService } from "../services/RedeemService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class RedeemPointsReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private redeemService: RedeemService;
  private rawQuery: RawQuery;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
    this.redeemService = new RedeemService();
  }

  async execute(params: any) {
    try {
      let data: any = params;
      let reqData: any = {
        mobile: params.mobileNo.length == 9 ? "0" + params.mobileNo : params.mobileNo,
        // mobile: "0550590391",
        // inventLocationId: params.inventlocationid,
        inventLocationId: "RMAW-0010"
      };
      let balancePoints: any = await this.redeemService.getCustomerPoints(reqData);
      // data = await this.query_to_data(params);
      // data.map((item: any) => {
      //   item.lastModifiedDate = App.convertUTCDateToLocalDate(
      //     new Date(item.lastModifiedDate),
      //     parseInt(params.timeZoneOffSet)
      //   ).toLocaleString();
      // });

      let arr = [];
      arr.push(balancePoints);

      return arr;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any = params;
    renderData.data = result;
    renderData.printDate = App.convertUTCDateToLocalDate(new Date(App.DateNow()), parseInt(params.timeZoneOffSet))
      .toLocaleString()
      .replace(/T/, " ") // replace T with a space
      .replace(/\..+/, "");
    renderData.fromDate = new Date(renderData.fromDate).toLocaleDateString();
    renderData.toDate = new Date(renderData.toDate).toLocaleDateString();
    let file = params.lang == "en" ? "redeem-points-en" : "redeem-points-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query = `select
    s.salesid,
    s.invoiceaccount as "custAccount",
    c."name" as "customerNameAr",
    c.namealias as "customerNameEn",
    to_char(s.redeempts, 'FM999999999') as "redeemPoints",
    s.redeemptsamt  as "redeemAmount",
    s.createddatetime as "createdDateTime",
    s.lastmodifieddate  as "lastModifiedDate",
    s.inventlocationid  as inventlocationid
    from salestable s
    left join custtable c on c.accountnum  = s.invoiceaccount
    where redeempts > 0 and s.inventlocationid ='${params.inventlocationid}'
and s.lastmodifieddate ::Date>='${params.fromDate}'
and s.lastmodifieddate ::Date<='${params.toDate}'`;

    if (params.custaccount) {
      query += `and s.invoiceaccount= '${params.custaccount}'`;
    }
    return await this.db.query(query);
  }
}
