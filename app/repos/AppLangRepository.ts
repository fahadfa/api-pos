import { getRepository, Repository } from "typeorm";
import { AppLang } from "../../entities/AppLang";

export class AppLangRepository {
  private dao: Repository<AppLang>;

  constructor() {
    this.dao = getRepository(AppLang);
  }

  async search(data: any) {
    return await this.dao
      .createQueryBuilder("appLang")
      .where(data)
      .orderBy("appLang.id", "ASC")
      .getMany();
  }

  async save(data: AppLang) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id, {
      join: {
        alias: "appLang",
        innerJoinAndSelect: {}
      }
    });
  }

  async delete(data: any) {
    return await this.dao.delete(data);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data, {
      join: {
        alias: "appLang",
        innerJoinAndSelect: {}
      }
    });
  }
}

Object.seal(AppLangRepository);
