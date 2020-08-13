
import { Repository, Between, getRepository } from "typeorm";
import { HolidaysList } from "../../entities/HolidaysList";
import { Props } from "../../constants/Props";
import { App } from "../../utils/App";



export class HolidaysListService {
  public sessionInfo: any;
 
  private holidaysListRepository: Repository<HolidaysList>;

  constructor() {}

  async entity(id: string) {
    try {
      let query = { id: id };
      let data: any = await this.holidaysListRepository.findOne(query, {
        relations: [],
        join: {
          alias: "holidaysList",
          innerJoinAndSelect: {}
        }
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let query: any = item;
      let data: any[] = await this.holidaysListRepository.find({
        relations: [],
        where: query
      });
      let returnData = data.filter((ele: any) => new Date(ele.date).getFullYear() == query.year);
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async save(item: HolidaysList) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let holidaysListData: any = await this.holidaysListRepository.save(item);
        let returnData = { id: item.id, message: Props.SAVED_SUCCESSFULLY };
        return returnData;
      } else if (cond == "updated") {
        throw { message: Props.MISS_MATCH_MESSAGE };
      } else {
        throw { message: Props.INVALID_DATA };
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let data: HolidaysList = await this.holidaysListRepository.findOne(id);
      if (!data) throw { message: Props.RECORD_NOT_EXISTS };
      //data.active = !data.active;
      data.updatedBy = this.sessionInfo.id;
      data.updatedOn = new Date(App.DateNow());
      let result: any = await this.holidaysListRepository.save(data);
      let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async validate(item: HolidaysList) {
    let previousItem: any = null;
    if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
      item.id = null;
    } else {
      previousItem = await this.holidaysListRepository.findOne(item.id);
    }
    if (!item.id) {
      let uid = App.UniqueID(App.UniqueCode(), "HolidaysList");
      item.id = uid;
    } else {
      if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
        return "updated";
      }
    }
    item.updatedBy = this.sessionInfo.id;
    item.updatedOn = new Date(App.DateNow());
    return true;
  }
}
