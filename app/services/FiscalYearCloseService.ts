import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { FiscalYearClose } from "../../entities/FiscalYearClose";
import { FiscalYearCloseDAO } from "../repos/FiscalYearCloseDAO";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";

export class FiscalYearCloseService {
  public sessionInfo: any;
  private rawQuery: RawQuery;
  private fiscalyearcloseRepository: FiscalYearCloseDAO;
  private db: any;

  constructor() {
    this.fiscalyearcloseRepository = new FiscalYearCloseDAO();
    this.db = getManager();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.fiscalyearcloseRepository.entity(id);
      data.createdDateTime = data.createdDateTime.toLocaleDateString();
      data.lastModifiedDate = data.lastModifiedDate.toLocaleDateString();
      data.endingDate = data.endingDate.getMonth() + 1;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any = await this.fiscalyearcloseRepository.search(item);
      data.map((ele: any) => {
        ele.status = ele.status == 1 ? "Posted" : "Open";
        ele.createdDateTime = ele.createdDateTime ? ele.createdDateTime.toLocaleDateString() : ele.createdDateTime;
        ele.lastModifiedDate = ele.lastModifiedDate ? ele.lastModifiedDate.toLocaleDateString() : ele.lastModifiedDate;
        ele.endingDate = ele.endingDate ? ele.endingDate.toLocaleDateString() : ele.endingDate;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(item: FiscalYearClose) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let fiscalyearcloseData: any = await this.fiscalyearcloseRepository.save(item);
        if (item.status == 1) {
          let date = item.endingDate.toLocaleDateString().split("/");
          this.rawQuery.updateFiscalYearClose(item.yearNo, date);
        }
        let returnData = { id: item.id, message: "SAVED_SUCCESSFULLY" };
        return returnData;
      } else if (cond == "Duplicate") {
        throw { message: "DUPLICATE_RECORD" };
      } else if (cond == "notClosed") {
        throw { message: "BALANCES_ARE_NOT_EQUAL" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let data: FiscalYearClose = await this.fiscalyearcloseRepository.entity(id);
      if (!data) throw { message: "RECORD_NOT_FOUND" };

      let result: any = await this.fiscalyearcloseRepository.delete(data);
      let returnData = { id: id, message: "REMOVED" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async validate(item: any) {
    let previousItem: any = null;
    let cond: boolean = await this.rawQuery.financialYearCloseCondition(this.sessionInfo.dataareaid);
    if (cond) {
      return "notClosed";
    }
    if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
      item.id = null;
    } else {
      previousItem = await this.fiscalyearcloseRepository.entity(item.id);
    }
    let previousData: any = await this.fiscalyearcloseRepository.search({
      yearNo: item.yearNo,
      endingDate: App.DaysBack(new Date(item.yearNo, item.endingDate, 1), 1)
    });
    if (!item.id) {
      if (previousData.length > 0) {
        return "Duplicate";
      } else {
        item.createdBy = this.sessionInfo.userName;
        item.createdDateTime = new Date(App.DateNow());
        item.recid = item.recid ? item.recid : 0;
      }
    } else {
      let filterData: any = previousData.filter(
        (v: any) => v.id != item.id && v.yearNo == item.yearNo && v.endingDate.getMonth() + 1 == item.endingDate
      );
      if (filterData.length > 0) {
        return "Duplicate";
      }
    }
    item.lastModifiedBy = this.sessionInfo.userName;
    item.lastModifiedDate = new Date(App.DateNow());
    let month: any = item.endingDate;
    item.endingDate = App.DaysBack(new Date(item.yearNo, month, 1), 1);
    item.dataareaid = this.sessionInfo.dataareaid;
    return true;
  }
}
