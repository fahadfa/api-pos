import { WorkDays } from '../../entities/WorkDays';
import { Repository, getRepository } from 'typeorm';
import { Props } from '../../constants/Props';
export class WorkDaysDAO{
    private dao: Repository<WorkDays>;

    constructor() {
        this.dao = getRepository(WorkDays);
    }

    async entity(id: string) {
        try {
          let query = { id: id };
          let data: any = await this.dao.findOne(query, {
            relations: [],
            join: {
              alias: "workdays",
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
          let query: WorkDays = item;
          query.isWorkingDay=true;
          let data: any[] = await this.dao.find({
            relations: [],
            where: query
          });
    
          return data;
        } catch (error) {
          throw error;
        }
      }
    
    //   async save(item: WorkDays) {
    //     try {
    //       let cond = await this.validate(item);
    //       if (cond == true) {
    //         let workdaysData: any = await this.dao.save(item);
    //         let returnData = { id: item.id, message: Props.SAVED_SUCCESSFULLY };
    //         return returnData;
    //       } else if (cond == "updated") {
    //         throw { message: Props.MISS_MATCH_MESSAGE };
    //       } else {
    //         throw { message: Props.INVALID_DATA };
    //       }
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    
    //   async delete(id: any) {
    //     try {
    //       let data: WorkDays = await this.dao.findOne(id);
    //       if (!data) throw { message: Props.RECORD_NOT_EXISTS };
    //       data.updatedBy = this.sessionInfo.id;
    //       data.updatedOn = new Date(App.DateNow());
    //       let result: any = await this.dao.save(data);
    //       let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
    //       return returnData;
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    
    //   async validate(item: WorkDays) {
    //     //        item.compcode =  this.sessionInfo.compcode;
    //     let previousItem: any = null;
    //     if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
    //       item.id = null;
    //     } else {
    //       previousItem = await this.dao.findOne(item.id);
    //     }
    //     // let condData = await this.dao.find( { where : { id: item.id } });
    //     if (!item.id) {
    //       let uid = App.UniqueID(App.UniqueCode(), "Workdays");
    //       item.id = uid;
    //     } else {
    //       if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
    //         return "updated";
    //       }
    //     }
    //     item.updatedBy = this.sessionInfo.id;
    //     item.updatedOn = new Date(App.DateNow());
    //     return true;
    //   }
}