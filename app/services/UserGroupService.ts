import { App } from "../../utils/App";
import { UserInfo } from "../../entities/UserInfo";
import { UsergroupDAO } from "../repos/UsergroupDAO";
import { Props } from "../../constants/Props";
import { getManager } from "typeorm";
import { RawQuery } from "../common/RawQuery";
import { Usergroup } from "../../entities/Usergroup";
import { json } from "body-parser";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { Usergroupconfig } from "../../entities/Usergroupconfig";
import { UsergroupConfigService } from "./UsergroupConfigService";
var uuid = require("uuid");

export class UserGroupService {
  public sessionInfo: any;
  private usergroupDAO: UsergroupDAO;
  private db: any;
  public userInfo: UserInfo;
  private rawQuery: RawQuery;
  private userGroupConfigDAO: UsergroupconfigDAO;
  private userGroupConfigService: UsergroupConfigService;

  constructor() {
    this.db = getManager();
    this.usergroupDAO = new UsergroupDAO();
    this.userInfo = new UserInfo();
    this.rawQuery = new RawQuery();
    this.userGroupConfigService = new UsergroupConfigService();
    this.userGroupConfigDAO = new UsergroupconfigDAO();
    this.userGroupConfigService.sessionInfo = this.sessionInfo;
  }

  async entity(id: string) {
    try {
      let data: any = await this.usergroupDAO.entity(id);
      if (!data) {
        data = await this.usergroupDAO.findOne({ groupid: id });
        data.Custgroup = {};
      }
      // let count = this.rawQuery.customers_count();
      console.log(data);
      if (data) {
        data.permissiondata = JSON.parse(data.permissiondata);
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
      let data: any = await this.usergroupDAO.search(item);
      data.map((item: any) => {
        delete item.password;
        item.permissiondata = JSON.parse(item.permissiondata);
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: any) {
    try {
      let cond = await this.validate(reqData);
      console.log(cond);
      reqData.permissiondata = JSON.stringify(reqData.permissiondata);
      if (cond == true) {
        reqData.lastmodifieddate = new Date(App.DateNow());
        let user = await this.usergroupDAO.save(reqData);
        let returnData = { id: reqData.groupid, message: 'SAVED_SUCCESSFULLY' };
        return returnData;
      }
      if (cond == "groupname") {
        throw { message: 'RECORD_ALREADY_EXISTS' };
      } else {
        throw { message: 'INVALID_DATA' };
      }
    } catch (error) {
      throw error;
    }
  }

  async validate(item: Usergroup) {
    console.log(item.groupid);
    let userGroupData: any = {};
    let previousData = null;
    if (!item.groupid || item.groupid == "" || item.groupid == "0") {
      item.groupid = null;
    } else {
      console.log(item.groupid);
      previousData = await this.usergroupDAO.entity(item.groupid);
      // console.log(previousData);
      let userGroupPreviousData: any = this.userGroupConfigDAO.findAll({ groupid: item.groupid });
      if (userGroupPreviousData.length == 0) {
        userGroupData.groupid = item.groupid;
        userGroupData.lastmodifiedby = this.sessionInfo.userName;
        userGroupData.lastmodifieddate = new Date(App.DateNow())
        await this.userGroupConfigDAO.save(userGroupData);
      }
    }
    item.lastmodifiedby = this.sessionInfo.userName;
    item.lastmodifieddate = new Date(App.DateNow());
    let mdata = await this.usergroupDAO.findAll({ groupname: item.groupname });
    // console.log(mdata);
    if (!item.groupid) {
      if (mdata.length > 0) {
        return "groupname";
      } else {
        item.groupid = uuid();
        // item.permissiondata = item.role == "ROLE_ADMIN" ? Props.GROUP_ADMIN_PERMISSIONS : Props.GROUP_NORMAL_PERMISSIONS;
        item.deleted = false;
        item.createddatetime = new Date(App.DateNow());
        item.createdby = this.sessionInfo.userName;
        userGroupData.groupid = item.groupid;
        userGroupData.lastmodifiedby = this.sessionInfo.userName;
        await this.userGroupConfigDAO.save(userGroupData);
      }
    } else {
      console.log(item.groupname);
      console.log(previousData.groupname);
      if (item.groupname != previousData.groupname) {
        if (mdata.length > 0) {
          return "groupname";
        }
      }
    }

    return true;
  }

  async delete(id: any) {
    try {
      let userGroup: Usergroup = await this.usergroupDAO.entity(id);
      if (userGroup) {
        userGroup.deleted = true;
      } else {
        userGroup = await this.usergroupDAO.findOne({ groupid: id });
        userGroup.deleted = true;
      }
      userGroup.deletedby = this.sessionInfo.yserName;
      await this.usergroupDAO.save(userGroup);
      return { id: userGroup.groupid, message: 'REMOVED' };
    } catch (error) {
      throw error;
    }
  }
}
