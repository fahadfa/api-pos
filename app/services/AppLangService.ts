import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { AppLang } from "../../entities/AppLang";
import { AppLangRepository } from "../repos/AppLangRepository";
import { CacheService } from "../common/CacheService";

export class AppLangService {
  public sessionInfo: any;
  private appLangRepository: AppLangRepository;
  private cacheService: CacheService;

  constructor() {
    this.appLangRepository = new AppLangRepository();
    this.cacheService = new CacheService();
  }

  async entity(id: string) {
    try {
      let data: any = await this.appLangRepository.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any[] = await this.appLangRepository.search({});
      let returnData: any = {};
      let obj: any = [];
      data.forEach((element: any) => {
        returnData[element.id] = { en: element.en, ar: element.ar };
      });
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async save(item: AppLang) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let appLangData: any = await this.appLangRepository.save(item);
        let returnData = { id: item.id, message: 'SAVED_SUCCESSFULLY' };
        this.cacheService.app_lang("Reload");
        return returnData;
      } else {
        throw { message: 'INVALID_DATA' };
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let data: AppLang = await this.appLangRepository.entity(id);
      if (!data) throw { message: Props.RECORD_NOT_EXISTS };
      let result: any = await this.appLangRepository.delete(data);
      let returnData = { id: id, message: 'REMOVED' };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async validate(item: AppLang) {
    let previousItem: any = null;
    if (!item.id || item.id == "" || item.id == "0") {
      throw "invalid";
    }
    item.id = item.id.toUpperCase().replace(/\s/g, "_");
    item.updatedBy = this.sessionInfo.id;
    item.updatedOn = new Date(App.DateNow());
    return true;
  }
}
