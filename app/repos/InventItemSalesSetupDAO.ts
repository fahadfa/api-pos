import { InventItemSalesSetup } from "../../entities/InventItemSalesSetup";
import { getRepository, Repository, LessThanOrEqual } from "typeorm";

export class InventItemSalesSetupDAO {
  private dao: Repository<InventItemSalesSetup>;

  constructor() {
    this.dao = getRepository(InventItemSalesSetup);
  }

  async save(data: InventItemSalesSetup) {
    return await this.dao.save(data);
  }

  async entity(id: string) {
    return await this.dao.findOne(id);
  }

  async delete(data: InventItemSalesSetup) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne({
      where: data,
    });
  }

  async find(data: InventItemSalesSetup) {
      let query:any=`select sl.producten,sl.productar,
      sl.configid,sl.configid  as color,sl.stock ,sl.inventsizeid, 
      sl.amount,iiss.*,sl.amount
      from invent_item_sales_setup iiss 
      inner join 
      (select coalesce(sum((sl.lineamount - sl.linetotaldisc * sl.salesqty) + (sl.colorantprice * sl.salesqty) + sl.vatamount ) ,0) as amount,sl.itemid,sl.configid ,sl.inventsizeid,sl.batchno,ih.stock,
      it.itemname as productar,it.namealias as producten from salestable st
      inner join salesline sl on st.salesid =sl.salesid 
      inner join
      (select io.itemid ,io.configid ,io.inventsizeid,io.batchno ,sum(io.qty_in-io.qty_out) as stock from inventory_onhand io 
      group by io.itemid ,io.configid,io.batchno ,io.inventsizeid ) as ih on ih.itemid =sl.itemid 
      and ih.configid=sl.configid and ih.batchno=sl.batchno and ih.inventsizeid=sl.inventsizeid 
      inner join inventtable it on it.itemid = sl.itemid 
      where st.transkind ='SALESORDER'`;
      data.leadtime?query+=`and sl.lastmodifieddate >= (now()::date - '${data.leadtime} day'::interval)`:'';
      query+=`and ih.stock >=0
      group by sl.itemid,sl.configid,sl.inventsizeid,sl.batchno,ih.stock,it.itemname,it.namealias 
      order by sl.itemid)
      as sl on sl.itemid=iiss.itemid ;`;
    

    return await this.dao.query(query);
  }
}
