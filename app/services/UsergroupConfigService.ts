import { App } from "../../utils/App";
import { UserInfo } from "../../entities/UserInfo";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { UsergroupDAO } from "../repos/UsergroupDAO";
import { Props } from "../../constants/Props";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";
import { Usergroup } from "../../entities/Usergroup";
import { Usergroupconfig } from "../../entities/Usergroupconfig";
var uuid = require("uuid");

export class UsergroupConfigService {
  public sessionInfo: any;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private usergroupDAO: UsergroupDAO;
  private db: any;
  public userInfo: UserInfo;
  private rawQuery: RawQuery;

  constructor() {
    this.db = getManager();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.usergroupDAO = new UsergroupDAO();
    this.userInfo = new UserInfo();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.usergroupconfigDAO.entity(id);
      if (!data) {
        data = await this.usergroupconfigDAO.findOne({ groupid: id });
        data ? (data.Custgroup = {}) : (data = {});
      }
      // let count = this.rawQuery.customers_count();
      console.log(data);
      if (data) {
        return data;
      } else {
        return {};
      }
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any = await this.usergroupconfigDAO.search(item);
      data.map((item: any) => {
        delete item.password;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findOne() {
    try {
      let data: any = await this.usergroupconfigDAO.findOneEntity();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async saveAll(data: any) {
    try {
      await this.usergroupconfigDAO.saveAll(data);
      await this.rawQuery.updateSynctable()
      let returnData = { message: "SAVED_SUCCESSFULLY" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: any) {
    try {
      let sequenceGroupList = [
        "quotationsequencegroup",
        "salesordersequencegroup",
        "returnordersequencegroup",
        "returnordersequencegroup",
        "movementsequencegroup",
        "transferordersequencegroup",
        "ordershipmentsequencegroup",
        "orderreceivesequencegroup",
        "purchaserequestsequencegroup",
        "purchaseordersequencegroup",
      ];
      let itemsNotInNumSeq: any = [];
      for (let seq of sequenceGroupList) {
        let numberSeq: any = await this.rawQuery.getNumberSeq(reqData[seq]);
        console.log(numberSeq);
        if (numberSeq.length === 0) {
          itemsNotInNumSeq.push(seq);
        }
      }
      console.log(itemsNotInNumSeq);
      if (itemsNotInNumSeq.length > 0) {
        throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
      }
      let cond = await this.validate(reqData);
      console.log(cond);
      if (cond == true) {
        reqData.lastmodifieddate = new Date(App.DateNow());
        let promiseList: any[] = [];
        promiseList.push(this.usergroupconfigDAO.save(reqData));
        promiseList.push(this.update_user_group(reqData));
        await Promise.all(promiseList);
        console.log("======================================")
        await this.rawQuery.updateSynctable(reqData.inventlocationid)
        let returnData = { id: reqData.id, message: "SAVED_SUCCESSFULLY" };
        return returnData;
      }
      if (cond == "groupname") {
        throw { message: "RECORD_ALREADY_EXISTS" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async update_user_group(data: any) {
    let group: Usergroup = await this.usergroupDAO.entity(data.groupid);
    group.lastmodifieddate = new Date(App.DateNow());
    await this.usergroupDAO.save(group);
  }

  async validate(item: any) {
    let previousData = null;
    if (!item.groupid || item.groupid == "" || item.groupid == "0") {
      item.groupid = null;
    } else {
      console.log(item.groupid);
      previousData = await this.usergroupconfigDAO.entity(item.id);
      console.log(previousData);
    }
    item.lastmodifiedby = this.sessionInfo ? this.sessionInfo.userName : item.lastmodifiedby;
    let mdata = await this.usergroupconfigDAO.findAll({ groupid: item.groupid });
    console.log(mdata);
    if (!item.id) {
      if (mdata.length > 0) {
        return "groupid";
      } else {
        item.id = uuid();
        item.deleted = false;
      }
    } else {
      // console.log(item.accountnum);
      if (item.id != previousData.id) {
        if (mdata.length > 0) {
          return "groupname";
        }
      }
    }
    item.lastmodifieddate = new Date(App.DateNow());
    return true;
  }

  async delete(id: any) {
    try {
      let usergroupconfig: Usergroupconfig = await this.usergroupconfigDAO.entity(id);
      if (usergroupconfig) {
        usergroupconfig.deleted = true;
      } else {
        usergroupconfig = await this.usergroupconfigDAO.findOne({ id: id });
        usergroupconfig.deleted = true;
      }
      usergroupconfig.deletedby = this.sessionInfo.userName;
      await this.usergroupconfigDAO.save(usergroupconfig);
      return { id: usergroupconfig.groupid, message: "REMOVED" };
    } catch (error) {
      throw error;
    }
  }
}
