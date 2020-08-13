import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";

export class TrialBalanceReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  constructor() {
    this.db = getManager();
  }

  async execute(params: any) {
    try {
      let data: any = await this.query_to_data(params);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async warehouseName(param: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async report(result: any, params: any) {
    let renderData: any = {
      printDate: new Date(params.printDate).toISOString().replace(/T/, " ").replace(/\..+/, ""),
      fromDate: params.fromDate,
      toDate: params.toDate,
      status: params.status,
      user: params.user,
    };
    // console.log(result.salesLine[0].product.nameEnglish);
    renderData.data = result;
    console.log(renderData);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "trialbalance-excel" : "trialbalance-excel-ar";
    } else {
      file = params.lang == "en" ? "trialbalance-report" : "trialbalance-report-ar";
    }
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query: string = `
            select 
            i.accountnum as "accountNum",
            i.namear as "nameAr",
            i.nameen as "nameEn",
            i.openingbal as "openingBal",
            to_char(i.debit, 'FM999999990.00') as debit,
            to_char(i.credit, 'FM999999990.00') as credit,
            to_char(i.closingbal, 'FM999999990.00') as "closingBal" from(
            SELECT * FROM (SELECT a.accountnum AS "accountnum", 
                a.accountnamealias AS "nameen", 
                a.accountname AS "namear", 
                0.00 as "openingbal",
                coalesce((SELECT sum(amountcurdebit) FROM ledgerjournaltrans
                WHERE to_char(lj.transdate, 'yyyy-MM-dd') >= '${params.fromDate}' 
                AND to_char(lj.transdate, 'yyyy-MM-dd') <= '${params.toDate}'), 0) AS debit,
                coalesce((SELECT sum(amountcurcredit) FROM ledgerjournaltrans 
                WHERE to_char(lj.transdate, 'yyyy-MM-dd') >= '${params.fromDate}' 
                AND to_char(lj.transdate, 'yyyy-MM-dd') <= '${params.toDate}'), 0) AS credit,
                coalesce((SELECT sum(coalesce((SELECT sum(amountcurdebit) FROM ledgerjournaltrans 
                WHERE to_char(lj.transdate, 'yyyy-MM-dd') >= '${params.fromDate}' AND
                to_char(lj.transdate, 'yyyy-MM-dd') <= '${params.toDate}'), 0)-coalesce((SELECT sum(amountcurcredit)FROM ledgerjournaltrans 
                WHERE to_char(lj.transdate, 'yyyy-MM-dd') >= '${params.fromDate}'
                AND to_char(lj.transdate, 'yyyy-MM-dd') <= '${params.toDate}'), 0))), 0) AS "closingbal"
                FROM ledgerjournaltrans lj, accountstable a
                WHERE a.accountpltype=1 AND a.accountnum=lj.accountnum
            GROUP BY a.accountnum, a.accountnamealias, a.accountname, lj.transdate) t
                WHERE debit <> 0 OR credit <>0 OR closingbal <>0
                ) as i`;

    return await this.db.query(query);
  }
}
