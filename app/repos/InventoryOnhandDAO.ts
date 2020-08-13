import { getRepository, Repository, getManager } from "typeorm";
import { InventoryOnhand } from "../../entities/InventoryOnhand";

export class InventoryOnhandDAO {
  private dao: Repository<InventoryOnhand>;
  private db: any;

  constructor() {
    this.dao = getRepository(InventoryOnhand);
    this.db = getManager();
  }

  async search(data: any) {
    return await this.dao.createQueryBuilder("inventoryonhand").where(data).getMany();
  }

  async save(data: InventoryOnhand) {
    return await this.dao.save(data);
  }

  async savearr(data: InventoryOnhand[]) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.createQueryBuilder("inventoryonhand").where({ id: id }).getOne();
  }

  async delete(id: any) {
    return await this.dao.delete(id);
  }

  async findOne(data: any) {
    return await this.dao
      .createQueryBuilder("inventoryonhand")
      .where({})
      .andWhere(
        `LOWER(inventoryonhand.itemid) = LOWER('${data.itemid}') and 
                       LOWER(inventoryonhand.inventsizeid) = LOWER('${data.inventsizeid}') and
                       LOWER(inventoryonhand.configid) = LOWER('${data.configid}') and 
                       LOWER(inventoryonhand.batchno) = LOWER('${data.batchno}') and 
                       LOWER(inventoryonhand.dataareaid) = LOWER('${data.dataareaid}') and
                       LOWER(inventoryonhand.inventlocationid) = LOWER('${data.inventlocationid}') 
                       ${data.qty ? `and inventoryonhand.qtyReserved >= ${data.qty}` : ``} 
                       `
      )
      .getOne();
  }

  async findAll(data: any) {
    return await this.dao.find(data);
  }

  async findCriticalItems(data: any) {
    return await this.dao
      .createQueryBuilder("onhand")
      .select("onhand.itemid")
      .addGroupBy("onhand.itemid")
      .addGroupBy("onhand.id")
      .orderBy("SUM(onhand.qty_in -onhand.qty_out )", "DESC")
      .getMany();
  }
}

Object.seal(InventoryOnhandDAO);
