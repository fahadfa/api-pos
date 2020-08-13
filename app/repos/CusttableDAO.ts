import { getRepository, Repository, getManager } from "typeorm";
import { Custtable } from "../../entities/Custtable";
import { Props } from "../../constants/Props";

export class CusttableDAO {
  public sessionInfo: any;
  private dao: Repository<Custtable>;
  private db: any;

  constructor() {
    this.dao = getRepository(Custtable);
    this.db = getManager();
  }

  async search(data: any) {
    console.groupCollapsed(data);
    if (data.name) {
      return await this.dao
        .createQueryBuilder("custtable")
        .where("LOWER(custtable.name) like LOWER(:name) or LOWER(custtable.nameAlias) like LOWER(:nameAlias)", {
          name: "%" + data.name + "%",
          nameAlias: "%" + data.name + "%",
        })
        .andWhere(`custtable.deleted=false`)
        .getMany();
    }
    if (data.phone) {
      return await this.dao
        .createQueryBuilder("custtable")
        .where("LOWER(custtable.phone) like LOWER(:phone)", {
          phone: "%" + data.phone + "%",
        })
        .andWhere(`custtable.deleted=false`)
        .getMany();
    }
    if (data.painter) {
      let result = await this.dao
        .createQueryBuilder("custtable")
        .where("LOWER(custtable.name) like LOWER(:name) or LOWER(custtable.nameAlias) like LOWER(:nameAlias)", {
          name: "%" + data.painter + "%",
          nameAlias: "%" + data.painter + "%",
        })
        .andWhere(`custtable.deleted=false`)
        .getMany();

      return result.filter((item) => {
        return item.rcusttype == 2;
      });
    }
    return [];
  }

  async getCreditLimit(accountNum: string) {
    return await this.dao
      .createQueryBuilder("custtable")
      .where("custtable.accountnum = :accountnum AND custtable.paymtermid <> :payid", {
        accountnum: accountNum,
        payid: "CASH",
      })
      .select(["custtable.creditmax"])
      .andWhere(`custtable.deleted=false`)
      .getOne();
  }

  async save(data: Custtable) {
    return await this.dao.save(data);
  }

  async entity(accountnum: string) {
    // return await this.dao.findOne(accountnum);
    return await this.dao
      .createQueryBuilder("custtable")
      // .where({ accountnum: accountnum })
      .where(`LOWER(custtable.accountnum) like LOWER('${accountnum}')`)
      .leftJoinAndSelect("custtable.Custgroup", "Custgroup")
      .getOne();
  }

  async delete(data: Custtable) {
    return await this.dao.remove([data]);
  }

  async findOne(data: any) {
    return await this.dao.findOne(data);
  }

  async findAll(data: any) {
    return await this.dao.find(data);
  }
  // async pagination(data: any) {
  //     return await this.dao.find({
  //         skip: (data.page - 1) * data.count,
  //         take: data.count
  //     });
  // }
  async pagination(data: any) {
    console.log(data);
    let custtypeEnKeys = Object.keys(Props.rcusttypeEn);
    let custtypeArKeys = Object.keys(Props.rcusttypeAr);
    let result: any;
    let count: any;
    if (data.filter != null && data.filter != "null") {
      data.filter = JSON.parse(data.filter);
      let filter = ``;
      let custtypeFilter = ``;
      if (typeof data.filter[0] == "object") {
        for (let item of data.filter) {
          if (typeof item == "object") {
            if (item[0] == "rcusttypeen") {
              let matchesEn = custtypeEnKeys.filter((s) => s.toLowerCase().includes(item[2].toLowerCase()));
              for (let match of matchesEn) {
                if (matchesEn.indexOf(match) == matchesEn.length - 1) {
                  custtypeFilter += "rcusttype=" + `${Props.rcusttypeEn[match]})`;
                } else {
                  custtypeFilter += "rcusttype=" + `${Props.rcusttypeEn[match]} or `;
                }
              }
            } else if (item[0] == "rcusttypear") {
              let matchesAr = custtypeArKeys.filter((s) => s.toLowerCase().includes(item[2].toLowerCase()));
              for (let match of matchesAr) {
                if (matchesAr.indexOf(match) == matchesAr.length - 1) {
                  custtypeFilter += "rcusttype=" + `${Props.rcusttypeAr[match]})`;
                } else {
                  custtypeFilter += "rcusttype=" + `${Props.rcusttypeAr[match]} or `;
                }
              }
            } else {
              filter += "custtable." + item[0] + " ILike " + `'%${item[2]}%'`;
            }
          }
          if (typeof item == "string") {
            filter += " " + item + " ";
          }
        }
      } else if (typeof data.filter[0] == "string") {
        if (data.filter[0] == "rcusttypeen") {
          let matchesEn = custtypeEnKeys.filter((s) => s.toLowerCase().includes(data.filter[2].toLowerCase()));
          for (let match of matchesEn) {
            if (matchesEn.indexOf(match) == matchesEn.length - 1) {
              custtypeFilter += "rcusttype=" + `${Props.rcusttypeEn[match]})`;
            } else {
              custtypeFilter += "rcusttype=" + `${Props.rcusttypeEn[match]} or `;
            }
          }
        } else if (data.filter[0] == "rcusttypear") {
          let matchesAr = custtypeArKeys.filter((s) => s.toLowerCase().includes(data.filter[2].toLowerCase()));
          for (let match of matchesAr) {
            if (matchesAr.indexOf(match) == matchesAr.length - 1) {
              custtypeFilter += "rcusttype=" + `${Props.rcusttypeAr[match]})`;
            } else {
              custtypeFilter += "rcusttype=" + `${Props.rcusttypeAr[match]} or `;
            }
          }
        } else {
          filter += "custtable." + data.filter[0] + " ILike " + `'%${data.filter[2]}%'`;
        }
      }

      if (custtypeFilter.length > 0) {
        filter += "(" + custtypeFilter;
      }
      console.log("filter", filter);
      if (filter.length > 0) {
        if (data.orderby && data.orderby != "null") {
          result = await this.dao
            .createQueryBuilder("custtable")
            .where({ deleted: false, walkincustomer: true })
            .andWhere(filter)
            // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
            // .andWhere(
            //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
            //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
            //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
            //         data.sabiccustomers.length > 0 ? `OR` : ``
            //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
            // )
            .take(data.take)
            .addOrderBy(
              data.column == "rcusttypeen" || data.column == "rcusttypear" ? "rcusttype" : data.column,
              data.orderby
            )
            .getMany();
          count = await this.dao
            .createQueryBuilder("custtable")
            // .innerJoinAndSelect("custtable.Custgroup", "Custgroup")
            .where({ deleted: false, walkincustomer: true })
            .andWhere(filter)
            // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
            // .andWhere(
            //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
            //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
            //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
            //         data.sabiccustomers.length > 0 ? `OR` : ``
            //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
            // )
            .getCount();
        } else {
          result = await this.dao
            .createQueryBuilder("custtable")
            .where({ deleted: false, walkincustomer: true })
            .andWhere(filter)
            // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
            // .andWhere(
            //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
            //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
            //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
            //         data.sabiccustomers.length > 0 ? `OR` : ``
            //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
            // )
            .take(data.take)
            .orderBy("createddatetime", "DESC")
            .getMany();
          count = await this.dao
            .createQueryBuilder("custtable")
            .where({ deleted: false })
            .andWhere(filter)
            // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
            // .andWhere(
            //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
            //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
            //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
            //         data.sabiccustomers.length > 0 ? `OR` : ``
            //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
            // )
            .getCount();
        }
      } else {
        result = [];
        count = 0;
      }
    } else {
      if (data.orderby && data.orderby != "null") {
        result = await this.dao
          .createQueryBuilder("custtable")
          .where({ deleted: false, walkincustomer: true })
          // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
          // .andWhere(
          //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
          //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
          //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
          //         data.sabiccustomers.length > 0 ? `OR` : ``
          //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
          // )
          .take(data.take)
          .skip(data.skip)
          .addOrderBy(
            data.column == "rcusttypeen" || data.column == "rcusttypear" ? "rcusttype" : data.column,
            data.orderby
          )
          .getMany();

        count = await this.dao
          .createQueryBuilder("custtable")
          .where({ deleted: false, walkincustomer: true })
          // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
          // .andWhere(
          //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
          //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
          //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
          //         data.sabiccustomers.length > 0 ? `OR` : ``
          //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
          // )
          .addOrderBy(
            data.column == "rcusttypeen" || data.column == "rcusttypear" ? "rcusttype" : data.column,
            data.orderby
          )
          .getCount();
      } else {
        result = await this.dao
          .createQueryBuilder("custtable")
          .where({ deleted: false, walkincustomer: true })
          // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
          // .andWhere(
          //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
          //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
          //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
          //         data.sabiccustomers.length > 0 ? `OR` : ``
          //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
          // )
          .take(data.take)
          .skip(data.skip)
          .orderBy("createddatetime", "DESC")
          .getMany();
        count = await this.dao
          .createQueryBuilder("custtable")
          .where({ deleted: false, walkincustomer: true })
          // .andWhere(`(custgroup in (${data.customergroup}) OR accountnum in (${data.additionalcustomer}) OR accountnum='${data.defaultcustomerid}' or walkincustomer = true)`)
          // .andWhere(
          //     `${data.customergroup.length > 0 ? `custgroup in (${data.customergroup})` : ``} ${data.customergroup.length > 0 ? `OR` : ``}  ${
          //         data.additionalcustomer.length > 0 ? `accountnum in (${data.additionalcustomer})` : ``
          //     } ${data.additionalcustomer.length > 0 ? `OR` : ``} ${data.sabiccustomers.length > 0 ? `accountnum in (${data.sabiccustomers})` : ``} ${
          //         data.sabiccustomers.length > 0 ? `OR` : ``
          //     } ${data.defaultcustomerid ? `accountnum='${data.defaultcustomerid}'` : ``} or walkincustomer = true`
          // )
          .getCount();
      }
    }
    return { data: result, count };
  }

  async mobile_pagination(data: any) {
    // let additionalcustomer = this.sessionInfo.additionalcustomer.split(",");
    // let customergroup = this.sessionInfo.customergroup.split(",");
    // data.additionalcustomer = "";
    // data.customergroup = "";
    // additionalcustomer.forEach((element: any) => {
    //     data.additionalcustomer += additionalcustomer.indexOf(element) == additionalcustomer.length - 1 ? "'" + element + "'" : "'" + element + "', ";
    // });
    // customergroup.forEach((element: any) => {
    //     data.customergroup += customergroup.indexOf(element) == customergroup.length - 1 ? "'" + element + "'" : "'" + element + "', ";
    // });
    let query = `select 
        c.accountnum, 
        c.name, 
        c.namealias,
        c.phone,
        c.pricegroup,
        c.inventlocation,
        c.dataareaid,
        c.walkincustomer,
        c.custgroup,
        c.cashdisc,
        c.salesgroup,
        c.currency,
        c.paymtermid,
        c.custtype,
        c.rcusttype,
        c.dimension as regionid,
        c.dimension2_ as departmentid,
        c.dimension3_ as costcenterid,
        c.dimension4_ as employeeid,
        c.dimension5_ as projectid,
        c.blocked as blocked,
        (CASE 
          WHEN c.dimension6_!='' THEN concat(d.num,' - ', d.description)
          ELSE '${data.salesmanid.length > 0 ? data.salesmanid[0].salesman : null}'
      END
       ) as salesman,
       (CASE 
        WHEN c.dimension6_!='' THEN concat(d.num)
        ELSE '${data.salesmanid.length > 0 ? data.salesmanid[0].salesmanid : null}'
    END
     ) as salesmanid,
        c.dimension7_ as brandid,
        c.dimension8_ as productlineid,
        c.rcusttype from custtable c
        left join dimensions d on c.dimension6_ = d.num 
        where c.deleted = false `;

    if (data.type == "designerservice") {
      query += ` and( c.paymtermid = 'CASH' or c.walkincustomer=true) `;
    } else if (data.type == "walkincustomer") {
      query += ` and (c.walkincustomer=true) `;
    } else {
      query += ` and (`;
      if (data.customergroup.length > 0) {
        query += `(c.custgroup in (${data.customergroup}) or c.walkincustomer = true) `;
      }

      if (data.additionalcustomer.length > 0) {
        query += `OR (c.accountnum in (${data.additionalcustomer}) or c.walkincustomer = true) `;
      }

      if (data.sabiccustomers.length > 0) {
        query += `OR (c.accountnum in (${data.sabiccustomers}) or c.walkincustomer = true) `;
      }
      if (data.defaultcustomerid) {
        query += ` or (c.accountnum='${data.defaultcustomerid} or c.walkincustomer = true') `;
      }
      query += `)`;
    }

    if (data.filter) {
      query += ` and (c.accountnum ILike '%${data.filter}%' or 
            c.name ILike '%${data.filter}%' or 
            c.namealias ILike '%${data.filter}%')`;
    }
    query += ` ORDER BY 
        c.createddatetime DESC offset ${(data.page - 1) * data.pageCount} limit ${data.pageCount}`;

    return await this.db.query(query);
  }
}

Object.seal(CusttableDAO);
