import { HolidaysList } from '../../entities/HolidaysList';
import { Repository, getRepository,Raw } from 'typeorm';
export class HolidaysListDAO{
    
    private dao: Repository<HolidaysList>;

    constructor() {
        this.dao = getRepository(HolidaysList);
    }

   async search(data:any){
    return await this.dao.find({
        where:{
            type:Raw(alias => `${alias} ILIKE '%${data.type}%'`),
        }
    })
   }

   async searchNot(data:any){
    return await this.dao.find({
        where:{
            type:Raw(alias => `${alias} NOT ILIKE '%${data.type}%'`),
        }
    })
   }

    async save(data: HolidaysList) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: HolidaysList) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("HolidaysList")
            .where(data)
            .getOne();
    }
}

Object.seal(HolidaysListDAO)