import { ItemCoverage } from "../../entities/ItemCoverage";
import { Repository, getRepository } from "typeorm";

export class ItemCoverageDAO{
    private dao: Repository<ItemCoverage>;
    private db: any;

    constructor() {
        this.dao = getRepository(ItemCoverage);
        
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async save(data: ItemCoverage) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        
        return await this.dao.findOne(id);
    }

    async delete(data: ItemCoverage) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }

    async findAll(data: any) {
        return await this.dao.find(data);
    }

    async criticalItems(data:any){
        let query=`select ic.itemid,sum(sl.lineamount- sl.linetotaldisc+
            coalesce(sl.colorantprice, 0) * sl.salesqty + sl.vatamount ) as amount 
            from item_coverage ic inner join salesline sl on ic.itemid =sl.itemid 
            inner join salestable st on 
            st.salesid = sl.salesid 
            inner join inventtrans it on ic.itemid =it.itemid 
            where 
            sl.inventlocationid = '${data.inventlocationid}' and
            sl.inventsizeid = ic.inventsizeid and 
            sl.configid =ic.configid and
            sl.lastmodifieddate > current_date - interval '90' day and
            sl.salesid in (
                  select salesid from salestable st1
                  where st1.transkind = 'SALESORDER'
                  and st1.status IN('POSTED', 'PAID')       
                  )
                  group by ic.itemid ;`;

        return await this.dao.query(query)          
    }
}