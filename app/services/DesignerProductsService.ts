import { App } from "../../utils/App";
import { Bases } from "../../entities/Bases";
import { DesignerProductsDAO } from "../repos/DesignerProductsDAO";
import { getManager } from "typeorm";
import { CacheService } from "../common/CacheService";
import { RawQuery } from "../common/RawQuery";

export class DesignerProductsService {
  public sessionInfo: any;
  private designerProductsDAO: DesignerProductsDAO;
  private db: any;
  private cacheService: CacheService;
  private rawQuery: RawQuery;

  constructor() {
    this.designerProductsDAO = new DesignerProductsDAO();
    this.cacheService = new CacheService();
    this.db = getManager();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.designerProductsDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(params: any) {
    try {
      console.log(params);
      params.dataareaid = this.sessionInfo.dataareaid;
      let data: any = await this.rawQuery.getDesignerProducts();
      let vat = await this.gettax();
      data.map((v: any) => {
        v.vat = vat;
        v.price = parseFloat(v.price);
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async gettax() {
    let query = `select CAST(td.taxvalue AS INTEGER) as tax from custtable c
        left join taxgroupdata tg on tg.taxgroup = c.taxgroup
        left join taxdata td on td.taxcode = tg.taxcode where c.accountnum = '${this.sessionInfo.defaultcustomerid}' `;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0].tax : 15;
  }
}
