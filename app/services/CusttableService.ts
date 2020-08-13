import { App } from "../../utils/App";
import { Custtable } from "../../entities/Custtable";
import { CusttableDAO } from "../repos/CusttableDAO";
import { Props } from "../../constants/Props";
import { getManager, Repository, TransactionRepository } from "typeorm";
import { RawQuery } from "../common/RawQuery";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { CacheService } from "../common/CacheService";

import { getConnection } from "typeorm";

export class CusttableService {
  public sessionInfo: any;
  private custtableDAO: CusttableDAO;
  private db: any;
  public custTable: Custtable;
  private rawQuery: RawQuery;
  public cacheService: CacheService;
  private usergroupconfigDAO: UsergroupconfigDAO;

  constructor() {
    this.db = getManager();
    this.custtableDAO = new CusttableDAO();
    this.custTable = new Custtable();
    this.rawQuery = new RawQuery();
    this.cacheService = new CacheService();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.custtableDAO.entity(id);
      if (!data) {
        data = await this.custtableDAO.findOne({ accountnum: id });
      }
      // let count = this.rawQuery.customers_count();
      console.log(data);
      if (data) {
        // data.Custgroup = {};
        return data;
      } else {
        return {};
      }
    } catch (error) {
      throw error;
    }
  }

  async getAvailableCreditLimit(accountNum: string) {
    const overDue = await this.rawQuery.getCustomerOverDue(accountNum);
    const creditUtilized = overDue.reduce((res: number, x: any) => res + parseFloat(x.invoiceamount), 0);
    const customerLimit = await this.custtableDAO.getCreditLimit(accountNum);
    return parseFloat(customerLimit.creditmax.toString()) - creditUtilized;
  }
  async search(item: any) {
    try {
      // if (item == {}) {
      let data: any = await this.custtableDAO.search(item);
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

  async paginate(item: any) {
    try {
      let additionalcustomer = this.sessionInfo.additionalcustomer
        ? this.sessionInfo.additionalcustomer.split(",")
        : [];
      let customergroup = this.sessionInfo.customergroup ? this.sessionInfo.customergroup.split(",") : [];
      let sabicCustomers = this.sessionInfo.sabiccustomers ? this.sessionInfo.sabiccustomers.trim().split(",") : [];
      item.additionalcustomer = "";
      item.sabiccustomers = "";
      item.customergroup = "";
      additionalcustomer.forEach((element: any) => {
        item.additionalcustomer +=
          additionalcustomer.indexOf(element) == additionalcustomer.length - 1
            ? "'" + element + "'"
            : "'" + element + "', ";
      });
      customergroup.forEach((element: any) => {
        item.customergroup +=
          customergroup.indexOf(element) == customergroup.length - 1 ? "'" + element + "'" : "'" + element + "', ";
      });
      sabicCustomers.forEach((element: any) => {
        console.log(element);
        item.sabiccustomers +=
          sabicCustomers.indexOf(element) == sabicCustomers.length - 1 ? "'" + element + "'" : "'" + element + "', ";
      });
      item.defaultcustomerid = this.sessionInfo.defaultcustomerid;
      let data = await this.custtableDAO.pagination(item);
      data.data.forEach((element: any) => {
        if (element.rcusttype && Props.RCUSTTYPE[element.rcusttype]) {
          element.rcusttypeen = Props.RCUSTTYPE[element.rcusttype][1];
          element.rcusttypear = Props.RCUSTTYPE[element.rcusttype][2];
        } else {
          element.rcusttypeen = "Individual";
          element.rcusttypear = "أفراد";
        }

        element.phone = !element.phone || element.phone.length <= 1 ? "N/A" : element.phone;
      });
      if (item.filter && item.filter != "null") {
        return { count: data.count, data: data.data };
      }
      return { count: data.count, data: data.data };
    } catch (error) {
      throw error;
    }
  }

  async mobile_paginate(item: any) {
    try {
      item.salesmanid = this.sessionInfo.salesmanid;
      let additionalcustomer = this.sessionInfo.additionalcustomer
        ? this.sessionInfo.additionalcustomer.split(",")
        : [];
      let customergroup = this.sessionInfo.customergroup ? this.sessionInfo.customergroup.split(",") : [];
      let sabicCustomers = this.sessionInfo.sabiccustomers ? this.sessionInfo.sabiccustomers.trim().split(",") : [];
      additionalcustomer = additionalcustomer ? additionalcustomer : [];
      customergroup = customergroup ? customergroup : [];
      item.additionalcustomer = "";
      item.customergroup = "";
      item.sabiccustomers = "";

      item.additionalcustomer = additionalcustomer.map((d: any) => `'${d}'`).join(",");
      item.customergroup = customergroup.map((d: any) => `'${d}'`).join(",");
      item.sabiccustomers = sabicCustomers.map((d: any) => `'${d}'`).join(",");
      item.defaultcustomerid = this.sessionInfo.defaultcustomerid;
      item.dataareaid = this.sessionInfo.dataareaid;
      let data = await this.custtableDAO.mobile_pagination(item);
      data.forEach((element: any) => {
        if (element.rcusttype && Props.RCUSTTYPE[element.rcusttype]) {
          element.rcusttypeen = Props.RCUSTTYPE[element.rcusttype][1];
          element.rcusttypear = Props.RCUSTTYPE[element.rcusttype][2];
        } else {
          element.rcusttypeen = "Individual";
          element.rcusttypear = "أفراد";
        }
        element.phone = !element.phone || element.phone.length <= 1 ? "N/A" : element.phone;
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: Custtable) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      delete reqData.Custgroup;
      console.log(reqData.Custgroup);
      let cond = await this.validate(reqData);
      console.log(cond);
      if (cond == true) {
        reqData.walkincustomer = true;
        //let customer = await this.custtableDAO.save(reqData);
        await queryRunner.manager.getRepository(Custtable).save(reqData);
        let returnData = { id: reqData.accountnum, message: "SAVED_SUCCESSFULLY" };
        await queryRunner.commitTransaction();
        return returnData;
      }
      if (cond == "updated") {
        throw { message: "UPDATED" };
      }
      if (cond == "phone") {
        throw { message: "RECORD_ALREADY_EXISTS" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validate(item: Custtable) {
    console.log(item.accountnum);
    let previousData = null;
    if (!item.accountnum || item.accountnum == "" || item.accountnum == "0") {
      item.accountnum = null;
    } else {
      console.log(item.accountnum);
      previousData = await this.custtableDAO.findOne({ accountnum: item.accountnum });
      console.log(previousData);
    }
    item.lastmodifiedby = this.sessionInfo.userName;
    let mdata = [];
    if (item.phone) {
      mdata = await this.custtableDAO.findAll({ phone: item.phone });
    } else {
      mdata = [];
    }
    // console.log(mdata);
    if (!item.accountnum) {
      if (mdata.length > 0) {
        return "phone";
      } else {
        item.accountnum = await this.getAccountNum();
        item.inventlocation = this.sessionInfo.inventlocationid;
        item.createdDateTime = new Date(App.DateNow());
        item.createdby = this.sessionInfo.userName;
      }
    } else {
      // console.log(item.accountnum);
      if (item.phone != previousData.phone) {
        if (mdata.length > 0) {
          return "phone";
        }
      }
    }
    item.lastmodifieddate = new Date(App.DateNow());
    item.lastmodifiedby = this.sessionInfo.userName;
    return true;
  }

  async getAccountNum() {
    let userGroupConfigData: any = await this.usergroupconfigDAO.findOne({ groupid: this.sessionInfo.groupid });
    let regionNumber = userGroupConfigData.regionId;
    let showroomId = userGroupConfigData.costCenterId;
    let data: any = await this.rawQuery.getNumberSequence("WC_ER18");
    let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
    let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
    let year: string = new Date().getFullYear().toString().substr(2, 2);

    data.nextrec = prevYear == year ? data.nextrec : 1;
    let accountNum: string = data.format.replace(
      hashString,
      regionNumber + "-" + showroomId + "-" + year + "-" + data.nextrec
    );
    console.log(accountNum);
    await this.rawQuery.updateNumberSequence("WC_ER18", data.nextrec);
    return accountNum;
  }

  async delete(accountNum: any) {
    try {
      let customer: any = await this.custtableDAO.entity(accountNum);
      if (customer) {
        customer.deleted = true;
      } else {
        customer = await this.custtableDAO.findOne({ accountnum: accountNum });
        customer.deleted = true;
      }

      await this.custtableDAO.save(customer);
      return { id: customer.accountnum, message: "REMOVED_SUCCESSFULLY" };
    } catch (error) {
      throw error;
    }
  }
}
