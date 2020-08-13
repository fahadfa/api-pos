import { getRepository, Repository, getManager, LessThanOrEqual, MoreThanOrEqual, Brackets } from "typeorm";
import { SalesLine } from "../../entities/SalesLine";

export class SalesLineDAO {
  private dao: Repository<SalesLine>;
  private db: any;
  constructor() {
    this.dao = getRepository(SalesLine);
    this.db = getManager();
  }

  async search(data: any) {
    console.log("===================", data);
    return await this.dao
      .createQueryBuilder("salesline")
      .leftJoinAndSelect("salesline.color", "color")
      .leftJoin("salesline.size", "size")
      .leftJoin("size.product", "product")
      .where(data)
      .getMany();
  }

  async mobilesearch(data: any) {
    console.log("=========================", data);
    return await this.dao
      .createQueryBuilder("salesline")
      .leftJoinAndSelect("salesline.color", "color")
      .leftJoinAndSelect("salesline.size", "size")
      .leftJoinAndSelect("size.product", "product")
      .where(data)
      .getMany();
  }

  async getDesignerServiceLines(salesId: string) {
    let query = ` select 
        sl.id as id,
        sl.salesid as "salesId",
        sl.linenum as "lineNum",
        sl.itemid as "itemid",
        sl.name as name,
        sl.salesprice as "salesprice",
        sl.lineamount as "lineAmount",
        sl.dataareaid,
        sl.custgroup as "custGroup",
        sl.custaccount as "custAccount",
        sl.vatamount as vatamount,
        sl.vat,
        sl.currencycode as "currencyCode",
        sl.salesqty as "salesQty",
        sl.dataareaid as "dataareaid",
        sl.inventsizeid,
        sl.inventlocationid as "inventLocationId",
        sl.configid as "configId",
        dp.name_en as "nameEn",
        dp.name_ar as "nameAr"
        from salesline sl
        left join designer_products dp on dp.name_en = sl.inventsizeid
        left join inventtable i on i.itemid = sl.itemid
        where sl.salesid='${salesId}' `;
    return await this.db.query(query);
  }

  async findByReturnOrderArray(data: any) {
    console.log(data);
    return await this.dao
      .createQueryBuilder("salesline")
      .leftJoinAndSelect("salesline.colors", "colors")
      .leftJoinAndSelect("salesline.baseSizes", "baseSizes")
      .leftJoinAndSelect("baseSizes.sizes", "sizes")
      .where("salesline.salesid IN (:...names)", { names: data })
      .getMany();
  }

  async findAll(data: any) {
    return await this.dao.find(data);
  }
  async save(data: SalesLine) {
    return await this.dao.save(data);
  }

  async entity(salesId: string) {
    return await this.dao.findOne(salesId);
  }

  async delete(data: SalesLine[]) {
    return await this.dao.remove(data);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }
  async findTop20FromToDate(inventlocationid: string, from: Date, to: Date) {
    let query = ` select 
    salesline.itemid ,
    --sum(salesline.lineamount) as amount 
    sum(salesline .lineamount +salesline .vatamount -salesline .linetotaldisc+coalesce(salesline.colorantprice, 0) * salesline.salesqty ) as amount 
    from salesline as salesline 
    inner join salestable st on st.salesid = salesline.salesid
    where salesline.salesid in (
      select salesid from salestable st
      where st.transkind In('SALESORDER') 
      and st.status IN('POSTED', 'PAID')
      and st.lastmodifieddate ::date>='${from}'
      and st.lastmodifieddate ::date<='${to}'
      and st.inventlocationid='${inventlocationid}'     
      ) 
      group by salesline.itemid ,salesline.itemid order by amount desc limit 20
     
    `;
    return await this.db.query(query);
  }
  async findTop20FromToDateWithItemIds(inventlocationid: string, from: Date, to: Date, itemIds: any[]) {
    let query = ` select 
    salesline.itemid ,
    sum(salesline .lineamount +salesline .vatamount -salesline .linetotaldisc+coalesce(salesline.colorantprice, 0) * salesline.salesqty ) as previousamount 
    from salesline as salesline 
    inner join salestable st on st.salesid = salesline.salesid
    where (salesline.lastmodifieddate::date >= '${from}' 
    and salesline.lastmodifieddate::date <= '${to}' ) 
    and salesline.inventlocationid='${inventlocationid}'     
    and st.transkind In('SALESORDER')  
    and st.status IN('POSTED', 'PAID')
    and salesline.itemid  in(${itemIds
      .map(function (id) {
        return "'" + id + "'";
      })
      .join(",")})
     group by salesline.itemid       
    `;
    return await this.db.query(query);
  }
}

Object.seal(SalesLineDAO);
