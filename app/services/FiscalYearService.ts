import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { FiscalYear } from "../../entities/FiscalYear";
import { FiscalYearDAO } from "../repos/FiscalYearDAO";
import { FiscalYearClose } from "../../entities/FiscalYearClose";

export class FiscalYearService {
  public sessionInfo: any;
  private fiscalyearRepository: FiscalYearDAO;

  constructor() {
    this.fiscalyearRepository = new FiscalYearDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.fiscalyearRepository.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any = await this.fiscalyearRepository.search(item);
      data.map((ele: any) => {
        ele.status = ele.closing == 1 ? "Posted" : "Open";
        ele.createdDateTime = ele.createdDateTime ? ele.createdDateTime.toLocaleDateString() : ele.createdDateTime;
        ele.lastModifiedDate = ele.lastModifiedDate ? ele.lastModifiedDate.toLocaleDateString() : ele.lastModifiedDate;
        ele.startDate = ele.startDate.toLocaleDateString();
        ele.endingDate = ele.endingDate.toLocaleDateString();
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(item: FiscalYear) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let data: any = [];
        console.log();
        let year: any = item.yearNo;
        for (let i = 1; i <= 12; i++) {
          let obj = {
            yearNo: item.yearNo,
            closing: item.closing,
            financialDataareaid: item.financialDataareaid,
            dataareaid: item.dataareaid,
            recversion: item.recversion ? item.recversion : 0,
            recid: item.recid ? item.recid : 0,
            lastModifiedBy: item.lastModifiedBy,
            createdDateTime: item.createdDateTime,
            createdBy: item.createdBy,
            lastModifiedDate: item.lastModifiedDate,
            startDate: await App.DaysBack(new Date(item.yearNo, i - 1, 1), 0),
            endingDate: await App.DaysBack(new Date(i == 12 ? parseInt(year) + 1 : item.yearNo, i == 12 ? 0 : i, 1), 1)
          };
          data.push(obj);
        }
        console.log(data);
        let fiscalyearData: any = await this.fiscalyearRepository.save(data);
        let returnData = { id: item.yearNo, message: "SAVED_SUCCESSFULLY" };
        return returnData;
      } else if (cond == "year") {
        throw { message: "DUPLICATE_RECORD" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async validate(item: FiscalYear) {
    let previousItem: any = null;
    if (!item.yearNo || item.yearNo.toString() == "" || item.yearNo.toString() == "0") {
      throw "YEAR_REQUIRED";
    } else {
      previousItem = await this.fiscalyearRepository.findOne({ yearNo: item.yearNo });
      console.log(previousItem);
    }
    let condData = await this.fiscalyearRepository.search({ yearNo: item.yearNo });
    console.log(condData);
    if (condData.length > 0) {
      return "year";
    }

    item.lastModifiedBy = this.sessionInfo.userName;
    item.lastModifiedDate = new Date(App.DateNow());
    item.createdDateTime = new Date(App.DateNow());
    item.createdBy = this.sessionInfo.userName;
    item.dataareaid = this.sessionInfo.dataareaid;
    return true;
  }
  async delete(id: any) {
    try {
      let data: FiscalYear = await this.fiscalyearRepository.entity(id);
      if (!data) throw { message: "RECORD_NOT_FOUND" };

      let result: any = await this.fiscalyearRepository.delete(data);
      let returnData = { id: id, message: "REMOVED" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }
}
