import { RawQuery } from "../common/RawQuery";
import { CusttableDAO } from "../repos/CusttableDAO";
import { getManager } from "typeorm";
import { Props } from "../../constants/Props";

export class PriceService {
  public sessionInfo: any;
  private rawQuery: RawQuery;
  private custtableDAO: CusttableDAO;
  private db: any;

  constructor() {
    this.rawQuery = new RawQuery();
    this.custtableDAO = new CusttableDAO();
    this.db = getManager();
  }

  async getPrice(reqData: any) {
    try {
      let defaultcustomer: any;
      if (!reqData.pricegroup) {
        this.rawQuery.sessionInfo = this.sessionInfo
        defaultcustomer = await this.rawQuery.getCustomer(this.sessionInfo.defaultcustomerid);
        // console.log(defaultcustomer);
        reqData.pricegroup = defaultcustomer.pricegroup;
        reqData.currency = defaultcustomer.currency;
      }
      let queryData: any = {
        custaccount: reqData.custaccount,
        itemid: reqData.itemid,
        inventsizeid: reqData.inventsizeid,
        pricegroup: reqData.pricegroup,
        configid: reqData.configid,
        currency: "SAR",
        dataareaid: reqData.dataareaid,
        warehouseid: reqData.warehouseid
      };

      // let amount: any = await this.rawQuery.getHighPrice(queryData);
      let amount: any = [];
      // if (amount.length == 0) {
      amount = await this.rawQuery.getCustomerSpecificPrice(queryData);
      // }
      if (amount.length == 0) {
          amount = await this.rawQuery.getNormalPrice(queryData);
      }
      // console.log(amount);
      if (amount.length == 0) {
        try {
          defaultcustomer = !defaultcustomer ? await this.custtableDAO.entity(this.sessionInfo.defaultcustomerid) : defaultcustomer;
          // console.log(defaultcustomer);
          queryData.pricegroup = defaultcustomer.pricegroup;
          queryData.currency = defaultcustomer.currency;
          let amount: any = [];
          // amount: any = await this.rawQuery.getHighPrice(queryData);
          // if (amount.length == 0) {
          amount = await this.rawQuery.getCustomerSpecificPrice(queryData);
          // }
          if (amount.length == 0) {
              amount = await this.rawQuery.getNormalPrice(queryData);
          }
          if (amount.length == 0) {
            return { amount: 0 };
          } else {
            // console.log(amount);
            amount[0].amount = Math.ceil(amount[0].amount);
            return amount[0];
          }
        } catch {
          return { amount: 0 };
        }
      } else {
        // console.log(amount);
        amount[0].amount = Math.ceil(amount[0].amount);
        return amount[0];
      }
    } catch (error) {
      throw error;
    }
  }

  async getPrices(reqData: any) {
    console.log(reqData);
    try {
      let defaultcustomer: any;

      if (!reqData.pricegroup) {
        this.rawQuery.sessionInfo = this.sessionInfo
        defaultcustomer = await this.rawQuery.getCustomer(this.sessionInfo.defaultcustomerid);
        reqData.pricegroup = defaultcustomer.pricegroup;
        reqData.currency = defaultcustomer.currency;
      }
      let queryData: any = {
        custaccount: reqData.custaccount,
        itemid: reqData.itemid,
        inventsizeid: reqData.inventsizeid,
        pricegroup: reqData.pricegroup,
        configid: reqData.configid,
        currency: "SAR",
        dataareaid: reqData.dataareaid,
        warehouseid: reqData.warehouseid
      };
      let inQueryStr = "";
      if (reqData.inventsizeids.length > 0) {
        reqData.inventsizeids.map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        inQueryStr = inQueryStr.substr(0, inQueryStr.length - 1);
      }
      queryData.inventsizeids = inQueryStr;

      let amounts: any = [];

      for (let sizeid of reqData.inventsizeids) {
        let amount: any = [];
        queryData.inventsizeid = sizeid;
        amount = await this.rawQuery.getCustomerSpecificPrice(queryData);
        // console.log(amount)
        if (amount.length <= 0) {
          // console.log(amount)
          amount = await this.rawQuery.sizePrices(queryData);
        }
        if (amount.length > 0) {
          amounts.push(amount[0]);
        }
      }
      amounts.map((v: any) => {
        v.configid = reqData.configid;
        v.price = Math.ceil(v.price);
      });
      return amounts;
    } catch (error) {
      throw error;
    }
  }
}
