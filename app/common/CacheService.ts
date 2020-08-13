import { getManager } from "typeorm";
import NodeCache from "node-cache";
import { log } from "../../utils/Log";
import { BasesDAO } from "../repos/BasesDAO";

export class CacheService {
  private static customerData: any[] = null;
  private db: any;
  private static NodeCache: NodeCache = new NodeCache({ checkperiod: 300, useClones: false });
  private basesDAO: BasesDAO;
  constructor() {
    //this.nodeCache = new NodeCache({ checkperiod: 300, useClones: false });
    this.db = getManager();
    this.basesDAO = new BasesDAO();
    // this.init();
  }

  public static async Cache(key: any, value?: any) {
    if (value && value != null) {
      await CacheService.NodeCache.set(key, value);
      return null;
    } else {
      let data = CacheService.NodeCache.get(key);
      return Promise.resolve(data);
    }
  }

  async init() {
    console.log("|||||||| CACHE INIT ||||||||||");
    await this.app_lang("Reload");
    //    this.file_data(null);
    return Promise.resolve({ message: "All cache refresh." });
  }

  async app_lang(param: any) {
    param == "Reload";
    try {
      let cacheData: any = await CacheService.Cache("app_lang");
      let length = cacheData ? cacheData.length : -1;
      if (param == "Reload") {
        CacheService.Cache("app_lang", []);
        length = -1;
      }
      if (length == -1) {
        let query: any = `select id, en, ar from app_lang order by id asc`;
        let data: any = await this.db.query(query);
        let returnData: any = {};
        let obj: any;
        data.forEach((element: any) => {
          returnData[element.id] = { en: element.en, ar: element.ar };
        });
        CacheService.Cache("app_lang", returnData);
      }
      return CacheService.Cache("app_lang");
    } catch (error) {
      throw error;
    }
  }
  async quotationProducts(param: any) {
    try {
      let cacheData: any = await CacheService.Cache("quotationProducts");
      let length = cacheData ? cacheData.length : -1;
      if (param == "Reload") {
        CacheService.Cache("quotationProducts", []);
        length = -1;
      }
      if (length == -1) {
        let query: any = `select id, en, ar from app_lang order by id asc`;
        let data: any = await this.db.query(query);
        let returnData: any = {};
        let obj: any;
        data.forEach((element: any) => {
          returnData[element.id] = { en: element.en, ar: element.ar };
        });
        CacheService.Cache("app_lang", returnData);
      }
      return CacheService.Cache("app_lang");
    } catch (error) {
      throw error;
    }
  }
}
