import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { ReceiptsService } from "../services/ReceiptsService";
import { en, ar } from "../../utils/Words";
export class ReceiptReport {
  public sessionInfo: any;
  private db: any;
  private receiptService: ReceiptsService;

  constructor() {
    this.db = getManager();
    this.receiptService = new ReceiptsService();
  }

  async execute(params: any) {
    try {
      let data: any = Object.assign({}, params);
      let result: any = await this.receiptService.entity(data.id);
      console.log(result);
      data.transDate = new Date(result.cashdate).toISOString().split("T")[0];
      data.type = result.log;
      data.isbank = result.log == "bank" ? true : false;
      data.amount = result.legerJournalTras[1].amountCurCredit;
      data.worden = en(data.amount);
      data.wordar = ar(data.amount);
      data.custid = result.legerJournalTras[1].accountNum;
      data.custnameen = result.legerJournalTras[1].name;
      data.custnamear = result.legerJournalTras[1].nameArabic;
      data.bankid = result.legerJournalTras[0].accountNum;
      data.banknameen = result.legerJournalTras[0].name;
      data.banknamear = result.legerJournalTras[0].nameArabic;
      data.remarks = result.description;

      console.log("ReceiptReport : ", data);
      return data;
      //   const query = `select * from salestable
      //                       inner join custtable on (custtable.accountnum=salestable.custaccount)
      //                       inner join salesline on (salesline.salesid=salestable.salesid)
      //                       where salesid=${params.salesId}`;

      //   let data: any = await this.db.query(query);
      //   return data;
      //return { name: "Testing" };
      // return Promise.resolve({ name: "Testing" });
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any = {};
    let fileName = params.lang == "en" ? "receipt-en" : "receipt-ar";
    console.log("ReceiptReport File Name: ", fileName);
    renderData = result;
    try {
      return App.HtmlRender(fileName, renderData);
    } catch (error) {
      throw error;
    }
  }
}
