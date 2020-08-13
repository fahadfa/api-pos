import { App } from "../../utils/App";
import { SalesTable } from "../../entities/SalesTable";
import { SalesTableDAO } from "../repos/SalesTableDAO";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import { CusttableDAO } from "../repos/CusttableDAO";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { ColorsDAO } from "../repos/ColorsDAO";
import { RawQuery } from "../common/RawQuery";
import { getManager } from "typeorm";
import { Props } from "../../constants/Props";
import { Overdue } from "../../entities/Overdue";
import { OverDueDAO } from "../repos/OverDueDAO";
import { InventbatchDAO } from "../repos/InventbatchDAO";
import { VisitCustomerService } from "./VisitCustomerService";
import { VisitCustomer } from "../../entities/VisitCustomer";
import { DesignerserviceRepository } from "../repos/DesignerserviceRepository";
import { AppliedDiscountsDAO } from "../repos/AppliedDiscountsDAO";
import { InventlocationDAO } from "../repos/InventLoactionDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { SalesOrderTokensDAO } from "../repos/SalesOrderTokensDAO";
import { RedeemService } from "../services/RedeemService";
import { log } from "../../utils/Log";
import { getConnection } from "typeorm";
var moment = require("moment");

// to generate uuid for salesline data
import uuid = require("uuid");
import { Sms } from "../../utils/Sms";
import { SalesOrderTokens } from "../../entities/SalesOrderTokens";
import { SalesLine } from "../../entities/SalesLine";
import { AnyARecord } from "dns";
import { Console } from "console";
import { Designerservice } from "../../entities/Designerservice";
import { Exception } from "handlebars";
import { Inventorytrans } from "../../entities/InventTrans";

export class SalesTableService {
  public sessionInfo: any;
  private salestableDAO: SalesTableDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private salesLineDAO: SalesLineDAO;
  private custtableDAO: CusttableDAO;
  private overDueDAO: OverDueDAO;
  private rawQuery: RawQuery;
  public seqNum: string;
  private inventbatchDAO: InventbatchDAO;
  private visitCustomerService: VisitCustomerService;
  private designerServiceDAO: DesignerserviceRepository;
  private appliedDiscountsDAO: AppliedDiscountsDAO;
  private inventlocationDAO: InventlocationDAO;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  private colorsDAO: ColorsDAO;
  private salesOrderTokensDAO: SalesOrderTokensDAO;
  private redeemService: RedeemService;

  constructor() {
    this.salesOrderTokensDAO = new SalesOrderTokensDAO();
    this.colorsDAO = new ColorsDAO();
    this.salestableDAO = new SalesTableDAO();
    this.salesLineDAO = new SalesLineDAO();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.rawQuery = new RawQuery();
    this.custtableDAO = new CusttableDAO();
    this.overDueDAO = new OverDueDAO();
    this.inventbatchDAO = new InventbatchDAO();
    this.visitCustomerService = new VisitCustomerService();
    this.designerServiceDAO = new DesignerserviceRepository();
    this.appliedDiscountsDAO = new AppliedDiscountsDAO();
    this.inventlocationDAO = new InventlocationDAO();
    this.visitCustomerService.sessionInfo = this.sessionInfo;
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
    this.updateInventoryService.sessionInfo = this.sessionInfo;
    this.redeemService = new RedeemService();
  }

  async entity(id: string, type: string = null) {
    try {
      let data: any = await this.salestableDAO.entity(id.toUpperCase());
      if (!data) {
        throw { message: "ORDER_NOT_FOUND" };
      }
      await this.calData(data);
      let promiseList: any[] = [
        this.getcustomer(data),
        this.getpainter(data),
        this.getsalesman(data),
        this.workflowstatus(data),
      ];
      let condition: any = await this.rawQuery.workflowconditions(this.sessionInfo.usergroupconfigid);
      await Promise.all(promiseList);
      data.custAccount = data.custAccount ? data.custAccount.trim() : null;
      data.customer = data.customer ? data.customer : {};
      data.painter = data.painter ? data.painter : {};
      data.instantDiscChecked = data.instantDiscChecked ? data.instantDiscChecked : false;
      data.voucherDiscChecked = data.voucherDiscChecked ? data.voucherDiscChecked : false;
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      data.deleted = data.deleted ? data.deleted : false;
      data.designServiceRedeemAmount = data.designServiceRedeemAmount ? parseFloat(data.designServiceRedeemAmount) : 0;
      let sabicCustomers = this.sessionInfo.sabiccustomers
        ? this.sessionInfo.sabiccustomers
            .trim()
            .split(",")
            .map((d: any) => `'${d}'`)
            .join(",")
        : [];
      if (data.transkind == "RETURNORDER") {
        if (condition.approvalRequired) {
          if (data.designServiceRedeemAmount > 0) {
            data.sendForApproval = true;
          } else if (
            [1, 2].includes(data.customer.custtype) &&
            (condition.rmApprovalRequired || condition.raApprovalRequired)
          ) {
            data.sendForApproval = true;
          } else {
            data.sendForApproval = false;
          }
        } else {
          data.sendForApproval = true;
        }
      } else if (data.transkind == "INVENTORYMOVEMENT") {
        if (data.movementType && data.movementType.id == 10) {
          data.sendForApproval = false;
        } else {
          data.sendForApproval = true;
        }
      } else if (data.transkind == "SALESORDER" && sabicCustomers.includes(data.custAccount)) {
        data.sendForApproval = true;
      } else {
        data.sendForApproval = true;
      }
      data.deleted = data.deleted ? data.deleted : false;
      data.isCash = data.isCash ? data.isCash : false;
      data.vatamount = data.vatamount ? parseFloat(data.vatamount) : 0;
      data.movementType = data.movementType ? data.movementType : {};
      let salesLine: any = data.salesLine;
      await this.allocateSalesLineData(salesLine);
      salesLine.sort(function (a: any, b: any) {
        var lineA = a.lineNum,
          lineB = b.lineNum;
        if (lineA < lineB)
          //sort string ascending
          return -1;
        if (lineA > lineB) return 1;
        return 0; //default return value (no sorting)
      });
      for (let item of salesLine) {
        item.product = item.size ? item.size.product : {};
        item.size = item.size ? item.size : {};
        delete item.size.product;
        if (
          (data.transkind == "TRANSFERORDER" && data.custAccount == this.sessionInfo.inventlocationid) ||
          (data.transkind == "SALESORDER" && data.status == "SAVED") ||
          (data.transkind == "ORDERSHIPMENT" &&
            data.status != "POSTED" &&
            data.inventLocationId == this.sessionInfo.inventlocationid)
        ) {
          await this.inventoryOnHandCheck(item, data.transkind, data.custAccount);
        }
      }
      let baseSizeBatchesList: any = await this.rawQuery.getBaseSizeBatchesList(id);
      if (data.transkind == "SALESORDER" || data.transkind == "TRANSFERORDER") {
        salesLine.map((item: any) => {
          item.batches = baseSizeBatchesList.filter(
            (v: any) =>
              v.itemid == item.itemid &&
              v.configid == item.configId &&
              v.inventsizeid == item.inventsizeid &&
              v.saleslineid == item.id
          );
        });
      }
      if (type == "mobile") {
        delete data.salesLine;
        data.selectedItems = salesLine;
      } else {
        delete data.salesLine;
        data.salesLine = salesLine;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getcustomer(data: any) {
    data.customer = await this.custtableDAO.entity(data.custAccount);
  }
  async getpainter(data: any) {
    data.painter = await this.custtableDAO.entity(data.painter);
  }
  async getsalesman(data: any) {
    data.salesman = await this.rawQuery.salesman(data.salesmanId);
  }
  async workflowstatus(data: any) {
    if (data.status != "PAID" && data.status != "POSTED") {
      data = data ? data : {};
      let workFlowStatus = await this.rawQuery.workflowstatus(data.salesId);
      data.status = workFlowStatus ? workFlowStatus.status : data.status;
    }
  }

  async ecommerceEntity(id: string, type: string = null) {
    try {
      let data: any = await this.salestableDAO.entity(id.toUpperCase());
      if (!data) {
        throw { message: "ORDER_NOT_FOUND" };
      }
      await this.calData(data);
      let tokenData: SalesOrderTokens = await this.rawQuery.getSalesToken(id.toUpperCase());
      data.paymentStatus = data.status == "PAID" || data.status == "POSTED" ? true : false;
      data.custAccount = data.custAccount ? data.custAccount.trim() : null;
      // data.customer = await this.custtableDAO.entity(data.custAccount);
      data.customer = data.customer ? data.customer : {};
      data.painter = data.painter ? data.painter : {};
      data.instantDiscChecked = data.instantDiscChecked ? data.instantDiscChecked : false;
      data.voucherDiscChecked = data.voucherDiscChecked ? data.voucherDiscChecked : false;
      data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
      data.deleted = data.deleted ? data.deleted : false;
      data.designServiceRedeemAmount = data.designServiceRedeemAmount ? parseFloat(data.designServiceRedeemAmount) : 0;
      data.isMovementIn = data.isMovementIn ? data.isMovementIn : false;
      data.deleted = data.deleted ? data.deleted : false;
      data.isCash = data.isCash ? data.isCash : false;
      data.vatamount = data.vatamount ? parseFloat(data.vatamount) : 0;
      data.movementType = data.movementType ? data.movementType : {};
      data.authToken = tokenData.authToken;
      let salesLine: any = data.salesLine;
      await this.allocateSalesLineData(salesLine);
      salesLine.sort(function (a: any, b: any) {
        var lineA = a.lineNum,
          lineB = b.lineNum;
        if (lineA < lineB)
          //sort string ascending
          return -1;
        if (lineA > lineB) return 1;
        return 0; //default return value (no sorting)
      });
      for (let item of salesLine) {
        item.product = item.size ? item.size.product : {};
        item.size = item.size ? item.size : {};
        delete item.size.product;
      }
      delete data.salesLine;
      salesLine.map((v: any) => {
        this.calItem(v);
      });
      data.salesLine = salesLine;

      return data;
    } catch (error) {
      throw error;
    }
  }

  allocateSalesLineData(salesLine: any) {
    salesLine.map((v: any) => {
      v.lineNum = v.lineNum ? parseInt(v.lineNum) : 0;
      v.salesprice = v.salesprice ? parseFloat(v.salesprice) : 0;
      v.salesQty = v.salesQty ? parseInt(v.salesQty) : 0;
      v.lineAmount = v.lineAmount ? parseFloat(v.lineAmount) : 0;
      v.salesUnit = v.salesUnit ? parseFloat(v.salesUnit) : 0;
      v.netAmount = v.netAmount ? parseFloat(v.netAmount) : 0;
      v.qtyOrdered = v.qtyOrdered ? parseFloat(v.qtyOrdered) : 0;
      v.remainSalesPhysical = v.remainSalesPhysical ? parseFloat(v.remainSalesPhysical) : 0;
      v.remainSalesFinancial = v.remainSalesFinancial ? parseFloat(v.remainSalesFinancial) : 0;
      v.lineTotalDisc = v.lineTotalDisc ? parseFloat(v.lineTotalDisc) : 0;
      v.supplMultipleQty = v.supplMultipleQty ? parseFloat(v.supplMultipleQty) : 0;
      v.supplFreeQty = v.supplFreeQty ? parseFloat(v.supplFreeQty) : 0;
      v.multilndisc = v.multilndisc ? parseFloat(v.multilndisc) : 0;
      v.multilnPercent = v.multilnPercent ? parseFloat(v.multilnPercent) : 0;
      v.endDisc = v.endDisc ? parseFloat(v.endDisc) : 0;
      v.enddiscamt = v.enddiscamt ? parseFloat(v.enddiscamt) : 0;
      v.colorantprice = v.colorantprice ? parseFloat(v.colorantprice) : 0;
      v.totalReturnedQuantity = v.totalReturnedQuantity ? parseFloat(v.totalReturnedQuantity) : 0;
      v.totalSettledAmount = v.totalSettledAmount ? parseFloat(v.totalSettledAmount) : 0;
      v.vatamount = v.vatamount ? parseFloat(v.vatamount) : 0;
      v.vat = v.vat ? parseFloat(v.vat) : 0;
      v.voucherdiscamt = v.voucherdiscamt ? parseFloat(v.voucherdiscamt) : 0;
      v.voucherdiscpercent = v.voucherdiscpercent ? parseFloat(v.voucherdiscpercent) : 0;
      if (v.batch) {
        v.batch.map((j: any) => {
          j.quantity = parseInt(j.quantity);
        });
      }
      v.appliedDiscounts = v.appliedDiscounts ? v.appliedDiscounts : [];
      v.appliedDiscounts.map((value: any) => {
        value.percentage = value.percentage ? parseFloat(value.percentage) : 0;
        value.discountAmount = value.discountAmount ? parseFloat(value.discountAmount) : 0;
      });
    });
  }

  async designerServiceEntity(id: string) {
    let data: any = await this.salestableDAO.entity(id.toUpperCase());
    if (!data) {
      throw { message: "ORDER_NOT_FOUND" };
    }
    await this.calData(data);
    await this.workflowstatus(data);
    let salesLine = await this.salesLineDAO.getDesignerServiceLines(id);
    for (let item of salesLine) {
      await this.calItem(item);
    }
    data.salesLine = salesLine;
    return data;
  }

  async inventoryOnHandCheck(item: any, transkind: string, custAccount: string) {
    let inventory = await this.rawQuery.inventoryOnHand({
      inventlocationid:
        custAccount == this.sessionInfo.inventlocationid ? custAccount : this.sessionInfo.inventlocationid,
      itemId: item.itemid,
      configid: item.color ? item.color.code : null,
      inventsizeid: item.size.code,
    });
    let availabilty: number = 0;
    inventory.forEach((element: any) => {
      availabilty += parseInt(element.availabilty);
    });
    //console.log("--------------------------------------------", availabilty);
    if (availabilty > 0) {
      // item.batches = inventory;
      //console.log("--------------------------------------------", transkind, item.status);
      if (parseInt(item.salesQty) > availabilty && transkind == "SALESORDER") {
        item.availableQuantity = availabilty;
        item.adjustedquantity = item.salesQty - availabilty;
      } else if (parseInt(item.salesQty) > availabilty && transkind == "TRANSFERORDER") {
        if (item.status == "REQUESTED") {
          item.requestedQuantity = item.salesQty;
          item.availableQuantity = availabilty;
        } else if (item.status == "APPROVED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
        } else if (item.status == "SHIPPED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
          item.shippedQuantity = item.remainSalesPhysical;
        } else if (item.status == "RECEIVED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
          item.shippedQuantity = item.remainSalesPhysical;
          item.receivedQuantity = item.remainSalesFinancial;
        } else {
          item.requestedQuantity = item.salesQty;
        }
      } else {
        if (transkind == "TRANSFERORDER" && (item.status == "REQUESTED" || item.status == null)) {
          item.requestedQuantity = item.salesQty;
          item.availableQuantity = availabilty;
        } else {
          item.availableQuantity = availabilty;
          item.adjustedquantity = 0;
        }
      }
    } else {
      if (transkind == "TRANSFERORDER") {
        if (item.status == "REQUESTED" || item.status == null) {
          item.requestedQuantity = item.salesQty;
          item.availableQuantity = availabilty;
          //console.log("--------------------------------------------", availabilty);
        } else if (item.status == "APPROVED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
        } else if (item.status == "SHIPPED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
          item.shippedQuantity = item.remainSalesPhysical;
        } else if (item.status == "RECEIVED") {
          item.requestedQuantity = item.salesQty;
          item.approvedQuantity = item.qtyOrdered;
          item.shippedQuantity = item.remainSalesPhysical;
          item.receivedQuantity = item.remainSalesFinancial;
        } else {
          item.requestedQuantity = item.salesQty;
        }
      } else {
        item.availableQuantity = 0;
        item.adjustedquantity = item.salesQty;
      }
    }
    return await item;
  }

  async search(reqData: any) {
    //console.log(reqData);
    try {
      switch (reqData.type) {
        case "quotation":
          reqData.transkind = `('SALESQUOTATION')`;
          break;
        case "movement":
          reqData.transkind = `('INVENTORYMOVEMENT')`;
          break;
        case "salesorder":
          reqData.transkind = `('SALESORDER')`;
          break;
        case "returnorder":
          reqData.transkind = `('RETURNORDER')`;
          break;
        case "transferorder":
          reqData.transkind = `('TRANSFERORDER', 'ORDERSHIPMENT', 'ORDERRECEIVE')`;
          break;
        case "ordershipment":
          reqData.transkind = `('ORDERSHIPMENT')`;
          break;
        case "orderrecieve":
          reqData.transkind = `('ORDERRECEIVE')`;
          break;
        case "purchaseorder":
          reqData.transkind = `('PURCHASEORDER', 'PURCHASERETURN')`;
          break;
        case "purchaseorderreturn":
          reqData.transkind = `('PURCHASERETURN')`;
          break;
        default:
          reqData.transkind = null;
      }
      let data: any = reqData.transkind
        ? await this.salestableDAO.searchorders(reqData, this.sessionInfo.inventlocationid)
        : await this.salestableDAO.search(reqData, null);

      let newData: any = [];
      data.forEach((item: any) => {
        if (item.transkind == "ORDERSHIPMENT" || item.transkind == "TRANSFERORDER") {
          let fromWarehouseEn = item.toWarehouseEn;
          let fromWarehouseAr = item.toWarehouseAr;
          let toWarehouseAr = item.fromWarehouseAr;
          let toWarehouseEn = item.fromWarehouseEn;
          item.toWarehouseId = item.custAccount;
          item.fromWarehouseId = item.inventLocationId;
          item.fromWarehouseEn = fromWarehouseEn;
          item.fromWarehouseAr = fromWarehouseAr;
          item.toWarehouseAr = toWarehouseAr;
          item.toWarehouseEn = toWarehouseEn;
        }
        if (item.transkind == "ORDERSHIPMENT") {
          if (item.inSalesid != null && item.slSalesId != null) {
            if (item.custAccount == this.sessionInfo.inventlocationid && item.status == "POSTED") {
              newData.push(item);
            } else if (item.inventLocationId == this.sessionInfo.inventlocationid) {
              newData.push(item);
            } else if (item.jazeeraWarehouse == this.sessionInfo.inventlocationid) {
              newData.push(item);
            }
          } else if (item.transkind == "TRANSFERORDER") {
            if (item.slSalesId != null) {
              if (
                item.custAccount == this.sessionInfo.inventlocationid &&
                item.status != "CREATED" &&
                item.status != "SAVED"
              ) {
                newData.push(item);
              } else if (item.inventLocationId == this.sessionInfo.inventlocationid) {
                newData.push(item);
              } else if (item.jazeeraWarehouse == this.sessionInfo.inventlocationid) {
                newData.push(item);
              }
            }
          }
        } else if (item.transkind == "PURCHASEORDER" || item.transkind == "PURCHASERETURN") {
          console.log("=================", item);
          if (item.jazeeraWarehouse == this.sessionInfo.inventlocationid && item.status == "POSTED") {
            newData.push(item);
          } else if (item.inventLocationId == this.sessionInfo.inventlocationid) {
            newData.push(item);
          }
        } else {
          if (
            item.custAccount == this.sessionInfo.inventlocationid &&
            item.status != "CREATED" &&
            item.status != "SAVED"
          ) {
            newData.push(item);
          } else if (item.inventLocationId == this.sessionInfo.inventlocationid) {
            newData.push(item);
          } else if (item.jazeeraWarehouse == this.sessionInfo.inventlocationid) {
            newData.push(item);
          }
        }
      });
      return newData;
    } catch (error) {
      throw error;
    }
  }

  async paginate(reqData: any) {
    console.log(reqData);
    try {
      switch (reqData.type) {
        case "quotation":
          reqData.transkind = `('SALESQUOTATION')`;
          break;
        case "movement":
          reqData.transkind = `('INVENTORYMOVEMENT')`;
          break;
        case "salesorder":
          reqData.transkind = `('SALESORDER')`;
          break;
        case "returnorder":
          reqData.transkind = `('RETURNORDER')`;
          break;
        case "transferorder":
          reqData.transkind = `('TRANSFERORDER', 'ORDERSHIPMENT', 'ORDERRECEIVE')`;
          break;
        case "ordershipment":
          reqData.transkind = `('ORDERSHIPMENT')`;
          break;
        case "orderreceive":
          reqData.transkind = `('ORDERRECEIVE')`;
          break;
        case "purchaseorder":
          reqData.transkind = `('PURCHASEORDER')`;
          break;
        case "designerservice":
          reqData.transkind = `('DESIGNERSERVICE')`;
          break;
        case "designerservicereturn":
          reqData.transkind = `('DESIGNERSERVICERETURN')`;
          break;
      }
      let data: any = await this.salestableDAO.pagination(reqData, this.sessionInfo.inventlocationid);
      // data.map((v: any) => {});
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: any) {
    //console.log("save", reqData.transkind);
    try {
      if (reqData.salesLine && reqData.salesLine.length > 0) {
        switch (reqData.transkind) {
          case "SALESQUOTATION":
            return await this.saveQuotation(reqData);
            break;
          case "SALESORDER":
            return await this.saveSalesOrder(reqData);
            break;
          case "RESERVED":
            return await this.saveSalesOrder(reqData);
            break;
          case "RETURNORDER":
            return await this.saveReturnOrder(reqData);
            break;
          case "DESIGNERSERVICERETURN":
            return await this.saveReturnOrder(reqData);
            break;
          case "INVENTORYMOVEMENT":
            return await this.saveInventoryMovementOrder(reqData);
            break;
          case "TRANSFERORDER":
            return await this.saveQuotation(reqData);
            break;
          case "ORDERSHIPMENT":
            if (reqData.interCompanyOriginalSalesId && reqData.interCompanyOriginalSalesId != "") {
              return await this.saveOrderShipment(reqData);
            } else {
              throw { message: "INVOICE_ID_REQUIRED" };
            }
            break;
          case "ORDERRECEIVE":
            if (reqData.interCompanyOriginalSalesId && reqData.interCompanyOriginalSalesId != "") {
              return await this.saveOrderReceive(reqData);
            } else {
              throw { message: "INVOICE_ID_REQUIRED" };
            }
            break;
          case "PURCHASEREQUEST":
            return await this.saveQuotation(reqData);
            break;
          case "PURCHASEORDER":
            let custAccount = await this.rawQuery.get_vedor_related_custaccount(reqData.custAccount);
            //console.log(custAccount);
            if (custAccount) {
              return await this.saveQuotation(reqData);
              break;
            } else {
              throw { message: "NO_VENDOR_FOR_CUSTOMER" };
            }

          case "PURCHASERETURN":
            return await this.saveReturnOrder(reqData);
            break;
          case "DESIGNERSERVICE":
            if (reqData.status == "PAID") {
              if (reqData.mobileNo && reqData.mobileNo != "" && reqData.mobileNo.length > 8) {
                return await this.saveQuotation(reqData);
                break;
              } else {
                throw { message: "PLEASE_ENTER_MOBILE_NUMBER" };
              }
            } else {
              return await this.saveQuotation(reqData);
              break;
            }

          default:
            throw { message: "TRANSKIND_REQUIRED" };
        }
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async validate(item: any) {
    let oldItem: any = null;
    if (!item.salesId || item.salesId == "" || item.salesId == "0") {
      item.salesId = null;
    } else {
      if (item.transkind == "SALESORDER") {
        let statusData: any = await this.rawQuery.checkSalesStatus(item.salesId);
        if (statusData.status == "PAID" || statusData.status == "POSTED") {
          return "ALREADY_PAID";
        }
      }
    }
    if (!item.salesId) {
      item.dataareaid = this.sessionInfo.dataareaid;
      item.deleted = false;
      item.inventLocationId = item.inventLocationId ? item.inventLocationId : this.sessionInfo.inventlocationid;
      item.warehouse = { inventLocationId: item.inventLocationId };
      item.createdby = this.sessionInfo.userName;
      item.createddatetime = new Date(App.DateNow());
      item.countryCode = item.countryCode ? item.countryCode : 966;
      let uid = await this.getSalesid(item.transkind);
      item.salesId = uid;
    }
    item.lastModifiedBy = this.sessionInfo.userName;
    item.lastModifiedDate = new Date(App.DateNow());
    if (item.cardAmount) {
    }
    if (item.cashAmount == "" || item.cashAmount == null) {
      item.cashAmount = 0;
    }
    if (item.designServiceRedeemAmount == "" || item.designServiceRedeemAmount == null) {
      item.designServiceRedeemAmount = 0;
    }
    if (item.cardAmount == "" || item.cardAmount == null) {
      item.cardAmount = 0;
    }

    if (item.shippingAmount == "" || item.shippingAmount == null) {
      item.shippingAmount = 0;
    }

    if (item.redeemAmount == "" || item.redeemAmount == null) {
      item.redeemAmount = 0;
    }

    console.log(item.lastModifiedDate.toISOString());
    return true;
  }

  async getSalesid(type: string) {
    try {
      //console.log("save", type);
      let usergroupconfig = await this.usergroupconfigDAO.findOne({
        groupid: this.sessionInfo.groupid,
      });
      let data: any;

      switch (type) {
        case "SALESQUOTATION":
          this.seqNum = usergroupconfig.quotationsequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "SALESORDER":
          this.seqNum = usergroupconfig.salesordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "RESERVED":
          this.seqNum = usergroupconfig.salesordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "DESIGNERSERVICE":
          this.seqNum = usergroupconfig.salesordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "RETURNORDER":
          this.seqNum = usergroupconfig.returnordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "DESIGNERSERVICERETURN":
          this.seqNum = usergroupconfig.returnordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "INVENTORYMOVEMENT":
          this.seqNum = usergroupconfig.movementsequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "TRANSFERORDER":
          this.seqNum = usergroupconfig.transferordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "ORDERSHIPMENT":
          this.seqNum = usergroupconfig.ordershipmentsequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "ORDERRECEIVE":
          this.seqNum = usergroupconfig.orderreceivesequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "PURCHASEREQUEST":
          this.seqNum = usergroupconfig.purchaserequestsequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "PURCHASEORDER":
          this.seqNum = usergroupconfig.purchaseordersequencegroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        case "PURCHASERETURN":
          this.seqNum = usergroupconfig.purchaseReturnSequenceGroup;
          data = await this.rawQuery.getNumberSequence(this.seqNum);
          break;
        default:
          throw { message: "TRANSKIND_REQUIRED" };
      }
      //console.log(data);
      if (data && data.format) {
        let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
        let date: any = new Date(data.lastmodifieddate).toLocaleString();
        console.log(date);
        console.log(data);
        let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
        let year: string = new Date(App.DateNow()).getFullYear().toString().substr(2, 2);

        data.nextrec = prevYear == year ? data.nextrec : "000001";

        let salesId: string = data.format.replace(hashString, year) + "-" + data.nextrec;
        //console.log(salesId);
        await this.rawQuery.updateNumberSequence(this.seqNum, data.nextrec);
        return salesId;
      } else {
        throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
      }
    } catch (error) {
      if (error == {}) {
        error = { message: "SERVER_SIDE_ERROR" };
      }
      throw error;
    }
  }

  async onlineInvoicePaymentService(data: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let statusData: any = await this.rawQuery.checkSalesStatus(data.orderId);
      if (statusData.status == "PAID" || statusData.status == "POSTED") {
        throw "ALREADY_PAID";
      }
      let salesData: any = await this.salestableDAO.entity(data.orderId);
      let reqData = { ...salesData };
      reqData.status = "PAID";
      reqData.paymentType = "ONLINE";
      reqData.paymentStatus = true;
      for (let item of reqData.salesLine) {
        let batches: any[] = [];
        for (let v of item.batch) {
          let batch = {
            batchNo: v.batchNo,
            quantity: v.quantity,
          };
          batches.push(batch);
        }
        item.batches = batches;
      }
      // return reqData
      let returnData: any = { ...reqData };
      this.saveSalesOrderAfterOnlinePayment(reqData, queryRunner);
      return returnData;
    } catch (error) {
      throw { message: error };
    }
  }

  async convertToSalesOrder(data: any) {
    let salesData: any = await this.salestableDAO.entity(data.salesId);
    //console.log(salesData);
    let canConvert = true;
    let colors: any[] = [];
    let items: any[] = [];
    let sizes: any[] = [];
    salesData.salesLine.map((v: any) => {
      items.push(`${v.itemid}`), colors.push(v.configId), sizes.push(v.inventsizeid);
    });
    let itemsInStock = await this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items, colors, sizes);
    console.log("==========================", itemsInStock);
    let itemString = ``;
    salesData.salesLine.map((v: any) => {
      let index = itemsInStock.findIndex(
        (value: any) =>
          value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
          value.configid.toLowerCase() == v.configId.toLowerCase() &&
          value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase()
      );
      if (index >= 0) {
        if (parseInt(v.salesQty) > parseInt(itemsInStock[index].qty)) {
          canConvert = canConvert == true ? false : false;
          itemString += `${v.itemid},`;
        }
      } else {
        canConvert = canConvert == true ? false : false;
        itemString += `${v.itemid},`;
      }
    });
    console.log(canConvert);
    if (canConvert) {
      salesData.status = "CONVERTED";
      await this.salestableDAO.save(salesData);
      salesData.interCompanyOriginalSalesId = salesData.salesId;
      delete salesData.salesId;
      let reqData = { ...salesData };
      this.rawQuery.sessionInfo = this.sessionInfo;
      let customer = await this.rawQuery.getCustomer(reqData.custAccount);
      reqData.payment = customer.paymtermid;
      reqData.transkind = "SALESORDER";
      reqData.status = "CREATED";
      reqData.message = "CONVERTED";
      reqData.inventLocationId = this.sessionInfo.inventlocationid;
      reqData.salesLine = salesData.salesLine;
      data = await this.save(reqData);
      data.status = "CONVERTED";
      return data;
    } else {
      throw {
        message: `CANNOT_CONVERT_TO_SALESORDER`,
      };
    }
  }

  async convertToPurchaseOrder(data: any) {
    let salesData: any = await this.salestableDAO.entity(data.salesId);
    //console.log(salesData);
    salesData.status = "CONVERTED";
    await this.salestableDAO.save(salesData);
    salesData.interCompanyOriginalSalesId = salesData.salesId;
    delete salesData.salesId;
    let reqData = { ...salesData };
    reqData.transkind = "PURCHASEORDER";
    reqData.message = "CONVERTED";
    reqData.status = "CREATED";
    reqData.warehouse.inventLocationId = await this.sessionInfo.inventlocationid;
    delete reqData.warehouse;
    reqData.salesLine = salesData.salesLine;
    data = await this.save(reqData);
    data.status = "CONVERTED";
    return data;
  }

  async convertPurchaseOrderToSalesOrder(data: any) {
    try {
      let salesData: any = await this.salestableDAO.entity(data.salesId);
      //console.log(salesData);
      salesData.status = "CONVERTED";

      let convertedData = await this.rawQuery.salesTableInterCompanyOriginalData(data.salesId);
      if (convertedData.length > 0) {
        throw { message: "ALREADY_CONVERTED", salesId: convertedData[0].salesid };
      } else {
        let canConvert = true;
        let colors: any[] = [];
        let items: any[] = [];
        let sizes: any[] = [];
        let itemString = ``;
        salesData.salesLine.map((v: any) => {
          items.push(v.itemid), colors.push(v.configId), sizes.push(v.inventsizeid);
        });
        // let itemsInStock = await this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items, colors, sizes);
        // salesData.salesLine.map((v: any) => {
        //   let index = itemsInStock.findIndex(
        //     (value: any) =>
        //       value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
        //       value.configid.toLowerCase() == v.configId.toLowerCase() &&
        //       value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase()
        //   );
        //   if (index >= 0) {
        //     if (parseInt(v.salesQty) > parseInt(itemsInStock[index].qty)) {
        //       canConvert = canConvert == true ? false : false;
        //       itemString += `${v.itemid},`;
        //     }
        //   } else {
        //     canConvert = canConvert == true ? false : false;
        //     itemString += `${v.itemid},`;
        //   }
        // });
        console.log(canConvert);
        // if (canConvert) {
        await this.salestableDAO.save(salesData);
        salesData.interCompanyOriginalSalesId = salesData.salesId;
        delete salesData.salesId;
        let reqData = { ...salesData };
        reqData.transkind = "SALESORDER";
        reqData.status = "CREATED";
        reqData.inventLocationId = salesData.jazeeraWarehouse;
        reqData.warehouse.inventLocationId = salesData.jazeeraWarehouse;
        this.rawQuery.sessionInfo = this.sessionInfo;
        let custAccount = await this.rawQuery.getCustomer(salesData.invoiceAccount);
        //console.log(custAccount);
        if (custAccount) {
          let customer = custAccount;
          reqData.custAccount = custAccount.accountnum;
          reqData.salesName = custAccount.name;
          reqData.salesLine = salesData.salesLine;
          reqData.payment = customer.paymtermid;
          reqData.salesmanId = customer.salesmanid;
          data = await this.save(reqData);
          console.log(reqData);
          data.message = "CONVERTED";
          return data;
        } else {
          throw { message: "NO_VENDOR_FOR_CUSTOMER" };
        }
        // } else {
        //   throw {
        //     message: `CANNOT_CONVERT_TO_SALESORDER`,
        //   };
        // }
      }
    } catch (error) {
      throw { message: error };
    }
  }

  async convertPurchaseReturnToReturnOrder(data: any) {
    try {
      let purchaseReturnData: any = await this.salestableDAO.entity(data.salesId);
      //console.log(purchaseReturnData);
      purchaseReturnData.status = "CONVERTED";
      await this.salestableDAO.save(purchaseReturnData);
      let purchaseOrderData = await this.rawQuery.salesTableData(purchaseReturnData.interCompanyOriginalSalesId);
      //console.log(purchaseOrderData);
      purchaseOrderData = purchaseOrderData.length > 0 ? purchaseOrderData[0] : {};
      if (purchaseOrderData == {}) {
        throw { message: "TECHNICAL_ISSUE,_PLEASE_CONTACT_YOUR_TECHNICAL_TEAM" };
      } else {
        let salesOrderData = await this.rawQuery.salesTableInterCompanyOriginalData(
          purchaseOrderData.salesid,
          "SALESORDER"
        );
        salesOrderData = salesOrderData.length > 0 ? salesOrderData[0] : {};
        purchaseReturnData.interCompanyOriginalSalesId = salesOrderData.salesid;
        let batches: any = await this.inventTransDAO.findAll({
          invoiceid: purchaseReturnData.salesId,
        });
        for (let batch of batches) {
          delete batch.id;
          batch.returnQuantity = Math.abs(batch.qty);
          batch.transrefid = purchaseReturnData.interCompanyOriginalSalesId;
        }
        delete purchaseReturnData.salesId;
        let reqData: any = { ...purchaseReturnData };
        reqData.transkind = "RETURNORDER";
        reqData.message = "CONVERTED";
        reqData.status = "SAVED";
        let salesLine = purchaseReturnData.salesLine;

        //console.log(batches);
        for (let item of salesLine) {
          //console.log(item);
          let batch = batches.filter(
            (v: any) => v.itemid == item.itemid && v.inventsizeid == item.inventsizeid && v.configid == item.configId
          );
          //console.log(batch);
          item.batches = batch;
        }
        reqData.inventLocationId = purchaseReturnData.jazeeraWarehouse;
        reqData.warehouse.inventLocationId = purchaseReturnData.jazeeraWarehouse;
        let custAccount = await this.rawQuery.get_vedor_related_custaccount(purchaseReturnData.custAccount);
        //console.log(custAccount);
        reqData.custAccount = custAccount;
        reqData.salesLine = salesLine;
        data.status = "CONVERTED";
        return data;
      }
    } catch (error) {
      throw { message: error };
    }
  }

  async updateinventtransstatus(id: any, status: string = null, queryRunner = null) {
    if (!queryRunner) {
      queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    try {
      let salesData: any = await this.salestableDAO.entity(id);
      //console.log(salesData);
      salesData.status = !status ? "SAVED" : status;
      this.salestableDAO.save(salesData);
      let batches: any = await this.inventTransDAO.findAll({ invoiceid: id });
      for (let item of batches) {
        item.reserveStatus = "UNRESERVED";
        item.transactionClosed = false;
        item.dateinvent = new Date(App.DateNow());
        await this.updateInventoryService.updateInventtransTable(item, false, true, queryRunner);
      }
      let returnData = {
        id: id,
        message: "UNRESERVED",
        status: salesData.status,
      };
      //console.log(returnData);
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async saveQuotation(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let salesLine: any = reqData.salesLine;
      delete reqData.salesLine;
      let cond = await this.validate(reqData);
      if (cond == true) {
        reqData.payment = reqData.transkind == "DESIGNERSERVICE" ? "CASH" : false;
        reqData.status =
          reqData.status == "CREATED" || reqData.status == "" || reqData.status == null ? "SAVED" : reqData.status;
        reqData.salesType = reqData.transkind == "TRANSFERORDER" ? 1 : null;
        reqData.inventLocationId = this.sessionInfo.inventlocationid;
        // let salesTable = await this.salestableDAO.save(reqData);
        let salesTable = await queryRunner.manager.getRepository(SalesTable).save(reqData);
        let promiseList: any[] = [];
        promiseList.push(this.salesLineDelete(reqData, queryRunner));
        for (let item of salesLine) {
          item.id = uuid();
          item.salesId = reqData.salesId;
          item.createddatetime = new Date(App.DateNow());
          item.createdBy = this.sessionInfo.userName;
          item.numberSequenceGroupId = this.seqNum;
          item.lastModifiedDate = new Date(App.DateNow());
          promiseList.push(this.salesLineDAO.save(item));
          item.jazeeraWarehouse = reqData.jazeeraWarehouse;
          item.inventLocationId = this.sessionInfo.inventlocationid;
        }

        if (reqData.status == "PAID") {
          if (reqData.transkind == "DESIGNERSERVICE") {
            let designerServiceData: any = {
              custphone: reqData.mobileNo,
              amount: reqData.netAmount,
              invoiceid: reqData.salesId,
              dataareaid: this.sessionInfo.dataareaid,
              recordtype: 0,
              settle: 0,
              selectedforsettle: 0,
              approvalstatus: reqData.approvalstatus,
              createdby: this.sessionInfo.userName,
              createddatetime: new Date(App.DateNow()),
              lastmodifiedby: this.sessionInfo.userName,
              lastmodifieddate: new Date(App.DateNow()),
              customer: {
                accountnum: reqData.custAccount,
              },
            };
            // promiseList.push(this.designerServiceDAO.save(designerServiceData));
            promiseList.push(queryRunner.manager.getRepository(Designerservice).save(designerServiceData));
          }
        }
        await Promise.all(promiseList);
        await queryRunner.commitTransaction();
        let returnData = {
          id: salesTable.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
        };
        //console.log(returnData);
        return returnData;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async stockOnHandCheck(saleslineArray: any, reqData: any) {
    if (reqData.status == "PAID") {
      reqData.invoiceDate = new Date(App.DateNow());
      let canConvert: boolean = true;
      let colors: any[] = [];
      let items: any[] = [];
      let sizes: any[] = [];
      let itemString = ``;
      let groupSalesLines: any = this.groupBy(saleslineArray, function (item: any) {
        return [item.itemid, item.configId, item.inventsizeid];
      });
      let newSalesline: any[] = [];
      groupSalesLines.forEach(function (groupitem: any) {
        const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.salesQty), 0);
        groupitem[0].salesqty = Math.abs(qty);
        newSalesline.push({ ...groupitem[0] });
      });
      newSalesline.map((v: any) => {
        if (v.itemid && v.configId && v.inventsizeid) {
          items.push(v.itemid), colors.push(v.configId), sizes.push(v.inventsizeid);
        } else {
          throw { message: `CANNOT_CREATE_SALESORDER` };
        }
      });
      let itemsInStock: any[] = await this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items, colors, sizes);
      newSalesline.map((v: any) => {
        let index = itemsInStock.findIndex(
          (value: any) =>
            value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
            value.configid.toLowerCase() == v.configId.toLowerCase() &&
            value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase()
        );
        if (index >= 0) {
          if (parseInt(v.salesqty) > parseInt(itemsInStock[index].qty)) {
            canConvert = canConvert == true ? false : false;
            itemString += `${v.itemid},`;
          }
        } else {
          canConvert = canConvert == true ? false : false;
          itemString += `${v.itemid},`;
        }
      });
      if (!canConvert) {
        throw { message: `SOME_OF_THE_ITEMS_ARE_OUT_OF_STOCK` };
      }
    }
  }

  async salesLineDelete(reqData: any, queryRunner: any) {
    let lineData: SalesLine[] = await this.salesLineDAO.findAll({
      salesId: reqData.salesId,
    });
    if (lineData) {
      // await this.salesLineDAO.delete(lineData);
      for (let i of lineData) {
        await queryRunner.manager.getRepository(SalesLine).delete(i.id);
      }
    }
  }

  async inventryTransUpdate(reqData: any, queryRunner) {
    let promiseList: any[] = [];
    let batches: Inventorytrans[] = await this.inventTransDAO.findAll({
      invoiceid: reqData.salesId,
    });
    for (let batch of batches) {
      if (batch.reserveStatus == "RESERVED") {
        promiseList.push(this.updateInventoryService.updateUnReserveQty(batch, queryRunner));
      }
    }
    for (let i of batches) {
      // promiseList.push(this.inventTransDAO.delete(batches));
      promiseList.push(queryRunner.manager.getRepository(Inventorytrans).delete(i.id));
    }

    return await Promise.all(promiseList);
  }

  async salesLineItemOrder(item: any, reqData: any, queryRunner) {
    // console.log("===========================================================");
    let promiseList: any[] = [];
    let batches: any[] = [];
    item.batch = [];
    if (item.salesQty > 0) {
      item.salesId = reqData.salesId;
      item.createddatetime = new Date(App.DateNow());
      item.createdBy = this.sessionInfo.userName;
      item.numberSequenceGroupId = this.seqNum;
      item.lastModifiedDate = new Date(App.DateNow());
      item.jazeeraWarehouse = reqData.jazeeraWarehouse;
      item.taxGroup = reqData.taxGroup;
      let taxItemGroup = await this.rawQuery.getItemTaxGroup(item.itemid);
      item.taxItemGroup = taxItemGroup.taxitemgroupid;
      item.lineAmount = parseFloat(item.salesprice) * parseFloat(item.salesQty);
      if (item.batches && item.batches.length > 0) {
        item.batches = item.batches.filter((v: any) => Math.abs(v.quantity) > 0);
        for (let batch of item.batches) {
          let availability = await this.rawQuery.getbatchavailability({
            inventlocationid: this.sessionInfo.inventlocationid,
            itemid: item.itemid,
            configid: item.configId,
            inventsizeid: item.inventsizeid,
            batchno: batch.batchNo,
          });
          if (availability <= 0 || availability < Math.abs(batch.qty)) {
            let fiofoBatches = await this.dofifo(item, reqData);
            batches = batches.concat(fiofoBatches);
          } else {
            batch.itemid = item.itemid;
            batch.transrefid = item.salesId;
            batch.invoiceid = item.salesId;
            batch.batchno = batch.batchNo;
            batch.configid = item.configId;
            batch.inventsizeid = item.inventsizeid;
            batch.custvendac = reqData.custAccount;
            batch.inventlocationid = this.sessionInfo.inventlocationid;
            batch.dataareaid = this.sessionInfo.dataareaid;
            batch.qty = -batch.quantity;
            batch.reserveStatus = reqData.status;
            batch.dataareaid = this.sessionInfo.dataareaid;
            batch.transactionClosed = reqData.status == "PAID" || reqData.status == "RESERVED" ? true : false;
            batch.salesLineId = item.id;
            batch.dateinvent = new Date(App.DateNow());
            batches.push(batch);
          }
        }
      } else {
        let fiofoBatches = await this.dofifo(item, reqData);
        batches = batches.concat(fiofoBatches);
      }
    }
    promiseList = [];
    for (let batch of batches) {
      item.batch.push({
        batchNo: batch.batchno,
        quantity: batch.quantity,
      });
      batch.salesLineId = item.id;
      this.updateInventoryService.sessionInfo = this.sessionInfo;
      await promiseList.push(this.updateInventoryService.updateInventtransTable(batch, true, true, queryRunner));
      await Promise.all(promiseList);
    }
  }

  async saveSalesOrderPaidPursase(reqData: any, condData: any, queryRunner) {
    let promiseList: any[] = [];
    let batches: any[] = [];
    await this.rawQuery.updateSalesTableWorkFlowStatus(reqData.interCompanyOriginalSalesId, "PAID");
    batches = await this.inventTransDAO.findAll({
      invoiceid: reqData.salesId,
    });
    for (let v of batches) {
      delete v.id;
      v.invoiceid = reqData.interCompanyOriginalSalesId;
      v.transrefid = reqData.salesId;
      v.qty = Math.abs(v.qty);
      v.dataareaid = this.sessionInfo.dataareaid;
      v.inventlocationid = condData.inventlocationid;
      this.updateInventoryService.sessionInfo = this.sessionInfo;
      promiseList.push(this.updateInventoryService.updateInventtransTable(v, true, true, queryRunner));
    }
    return await Promise.all(promiseList);
  }

  async saveSalesOrderUpdateVocharDiscount(reqData: any, queryRunner) {
    let promiseList: any[] = [];
    if (reqData.voucherDiscChecked) {
      let voucherData: any = {
        salesId: reqData.salesId,
        voucherNum: reqData.voucherNum,
        custAccount: reqData.custAccount,
      };
      let query = `
      UPDATE discountvoucher
      SET  salesid='${voucherData.salesId}',
      is_used=0, 
      used_numbers=used_numbers+1
      WHERE voucher_num='${voucherData.voucherNum}';
      `;
      // promiseList.push(this.rawQuery.updateVoucherDiscounts(voucherData));
      promiseList.push(queryRunner.query(query));
    }
    return await Promise.all(promiseList);
  }

  async saveSalesVisitorData(reqData: any, customerDetails: any, queryRunner) {
    let visitorData: VisitCustomer = new VisitCustomer();
    this.visitCustomerService.sessionInfo = this.sessionInfo;
    visitorData.visitorName = reqData.salesName;
    visitorData.purchased = "Yes";
    visitorData.visitorMobileNumber = reqData.mobileNo;
    visitorData.visitorType =
      Props.RCUSTTYPE[customerDetails.rcusttype] && Props.RCUSTTYPE[customerDetails.rcusttype][1]
        ? Props.RCUSTTYPE[customerDetails.rcusttype][1]
        : "Individual";
    await this.visitCustomerService.save(visitorData, queryRunner);
    // await queryRunner.manager.getRepository(VisitCustomer).save(visitorData);
  }

  async saveSalesOrderOverDue(reqData: any, userName: any, salesTable: any, queryRunner) {
    if (reqData.paymtermid) {
      const paymTerDays: any = await this.rawQuery.getPaymTermDays(reqData.paymtermid);
      if (paymTerDays.length > 0) {
        const days = paymTerDays[0].numofdays;
        const now = new Date(App.DateNow());
        let dueDate: any = new Date(App.DateNow());
        dueDate.setDate(dueDate.getDate() + days);
        //console.log(dueDate);
        const overDue = new Overdue();
        overDue.accountNum = reqData.custAccount;
        overDue.payment = 0;
        overDue.customerName = reqData.salesName;
        overDue.invoiceAmount = reqData.netAmount;
        overDue.invoicedate = now;
        overDue.duedate = dueDate;
        overDue.actualDueDate = dueDate;
        overDue.createddatetime = now;
        overDue.createdby = userName;
        overDue.salesId = salesTable.salesId;
        overDue.invoiceId = salesTable.salesId;
        overDue.lastmodifiedby = userName;
        overDue.lastModifiedDate = now;
        this.overDueDAO = new OverDueDAO();
        // const overDueSaved = await this.overDueDAO.createOverDue(overDue);
        const overDueSaved = await queryRunner.manager.getRepository(Overdue).save(overDue);
      }
    } else {
      throw "paytermid not found";
    }
  }

  async saveSalesOrderDesignerService(reqData: any, queryRunner) {
    let designerServiceData: any = {
      custphone: reqData.mobileNo,
      amount: -reqData.designServiceRedeemAmount,
      invoiceid: reqData.designServiceId,
      salesorderid: reqData.salesId,
      dataareaid: this.sessionInfo.dataareaid,
      recordtype: 0,
      settle: 0,
      selectedforsettle: 0,
      approvalstatus: reqData.approvalstatus,
      createdby: this.sessionInfo.userName,
      createddatetime: new Date(App.DateNow()),
      lastmodifiedby: this.sessionInfo.userName,
      lastmodifieddate: new Date(App.DateNow()),
      customer: {
        accountnum: reqData.designerServiceCustAccount,
      },
    };

    // await this.designerServiceDAO.save(designerServiceData);
    await queryRunner.manager.getRepository(Designerservice).save(designerServiceData);
  }
  async saveSalesOrderRedeem(reqData: any, queryRunner) {
    try {
      let redeemData = {
        TransactionId: reqData.salesId,
        MobileNo: reqData.mobileNo && reqData.mobileNo.length == 9 ? "0" + reqData.mobileNo : reqData.mobileNo,
        InvoiceNo: reqData.salesId,
        InvoiceAmount: reqData.netAmount,
        RedeemPoints: reqData.redeemPoints,
        SyncStatus: 0,
        InventLocationId: this.sessionInfo.inventlocationid,
        LoyaltyStatus: 0,
      };
      if (reqData.mobileNo && reqData.mobileNo != "") {
        await this.redeemService.Redeem(redeemData);
      }
    } catch (error) {
      console.error(error);
    }
  }
  async saveSalesOrder(reqData: any) {
    console.log("1----------------------------");
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let promiseList: any[] = [];
      let customerRecord: any;
      let salesLine: any = reqData.salesLine;
      let returnData: any;
      delete reqData.salesLine;
      let salestatus: any = await this.rawQuery.checkSalesStatus(reqData.salesId);
      if (reqData.status != "PAID") {
        reqData.voucherDiscChecked = false;
        reqData.voucherNum = null;
      }
      if (reqData.status == "PAID" || reqData.status == "RESERVED") {
        salesLine.map((v: any) => {
          if (v.batches && v.batches.length > 0) {
            const qty = v.batches.reduce((res: number, item: any) => res + parseInt(item.quantity), 0);
            console.log("qty", qty, v.salesQty);
            if (v.salesQty != qty) {
              throw {
                id: reqData.salesId,
                message: "selected line quantities and selected batches quantities are not matching",
              };
            }
          } else {
            throw {
              id: reqData.salesId,
              message: "selected line quantities and selected batches quantities are not matching",
            };
          }
        });
      }
      if (reqData.status == "PAID" && salestatus.status != "RESERVED") {
        let saleslineArray: any[] = [...salesLine];
        await this.stockOnHandCheck(saleslineArray, reqData);
      }
      console.log("2----------------------------");
      let cond: any = await this.validate(reqData);
      if (cond == "ALREADY_PAID") {
        returnData = {
          id: reqData.salesId,
          message: "ALREADY_PAID",
          status: reqData.status,
          url: reqData.url,
        };
        return returnData;
      } else if (cond == true) {
        !reqData.warehouse ? (reqData.warehouse = {}) : (reqData.warehouse = reqData.warehouse);
        reqData.warehouse.inventLocationId = this.sessionInfo.inventlocationid;
        reqData.url = reqData.onlineAmount > 0 ? Props.ECOMMERCE_PAYMENT_URL + reqData.salesId : null;
        reqData.paymentType = "OFFLINE";
        if (reqData.isCash) {
          reqData.payment = "CASH";
        }
        reqData.status = reqData.status == "CREATED" || reqData.status == "UNRESERVED" ? "SAVED" : reqData.status;
        // console.log(reqData.lastModifiedDate.toISOString());
        reqData.invoiceAccount =
          reqData.invoiceAccount || reqData.invoiceAccount != "" ? reqData.invoiceAccount : reqData.custAccount;
        this.rawQuery.sessionInfo = this.sessionInfo;
        customerRecord = await this.rawQuery.getCustomer(reqData.invoiceAccount);
        if (customerRecord.walkincustomer == true) {
          let customerTaxGroup = await this.rawQuery.getCustomer(this.sessionInfo.defaultcustomerid);
          reqData.taxGroup = customerTaxGroup.taxgroup;
        } else {
          reqData.taxGroup = customerRecord.taxgroup;
        }
        // let salesTable: any = await this.salestableDAO.save(reqData);
        reqData.netAmount = parseFloat(reqData.amount) - parseFloat(reqData.disc) + parseFloat(reqData.vatamount);
        let salesTable: any = await queryRunner.manager.getRepository(SalesTable).save(reqData);
        if (reqData.status == "SAVED" || reqData.status == "CONVERTED") {
          this.rawQuery.salesTableInventlocation(reqData.inventLocationId, reqData.salesId);
        }
        console.log("3----------------------------");
        promiseList = [];
        promiseList.push(this.salesLineDelete(reqData, queryRunner));
        promiseList.push(this.inventryTransUpdate(reqData, queryRunner));
        await Promise.all(promiseList);
        console.log("4----------------------------");
        promiseList = [];
        for (let item of salesLine) {
          item.id = reqData.paymentType == "ONLINE" ? item.id : uuid();
          item.salesId = reqData.salesId;
          await promiseList.push(this.salesLineItemOrder(item, reqData, queryRunner));
        }
        await Promise.all(promiseList);
        // let salesline: any = await this.salesLineDAO.save(salesLine);
        let salesline: any = await queryRunner.manager.getRepository(SalesLine).save(salesLine);

        promiseList = [];

        if (reqData.status == "PAID") {
          let condData: any = await this.rawQuery.salesTableData(reqData.interCompanyOriginalSalesId);
          condData = condData.length >= 0 ? condData[0] : {};
          //console.log(condData);
          promiseList.push(this.saveSalesOrderUpdateVocharDiscount(reqData, queryRunner));
          condData = condData ? condData : {};
          if (condData.transkind == "PURCHASEORDER") {
            promiseList.push(this.saveSalesOrderPaidPursase(reqData, condData, queryRunner));
          }
          let customerDetails = customerRecord ? customerRecord : {};
          if (reqData.mobileNo) {
            let pmobileno = async () => {
              let message = `  رضاؤكم هو هدفنا دهانات الجزيرة جودة وجمال قيمة مشترياتكم هي ${reqData.netAmount.toFixed(
                2
              )} `;
              let sms = new Sms();
              return sms.sendMessage("966", reqData.mobileNo, message);
            };
            promiseList.push(pmobileno());
          }
          //console.log(reqData);
          if (customerDetails.walkincustomer) {
            promiseList.push(this.saveSalesVisitorData(reqData, customerDetails, queryRunner));
          }

          const { userName } = this.sessionInfo;

          if ((reqData.paymtermid != "CASH" || reqData.payment != "CASH") && !reqData.isCash) {
            reqData.paymtermid = reqData.paymtermid ? reqData.paymtermid : reqData.payment;
            promiseList.push(this.saveSalesOrderOverDue(reqData, userName, salesTable, queryRunner));
          }
          // }
          if (reqData.designServiceRedeemAmount > 0) {
            promiseList.push(this.saveSalesOrderDesignerService(reqData, queryRunner));
          }
          promiseList.push(this.saveSalesOrderRedeem(reqData, queryRunner));
        }
        console.log("6---------------------------- " + reqData.paymentType + reqData.onlineAmount);

        if (reqData.onlineAmount > 0 && reqData.status != "PAID") {
          let ptokenData = async () => {
            let tokenData: SalesOrderTokens = {
              orderId: reqData.salesId,
              customerId: reqData.custAccount,
              email: reqData.custEmail,
              authToken: reqData.authToken,
              updatedBy: this.sessionInfo.userName,
              updatedOn: new Date(App.DateNow()),
            };
            return await this.saveSalesorderToken(tokenData, queryRunner);
          };
          promiseList.push(ptokenData());

          let pmessage = async () => {
            let message = ` Please click on the below link to complete payment of ${reqData.onlineAmount.toFixed(
              2
            )} SAR \n ${reqData.url} `;
            try {
              let sms = new Sms();
              return sms.sendMessage("966", reqData.mobileNo, message);
            } catch (error) {
              log.error(error);
            }
          };
          promiseList.push(pmessage());

          let pmail = async () => {
            try {
              salesTable.vatamount = salesTable.vatamount.toFixed(2);
              salesTable.lastModifiedDate = new Date(App.DateNow());
              for (let item of salesLine) {
                if (reqData.status != "PAID") {
                  if (item.lineTotalDisc != null || item.lineTotalDisc != undefined) {
                    item.lineTotalDisc = item.lineTotalDisc.toFixed(2);
                    item.unitPrice = item.lineAmount / item.salesQty;
                    if (item.colorantprice != null || item.colorantprice != undefined) {
                      item.productPrice = item.unitPrice + item.colorantprice;
                      item.productPrice = parseFloat(item.productPrice).toFixed(2);
                      item.price = item.lineAmount + item.colorantprice * item.salesQty;
                      item.priceVat =
                        item.lineAmount + item.colorantprice * item.salesQty - item.lineTotalDisc + item.vatamount;
                      item.price = parseFloat(item.price).toFixed(2);
                      item.priceVat = parseFloat(item.priceVat).toFixed(2);
                    }
                  }
                }
              }
              console.log("Payment Link");
              let template: string = reqData.lang == "en" ? "paymentgateway" : "paymentgateway-ar";
              salesTable.amount = salesTable.amount ? parseFloat(salesTable.amount) : 0;
              salesTable.vatamount = salesTable.vatamount ? parseFloat(salesTable.vatamount) : 0;
              salesTable.netAmount = salesTable.netAmount ? parseFloat(salesTable.netAmount) : 0;
              return await App.SendMail(reqData.custEmail, `Payment Link`, template, {
                link: reqData.url,
                amount: reqData.onlineAmount,
                customer: customerRecord,
                salesLine: salesLine,
                salesTable: salesTable,
              });
            } catch (error) {
              log.error(error);
            }
          };
          promiseList.push(pmail());
        }

        if (reqData.status == "PAID" && reqData.paymentType == "ONLINE") {
          let imail = async () => {
            let template: string = reqData.lang == "en" ? "email-invoice-en" : "email-invoice-ar";
            let reportData: any = await this.allocateInvoiceReportData(reqData, salesLine);
            try {
              console.log(reportData);
              return await App.SendMail(reqData.custEmail, `Invoice`, template, reportData);
            } catch (error) {
              log.error(error);
            }
          };
          promiseList.push(imail());
        }

        await Promise.all(promiseList);

        // throw { message: "error" };
        await queryRunner.commitTransaction();
        console.log("7----------------------------");
        reqData.salesLine = salesLine;
        returnData = {
          id: reqData.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
          url: reqData.url,
        };
        console.log(
          reqData.netAmount,
          "================================================================================================================="
        );
        return returnData;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async saveReturnOrder(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // reqData.interCompanyOriginalSalesId = reqData.interCompanyOriginalSalesId;
      console.log(reqData);
      let salesLine: any = reqData.salesLine;
      delete reqData.salesLine;
      let cond = await this.validate(reqData);
      if (cond == true) {
        if (reqData.transkind == "DESIGNERSERVICERETURN") {
          let PrevReturnedData: any = await this.salestableDAO.find({
            interCompanyOriginalSalesId: reqData.interCompanyOriginalSalesId,
          });
          if (PrevReturnedData) {
            throw { status: 0, message: "ALREADY_RETURNED" };
          } else {
            let desinerService: any = await this.designerServiceDAO.search({
              invoiceid: reqData.interCompanyOriginalSalesId,
            });
            console.log(desinerService);
            if (desinerService.length > 1) {
              throw { status: 0, message: "CAN_NOT_CREATE_RETURN_ORDER_AMOUNT_ALREADY_USED" };
            }
          }
          let designerServiceData = await this.designerServiceDAO.findOne({
            invoiceid: reqData.interCompanyOriginalSalesId,
          });
          delete designerServiceData.serviceid;
          designerServiceData.amount = -designerServiceData.amount;
          designerServiceData.salesorderid = reqData.salesId;
          // await this.designerServiceDAO.save(designerServiceData);
          queryRunner.manager.getRepository(Designerservice).save(designerServiceData);
        }
        let promiseList: any[] = [];
        // promiseList.push(this.salestableDAO.save(reqData));
        console.log(
          reqData,
          "=============================================================================================="
        );
        promiseList.push(queryRunner.manager.getRepository(SalesTable).save(reqData));
        promiseList.push(this.salesLineDelete(reqData, queryRunner));
        for (let item of salesLine) {
          item.batch = [];
          if (item.salesQty > 0) {
            delete item.id;
            item.id = uuid();
            item.salesId = reqData.salesId;
            item.createddatetime = new Date(App.DateNow());
            item.createdBy = this.sessionInfo.userName;
            item.numberSequenceGroupId = this.seqNum;
            item.lastModifiedDate = new Date(App.DateNow());
            item.jazeeraWarehouse = reqData.jazeeraWarehouse;
            if (item.batches && item.batches.length > 0) {
              for (let batches of item.batches) {
                if (batches.returnQuantity > 0) {
                  batches.itemid = item.itemid;
                  batches.transrefid = reqData.interCompanyOriginalSalesId;
                  batches.invoiceid = item.salesId;
                  batches.qty =
                    reqData.transkind == "PURCHASERETURN" ? -batches.returnQuantity : batches.returnQuantity;
                  batches.batchno = batches.batchno;
                  batches.configid = item.configId;
                  batches.custvendac = reqData.custAccount;
                  batches.inventsizeid = item.inventsizeid;
                  batches.dataareaid = this.sessionInfo.dataareaid;
                  batches.inventlocationid = this.sessionInfo.inventlocationid;
                  batches.reserveStatus = reqData.transkind;
                  batches.transactionClosed = false;
                  batches.dateinvent = new Date(App.DateNow());
                  batches.salesLineId = item.id;
                  // await this.inventTransDAO.save(batches);
                  item.batch.push({
                    batchNo: batches.batchno,
                    quantity: batches.returnQuantity,
                  });
                  this.updateInventoryService.sessionInfo = this.sessionInfo;
                  promiseList.push(
                    this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner)
                  );
                }
              }
            }
          }
          // promiseList.push(this.salesLineDAO.save(item));
          promiseList.push(queryRunner.manager.getRepository(SalesLine).save(item));
        }
        await Promise.all(promiseList);
        await queryRunner.commitTransaction();
        reqData.salesLine = salesLine;
        let returnData = {
          id: reqData.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
        };
        //console.log(returnData);
        console.log(reqData);
        return returnData;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async saveOrderShipment(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let salesLine: any = reqData.salesLine;
      delete reqData.salesLine;
      reqData.interCompanyOriginalSalesId;
      let transactionClosed: boolean = false;
      let salesData: any;
      let checkStatus: boolean = false;
      salesData = await this.salestableDAO.findOne({
        salesId: reqData.interCompanyOriginalSalesId,
      });
      //console.log(salesData);
      if (salesData) {
        salesData.status = "SHIPPED";
        salesData.salesType = 2;
        await this.salestableDAO.save(salesData);
        reqData.salesType = 2;
        reqData.isMovementIn = false;
        reqData.status = "SHIPPED";
        transactionClosed = true;
      }
      let cond = await this.validate(reqData);
      let promiseList: any[] = [];
      promiseList.push(this.salesLineDelete(reqData, queryRunner));
      promiseList.push(this.inventryTransUpdate(reqData, queryRunner));
      await Promise.all(promiseList);
      promiseList = [];
      if (cond == true) {
        // promiseList.push(this.salestableDAO.save(reqData));
        promiseList.push(queryRunner.manager.getRepository(SalesTable).save(reqData));
        salesLine = salesLine.filter((v: any) => v.status == "SHIPPED");
        console.log(salesLine);
        for (let item of salesLine) {
          delete item.id;
          item.id = uuid();
          item.salesId = reqData.salesId;
          item.custAccount = reqData.custAccount;
          item.createddatetime = moment().format();
          item.createdBy = this.sessionInfo.userName;
          item.numberSequenceGroupId = this.seqNum;
          item.lastModifiedDate = new Date(App.DateNow());
          item.jazeeraWarehouse = reqData.jazeeraWarehouse;
          item.batch = [];
          if (item.batches && item.batches.length > 0) {
            //console.log(item.batches);
            const qty = item.batches.reduce((res: number, b: any) => res + parseInt(b.quantity), 0);
            if (qty == item.salesQty) {
              for (let batches of item.batches) {
                if (batches.quantity > 0) {
                  batches.itemid = item.itemid;
                  batches.transrefid = reqData.interCompanyOriginalSalesId
                    ? reqData.interCompanyOriginalSalesId
                    : reqData.salesId;
                  batches.invoiceid = reqData.salesId;
                  batches.qty = -parseInt(batches.quantity);
                  batches.batchno = batches.batchNo;
                  batches.configid = item.configId;
                  batches.inventsizeid = item.inventsizeid;
                  batches.inventlocationid = reqData.inventLocationId;
                  batches.dataareaid = reqData.dataareaid;
                  batches.reserveStatus = reqData.status;
                  batches.transactionClosed = false;
                  batches.custvendac = reqData.custAccount;
                  batches.dateinvent = moment().format();
                  batches.salesLineId = item.id;
                  item.batch.push({
                    batchNo: batches.batchNo,
                    quantity: batches.quantity,
                  });
                  this.updateInventoryService.sessionInfo = this.sessionInfo;
                  promiseList.push(
                    this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner)
                  );
                }
              }
            } else {
              let fiofoBatches = await this.dofifo(item, reqData);
              for (let inv of fiofoBatches) {
                item.batch.push({
                  batchNo: inv.batchno,
                  quantity: Math.abs(inv.qty),
                });
                promiseList.push(this.updateInventoryService.updateInventtransTable(inv, false, true, queryRunner));
              }
            }
          } else {
            let fiofoBatches = await this.dofifo(item, reqData);
            for (let inv of fiofoBatches) {
              item.batch.push({
                batchNo: inv.batchno,
                quantity: Math.abs(inv.qty),
              });
              promiseList.push(this.updateInventoryService.updateInventtransTable(inv, false, true, queryRunner));
            }
          }
        }
        // promiseList.push(this.salesLineDAO.save(salesLine));
        promiseList.push(queryRunner.manager.getRepository(SalesLine).save(salesLine));
        await Promise.all(promiseList);
        await queryRunner.commitTransaction();
        let returnData = {
          id: reqData.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
        };
        // //console.log(returnData);
        return returnData;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async saveOrderReceive(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let salesLine: any = reqData.salesLine;
      delete reqData.salesLine;
      reqData.interCompanyOriginalSalesId;
      let transactionClosed: boolean = false;
      let salesData: any;
      let checkStatus: boolean = false;
      let promiseList: any[] = [];
      salesData = await this.salestableDAO.findOne({
        salesId: reqData.interCompanyOriginalSalesId,
      });
      if (salesData) {
        // salesData.status = "RECEIVED";
        salesData.salesType = 3;
        // promiseList.push(this.salestableDAO.save(salesData));
        promiseList.push(queryRunner.manager.getRepository(SalesTable).save(salesData));
        reqData.salesType = 3;
        reqData.isMovementIn = true;
        reqData.status = "RECEIVED";
        transactionClosed = true;
        let transferData = await this.salestableDAO.findOne({
          salesId: salesData.interCompanyOriginalSalesId,
        });
        if (transferData) {
          transferData.status = "RECEIVED";
          // promiseList.push(this.salestableDAO.save(transferData));
          promiseList.push(queryRunner.manager.getRepository(SalesTable).save(transferData));
        }
        //console.log(salesData);
      }
      let cond = await this.validate(reqData);
      if (cond == true) {
        let salesTable = await this.salestableDAO.save(reqData);
        salesLine = salesLine.filter((v: any) => v.status == "RECEIVED");
        let batches: any = await this.inventTransDAO.findAll({
          invoiceid: reqData.interCompanyOriginalSalesId,
        });
        if (batches.length > 0) {
          salesLine.map((v: any) => {
            v.batches = batches.filter(
              (b: any) => b.configid == v.configId && b.itemid == v.itemid && b.inventsizeid == v.inventsizeid
            );
          });
        }

        for (let item of salesLine) {
          delete item.id;
          item.id = uuid();
          item.salesId = reqData.salesId;
          item.createddatetime = new Date(App.DateNow());
          item.lastModifiedDate = new Date(App.DateNow());
          item.createdBy = this.sessionInfo.userName;
          item.numberSequenceGroupId = this.seqNum;
          item.jazeeraWarehouse = reqData.jazeeraWarehouse;
          item.custAccount = reqData.custAccount;
          item.batch = [];
          if (batches && batches.length > 0) {
            //console.log(item.batches);
            for (let batches of item.batches) {
              delete batches.id;
              batches.itemid = item.itemid;
              batches.transrefid = reqData.interCompanyOriginalSalesId;
              batches.invoiceid = reqData.salesId;
              batches.qty = Math.abs(batches.qty);
              batches.batchno = batches.batchno;
              batches.configid = item.configId;
              batches.inventsizeid = item.inventsizeid;
              batches.inventlocationid = reqData.inventLocationId;
              batches.dataareaid = reqData.dataareaid;
              batches.custvendac = reqData.custAccount;
              batches.reserveStatus = reqData.status;
              batches.transactionClosed = false;
              batches.dateinvent = new Date(App.DateNow());
              batches.salesLineId = item.id;
              item.batch.push({
                batchNo: batches.batchno,
                quantity: batches.qty,
              });
              this.updateInventoryService.sessionInfo = this.sessionInfo;
              promiseList.push(this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner));
            }
          } else {
            if (item.batches && item.batches.length > 0) {
              //console.log(item.batches);
              for (let batches of item.batches) {
                if (batches.quantity > 0) {
                  delete batches.id;
                  batches.itemid = item.itemid;
                  batches.transrefid = reqData.interCompanyOriginalSalesId
                    ? reqData.interCompanyOriginalSalesId
                    : reqData.salesId;
                  batches.invoiceid = reqData.salesId;
                  batches.qty = parseInt(batches.quantity);
                  batches.batchno = batches.batchNo;
                  batches.configid = item.configId;
                  batches.inventsizeid = item.inventsizeid;
                  batches.inventlocationid = reqData.inventLocationId;
                  batches.dataareaid = reqData.dataareaid;
                  batches.custvendac = reqData.custAccount;
                  batches.reserveStatus = reqData.status;
                  batches.transactionClosed = false;
                  batches.dateinvent = new Date(App.DateNow());
                  batches.salesLineId = item.id;
                  item.batch.push({
                    batchNo: batches.batchNo,
                    quantity: batches.quantity,
                  });
                  this.updateInventoryService.sessionInfo = this.sessionInfo;
                  promiseList.push(
                    this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner)
                  );
                }
              }
            }
          }
        }
        // promiseList.push(this.salesLineDAO.save(salesLine));
        promiseList.push(queryRunner.manager.getRepository(SalesLine).save(salesLine));
        await Promise.all(promiseList);
        await queryRunner.commitTransaction();
        let returnData = {
          id: reqData.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
        };
        // //console.log(returnData);
        return returnData;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async saveInventoryMovementOrder(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let salesLine: any = reqData.salesLine;
      delete reqData.salesLine;
      reqData.interCompanyOriginalSalesId;
      let transactionClosed: boolean = false;
      let salesData: any;
      let checkStatus: boolean = false;
      let promiseList: any[] = [];
      switch (reqData.transkind) {
        case "PURCHASEORDER":
          reqData.isMovementIn = true;
          reqData.status = reqData.status ? reqData.status : "PURCHASEORDER";
          transactionClosed = true;
          break;
        default:
          reqData.interCompanyOriginalSalesId = reqData.salesId;
      }
      let cond = await this.validate(reqData);
      if (cond == true) {
        // promiseList.push(this.salestableDAO.save(reqData));
        promiseList.push(queryRunner.manager.getRepository(SalesTable).save(reqData));
        if (reqData.status == "CONVERTED") {
          promiseList.push(this.rawQuery.salesTableInventlocation(reqData.inventLocationId, reqData.salesId));
        }
        promiseList.push(this.salesLineDelete(reqData, queryRunner));
        promiseList.push(this.inventryTransUpdate(reqData, queryRunner));
        // let batches: any = await this.inventTransDAO.findAll({
        //   invoiceid: reqData.salesId
        // });

        // for (let batch of batches) {
        //   if (batch.reserveStatus == "RESERVED") {
        //     this.updateInventoryService.sessionInfo = this.sessionInfo;
        //     await this.updateInventoryService.updateUnReserveQty(batch);
        //   }
        // }
        // await this.inventTransDAO.delete(batches);

        for (let item of salesLine) {
          delete item.id;
          item.id = uuid();
          item.salesId = reqData.salesId;
          item.createddatetime = new Date(App.DateNow());
          item.lastModifiedDate = new Date(App.DateNow());
          item.createdBy = this.sessionInfo.userName;
          item.jazeeraWarehouse = reqData.jazeeraWarehouse;
          item.numberSequenceGroupId = this.seqNum;
          item.batch = [];

          if (item.batches && item.batches.length > 0) {
            //console.log(item.batches);
            for (let batches of item.batches) {
              if (parseInt(batches.quantity) != 0) {
                batches.itemid = item.itemid;
                batches.transrefid = reqData.interCompanyOriginalSalesId
                  ? reqData.interCompanyOriginalSalesId
                  : reqData.salesId;
                batches.invoiceid = reqData.salesId;
                batches.qty =
                  reqData.status == "PURCHASEORDER" ? parseInt(batches.quantity) : parseInt(batches.quantity);
                batches.batchno = batches.batchNo;
                batches.configid = item.configId;
                batches.inventsizeid = item.inventsizeid;
                batches.inventlocationid = this.sessionInfo.inventlocationid;
                batches.dataareaid = this.sessionInfo.dataareaid;
                batches.reserveStatus = reqData.transkind;
                batches.transactionClosed = transactionClosed;
                batches.dateinvent = new Date(App.DateNow());
                batches.salesLineId = item.id;
                //console.log(batches);
                if (reqData.isMovementIn) {
                  // batches.inventbatch = {
                  //   inventBatchId: batches.batchNo,
                  //   itemId: item.itemid,
                  //   configId: item.configId,
                  //   description: batches.description,
                  //   dataAreaId: this.sessionInfo.dataareaid,
                  //   createdDateTime: new Date(),
                  //   dateinvent: new Date()
                  // };
                  // await this.inventbatchDAO.save(batches.inventbatch);
                }

                // await this.inventTransDAO.save(batches);
                item.batch.push({
                  batchNo: batches.batchNo,
                  quantity: batches.quantity,
                });
                this.updateInventoryService.sessionInfo = this.sessionInfo;
                await this.updateInventoryService.updateInventtransTable(batches, false, true, queryRunner);
              }
            }
          } else {
            let batches: any = await this.inventTransDAO.findAll({
              invoiceid: reqData.interCompanyOriginalSalesId,
            });
            for (let batch of batches) {
              delete batch.id;
              batch.transrefid = reqData.interCompanyOriginalSalesId;
              batch.invoiceid = reqData.salesId;
              batch.reserveStatus = reqData.transkind;
              batch.transactionClosed = transactionClosed;
              batch.inventlocationid = this.sessionInfo.inventlocationid;
              batch.qty = reqData.isMovementIn ? Math.abs(batch.qty) : -Math.abs(batch.qty);
              batch.dateinvent = new Date(App.DateNow());
              // this.inventTransDAO.save(batch);
              item.batch.push({
                batchNo: batch.batchNo,
                quantity: batch.quantity,
              });
              this.updateInventoryService.sessionInfo = this.sessionInfo;
              await this.updateInventoryService.updateInventtransTable(batch, false, true, queryRunner);
            }
          }
          // promiseList.push(this.salesLineDAO.save(item));
          promiseList.push(queryRunner.manager.getRepository(SalesLine).save(item));
        }
        await Promise.all(promiseList);
        await queryRunner.commitTransaction();

        let returnData: any = {
          id: reqData.salesId,
          message: "SAVED_SUCCESSFULLY",
          status: reqData.status,
        };
        if (reqData.transkind == "INVENTORYMOVEMENT" && reqData.movementType.id == 10) {
          returnData.sendForApproval = false;
        } else {
          returnData.sendForApproval = true;
        }
        // //console.log(returnData);
        return returnData;
      }
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async sendForTransferOrderRequest(reqData: any) {
    try {
      let transferorder: SalesTable = await this.salestableDAO.entity(reqData.salesId);
      transferorder.lastModifiedDate = new Date(App.DateNow());
      transferorder.status = reqData.status ? reqData.status : "REQUESTED";
      transferorder = await this.salestableDAO.save(transferorder);
      await this.rawQuery.updateSalesLine(reqData.salesId, "REQUESTED");
      return {
        id: transferorder.salesId,
        message: "REQUESTED",
        status: transferorder.status,
      };
    } catch (error) {
      throw error;
    }
  }
  async rejectTransferOrder(reqData: any) {
    try {
      //console.log(reqData);
      let transferorder: SalesTable = await this.salestableDAO.entity(reqData.salesId);
      transferorder.status = "REJECTED";
      transferorder.lastModifiedDate = new Date(App.DateNow());
      transferorder = await this.salestableDAO.save(transferorder);
      await this.rawQuery.updateSalesLine(reqData.salesId, "REJECTED");
      return {
        id: transferorder.salesId,
        message: "REJECTED",
        status: transferorder.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async dofifo(item: any, reqData: any) {
    let batches: any = [];
    let inventory = await this.rawQuery.inventoryOnHand({
      inventlocationid: this.sessionInfo.inventlocationid,
      itemId: item.itemid,
      configid: item.configId,
      inventsizeid: item.inventsizeid,
    });
    console.log("======dofifo=======", inventory);
    let val_1: number = parseInt(item.salesQty);
    console.log("quantity", val_1);
    for (let batch of inventory) {
      if (parseInt(batch.availabilty) >= val_1) {
        batch.quantity = val_1;
        val_1 = 0;
        break;
      } else {
        batch.quantity = parseInt(batch.availabilty);
        val_1 -= parseInt(batch.availabilty);
      }
    }
    for (let batch of inventory) {
      if (batch.quantity > 0) {
        batch.itemid = item.itemid;
        batch.transrefid = reqData.interCompanyOriginalSalesId ? reqData.interCompanyOriginalSalesId : reqData.salesId;
        batch.invoiceid = item.salesId;
        batch.dataareaid = this.sessionInfo.dataareaid;
        batch.custvendac = reqData.custAccount;
        batch.inventlocationid = this.sessionInfo.inventlocationid;
        batch.transactionClosed = reqData.status == "PAID" || reqData.status == "RESERVED" ? true : false;
        batch.qty = -batch.quantity;
        batch.reserveStatus = reqData.status;
        batch.dateinvent = new Date(App.DateNow());
        // this.inventTransDAO.save(batche);
        batches.push(batch);
        // await this.updateInventoryService.updateInventtransTable(batche, true);
      }
    }
    return await batches;
  }
  async dofifo__(batch: any, status: string) {
    let inventory = await this.rawQuery.getInventTrans({
      inventlocationid: this.sessionInfo.inventlocationid,
      itemId: batch.itemid,
      configid: batch.configid,
      inventsizeid: batch.inventsizeid,
    });
    let FIFObatch: any = [];
    let val_1: number = Math.abs(batch.qty);
    //console.log(val_1);
    inventory = inventory.filter((v: any) => v.availabilty > 0);
    //console.log(inventory);
    for (let i of inventory) {
      let fifob: any = {
        itemid: batch.itemid,
        configid: batch.configid,
        inventsizeid: batch.inventsizeid,
        invoiceid: batch.invoiceid,
        transrefid: batch.transrefid,
        inventlocationid: batch.inventlocationid,
        batchno: i.batchno,
        transactionclosed: status == "PAID" || status == "RESERVED" ? true : false,
        dateinvent: new Date(App.DateNow()),
        reserveStatus: status,
      };
      if (i.availabilty >= val_1) {
        fifob.qty = val_1;
        val_1 = 0;
        FIFObatch.push(fifob);
        //console.log(val_1);
      } else {
        fifob.qty = val_1;
        val_1 -= i.availabilty;
      }

      if (val_1 == 0) {
        break;
      }
    }
    for (let invent of FIFObatch) {
      await this.inventTransDAO.save(invent);
    }
    await this.inventTransDAO.delete(batch);
  }

  groupBy(array: any, f: any) {
    let groups: any = {};
    array.forEach(function (o: any) {
      let group: any = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }

  async saveSalesorderToken(data: any, queryRunner) {
    await this.salesOrderTokensDAO.save(data);
  }

  async saveSalesOrderAfterOnlinePayment(reqData: any, queryRunner) {
    // const queryRunner = getConnection().createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    try {
      let salesLine: any = reqData.salesLine;
      let reportData: any = await this.allocateInvoiceReportData(reqData, salesLine);
      delete reqData.salesLine;
      reqData.paymentType = reqData.onlineAmount > 0 ? "ONLINE" : "OFFLINE";
      // let salesTable: any = await this.salestableDAO.save(reqData);
      let salesTable: any = await queryRunner.manager.getRepository(SalesTable).save(reqData);
      let promiseList: any = [];

      promiseList.push(this.inventryTransUpdate(reqData, queryRunner));
      for (let item of salesLine) {
        console.log(item);
        promiseList.push(this.salesLineItemOrder(item, reqData, queryRunner));
      }
      promiseList.push(this.saveSalesOrderUpdateVocharDiscount(reqData, queryRunner));
      if (reqData.mobileNo) {
        let pmobileno = async () => {
          let message = `  رضاؤكم هو هدفنا دهانات الجزيرة جودة وجمال قيمة مشترياتكم هي ${reqData.netAmount} `;
          let sms = new Sms();
          return sms.sendMessage("966", reqData.mobileNo, message);
        };
        promiseList.push(pmobileno());
      }
      this.rawQuery.sessionInfo = this.sessionInfo;
      let customerDetails = await this.rawQuery.getCustomer(reqData.custAccount);
      if (customerDetails.walkincustomer) {
        promiseList.push(this.saveSalesVisitorData(reqData, customerDetails, queryRunner));
      }
      if (reqData.designServiceRedeemAmount > 0) {
        promiseList.push(this.saveSalesOrderDesignerService(reqData, queryRunner));
      }
      const { userName } = this.sessionInfo;
      promiseList.push(this.saveSalesOrderRedeem(reqData, queryRunner));
      let imail = async () => {
        let template: string = reqData.lang == "en" ? "email-invoice-en" : "email-invoice-ar";
        try {
          console.log(reportData);
          return App.SendMail(reqData.custEmail, `Invoice`, template, reportData);
        } catch (error) {
          log.error(error);
        }
      };
      promiseList.push(imail());
      await Promise.all(promiseList);
      reqData.salesLine = salesLine;
      let returnData = {
        id: reqData.salesId,
        message: "SAVED_SUCCESSFULLY",
        status: reqData.status,
        url: reqData.url,
      };
      console.log("7----------------------------");
      queryRunner.commitTransaction();
      return returnData;
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      throw error;
      // } finally {
      //   await queryRunner.release();
    }
  }

  async allocateInvoiceReportData(reqData: any, salesLine: any) {
    reqData.date = new Date(App.DateNow()).toLocaleDateString();
    reqData.paymentType = reqData.lang == "en" ? "ONLINE" : "عبر الانترنت";
    let reports: any = {
      salesTable: reqData,
      salesLine: [],
      quantity: 0,
    };
    let sNo = 1;
    for (let item of salesLine) {
      reports.quantity += parseInt(item.salesQty);

      for (let batch of item.batch) {
        let data: any = {
          productName: item.size.product.nameEn,
          productNameAr: item.size.product.nameAr,
          colorantId: item.colorantId,
          configId: item.configId,
          colorName: item.color.nameEnglish,
          sizeName: item.size.nameEnglish,
          inventsizeid: item.inventsizeid,
          itemid: item.itemid,
        };
        data.sNo = sNo;
        data.batchNo = batch.batchNo;
        data.quantity = parseInt(batch.quantity);
        data.vat = item.vat;
        data.vatAmount = (parseFloat(item.vatamount) / parseFloat(item.salesQty)) * data.quantity;
        data.lineTotalDisc = (parseFloat(item.lineTotalDisc) / parseFloat(item.salesQty)) * data.quantity;
        data.price = parseFloat(item.salesprice);
        data.productPrice = data.price * data.quantity;
        data.colorantPrice = parseFloat(item.colorantprice) * data.quantity;
        data.lineAmountBeforeVat = data.productPrice + data.colorantPrice - data.lineTotalDisc;
        data.lineAmount = data.lineAmountBeforeVat + data.vatAmount;
        data.vatAmount = data.vatAmount
          ? Math.round(parseFloat((data.vatAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.lineTotalDisc = data.lineTotalDisc
          ? Math.round(parseFloat((data.lineTotalDisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.price = data.price
          ? Math.round(parseFloat((data.price * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.productPrice = data.productPrice
          ? Math.round(parseFloat((data.productPrice * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.colorantPrice = data.colorantPrice
          ? Math.round(parseFloat((data.colorantPrice * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.productPrice = data.productPrice
          ? Math.round(parseFloat((data.productPrice * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.lineAmountBeforeVat = data.lineAmountBeforeVat
          ? Math.round(parseFloat((data.lineAmountBeforeVat * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        data.lineAmount = data.lineAmount
          ? Math.round(parseFloat((data.lineAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
          : 0;
        // console.log(data);
        await reports.salesLine.push(data);
        sNo += 1;
      }
    }
    return await reports;
  }

  calItem(item: any) {
    item.salesprice = item.salesprice ? parseFloat(item.salesprice) : 0;
    item.salesQty = item.salesQty ? parseFloat(item.salesQty) : 0;
    item.lineAmount = item.lineAmount ? parseFloat(item.lineAmount) : 0;
    item.remainSalesPhysical = item.remainSalesPhysical ? parseFloat(item.remainSalesPhysical) : 0;
    item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    item.colorantprice = item.colorantprice ? parseFloat(item.colorantprice) : 0;
    item.vatamount = item.vatamount ? parseFloat(item.vatamount) : 0;
    item.qtyOrdered = item.qtyOrdered ? parseFloat(item.qtyOrdered) : 0;
    item.voucherdiscpercent = item.voucherdiscpercent ? parseFloat(item.voucherdiscpercent) : 0;
    item.voucherdiscamt = item.voucherdiscamt ? parseFloat(item.voucherdiscamt) : 0;
    item.enddiscamt = item.enddiscamt ? parseFloat(item.enddiscamt) : 0;
    item.endDisc = item.endDisc ? parseFloat(item.endDisc) : 0;
    item.multilnPercent = item.multilnPercent ? parseFloat(item.multilnPercent) : 0;
    item.multilndisc = item.multilndisc ? parseFloat(item.multilndisc) : 0;
    item.linediscpercent = item.linediscpercent ? parseFloat(item.linediscpercent) : 0;
    item.linediscamt = item.linediscamt ? parseFloat(item.linediscamt) : 0;
    item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    item.promotiondisc = item.promotiondisc ? parseFloat(item.promotiondisc) : 0;
    item.instantdiscamt = item.instantdiscamt ? parseFloat(item.instantdiscamt) : 0;
    item.instantDisc = item.instantDisc ? parseFloat(item.instantDisc) : 0;
    item.vat = item.vat ? parseFloat(item.vat) : 0;
  }
  calData(data: any) {
    data.amount = data.amount ? parseFloat(data.amount) : 0;
    data.sumTax = data.sumTax ? parseFloat(data.sumTax) : 0;
    data.disc = data.disc ? parseFloat(data.disc) : 0;
    data.netAmount = data.netAmount ? parseFloat(data.netAmount) : 0;
    data.vatamount = parseFloat(data.vatamount);
    data.voucherdiscpercent = data.voucherdiscpercent ? parseFloat(data.voucherdiscpercent) : 0;
    data.redeemAmount = data.redeemAmount ? parseFloat(data.redeemAmount) : 0;
    data.voucherdiscamt = data.voucherdiscamt ? parseFloat(data.voucherdiscamt) : 0;
    data.redeempts = data.redeempts ? parseFloat(data.redeempts) : 0;
  }

  async searchPainters(item: any) {
    try {
      console.log(item);
      if (item.inventlocationid) {
        let query = ` select st.salesid ,st.salesname,st.painter,
        ct.namealias as "customerNameEn",ct.name as "customerNameAr",
        st.netamount as amount,st.lastmodifieddate
        from salestable  st 
        inner join custtable ct on
        ct.accountnum =st.invoiceaccount 
        where st.transkind ='SALESORDER'
                       and st.inventlocationid ='${item.inventlocationid}'
                       and  COALESCE(st.painter, '') != '' 
                       order by st.lastmodifieddate desc;;
        `;
        let data = await this.salestableDAO.getDAO().query(query);
        let paintersId: any[] = [];
        data.forEach((item: any) => {
          if (item.painter != null && item.painter && item.painter.toString().trim().length > 0) {
            paintersId.push(item.painter);
          }
        });
        paintersId = Array.from(new Set(paintersId));
        let query1 = `select ct1.accountnum as "painterCode",ct1."name" as "painterAr",
         ct1.namealias as "painterEn" 
         from custtable ct1
         `;
        if (paintersId.length > 0) {
          query1 += `where ct1.accountnum  in (${paintersId
            .map(function (painterID) {
              return "'" + painterID + "'";
            })
            .join(",")});`;
        }

        let painters: any[] = await this.salestableDAO.getDAO().query(query1);
        data.forEach((item: any, index: any) => {
          let painter = painters.find((painterObj: any) => {
            return painterObj.painterCode == item.painter;
          });
          if (painter) {
            data[index] = Object.assign({}, data[index], painter);
          }
        });
        return data;
      } else {
        throw { message: Props.INVALID_DATA };
      }
    } catch (error) {
      throw error;
    }
  }

  async map_return_for_designer_service(data, line) {}
}
