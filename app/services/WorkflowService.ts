import { App } from "../../utils/App";
import { getManager } from "typeorm";
import { WorkflowDAO } from "../repos/WorkflowDAO";
import { Props } from "../../constants/Props";
import { RawQuery } from "../common/RawQuery";
import { SalesTableDAO } from "../repos/SalesTableDAO";
import { Workflow } from "../../entities/Workflow";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { DBEvent } from "../../utils/Watcher";
import { getConnection } from "typeorm";
const ENV_STORE_ID = process.env ? process.env.ENV_STORE_ID : null;

export class WorkflowService {
  public sessionInfo: any;
  private workflowDAO: WorkflowDAO;
  private rawQuery: RawQuery;
  private salesTableDAO: SalesTableDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private updateInventoryService: UpdateInventoryService;
  private inventtransDAO: InventorytransDAO;
  private db: any;
  constructor() {
    this.workflowDAO = new WorkflowDAO();
    this.rawQuery = new RawQuery();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.salesTableDAO = new SalesTableDAO();
    this.updateInventoryService = new UpdateInventoryService();
    this.inventtransDAO = new InventorytransDAO();
    this.db = getManager();
    DBEvent().on("workflow", (value: any) => {
      console.log("&&&&&&&&&&&&&&&&workflow watcher&&&&&&&&&&&&&&&&&&&: ", value);
      this.workflowUpdate(value);
    });
  }

  async entity(id: string) {
    try {
      let data: any = await this.workflowDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      item.pendingWith = this.sessionInfo.userName;
      item.groupid = this.sessionInfo.groupid;
      let data: any = await this.workflowDAO.search(item);

      data.map((item: any) => {
        // console.log(item.orderType);
        // console.log(item.SalesTable.movementType)
        item.orderTypeAr = Props.Workflow_Order_Type[item.orderType][1];
        item.orderTypeEn = Props.Workflow_Order_Type[item.orderType][1];
        item.ordertype = Props.Workflow_Order_Type[item.orderType][1];
        item.descriptionEn = Props.WORKFLOW_STATUSID[item.statusId][1];
        item.descriptionAr = Props.WORKFLOW_STATUSID[item.statusId][2];
        item.createdDateTime = new Date(item.createdDateTime).toLocaleDateString();
        // item.inventoryType = item.SalesTable.movementType.movementType;
        // item.inventoryTypeAr = item.SalesTable.movementType.movementArabic;
        item.inventoryType = item.SalesTable ? item.SalesTable.movementType : null;
        item.inventoryTypeAr = item.SalesTable ? item.SalesTable.movementType : null;
        delete item.SalesTable;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async save(item: any, type: string = null) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let status = item.status;
      let promistList: any[] = [];
      let condition: any = await this.rawQuery.workflowconditions(this.sessionInfo.usergroupconfigid);
      let usergroupid: string = this.sessionInfo.groupid;
      if (item.id || item.orderId) {
        if (item.id) {
          item = await this.workflowDAO.entity(item.id);
          if (item) {
            usergroupid = item.usergroupid;
          }
        }
        let salesData = await this.salesTableDAO.entity(item.orderId);
        if (!salesData) {
          throw Props.ORDER_NOT_FOUND;
        }
        let RM_AND_RA = await this.rawQuery.getRmAndRa(usergroupid);
        // console.log(RM_AND_RA);
        if (type == "sendforapproval") {
          await this.allocateData(item, salesData);
          if (salesData.transkind == "RETURNORDER") {
            if (condition.rmApprovalRequired) {
              item.statusId = Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
              if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                item.pendingWith = RM_AND_RA.rm;
              } else {
                throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
              }
            } else if (condition.raApprovalRequired) {
              item.statusId = Props.WORKFLOW_STATUSID.PENDINGRAPPROVAL[0];
              if (RM_AND_RA.ra && RM_AND_RA.ra != "") {
                item.pendingWith = RM_AND_RA.ra;
              } else {
                throw { message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
              }
            }
          } else if (salesData.transkind == "INVENTORYMOVEMENT") {
            let canSendForApproval = await this.stockOnHandCheck(salesData);
            console.log(canSendForApproval);
            if (canSendForApproval) {
              if ([5, 8, 9].includes(salesData.movementType.id)) {
                item.statusId = Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
                if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                  item.pendingWith = RM_AND_RA.rm;
                } else {
                  throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                }
              } else if ([1, 2, 3, 4, 6, 7].includes(salesData.movementType.id)) {
                item.statusId = Props.WORKFLOW_STATUSID.PENDINGRAAPPROVAL[0];
                if (RM_AND_RA.ra && RM_AND_RA.ra != "") {
                  item.pendingWith = RM_AND_RA.ra;
                } else {
                  throw { message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                }
              } else {
                await await this.rawQuery.updateSalesTableWorkFlowStatus(salesData.salesId, "NOWORKFLOW");
                return { id: salesData.salesId, status: "NOWORKFLOW", message: Props.SAVED_SUCCESSFULLY };
              }
              let transactions: any = await this.inventtransDAO.findAll({ invoiceid: salesData.salesId });
              transactions = transactions.filter((v: any) => v.qty < 0);
              transactions.map((v: any) => {
                v.qty = Math.abs(v.qty);
                v.reserveStatus = "RESERVED";
                v.transactionClosed = true;
                console.log(v);
              });
              for (let v of transactions) {
                await this.updateInventoryService.updateInventoryOnhandTable(v, true, queryRunner);
              }
              console.log(transactions);
            } else {
              throw { message: "CANNOT_CREATE_MOVEMENT_ORDER" };
            }
          } else if (salesData.transkind == "DESIGNERSERVICERETURN") {
            item.statusId = Props.WORKFLOW_STATUSID.PENDINGINGFORDESIGNERAPPROVAL[0];
            if (RM_AND_RA.designer_signing_authority && RM_AND_RA.designer_signing_authority != "") {
              item.pendingWith = RM_AND_RA.designer_signing_authority;
            } else {
              throw { message: "NO_DESIGNER_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT" };
            }
          } else {
            item.statusId = Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
            if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
              item.pendingWith = RM_AND_RA.rm;
            } else {
              throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
            }
          }
          item.usergroupid = this.sessionInfo.groupid;
          item.orderType = Props.WORKFLOW_ORDER_TYPE[salesData.transkind][0];
          item.inventLocationId = this.sessionInfo.inventlocationid;
        } else {
          // console.log(item.statusId);
          if (status == "accept" || status == null) {
            if (salesData.transkind == "RETURNORDER") {
              console.log("================11111");
              if (
                item.statusId == Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0] ||
                item.statusId == Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0]
              ) {
                item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRM[0];
                if (RM_AND_RA.ra) {
                  // console.log(RM_AND_RA);
                  if (condition.raApprovalRequired) {
                    item.pendingWith = RM_AND_RA.ra;
                  } else {
                    item.pendingWith = null;
                    item.statusId = "APPROVED";
                  }
                } else {
                  throw { message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                }
              } else if (
                item.statusId == Props.WORKFLOW_STATUSID.PENDINGRAAPPROVAL[0] ||
                item.statusId == Props.WORKFLOW_STATUSID.APPROVEDBYRM[0]
              ) {
                console.log("====================================");
                item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRA[0];
                item.pendingWith = null;
              } else if (item.statusId == Props.WORKFLOW_STATUSID.PENDINGINGFORDESIGNERAPPROVAL[0]) {
                if (condition.rmApprovalRequired) {
                  item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0];
                  item.pendingWith = RM_AND_RA.rm;
                } else if (condition.rmApprovalRequired) {
                  item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRA[0];
                  item.pendingWith = RM_AND_RA.ra;
                } else {
                  item.statusId = "APPROVED";
                  item.pendingWith = null;
                }
              }
            } else {
              if (
                item.statusId == Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0] ||
                item.statusId == Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0]
              ) {
                item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRM[0];
                if (RM_AND_RA.ra) {
                  item.pendingWith = RM_AND_RA.ra;
                } else {
                  item.pendingWith = null;
                  item.statusId = "APPROVED";
                }
              } else if (
                item.statusId == Props.WORKFLOW_STATUSID.PENDINGRAAPPROVAL[0] ||
                item.statusId == Props.WORKFLOW_STATUSID.APPROVEDBYRM[0]
              ) {
                item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRA[0];
                item.pendingWith = null;
              } else if (item.statusId == Props.WORKFLOW_STATUSID.PENDINGINGFORDESIGNERAPPROVAL[0]) {
                if (RM_AND_RA.rm) {
                  item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0];
                  item.pendingWith = RM_AND_RA.rm;
                } else if (RM_AND_RA.ra) {
                  item.statusId = Props.WORKFLOW_STATUSID.APPROVEDBYRA[0];
                  item.pendingWith = RM_AND_RA.ra;
                } else {
                  item.statusId = "APPROVED";
                  item.pendingWith = null;
                }
              }
            }
          } else if (status == "reject") {
            console.log("==========================", status);
            if (RM_AND_RA.rm == this.sessionInfo.groupid) {
              item.statusId = Props.WORKFLOW_STATUSID.REJECTEDBYRM[0];
            } else if (RM_AND_RA.ra == this.sessionInfo.groupid) {
              item.statusId = Props.WORKFLOW_STATUSID.REJECTEDBYRA[0];
            }
            item.pendingWith = null;
            // await this.inventryTransUpdate(salesData);
          }
        }

        item.lastModifiedBy = this.sessionInfo.userName;
        // console.log(new Date());
        item.lastModifiedDate = new Date(App.DateNow());

        await this.validate(item);

        // let data: any = await this.workflowDAO.save(item);
        let salesSaveData: any = {};
        salesSaveData.salesId = item.orderId;
        salesSaveData.status = item.statusId;
        salesSaveData.lastModifiedDate = new Date(App.DateNow());
        console.log("lastModifiedDate", salesSaveData.lastModifiedDate, salesSaveData.status);
        promistList.push(this.workflowDAO.save(item), this.salesTableDAO.save(salesSaveData));
        // let salesTableData: any = await this.salesTableDAO.save(salesData);
        await Promise.all(promistList);
        await queryRunner.commitTransaction();
        return { id: item.id, status: item.statusId, message: "SAVED_SUCCESSFULLY" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validate(item: any) {
    let oldItem: any = null;
    if (!item.id || item.id == "" || item.id == "0") {
      item.id = null;
    } else {
      oldItem = await this.workflowDAO.findOne({ orderId: item.orderId });
    }
    if (!item.id) {
      if (oldItem) {
        item = oldItem;
      } else {
        let uid = await this.getWorkflowId();
        item.id = uid;
      }
    }
    return true;
  }

  async getWorkflowId() {
    let usergroupconfig = await this.usergroupconfigDAO.findOne({
      groupid: this.sessionInfo.groupid,
    });
    let seqNum: string = usergroupconfig.workflowsequencegroup;
    let data = await this.rawQuery.getNumberSequence(seqNum);
    if (data && data.format) {
      let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
      let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
      let year: string = new Date().getFullYear().toString().substr(2, 2);
      data.nextrec = prevYear == year ? data.nextrec : 1;

      let id: string = data.format.replace(hashString, data.nextrec) + "-" + year;
      console.log(id);
      await this.rawQuery.updateNumberSequence(usergroupconfig.workflowsequencegroup, data.nextrec);
      return id;
    } else {
      throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
    }
  }
  allocateData(item: any, salesData: any) {
    item.partyId = salesData.custAccount;
    item.partyName = salesData.salesName;
    item.orderCreatedBy = salesData.createdby;
    item.orderCreatedDateTime = salesData.createddatetime;
    item.orderLastModifiedBy = salesData.lastModifiedBy;
    item.orderLastModifiedDate = salesData.lastModifiedDate;
    item.createdBy = this.sessionInfo.userName;
    item.createdDateTime = new Date(App.DateNow());
    item.inventLocationId = this.sessionInfo.inventlocationid;
  }

  async stockOnHandCheck(reqData: any) {
    // reqData.invoiceDate = new Date(App.DateNow());
    let lines: any = await this.inventtransDAO.findAll({ invoiceid: reqData.salesId });
    lines = lines.filter((v: any) => v.qty < 0);
    // console.log(lines);
    if (lines.length > 0) {
      let canConvert: boolean = true;
      let colors: any[] = [];
      let items: any[] = [];
      let sizes: any[] = [];
      let batches: any[] = [];
      let itemString = ``;
      lines.map((v: any) => {
        items.push(v.itemid), colors.push(v.configid), sizes.push(v.inventsizeid), batches.push(v.batchno);
      });
      let itemsInStock: any[] = await this.rawQuery.checkBatchAvailability(
        this.sessionInfo.inventlocationid,
        items,
        colors,
        sizes,
        batches
      );
      lines.map((v: any) => {
        let index = itemsInStock.findIndex(
          (value: any) =>
            value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
            value.configid.toLowerCase() == v.configid.toLowerCase() &&
            value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase() &&
            value.batchno.toLowerCase() == v.batchno.toLowerCase()
        );
        if (index >= 0) {
          if (Math.abs(parseInt(v.qty)) > parseInt(itemsInStock[index].qty)) {
            canConvert = canConvert == true ? false : false;
            itemString += `${v.itemid},`;
          }
        } else {
          canConvert = canConvert == true ? false : false;
          itemString += `${v.itemid},`;
        }
      });
      return canConvert;
    } else {
      return true;
    }
  }

  async inventryTransUpdate(reqData: any) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let batches: any = await this.inventtransDAO.findAll({
        invoiceid: reqData.salesId,
      });
      batches = batches.filter((v: any) => v.qty < 0);
      if (batches.length > 0) {
        for (let batch of batches) {
          batch.qty = batch.qty;
          await this.updateInventoryService.updateUnReserveQty(batch, queryRunner);
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async workflowUpdate(data: any) {
    // console.log("TODO", data);
    if (data && data.statusid.includes("REJECTED")) {
      if (process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID) {
        // console.log("TODO", data.orderid);
        console.log("11111111============================offline============");
        let salesData = await this.salesTableDAO.entity(data.orderid);
        if (salesData.transkind == "INVENTORYMOVEMENT") {
          let reqData = {
            salesId: data.orderid,
          };
          await this.inventryTransUpdate(reqData);
          let salesSaveData: any = {
            salesId: data.orderid,
            status: data.statusid,
          };
          await this.salesTableDAO.save(salesSaveData);
        }
      } else {
        let offlineSystems = await this.rawQuery.offlineSystems();
        console.log(offlineSystems);
        offlineSystems = offlineSystems.find((v: any) => v.id == data.inventlocationid);
        console.log(offlineSystems);
        if (!offlineSystems) {
          console.log("22222222online");
          console.log("TODO", data.orderid, data);
          let salesData = await this.salesTableDAO.entity(data.orderid);
          if (salesData.transkind == "INVENTORYMOVEMENT") {
            let reqData = {
              salesId: data.orderid,
            };
            await this.inventryTransUpdate(reqData);
          }
        } else {
          console.log("33333333offline");
          if (process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID) {
            // console.log("TODO", data.orderid);
            console.log("44444============================offline============");
            let salesSaveData: any = {
              salesId: data.orderid,
              status: data.statusid,
            };
            await this.salesTableDAO.save(salesSaveData);
          }
        }
      }
    } else {
      if (process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID) {
        // console.log("TODO", data.orderid);
        console.log("44444============================offline============");
        let salesSaveData: any = {
          salesId: data.orderid,
          status: data.statusid,
        };
        await this.salesTableDAO.save(salesSaveData);
      }
    }
  }
}
