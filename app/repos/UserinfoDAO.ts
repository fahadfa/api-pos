import { getRepository, Repository } from "typeorm";
import { UserInfo } from "../../entities/UserInfo";

export class UserinfoDAO {
  private dao: Repository<UserInfo>;

  constructor() {
    this.dao = getRepository(UserInfo);
  }

  async search(data: any) {
    return await this.dao
      .createQueryBuilder("UserInfo")
      // .leftJoinAndSelect("UserInfo.userGroupConfig", "userGroupConfig")
      .leftJoin("UserInfo.userGroup", "userGroup")
      .addSelect("userGroup.groupid")
      .addSelect("userGroup.groupname")
      .where(data)
      .andWhere(`UserInfo.deleted =false or UserInfo.deleted is NULL`)
      .orderBy("UserInfo.lastmodifieddate", "DESC")
      .getMany();
  }

  async save(data: UserInfo) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: UserInfo) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    console.log(data);
    return await this.dao
      .createQueryBuilder("UserInfo")
      .leftJoinAndSelect("UserInfo.userGroupConfig", "userGroupConfig")
      .leftJoinAndSelect("UserInfo.userGroup", "userGroup")
      .where({})
      .andWhere(
        `LOWER(trim(UserInfo.email)) = LOWER('${data.userName.trim()}') or LOWER(trim(UserInfo.userName)) = LOWER('${data.userName.trim()}')`
      )
      .getOne();
  }
  async findAll(data: any) {
    return await this.dao
      .createQueryBuilder("UserInfo")
      .andWhere("LOWER(user_name) = LOWER(:username) and (UserInfo.deleted =false or UserInfo.deleted is NULL)", {
        username: data.userName,
      })
      .getMany();
  }
  async pagination(data: any) {
    return data;
  }
}

Object.seal(UserinfoDAO);
