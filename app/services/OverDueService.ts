import { App } from "../../utils/App";

import { Props } from "../../constants/Props";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";
import { CacheService } from "../common/CacheService";
import { OverDueDAO } from "../repos/OverDueDAO";
import { Overdue } from "../../entities/Overdue";

export class OverDueService {
  public sessionInfo: any;
  private overDueDAO: OverDueDAO;
  private db: any;
  public cacheService: CacheService;
  private rawQuery: RawQuery;

  constructor() {
    this.db = getManager();
    this.overDueDAO = new OverDueDAO();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.overDueDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(reqData: any) {
    try {
      let data: any = await this.overDueDAO.search(reqData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCreditUsed(accountNum: string) {
    let result: any = {};
    let custDetails = await this.rawQuery.getCustomerCreditMax(accountNum);
    result.creditLimit = custDetails.creditmax;
    let data = await this.overDueDAO.getCreditUsed(accountNum);
    let overDue = await this.overDueDAO.getOverDueCredit(accountNum);
    result.usedCredit = 0;
    data.map((item: any) => {
      item.invoiceAmount =
        Math.round(parseFloat((Math.abs(item.invoiceAmount) * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
      item.actualDueDate = new Date(item.actualDueDate).toISOString().substr(0, 10);
      item.duedate = new Date(item.duedate).toISOString().substr(0, 10);
      item.createddatetime = new Date(item.createddatetime).toISOString().substr(0, 10);
      item.lastModifiedDate = new Date(item.lastModifiedDate).toISOString().substr(0, 10);
      item.invoicedate = new Date(item.invoicedate).toISOString().substr(0, 10);
      result.usedCredit += item.invoiceAmount;
    });
    result.availableCredit = result.creditLimit > 0 ? result.creditLimit - result.usedCredit : 0;
    result.invoices = overDue;
    return result;
  }

  async create(data: Overdue) {
    return await this.overDueDAO.createOverDue(data);
  }
}
