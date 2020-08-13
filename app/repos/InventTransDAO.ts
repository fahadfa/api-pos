import { getRepository, Repository, getManager } from "typeorm";
import { Inventorytrans } from "../../entities/InventTrans";

export class InventorytransDAO {
  private dao: Repository<Inventorytrans>;
  private db: any;

  constructor() {
    this.dao = getRepository(Inventorytrans);
    this.db = getManager();
  }

  async search(data: any) {
    return await this.dao
      .createQueryBuilder("inventtrans")
      .leftJoinAndSelect("inventtrans.inventbatch", "inventbatch")
      .leftJoinAndSelect("inventtrans", "color")
      .where(data)
      .andWhere(`color.code = 'inventtrans.configid'`)
      .getMany();
  }

  async save(data: Inventorytrans) {
    return await this.dao.save(data);
  }
  async savearr(data: Inventorytrans[]) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.createQueryBuilder("inventtrans").where({ id: id }).getOne();
  }

  async delete(data: Inventorytrans[]) {
    return await this.dao.remove(data);
  }

  async findOne(data: any) {
    return await this.dao.createQueryBuilder("inventtrans").where(data).getOne();
  }

  async findAll(data: any) {
    return await this.dao.find(data);
  }
}

Object.seal(InventorytransDAO);
