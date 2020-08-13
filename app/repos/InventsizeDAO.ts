import { getRepository, Repository } from "typeorm";
import { Inventsize } from "../../entities/InventSize";

export class InventsizeDAO {
  private dao: Repository<Inventsize>;

  constructor() {
    this.dao = getRepository(Inventsize);
  }

  async search(data: any, items: any[]) {
    if (items.length > 0) {
      return await this.dao
        .createQueryBuilder("InventSize")
        //  .leftJoinAndSelect("Configtable.product", "inventtable")
        .where("lower(InventSize.code) IN (:...names)", { names: items })
        .andWhere(`InventSize.itemid = '${data.itemid}'`)
        .orderBy("InventSize.nameEnglish", "ASC")
        .getMany();
    } else {
      return [];
    }
  }

  async save(data: Inventsize) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: Inventsize) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }
}

Object.seal(InventsizeDAO);
