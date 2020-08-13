import { getRepository, Repository, In } from "typeorm";
import { Inventtable } from "../../entities/Inventtable";

export class InventtableDAO {
  private dao: Repository<Inventtable>;

  constructor() {
    this.dao = getRepository(Inventtable);
  }

  async search(data: any, items: any[]) {
    let result: any;
    if (items.length > 0) {
      result = await this.dao
        .createQueryBuilder("Inventtable")
        .leftJoinAndSelect("Inventtable.product", "inventtable")
        .where("Inventtable.code IN (:...names)", { names: items })
        .orderBy("Inventtable.nameEn", "ASC")
        .getMany();
      result.map((v: any) => {
        v.product = v.product ? v.product : {};
      });
    } else {
      result = [];
    }

    return result;
  }

  async save(data: Inventtable) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: Inventtable) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }
  async findByIds(ids: any[]) {
    return await this.dao.find({
      select:["nameEn","nameAr","code"],
      where: {
        code: In(ids)
      }
    });
  }
}

Object.seal(InventtableDAO);
