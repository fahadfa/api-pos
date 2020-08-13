import { getManager } from "typeorm";
import { App } from "../../utils/App";
var moment = require("moment");

export class RawQuery {
  public sessionInfo: any;

  private db: any;

  constructor() {
    this.db = getManager();
  }

  async getCustomerOverDue(accountNum: string) {
    const query = `SELECT overdue.invoiceamount FROM "overdue" WHERE overdue.accountnum = '${accountNum}' AND overdue.payment = 0`;
    return await this.db.query(query);
  }

  async getPaymTermDays(paymTermId: string) {
    const query = `SELECT paymterm.numofdays FROM "paymterm" WHERE paymterm.paymtermid like '%${paymTermId}%'`;
    return await this.db.query(query);
  }

  async getCustomer(accountNum: string) {
    const query = `select 
        c.accountnum, 
        c.name, 
        c.namealias, 
        c.address, 
        c.phone, 
        c.rcusttype, 
        c.pricegroup,
        c.inventlocation,
        c.dataareaid,
        c.walkincustomer,
        c.custgroup,
        c.districtcode,
        c.citycode,
        c.cashdisc,
        c.paymtermid,
        c.salesgroup,
        c.creditmax,
        c.currency,
        c.vendaccount,
        c.vatnum,
        c.countryregionid,
        c.inventlocation,
        c.email,
        c.url,
        c.blocked,
        c.taxgroup,
        c.paymmode,
        c.bankaccount,
        c.namealias,
        c.invoiceaddress,
        c.incltax,
        c.numbersequencegroup,
        c.city,
        c.custclassificationid,
        c.identificationnumber,
        c.modifieddatetime,
        c.createddatetime,
        c.dataareaid,
        c.recversion,
        c.recid,
        c.custtype,
        c.walkincustomer,
        c.lastmodifiedby,
        c.lastmodifieddate,
        c.createdby,
        c.zipcode,
         (CASE 
              WHEN c.dimension6_!='' THEN concat(d.num,' - ', d.description)
              ELSE '${this.sessionInfo.salesmanid.length > 0 ? this.sessionInfo.salesmanid[0].salesman : null}'
          END
           ) as salesman,
           (CASE 
            WHEN c.dimension6_!='' THEN concat(d.num)
            ELSE '${this.sessionInfo.salesmanid.length > 0 ? this.sessionInfo.salesmanid[0].salesmanid : null}'
        END
         ) as salesmanid
       from custtable c
       left join dimensions d on c.dimension6_ = d.num
       where accountnum='${accountNum}' LIMIT 1`;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async getCustomerTaxGroup(accountNum: string) {
    const query = `select 
        accountnum, 
        taxgroup
       from custtable where accountnum='${accountNum}' LIMIT 1`;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async customers_count() {
    const query = `select 
            count(*)
           from custtable where deleted = false`;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async getNumberSequence(numberSequence: string) {
    const query = `select 
        LPAD(nextrec::text, 5, '0') as nextrec, 
        format, lastmodifieddate    
        from numbersequencetable where numbersequence='${numberSequence}'`;
    let data: any = await this.db.query(query);
    // console.log(data);
    return data.length > 0 ? data[0] : null;
  }

  async updateNumberSequence(numberSequence: string, value: any) {
    // let date = new Date().toISOString();
    let date = moment().format();
    let query = `UPDATE numbersequencetable
        SET nextrec = ${parseInt(value) + 1},
        lastmodifieddate = '${date}' `;

    query += ` WHERE numbersequence = '${numberSequence}'`;
    let data: any = await this.db.query(query);
    return data;
  }

  async updateSalesTable(salesId: any, status: any, date: string = null) {
    let query = `UPDATE salestable
        SET originalprinted = '${true}',
        status = '${status}'`;
    if (date) {
      query += `
      ,lastmodifieddate = '${date}' `;
    }
    query += ` WHERE salesid = '${salesId}'`;
    let data: any = await this.db.query(query);
    return data;
  }

  async updateDocumentStatus(salesId: any) {
    const query = `UPDATE salestable
        SET documentstatus = '${true}'
        WHERE salesid = '${salesId}'`;
    let data: any = await this.db.query(query);
    return data;
  }

  async getInventTrans(reqData: any) {
    try {
      // console.log(reqData);
      let query = `
            select a.itemid, a.nameen, a.namear, a.configid, a.inventsizeid, a.batchno, a.batchexpdate,  
            a.sizeNameEn as "sizeNameEn", a.sizeNameAr as "sizeNameAr", 
            a.availabilty as "availabilty",
            coalesce(a.reservedquantity, 0) as "reservedQuantity", 
            (coalesce(a.reservedquantity, 0)+ a.availabilty) as "totalAvailable"
            from(
            select
            i.itemid as itemid,
            bs.name_en as nameEn,
            bs.name_ar as nameAr,
            cast(SUM(i.qty) as decimal(10,2)) as availabilty,
            i.configid as configid,
            i.inventsizeid as inventsizeid,
            i.batchno as batchno,
            to_char(b.expdate, 'yyyy-MM-dd') as batchexpdate,
            sz.name_en as sizeNameEn,
            sz.name_ar as sizeNameAr,
            (select ABS(sum(j.qty)) from inventtrans as j 
            where j.itemid=i.itemid and j.configid=i.configid 
            and j.inventsizeid=i.inventsizeid and j.batchno = i.batchno and j.transactionclosed = true and 
            j.reserve_status = 'RESERVED' group by 
            j.itemid,  j.configid, j.inventsizeid, j.batchno) as reservedquantity
            from inventtrans as i
            left join inventbatch b on i.batchno = b.inventbatchid
            left join bases bs on i.itemid = bs.code
            left join sizes sz on sz.code = i.inventsizeid
            left join salestable st on st.salesid = i.transrefid
            where i.inventlocationid='${reqData.inventlocationid}' and transactionclosed = true`;

      if (reqData.itemId) {
        query = query + ` and i.itemid = '${reqData.itemId}'`;
        if (reqData.configid) {
          query = query + ` and i.configid='${reqData.configid}'`;
        }
        if (reqData.inventsizeid) {
          query = query + ` and i.inventsizeid='${reqData.inventsizeid}'`;
        }
        if (reqData.salesid) {
          query = query + ` and i.invoiceid='${reqData.salesid}'`;
        }
        if (reqData.returnorderid) {
          query = query + ` and i.transrefid='${reqData.returnorderid}'`;
        }
      }
      query =
        query +
        ` GROUP BY
                i.itemid, i.configid, i.inventsizeid, i.batchno, b.expdate, bs.name_en, bs.name_ar, sz.name_en, sz.name_ar) as a`;

      let data: any = await this.db.query(query);
      let warehouse = await this.getWareHouseDetails(reqData.inventlocationid);
      let wareHouseNamear = warehouse && warehouse.length > 0 ? warehouse[0].name : "";
      let wareHouseNameEn = warehouse && warehouse.length > 0 ? warehouse[0].namealias : "";
      data.forEach((z: any) => {
        z.nameEn = wareHouseNameEn;
        z.nameAr = wareHouseNamear;
      });
      console.log(reqData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async checkInventoryForColors(reqData: any) {
    let basequery = `select b.code as code from bases b where b.id = '${reqData.baseId}'`;
    let baseCode = await this.db.query(basequery);

    let query = `select distinct bsc.color_id as id, c.code, b.code from base_size_colors bsc 
        inner join colors c on c.id = bsc.color_id 
        inner join base_sizes bs on bs.id = bsc.base_size_id
        inner join bases b on b.id = bs.base_id
        where b.id = '${reqData.baseId}' and c.code in 
        (select distinct i.configid from inventory_onhand i 
            where i.inventlocationid='${reqData.inventlocationid}' and i.itemid = '${baseCode[0].code}'
            group by i.configid having sum(i.qty_in-i.qty_out) > 0)`;
    return await this.db.query(query);
  }

  async inventoryOnHand(reqData: any) {
    let query = `select distinct on (i.id, i.itemid, i.configid, i.inventsizeid, i.batchno)
        i.itemid as itemid,
        bs.namealias as nameEn,
        bs.itemname as nameAr,
        (i.qty_in-i.qty_out-i.qty_reserved) as availabilty,
        i.configid as configid,
        i.inventsizeid as inventsizeid,
        i.batchno as batchno,
        i.batchno as "batchNo",
        to_char((CASE 
          WHEN i.batchno = '-' THEN now()
          WHEN i.batchno = '--' THEN now()
          ELSE b.expdate
          END
        ),'yyyy-MM-dd') as batchexpdate,
        sz.description as "sizeNameEn",
        sz."name" as "sizeNameAr",
        i.qty_reserved as "reservedQuantity",
        (i.qty_in-i.qty_out) as "totalAvailable"
        from inventory_onhand as i
        left join inventbatch b on i.batchno = b.inventbatchid and i.itemid = b.itemid
        left join inventtable bs on i.itemid = bs.itemid
        left join inventsize sz on sz.inventsizeid = i.inventsizeid and sz.itemid = i.itemid
        where i.inventlocationid='${reqData.inventlocationid}' and (i.qty_in-i.qty_out)>0 
        `;
    if (reqData.itemId) {
      query = query + ` and LOWER(i.itemid) = LOWER('${reqData.itemId}')`;
      if (reqData.configid) {
        query = query + ` and LOWER(i.configid)=LOWER('${reqData.configid}')`;
      }
      if (reqData.inventsizeid) {
        query = query + ` and LOWER(i.inventsizeid)=LOWER('${reqData.inventsizeid}')`;
      }
    }
    return await this.db.query(query);
  }

  async getWareHouseDetails(wareHouseId: any) {
    return this.db.query(`select name, namealias from inventlocation where inventlocationid = '${wareHouseId}'`);
  }

  async getSelectedBatches(reqData: any, transactionclosed: boolean = false) {
    try {
      console.log(reqData);
      let salesData = await this.db.query(
        `select status, transkind, inventlocationid from salestable where salesid='${reqData.salesid}'`
      );
      salesData = salesData.length > 0 ? salesData[0] : {};
      if (
        (salesData.status == "APPROVEDBYRM" ||
          salesData.status == "REJECTEDBYRA" ||
          salesData.status == "REJECTEDBYRM" ||
          salesData.status == "APPROVEDBYRA" ||
          salesData.status == "PENDINGRMAPPROVAL" ||
          salesData.status == "PENDINGDSNRAPPROVAL") &&
        salesData.transkind == "SALESORDER"
      ) {
        transactionclosed = false;
        reqData.inventlocationid = salesData.inventlocationid;
      } else if (salesData.transkind == "PURCHASEORDER") {
        transactionclosed = true;
      }
      let query: string;
      // ;
      // ;

      if (salesData.transkind == "DESIGNERSERVICERETURN") {
        query = `
                select 
                sl.itemid as itemid,
                sl.salesid as invoiceid,
                CAST(sl.salesqty as  INTEGER) as qty,
                sl.configid as configid,
                sl.inventsizeid as inventsizeid,
                dp.name_en as nameEn,
                dp.name_ar as nameAr
                from salesline sl 
                left join designer_products dp on dp.code = sl.itemid
                where salesid= '${reqData.salesid}'
                `;
      } else {
        query = `
                select
                distinct on (i.id, sl.link_id)
                i.itemid as itemid,
                bs.namealias as nameEn,
                bs.itemname as nameAr,
                CAST(i.qty AS INTEGER) as qty,
                i.configid as configid,
                i.inventsizeid as inventsizeid,
                i.invoiceid as invoiceid,
                i.transrefid as transrefid,
                s."name" as sizenameen,
                s.description as sizenamear,
                i.batchno as batchno,
                i.batchno as "batchNo",
                to_char((CASE 
                  WHEN i.batchno = '-' THEN now()
                  WHEN i.batchno = '--' THEN now()
                  ELSE b.expdate
                  END
                ),'yyyy-MM-dd') as batchExpDate,
                i.sales_line_id as "salesLineId",
                sl.is_item_free  as "isItemFree",
                sl.link_id as "linkId",
                sl.colorantid as "colorantId",
                c.hexcode as hexcode
            from inventtrans  i
            left join salesline sl on sl.id = i.sales_line_id 
            left join inventbatch b on i.batchno = b.inventbatchid and b.itemid = i.itemid and b.configid = i.configid
            left join inventtable bs on i.itemid = bs.itemid
            left join inventsize s on s.inventsizeid = i.inventsizeid and s.itemid = i.itemid
            left join configtable c on c.configid = i.configid and c.itemid = i.itemid
             `;

        if (reqData.salesid) {
          if (
            reqData.type == "RETURNORDER" ||
            reqData.type == "INVENTORYMOVEMENT" ||
            reqData.type == "PURCHASERETURN"
          ) {
            query += `where i.invoiceid = '${reqData.salesid}'`;
            // if (reqData.type == "PURCHASERETURN"){
            //     query+= ` and i.inventlocationid = '${reqData.inventlocationid}' `
            // }
          } else if (reqData.type == "PURCHASEORDER") {
            query += `where (i.invoiceid = '${reqData.salesid}' or i.transrefid = '${reqData.salesid}') and transactionclosed=${transactionclosed} and i.inventlocationid = '${reqData.inventlocationid}'`;
          } else if (reqData.type == "SALESORDER") {
            query += `where  i.transrefid = '${reqData.salesid}' and i.inventlocationid = '${reqData.inventlocationid}'`;
          } else {
            query += `where  i.transrefid = '${reqData.salesid}' and transactionclosed=${transactionclosed} and i.inventlocationid = '${reqData.inventlocationid}'`;
          }
          query += ` order by sl.link_id `;
          // query +=
          //     reqData.type == "RETURNORDER" || reqData.type == "INVENTORYMOVEMENT" || reqData.type == "PURCHASEORDER"
          //         ? ` and i.invoiceid = '${reqData.salesid}'`
          //         : ` and i.transrefid = '${reqData.salesid}' and transactionclosed=true`;
        } else {
          throw "Sales Order Id Required";
        }
      }

      let data: any = await this.db.query(query);
      // console.log(reqData);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateInventTrans(data: any) {
    const query = `insert into inventtrans(itemid, qty, transrefid, invoiceid, configid, inventsizeid, batchno,  inventlocationid, reserve_status) 
        values ('${data.itemid}', '${data.qty}', '${data.transrefid}', '${data.invoiceid}', '${data.configid}', '${data.inventsizeid}', '${data.batchno}', '${data.inventlocationid}', '${data.reserveStatus}')`;
    return await this.db.query(query);
  }

  async getProductIds(dataareaid: string) {
    let query = `select distinct b.id as id from base_size_colors bsc  left join base_sizes bs on ( bsc.base_size_id = bs.id)
        left join bases b on (b.id = bs.base_id)`;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    data.forEach((element: any) => {
      new_data.push(element.id);
    });
    return new_data;
  }

  async getStockInHandArray(inventlocationid: string) {
    let query = `SELECT distinct
                            id
                        FROM
                            bases
                        WHERE
                            code IN (
                                select 
                                i.itemid as itemid
                            from inventory_onhand  i 
                            inner join colors c on i.configid = c.code
                            inner join bases b on i.itemid = b.code
                            inner join base_sizes bs on b.id = bs.base_id
                            inner join sizes s on s.id = bs.size_id
                            inner join base_size_colors bsc on (bsc.color_id = c.id and bsc.base_size_id=bs.id)
                            where i.inventlocationid='${inventlocationid}' GROUP BY
                            i.itemid
                            having SUM(i.qty_in-i.qty_out-i.qty_reserved)>0
                        );`;
    let data: any = await this.db.query(query);
    let new_data: any[] = [];
    data.forEach((element: any) => {
      new_data.push(element.id);
    });
    return new_data;
  }

  async getIitemIds() {
    let query = `select distinct i.itemid from inventtable i
               inner join configtable c on c.itemid = i.itemid
               inner join inventsize sz on sz.itemid = i.itemid`;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.itemid;
    });
    return new_data;
  }

  async getItemsInStock(inventlocationid: string) {
    let query = `select distinct itemid from
              (
              select i.itemid from inventtable i
               inner join configtable c on c.itemid = i.itemid
               inner join inventsize sz on sz.itemid = i.itemid
               inner join inventory_onhand ioh on ioh.itemid = i.itemid
               where ioh.inventlocationid='${inventlocationid}' GROUP BY
               i.itemid
               having SUM(ioh.qty_in-ioh.qty_out-ioh.qty_reserved)>0
               ) as i`;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.itemid;
    });
    return new_data;
  }

  async getColorCodes(param: any) {
    let query = `select distinct c.configid from configtable c
               inner join inventtable i on i.itemid = c.itemid where c.itemid = '${param.itemid}'`;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.configid;
    });
    return new_data;
  }

  async getColorCodesInStock(param: any) {
    let query = `select configid from 
                  (select c.configid from configtable c
                  inner join inventory_onhand ioh on ioh.itemid = c.itemid and c.configid = ioh.configid
                  where ioh.inventlocationid='${param.inventlocationid}' and ioh.itemid = '${param.itemid}' GROUP BY
                  c.configid 
                  having SUM(ioh.qty_in-ioh.qty_out-ioh.qty_reserved)>0)  as i 
               `;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.configid;
    });
    return new_data;
  }

  async getSizeCodes(param: any) {
    let query = `select distinct sz.inventsizeid from inventsize sz
               inner join inventtable i on i.itemid = sz.itemid
               inner join configtable c on c.itemid = sz.itemid
                where sz.itemid = '${param.itemid}' and c.configid = '${param.configid}'`;
    let data = await this.db.query(query);
    // console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.inventsizeid;
    });
    return new_data;
  }

  async getSizeCodesInStock(param: any) {
    let query = ` select distinct io.inventsizeid from inventory_onhand io
                  where io.inventlocationid='${param.inventlocationid}' and io.itemid = '${param.itemid}' and io.configid = '${param.configid}'
                  group by  io.inventsizeid having SUM(io.qty_in-io.qty_out-io.qty_reserved)>0 
               `;
    let data = await this.db.query(query);
    console.log(data);
    let new_data: any[] = [];
    new_data = data.map((element: any) => {
      return element.inventsizeid;
    });
    console.log(new_data);
    return new_data;
  }

  async getHighPrice(data: any) {
    let query: any = `
        select  amount 
        from pricdisctableextra where 
        itemid ='${data.itemid}' and 
        inventsizeid='${data.inventsizeid}' 
        and configid='${data.configid}' and 
        itemrelation ='${data.pricegroup}' limit 1
        `;
    return await this.db.query(query);
  }

  async getCustomerSpecificPrice(data: any) {
    let query: any = `
        select amount as price, tinventsizeid as inventsizeid, configid, itemrelation as itemid
        from pricedisctable 
        where (itemcode = 0) and (accountcode = 1 or accountcode = 0) 
        and currency = '${data.currency}' and 
        itemrelation = '${data.itemid}' and (configid='${data.configid}' or configid='--')  and 
        accountrelation = '${data.custaccount}' and tinventsizeid = '${data.inventsizeid}'
        `;
    return await this.db.query(query);
  }

  async sizePrices(data: any) {
    let query: any = `
            select amount as price, tinventsizeid as inventsizeid, configid, itemrelation as itemid
            from pricedisctable 
            where (itemcode = 0) and (accountcode = 1 or accountcode = 0) 
            and currency = '${data.currency}' and 
            itemrelation = '${data.itemid}' and (configid='${data.configid}' or configid='--') and 
            accountrelation = '${data.pricegroup}' and tinventsizeid = '${data.inventsizeid}'
            `;
    return await this.db.query(query);
  }

  async allSizePrices(data: any) {
    let query: any = `
            select amount as price, tinventsizeid as inventsizeid, configid, itemrelation as itemid, accountrelation as accountrelation
            from pricedisctable 
            where (itemcode = 0) and (accountcode = 1 or accountcode = 0) 
            and currency = '${data.currency}' and 
            itemrelation = '${data.itemid}' and (configid='${data.configid}' or configid='--') and 
            (accountrelation = '${data.pricegroup}' or accountrelation = '${data.custaccount}' or accountrelation = '${data.spGroup}') and tinventsizeid in (${data.inventsizeids})
            `;
    return await this.db.query(query);
  }

  async getNormalPrice(data: any) {
    let query: any = `
        select  amount 
        from pricedisctable 
        where (itemcode = 0) and (accountcode = 1 or accountcode = 0) 
        and currency = '${data.currency}' and itemrelation = '${data.itemid}' and (configid='${data.configid}' or configid='--')
        and tinventsizeid = '${data.inventsizeid}' and 
        (accountrelation = '${data.pricegroup}' or  accountrelation = '${data.custaccount}') limit 1
        `;
    return await this.db.query(query);
  }

  async checkInstantDiscount(custaccount: any) {
    let query = `select 
        * from custtotaldiscount where dataareaid ='ajp' and custaccount = '${custaccount}' order by minamount`;
    let data: any = await this.db.query(query);
    return data;
  }

  async instantDiscountExcludeItems(id: any) {
    let query = `select istantdiscountexclude from usergroupconfig where id = '${id}' limit 1`;
    let data: any = await this.db.query(query);
    return data;
  }
  async getDiscounts(accountnum: any, orderType: any = null) {
    let query: string;
    if (orderType && orderType == "purchase") {
      query = `select 
        accountnum, name, vendgroup as custgroup, 
        pricegroup, enddisc, linedisc, multilinedisc from vendortable where accountnum='${accountnum}' limit 1`;
    } else {
      query = `select 
            accountnum, name, custgroup, 
            pricegroup, enddisc, linedisc, multilinedisc from custtable where accountnum='${accountnum}' limit 1`;
    }

    let data: any = await this.db.query(query);
    return data;
  }

  async getTotalDiscPercentage(accountrelation: any, currency: any, dataareaid: any) {
    let query = `select percent1 from pricedisctable where module=1 and 
        itemcode=2 and accountcode = 1 and dataareaid='${dataareaid}' and 
        accountrelation='${accountrelation}' `;
    currency = currency ? currency : "SAR";
    query += ` and currency = '${currency}' `;
    query += ` limit 1`;
    let data: any = await this.db.query(query);
    data = data.length > 0 ? data[0].percent1 : 0;
    return data;
  }
  async checkItemIncludeForDiscount(disctype: string, itemid: any, dataareaid: any) {
    let query = `select ${disctype} 
        from inventtablemodule where dataareaid='${dataareaid}' and moduletype=2 and itemid='${itemid}' limit 1`;
    let data: any = await this.db.query(query);
    console.log(data);
    let dummyData: any = {};
    dummyData.disctype = 0;
    data = data.length > 0 ? data[0] : dummyData;
    console.log(data);
    return data;
  }
  async getMultiDiscRanges(accountrelation: any, currency: any, dataareaid: any) {
    let query = `SELECT itemrelation, ACCOUNTRELATION,QUANTITYAMOUNT,
       CURRENCY,PERCENT1 FROM 
       PRICEDISCTABLE WHERE MODULE = 1 AND 
       ITEMCODE = 1 AND ACCOUNTCODE = 1 AND 
       ACCOUNTRELATION = '${accountrelation}' AND DATAAREAID = '${dataareaid}' AND CURRENCY='${currency}'`;
    let data: any = await this.db.query(query);
    return data;
  }

  // async getVoucherDiscounts(code: string, dataareaid: string) {
  //   let query = `
  //       select
  //       id as id,
  //       code as code,
  //       name as name,
  //       is_multiple as ismultiple,
  //       voucher_type as vouchertype,
  //       relation_type as relationtype,
  //       relation as relation,
  //       percentage as percentage,
  //       discount_amount as discountamount,
  //       amount_used_till_date as amountused,
  //       min_amount as minamount,
  //       max_amount as maxamount,
  //       min_quantity as minquantity,
  //       max_quantity as maxquantity,
  //       start_date as startdate,
  //       end_date enddate,
  //       quota as quota,
  //       max_quota as maxquota,
  //       currency_type as currency,
  //       Communication_channel as communicationchannel
  //       from voucher where code = '${code}' and dataareaid ='${dataareaid}' limit 1
  //       `;
  //   let data: any = await this.db.query(query);
  //   return data.length > 0 ? data[0] : null;
  // }

  async getVoucherDiscounts(code: string, dataareaid: string) {
    let query = `SELECT 
                  id, 
                  dataareaid, 
                  salesid, 
                  custaccount, 
                  is_used, 
                  is_enabled,
                  voucher_num, 
                  voucher_type, 
                  discount_percent, 
                  allowed_numbers, 
                  used_numbers, 
                  expiry_date
                  FROM public.discountvoucher
                  WHERE voucher_num='${code}' and dataareaid = '${dataareaid}' limit 1;
                 `;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : null;
  }

  async getVoucherDiscountItems(voucherType: string, itemidArray: any) {
    let query = `SELECT 
                id, 
                dataareaid, 
                recversion, 
                recid, 
                itemid, 
                from_date, 
                to_date, 
                discount_percent,
                voucher_type
                FROM voucherdiscountitems
                WHERE voucher_type='${voucherType}' and itemid in(${itemidArray});
                `;
    let data = await this.db.query(query);
    return data;
  }

  async updateVoucherDiscounts(data: any) {
    let query = `
                UPDATE discountvoucher
                SET  salesid='${data.salesId}', 
                custaccount='${data.custAccount}', 
                is_used=0, 
                used_numbers=used_numbers+1
                WHERE voucher_num='${data.voucherNum}';
                `;
    this.db.query(query);
  }

  async groupProducIds(groupid: string) {
    let query = `select itemid from inventtable where itemgroupid='${groupid}'`;
    let data = await this.db.query(query);
    data = data.length > 0 ? data : [];
    data = data.map((item: any) => item.itemid);
    return data;
  }
  async getSalesOrderRelatedReturnOrderIds(salesId: string) {
    const query = `select salesid from salestable where intercompanyoriginalsalesid='${salesId}' and status = 'POSTED'`;
    let data: any = await this.db.query(query);
    data = data.length > 0 ? data : [];
    data = data.map((item: any) => item.salesid);
    return data;
  }

  async warehouse(id: string) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid = '${id}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async workflowstatus(salesid: string) {
    const query = `select 
            statusid as status from workflow
            where orderid= '${salesid}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : null;
  }

  async workflowconditions(usergroupconfigid: string) {
    const query = `select 
            returnorderapprovalrequired  as "approvalRequired", 
            returnorderrmapprovalrequired as "rmApprovalRequired",
            returnorderraapprovalrequired "raApprovalRequired", 
            projectcustomer, 
            agentcustomer from  usergroupconfig
            where id= '${usergroupconfigid}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async getRmAndRa(usergroupid: string) {
    const query = `select rmsigningauthority as rm, rasigningauthority as ra, designer_signing_authority as designer_signing_authority 
        from usergroupconfig where usergroupid = '${usergroupid}' limit 1`;
    let data = await this.db.query(query);
    console.log(data);
    return data ? data[0] : {};
  }
  async getbatchavailability(data: any) {
    const query = `select
        sum(i.qty_in-i.qty_out-i.qty_reserved) as availabilty
        from inventory_onhand  i
        where i.inventlocationid='${data.inventlocationid}'
        and i.itemid = '${data.itemid}' and i.configid='${data.configid}' and 
        i.inventsizeid='${data.inventsizeid}' and i.batchno = '${data.batchno}'
        GROUP BY i.itemid,  i.configid, i.inventsizeid, i.batchno
        `;
    let result = await this.db.query(query);
    console.log(result);
    return result.length > 0 ? (result[0].availabilty < 0 ? 0 : result[0].availabilty) : 0;
  }

  async get_vedor_related_custaccount(accountnum: string) {
    const query = `select custaccount from vendortable where accountnum = '${accountnum}'
        `;
    let result = await this.db.query(query);
    console.log(result);
    return result.length > 0 ? result[0].custaccount : null;
  }

  async getDesignerServiceList(customerid: any, mobileno: any) {
    let query = `
                select distinct d.invoiceid, d.customerid, 
                cast(coalesce(d.balanceamount, 0) as Decimal(10,2)) as "balanceAmount", 
                cast((coalesce(d.designerserviceamount, 0) - coalesce(d.balanceamount, 0)) as Decimal(10,2)) as "usedAmount", 
                cast(coalesce(d.designerserviceamount, 0) as Decimal(10,2)) as "designerserviceAmount" from 
                (
                select 
                a.invoiceid, 
                a.customerid,
                a.custphone,
                (select ABS(sum(b.amount)) from designerservice b where b.invoiceid=a.invoiceid and b.customerid = a.customerid and b.custphone= a.custphone group by b.invoiceid, b.customerid, b.custphone ) 
                as balanceamount,
                (select ABS(sum(e.amount)) from designerservice e where e.amount > 0 and e.salesorderid is null and e.invoiceid=a.invoiceid and e.customerid = a.customerid and e.custphone = a.custphone group by e.invoiceid, e.customerid, e.custphone)
                as designerserviceamount
                from designerservice a where a.customerid = '${customerid}' and a.custphone = '${mobileno}')  as d where d.balanceamount > 0
                    `;
    return await this.db.query(query);
  }

  async getDiscountBlockItems(custgroup: string, accountnum: string, inventlocationid: string) {
    let query = `select itemid from ajp_block_discounts where 
        inventlocationid='${inventlocationid}' and 
        (price_disc_account_relation ='${custgroup}' or price_disc_account_relation='${accountnum}')`;
    return await this.db.query(query);
  }

  async getAramkoTahkomDiscounts(custaccount: string, dataareaid: string) {
    let query = `select 
        dataareaid, int_ext as "intExt", 
        sales_discount as "salesDiscount", 
        customer_id as "customerId" 
        from interior_exterior where customer_id='${custaccount}' and dataareaid='${dataareaid}'`;
    return await this.db.query(query);
  }

  async getBuyOneGetOneDiscountItems(items: string, inventlocationid: string, custaccount: string, custtype: string) {
    let buyOneGetOneDiscountQuery: string = `select
                                                    dataareaid, 
                                                    inventlocationid, 
                                                    itemid,
                                                    inventsizeid,
                                                    configid,
                                                    multiple_qty as "multipleQty", 
                                                    free_qty as "freeQty", 
                                                    price_disc_item_code as "priceDiscItemCode", 
                                                    price_disc_account_relation as "priceDiscAccountRelation"
                                                    from sales_promotion_items_equal where 
                                                    inventlocationid = '${inventlocationid}'
                                                    and (price_disc_account_relation = '${custaccount}' 
                                                    or price_disc_account_relation='${custtype}' or price_disc_item_code=2)
                                                    and itemid in (${items})`;
    return await this.db.query(buyOneGetOneDiscountQuery);
  }

  async getPromotionalDiscountItems(items: string, inventlocationid: string, custaccount: string, custtype: string) {
    let promotionalDiscountQuery: string = `select
                                                    dataareaid, 
                                                    inventlocationid, 
                                                    itemid,
                                                    inventsizeid,
                                                    configid,
                                                    multiple_qty as "multipleQty", 
                                                    free_qty as "freeQty", 
                                                    price_disc_item_code as "priceDiscItemCode", 
                                                    price_disc_account_relation as "priceDiscAccountRelation"
                                                    from sales_promotion_items where 
                                                    inventlocationid = '${inventlocationid}'
                                                    and (price_disc_account_relation = '${custaccount}' 
                                                    or price_disc_account_relation='${custtype}' or price_disc_item_code=2)
                                                    and itemid in (${items})`;
    return this.db.query(promotionalDiscountQuery);
  }

  async getSalesDisocuntItems(items: string, inventlocationid: string, custaccount: string, custtype: string) {
    try {
      let SpecialDisocuntQuery: string = `select
                                                    dataareaid, 
                                                    inventlocationid, 
                                                    itemid,
                                                    inventsizeid,
                                                    configid,
                                                    discount_type as "discountType", 
                                                    discount as "discount", 
                                                    price_disc_item_code as "priceDiscItemCode", 
                                                    price_disc_account_relation as "priceDiscAccountRelation"
                                                    from sales_discounts_on_products where 
                                                    inventlocationid = '${inventlocationid}'
                                                    and (price_disc_account_relation = '${custaccount}' 
                                                    or price_disc_account_relation='${custtype}' or price_disc_item_code=2)
                                                    and itemid in (${items}) and is_active = true`;
      return await this.db.query(SpecialDisocuntQuery);
    } catch (e) {
      return [];
    }
  }

  async checkDiscounts(items: string) {
    let discQuery: string = `select itemid, enddisc, linedisc, multilinedisc
        from inventtablemodule where dataareaid='ajp' and moduletype=2 and itemid in (${items})`;
    return await this.db.query(discQuery);
  }

  async updateFiscalYearClose(yearNo: number, date: any) {
    let query = `update fiscalyear set closing = 1 where yearno= ${yearNo} and endingdate = '${date[2]}-${date[1]}-${date[0]}'`;
    return await this.db.query(query);
  }

  async financialYearCloseCondition(dataareaid: any) {
    const query = `select journalnum, balance from (select 
            journalnum, 
            cast((sum(amountcurdebit)-sum(amountcurcredit)) as integer ) as balance
            from ledgerjournaltrans
            trans where dataareaid='${dataareaid}' group by journalnum) as i where balance <> 0;`;
    let result: any = await this.db.query(query);
    return result && result.length > 0 ? true : false;
  }

  async getCustomerCreditMax(accountNum: string) {
    let custDetails = await this.db.query(`select creditmax from custtable where accountnum = '${accountNum}'`);
    custDetails = custDetails.length >= 1 ? custDetails[0] : {};
    return custDetails;
  }

  async getNumberSeq(seq: string) {
    return await this.db.query(`select 
                numbersequence
                from numbersequencetable where numbersequence='${seq}'`);
  }

  async updateSalesTableWorkFlowStatus(salesId: string, status: string) {
    return await this.db.query(
      `update salestable set status = '${status}', lastmodifieddate = '${new Date().toISOString()}' where salesid='${salesId}'`
    );
  }

  async updateSalesLine(salesId: string, status: string) {
    return await this.db.query(
      `update salesline set status = '${status}', lastmodifieddate = '${new Date().toISOString()}' where salesid='${salesId}'`
    );
  }

  async getBaseSizeBatchesList(invoiceid: string) {
    return await this.db.query(`
        select itemid,batchno as "batchNo", configid, inventsizeid, CAST(ABS(qty) as INTEGER) as quantity, sales_line_id as saleslineid from inventtrans where invoiceid = '${invoiceid}'
    `);
  }

  async salesTableInterCompanyOriginalData(salesId: string, transkind: string = null) {
    return await this.db.query(`select * from salestable 
        where intercompanyoriginalsalesid = '${salesId}' ${transkind ? `and transkind = '${transkind}'` : ""}`);
  }
  async salesTableData(salesId: string, transkind: string = null) {
    return await this.db.query(`select * from salestable 
        where salesid = '${salesId}' ${transkind ? `and transkind = '${transkind}'` : ""}`);
  }

  async checkDesignerServiceUsed(invoiceid: any) {
    return await this.db.query(`select SUM(amount) as amount from designerservice 
        where invoiceid = '${invoiceid} group by invoiceid`);
  }
  async salesTableInventlocation(inventLocationId: string, salesId: string) {
    return await this.db.query(
      `update salestable set inventlocationid='${inventLocationId}' where salesid='${salesId}'`
    );
  }

  async getColorid(code: string) {
    let data = await this.db.query(`select id from colors where code = '${code}'`);
    return data.length > 0 ? data[0] : null;
  }

  async getItemTaxGroup(code: string) {
    let data = await this.db.query(
      `select taxitemgroupid from inventtablemodule where itemid = '${code}' and moduletype=2 limit 1`
    );
    return data.length > 0 ? data[0] : {};
  }

  async getsizeid(code: any) {
    let data = await this.db.query(`select id from sizes where code = '${code}'`);
    return data.length > 0 ? data[0] : null;
  }
  async getbaseid(code: any) {
    let data = await this.db.query(`select id from bases where code = '${code}'`);
    return data.length > 0 ? data[0] : null;
  }
  async getbasesizeid(reqData: any) {
    let data = await this.db.query(
      `select id from base_sizes where base_id = '${reqData.baseId}' and size_id = '${reqData.sizeId}'`
    );
    console.log(data);
    return data.length > 0 ? data[0] : null;
  }

  static async CheckUserInfo(userInfo: any) {
    if (userInfo) {
      let data = await getManager().query(`select groupid from user_info where user_name='${userInfo.userName}'`);
      data = data ? data[0] : {};
      console.log(data);
      console.log(
        "userInfo: " + userInfo.userName,
        " groupid location:" + data.inventlocationid,
        " inventlocationid: " + userInfo.inventlocationid
      );
      if (data.groupid == userInfo.groupid) {
        if (process && process.env && process.env.ENV_STORE_ID) {
          if (userInfo.inventlocationid == process.env.ENV_STORE_ID) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  async deleteBalances(inventlocationid) {
    await this.db.query(`delete from inventory_onhand where inventlocationid = '${inventlocationid}'`);
    await this.db.query(`delete from inventtrans where inventlocationid = '${inventlocationid}'`);
    await this.db.query(`delete from salesline where inventlocationid = '${inventlocationid}'`);
    await this.db.query(`delete from salestable where inventlocationid = '${inventlocationid}'`);
  }
  async checkItems(inventlocationid: string, itemsList: any[], colorsList: any[], sizesList: any[]) {
    let items = itemsList.map((d: any) => `lower('${d}')`).join(",");
    let sizes = sizesList.map((d: any) => `lower('${d}')`).join(",");
    let colors = colorsList.map((d: any) => `lower('${d}')`).join(",");
    let query = `select itemid, configid, inventsizeid,  sum(qty_in-qty_out-qty_reserved) as qty from inventory_onhand  
    where lower(itemid) in (${items})
    and lower(configid) in (${colors})
    and lower(inventsizeid) in (${sizes})
    and inventlocationid = '${inventlocationid}'
    group by itemid, configid, inventsizeid `;
    return await this.db.query(query);
  }

  async checkBatchAvailability(
    inventlocationid: string,
    itemsList: any[],
    colorsList: any[],
    sizesList: any[],
    batchList: any[]
  ) {
    let items = itemsList.map((d: any) => `lower('${d}')`).join(",");
    let sizes = sizesList.map((d: any) => `lower('${d}')`).join(",");
    let colors = colorsList.map((d: any) => `lower('${d}')`).join(",");
    let batches = batchList.map((d: any) => `lower('${d}')`).join(",");
    let query = `select itemid, configid, inventsizeid, batchno,  sum(qty_in-qty_out-qty_reserved) as qty from inventory_onhand  
    where lower(itemid) in (${items})
    and lower(configid) in (${colors})
    and lower(inventsizeid) in (${sizes})
    and lower(batchno) in (${batches})
    and inventlocationid = '${inventlocationid}'
    group by itemid, configid, inventsizeid, batchno`;
    return await this.db.query(query);
  }

  async getSalesToken(id: any) {
    let query = `select auth_token as "authToken" from salesorder_tokens where order_id = '${id}'`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async checkSalesStatus(id: any) {
    let query = `select status from salestable where salesid = '${id}'`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : {};
  }

  async salesmanList(reqData: any) {
    let data: any;
    let ids = reqData
      .split(",")
      .map((d: any) => `'${d}'`)
      .join(",");
    let query = `select concat(num,' - ', description) as salesman, num as salesmanid
    from dimensions where num in(${ids})`;
    data = await this.db.query(query);
    return data;
  }
  async salesman(salesmanId: any) {
    let data: any;
    let query = `select concat(num,' - ', description) as salesman
    from dimensions where num = '${salesmanId}'`;
    data = await this.db.query(query);
    return data.length > 0 ? data[0].salesman : null;
  }

  async updateSynctable(inventlocationid: string = null) {
    let query = `update sync_table set updated_on = '1900-01-01' 
    where map_table ='usergroupconfig' `;
    if (inventlocationid) {
      query += ` and group_on = '${inventlocationid}'`;
    }
    return await this.db.query(query);
  }

  async getCustomerTax(taxcode: string) {
    let query = `select tg.taxcode, t.taxvalue as vat
                  from taxgroupdata tg 
                  inner join taxdata t on tg.taxcode =t.taxcode where tg.taxgroup = '${taxcode}'`;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0] : null;
  }

  async offlineSystems() {
    try {
      let query = `select distinct id from sync_source where type != 'ONLINE'`;
      let data = await this.db.query(query);
      return data;
    } catch (err) {
      return Promise.resolve([]);
    }
  }

  async getDesignerProducts() {
    let query = `
    select 
    distinct
     id,
    'HSN-00004' as code,
     name_ar as "nameAr",
     name_en as "nameEn",
     price as price,
     vat as vat,
     dataareaid as dataareaid,
     '--' as configid,
     name_en as inventsizeid
     from designer_products order by price
    `;
    let data = await this.db.query(query);
    return data;
  }

  async getPrevReturnOrderAmount(salesId: string) {
    let query = `select 
                sum(coalesce(cash_amount,0)) as "cashAmount", 
                sum(coalesce(redeemptsamt,0)) as "redeemAmount",
                sum(coalesce(design_service_redeem_amount,0)) as "designServiceRedeemAmount",
                sum(coalesce(card_amount,0)) as "cardAmount"
                from salestable s where intercompanyoriginalsalesid = '${salesId}'
                group by intercompanyoriginalsalesid `;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0] : null;
  }
  async getVendorCustomerAccount(accountnum: string) {
    let query = `
    select 
    accountnum, name, vendgroup as custgroup, custaccount,
    pricegroup, enddisc, linedisc, multilinedisc from vendortable where accountnum='${accountnum}' limit 1
    `;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0].custaccount : null;
  }
  async desiner_product_name(itemid: string) {
    let data: any = await this.db.query(` select name_en from designer_products where code = '${itemid}'`);
    return data.length > 0 ? data[0].name_en : "-";
  }
}

Object.seal(RawQuery);
