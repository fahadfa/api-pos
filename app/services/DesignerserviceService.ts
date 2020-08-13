import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { Designerservice } from "../../entities/Designerservice";
import { DesignerserviceRepository } from "../repos/DesignerserviceRepository";
import { RawQuery } from "../common/RawQuery";

export class DesignerserviceService {
  public sessionInfo: any;
  private designerserviceRepository: DesignerserviceRepository;
  private rawQuery: RawQuery;

  constructor() {
    this.designerserviceRepository = new DesignerserviceRepository();
    this.rawQuery = new RawQuery();
  }

  async entity(id: string) {
    try {
      let data: any = await this.designerserviceRepository.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any = await this.designerserviceRepository.search(item);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async designerServiceList(item: any) {
    try {
      if (item.accountnum) {
        return await this.rawQuery.getDesignerServiceList(item.accountnum, item.mobileNo);
      } else {
        throw { message: "PLEASE_PROVIDE_ID" };
      }
    } catch (error) {
      throw error;
    }
  }

  async save(item: Designerservice) {
    try {
      let designerserviceData: any = await this.designerserviceRepository.save(item);
      let returnData = { id: item.serviceid, message: "SAVED_SUCCESSFULLY" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let data: Designerservice = await this.designerserviceRepository.entity(id);
      if (!data) {
        throw { message: "DATA_NOT_FOUND" };
      }
      let result: any = await this.designerserviceRepository.delete(data);
      let returnData = { id: id, message: "REMOVED" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }
}
