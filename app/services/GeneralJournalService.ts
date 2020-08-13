import { App } from "../../utils/App";
import { GeneralJournal } from "../../entities/GeneralJournal";
import { GeneralJournalDAO } from "../repos/GeneralJournalDAO";
import { Props } from "../../constants/Props";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";

import { RawQuery } from "../common/RawQuery";
import { LedgerJournalTransDAO } from "../repos/LedgerJournalTransDAO";
import { LedgerJournalTrans } from "../../entities/LedgerJournalTrans";
import { LedgerTransDAO } from "../repos/LedgerTransDAO";
import { LedgerTrans } from "../../entities/LedgerTrans";
import { itemSalesByCustomerReport } from "../reports/itemSalesByCustomerReport";
import { Usergroupconfig } from "../../entities/Usergroupconfig";

export class GeneralJournalService {
  public sessionInfo: any;
  private generalJournalDAO: GeneralJournalDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private legerJournalTrasDAO: LedgerJournalTransDAO;
  private rawQuery: RawQuery;
  private ledgerTrasDAO: LedgerTransDAO;

  constructor() {
    this.generalJournalDAO = new GeneralJournalDAO();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.rawQuery = new RawQuery();
    this.legerJournalTrasDAO = new LedgerJournalTransDAO();
    this.ledgerTrasDAO = new LedgerTransDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.generalJournalDAO.entity(id);
      if (data) {
        data.status = data.posted == 0 ? "OPEN" : "POSTED";
        data.createdDatetime = data.createdDatetime ? data.createdDatetime.toLocaleDateString() : data.createdDatetime;
        data.lastModifiedDate = data.lastModifiedDate
          ? data.lastModifiedDate.toLocaleDateString()
          : data.lastModifiedDate;
        let legerJournalTras: any = data.legerJournalTras;
        legerJournalTras.map((ele: any) => {
          ele.createDateTime = ele.createDateTime ? ele.createDateTime.toISOString().substr(0, 10) : ele.createDateTime;
          ele.lastModifiedDate = ele.lastModifiedDate
            ? ele.lastModifiedDate.toISOString().substr(0, 10)
            : ele.lastModifiedDate;
          ele.transdDate = ele.transdDate ? ele.transdDate.toISOString().substr(0, 10) : ele.transdDate;
          ele.amountCurCredit = Math.ceil(ele.amountCurCredit);
          ele.amountCurDebit = Math.ceil(ele.amountCurDebit);
        });
        data.legerJournalTras = legerJournalTras;
        return data;
      } else {
        throw { message: "RECORD_NOT_FOUND" };
      }
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      item.dataareaid = this.sessionInfo.dataareaid;
      let data: GeneralJournal[] = await this.generalJournalDAO.search(item);
      data.map((i: any) => {
        i.status = i.posted == 0 || i.posted == null ? "OPEN" : "POSTED";
        i.createdDatetime = i.createdDatetime ? i.createdDatetime.toLocaleDateString() : i.createdDatetime;
        i.lastModifiedDate = i.lastModifiedDate ? i.lastModifiedDate.toLocaleDateString() : i.lastModifiedDate;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async save(reqData: GeneralJournal) {
    // try {
    let cond = await this.validate(reqData);
    if (cond == true) {
      console.log(this.sessionInfo);
      reqData.dataareaid = this.sessionInfo.dataareaid;
      let userGroupData: Usergroupconfig = await this.usergroupconfigDAO.entity(this.sessionInfo.usergroupconfigid);
      reqData.journalName = userGroupData.journalnameid;
      let account: GeneralJournal = await this.generalJournalDAO.save(reqData);
      let lineData = await this.legerJournalTrasDAO.findAll({ journalNum: reqData.journalNum });
      if (lineData) {
        await this.legerJournalTrasDAO.delete(lineData);
      }
      let ledgerTransData: LedgerTrans[] = [];
      reqData.legerJournalTras.map((item: LedgerJournalTrans) => {
        item.journalNum = reqData.journalNum;
        item.region = userGroupData.regionId;
        item.department = userGroupData.departmentid;
        item.costcenter = userGroupData.costCenterId;
        item.employee = userGroupData.employeeid;
        item.project = userGroupData.projectid;
        item.salesman = userGroupData.salesmanid;
        item.brand = userGroupData.brandid;
        item.productline = userGroupData.productlineid;
        item.dataareaid = this.sessionInfo.dataareaid;
        item.currencyCode = userGroupData.currencycode;
        item.modifiedDateTime = new Date(App.DateNow());
        item.lastModifiedBy = this.sessionInfo.userName;
        item.lastModifiedDate = new Date(App.DateNow());
      });
      let legerJournalTras: LedgerJournalTrans[] = await this.legerJournalTrasDAO.save(reqData.legerJournalTras);
      for (let item of reqData.legerJournalTras) {
        let legderData: any = {
          accountNum: item.accountNum,
          transDate: item.transdDate,
          txt: item.txt,
          region: userGroupData.regionId,
          department: userGroupData.departmentid,
          costcenter: userGroupData.costCenterId,
          employee: userGroupData.employeeid,
          project: userGroupData.projectid,
          salesman: userGroupData.salesmanid,
          brand: userGroupData.brandid,
          productline: userGroupData.productlineid,
          journalNum: userGroupData.journalnameid,
          modifiedDateTime: item.lastModifiedDate,
          lastModifiedDate: item.lastModifiedDate,
          modifiedBy: item.modifiedBy,
          createdDateTime: item.createDateTime,
          createdBy: this.sessionInfo.userName,
          currencyCode: userGroupData.currencycode,
          amountMst: item.amountCurCredit != 0 && item.amountCurCredit ? item.amountCurCredit : -item.amountCurDebit,
          recid: item.recid,
          recversion: item.recversion,
          accountpltype: item.accountType,
          dataareaid: userGroupData.dataareaid,
        };
        let deleteData: any = await this.ledgerTrasDAO.search({
          accountNum: item.accountNum,
          journalNum: item.journalNum,
        });
        await this.ledgerTrasDAO.delete(deleteData);
        ledgerTransData.push(legderData);
      }

      let ledgerTrasfer: LedgerTrans[] = await this.ledgerTrasDAO.save(ledgerTransData);
      return { id: reqData.journalNum, message: "SAVED_SUCCESSFULLY" };
    }
    // if (cond == "journalNum") {
    //   throw { message: "RECORD_ALREADY_EXISTS" };
    // }
    // } catch (error) {
    //   throw { message: "SERVER_SIDE_ERROR" };
    // }
  }

  async getaccountNum() {
    try {
      let usergroupconfig = await this.usergroupconfigDAO.findOne({
        inventlocationid: this.sessionInfo.inventlocationid,
      });
      let data: any;

      let seqNum = usergroupconfig.generaljournalsequencegroup;
      data = await this.rawQuery.getNumberSequence(seqNum);
      console.log(data);
      if (data) {
        let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
        let year: string = new Date().getFullYear().toString().substr(2, 2);

        data.nextrec = prevYear == year ? data.nextrec : 1;

        let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
        let salesId: string = data.format.replace(hashString, year) + "-" + data.nextrec;
        console.log(salesId);
        await this.rawQuery.updateNumberSequence(seqNum, data.nextrec);
        return salesId;
      } else {
        throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
      }
    } catch (error) {
      if (error == {}) {
        error = { message: "TECHNICAL_ISSUE,_PLEASE_CONTACT_YOUR_TECHNICAL_TEAM" };
      } else {
        throw { message: "SERVER_SIDE_ERROR" };
      }
    }
  }

  async validate(item: GeneralJournal) {
    let previousData = null;
    if (!item.journalNum || item.journalNum == "" || item.journalNum == "0") {
      item.journalNum = null;
    } else {
      previousData = await this.generalJournalDAO.findOne({ journalNum: item.journalNum });
    }
    item.lastModifiedBy = this.sessionInfo.userName;
    let mdata: any = [];
    if (item.journalNum) {
      mdata = await this.generalJournalDAO.search({ journalNum: item.journalNum });
    }
    // if (!item.journalNum) {
    if (item.journalNum == "null" || !item.journalNum) {
      item.journalNum = await this.getaccountNum();
      item.dataareaid = this.sessionInfo.dataareaid;
      item.createdBy = this.sessionInfo.userName;
      item.createdDatetime = new Date(App.DateNow());
      item.legerJournalTras.map((i: LedgerJournalTrans) => {
        i.journalNum = item.journalNum;
        i.createDateTime = new Date(App.DateNow());
        i.createdBy = this.sessionInfo.userName;
      });
    } else {
      console.log(item.journalNum);
      if (previousData) {
        if (item.journalNum != previousData.journalNum) {
          if (mdata.length > 0) {
            return "journalNum";
          }
        }
      }
    }
    item.modifiedDatetime = new Date(App.DateNow());
    item.lastModifiedBy = this.sessionInfo.userName;
    item.lastModifiedDate = new Date(App.DateNow());
    return true;
  }
  async delete(id: any) {
    try {
      let entity: any = await this.generalJournalDAO.entity(id);
      if (entity) {
        entity.deleted = true;
      } else {
        throw { message: "RECORD_NOT_FOUND" };
      }
      entity.deletedby = this.sessionInfo.userName;
      await this.generalJournalDAO.save(entity);
      return { id: entity.journalNum, message: "REMOVED" };
    } catch (error) {
      throw error;
    }
  }
}
