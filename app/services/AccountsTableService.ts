import { App } from "../../utils/App";
import { AccountsTable } from "../../entities/AccountsTable";
import { AccountsTableDAO } from "../repos/AccountsTableDAO";
import { Props } from "../../constants/Props";
import { RawQuery } from "../common/RawQuery";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";

export class AccountsTableService {
  public sessionInfo: any;
  private accountsTableDAO: AccountsTableDAO;
  private rawQuery: RawQuery;
  private usergroupconfigDAO: UsergroupconfigDAO;

  constructor() {
    this.accountsTableDAO = new AccountsTableDAO();
    this.rawQuery = new RawQuery();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.accountsTableDAO.entity(id);
      if (data) {
        data.closed = data.closed == 1 ? true : false;
        data.locked = data.locked == 1 ? true : false;
        data.createdDateTime = data.createdDateTime ? data.createdDateTime.toLocaleDateString() : data.createdDateTime;
        data.lastModifiedDate = data.lastModifiedDate
          ? data.lastModifiedDate.toLocaleDateString()
          : data.lastModifiedDate;
        return data;
      } else {
        throw { message: "DATA_NOT_FOUND" };
      }
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      item.dataareaid = this.sessionInfo.dataareaid;
      let data: any = await this.accountsTableDAO.search(item);
      data.map((element: any) => {
        element.accountTypeName = Props.ACCOUNT_TYPE[element.accountType];
        element.closed = element.closed == 1 ? true : false;
        element.locked = element.locked == 1 ? true : false;
        element.createdDatetime = element.createdDatetime
          ? element.createdDatetime.toLocaleDateString()
          : element.createdDatetime;
        element.lastModifiedDate = element.lastModifiedDate
          ? element.lastModifiedDate.toLocaleDateString()
          : element.lastModifiedDate;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async save(reqData: AccountsTable) {
    try {
      let cond = await this.validate(reqData);
      if (cond == true) {
        console.log(this.sessionInfo);
        let account: any = await this.accountsTableDAO.save(reqData);
        return { id: account.accountNum, message: 'SAVED_SUCCESSFULLY' };
      } else if (cond == "required") {
        throw { message: "ACCOUNT_NUM_REQUIREMENT" };
      } else if (cond == "accountNum") {
        throw { message: 'RECORD_ALREADY_EXISTS' };
      } else {
        throw { message: 'INVALID_DATA' };
      }
    } catch (error) {
      throw error;
    }
  }

  async getaccountNum() {
    try {
      let usergroupconfig = await this.usergroupconfigDAO.findOne({
        inventlocationid: this.sessionInfo.inventlocationid
      });
      let data: any;

      let seqNum = usergroupconfig.legeraccountsequencegroup;
      data = await this.rawQuery.getNumberSequence(seqNum);
      if (data) {
        let prevYear = new Date(data.lastmodifieddate)
          .getFullYear()
          .toString()
          .substr(2, 2);
        let year: string = new Date()
          .getFullYear()
          .toString()
          .substr(2, 2);

        data.nextrec = prevYear == year ? data.nextrec : 1;

        let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
        let salesId: string = data.format.replace(hashString, data.nextrec) + "-" + year;
        console.log(salesId);
        await this.rawQuery.updateNumberSequence(seqNum, data.nextrec);
        return salesId;
      } else {
        throw {message: 'CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE'}
      }
    } catch (error) {
      if (error == {}) {
        error = "SERVER_SIDE_ERROR";
      }
      throw error;
    }
  }

  async validate(item: AccountsTable) {
    let previousData = null;
    if (!item.accountNum || item.accountNum == "" || item.accountNum == "0") {
      item.accountNum = null;
      return "required";
    } else {
      previousData = await this.accountsTableDAO.findOne({ accountNum: item.accountNum });
    }
    item.lastModifiedBy = this.sessionInfo.userName;
    let mdata = await this.accountsTableDAO.search({ accountNum: item.accountNum });
    if (!previousData) {
      // item.accountNum = await this.getaccountNum();
      item.dataareaid = this.sessionInfo.dataareaid;
      item.createdBy = this.sessionInfo.userName;
      item.createdDatetime = new Date(App.DateNow());
    } else {
      console.log(item.accountNum);
      if (item.accountNum != previousData.accountNum) {
        if (mdata.length > 0) {
          return "accountNum";
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
      let accountsTable: any = await this.accountsTableDAO.entity(id);
      if (accountsTable) {
        accountsTable.deleted = true;
      } else {
        throw { message: Props.RECORD_NOT_FOUND };
      }
      accountsTable.deletedby = this.sessionInfo.userName;
      await this.accountsTableDAO.save(accountsTable);
      return { id: accountsTable.accountNum, message: 'REMOVED' };
    } catch (error) {
      throw error;
    }
  }
}
