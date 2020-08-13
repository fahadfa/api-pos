import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import Axios, { AxiosStatic, AxiosRequestConfig, AxiosPromise } from "axios";
import { SalesTable } from "../../entities/SalesTable";
import { SalesLine } from "../../entities/SalesLine";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { Colors } from "../../entities/Colors";
import { BaseSizes } from "../../entities/BaseSizes";
import { BaseSizesDAO } from "../repos/BaseSizesDAO";
import { ColorsDAO } from "../repos/ColorsDAO";
import { SalesTableDAO } from "../repos/SalesTableDAO";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import uuid = require("uuid");
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { RawQuery } from "../common/RawQuery";
import { SalesTableService } from "./SalesTableService";
import { getConnection } from "typeorm";

export class PurchaseOrderFromAxaptaService {
  public sessionInfo: any;
  axios = require("axios");
  private updateInventoryService: UpdateInventoryService;
  private colorsDAO: ColorsDAO;
  private baseSizeDAO: BaseSizesDAO;
  private salesTableDAO: SalesTableDAO;
  private salesLineDAO: SalesLineDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private salesTableService: SalesTableService;
  private rawQuery: RawQuery;

  constructor() {
    this.updateInventoryService = new UpdateInventoryService();
    this.colorsDAO = new ColorsDAO();
    this.baseSizeDAO = new BaseSizesDAO();
    this.salesTableDAO = new SalesTableDAO();
    this.salesLineDAO = new SalesLineDAO();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
  }

  async get(purchaseID: string) {
    try {
      let axaptaData = await this.getPurchaseOrder(purchaseID, this.sessionInfo.inventlocationid);

      console.log("data-----------------", axaptaData);

      return await this.mapSalesData(axaptaData);
      // return axaptaData
    } catch (error) {
      throw error;
    }
  }

  async mapSalesData(data: any) {
    try {
      if (data.length > 0) {
        let salesData: any = await this.salesTableDAO.findOne({ salesId: data[0].transfer_id });
        console.log(data, this.sessionInfo.inventlocationid);
        if (data[0].invent_location_id.trim() == this.sessionInfo.inventlocationid) {
          salesData = new SalesTable();
          salesData.salesId = data[0].purch_id;
          salesData.inventLocationId = data[0].invent_location_id.trim();
          salesData.transkind = "PURCHASEORDER";
          salesData.saleStatus = "CREATED";
          salesData.custAccount = data[0].vend_account;
          salesData.invoiceAccount = data.cust_account;
          this.rawQuery.sessionInfo = this.sessionInfo
          let custAccount = await this.rawQuery.getCustomer(salesData.invoiceAccount);
          let customer = custAccount ? custAccount : {};
          salesData.salesmanId = customer.salesmanid;
          salesData.invoiceDate = new Date(App.DateNow());
          salesData.shippingDateConfirmed = new Date(App.DateNow());
          salesData.dataareaid = data[0].data_area_id;
          salesData.lastModifiedDate = new Date(App.DateNow());
          salesData.createddatetime = new Date(App.DateNow());
          salesData.salesType = 4;
          salesData.salesLines = [];

          let i = 1;
          for (let v of data) {
            let salesLine: any = new SalesLine();
            salesLine.salesId = v.purch_id;
            salesLine.lineNum = i;
            salesLine.itemid = v.item_id;
            salesLine.salesprice = 0;
            salesLine.appliedDiscounts = [];
            salesLine.configId = v.config_id;
            salesLine.inventsizeid = v.invent_size_id;
            salesLine.salesQty = parseInt(v.purch_qty);
            salesLine.dataareaid = v.data_area_id;
            salesLine.inventLocationId = v.invent_location_id;
            salesLine.batchNo = v.batch_no;
            salesLine.custAccount = v.vend_account;
            salesLine.lastModifiedDate = new Date(App.DateNow());
            salesLine.createddatetime = new Date(App.DateNow());
            let batches: any = {};
            batches.qty = parseInt(v.purch_qty);
            batches.itemid = salesLine.itemid;
            batches.transrefid = salesLine.salesId;
            batches.invoiceid = salesLine.salesId;
            batches.batchno = salesLine.batchNo;
            batches.configid = salesLine.configId;
            batches.inventsizeid = salesLine.inventsizeid;
            batches.inventlocationid = salesLine.inventLocationId;
            batches.dataareaid = salesLine.dataareaid;
            batches.transactionClosed = false;
            batches.dateinvent = new Date(App.DateNow());
            salesLine.batches = batches;
            salesData.salesLines.push(salesLine);
            i += 1;
          }
          salesData.status = 1;
          return salesData;
        } else {
          throw { status: 1, message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
        }
      } else {
        throw { status: 1, message: "DATA_NOT_FOUND" };
      }
    } catch (error) {
      throw error;
    }
  }

  async save(data: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (data.inventLocationId) {
        let salesData: any = await this.salesTableDAO.findOne({ salesId: data.salesId });
        if (salesData) {
          throw { message: "ALREADY_RECEIVED" };
        } else {
          let usergroupconfig = await this.usergroupconfigDAO.findOne({
            groupid: this.sessionInfo.groupid,
          });
          salesData = data;
          salesData.status = data.saleStatus;
          salesData.transkind = "PURCHASEORDER";
          let salesLines = data.salesLines;
          delete salesData.salesLines;
          // await this.salesTableDAO.save(salesData);
          await queryRunner.manager.getRepository(SalesTable).save(salesData);
          for (let item of salesLines) {
            item.id = uuid();
            item.salesId = salesData.salesId;
            item.batch = [
              {
                batchNo: item.batches.batchno,
                quantity: parseInt(item.batches.qty),
              },
            ];
            let batches = item.batches;
            batches.invoiceid = salesData.salesId;
            batches.salesLineId = item.id;
            // await this.salesLineDAO.save(item);
            await queryRunner.manager.getRepository(SalesLine).save(item);
            await this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner);
          }
          await queryRunner.commitTransaction();
          return { status: 1, id: salesData.salesId, message: Props.SAVED_SUCCESSFULLY };
        }
      } else {
        throw { status: 0, message: "INVALID_DATA" };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPurchaseOrder(purchID: string, inventLocationId: string) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = Props.AXAPTA_URL + `PurchLine?purchID=${purchID}&inventLocationId=${inventLocationId}`;
      console.log("axpta url :  ", url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.get(url);
      console.log(Object.keys(data));
      console.log();
      return data.data;
    } catch (error) {
      // console.log(Object.keys(error));
      // console.log(error.response.data.Message);
      throw { status: 0, message: error.response.data.Message };
      // console.error(error);
    }
  }

  async getAgentOrder(purchaseID: string) {
    try {
      let axaptaData = await this.getAgentPurchaseOrder(purchaseID);
      console.log("data-----------------", axaptaData);
      if (axaptaData.invent_location_id.trim() == this.sessionInfo.inventlocationid) {
        return await this.mapAgentpurcaseOrder(axaptaData);
      } else {
        throw { status: 0, message: "ORDER_NOT_RELATED_TO_THIS_STORE" };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAgentPurchaseOrder(purchID: string) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = Props.AXAPTA_URL + `AgentPurchaseOrder?purchID=${purchID}`;
      console.log("axpta url :  ", url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.get(url);
      console.log(Object.keys(data));
      console.log();
      return data.data;
    } catch (error) {
      throw { status: 0, message: error.response.data.Message };
    }
  }

  async mapAgentpurcaseOrder(data: any) {
    let salesData: any = {};
    salesData.salesId = data.purch_id;
    salesData.salesName = data.cust_name;
    salesData.custAccount = data.cust_account;
    salesData.invoiceAccount = data.cust_account;
    salesData.deliveryAddress = data.deilvery_address;
    salesData.custGroup = data.cust_group;
    salesData.invoiceDate = data.order_date;
    salesData.currencyCode = data.currency_code;
    salesData.payment = data.payment_terms;
    salesData.priceGroupId = data.price_group_id;
    salesData.inventLocationId = data.invent_location_id.trim();
    this.rawQuery.sessionInfo = this.sessionInfo
    let custAccount = await this.rawQuery.getCustomer(salesData.invoiceAccount);
    let customer = custAccount ? custAccount : {};
    salesData.salesmanId = customer.salesmanid;
    // salesData.inventLocationId = this.sessionInfo.inventlocationid;
    salesData.taxGroup = data.tax_group;
    salesData.amount = data.gross_amount;
    salesData.disc = data.total_disc;
    salesData.vatamount = data.total_vat_amount;
    salesData.netAmount = data.net_amount;
    salesData.dataareaid = data.data_area_id;
    let salesLine: any[] = [];

    data.agentOrderLines.map((v: any) => {
      let line: any = {};
      line.salesId = v.purch_id;
      line.custAccount = v.cust_account;
      line.lineNum = v.line_num;
      line.itemid = v.item_id;
      line.name = v.name;
      line.configId = v.config_id;
      line.inventsizeid = v.invent_size_id;
      line.taxGroup = v.tax_group;
      line.taxItemGroup = v.tax_item_group;
      line.salesprice = v.unit_price;
      line.salesQty = parseInt(v.qty);
      line.lineTotalDisc = v.line_disc;
      line.lineAmount = v.line_amount;
      line.vat = v.line_vat_percent;
      line.vatamount = v.line_vat;
      line.currencyCode = v.currency_code;
      line.dataareaid = salesData.dataareaid;
      line.inventLocationId = salesData.inventLocationId;
      // let batches: any = {};
      // batches.qty = parseInt(v.purch_qty);
      // batches.itemid = line.itemid;
      // batches.transrefid = line.salesId;
      // batches.invoiceid = line.salesId;
      // batches.batchno = line.batchNo;
      // batches.configid = line.configId;
      // batches.inventsizeid = line.inventsizeid;
      // batches.inventlocationid = line.inventLocationId;
      // batches.dataareaid = line.dataareaid;
      // batches.transactionClosed = false;
      // batches.dateinvent = new Date(App.DateNow());
      // line.batches = batches;
      salesLine.push(line);
    });
    salesData.salesLine = salesLine;
    return salesData;
  }

  async saveAgentOrder(data: any) {
    try {
      // console.log(data);
      if (data.inventLocationId.trim() == this.sessionInfo.inventlocationid) {
        let salesData: any = await this.salesTableDAO.findOne({ interCompanyOriginalSalesId: data.salesId });
        if (salesData) {
          throw { message: "ALREADY_RECEIVED" };
        } else {
          salesData = data;
          salesData.interCompanyOriginalSalesId = data.salesId;
          salesData.status = "CREATED";
          salesData.transkind = "SALESORDER";
          delete salesData.salesId;
          this.salesTableService.sessionInfo = this.sessionInfo;
          salesData.inventLocationId = data.inventLocationId;
          await this.salesTableService.save(salesData);
          return { status: 1, id: salesData.salesId, message: Props.SAVED_SUCCESSFULLY };
        }
      } else {
        throw { status: 0, message: "ORDER_NOT_RELATED_TO_THIS_STORE" };
      }
    } catch (error) {
      throw error;
    }
  }

  async getToken() {
    try {
      let token: string;
      let url = `${Props.REDEEM_URL}?clientId=${Props.REDEEM_CLIENT_ID}&clientSecret=${Props.REDEEM_CLIENT_SECRET}`;
      console.log(url);
      let data = await this.axios.post(url);
      token = data.headers.token;
      return token;
    } catch (error) {
      throw { status: 0, message: error };
      // console.error(error);
    }
  }
}
