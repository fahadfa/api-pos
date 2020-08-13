import { App } from "../../utils/App";
import { UserInfo } from "../../entities/UserInfo";
import { UserinfoDAO } from "../repos/UserinfoDAO";
import { Props } from "../../constants/Props";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";
var uuid = require("uuid");

export class UsesrInfoService {
  public sessionInfo: any;
  private userinfoDAO: UserinfoDAO;
  private db: any;
  public userInfo: UserInfo;
  private rawQuery: RawQuery;

  constructor() {
    this.db = getManager();
    this.userinfoDAO = new UserinfoDAO();
    this.userInfo = new UserInfo();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.userinfoDAO.entity(id);
      if (!data) {
        data = await this.userinfoDAO.findOne({ id: id });
        data.Custgroup = {};
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
      let data: any;
      if (item.groupid) {
        let groupid = item.groupid;
        delete item.groupid;
        data = await this.userinfoDAO.search(item);
        data.map((item: any) => {
          delete item.password;
        });
        let attachedToGroup: any[] = [];
        let notAttachedToGroup: any[] = [];
        data.forEach((element: any) => {
          delete element.password;
          if (element.groupid == groupid) {
            attachedToGroup.push(element);
          } else {
            notAttachedToGroup.push(element);
          }
        });
        data = { UsersAttachedToGroup: attachedToGroup, UsersNotAttachedToGroup: notAttachedToGroup };
      } else {
        data = await this.userinfoDAO.search(item);
        data.map((item: any) => {
          delete item.password;
        });
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: any) {
    try {
      let cond = await this.validate(reqData);
      console.log(cond);
      if (cond == true) {
        reqData.lastmodifieddate = new Date(App.DateNow());
        reqData.lastmodifiedby = this.sessionInfo.userName;
        reqData.userGroup = { groupid: reqData.groupid };
        let user = await this.userinfoDAO.save(reqData);
        let returnData = { id: reqData.id, password: reqData.normalPassword, message: Props.SAVED_SUCCESSFULLY };
        return returnData;
      }
      if (cond == "userName") {
        throw { message: "RECORD_ALREADY_EXISTS" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async validate(item: any) {
    console.log(item.accountnum);
    let previousData: any;
    if (!item.id || item.id == "" || item.id == "0") {
      item.id = null;
    } else {
      console.log(item.id);
      previousData = await this.userinfoDAO.entity(item.id);
      console.log(previousData);
    }
    item.lastmodifiedby = this.sessionInfo.userName;
    let mdata = await this.userinfoDAO.findAll({ userName: item.userName });
    // console.log(mdata);
    if (!item.id) {
      if (mdata.length > 0) {
        return "userName";
      } else {
        item.id = uuid();
        item.deleted = false;
        console.log(item.id);
        item.normalPassword = Math.random()
          .toString(36)
          .substring(7);
        item.password = App.HashSync(item.normalPassword);
        item.createddatetime = new Date(App.DateNow());
        item.createdby = this.sessionInfo.userName;
        await App.SendMail(item.email, `Jaz Sales account activation for '${item.userName}`, "User", {
          name: item.userName,
          password: item.normalPassword
        });
      }
    } else {
      if (previousData) {
        let prevData: any = mdata.filter((v: any) => v.id !== previousData.id);
        if (prevData.length > 0) {
          return "userName";
        } else {
          return true;
        }
      }
    }

    return true;
  }

  async changePassword(reqData: any) {
    try {
      let user: any = await this.userinfoDAO.entity(this.sessionInfo.id);
      if (reqData.oldPassword && App.HashCompareSync(reqData.oldPassword, user.password)) {
        user.userGroupConfig = user.userGroupConfig == null ? {} : user.userGroupConfig;
        user.userGroup = user.userGroup == null ? {} : user.userGroup;
        user.password = App.HashSync(reqData.newPassword);
        user.lastmodifieddate = new Date(App.DateNow());
        await this.userinfoDAO.save(user);
      } else {
        throw { message: "INVALID_PASSWORD" };
      }
      return { id: user.id, message: "PASSWORD_UPDATED", status: 1 };
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let user: UserInfo = await this.userinfoDAO.entity(id);
      // if (user) {
      //     user.deleted = true;
      // } else {
      //     user = await this.userinfoDAO.findOne({ id: id });
      //     user.deleted = true;
      // }
      // user.deletedby = this.sessionInfo.userName;
      // user.deleteddatetime = new Date();
      await this.userinfoDAO.delete(user);
      return { id: user.id, message: Props.REMOVED_SUCCESSFULLY };
    } catch (error) {
      throw error;
    }
  }
}
