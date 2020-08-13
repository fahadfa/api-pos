import { getRepository, Repository } from "typeorm";
import { Workflow } from "../../entities/Workflow";

export class WorkflowDAO {
  private dao: Repository<Workflow>;

  constructor() {
    this.dao = getRepository(Workflow);
  }

  async search(data: any) {
    console.log(data);
    return await this.dao
      .createQueryBuilder("Workflow")
      .leftJoin("Workflow.Inventlocation", "Inventlocation")
      .innerJoin("Workflow.SalesTable", "SalesTable")
      .addSelect("SalesTable.salesId")
      .leftJoinAndSelect("SalesTable.movementType", "MovementType")
      .addSelect("Inventlocation.name")
      .addSelect("Inventlocation.nameAlias")
      .where({})
      .andWhere(
        ` (pendingwith Ilike '%${data.pendingWith}%' or pendingWith = '${data.groupid}') and statusid!='APPROVEDBYRA' and statusid!='REJECTEDBYRM' and statusid!='REJECTEDBYRA'`
      )
      .orderBy("Workflow.createdDateTime", "DESC")
      .getMany();
  }

  async save(data: Workflow) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: Workflow) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.createQueryBuilder("Workflow").where(data).getOne();
  }
}

Object.seal(WorkflowDAO);
