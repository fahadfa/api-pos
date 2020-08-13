import { getManager } from "typeorm";
import { Props } from "../../constants/Props";
import { threadId } from "worker_threads";
import { RawQuery } from "./RawQuery";
import { MenuGroupDAO } from "../repos/MenuGroupDAO";
import { App } from "../../utils/App";

export class LoadService {
  public sessionInfo: any;
  public rawQuery: RawQuery;
  private menuGroupRepository: MenuGroupDAO;
  private db: any;

  constructor() {
    this.db = getManager();
    this.rawQuery = new RawQuery();
    this.menuGroupRepository = new MenuGroupDAO();
  }

  async customer(param: any) {
    console.log("customer search");
    try {
      param.additionalcustomer = this.sessionInfo.additionalcustomer
        ? this.sessionInfo.additionalcustomer
            .split(",")
            .map((d: any) => `'${d}'`)
            .join(",")
        : null;
      param.customergroup = this.sessionInfo.customergroup
        ? this.sessionInfo.customergroup
            .split(",")
            .map((d: any) => `'${d}'`)
            .join(",")
        : null;
      param.sabiccustomers = this.sessionInfo.sabiccustomers
        ? this.sessionInfo.sabiccustomers
            .trim()
            .split(",")
            .map((d: any) => `'${d}'`)
            .join(",")
        : null;
      console.log(param);
      // console.log(param);
      let query = `select distinct on (c.accountnum) 
            c.accountnum, 
            c.name as name, 
            c.namealias, 
            c.address, 
            (CASE 
              WHEN c.phone='null' THEN NULL
              ELSE c.phone
          END
           )as phone,
            c.districtcode,
            c.citycode, 
            c.rcusttype, 
            c.pricegroup,
            c.inventlocation,
            c.walkincustomer,
            c.custgroup,
            c.cashdisc,
            c.salesgroup,
            c.currency,
            c.vendaccount,
            c.vatnum,
            c.countryregionid,
            c.inventlocation,
            c.email,
            c.blocked,
            c.taxgroup,
            c.paymmode,
            c.paymtermid,
            c.creditmax,
            c.bankaccount,
            c.invoiceaddress,
            c.city,
            c.custtype,
            CAST(td.taxvalue AS INTEGER) as tax,
            c.walkincustomer,
            c.dimension as regionid,
            c.dimension2_ as departmentid,
            c.dimension3_ as costcenterid,
            c.dimension4_ as employeeid,
            c.dimension5_ as projectid,
            (CASE 
              WHEN c.dimension6_!='' THEN concat(d.num,' - ', d.description)
              ELSE '${this.sessionInfo.salesmanid.length > 0 ? this.sessionInfo.salesmanid[0].salesman : null}'
          END
           ) as salesman,
           (CASE 
            WHEN c.dimension6_!='' THEN concat(d.num)
            ELSE '${this.sessionInfo.salesmanid.length > 0 ? this.sessionInfo.salesmanid[0].salesmanid : null}'
        END
         ) as salesmanid,
           c.dimension7_ as brandid,
           c.dimension8_ as productlineid
           from custtable c
           left join dimensions d on c.dimension6_ = d.num
           left join taxgroupdata tg on tg.taxgroup = c.taxgroup
           left join taxdata td on td.taxcode = tg.taxcode `;
      if (param.key == "customer") {
        query += `where (c.name ILike '%${param.param}%' or c.namealias ILike '%${param.param}%' or c.accountnum ILike '%${param.param}%' or c.phone ILike '%${param.param}%') and c.dataareaid='${this.sessionInfo.dataareaid}' `;
      } else if (param.key == "painter") {
        query += `where (c.name ILike '%${param.param}%' or c.namealias ILike '%${param.param}%'  or c.accountnum ILike '%${param.param}%' or c.phone ILike '%${param.param}%') and c.dataareaid='${this.sessionInfo.dataareaid}' and c.rcusttype = 2`;
      } else if (param.key == "mobile") {
        query += `where c.phone ILike '%${param.param}%'`;
        // } else {
        //     query += `where dataareaid='${this.sessionInfo.dataareaid}' `;
      }

      if (param.type == "DESIGNERSERVICE") {
        query += ` and (c.paymtermid = 'CASH' or c.walkincustomer = true) `;
      }
      if (param.custgroup || param.additionalcustomer || param.sabiccustomers) {
        query += `and ( c.walkincustomer = true `;
        if (param.customergroup) {
          query += ` or c.custgroup in (${param.customergroup}) `;
        }
        if (param.additionalcustomer) {
          query += ` or c.accountnum in (${param.additionalcustomer}) `;
        }

        if (param.sabiccustomers) {
          query += ` or c.accountnum in (${param.sabiccustomers}) `;
        }
        query += ` ) `;
      } else {
        query += ` or c.walkincustomer = true `;
      }

      query += `  and c.deleted = false and lower(c.dataareaid)='${this.sessionInfo.dataareaid.toLowerCase()}' ${
        param.type == "DESIGNERSERVICE" ? ` and c.accountnum!='${this.sessionInfo.defaultcustomerid}'` : ``
      } limit 15`;
      let data: any = await this.db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomer(param: any) {
    this.rawQuery.sessionInfo = this.sessionInfo
    let customer: any = await this.rawQuery.getCustomer(param.param);
    return [customer];
  }

  async visitor(param: any) {
    const query = ` select 
        visitorid as "visitorId",
        visitorsequencenumber as "visitorSequenceNumber",
        dateofvisit as "dateOfVisit",
        salesmanname as "salesmanName",
        salesmanid as "salesmanId",
        regionnumber as "regionNumber",
        showroomid as "showroomId",
        usergroupid as "userGroupId",
        visitormobilenumber as "visitorMobileNumber",
        visitorname as "visitorName",
        purchased as "purchased",
        visitortype as "visitorType",
        reasonfornotpurchase as "description",
        dataareaid as "dataareaid"
         from visitcustomer where visitorsequencenumber Ilike '%${param.key}%' and dataareaid='${this.sessionInfo.dataareaid}' limit 15`;
    return await this.db.query(query);
  }

  async search_salesQuotation(param: any) {
    param.transkind = "SALESQUOTATION";
    return await this.search_salesTable(param);
  }

  async search_designerService(param: any) {
    param.transkind = "DESIGNERSERVICE";
    return await this.search_salesTable(param);
  }

  async search_salesOrder(param: any) {
    param.transkind1 = "SALESORDER";
    param.transkind2 = "RESERVED";
    return await this.search_salesTable(param);
  }

  async search_salesOrderForReturnOrderPage(param: any) {
    param.transkind = "SALESORDER";
    param.status = "PAID','POSTED";
    return await this.search_salesTable(param);
  }

  async search_returnOrder(param: any) {
    param.transkind = "RETURNORDER";
    return await this.search_salesTable(param);
  }

  async search_designerServiceReturn(param: any) {
    param.transkind = "DESIGNERSERVICERETURN";
    return await this.search_salesTable(param);
  }

  async search_inventoryMovement(param: any) {
    param.transkind = "INVENTORYMOVEMENT";
    return await this.search_salesTable(param);
  }
  async search_transferOrder(param: any) {
    param.transkind = "TRANSFERORDER";
    return await this.search_salesTable(param);
  }
  async search_pendingTransferOrder(param: any) {
    param.transkind = "TRANSFERORDER";
    param.status = "REQUESTED";
    let query = `Select salestable.salesid as salesid, salestable.salesname as salesname, inventlocationid as inventlocationid
                 from salestable where  salestable.custaccount='${this.sessionInfo.inventlocationid}' and status = 'REQUESTED' and salesid ILike '%${param.key}%' `;
    return await this.db.query(query);
  }
  async search_shipmentOrder(param: any) {
    param.transkind = "ORDERSHIPMENT";
    return await this.search_salesTable(param);
  }
  async search_recieveOrder(param: any) {
    param.transkind = "ORDERRECIEVE";
    return await this.search_salesTable(param);
  }
  async search_purchaseQuotation(param: any) {
    param.transkind = "PURCHASEREQUEST";
    return await this.search_salesTable(param);
  }
  async search_purchaseOrder(param: any) {
    param.transkind = "PURCHASEORDER";
    return await this.search_salesTable(param);
  }

  async search_purchaseOrderForReturnOrderPage(param: any) {
    param.transkind = "PURCHASEORDER";
    param.status = "PAID";
    param.cond = true;
    return await this.search_salesTable(param);
  }

  async search_purchaseReturn(param: any) {
    param.transkind = "PURCHASERETURN";
    param.cond = true;
    return await this.search_salesTable(param);
  }

  async search_salesTable(param: any) {
    try {
      // console.log(param);
      let query = `Select salestable.salesid as salesid, salestable.salesname as salesname, 
                        
                        ${
                          param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? ` vendortable.name as name, vendortable.namealias as namealias`
                            : ` custtable.name as name, custtable.namealias as namealias`
                        }
                        from salestable 
                        ${
                          param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? `  left join vendortable on vendortable.accountnum = salestable.custaccount`
                            : `  left join custtable on custtable.accountnum = salestable.custaccount`
                        }
                       
                        where salestable.dataareaid='${
                          this.sessionInfo.dataareaid
                        }' and (salestable.inventlocationid='${this.sessionInfo.inventlocationid}' or
                        salestable.custaccount='${this.sessionInfo.inventlocationid}' ${
        !param.cond == true ? `or salestable.jazeerawarehouse='${this.sessionInfo.inventlocationid}'` : ""
      })
                        and (salestable.salesid  ILike '%${param.key}%' or salestable.salesname  ILike '%${
        param.key
      }%' or
                         ${
                           param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                             ? `vendortable.name`
                             : `custtable.name`
                         } ILike '%${param.key}%' or  ${
        param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
          ? `vendortable.namealias`
          : `custtable.namealias`
      }  ILike '%${param.key}%') `;
      if (param.transkind1 && param.transkind2) {
        query += `and (salestable.transkind='${param.transkind1}' or salestable.transkind='${param.transkind2}')  `;
      } else if (param.transkind) {
        query += `and salestable.transkind='${param.transkind}'`;
      }
      if (param.status) {
        query += `and salestable.status in ('${param.status}') `;
      }
      query += `ORDER BY salestable.createddatetime DESC LIMIT 15`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search_custpaymmode(param: any) {
    try {
      // console.log(param);
      const query = `select * from custpaymmodetable`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search_paymterm(param: any) {
    try {
      // console.log(param);
      const query = `select * from paymterm`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async countries(param: any) {
    try {
      // console.log(param);
      const query = `select id as code, name as namear, nameeng as nameen from country`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async cities(param: any) {
    try {
      // console.log(param);
      const query = `select cityname as nameen, citynamearb as namear, citycode as citycode from citymast`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async districts(param: any) {
    try {
      // console.log(param);
      const query = `select districtname as nameen, districtnamearb as namear, districtcode, citycode from districtmast`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }
  async salesman() {
    try {
      // console.log(param);
      const query = `select concat(num,' - ', description) as salesman, num as salesmanid
      from dimensions where dimensioncode IN (102)`;
      let data: any = await this.db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async salesmanList() {
    let data: any;
    let salesmanQuery = `select salesmanid from usergroupconfig where id = '${this.sessionInfo.usergroupconfigid}'`;
    let reqData = await this.db.query(salesmanQuery);
    reqData = reqData.length > 0 ? reqData[0].salesmanid : null;
    if (reqData != null) {
      let ids = reqData
        .split(",")
        .map((d: any) => `'${d}'`)
        .join(",");
      let query = `select concat(num,' - ', description) as salesman, num as salesmanid
    from dimensions where num in(${ids})`;
      data = await this.db.query(query);
      return data;
    } else {
      return [];
    }
  }

  async salesmaneditablecustomers() {
    let data: any;
    let salesmanQuery = `select salesman_editable_customers as customers from usergroupconfig where id = '${this.sessionInfo.usergroupconfigid}'`;
    let reqData = await this.db.query(salesmanQuery);
    reqData = reqData.length > 0 ? reqData[0].customers : null;
    if (reqData != null) {
      let ids = reqData.split(",");
      return ids;
    } else {
      return [];
    }
  }

  async locationsalesman(param: any) {
    try {
      // console.log(param);
      const query = `select name as "name",
                description as "nameAlias",
                dimensioncode as  dimensioncode,
                num as salesmanid
                from dimensions where num in  (select salesmanid from usergroupconfig where inventlocationid = '${this.sessionInfo.inventlocationid}')`;
      let data: any = await this.db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async currency(param: any) {
    try {
      // console.log(param);
      const query = `select currencycode as currencycode from currency`;
      let data: any = await this.db.query(query);
      // console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  custtype() {
    let data = [
      {
        custtype: 1,
        custypenameen: "Individual",
        custtypenamear: "أفراد",
      },
      {
        custtype: 2,
        custypenameen: "Painters",
        custtypenamear: "دهان",
      },
      {
        custtype: 3,
        custypenameen: "Paints Contractor",
        custtypenamear: "دهان مقاول - مؤسسات",
      },
      {
        custtype: 4,
        custypenameen: "Interior Designer",
        custtypenamear: "مصمم داخلي",
      },
      {
        custtype: 5,
        custypenameen: "Decoration Shops",
        custtypenamear: "محلات الديكور",
      },
      {
        custtype: 6,
        custypenameen: "Family",
        custtypenamear: "عوائل",
      },
      {
        custtype: 7,
        custypenameen: "Real Estate",
        custtypenamear: "العقاريون",
      },
      {
        custtype: 8,
        custypenameen: "Tile Workers",
        custtypenamear: "مبلطين",
      },
      {
        custtype: 9,
        custypenameen: "ISOLATION",
        custtypenamear: "عوازل",
      },
    ];

    return data;
  }

  async movementName() {
    const query = `select journalnameid as "movementName" from usergroupconfig where id='${this.sessionInfo.usergroupconfigid}' limit 1`;
    let data = await this.db.query(query);
    return data.length > 0 ? data[0] : { movementName: "" };
  }
  async movementType() {
    const query = `select * from movementtype`;
    return await this.db.query(query);
  }
  async jazeerawarehouses() {
    const warehouseQuery = `select regionalwarehouse from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let regionalWarehouses = await this.db.query(warehouseQuery);
    let inQueryStr = "";
    if (regionalWarehouses.length > 0) {
      if (regionalWarehouses[0].regionalwarehouse) {
        regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        inQueryStr += "'" + this.sessionInfo.inventlocationid + "'";
        let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in (${inQueryStr}) order by namealias`;
        let data = await this.db.query(query);
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async reportwarehouses() {
    const warehouseQuery = `select report_warehouses as regionalwarehouse from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let regionalWarehouses = await this.db.query(warehouseQuery);
    let inQueryStr = "";
    if (regionalWarehouses.length > 0) {
      if (regionalWarehouses[0].regionalwarehouse) {
        inQueryStr = regionalWarehouses[0].regionalwarehouse
          .split(",")
          .map((d: any) => `'${d}'`)
          .join(",");

        inQueryStr += ",'" + this.sessionInfo.inventlocationid + "'";
        console.log(inQueryStr);
        let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in (${inQueryStr}) order by namealias`;
        let data: any[] = [];
        if (regionalWarehouses[0].regionalwarehouse.split(",").includes("ALL")) {
          data = [
            {
              inventlocationid: "ALL",
              namealias: "All",
              name: "الكل",
            },
          ];
        }

        let resData: any = await this.db.query(query);

        return data.concat(resData);
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async warehouses() {
    const warehouseQuery = `select warehouse from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let regionalWarehouses = await this.db.query(warehouseQuery);
    let inQueryStr = "";
    if (regionalWarehouses.length > 0) {
      if (regionalWarehouses[0].warehouse) {
        regionalWarehouses[0].warehouse.split(",").map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        inQueryStr += "'" + this.sessionInfo.inventlocationid + "'";
        let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in (${inQueryStr})`;
        let data = await this.db.query(query);
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async agentwarehouses() {
    const warehouseQuery = `select agentwarehouses from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let jazeeraWarehouses = await this.db.query(warehouseQuery);
    if (jazeeraWarehouses.length > 0) {
      if (jazeeraWarehouses[0].agentwarehouses) {
        let inQueryStr = "";
        jazeeraWarehouses[0].agentwarehouses.split(",").map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in (${inQueryStr.substr(
          0,
          inQueryStr.length - 1
        )})`;
        let data = await this.db.query(query);
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }

  async warehouseName(param: any) {
    let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid ='${param.key}' limit 1`;
    let data = await this.db.query(query);
    return data ? data[0] : {};
  }

  async workflowconditionsforreturnorder() {
    const query = `select 
            returnorderapprovalrequired , 
            returnorderrmapprovalrequired,
            returnorderraapprovalrequired, 
            projectcustomer, 
            agentcustomer from usergroupconfig
            where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let data = await this.db.query(query);
    return data ? data[0] : {};
  }
  async usergroup() {
    const query = `select groupid, groupname from usergroup where deleted != true or deleted is NULL`;
    return await this.db.query(query);
  }

  async vendors(param: any) {
    const vendorsQuery = `select vendors from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let vendorslist = await this.db.query(vendorsQuery);
    console.log(vendorslist);
    let inQueryStr = "";

    if (vendorslist.length > 0) {
      if (vendorslist[0].vendors) {
        vendorslist[0].vendors.split(",").map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        let query = `select accountnum, 
                                    name,
                                    namealias,
                                    address,
                                    phone,
                                    vendgroup,
                                    inventlocation,
                                    currency
                                    from vendortable where accountnum in (${inQueryStr.substr(
                                      0,
                                      inQueryStr.length - 1
                                    )}) `;
        if (param.key) {
          query += ` and (accountnum ILIKE '%${param.key}%' or name ILIKE '%${param.key}%' or namealias ILIKE '%${param.key}%') `;
        }
        let data = await this.db.query(query);
        return data;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
  async showrooms() {
    let data: any;
    const warehouseQuery = `select regionalwarehouse from usergroupconfig where id= '${this.sessionInfo.usergroupconfigid}' limit 1`;
    let regionalWarehouses = await this.db.query(warehouseQuery);
    console.log(regionalWarehouses);
    if (regionalWarehouses.length > 0) {
      if (regionalWarehouses[0].regionalwarehouse) {
        let inQueryStr = "";
        regionalWarehouses[0].regionalwarehouse.split(",").map((item: string) => {
          inQueryStr += "'" + item + "',";
        });
        // inQueryStr += "'" + this.sessionInfo.inventlocationid + "',";
        let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in (${inQueryStr.substr(
          0,
          inQueryStr.length - 1
        )})`;
        data = await this.db.query(query);
      } else {
        data = [];
      }
    } else {
      data = [];
    }
    // let query = `select inventlocationid, name, namealias from inventlocation where inventlocationid in ('${this.sessionInfo.inventlocationid}')`;
    // data = await this.db.query(query);
    let result: any = [
      {
        inventlocationid: "ALL",
        name: "الكل",
        namealias: "All",
      },
    ];
    data.sort(function (a: any, b: any) {
      var nameA: string = a.name;
      var nameB: string = b.name;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    return result.concat(data);
  }
  async products(param: any) {
    let query = `select distinct
        b.itemid as "itemid",
        b.namealias as "nameEn",
        b.itemname as nameAr
        from  inventtable b
        where b.itemid Ilike '%${param.param}%' or b.namealias Ilike '%${param.param}%' or b.itemname Ilike '%${param.param}%' limit 15`;
    let data = await this.db.query(query);
    return data;
  }
  async colors(param: any) {
    let query = `select distinct
        c.name as "nameEn", 
        c.name as "nameAr",
        c.configid as configid,
        c.hexcode as "hex"
        from configtable c where (c.configid Ilike '%${param.param}%' or c.name Ilike '%${param.param}%' or c.name Ilike '%${param.param}%') and itemid = '${param.itemid}' limit 15`;

    return await this.db.query(query);
  }
  async sizes(param: any) {
    let query = `select distinct
        s.description as "nameEn", 
        s.name as "nameAr",
        s.inventsizeid as inventsizeid
        from inventsize s where (s.inventsizeid Ilike '%${param.param}%' or s.description Ilike '%${param.param}%' or s.name Ilike '%${param.param}%' )and itemid = '${param.itemid}' limit 15`;
    return await this.db.query(query);
  }

  async batches(param: any) {
    let query = `select distinct
        i.inventbatchid as "batchNo", 
        i.itemid as "itemId"
        from inventbatch i 
         where  i.inventbatchid Ilike '%${param.param}%' and itemid = '${param.itemid}' limit 15`;
    return await this.db.query(query);
  }

  async dimensions(param: any) {
    const query = `select 
            description as "nameArabic",
            name as "NameEn",
            num as num,
            dimensioncode as "DimensionCode",
            closed
            from dimensions
             where dimensioncode=${Props.DIMENSION_CODE[param.key]}`;
    return this.db.query(query);
  }

  async accountType() {
    let accountType: any = [
      {
        accountType: 0,
        accountTypeName: "Profit And Loss",
        accountTypeNameAr: "الربح والخسارة",
      },
      {
        accountType: 1,
        accountTypeName: "Revenue",
        accountTypeNameAr: "إيرادات",
      },
      {
        accountType: 2,
        accountTypeName: "Cost",
        accountTypeNameAr: "كلفة",
      },
      {
        accountType: 3,
        accountTypeName: "Balance",
        accountTypeNameAr: "توازن",
      },
      {
        accountType: 4,
        accountTypeName: "Asset",
        accountTypeNameAr: "الأصل",
      },
      {
        accountType: 5,
        accountTypeName: "Liability",
        accountTypeNameAr: "مسؤولية",
      },
      {
        accountType: 6,
        accountTypeName: "Header",
        accountTypeNameAr: "العنوان",
      },
      {
        accountType: 9,
        accountTypeName: "Total",
        accountTypeNameAr: "مجموع",
      },
      {
        accountType: 10,
        accountTypeName: "Group Total",
        accountTypeNameAr: "إجمالي المجموعة",
      },
    ];
    return accountType;
  }

  dimentionOptions() {
    let options: any = [
      {
        value: 0,
        text: "Optional",
        textAr: "اختياري",
      },
      {
        value: 1,
        text: "ToBeFilledIn",
        textAr: "المراد شغلها في",
      },
      {
        value: 2,
        text: "List",
        textAr: "قائمة",
      },
      {
        value: 3,
        text: "Fixed",
        textAr: "ثابت",
      },
    ];
    return options;
  }

  async chartOfAccounts(param: any) {
    const query = `select 
        accountnum as "accountNum",
        accountname as "accountName",
        accountpltype as accounttype,
        dimension as "region",
        dimension2_ as "department",
        dimension3_ as "costcenter",
        dimension4_ as "employee",
        dimension5_ as "project",
        dimension6_ as "salesman",
        dimension7_ as "brand",
        dimension8_ as "productline",
        mandatorydimension as "mandatoryRegion",
        mandatorydimension2_ as "mandatorydDepartment",
        mandatorydimension3_ as "mandatoryCostcenter",
        mandatorydimension4_ as "mandatoryEmployee",
        mandatorydimension5_ as "mandatoryProject",
        mandatorydimension6_ as "mandatorySalesman",
        mandatorydimension7_ as "mandatoryBrand",
        mandatorydimension8_ as "mandatoryproductLine"
        from accountstable where
        (accountnum ILIKE '%${param.key}%' or accountname ILIKE '%${param.key}%') and 
        dataareaid = '${this.sessionInfo.dataareaid}' and closed=0 and locked=0 and accountpltype in (0, 1,2,4,5) limit 15`;
    return await this.db.query(query);
  }

  async propertytype() {
    return [
      {
        id: 0,
        name: "Fixed Asset",
        nameArabic: "أصل ثابت",
      },
      {
        id: 1,
        name: "Continue Property",
        nameArabic: "تواصل الملكية",
      },
      {
        id: 2,
        name: "Other",
        nameArabic: "آخر",
      },
    ];
  }

  async assettype() {
    return [
      {
        id: 0,
        name: "Tangible",
        nameArabic: "ملموس",
      },
      {
        id: 1,
        name: "Intangible",
        nameArabic: "غير الملموسة",
      },
      {
        id: 2,
        name: "Financial",
        nameArabic: "الأمور المالية",
      },
      {
        id: 3,
        name: "Land and Building",
        nameArabic: "الأرض والبناء",
      },
      {
        id: 4,
        name: "Goodwill",
        nameArabic: "نية حسنة",
      },
      {
        id: 5,
        name: "Other",
        nameArabic: "آخر",
      },
    ];
  }
  async numbersequence() {
    let numbersequencequery = `select
    fixedassestgroupsequencegroup, 
    quotationsequencegroup, 
    salesordersequencegroup,
    purchaseordersequencegroup,
    purchaserequestsequencegroup,
    transferordersequencegroup,
    orderreceivesequencegroup,
    returnordersequencegroup,
    movementsequencegroup,
    ordershipmentsequencegroup
    from usergroupconfig where inventlocationid  = '${this.sessionInfo.inventlocationid}'`;
    let numbersequencedata = await this.db.query(numbersequencequery);
    console.log(numbersequencedata);
    numbersequencedata = numbersequencedata.length > 0 ? numbersequencedata[0] : {};
    let str = ``;
    if (numbersequencedata.fixedassestgroupsequencegroup && numbersequencedata.fixedassestgroupsequencegroup != "") {
      str += "'" + numbersequencedata.fixedassestgroupsequencegroup + "',";
    }
    if (numbersequencedata.quotationsequencegroup && numbersequencedata.quotationsequencegroup != "") {
      str += "'" + numbersequencedata.quotationsequencegroup + "',";
    }
    if (numbersequencedata.salesordersequencegroup && numbersequencedata.salesordersequencegroup != "") {
      str += "'" + numbersequencedata.salesordersequencegroup + "',";
    }
    if (numbersequencedata.purchaseordersequencegroup && numbersequencedata.purchaseordersequencegroup != "") {
      str += "'" + numbersequencedata.purchaseordersequencegroup + "',";
    }
    if (numbersequencedata.purchaserequestsequencegroup && numbersequencedata.purchaserequestsequencegroup != "") {
      str += "'" + numbersequencedata.purchaserequestsequencegroup + "',";
    }
    if (numbersequencedata.transferordersequencegroup && numbersequencedata.transferordersequencegroup != "") {
      str += "'" + numbersequencedata.transferordersequencegroup + "',";
    }
    if (numbersequencedata.orderreceivesequencegroup && numbersequencedata.orderreceivesequencegroup != "") {
      str += "'" + numbersequencedata.orderreceivesequencegroup + "',";
    }
    if (numbersequencedata.returnordersequencegroup && numbersequencedata.returnordersequencegroup != "") {
      str += "'" + numbersequencedata.returnordersequencegroup + "',";
    }
    if (numbersequencedata.movementsequencegroup && numbersequencedata.movementsequencegroup != "") {
      str += "'" + numbersequencedata.movementsequencegroup + "',";
    }
    if (numbersequencedata.ordershipmentsequencegroup && numbersequencedata.ordershipmentsequencegroup != "") {
      str += "'" + numbersequencedata.ordershipmentsequencegroup + "',";
    }
    str = str.length > 0 ? str.substr(0, str.length - 1) : "";
    if (str.length > 0) {
      const query = `
      select recid as id,
      numbersequence as numbersequence,
      format as format,
      dataareaid as dataareaid
      from numbersequencetable where numbersequence in (${str})
      `;
      return await this.db.query(query);
    }
    return [];
  }

  assetcondition() {
    return [
      {
        value: "USABLE",
        text: "Usable",
      },
      {
        value: "NOTUSABLE",
        text: "Not Usable",
      },
      {
        value: "SOLD",
        text: "Sold",
      },
      {
        value: "WRITEOFF",
        text: "WriteOff",
      },
    ];
  }
  periodfreequency() {
    return [
      {
        value: 12,
        text: "Monthly",
        textAr: "شهريا",
      },
      {
        value: 3,
        text: "Quarterly",
        textAr: "ربعي",
      },
      {
        value: 2,
        text: "Half Yearly",
        textAr: "منتصف المدة",
      },
      {
        value: 1,
        text: "Yearly",
        textAr: "سنوي",
      },
    ];
  }
  years() {
    let data: any = [];
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 99; i++) {
      data.push({
        yearNo: currentYear,
      });
      currentYear += 1;
    }
    return data;
  }
  months() {
    let data: any = [
      {
        month: "January",
        value: 1,
      },
      {
        month: "February",
        value: 2,
      },
      {
        month: "March",
        value: 3,
      },
      {
        month: "April",
        value: 4,
      },
      {
        month: "May",
        value: 5,
      },
      {
        month: "June",
        value: 6,
      },
      {
        month: "July",
        value: 7,
      },
      {
        month: "August",
        value: 8,
      },
      {
        month: "Sepetember",
        value: 9,
      },
      {
        month: "October",
        value: 10,
      },
      {
        month: "November",
        value: 12,
      },
      {
        month: "December",
        value: 13,
      },
    ];
    return data;
  }
  async JournalName() {
    const query = `select journalnameid as "JournalName" from usergroupconfig where id='${this.sessionInfo.usergroupconfigid}' limit 1`;
    let data = await this.db.query(query);
    data = data.length > 0 ? data[0].JournalName.split(",") : [];
    let result: any = [];
    data.forEach((ele: any) => {
      result.push({
        name: ele,
      });
    });
    return result;
  }

  async assetgroup(param: any) {
    const query = `select groupid as "assetGroup", name as name, namealias as "nameAlias" from 
        fixedassetgroup where groupid ILIKE '%${param.key}%' or name ILIKE '%${param.key}%' or namealias ILIKE '%${param.key}%'`;
    return await this.db.query(query);
  }
  async checkfordiscounts(param: any) {
    this.rawQuery.sessionInfo = this.sessionInfo
    let customer:any = await this.rawQuery.getCustomer(param.custaccount)
    let defaultcustomerid:any = await this.rawQuery.getCustomer(param.custaccount)
    param.custtype = customer.walkincustomer ? defaultcustomerid.custtype : param.custtype
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
                                                    inventlocationid = '${this.sessionInfo.inventlocationid}'
                                                    and (price_disc_account_relation = '${param.custaccount}' 
                                                    or price_disc_account_relation='${param.custtype}' or price_disc_item_code=2)
                                                    and itemid = '${param.itemid}'`;
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
                                                    inventlocationid = '${this.sessionInfo.inventlocationid}'
                                                    and (price_disc_account_relation = '${param.custaccount}' 
                                                    or price_disc_account_relation='${param.custtype}' or price_disc_item_code=2)
                                                    and itemid = '${param.itemid}'`;
    let data: any = await this.db.query(buyOneGetOneDiscountQuery);
    if (data.length > 0) {
      data = data[0];
      data.discountType = "BUY_ONE_GET_ONE";
      let freebieItems = await this.db.query(
        `select itemid from inventtable where itemgroupid in (select itemgroupid from inventtable where itemid='${param.itemid}')`
      );
      let freebieItemsArray: any = [];
      freebieItems.map((v: any) => {
        freebieItemsArray.push(v.itemid);
      });
      data.freebieItems = freebieItemsArray;
      return data;
    } else {
      data = await this.db.query(promotionalDiscountQuery);
      if (data.length > 0) {
        data = data[0];
        data.discountType = "PROMOTIONAL_DISCOUNT";
        data.freebieItems = [param.itemid];
        return data;
      }
    }
    return {};
  }

  async itemslist(param: any) {
    let query = `select id, name_en as "nameEn", name_ar as "nameAr", code as "baseCode" from bases where code ILIKE '%${param.key}%' or name_en ILIKE '%${param.key}%' or name_ar ILIKE '%${param.key}%'  limit 20`;
    return await this.db.query(query);
  }

  async sizeslist(param: any) {
    let query = `select id, name_en as "nameEn", name_ar as "nameAr", code as "sizeCode" from sizes  where code ILIKE '%${param.key}%' or name_en ILIKE '%${param.key}%' or name_ar ILIKE '%${param.key}%' limit 20`;
    return await this.db.query(query);
  }
  async colorslist(param: any) {
    let query = `select id, name_en as "nameEn", name_ar as "nameAr", code as "colorCode", hex as "hexCode" from colors where code ILIKE '%${param.key}%' or name_en ILIKE '%${param.key}%' or name_ar ILIKE '%${param.key}%'  limit 20`;
    return await this.db.query(query);
  }

  async batcheslist(param: any) {
    let query = `select distinct inventbatchid as batchno, itemid as itemid, configid as configid from inventbatch where inventbatchid ILIKE '%${param.batchno}%' and configid = '${param.configid}' and itemid = '${param.itemid}' limit 10`;
    let data = await this.db.query(query);
    data.push({
      batchno: "-",
      itemid: "-",
      configid: "-",
    });
    return data;
  }

  async validatebatchno(param: any) {
    let query = `select distinct inventbatchid as batchno, itemid as itemid, configid as configid from inventbatch where inventbatchid = '${param.batchno}' and configid = '${param.configid}' and itemid = '${param.itemid}' limit 10`;
    let data = await this.db.query(query);
    return data.length > 0 || param.batchno == "-" ? true : false;
  }

  async checkInstantDiscount(param: any) {
    let data = await this.rawQuery.checkInstantDiscount(param.key);
    return data.length > 0 ? { cond: true, amount: parseInt(data[0].minamount) } : { cond: false, amount: 0 };
  }

  async getHSNData(param: any) {
    if (!param.key) return "key is required!";
    let offset = param.param ? param.param : 0;
    return await this.db.query(`select c.configid from configtable c where c.itemid = 'HSN-00001' 
        and c.configid ilike '%${param.key}%' 
        group by configid limit 15 offset ${offset}`);
  }

  async checkIsBase(param: any) {
    try {
      if (!param.key) return "key is required!";
      let data: any = await this.db.query(
        `select itemid, citbaseproduct from inventtable where itemid = '${param.key}'`
      );
      if (data.length > 0) {
        if (data[0].itemid != data[0].citbaseproduct) {
          return true;
        } else {
          return false;
        }
      } else {
        throw { message: "INVALID ID" };
      }
    } catch (error) {
      return error;
    }
  }

  async checkForColorantOption(param: any) {
    try {
      let data: any = await this.db.query(
        `select nocolorantcheckgroup, blocklistedbasecolor, special_products_for_colorant_option as specialproductsforcolorantoption from usergroupconfig where id = '${this.sessionInfo.usergroupconfigid}'`
      );
      data = data.length > 0 ? data[0] : {};
      data.nocolorantcheckgroup = data.nocolorantcheckgroup ? data.nocolorantcheckgroup.split(",") : [];
      data.blocklistedbasecolor = data.blocklistedbasecolor ? data.blocklistedbasecolor.split(",") : [];
      data.specialproductsforcolorantoption = data.specialproductsforcolorantoption
        ? data.specialproductsforcolorantoption.split(",")
        : [];
      if (param.key) {
        let product: any = await this.db.query(`select * from inventtable where itemid = '${param.key}' limit 1`);
        product = product.length > 0 ? product[0] : {};
        console.log(product.citbaseproduct, product.itemid);
        let isBase: boolean = true;
        if (product.citbaseproduct == product.itemid) {
          isBase = false;
        }
        console.log(isBase);
        isBase =
          data.nocolorantcheckgroup.includes(product.itemgroupid) ||
          data.blocklistedbasecolor.includes(product.citgroupid)
            ? false
            : isBase;
        console.log(isBase);
        if (data.specialproductsforcolorantoption.includes(product.itemid)) {
          isBase = true;
        }
        console.log(isBase);
        data.isBase = isBase;
      }

      return data;
    } catch (error) {
      return error;
    }
  }
  async instantDiscountExcludeItems() {
    let data: any = await this.db.query(
      `select istantdiscountexclude from usergroupconfig where id = '${this.sessionInfo.usergroupconfigid}'`
    );
    console.log(data);
    data = data[0].istantdiscountexclude ? data[0].istantdiscountexclude.split(",") : [];
    return data;
  }

  async checkForOrderReceive(param: any) {
    let shipOrderData: any = await this.db.query(
      `select salesid, custaccount, transkind, inventlocationid from salestable where salesid = '${param.key}'`
    );
    shipOrderData = shipOrderData.length > 0 ? shipOrderData[0] : null;
    console.log(this.sessionInfo.inventlocationid);
    if (shipOrderData.transkind != "TRANSFERORDER" && shipOrderData.transkind != "ORDERRECEIVE") {
      if (shipOrderData && shipOrderData.custaccount == this.sessionInfo.inventlocationid) {
        let receiveOrderData: any = await this.db.query(
          `select salesid, custaccount,transkind, inventlocationid from salestable where intercompanyoriginalsalesid = '${param.key}'`
        );
        return receiveOrderData.length > 0 ? false : true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async checkfordesignerservicereturn(param: any) {
    let receiveOrderData: any = await this.db.query(
      `select salesid, custaccount,transkind, inventlocationid from salestable where intercompanyoriginalsalesid = '${param.key}' and transkind = 'DESIGNERSERVICERETURN'`
    );
    return receiveOrderData.length > 0 ? false : true;
  }

  async bankaccounts(param: any) {
    console.log(param);
    let query = `select accountid as "accountId", ledgeraccount as "ledgerAccount", currencycode as "currenyCode", name as "nameAr", accountnum as "accountNum" 
      from bankaccounttable
      where ( accountid ILIKE '%${param.key}%' or  name ILIKE '%${param.key}%' )`;
    return await this.db.query(query);
  }

  async menu() {
    let menuList = await this.menuGroupRepository.search({
      group: { groupid: this.sessionInfo.groupid },
      active: true,
      isMobile: true,
    });
    menuList = await this.unflatten(menuList);
    return menuList;
  }

  unflatten(arr: any) {
    let newData: any = [];
    for (let item of arr) {
      if (!item.menu.parentId) {
        let children = arr.filter((v: any) => v.menu.parentId == item.menu.id);
        item.children = children;
        newData.push(item);
      }
    }
    return newData;
  }
  async isexportexcel() {
    try {
      let query = `select is_export_excel as "isExportExcel" from usergroupconfig where id = '${this.sessionInfo.usergroupconfigid}'`;
      let data: any = await this.db.query(query);
      data = data.length > 0 ? data[0] : {};
      return data.isExportExcel ? true : false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async banklist() {
    let data = [
      {
        name: "bank1",
      },
      {
        name: "bank2",
      },
      {
        name: "bank3",
      },
      {
        name: "bank4",
      },
    ];
    return data;
  }

  async gettax() {
    let query = `select CAST(td.taxvalue AS INTEGER) as tax from custtable c
    left join taxgroupdata tg on tg.taxgroup = c.taxgroup
    left join taxdata td on td.taxcode = tg.taxcode where c.accountnum = '${this.sessionInfo.defaultcustomerid}' `;
    let data: any = await this.db.query(query);
    return data.length > 0 ? data[0].tax : 15;
  }

  async validategiftvoucher(param: any) {
    let query = `select * from discountvoucher where voucher_num = '${param.key}'`;
    let voucherData: any = await this.db.query(query);
    if (voucherData.length > 0) {
      voucherData = voucherData[0];
      if (voucherData.is_enabled == 1) {
        throw { message: "INVALID_VOUCHER", status: 0 };
      } else if (voucherData.allowed_numbers <= voucherData.used_numbers) {
        throw { message: "ALREADY_USED", status: 0 };
      } else if (new Date(voucherData.expiry_date) < new Date(App.DateNow())) {
        throw { message: "VOUCHER_EXPIRED", status: 0 };
      } else {
        query = `select * from voucherdiscountitems where voucher_type = '${voucherData.voucher_type}'`;
        let voucheritems: any = await this.db.query(query);
        let data: any = {};
        data.freebieItems = [];
        voucheritems.map((v: any) => {
          data.freebieItems.push(v.itemid);
        });
        return data;
      }
    } else {
      throw { message: "INVALID_VOUCHER", status: 0 };
    }
  }
}
