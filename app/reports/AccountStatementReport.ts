import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";

export class AccountStatementReport {
  public sessionInfo: any;
  private db: any;
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
      ledgerAccount: params.ledgerAccount,
      fromDate: params.fromDate,
      toDate: params.toDate,
      user: params.user,
    };
    renderData.data = result;
    console.log(renderData);
    let file: string;
    if (params.type == "excel") {
      file = params.lang == "en" ? "accountstatement-excel" : "accountstatement-excel-ar";
    } else {
      file = params.lang == "en" ? "accountstatement-report" : "accountstatement-report-ar";
    }
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }

  async query_to_data(params: any) {
    let query: string = `select lj.accountNum as "accountNum", 
            accnt.accountname as "nameAr", 
            accnt.accountnamealias as "nameEn", 
            lj.transdate as "journalDate",
            lj.journalnum as "journalNum",
            lj.txt  as "transactionText",
            to_char(lj.amountmst,   'FM999999999.00') as amount,
            to_char(SUM(lj.amountmst) over(partition by lj.accountnum order by lj.accountnum, lj.txt rows unbounded preceding),  'FM999999999.00') as accumulated
            from ledgertrans lj, accountstable accnt
            where accnt.accountnum = lj.accountnum and lj.transdate is not null
            and lj.transdate >= '${params.fromDate}'
            and lj.transdate <= ('${params.toDate}' ::date + '1 day'::interval) `;
    if (params.ledgerAccount) {
      query += `  and lj.accountnum='${params.ledgerAccount}'`;
    }
    return await this.db.query(query);
  }
}
