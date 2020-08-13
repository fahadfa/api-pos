import { App } from "../../utils/App";
import { Products } from "../../entities/Products";
import { InventsizeDAO } from "../repos/InventsizeDAO";
import { Props } from "../../constants/Props";
import { RawQuery } from "../common/RawQuery";

export class InventsizeService {
  public sessionInfo: any;
  private inventsizeDAO: InventsizeDAO;
  private rawQuery: RawQuery;

  constructor() {
    this.inventsizeDAO = new InventsizeDAO();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.inventsizeDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(reqData: any) {
    try {
      let data: any;
      console.log(reqData);
      if (reqData.itemid && reqData.configid) {
        let items = await this.rawQuery.getSizeCodes(reqData);
        if (items.length > 0) {
          items.map((v: string) => {
            items.push(v.toLowerCase());
          });
          data = await this.inventsizeDAO.search(reqData, items);
        } else {
          data = [];
        }
        reqData.sizes = data;
        return await this.getPrices(reqData);
      } else {
        throw { message: "itemid and configid Required" };
      }
    } catch (error) {
      throw error;
    }
  }

  async searchSalesOrderSizes(params: any) {
    try {
      console.log(params);
      if (params.itemid && params.configid) {
        var t0 = new Date().getTime();
        params.inventlocationid = this.sessionInfo.inventlocationid;
        let items: any = await this.rawQuery.getSizeCodesInStock(params);
        // console.log(Items);
        items.map((v: string) => {
          items.push(v.toLowerCase());
        });
        if (items.length > 0) {
          let data = await this.inventsizeDAO.search(params, items);
          console.log(data.length);
          var t1 = new Date().getTime();
          console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
          params.sizes = data;
          return await this.getPrices(params);
        } else {
          return [];
        }
      } else {
        throw { message: "itemid and configid Required" };
      }
    } catch (error) {
      throw error;
    }
  }

  async searchSizesWithNoPrice(params: any) {
    try {
      console.log(params);
      if (params.itemid && params.configid) {
        var t0 = new Date().getTime();
        let data: any = [];
        params.inventlocationid = this.sessionInfo.inventlocationid;
        // console.log(Items);
        let items = await this.rawQuery.getSizeCodes(params);
        items.map((v: string) => {
          items.push(v.toLowerCase());
        });
        if (items.length > 0) {
          data = await this.inventsizeDAO.search(params, items);
        } else {
          data = [];
        }
        console.log(data.length);
        var t1 = new Date().getTime();
        console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
        data.map((v: any) => {
          v.price = 0;
        });
        return data;
      } else {
        throw { message: "itemid and configid Required" };
      }
    } catch (error) {
      throw error;
    }
  }

  async getPrices(reqData: any) {
    if (!reqData.pricegroup) {
      this.rawQuery.sessionInfo = this.sessionInfo
      let defaultcustomer = await this.rawQuery.getCustomer(this.sessionInfo.defaultcustomerid);
      reqData.pricegroup = defaultcustomer.pricegroup;
      reqData.currency = defaultcustomer.currency;
    }
    reqData.spGroup = 'SP'
    let queryData: any = {
      custaccount: reqData.custaccount,
      itemid: reqData.itemid,
      pricegroup: reqData.pricegroup,
      configid: reqData.configid,
      spGroup:reqData.spGroup ,
      currency: "SAR",
      inventsizeids: [],
    };
    for (let size of reqData.sizes) {
      queryData.inventsizeids.push(size.code);
    }
    queryData.inventsizeids = queryData.inventsizeids.map((d: any) => `'${d}'`).join(",");
    let prices: any = await this.rawQuery.allSizePrices(queryData);
    // console.log(prices);
    for (let size of reqData.sizes) {
      let amount: any = prices.filter(
        (v: any) => v.inventsizeid == size.code && v.accountrelation == queryData.custaccount
      );
      if (amount.length <= 0) {
        amount = prices.filter((v: any) => v.inventsizeid == size.code && v.accountrelation == queryData.pricegroup);
      }
      if (amount.length <= 0) {
        amount = prices.filter((v: any) => v.inventsizeid == size.code && v.accountrelation == queryData.spGroup);
      }
      if (amount.length > 0) {
        size.price = parseFloat(amount[0].price);
      } else {
        size.price = 0;
      }
    }
    return reqData.sizes;
  }
}
