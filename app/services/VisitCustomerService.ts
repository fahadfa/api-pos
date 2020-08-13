import { App } from "../../utils/App";
import { VisitCustomer } from "../../entities/VisitCustomer";
import { VisitCustomerDAO } from "../repos/VisitCustomerDAO";
import { Props } from "../../constants/Props";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { SalesTableDAO } from "../repos/SalesTableDAO";

export class VisitCustomerService {
  public sessionInfo: any;
  private visitCustomerDAO: VisitCustomerDAO;
  private salesTableDAO: SalesTableDAO;
  private db: any;
  public visitCustomer: VisitCustomer;
  private rawQuery: RawQuery;
  private usergroupconfigDAO: UsergroupconfigDAO;
  constructor() {
    this.db = getManager();
    this.visitCustomerDAO = new VisitCustomerDAO();
    this.salesTableDAO = new SalesTableDAO();
    this.visitCustomer = new VisitCustomer();
    this.rawQuery = new RawQuery();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.visitCustomerDAO.entity(id);
      data.visitorSequenceNumber;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      // if (item == {}) {
      let data: any = await this.visitCustomerDAO.search(item);
      return data;
      // } else {
      //     item.dataareaId = this.sessionInfo.dataareaid;
      //     let data: any = await this.custtableDAO.findAll(item);
      //     return data;
      // }
    } catch (error) {
      throw error;
    }
  }

  async searchVisitors(item: any) {
    try {
      let data: any = await this.salesTableDAO.searchVisitors(item);
      console.log("========================", data);
      let citycodes: any[] = [];
      data.forEach((item: any) => {
        if (item.citycode != null && item.citycode && item.citycode.toString().trim().length > 0) {
          citycodes.push(item.citycode);
        }
      });
      let uniqueCodes: any = new Set(citycodes);
      let cities: any = await this.salesTableDAO.searchCities(Array.from(uniqueCodes));
      data.forEach((item: any, index: any) => {
        let city = cities.find((cityObj: any) => {
          return cityObj.cityname == item.citycode;
        });
        if (city) {
          data[index] = Object.assign({}, data[index], city);
        }
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: any, queryRunner: any = null) {
    try {
      let userGroupConfigData: any = await this.usergroupconfigDAO.findOne({ groupid: this.sessionInfo.groupid });
      reqData.regionNumber = userGroupConfigData.regionId;
      reqData.userGroupId = userGroupConfigData.groupid;
      reqData.showroomId = userGroupConfigData.costCenterId;
      reqData.salesmanId = userGroupConfigData.salesmanid;
      reqData.dataareaid = this.sessionInfo.dataareaid;
      let cond = await this.validate(reqData);
      // console.log(userGroupConfigData);
      if (cond == true) {
        // console.log(this.sessionInfo);
        reqData.userGroupId = this.sessionInfo.groupid;
        if (queryRunner) {
          await queryRunner.manager.getRepository(VisitCustomer).save(reqData);
        } else {
          let visitor: any = await this.visitCustomerDAO.save(reqData);
        }
        return { id: reqData.visitorSequenceNumber, message: Props.SAVED_SUCCESSFULLY };
      }
      if (cond == "VisitSeqNumber") {
        throw { message: "RECORD_ALREADY_EXISTS" };
      }
    } catch (error) {
      throw error;
    }
  }

  async getVisitCustNum(item: VisitCustomer) {
    this.visitCustomer.showroomId = item.showroomId;
    let result = await this.visitCustomerDAO.search(item);

    // console.log(this.visitCustomer.regionNumber);
    let data: any = await this.rawQuery.getNumberSequence("VST_NUMBER");
    let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
    let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
    let year: string = new Date().getFullYear().toString().substr(2, 2);

    data.nextrec = prevYear == year ? data.nextrec : 1;
    let visitCustNum: string = data.format.replace(
      hashString,
      item.regionNumber + "-" + this.visitCustomer.showroomId + "-" + year + "-" + data.nextrec
    );
    // let visitCustNum: string = data.format.substr(0, 3) + item.regionNumber + "-" + this.visitCustomer.showroomId + "-" + year + "-" + data.nextrec;
    console.log(visitCustNum);
    await this.rawQuery.updateNumberSequence("VST_NUMBER", data.nextrec);
    return visitCustNum;
  }

  async validate(item: VisitCustomer) {
    let previousData = null;
    if (!item.visitorSequenceNumber || item.visitorSequenceNumber == "" || item.visitorSequenceNumber == "0") {
      item.visitorSequenceNumber = null;
    } else {
      previousData = await this.visitCustomerDAO.findOne({ visitorSequenceNumber: item.visitorSequenceNumber });
    }
    item.lastModifiedBy = this.sessionInfo.userName;
    let mdata = await this.visitCustomerDAO.findAll({ visitorSequenceNumber: item.visitorSequenceNumber });
    if (!item.visitorSequenceNumber) {
      item.visitorSequenceNumber = await this.getVisitCustNum(item);
      item.createdDateTime = new Date(App.DateNow());
      item.createdBy = this.sessionInfo.userName;
      item.dateOfVisit = new Date(App.DateNow());
    } else {
      console.log(item.visitorSequenceNumber);
      if (item.visitorSequenceNumber != previousData.visitorSequenceNumber) {
        if (mdata.length > 0) {
          return "VisitSeqNumber";
        }
      }
    }

    item.lastModifiedDate = new Date(App.DateNow());
    // console.log("iso", App.dateNow());
    // console.log("normal", new Date());
    // console.log("iso converted", new Date(App.DateNow()));
    return true;
  }

  async paginate(item: any) {
    try {
      // if (item == {}) {
      let data = await this.visitCustomerDAO.pagination(item);
      data.data.map((v: any) => {
        v.dateOfVisit = v.dateOfVisit;
      });
      return { count: data.count, data: data.data };
    } catch (error) {
      throw error;
    }
  }
  async mobilepaginate(item: any) {
    try {
      // if (item == {}) {
      let data = await this.visitCustomerDAO.mobile_pagination(item);
      data.map((v: any) => {
        v.dateOfVisit = v.dateOfVisit;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
