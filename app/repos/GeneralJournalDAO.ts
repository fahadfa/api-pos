import { GeneralJournal } from "../../entities/GeneralJournal";
import { Repository, getRepository } from "typeorm";

export class GeneralJournalDAO {
  private dao: Repository<GeneralJournal>;

  constructor() {
    this.dao = getRepository(GeneralJournal);
  }

  //   async search(data: any) {
  //     return await this.dao
  //       .createQueryBuilder(`ledgerjournaltable`)
  //       .where(data)
  //       .andWhere(`ledgerjournaltable.deleted=false or ledgerjournaltable.deleted is NULL`)
  //       .orderBy(`ledgerjournaltable.lastModifiedDate`, `DESC`)
  //       .getMany();
  //   }

  async save(data: GeneralJournal) {
    return await this.dao.save(data);
  }

  // async entity(journalNum: string) {
  //     return await this.dao.findOne(journalNum);
  // }

  async entity(id: string) {
    return this.dao.findOne(id, {
      relations: ["legerJournalTras"],

      // select: ["salesId", "inventLocationId"]
    });
  }

  async search(data: any) {
    return this.dao.find({
      relations: ["legerJournalTras"],
      where: data,
      // select: ["salesId", "inventLocationId"]
    });
  }

  async delete(data: GeneralJournal) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }
}

Object.seal(GeneralJournalDAO);
