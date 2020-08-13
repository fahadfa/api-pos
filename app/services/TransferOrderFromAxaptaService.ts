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
import { getConnection } from "typeorm";

export class TransferOrderFromAxaptaService {
  public sessionInfo: any;
  axios = require("axios");
  private updateInventoryService: UpdateInventoryService;
  private colorsDAO: ColorsDAO;
  private baseSizeDAO: BaseSizesDAO;
  private salesTableDAO: SalesTableDAO;
  private salesLineDAO: SalesLineDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private rawQuery: RawQuery;

  constructor() {
    this.updateInventoryService = new UpdateInventoryService();
    this.colorsDAO = new ColorsDAO();
    this.baseSizeDAO = new BaseSizesDAO();
    this.salesTableDAO = new SalesTableDAO();
    this.salesLineDAO = new SalesLineDAO();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.rawQuery = new RawQuery();
  }

  async get(transferID: string) {
    try {
      let axaptaData = await this.getTransferOrder(transferID);
      console.log("data-----------------", axaptaData);
      axaptaData.invent_location_id_to.trim();
      if (axaptaData.invent_location_id_to.trim() == this.sessionInfo.inventlocationid) {
        return await this.mapSalesData(axaptaData);
      } else {
        throw { message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
      }
      // return axaptaData
    } catch (error) {
      throw error;
    }
  }

  async mapSalesData(data: any) {
    try {
      let salesData: any = await this.salesTableDAO.findOne({ salesId: data.transfer_id });
      console.log(data.invent_location_id_to, this.sessionInfo.inventlocationid);
      if (data.invent_location_id_to == this.sessionInfo.inventlocationid) {
        salesData = new SalesTable();
        salesData.salesId = data.transfer_id;
        salesData.inventLocationId = data.invent_location_id_to;
        salesData.transkind = "TRANSFERORDER";
        salesData.saleStatus = "RECEIVED";
        salesData.custAccount = data.invent_location_id_from;
        salesData.invoiceDate = data.shipdate;
        salesData.shippingDateConfirmed = data.shipdate;
        salesData.dataareaid = data.data_area_id;
        salesData.lastModifiedDate = new Date(App.DateNow());
        salesData.createddatetime = new Date(App.DateNow());
        salesData.salesType = 4;
        // await this.salesTableDAO.save(salesData);
        // let salesLines = await this.salesLineDAO.findAll({ salesId: salesData.salesId });
        // await this.salesLineDAO.delete(salesLines);
        salesData.salesLines = [];
        let i = 1;
        for (let v of data.orderLines) {
          let salesLine: any = new SalesLine();
          salesLine.salesId = v.transfer_id;
          salesLine.lineNum = i;
          salesLine.itemid = v.item_id;
          salesLine.configId = v.config_id;
          salesLine.inventsizeid = v.invent_size_id;
          salesLine.salesQty = parseInt(v.shipped_qty);
          salesLine.dataareaid = v.data_area_id;
          salesLine.inventLocationId = data.invent_location_id_to;
          salesLine.batchNo = v.batch_no;
          salesLine.custAccount = data.invent_location_id_from;
          // salesLine.colors = await this.colorsDAO.findOne({ code: v.config_id });
          // salesLine.baseSizes = await this.baseSizeDAO.findOneforaxaptadata({ base: { code: v.item_id }, sizes: { code: v.invent_size_id } });
          salesLine.lastModifiedDate = new Date(App.DateNow());
          salesLine.createddatetime = new Date(App.DateNow());
          // await this.salesLineDAO.save(salesLine);
          let batches: any = {};
          batches.qty = parseInt(v.shipped_qty);
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
          // await this.updateInventoryService.updateInventtransTable(batches);
          salesData.salesLines.push(salesLine);
          i += 1;
        }
        salesData.status = 1;
        // return { message: Props.SAVED_SUCCESSFULLY };
        return salesData;
      } else {
        throw { status: 1, message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
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
      console.log(data);
      if (data.inventLocationId == this.sessionInfo.inventlocationid) {
        let salesData: any;
        let prevSalesData: any = await this.salesTableDAO.findOne({ interCompanyOriginalSalesId: data.salesId });
        if (prevSalesData) {
          throw { message: "ALREADY_RECEIVED" };
        } else {
          let usergroupconfig = await this.usergroupconfigDAO.findOne({
            groupid: this.sessionInfo.groupid,
          });
          salesData = data;
          salesData.status = "RECEIVED";
          salesData.interCompanyOriginalSalesId = salesData.salesId;
          salesData.transkind = "ORDERRECEIVE";
          let seqNum = usergroupconfig.orderreceivesequencegroup;
          let seqData = await this.rawQuery.getNumberSequence(seqNum);
          if (seqData && seqData.format) {
            let hashString: string = seqData.format.slice(
              seqData.format.indexOf("#"),
              seqData.format.lastIndexOf("#") + 1
            );
            let date: any = new Date(seqData.lastmodifieddate).toLocaleString();
            // console.log(date);
            // console.log(seqData);
            let prevYear = new Date(seqData.lastmodifieddate).getFullYear().toString().substr(2, 2);
            let year: string = new Date().getFullYear().toString().substr(2, 2);

            seqData.nextrec = prevYear == year ? seqData.nextrec : "000001";

            salesData.salesId = seqData.format.replace(hashString, year) + "-" + seqData.nextrec;
            //console.log(salesId);
            await this.rawQuery.updateNumberSequence(seqNum, seqData.nextrec);
          } else {
            throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
          }
          let salesLines = data.salesLines;
          delete salesData.salesLines;
          // await this.salesTableDAO.save(salesData);
          await queryRunner.manager.getRepository(SalesTable).save(salesData);
          // let prevSalesLines = await this.salesLineDAO.findAll({ salesId: salesData.interCompanyOriginalSalesId });
          // await this.salesLineDAO.delete(prevSalesLines);
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
            console.log("==========================================================", batches);
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
        throw { status: 0, message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransferOrder(transferID: string) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = Props.AXAPTA_URL + `ShippedTransferOrder?transferID=${transferID}`;
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

  async getQrStringToData(data: any) {
    return await this.qrToData(data.qrStringList);
  }

  async qrToData(qrStringList: any[]) {
    try {
      let dataList: any = [];
      let pageCount = 0;
      let salesId: string = "0";
      let scannedPages: any[] = [];
      for (let qrString of qrStringList) {
        let list: any[] = qrString.split("|");
        let header: string = list[0];
        let warehousearray: any[] = header.split("^");
        let pages = qrString.substring(0, qrString.indexOf("$")).split("%");
        pageCount = pages[1];

        let salestable: any = {
          salesId: header.substring(header.lastIndexOf("$") + 1, header.indexOf("^")),
          custAccount: warehousearray[1],
          inventLocationId: warehousearray[2],
          page: pages[0],
        };
        scannedPages.push(parseInt(salestable.page));
        if (salesId == "0") {
          salesId = salestable.salesId;
        } else if (salesId != salestable.salesId) {
          throw { message: "PLEASE_SCAN_ALL_PAGES_WITH_SAME_ORDER_ID" };
        }

        let salesLines: any[] = [];

        for (let item of list[1].split("*")) {
          let salesline: any = {};
          let lineArray: any[] = item.split("+");
          if (lineArray[0] == "HSN-00001") {
            salesLines[salesLines.length - 1].colorantId = lineArray[1];
          } else {
            salesline.salesId = salestable.salesId;
            salesline.itemid = lineArray[0];
            salesline.configId = lineArray[1];
            salesline.inventsizeid = lineArray[2];
            salesline.batch = { batchNo: lineArray[3], quantity: parseInt(lineArray[4]) };
            salesline.salesQty = parseInt(lineArray[4]);
            salesline.lastModifiedDate = new Date(App.DateNow());
            salesline.createddatetime = new Date(App.DateNow());
            salesline.inventLocationId = salestable.inventLocationId;
            salesline.batchNo = lineArray[3];
            salesline.dataareaid = this.sessionInfo.dataareaid;
            salesline.custAccount = salestable.custAccount;
            let batches: any = {};
            batches.qty = salesline.salesQty;
            batches.itemid = salesline.itemid;
            batches.transrefid = salesline.salesId;
            batches.invoiceid = salesline.salesId;
            batches.batchno = salesline.batchNo;
            batches.configid = salesline.configId;
            batches.inventsizeid = salesline.inventsizeid;
            batches.inventlocationid = salesline.inventLocationId;
            batches.dataareaid = salesline.dataareaid;
            batches.transactionClosed = false;
            batches.dateinvent = new Date(App.DateNow());
            salesline.batches = batches;
            console.log("===", salesLines.length);
            salesLines.push(salesline);
          }
        }
        salestable.salesLine = salesLines;
        dataList.push(salestable);
      }
      if (pageCount == qrStringList.length) {
        dataList.sort((a: any, b: any) => {
          if (a.page < b.page) return -1;
          if (a.page > b.page) return 1;
          return 0;
        });
        let salesData: any = { ...dataList[0] };
        delete salesData.salesLine;
        let salesLine: any[] = [];
        dataList.map((v: any) => {
          salesLine.push(...v.salesLine);
        });
        let i: number = 1;
        salesLine.map((v: any) => {
          v.lineNum = i;
          i += 1;
        });
        salesData.lastModifiedDate = new Date(App.DateNow());
        salesData.createddatetime = new Date(App.DateNow());
        salesData.transkind = "ORDERSHIPMENT";
        salesData.saleStatus = "RECEIVED";
        salesData.dataareaid = this.sessionInfo.dataareaid;
        salesData.salesType = 4;
        salesData.salesLines = salesLine;
        console.log(scannedPages);
        return salesData;
      } else {
        console.log(scannedPages);
        let totalPages = [];
        let missingPages = [];
        for (let i = 1; i <= pageCount; i++) {
          totalPages.push(i);
        }
        totalPages.map((v) => {
          if (!scannedPages.includes(v)) {
            missingPages.push(v);
          }
        });
        console.log(totalPages, scannedPages);
        throw { message: "PLEASE_SCAN_ALL_PAGES", missingPages: missingPages };
      }
    } catch (err) {
      throw { message: err };
    }
  }

  async getToken() {
    try {
      let token: string;
      let url = `${Props.REDEEM_URL}?clientId=${Props.REDEEM_CLIENT_ID}&clientSecret=${Props.REDEEM_CLIENT_SECRET}`;
      console.log(url);
      let data: any = await this.axios.post(url);
      token = data.headers.token;
      return token;
    } catch (error) {
      throw { status: 0, message: error };
      // console.error(error);
    }
  }
}
