import { getRepository, Repository, getManager } from "typeorm";
import { Usergroupconfig } from "../../entities/Usergroupconfig";
import { App } from "../../utils/App";

export class UsergroupconfigDAO {
  private dao: Repository<Usergroupconfig>;
  private db: any;
  constructor() {
    this.dao = getRepository(Usergroupconfig);
    this.db = getManager();
  }

  async search(data: any) {
    return await this.dao
      .createQueryBuilder("Usergroupconfig")
      .where(data)
      .andWhere(`deleted=false or deleted IS NULL`)
      .getMany();
    // return await this.dao.find(data);
  }

  async save(data: Usergroupconfig) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: Usergroupconfig) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    console.log(data);
    return await this.dao.findOne(data);
  }

  async findOneEntity() {
    return await this.dao.findOne();
  }

  async find(data: any) {
    console.log(data);
    return await this.dao.find(data);
  }
  async findAll(data: any) {
    return await this.dao.createQueryBuilder("Usergroupconfig").where(data).getMany();
  }

  async saveAll(data: any) {
    console.log(data);
    let query = ` update usergroupconfig set 
                        special_products_for_colorant_option = '${data.specialproductsforcolorantoption}', 
                        blocklistedbasecolor = '${data.blocklistedbasecolor}',
                        sabic_customers = '${data.sabiccustomers}',
                        nocolorantcheckgroup = '${data.nocolorantcheckgroup}',
                        workflowcustomers = '${data.workflowcustomers}',
                        lastmodifieddate = '${new Date().toISOString()}'
                        `;
    await this.db.query(query);
  }
}

Object.seal(UsergroupconfigDAO);
