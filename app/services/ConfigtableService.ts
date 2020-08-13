import { App } from "../../utils/App";
import { Products } from "../../entities/Products";
import { ConfigtableDAO } from "../repos/ConfigtableDAO";
import { Props } from "../../constants/Props";
import { RawQuery } from "../common/RawQuery";

export class ConfigtableService {
  public sessionInfo: any;
  private configtableDAO: ConfigtableDAO;
  private rawQuery: RawQuery;

  constructor() {
    this.configtableDAO = new ConfigtableDAO();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.configtableDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(reqData: any) {
    try {
      let data: any;
      if (reqData.itemid) {
        let items = await this.rawQuery.getColorCodes(reqData);

        if (items.length > 0) {
          data = await this.configtableDAO.search(reqData, items);
        } else {
          data = [];
        }
      } else {
        throw "itemid Required";
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async searchSalesOrderColors(params: any) {
    try {
      // console.log(params);
      if (params.itemid) {
        // var t0 = new Date().getTime();
        params.inventlocationid = this.sessionInfo.inventlocationid;
        let Items: any = await this.rawQuery.getColorCodesInStock(params);
        let data: any[] = [];
        // console.log(Items);
        if (Items.length > 0) {
          data = await this.configtableDAO.search(params, Items);
          console.log(data.length);
        }
        // var t1 = new Date().getTime();
        // console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
        return data;
      } else {
        throw "itemid Required";
      }
    } catch (error) {
      throw error;
    }
  }
}
