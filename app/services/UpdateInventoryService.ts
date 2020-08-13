import { InventorytransDAO } from "../repos/InventTransDAO";
import { InventoryOnhandDAO } from "../repos/InventoryOnhandDAO";
import { InventoryOnhand } from "../../entities/InventoryOnhand";
import { App } from "../../utils/App";
import { Inventorytrans } from "../../entities/InventTrans";
export class UpdateInventoryService {
  public sessionInfo: any;
  private inventTransDAO: InventorytransDAO;
  private inventoryOnhandDAO: InventoryOnhandDAO;
  constructor() {
    this.inventTransDAO = new InventorytransDAO();
    this.inventoryOnhandDAO = new InventoryOnhandDAO();
  }

  async updateInventtransTable(reqData: any, update: boolean = false, status: boolean, queryRunner) {
    console.log("==========updateInventtransTable=================");
    console.log(reqData);
    // await this.inventTransDAO.save(reqData);
    await queryRunner.manager.getRepository(Inventorytrans).save(reqData);
    if (status) {
      await this.updateInventoryOnhandTable(reqData, update, queryRunner);
    }
  }

  async updateInventoryOnhandTable(reqData: any, update: boolean = false, queryRunner) {
    console.log("==========updateInventoryOnhand=================1");
    console.log(reqData);
    if (reqData.transactionClosed) {
      let inventoryOnHandData: any = await this.inventoryOnhandDAO.findOne({
        itemid: reqData.itemid,
        inventsizeid: reqData.inventsizeid,
        configid: reqData.configid,
        batchno: reqData.batchno,
        dataareaid: reqData.dataareaid,
        inventlocationid: reqData.inventlocationid,
      });
      console.log("==========updateInventoryOnhandData=================2", inventoryOnHandData);
      if (inventoryOnHandData) {
        if (reqData.reserveStatus == "RESERVED") {
          if (update) {
            inventoryOnHandData.qtyReserved = parseInt(inventoryOnHandData.qtyReserved) + Math.abs(reqData.qty);
            inventoryOnHandData.updatedOn = new Date(App.DateNow());
            // await this.inventoryOnhandDAO.save(inventoryOnHandData);
            await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
          }
        } else {
          if (reqData.reserveStatus == "PAID") {
            if (update) {
              inventoryOnHandData.updatedOn = new Date(App.DateNow());
              if (parseInt(reqData.qty) < 0) {
                inventoryOnHandData.qtyOut = parseInt(inventoryOnHandData.qtyOut) + Math.abs(reqData.qty);
                await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
              } else if (parseInt(reqData.qty) > 0) {
                inventoryOnHandData.qtyIn = parseInt(inventoryOnHandData.qtyIn) + Math.abs(reqData.qty);
                // await this.inventoryOnhandDAO.save(inventoryOnHandData);
                await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
              }
            }
          } else if (parseInt(reqData.qty) < 0) {
            inventoryOnHandData.qtyOut = parseInt(inventoryOnHandData.qtyOut) + Math.abs(reqData.qty);
            inventoryOnHandData.updatedOn = new Date(App.DateNow());
            // await this.inventoryOnhandDAO.save(inventoryOnHandData);
            await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
          } else if (parseInt(reqData.qty) > 0) {
            inventoryOnHandData.qtyIn = parseInt(inventoryOnHandData.qtyIn) + Math.abs(reqData.qty);
            inventoryOnHandData.updatedOn = new Date(App.DateNow());
            // await this.inventoryOnhandDAO.save(inventoryOnHandData);
            await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
          }
        }
      } else {
        inventoryOnHandData = new InventoryOnhand();
        inventoryOnHandData.itemid = reqData.itemid;
        inventoryOnHandData.configid = reqData.configid;
        inventoryOnHandData.inventsizeid = reqData.inventsizeid;
        inventoryOnHandData.batchno = reqData.batchno;
        inventoryOnHandData.dataareaid = reqData.dataareaid;
        inventoryOnHandData.inventlocationid = reqData.inventlocationid;
        inventoryOnHandData.updatedOn = new Date(App.DateNow());
        if (parseInt(reqData.qty) < 0) {
          inventoryOnHandData.qtyOut = Math.abs(reqData.qty);
        } else if (parseInt(reqData.qty) > 0) {
          inventoryOnHandData.qtyIn = Math.abs(reqData.qty);
        }
        // await this.inventoryOnhandDAO.save(inventoryOnHandData);
        await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
      }
    } else {
      if (reqData.reserveStatus == "UNRESERVED") {
        let inventoryOnHandData: any = await this.inventoryOnhandDAO.findOne({
          itemid: reqData.itemid,
          inventsizeid: reqData.inventsizeid,
          configid: reqData.configid,
          batchno: reqData.batchno,
          dataareaid: reqData.dataareaid,
          inventlocationid: reqData.inventlocationid,
        });
        console.log("==========updateInventoryOnhandData=================", inventoryOnHandData);
        inventoryOnHandData.qtyReserved = parseInt(inventoryOnHandData.qtyReserved) - Math.abs(reqData.qty);
        inventoryOnHandData.updatedOn = new Date(App.DateNow());
        // await this.inventoryOnhandDAO.save(inventoryOnHandData);
        await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
      }
    }
  }
  async updateUnReserveQty(reqData: any, queryRunner) {
    let inventoryOnHandData: InventoryOnhand = await this.inventoryOnhandDAO.findOne({
      itemid: reqData.itemid,
      inventsizeid: reqData.inventsizeid,
      configid: reqData.configid,
      batchno: reqData.batchno,
      dataareaid: reqData.dataareaid,
      inventlocationid: reqData.inventlocationid,
      qty: Math.abs(reqData.qty),
    });
    console.log("==========updateUnReserveQty=================", inventoryOnHandData, reqData.qty);
    if (inventoryOnHandData) {
      inventoryOnHandData.qtyReserved =
        inventoryOnHandData.qtyReserved > Math.abs(reqData.qty)
          ? inventoryOnHandData.qtyReserved - Math.abs(reqData.qty)
          : 0;
      inventoryOnHandData.updatedOn = new Date(App.DateNow());
      inventoryOnHandData.updatedBy = this.sessionInfo ? this.sessionInfo.userName : "SYSTEM";
      // await this.inventoryOnhandDAO.save(inventoryOnHandData);
      console.log(inventoryOnHandData);
      await queryRunner.manager.getRepository(InventoryOnhand).save(inventoryOnHandData);
    }
  }
}
