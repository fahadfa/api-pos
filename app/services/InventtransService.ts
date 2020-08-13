import { App } from "../../utils/App";
import { Inventorytrans } from "../../entities/InventTrans";
import { ColorsDAO } from "../repos/ColorsDAO";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { RawQuery } from "../common/RawQuery";
import e from "express";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import { SalesLine } from "../../entities/SalesLine";

export class InventtransService {
  public sessionInfo: any;
  private inventtransDAO: InventorytransDAO;
  private rawQuery: RawQuery;
  private inventoryTrans: Inventorytrans;
  private salesLineDAO: SalesLineDAO;

  constructor() {
    this.inventtransDAO = new InventorytransDAO();
    this.salesLineDAO = new SalesLineDAO();
    this.rawQuery = new RawQuery();
    this.inventoryTrans = new Inventorytrans();
  }

  async entity(id: string) {
    try {
      let data: any = await this.inventtransDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(params: any) {
    try {
      var t0 = new Date().getTime();
      params.inventlocationid = this.sessionInfo.inventlocationid;
      let data: any = await this.rawQuery.inventoryOnHand(params);
      // let data: any = await this.rawQuery.getInventTransFromView(params);
      data.map((v: any) => {
        v.availabilty = parseInt(v.availabilty);
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async find(data: any) {
    try {
      let result: any = await this.inventtransDAO.findAll(data);
      let new_result = [];
      for (let ele of result) {
        var batch = {
          itemid: ele.itemid,
          inventsizeid: ele.inventsizeid,
          batchNo: ele.batchno,
          configid: ele.configid,
          quantity: Math.abs(ele.qty),
        };
        new_result.push(batch);
      }
      return new_result;
    } catch (error) {
      throw error;
    }
  }

  async getSelectedBatches(params: any) {
    try {
      if (params.type == "DESIGNERSERVICERETURN") {
        let data: any = await this.salesLineDAO.search({ salesId: params.salesid });
        let new_data: any[] = [];
        for (let v of data) {
          let i: any = {
            itemid: v.itemid,
            nameen: await this.rawQuery.desiner_product_name(v.itemid),
            configid: v.configId,
            inventsizeid: v.inventsizeid,
            qty: parseInt(v.salesQty),
            batchno: "-",
            colorantid: "-",
          };
          i.namear = i.itemen;
          new_data.push(i);
        }
        return new_data;
      } else {
        var t0 = new Date().getTime();
        params.inventlocationid = this.sessionInfo.inventlocationid;
        let data: any = await this.rawQuery.getSelectedBatches(params);
        // console.log(data);
        let salesorderlines: any[] = [];
        let returnorderlines: any[] = [];
        data.map((v: any) => {
          v.itemid = v.itemid.toUpperCase();
          v.configid = v.configid.toUpperCase();
          v.inventsizeid = v.inventsizeid.toUpperCase();
          if (params.type == "SALESORDER") {
            if (parseInt(v.qty) > 0) {
              returnorderlines.push(v);
            } else if (parseInt(v.qty) < 0) {
              salesorderlines.push(v);
            }
          }
        });
        if (params.type == "SALESORDER") {
          // console.log(salesorderlines, returnorderlines);
          let salesorderlinesresult: any;
          let returnorderlinesresult: any;
          salesorderlinesresult = this.groupBy(salesorderlines, function (item: any) {
            return [item.itemid, item.batchno, item.configid, item.inventsizeid, item.isItemFree, item.colorantId];
          });

          returnorderlinesresult = this.groupBy(returnorderlines, function (item: any) {
            return [item.itemid, item.batchno, item.configid, item.inventsizeid, item.isItemFree, item.colorantId];
          });
          let so_list = [];
          let ro_list = [];
          salesorderlinesresult.forEach(function (groupitem: any) {
            const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
            groupitem[0].qty = Math.abs(qty);
            groupitem[0].returnQuantity = 0;
            so_list.push({ ...groupitem[0] });
          });

          returnorderlinesresult.forEach(function (groupitem: any) {
            const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
            groupitem[0].qty = Math.abs(qty);
            groupitem[0].returnQuantity = 0;
            ro_list.push({ ...groupitem[0] });
          });
          if (ro_list.length > 0) {
            let resData = [];
            so_list.forEach((v: any) => {
              let ro_data: any = ro_list.find(
                (i: any) =>
                  v.itemid == i.itemid &&
                  v.configid == i.configid &&
                  v.inventsizeid == i.inventsizeid &&
                  v.batchno == i.batchno &&
                  v.isItemFree == i.isItemFree &&
                  v.colorantId == i.colorantId
              );
              console.log("=============1", ro_data, v.qty);
              if (ro_data) {
                if (v.qty > ro_data.qty) {
                  v.qty = v.qty - ro_data.qty;
                } else {
                  v.qty = 0;
                }
              }
              console.log("==========3", v);
              resData.push(v);
            });
            return resData;
          } else {
            return so_list;
          }
        } else {
          let result: any;
          if (params.type == "INVENTORYMOVEMENT") {
            result = this.groupBy(data, function (item: any) {
              return [
                item.itemid,
                item.batchno,
                item.configid,
                item.inventsizeid,
                item.isItemFree,
                item.colorantId,
                item.salesLineId,
              ];
            });
          } else {
            result = this.groupBy(data, function (item: any) {
              return [item.itemid, item.batchno, item.configid, item.inventsizeid, item.isItemFree, item.colorantId];
            });
          }
          let new_data: any = [];
          result.forEach(function (groupitem: any) {
            const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.qty), 0);
            if (params.type == "SALESORDER" || params.type == "PURCHASERETURN" || params.type == "INVENTORYMOVEMENT") {
              if (qty <= 0 && params.type != "INVENTORYMOVEMENT") {
                groupitem[0].qty = Math.abs(qty);
                groupitem[0].returnQuantity = 0;
                new_data.push({ ...groupitem[0] });
              } else if (qty > 0 && params.type == "SALESORDER") {
                groupitem[0].qty = Math.abs(qty);
                groupitem[0].returnQuantity = 0;
                new_data.push({ ...groupitem[0] });
              } else if (params.type == "INVENTORYMOVEMENT") {
                groupitem[0].qty = parseInt(qty);
                groupitem[0].returnQuantity = 0;
                new_data.push({ ...groupitem[0] });
              }
            } else {
              if (qty > 0) {
                groupitem[0].qty = Math.abs(qty);
                groupitem[0].returnQuantity = 0;
                new_data.push({ ...groupitem[0] });
              } else if (qty <= 0) {
                groupitem[0].qty = Math.abs(qty);
                groupitem[0].returnQuantity = 0;
                new_data.push({ ...groupitem[0] });
              }
            }
          });
          return new_data;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async save(reqData: Inventorytrans) {
    try {
      console.log(this.sessionInfo);
      let data: any = await this.inventtransDAO.save(reqData);
      console.log(data);
      return data.id;
    } catch (error) {
      throw error;
    }
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
  async paginate(item: any) {
    try {
      item.inventlocationid = this.sessionInfo.inventlocationid;
      // let data = await this.rawQuery.getInventTrans(item);
      let data: any = await this.rawQuery.inventoryOnHand(item);
      return await data;
    } catch (error) {
      throw error;
    }
  }

  async stockOnHandCheck(salesLine: any) {
    try {
      let colors: any[] = [];
      let items: any[] = [];
      let sizes: any[] = [];
      let result: any[] = [];
      let groupSalesLines: any = this.groupBy(salesLine, function (item: any) {
        return [item.itemid, item.configId, item.inventsizeid];
      });
      let newSalesline: any[] = [];
      groupSalesLines.forEach(function (groupitem: any) {
        const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.salesQty), 0);
        groupitem[0].salesQty = Math.abs(qty);
        newSalesline.push({ ...groupitem[0] });
      });
      newSalesline.map((v: any) => {
        // console.log(v);
        if (v.itemid && v.configId && v.inventsizeid) {
          items.push(v.itemid), colors.push(v.configId), sizes.push(v.inventsizeid);
        } else {
          result.push({
            itemid: v.itemid,
            configId: v.configId,
            inventsizeid: v.inventsizeid,
            availabilty: 0,
          });
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
          
          if (parseInt(v.salesQty) > parseInt(itemsInStock[index].qty)) {
            result.push({
              itemid: v.itemid,
              configId: v.configId,
              inventsizeid: v.inventsizeid,
              selectedQuantity: v.salesQty,
              availabilty: parseInt(itemsInStock[index].qty),
              product: v.product
            });
          }
        } else {
          result.push({
            itemid: v.itemid,
            configId: v.configId,
            inventsizeid: v.inventsizeid,
            selectedQuantity: v.salesQty,
            availabilty: 0,
          });
        }
      });
      return result;
    } catch (err) {
      throw { message: err };
    }
  }
}
