import { Client, types, Pool, PoolClient } from "pg";
import * as Config from "../../utils/Config";
import { SyncServiceHelper } from "../../sync/SyncServiceHelper";
import { log } from "../../utils/Log";
import { App } from "../../utils/App";
import uuid = require("uuid");
// let mssqlDbOptions = {
//   username: "SA",
//   password: "Jazeera123",
//   host: "3.80.2.102",
//   database: "jpos_dev",
//   port: 1433
// };
// let mssqlDbOptions = Config.mssqlDbOptions

// let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;

export class SyncPrevTransactionsService {
  private sqlserver: any;
  private fs: any;
  private dateObj: any;
  private jsonString: any;
  private localDbConfig: any;
  private mssqlDbOptions: any;
  private pool: any;
  constructor() {
    // this.run();
    this.fs = require("fs");
    this.jsonString = this.fs.readFileSync(`${__dirname}/data.json`, "utf-8");
    this.dateObj = JSON.parse(this.jsonString);
    // this.fs.unlinkSync(`${__dirname}/data.json`);
    this.mssqlDbOptions = Config.mssqlDbOptions;
    // this.mssqlDbOptions = mssqlDbOptions;
    this.localDbConfig = SyncServiceHelper.LocalDBOptions();
    // this.localDbConfig = LocalDBOptions();
  }

  run = async () => {
    try {
      //const mssqlClient = require("mssql/msnodesqlv8");
      // const connectionString =
      //   "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
      // let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;
      // const connectionString = mssqlString;
      // this.pool = new mssqlClient.ConnectionPool(connectionString);
    } catch (err) {
      log.error(err);
      this.pool = null;
    }
  };

  async mssqlTransactions() {
    let cond: boolean = true;
    try {
      const mssqlClient = require("mssql");
      // const connectionString =
      //   "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
      let mssqlString = `mssql://${this.dateObj.username}:${this.dateObj.password}@${this.dateObj.host}/${this.dateObj.database}`;
      const connectionString = mssqlString;
      this.pool = new mssqlClient.ConnectionPool(connectionString);
      await this.pool.connect();
      let data: any[] = [];
      let rows: any;
      let query: string;
      let sCond: string;
      let slCond: string;
      let tCond: string;
      let optDate: string = this.dateObj.date;
      let current_date: string = new Date().toISOString().slice(0, 10);
      let transactionclosed: boolean = false;
      // log.info(optDate);
      // log.info(current_date);
      if (optDate === current_date) {
        sCond = ` CREATEDDATETIME BETWEEN dateadd(day, -120, '${this.dateObj.date}') AND  '${this.dateObj.date}' ORDER BY RECID ASC `;
        slCond = ` CREATEDDATETIME BETWEEN dateadd(day, -120, '${this.dateObj.date}') AND  '${this.dateObj.date}') ORDER BY RECID ASC `;
        tCond = `  DATEPHYSICAL BETWEEN dateadd(day, -120, '${this.dateObj.date}') AND  '${this.dateObj.date}' ORDER BY RECID ASC `;
      } else {
        sCond = ` CREATEDDATETIME BETWEEN '${this.dateObj.date}' AND  getdate() ORDER BY RECID ASC `;
        tCond = ` DATEPHYSICAL BETWEEN '${this.dateObj.date}' AND  getdate() ORDER BY RECID ASC `;
        slCond = ` CREATEDDATETIME BETWEEN  '${this.dateObj.date}' AND  getdate()) ORDER BY RECID ASC `;
        transactionclosed = true;
      }
      log.info(tCond);
      log.info(sCond);
      query = salesTableQuery + sCond;
      rows = await this.pool.request().query(query);
      data = await this.chunkArray(rows.recordset, 5000);
      for (let item of data) {
        try {
          await this.sync_salesTableData(item);
          for (let salesdata of item) {
            let lineData = await this.pool
              .request()
              .query(`SELECT * FROM SALESLINE WHERE SALESID = '${salesdata.salesid}'`);
            await this.sync_salesLine(lineData.recordset);
          }
        } catch (err) {
          log.error(err);
        }
      }
      // query = salesLineQuery + slCond;
      // log.info(cond);
      // rows = await this.pool.request().query(query);
      // data = await this.chunkArray(rows.recordset, 5000);
      // for (let item of data) {
      //   try {
      //     await this.sync_salesLineData(item);
      //   } catch (err) {
      //     log.error(err);
      //   }
      // }

      query = inventTransQuery + tCond;
      rows = await this.pool.request().query(query);
      data = await this.chunkArray(rows.recordset, 1);
      for (let item of data) {
        try {
          await this.syncInventTransData(item, [], transactionclosed);
        } catch (err) {
          log.error(err);
        }
      }
      log.info("%%%%%%%%%%%%%%%%%%%%%%COMPLETED%%%%%%%%%%%%%%%%%%%");
    } catch (err) {
      log.error(err);
      cond = false;
      // this.mssqlTransactions();
    } finally {
      this.pool.close();
      this.fs.unlinkSync(`${__dirname}/data.json`);
    }
  }

  async sync_salesTableData(salesTableData: any[], queryData: any[] = []) {
    try {
      let salesLines: any[] = [];
      for (let item of salesTableData) {
        item.createdby = "SYSTEM";
        item.syncstatus = 4;
        item.inventlocationid = this.dateObj.inventlocationid;
        item.invoicecreatedby = "SYSTEM";
        item.lastmodifiedby = "SYSTEM";
        item.lastmodifieddate = new Date(App.DateNow());
        item.originalprinted = true;
        item.iscash = item.payment == "CASH" ? true : false;
        item.deliverytype = "self";
        item.documentstatus = item.documentstatus == 0 ? false : true;
        let query = `INSERT INTO public.salestable (salesid,salesname, reservation, custaccount, invoiceaccount, deliverydate,
          deliveryaddress, documentstatus, currencycode, dataareaid, recversion,
          recid, languageid, payment, custgroup, pricegroupid, shippingdaterequested,
          deliverystreet, salestype, salesstatus, numbersequencegroup, cashdisc,
           intercompanyoriginalsalesid, salesgroup, shippingdateconfirmed, deadline, fixedduedate, returndeadline, createddatetime, createdby, syncstatus, amount, disc, netamount,
           citycode, districtcode, latitude, vehiclecode, vouchernum, painter, ajpenddisc, taxgroup, sumtax, inventlocationid, vatamount, invoicedate, invoicecreatedby, multilinediscountgroupid,
           lastmodifiedby, lastmodifieddate, originalprinted, iscash,  transkind, status, redeempts, redeemptsamt, deliverytype, customerref) VALUES(
           '${item.salesid}','${item.salesname}',${item.reservation},'${item.custaccount}','${item.invoiceaccount}','${
          item.deliverydate
        }', '${item.deliveryaddress}',${item.documentstatus},'${item.currencycode}','${item.dataareaid}',
          ${item.recversion},${item.recid}, '${item.languageid}', '${item.payment}', '${item.custgroup}','${
          item.pricegroupid
        }', '${item.shippingdaterequested}', '${item.deliverystreet}',
          ${item.salestype},${item.salesstatus},'${item.numbersequencegroup}','${item.cashdisc}','${
          item.salestype == 4 ? item.customerref : item.intercompanyoriginalsalesid
        }','${item.salesgroup}','${item.shippingdateconfirmed}',
          '${item.deadline}','${item.fixedduedate}','${item.returndeadline}',
          '${item.createddatetime}','${item.createdby}',${item.syncstatus},${item.amount},${item.disc},${
          item.netamount
        },'${item.citycode}','${item.districtcode}','${item.latitude}','${item.vehiclecode}','${item.vouchernum}',
          '${item.painter}','${item.ajpenddisc}','${item.taxgroup}',${item.sumtax},'${item.inventlocationid}',
           ${item.vatamount},'${item.createddatetime}','${item.invoicecreatedby}','${item.multilinediscountgroupid}','${
          item.lastmodifiedby
        }',
           '${item.createddatetime}',${item.originalprinted},'${item.iscash}','${item.transkind}', '${item.status}', ${
          item.redeempts
        },${item.redeemptsamt},'${item.deliverytype}', '${item.customerref}');`;
        queryData.push(query);
      }
      await SyncServiceHelper.BatchQuery(this.localDbConfig, queryData);
    } catch (err) {
      log.error(err);
    }
  }

  async sync_salesLine(salesLineData: any[], queryData: any[] = []) {
    try {
      for (let line of salesLineData) {
        line.applied_discounts = [];
        if (line.InteriorExteriorAmount && line.InteriorExteriorAmount > 0) {
          line.applied_discounts.push({
            discountType: "ARAMKO_TAHAKOM_DISOUNT",
            percentage: parseFloat(line.InteriorExteriorPer),
            discountAmount: parseFloat(line.InteriorExteriorAmount),
          });
        }
        if (line.VoucherDisc && line.VoucherDisc > 0) {
          line.applied_discounts.push({
            discountType: "VOUCHER_DISCOUNT",
            percentage: (parseFloat(line.VoucherDisc) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.InteriorExteriorAmount),
          });
        }
        if (line.CUSTOMDISCAMT && line.CUSTOMDISCAMT > 0) {
          line.applied_discounts.push({
            discountType: "TOTAL_DISCOUNT",
            percentage: (parseFloat(line.CUSTOMDISCAMT) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.CUSTOMDISCAMT),
            cond: [],
          });
        }
        if (line.LINEDISCAMT && line.LINEDISCAMT > 0) {
          line.applied_discounts.push({
            discountType: "LINE_DISCOUNT",
            percentage: (parseFloat(line.LINEDISCAMT) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.LINEDISCAMT),
            cond: [],
          });
        }
        if (line.MultiLnDisc && line.MultiLnDisc > 0) {
          let MultiLineDiscRangesQuery = `SELECT itemrelation, ACCOUNTRELATION,QUANTITYAMOUNT,
                                          CURRENCY,PERCENT1 FROM 
                                          PRICEDISCTABLE WHERE MODULE = 1 AND 
                                          ITEMCODE = 1 AND ACCOUNTCODE = 1 AND 
                                          ACCOUNTRELATION = '${line.CUSTACCOUNT}' AND LOWER(DATAAREAID) = LOWER('${line.DATAAREAID}') AND CURRENCY='${line.CURRENCYCODE}'`;
          let MultiLineDiscRanges = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, MultiLineDiscRangesQuery);
          line.applied_discounts.push({
            discountType: "MULTI_LINE_DISCOUNT",
            percentage: parseFloat(line.MultiLnPercent),
            discountAmount: parseFloat(line.MultiLnDisc),
            cond: MultiLineDiscRanges.rows,
          });
        }
        if (line.InstantDisc && line.InstantDisc > 0) {
          let InstantDiscRangesQuery = `select 
          * from custtotaldiscount where dataareaid ='ajp' and custaccount = '${line.CUSTACCOUNT}' order by minamount`;
          let InstantDiscRanges = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, InstantDiscRangesQuery);
          line.applied_discounts.push({
            discountType: "MULTI_LINE_DISCOUNT",
            percentage: (parseFloat(line.InstantDisc) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.MultiLnDisc),
            cond: InstantDiscRanges.rows,
          });
        }
        if (line.PromotionDisc && line.PromotionDisc > 0) {
          let filterItems = salesLineData.filter(
            (value: any) => value.ITEMID == line.ITEMID && value.INVENTSIZEID == line.INVENTSIZEID
          );
          filterItems.map((v: any) => {
            let index = salesLineData.indexOf(v);
            salesLineData[index].isitemfree = v.SupplMultipleQty > 0 ? true : false;
            salesLineData[index].link_id = line.RECID;
            line.multipleQty = v.SupplMultipleQty > 0 ? v.SupplMultipleQty : line.multipleQty;
            line.freeQty = v.SupplFreeQty > 0 ? v.SupplFreeQty : line.freeQty;
          });
          line.link_id = line.RECID;
          line.applied_discounts.push({
            discountType: "PROMOTIONAL_DISCOUNT",
            discountAmount: parseFloat(line.PromotionDisc),
            cond: [
              {
                multipleQty: line.multipleQty,
                freeQty: line.freeQty,
              },
            ],
          });
        }
        if (line.PromotionDiscEqual && line.PromotionDiscEqual > 0) {
          line.link_id = line.PromotionDiscEqualRecId ? line.PromotionDiscEqualRecId.split(",")[0] : line.RECID;
          line.isitemfree = line.PromotionDiscEqualRecId ? true : false;
          line.applied_discounts.push({
            discountType: "BUY_ONE_GET_ONE_DISCOUNT",
            discountAmount: parseFloat(line.PromotionDiscEqual),
            cond: [
              {
                multipleQty: 1,
                freeQty: 1,
              },
            ],
          });
        }
        line.applied_discounts = JSON.stringify(line.applied_discounts);
        line.batches = JSON.stringify([
          {
            batchNo: line.BATCHNO,
            quantity: line.SALESQTY,
          },
        ]);
      }
      for (let line of salesLineData) {
        let query = `INSERT INTO public.salesline
        (id, salesid, linenum, itemid, "name", salesprice, currencycode, salesqty, lineamount, salesunit, priceunit, qtyordered, remainsalesphysical, remainsalesfinancial,
        salestype, dataareaid, custgroup, custaccount, inventsizeid, configid, numbersequencegroupid, inventlocationid, salesdelivernow, salesstatus, "location", batchno, instantdisc, voucherdisc,
          redeemdisc, promotiondisc, linetotaldisc, linesalestax, netamttax, linesalestaxpercent, taxgroup, taxitemgroup, linediscamt, customdiscamt, supplmultipleqty, supplfreeqty, multilndisc, multilnpercent, enddisc,
          createdby, createddatetime, lastmodifiedby, lastmodifieddate, 
            vatamount, vat, voucherdiscamt, sabic_customer_discount, is_item_free, link_id, batches, applied_discounts)
        VALUES('${uuid() + App.UniqueNumber()}', '${line.SALESID}', ${line.LINENUM}, '${line.ITEMID}', '${
          line.NAME
        }', ${line.SALESPRICE}, '${line.CURRENCYCODE}', ${line.SALESQTY}, ${line.LINEAMOUNT}, '${line.SALESUNIT}', ${
          line.PRICEUNIT
        }, ${line.QTYORDERED}, 
        ${line.REMAINSALESPHYSICAL}, ${line.REMAINSALESFINANCIAL},  ${line.SALESTYPE}, '${
          line.DATAAREAID ? line.DATAAREAID.toLowerCase() : null
        }', '${line.CUSTGROUP}', '${line.CUSTACCOUNT}', '${line.INVENTSIZEID}', '${line.CONFIGID}',
         '${line.NUMBERSEQUENCEGROUPID}', '${line.INVENTLOCATIONID}', ${line.SALESDELIVERNOW}, ${line.SALESSTATUS}, '${
          line.LOCATION
        }', '${line.BATCHNO}', ${line.InstantDisc ? line.InstantDisc : 0}, ${
          line.VoucherDisc ? line.VoucherDisc : 0
        }, ${line.RedeemDisc ? line.RedeemDisc : 0}, ${line.PromotionDisc ? line.PromotionDisc : 0}, 
         ${line.LineTotalDisc ? line.LineTotalDisc : 0}, ${line.LineSalesTax ? line.LineSalesTax : 0}, ${
          line.NetAmtTax ? line.NetAmtTax : 0
        }, ${line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0}, '${line.TAXGROUP}', '${line.TAXITEMGROUP}', ${
          line.LINEDISCAMT ? line.LINEDISCAMT : 0
        }, ${line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0}, ${line.SupplMultipleQty ? line.SupplMultipleQty : 0}, ${
          line.SupplFreeQty ? line.SupplFreeQty : 0
        },
         ${line.MulLnDisc ? line.MultiLineDisc : 0}, ${line.MultiPercent ? line.MultiPercent : 0}, ${
          line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0
        }, '${line.createdby}', now(), '${line.createdby}', now(),
          ${line.LineSalesTax ? line.LineSalesTax : 0}, ${line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0},
           ${line.VoucherDisc ? line.VoucherDisc : 0}, ${
          line.InteriorExteriorAmount ? line.InteriorExteriorAmount : 0
        }, ${line.isitemfree ? line.isitemfree : false}, '${line.link_id}', '${line.batches}', '${
          line.applied_discounts
        }')
        `;
        // log.info(query)
        queryData.push(query);
      }
      await SyncServiceHelper.BatchQuery(this.localDbConfig, queryData);
    } catch (err) {
      log.error(err);
    }
  }

  async sync_salesLineData(salesLineData: any[], queryData: any[] = []) {
    try {
      for (let line of salesLineData) {
        line.applied_discounts = [];
        if (line.InteriorExteriorAmount && line.InteriorExteriorAmount > 0) {
          line.applied_discounts.push({
            discountType: "ARAMKO_TAHAKOM_DISOUNT",
            percentage: parseFloat(line.InteriorExteriorPer),
            discountAmount: parseFloat(line.InteriorExteriorAmount),
          });
        }
        if (line.VoucherDisc && line.VoucherDisc > 0) {
          line.applied_discounts.push({
            discountType: "VOUCHER_DISCOUNT",
            percentage: (parseFloat(line.VoucherDisc) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.InteriorExteriorAmount),
          });
        }
        if (line.CUSTOMDISCAMT && line.CUSTOMDISCAMT > 0) {
          line.applied_discounts.push({
            discountType: "TOTAL_DISCOUNT",
            percentage: (parseFloat(line.CUSTOMDISCAMT) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.CUSTOMDISCAMT),
            cond: [],
          });
        }
        if (line.LINEDISCAMT && line.LINEDISCAMT > 0) {
          line.applied_discounts.push({
            discountType: "LINE_DISCOUNT",
            percentage: (parseFloat(line.LINEDISCAMT) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.LINEDISCAMT),
            cond: [],
          });
        }
        if (line.MultiLnDisc && line.MultiLnDisc > 0) {
          let MultiLineDiscRangesQuery = `SELECT itemrelation, ACCOUNTRELATION,QUANTITYAMOUNT,
                                          CURRENCY,PERCENT1 FROM 
                                          PRICEDISCTABLE WHERE MODULE = 1 AND 
                                          ITEMCODE = 1 AND ACCOUNTCODE = 1 AND 
                                          ACCOUNTRELATION = '${line.CUSTACCOUNT}' AND LOWER(DATAAREAID) = LOWER('${line.DATAAREAID}') AND CURRENCY='${line.CURRENCYCODE}'`;
          let MultiLineDiscRanges = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, MultiLineDiscRangesQuery);
          line.applied_discounts.push({
            discountType: "MULTI_LINE_DISCOUNT",
            percentage: parseFloat(line.MultiLnPercent),
            discountAmount: parseFloat(line.MultiLnDisc),
            cond: MultiLineDiscRanges.rows,
          });
        }
        if (line.InstantDisc && line.InstantDisc > 0) {
          let InstantDiscRangesQuery = `select 
          * from custtotaldiscount where dataareaid ='ajp' and custaccount = '${line.CUSTACCOUNT}' order by minamount`;
          let InstantDiscRanges = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, InstantDiscRangesQuery);
          line.applied_discounts.push({
            discountType: "MULTI_LINE_DISCOUNT",
            percentage: (parseFloat(line.InstantDisc) * 100) / parseFloat(line.LINEAMOUNT),
            discountAmount: parseFloat(line.MultiLnDisc),
            cond: InstantDiscRanges.rows,
          });
        }
        if (line.PromotionDisc && line.PromotionDisc > 0) {
          let PromotionalDiscountCondQuery = `select
          dataareaid, 
          inventlocationid, 
          itemid,
          inventsizeid,
          configid,
          multiple_qty as "multipleQty", 
          free_qty as "freeQty"
          from sales_promotion_items where 
          inventlocationid = '${line.INVENTLOCATIONID}' and itemid = '${line.ITEMID}' limit 1`;
          let PromotionalDiscountRanges = await SyncServiceHelper.ExecuteQuery(
            this.localDbConfig,
            PromotionalDiscountCondQuery
          );
          line.applied_discounts.push({
            discountType: "PROMOTIONAL_DISCOUNT",
            discountAmount: parseFloat(line.PromotionDisc),
            cond: [
              {
                multipleQty:
                  PromotionalDiscountRanges.rows.length > 0 ? PromotionalDiscountRanges.rows[0].multipleQty : 10,
                freeQty: PromotionalDiscountRanges.rows.length > 0 ? PromotionalDiscountRanges.rows[0].freeQty : 1,
              },
            ],
          });
        }
        if (line.PromotionDiscEqual && line.PromotionDiscEqual > 0) {
          line.link_id = line.PromotionDiscEqualRecId ? line.PromotionDiscEqualRecId.split(",")[0] : line.RECID;
          line.isitemfree = line.PromotionDiscEqualRecId ? true : false;
          line.applied_discounts.push({
            discountType: "BUY_ONE_GET_ONE_DISCOUNT",
            discountAmount: parseFloat(line.PromotionDiscEqual),
            cond: [
              {
                multipleQty: 1,
                freeQty: 1,
              },
            ],
          });
        }
        line.applied_discounts = JSON.stringify(line.applied_discounts);
        line.batches = JSON.stringify([
          {
            batchNo: line.BATCHNO,
            quantity: line.SALESQTY,
          },
        ]);
        let query = `INSERT INTO public.salesline
        (id, salesid, linenum, itemid, "name", salesprice, currencycode, salesqty, lineamount, salesunit, priceunit, qtyordered, remainsalesphysical, remainsalesfinancial,
        salestype, dataareaid, custgroup, custaccount, inventsizeid, configid, numbersequencegroupid, inventlocationid, salesdelivernow, salesstatus, "location", batchno, instantdisc, voucherdisc,
          redeemdisc, promotiondisc, linetotaldisc, linesalestax, netamttax, linesalestaxpercent, taxgroup, taxitemgroup, linediscamt, customdiscamt, supplmultipleqty, supplfreeqty, multilndisc, multilnpercent, enddisc,
          createdby, createddatetime, lastmodifiedby, lastmodifieddate, 
            vatamount, vat, voucherdiscamt, sabic_customer_discount, is_item_free, link_id, batches, applied_discounts)
        VALUES('${uuid() + App.UniqueNumber()}' ,'${line.SALESID}', ${line.LINENUM}, '${line.ITEMID}', '${
          line.NAME
        }', ${line.SALESPRICE}, '${line.CURRENCYCODE}', ${line.SALESQTY}, ${line.LINEAMOUNT}, '${line.SALESUNIT}', ${
          line.PRICEUNIT
        }, ${line.QTYORDERED}, 
        ${line.REMAINSALESPHYSICAL}, ${line.REMAINSALESFINANCIAL},  ${line.SALESTYPE}, '${
          line.DATAAREAID ? line.DATAAREAID.toLowerCase() : null
        }', '${line.CUSTGROUP}', '${line.CUSTACCOUNT}', '${line.INVENTSIZEID}', '${line.CONFIGID}',
         '${line.NUMBERSEQUENCEGROUPID}', '${line.INVENTLOCATIONID}', ${line.SALESDELIVERNOW}, ${line.SALESSTATUS}, '${
          line.LOCATION
        }', '${line.BATCHNO}', ${line.InstantDisc ? line.InstantDisc : 0}, ${
          line.VoucherDisc ? line.VoucherDisc : 0
        }, ${line.RedeemDisc ? line.RedeemDisc : 0}, ${line.PromotionDisc ? line.PromotionDisc : 0}, 
         ${line.LineTotalDisc ? line.LineTotalDisc : 0}, ${line.LineSalesTax ? line.LineSalesTax : 0}, ${
          line.NetAmtTax ? line.NetAmtTax : 0
        }, ${line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0}, '${line.TAXGROUP}', '${line.TAXITEMGROUP}', ${
          line.LINEDISCAMT ? line.LINEDISCAMT : 0
        }, ${line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0}, ${line.SupplMultipleQty ? line.SupplMultipleQty : 0}, ${
          line.SupplFreeQty ? line.SupplFreeQty : 0
        },
         ${line.MulLnDisc ? line.MultiLineDisc : 0}, ${line.MultiPercent ? line.MultiPercent : 0}, ${
          line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0
        }, '${line.createdby}', now(), '${line.createdby}', now(),
          ${line.LineSalesTax ? line.LineSalesTax : 0}, ${line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0},
           ${line.VoucherDisc ? line.VoucherDisc : 0}, ${
          line.InteriorExteriorAmount ? line.InteriorExteriorAmount : 0
        }, ${line.isitemfree ? line.isitemfree : false}, '${line.link_id}', '${line.batches}', '${
          line.applied_discounts
        }')
        `;
        // log.info(query)
        queryData.push(query);
      }
      await SyncServiceHelper.BatchQuery(this.localDbConfig, queryData);
    } catch (err) {
      log.error(err);
    }
  }

  async syncInventTransData(inventTransData: any[], queryData: any[] = [], transactionclosed: boolean) {
    try {
      let inventoryOnHandQuery: any[] = [];
      let text: string;
      for (let trans of inventTransData) {
        // log.info(trans);
        if (trans.TRANSTYPE == 4) {
          text = `select salesid from salestable where intercompanyoriginalsalesid = '${trans.TRANSREFID}' limit 1`;
          let salesOrderData = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, text);
          trans.INVOICEID = salesOrderData.rows[0] ? salesOrderData.rows[0].salesid : trans.TRANSREFID;
        } else {
          text = `select intercompanyoriginalsalesid from salestable where salesid = '${trans.TRANSREFID}' limit 1`;
          let salesOrderData = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, text);
          trans.INVOICEID = trans.TRANSREFID;
          trans.TRANSREFID = salesOrderData.rows[0]
            ? salesOrderData.rows[0].intercompanyoriginalsalesid
            : trans.TRANSREFID;

          trans.TRANSREFID = trans.TRANSREFID == "Nothing" ? trans.INVOICEID : trans.TRANSREFID;
        }
        let saleslinequery = `select id from salesline where salesid = '${trans.INVOICEID}' AND itemid = '${trans.ITEMID}' AND configid = '${trans.ConfigId}' AND inventsizeid = '${trans.InventSizeId}' AND batchno = '${trans.BATCHNO}' AND salesqty = ABS(${trans.QTY}) limit 1`;
        let salesLineData = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, saleslinequery);
        // log.info(salesLineData);
        trans.saleslineid = salesLineData.rows[0] ? salesLineData.rows[0].id : "";
        let query = `INSERT INTO public.inventtrans
        (id, itemid, qty, datephysical, transtype, transrefid, invoiceid, dataareaid, recversion, recid, inventsizeid, configid, batchno, inventlocationid, transactionclosed, reserve_status, sales_line_id)
        VALUES('${uuid() + App.UniqueNumber()}', '${trans.ITEMID}', ${trans.QTY}, '${trans.DATEPHYSICAL}',${
          trans.TRANSTYPE
        }, '${trans.TRANSREFID}', '${trans.INVOICEID}', '${trans.DATAAREAID}', ${trans.RECVERSION}, ${trans.RECID}, '${
          trans.InventSizeId
        }',
         '${trans.ConfigId}', '${trans.BATCHNO}', '${
          this.dateObj.inventlocationid
        }', ${transactionclosed}, 'OLD_POS_DATA', '${trans.saleslineid}');
        `;
        // log.info(query);
        if (transactionclosed == true && trans.ITEMID != "HSN-00001") {
          text = `select * from inventory_onhand where itemid = '${trans.ITEMID}' AND configid = '${trans.ConfigId}' and inventsizeid = '${trans.InventSizeId}' and batchno = '${trans.BATCHNO}' and inventlocationid = '${this.dateObj.inventlocationid}'`;
          let onhanddata = await SyncServiceHelper.ExecuteQuery(this.localDbConfig, text);
          log.info(onhanddata);
          if (onhanddata && onhanddata.rows.length > 0) {
            trans.qty_in =
              parseInt(trans.QTY) > 0
                ? parseInt(onhanddata.rows[0].qty_in) + Math.abs(parseInt(trans.QTY))
                : parseInt(onhanddata.rows[0].qty_in) + 0;
            trans.qty_out =
              parseInt(trans.QTY) <= 0
                ? parseInt(onhanddata.rows[0].qty_out) + Math.abs(parseInt(trans.QTY))
                : parseInt(onhanddata.rows[0].qty_out) + 0;
            let onhandquery = `UPDATE public.inventory_onhand SET  qty_in='${trans.qty_in}', qty_out= '${trans.qty_out}', updated_on=now() WHERE id='${onhanddata.rows[0].id}'`;
            inventoryOnHandQuery.push(onhandquery);
          } else {
            trans.qty_in = parseInt(trans.QTY) > 0 ? Math.abs(parseInt(trans.QTY)) : 0;
            trans.qty_out = parseInt(trans.QTY) <= 0 ? Math.abs(parseInt(trans.QTY)) : 0;
            let onhandquery = `INSERT INTO public.inventory_onhand (id, itemid, configid, inventsizeid, batchno, qty_in, qty_out, qty_reserved, dataareaid, inventlocationid, updated_on, "name", updated_by) VALUES( '${
              uuid() + App.UniqueNumber()
            }', '${trans.ITEMID}', '${trans.ConfigId}', '${trans.InventSizeId}', '${trans.BATCHNO}', '${
              trans.qty_in
            }', '${trans.qty_out}', 0, '${trans.DATAAREAID.toLowerCase()}', '${
              this.dateObj.inventlocationid
            }', now(), 'OPEN_BALANCE', 'sayeed');`;
            inventoryOnHandQuery.push(onhandquery);
          }
        }
        queryData.push(query);
      }
      log.info(inventoryOnHandQuery);
      await SyncServiceHelper.BatchQuery(this.localDbConfig, queryData);
      await SyncServiceHelper.BatchQuery(this.localDbConfig, inventoryOnHandQuery);
    } catch (err) {
      log.error(err);
      // throw err;
    }
  }
  async chunkArray(myArray: any, chunk_size: number) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }

    return await tempArray;
  }
}

let sync = new SyncPrevTransactionsService();
try {
  sync.mssqlTransactions();
} catch (err) {
  log.error(err);
}

let salesTableQuery = `
SELECT SALESID AS salesid,
SALESTYPE as salestype,
SALESSTATUS AS salesstatus,
SALESGROUP as salesgroup,
CAST(CASE SALESTYPE 
  WHEN 3 THEN 'SALESORDER' 
  WHEN 4 THEN 'RETURNORDER' 
  WHEN 5 THEN 'TRANSFERORDER'
  WHEN 6 THEN 'ORDERSHIPMENT'
  WHEN 7 THEN 'ORDERRECEIVE'
  WHEN 10 THEN 'INVENTORYMOVEMENT'
  ELSE ''
END AS VARCHAR(20)) AS transkind,
SALESGROUP as intercompanyoriginalsalesid,
CUSTOMERREF AS customerref,
CAST(CASE SALESSTATUS 
  WHEN 2 THEN 'POSTED' 
  WHEN 3 THEN 'POSTED'
  ELSE ''
END AS VARCHAR(20)) AS status,
SALESNAME as salesname,
RESERVATION as reservation,
    CUSTACCOUNT as custaccount,
    INVOICEACCOUNT as invoiceaccount,
    DELIVERYADDRESS as deliveryaddress,
    CONVERT(VARCHAR(10), DELIVERYDATE, 120) as deliverydate,
    DOCUMENTSTATUS as documentstatus,
    CURRENCYCODE as currencycode,
    lower(DATAAREAID) as dataareaid,
    RECVERSION as recversion,
    RECID as recid,
    LANGUAGEID as languageid,
    PAYMENT as payment,
    CUSTGROUP as custgroup,
    PRICEGROUPID as pricegroupid,
    CONVERT(VARCHAR(10), SHIPPINGDATEREQUESTED, 120) as shippingdaterequested,
    DELIVERYSTREET as deliverystreet,
    NUMBERSEQUENCEGROUP as numbersequencegroup,
    CASHDISC as cashdisc,
    CONVERT(VARCHAR(10), SHIPPINGDATECONFIRMED, 120) as shippingdateconfirmed,
    CONVERT(VARCHAR(10), DEADLINE, 120) AS deadline,
    CONVERT(VARCHAR(10), FIXEDDUEDATE, 120) as fixedduedate,
    CONVERT(VARCHAR(10), RETURNDEADLINE, 120) as returndeadline,
    CONVERT(VARCHAR(10), CREATEDDATETIME, 120) as createddatetime,
    AMOUNT AS amount,
    DISC as disc,
    NETAMOUNT as netamount,
    CITYCODE as citycode,
    DISTRICTCODE as districtcode,
    LATITUDE AS latitude,
    LONGITUDE as longitude,
    VehicleCode as vehiclecode,
    APPTYPE as apptype,
    VOUCHERNUM as vouchernum,
    Painter as painter,
    AJPENDDISC as ajpenddisc,
    TAXGROUP as taxgroup,
    SUMTAX as sumtax,
    SUMTAX as vatamount,
    CardNo as cardno,
    REDEEMPOINTS as redeempts,
    REDEEMAMT as redeemptsamt,
    MultiLineDisc as multilinediscountgroupid,
    BANKCARDNO as bankcardno,
    CARDHOLDERNAME as cardholdername,
    CARDEXPIRY as cardexpiry
FROM SALESTABLE
WHERE 
SALESTYPE IN (3,4,5,6,7,10) AND  SALESSTATUS IN (2,3)
AND `;

let salesLineQuery = `SELECT * FROM SALESLINE WHERE SALESID IN (
  SELECT SALESID
  FROM SALESTABLE
  WHERE 
  SALESTYPE IN (3,4,5,6,7,10) AND  SALESSTATUS IN (2,3)
  AND `;

let inventTransQuery = `
SELECT 
ITEMID,
CONVERT(VARCHAR(10), DATEPHYSICAL, 120) as DATEPHYSICAL,
QTY,
TRANSTYPE,
TRANSREFID,
INVOICEID,
RECVERSION,
RECID,
InventSizeId,
ConfigId,
BATCHNO,
lower(DATAAREAID) as DATAAREAID
FROM INVENTTRANS where `;
