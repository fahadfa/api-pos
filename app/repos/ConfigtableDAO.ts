import { getRepository, Repository } from "typeorm";
import { Configtable } from "../../entities/Configtable";

export class ConfigtableDAO {
  private dao: Repository<Configtable>;

  constructor() {
    this.dao = getRepository(Configtable);
  }

  async search(data: any, items: any[]) {
    if (items.length > 0) {
      return await this.dao
        .createQueryBuilder("Configtable")
        //  .leftJoinAndSelect("Configtable.product", "inventtable")
        .where("Configtable.code IN (:...names)", { names: items })
        .andWhere(`Configtable.itemid = '${data.itemid}'`)
        .orderBy("Configtable.nameEnglish", "ASC")
        .getMany();
    } else {
      return [];
    }
  }

  async save(data: Configtable) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: Configtable) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }
}

Object.seal(ConfigtableDAO);
