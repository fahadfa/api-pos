import { getRepository, Repository, getManager } from "typeorm";
import { SalesTable } from "../../entities/SalesTable";
import { SalesLine } from "../../entities/SalesLine";
import { App } from "../../utils/App";

export class SalesTableDAO {
  private dao: Repository<SalesTable>;
  private db: any;
  constructor() {
    this.dao = getRepository(SalesTable);
    this.db = getManager();
  }
  getDAO() {
    return this.dao;
  }

  async entity(id: string) {
    return this.dao.findOne(id, {
      relations: [
        "warehouse",
        // "customer",
        "movementType",
        // "toWarehouse",
        "salesLine",
        // "salesLine.appliedDiscounts",
        // "salesLine.product",
        "salesLine.color",
        "salesLine.size",
        "salesLine.size.product",
      ],

      // select: ["salesId", "inventLocationId"]
    });
  }

  async search(data: any, type: any) {
    if (type && type == "purchasereturn") {
      return await this.dao
        .createQueryBuilder("SalesTable")
        .leftJoin("SalesTable.warehouse", "warehouse")
        .leftJoin("SalesTable.movementType", "movementType")
        .addSelect("warehouse.name")
        .addSelect("warehouse.nameAlias")
        .addSelect("movementType.id")
        .addSelect("movementType.movementType")
        .addSelect("movementType.movementArabic")
        .where(data)
        .andWhere(`SalesTable.transkind != 'SALESORDER'`)
        .orderBy("SalesTable.createddatetime", "DESC")
        .getMany();
    }
    return await this.dao
      .createQueryBuilder("SalesTable")
      .leftJoin("SalesTable.warehouse", "warehouse")
      .leftJoin("SalesTable.movementType", "movementType")
      .addSelect("warehouse.name")
      .addSelect("warehouse.nameAlias")
      .addSelect("movementType.id")
      .addSelect("movementType.movementType")
      .addSelect("movementType.movementArabic")
      .where(data)
      .orderBy("SalesTable.createddatetime", "DESC")
      .getMany();
  }

  async delete(data: SalesTable) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    console.log(data);
    return await this.dao.findOne(data);
  }

  async find(data: any) {
    console.log(data);
    return await this.dao.findOne(data);
  }
  async pagination(data: any, inventlocationid: string) {
    let result: any = [];
    let query: string = "";
    switch (data.type) {
      case "movement":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouse_name", 
                    "warehouse"."namealias" AS "warehouse_namealias",
                    "movementType"."id" AS "movementTypeId", 
                    "movementType"."movementtype" AS "movementType", 
                    "movementType"."movementarabic" AS "movementTypeArabic",
                    "SalesTable"."description" AS "description"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"  
                    LEFT JOIN "movementtype" "movementType" ON "movementType"."id"="SalesTable"."movement_type_id"  
                    LEFT JOIN "custtable" "customer" ON "customer"."accountnum"="SalesTable"."custaccount" WHERE "SalesTable"."inventlocationid" = '${inventlocationid}' `;
        if (data.filter) {
          query += `and ("SalesTable"."salesid" ILike '%${data.filter}%' or  
                    "SalesTable"."salesname" ILike '%${data.filter}%' or 
                    "movementType"."movementtype" ILike '%${data.filter}%' or 
                    "SalesTable"."status" ILike '%${data.filter}%')`;
        }
        query += ` AND "SalesTable"."transkind" IN ${
          data.transkind
        } ORDER BY "SalesTable"."lastmodifieddate" DESC offset ${(data.page - 1) * data.pageCount} limit ${
          data.pageCount
        }`;
        break;
      case "transferorder":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "towarehouse"."name" AS "toWarehouseAr", 
                    "towarehouse"."namealias" AS "toWarehouseEn",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "fromWarehouseAr", 
                    "warehouse"."namealias" AS "fromWarehouseEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "SalesTable".lastmodifieddate As "lastModifiedDate",
                    "in".invoiceid as "inSalesid",
                    "sl".salesid as "slSalesId"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "inventlocation" "towarehouse" ON "towarehouse"."inventlocationid"="SalesTable"."custaccount"  
                    LEFT JOIN "inventtrans" "in" ON "in"."invoiceid" = "SalesTable"."salesid"
                    LEFT JOIN "salesline" "sl" ON "sl"."salesid" = "SalesTable"."salesid"
                    WHERE ("SalesTable"."custaccount" = '${inventlocationid}' and "SalesTable".transkind ='TRANSFERORDER' and ("SalesTable".status  != 'SAVED' and "SalesTable".status  != 'CREATED')) or
                    ("SalesTable"."custaccount" = '${inventlocationid}' and "SalesTable".transkind ='ORDERSHIPMENT' and "SalesTable".status  ='POSTED') or 
                    ("SalesTable"."custaccount" = '${inventlocationid}'and "SalesTable".transkind ='ORDERRECEIVE' and "SalesTable".status  ='POSTED') or
                    ("SalesTable"."inventlocationid" = '${inventlocationid}' and "SalesTable".transkind  in ('TRANSFERORDER', 'ORDERSHIPMENT', 'ORDERRECEIVE')) `;
        if (data.filter) {
          query += `and ("SalesTable"."salesid" ILike '%${data.filter}%' or  
                        "SalesTable"."salesname" ILike '%${data.filter}%' or 
                        "SalesTable"."custaccount" ILike '%${data.filter}%' or
                        "towarehouse"."name" ='%${data.filter}%' or
                        "towarehouse"."namealias" = '%${data.filter}%' or
                        "warehouse"."name" ='%${data.filter}%' or
                        "warehouse"."namealias" = '%${data.filter}%' or
                        "SalesTable"."transkind" = '%${data.filter}%' or
                        "SalesTable"."status" ILike '%${data.filter}%')
                        `;
        }
        query += `AND "SalesTable"."transkind" IN ${
          data.transkind
        } ORDER BY "SalesTable"."lastmodifieddate" DESC offset ${(data.page - 1) * data.pageCount} limit ${
          data.pageCount
        }`;
        break;
      default:
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "SalesTable"."mobileno" AS "phone", 
                    "customer"."name" AS "customerNameAr", 
                    "customer"."namealias" AS "customerNameEn",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouseNameAr", 
                    "warehouse"."namealias" AS "warehouseNameEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "customer"."custtype" as custtype
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "custtable" "customer" ON "customer"."accountnum"="SalesTable"."custaccount"
                    LEFT JOIN "inventtrans" "in" ON "in"."invoiceid" = "SalesTable"."salesid"
                    LEFT JOIN "salesline" "sl" ON "sl"."salesid" = "SalesTable"."salesid"
                    WHERE "SalesTable"."inventlocationid" = '${inventlocationid}' `;
        if (data.filter) {
          query += `and ("SalesTable"."salesid" ILike '%${data.filter}%' or  
                            "SalesTable"."salesname" ILike '%${data.filter}%' or 
                            "SalesTable"."custaccount" ILike '%${data.filter}%' or
                            "customer"."name"='%${data.filter}%' or
                            "customer"."namealias"='%${data.filter}%' or
                            "customer"."phone"='%${data.filter}%' or
                            "SalesTable"."status" ILike '%${data.filter}%'
                            )`;
        }

        if (data.status == "PAID") {
          query += ` AND "SalesTable"."status" IN ('PAID', 'POSTED') `;
          console.log(data);
          if (data.type == "designerservice") {
            query += `AND "SalesTable"."salesid" NOT IN  ( 
              select intercompanyoriginalsalesid from salestable 
              where transkind = 'DESIGNERSERVICERETURN'
              )  `;
          }
        }

        query += `AND "SalesTable"."transkind" IN ${
          data.transkind
        } ORDER BY "SalesTable"."lastmodifieddate" DESC offset ${(data.page - 1) * data.pageCount} limit ${
          data.pageCount
        }`;
        break;
    }

    result = await this.db.query(query);
    if (data.timeZoneOffSet) {
      result.map((v: any) => {
        v.lastModifiedDate = v.lastModifiedDate
          ? App.convertUTCDateToLocalDate(new Date(v.lastModifiedDate), parseInt(data.timeZoneOffSet)).toLocaleString()
          : v.lastModifiedDate;
        v.createddatetime = v.createddatetime
          ? App.convertUTCDateToLocalDate(new Date(v.createddatetime), parseInt(data.timeZoneOffSet)).toLocaleString()
          : v.createddatetime;
      });
    }

    return result;
  }
  async searchorders(data: any, inventlocationid: string) {
    let result: any = [];
    let query: string = "";
    switch (data.type) {
      case "movement":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouse_name", 
                    "warehouse"."namealias" AS "warehouse_namealias",
                    "movementType"."id" AS "movementTypeId", 
                    "movementType"."movementtype" AS "movementType", 
                    "movementType"."movementarabic" AS "movementTypeArabic",
                    "SalesTable"."description" AS "description",
                    "SalesTable".lastmodifieddate As "lastModifiedDate"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"  
                    LEFT JOIN "movementtype" "movementType" ON "movementType"."id"="SalesTable"."movement_type_id"  
                    LEFT JOIN "custtable" "customer" ON "customer"."accountnum"="SalesTable"."custaccount" WHERE "SalesTable"."inventlocationid" = '${inventlocationid}' 
                     AND "SalesTable"."transkind" IN ${data.transkind} ORDER BY "SalesTable"."lastmodifieddate" DESC `;
        break;
      case "transferorder":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "towarehouse"."name" AS "toWarehouseAr", 
                    "towarehouse"."namealias" AS "toWarehouseEn",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "fromWarehouseAr", 
                    "warehouse"."namealias" AS "fromWarehouseEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "SalesTable".lastmodifieddate As "lastModifiedDate",
                    "in".invoiceid as "inSalesid",
                    "sl".salesid as "slSalesId"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."custaccount"
                    LEFT JOIN "inventlocation" "towarehouse" ON "towarehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "inventtrans" "in" ON "in"."invoiceid" = "SalesTable"."salesid"
                    LEFT JOIN "salesline" "sl" ON "sl"."salesid" = "SalesTable"."salesid"
                    WHERE ("SalesTable"."inventlocationid" = '${inventlocationid}' or ("SalesTable"."custaccount" = '${inventlocationid}' and "SalesTable"."status" !='CREATED' and "SalesTable"."status" !='SAVED')) 
                    AND "SalesTable"."transkind" IN ${data.transkind} ORDER BY "SalesTable"."lastmodifieddate" DESC`;
        break;
      case "purchaseorder":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "vendor"."name" AS "vendorNameAr", 
                    "vendor"."namealias" AS "vendorNameEn",
                    "vendor"."phone" AS "phone",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouseNameAr", 
                    "warehouse"."namealias" AS "warehouseNameEn",
                    "jazeerawarehouse"."name" AS "jazeeraWarehouseNameAr", 
                    "jazeerawarehouse"."namealias" AS "jazeeraWarehouseNameEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "SalesTable"."jazeerawarehouse" As "jazeeraWarehouse",
                    "SalesTable".lastmodifieddate As "lastModifiedDate"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "inventlocation" "jazeerawarehouse" ON "jazeerawarehouse"."inventlocationid"="SalesTable"."jazeerawarehouse"
                    LEFT JOIN "vendortable" "vendor" ON "vendor"."accountnum"="SalesTable"."custaccount"
                    WHERE ("SalesTable"."jazeerawarehouse" = '${inventlocationid}' or "SalesTable"."inventlocationid" = '${inventlocationid}')
                    AND "SalesTable"."transkind" IN ${data.transkind} ORDER BY "SalesTable"."lastmodifieddate" DESC `;
        break;
      case "purchasereturn":
        query = `SELECT 
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "vendor"."name" AS "vendorNameAr", 
                    "vendor"."namealias" AS "vendorNameEn",
                    "vendor"."phone" AS "phone",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouseNameAr", 
                    "warehouse"."namealias" AS "warehouseNameEn",
                    "jazeerawarehouse"."name" AS "jazeeraWarehouseNameAr", 
                    "jazeerawarehouse"."namealias" AS "jazeeraWarehouseNameEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "SalesTable"."jazeerawarehouse" As "jazeeraWarehouse",
                    "SalesTable".lastmodifieddate As "lastModifiedDate"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "inventlocation" "jazeerawarehouse" ON "jazeerawarehouse"."inventlocationid"="SalesTable"."jazeerawarehouse"
                    LEFT JOIN "vendortable" "vendor" ON "vendor"."accountnum"="SalesTable"."custaccount"
                    WHERE "SalesTable"."jazeerawarehouse" = '${inventlocationid}' 
                    AND "SalesTable"."transkind" IN ${data.transkind} ORDER BY "SalesTable"."lastmodifieddate" DESC `;
        break;
      default:
        query = `SELECT
                    DISTINCT on ("SalesTable"."lastmodifieddate","SalesTable"."salesid" )
                    "SalesTable"."salesid" AS "salesId", 
                    "SalesTable"."salesname" AS "salesName", 
                    "SalesTable"."custaccount" AS "custAccount", 
                    "customer"."name" AS "customerNameAr", 
                    "customer"."namealias" AS "customerNameEn",
                    "customer"."phone" AS "phone",
                    "SalesTable"."createddatetime" AS "createddatetime", 
                    "SalesTable"."inventlocationid" AS "inventLocationId", 
                    "SalesTable"."transkind" AS "transkind", 
                    "SalesTable"."status" AS "status", 
                    "warehouse"."name" AS "warehouseNameAr", 
                    "warehouse"."namealias" AS "warehouseNameEn",
                    "SalesTable"."description" AS "description", 
                    "SalesTable"."intercompanyoriginalsalesid" AS "interCompanyOriginalSalesid",
                    "SalesTable"."jazeerawarehouse" As "jazeeraWarehouse",
                    "SalesTable".lastmodifieddate As "lastModifiedDate"
                    FROM "salestable" "SalesTable" 
                    LEFT JOIN "inventlocation" "warehouse" ON "warehouse"."inventlocationid"="SalesTable"."inventlocationid"
                    LEFT JOIN "custtable" "customer" ON "customer"."accountnum"="SalesTable"."custaccount"
                    WHERE "SalesTable"."inventlocationid" = '${inventlocationid}' 
                    AND "SalesTable"."transkind" IN ${data.transkind} ORDER BY "SalesTable"."lastmodifieddate" DESC `;
        break;
    }

    result = await this.db.query(query);
    if (data.timeZoneOffSet) {
      result.map((v: any) => {
        v.lastModifiedDate = v.lastModifiedDate
          ? App.convertUTCDateToLocalDate(new Date(v.lastModifiedDate), parseInt(data.timeZoneOffSet)).toLocaleString()
          : v.lastModifiedDate;
        v.createddatetime = v.createddatetime
          ? App.convertUTCDateToLocalDate(new Date(v.createddatetime), parseInt(data.timeZoneOffSet)).toLocaleString()
          : v.createddatetime;
      });
    }

    return result;
  }
  async save(data: any) {
    return await this.dao.save(data);
  }

  async searchVisitors(data: any) {
    let query = ` select st.salesid,st.salesname,st.citycode,sl.batches :: jsonb  ,
        sum(sl.salesqty) as salesqty,st.currencycode, sl.salesunit ,
        sl.itemid,it.int_ext ,
        sum(sl.lineamount +sl.vatamount -sl.linetotaldisc +coalesce(sl.colorantprice, 0) * sl.salesqty ) as amount,
        CASE WHEN it.int_ext=1 THEN 'Interior'
                           WHEN it.int_ext=2 THEN 'Exterior'
                           WHEN it.int_ext=3 THEN 'Interior and Exterior'
                           ELSE 'None'
                      end as "intExtEn",
                      CASE WHEN it.int_ext=1 THEN 'الداخلية'
                           WHEN it.int_ext=2 THEN 'الخارج'
                           WHEN it.int_ext=3 THEN 'الداخل والخارج'
                           ELSE 'لا يوجد'
                      end as "intExtAr",
                       st.lastmodifieddate,st.mobileno
        from salestable st   
        inner join salesline sl on st.salesid =sl.salesid 
        inner join inventtable it on sl.itemid =it.itemid
        where st.inventlocationid ='${data.inventlocationid}' 
        and transkind in ('SALESORDER') 
        and st.status  in ('POSTED','PAID')
        and st.lastmodifieddate >= 
        current_date - interval '15' day 
        group by st.salesid ,sl.itemid ,it.int_ext ,
        sl.batches :: jsonb,sl.salesunit 
        order by st.lastmodifieddate desc  ;`;

    return await this.dao.query(query);
  }

  async searchCities(citynames: any[]) {
    let query = `               
        select c.cityname ,c.citynamearb as citynamear from citymast c 
       where c.cityname in (${citynames
         .map(function (id) {
           return "'" + id + "'";
         })
         .join(",")});`;
    return await this.dao.query(query);
  }
}

Object.seal(SalesTableDAO);
