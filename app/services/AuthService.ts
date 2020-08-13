import { UserinfoDAO } from "../repos/UserinfoDAO";
import { UsergroupDAO } from "../repos/UsergroupDAO";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";

import { generate } from "randomstring";

import { App } from "../..//utils/App";
import { Props } from "../../constants/Props";
import * as Config from "../../utils/Config";
import { UserInfo } from "../../entities/UserInfo";
import { Usergroup } from "../../entities/Usergroup";
import { Usergroupconfig } from "../../entities/Usergroupconfig";
import { RawQuery } from "../common/RawQuery";
import { MenuGroupDAO } from "../repos/MenuGroupDAO";

export class AuthService {
  public sessionInfo: any;
  private userinfoDAO: UserinfoDAO;
  private providers: any;
  private transporter: any;
  private rawQuery: RawQuery;
  private menuGroupRepository: MenuGroupDAO;

  constructor() {
    this.userinfoDAO = new UserinfoDAO();
    this.rawQuery = new RawQuery();
    this.menuGroupRepository = new MenuGroupDAO();
  }

  signin(reqData: any): any {
    console.log(reqData);
    return this.Response(reqData);
  }

  async reteriveUserDetails(accountObj: any) {
    try {
      var responseData: any = {};
      // let query = { id: userid };
      // var accountObj: UserInfo = await this.userinfoDAO.findOne(query);
      let menuList = await this.menuGroupRepository.search({ group: { groupid: accountObj.groupid }, active: true });
      let salesmanids: any[] = [];
      menuList = await this.unflatten(menuList);
      if (accountObj.userGroupConfig && accountObj.userGroupConfig.inventlocationid) {
        var wareHouse = await this.rawQuery.getWareHouseDetails(accountObj.userGroupConfig.inventlocationid);
        if (accountObj.userGroupConfig.salesmanid && accountObj.userGroupConfig.salesmanid !== "") {
          salesmanids = await this.rawQuery.salesmanList(accountObj.userGroupConfig.salesmanid);
        } else {
          salesmanids = [];
        }
      }

      let wareHouseNamear = wareHouse && wareHouse.length > 0 ? wareHouse[0].name : "";
      let wareHouseNameEn = wareHouse && wareHouse.length > 0 ? wareHouse[0].namealias : "";

      if (accountObj != null) {
        responseData.user = {};
        responseData.user.id = accountObj.id;
        responseData.user.userName = accountObj.userName;
        responseData.user.fullName = accountObj.fullName;
        responseData.user.email = accountObj.email;
        responseData.user.role = accountObj.role;
        responseData.user.status = accountObj.status;
        responseData.user.securitytoken = accountObj.securitytoken;
        responseData.user.phone = accountObj.phone;
        responseData.user.groupid = accountObj.groupid;
        responseData.menuList = menuList;
        responseData.user.role = accountObj.userGroup ? accountObj.userGroup.role : null;
        responseData.usergroupconfigid = accountObj.userGroupConfig.id;
        responseData.user.usergroupconfigid = accountObj.userGroupConfig.id;
        responseData.user.wareHouseName = accountObj.userGroup ? accountObj.userGroup.groupname : null;
        responseData.user.wareHouseNameEn = wareHouseNameEn;
        responseData.user.wareHouseNameAr = wareHouseNamear;
        responseData.warehouse = accountObj.userGroupConfig.inventlocationid;
        responseData.dataareaid = accountObj.userGroupConfig.dataareaid;
        responseData.user.dataareaid = accountObj.userGroupConfig.dataareaid;
        responseData.user.inventlocationid = accountObj.userGroupConfig.inventlocationid;
        responseData.user.defaultcustomerid = accountObj.userGroupConfig.defaultcustomerid;
        responseData.user.additionalcustomer = accountObj.userGroupConfig.additionalcustomer;
        responseData.user.sabiccustomers = accountObj.userGroupConfig.sabiccustomers;
        responseData.user.customergroup = accountObj.userGroupConfig.customergroup;
        responseData.user.workflowcustomers = accountObj.userGroupConfig.workflowcustomers;
        responseData.user.salesmanid = salesmanids;
        responseData.user.ledgerAccount = accountObj.userGroupConfig.ledgeraccount;
        responseData.identity = {};
        responseData.identity = responseData.user;
        delete responseData.user;

        responseData.access_token = App.EncodeJWT({ identity: responseData.identity });
        responseData.token = {};
        responseData.token.refresh = responseData.access_token;
      } else {
        return Promise.reject({
          message: "INVALID_USERNAME/PASSWORD",
        });
      }
      if (process && process.env && process.env.ENV_STORE_ID) {
        if (responseData && responseData.user && responseData.user.inventlocationid != process.env.ENV_STORE_ID) {
          return Promise.reject({
            message: "User not releated to this store.",
          });
        }
      }
      return Promise.resolve(responseData);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  unflatten(arr: any) {
    let newData: any = [];
    for (let item of arr) {
      if (!item.menu.parentId) {
        let children = arr.filter((v: any) => v.menu.parentId == item.menu.id);
        item.children = children;
        newData.push(item);
      }
    }
    return newData;
  }

  async Response(reqData: any) {
    let isVid: boolean = true;
    var responseData: any = {};
    let query: any = { userName: reqData.userName.trim(), email: reqData.userName };
    console.log("---------query------------");
    console.log(query);
    var profileObj: UserInfo = await this.userinfoDAO.findOne(query);
    console.log(profileObj);
    if (profileObj == null) {
      return Promise.reject({ message: "INVALID_USERNAME/PASSWORD" });
    } else {
      let auth = false;
      auth = App.HashCompareSync(reqData.password, profileObj.password);
      console.log("Auth: " + auth);
      if (auth == true) {
        if (profileObj.status == "ACTIVE") {
          try {
            return this.reteriveUserDetails(profileObj);
          } catch (err) {
            return Promise.reject({ message: "NO_GROUP_FOR_THIS_USER" });
          }
        } else {
          return Promise.reject({
            message: "ACCOUNT_DEACTIVATED_PLEASE_CONTACT_ADMIN",
          });
        }
      } else {
        return Promise.reject({
          message: "INVALID_USERNAME/PASSWORD",
        });
      }
    }
  }

  async forgotPassword(reqData: any) {
    try {
      let profileObj: any = null;
      profileObj = await this.userinfoDAO.findOne({ userName: reqData.userName.trim(), email: reqData.userName });
      if (!profileObj) {
        profileObj = await this.userinfoDAO.findOne({ email: reqData.userName, userName: reqData.userName });
      }
      // return profileObj;
      if (profileObj) {
        profileObj.userGroupConfig = profileObj.userGroupConfig == null ? {} : profileObj.userGroupConfig;
        profileObj.userGroup = profileObj.userGroup == null ? {} : profileObj.userGroup;
        profileObj.resetkey = App.generateOTP(10);
        await this.userinfoDAO.save(profileObj);
        try {
          await App.SendMail(
            profileObj.email,
            `Jaz Sales account activation for '${profileObj.userName}`,
            "ForgotPassword",
            {
              name: profileObj.userName,
              securitytoken: profileObj.resetkey,
            }
          );
        } catch (error) {
          console.log(error);
          throw { message: "RESET_TOKEN_NOT_SENT", status: 0 };
        }
      } else {
        throw { message: "INVALID_USERNAME", status: 0 };
      }
      return { message: "PASSWORD_RESET_TOKEN_SENT_TO_MAIL", status: 1 };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(reqData: any) {
    try {
      console.log(reqData);
      let profileObj: any = null;
      profileObj = await this.userinfoDAO.findOne({ userName: reqData.userName, email: reqData.userName });
      if (!profileObj) {
        profileObj = await this.userinfoDAO.findOne({ email: reqData.userName, userName: reqData.userName });
      }
      if (profileObj.resetkey == reqData.token) {
        profileObj.userGroupConfig = profileObj.userGroupConfig == null ? {} : profileObj.userGroupConfig;
        profileObj.userGroup = profileObj.userGroup == null ? {} : profileObj.userGroup;
        profileObj.password = App.HashSync(reqData.password);
        profileObj.resetkey = null;
        let data = await this.userinfoDAO.save(profileObj);
        return { message: "SAVED_SUCCESSFULLY", status: 1 };
      } else {
        throw { message: "INVALID_TOKEN", status: 0 };
      }
      return { message: "PASSWORD_UPDATED", status: 0 };
    } catch (error) {
      throw error;
    }
  }
}
