import { SalesTableDAO } from "../repos/SalesTableDAO";
import { RawQuery } from "../common/RawQuery";

export class ReturnOrderAmountService {
  private salesTableDAO: SalesTableDAO;
  public sessionInfo: any;
  private rawQuery: RawQuery;

  constructor() {
    this.salesTableDAO = new SalesTableDAO();
    this.rawQuery = new RawQuery();
  }

  async returnAmount(reqData: any, type: string) {
    let salesOrderData: any = await this.salesTableDAO.entity(reqData.salesid.toUpperCase());
    console.log(salesOrderData.cashAmount);
    let prevReturnOrderAmounts: any = await this.rawQuery.getPrevReturnOrderAmount(reqData.salesid.toUpperCase());
    this.rawQuery.sessionInfo = this.sessionInfo;
    let customer: any = await this.rawQuery.getCustomer(salesOrderData.custAccount);
    let condition: any = await this.rawQuery.workflowconditions(this.sessionInfo.usergroupconfigid);
    let salesLine: any[] = salesOrderData.salesLine;
    let salesLineIds: any[] = [];
    let grossAmount: number = 0;
    let total: number = 0;
    let discount: number = 0;
    let vat: number = 0;
    let sendForApproval: boolean = customer.custtype == 1 || customer.custtype == 2 ? true : false;
    reqData.selectedBatches.map((v: any) => {
      salesLineIds.push(v.salesLineId);
    });
    let totalGrossAmountAfterReturnItems: number = parseFloat(salesOrderData.amount);
    let filteredSalesLine: any[] = salesLine.filter((v: any) => salesLineIds.includes(v.id));
    filteredSalesLine.map((v: any) => {
      let filteredBatch = reqData.selectedBatches.filter((i: any) => i.salesLineId == v.id);
      let returnQuantity: number = filteredBatch.reduce(
        (res: number, item: any) => res + parseInt(item.returnQuantity),
        0
      );
      totalGrossAmountAfterReturnItems -= parseFloat(v.salesprice) * returnQuantity - v.totalSettledAmount;
    });
    let promotionalDiscountItems: any[] = [];
    let promotionalreturnItems: any[] = [];
    let discountConditions: any = {};
    for (let item of salesLine) {
      item.appliedDiscounts = item.appliedDiscounts ? item.appliedDiscounts : [];
      let checkForPromotional = item.appliedDiscounts.filter((v: any) => v.discountType == "PROMOTIONAL_DISCOUNT");
      if (checkForPromotional.length > 0) {
        promotionalDiscountItems.push(item);
      }
    }

    for (let item of reqData.selectedBatches) {
      let line: any = salesLine.filter((v: any) => v.id == item.salesLineId)[0];
      line.returnQuantity = item.returnQuantity;
      let promotionalItems = promotionalDiscountItems.filter((v: any) => v.linkId == line.linkId);
      if (promotionalItems.length > 0) {
        promotionalreturnItems.push(line);
      }
    }
    let result: any = this.groupBy(promotionalreturnItems, function (item: any) {
      return [item.linkId];
    });
    // console.log(result)
    for (let item of result) {
      let linkId = item[0].linkId;
      let totalQuantity: number = 0;
      let totalReturningQty: number = 0;
      let totalSettledAmount: number = 0;
      let totalReturnedQuantity: number = 0;
      let remainSalesFinancial: number = 0;
      let Promotionallines = salesLine.filter((v: any) => item[0].linkId == v.linkId);
      let gotFreeQty: number = 0;
      let promotionalFreeItems = salesLine.filter((v: any) => item[0].linkId == v.linkId && v.isItemFree == true);
      promotionalFreeItems.map((v: any) => {
        gotFreeQty += parseInt(v.salesQty);
      });
      Promotionallines.map((v: any) => {
        totalQuantity += parseInt(v.salesQty) - parseInt(v.totalReturnedQuantity);
        totalSettledAmount += parseFloat(v.totalSettledAmount);
        totalReturnedQuantity += parseFloat(v.totalReturnedQuantity);
        remainSalesFinancial += v.remainSalesFinancial ? parseInt(v.remainSalesFinancial) : 0;
      });
      item.map((v: any) => {
        totalReturningQty += v.returnQuantity;
      });
      let totalQuantityAfterReturn = totalQuantity - totalReturningQty;
      console.log(totalQuantity, totalReturningQty, totalQuantityAfterReturn);
      let line: any = salesLine.filter((v: any) => v.id == item[0].id)[0];
      let promotionalParentItem = promotionalDiscountItems.filter((v: any) => v.linkId == line.linkId)[0];
      let promotionalDiscountCondition = promotionalParentItem.appliedDiscounts.filter(
        (v: any) => v.discountType == "PROMOTIONAL_DISCOUNT"
      )[0];
      let promotionalDiscountAmount = promotionalDiscountCondition.discountAmount;
      let multipleQty = promotionalDiscountCondition.cond[0].multipleQty;
      let freeQty = promotionalDiscountCondition.cond[0].freeQty;
      let eligitbleFreeQuantity = Math.floor((totalQuantityAfterReturn - gotFreeQty) / multipleQty) * freeQty;
      eligitbleFreeQuantity = eligitbleFreeQuantity >= 0 ? eligitbleFreeQuantity : 0;
      let discountOnEachItem: number = promotionalDiscountAmount / gotFreeQty;
      let qtyForDeducting = gotFreeQty - eligitbleFreeQuantity - remainSalesFinancial;
      let promotionalDiscount =
        promotionalDiscountAmount -
        discountOnEachItem * eligitbleFreeQuantity -
        discountOnEachItem * remainSalesFinancial;
      promotionalDiscount = promotionalDiscount >= 0 ? promotionalDiscount : 0;
      console.log(linkId);
      discountConditions[linkId] = {
        linkId: item[0].linkId,
        discountAmount: promotionalDiscountAmount,
        totalSettledAmount: totalSettledAmount,
        multipleQty: multipleQty,
        freeQty: freeQty,
        gotFreeQty: gotFreeQty,
        eligibleFreeQty: eligitbleFreeQuantity,
        deductableFreeAmount: promotionalDiscount,
        isAmountDeducated: false,
        totalQuantityAfterReturn: totalQuantityAfterReturn,
        qtyForDeducting: qtyForDeducting,
        discountType: "PROMOTIONAL_DISCOUNT",
      };
    }
    // console.log(discountConditions);
    let returnOrderData: any = await this.allocateReturnOrderData(salesOrderData, type);
    returnOrderData.salesLine = [];
    reqData.selectedBatches = reqData.selectedBatches.filter((v: any) => v.returnQuantity > 0);
    let selectedBatchesGroup = this.groupBy(reqData.selectedBatches, function (item: any) {
      return [item.itemid, item.configid, item.inventsizeid, item.isItemFree, item.salesLineId];
    });
    let selectedBatches: any[] = [];
    selectedBatchesGroup.forEach(function (groupitem: any) {
      const qty = groupitem.reduce((res: number, item: any) => res + parseInt(item.returnQuantity), 0);
      let batch: any = [];
      groupitem.forEach((element) => {
        batch.push({
          batchno: element.batchno,
          returnQuantity: element.returnQuantity,
        });
      });
      groupitem[0].returnQuantity = qty;
      groupitem[0].batches = batch;
      selectedBatches.push(groupitem[0]);
    });
    console.log(selectedBatches);
    let lineNum = 1;
    for (let item of selectedBatches) {
      let line: any = salesLine.filter((v: any) => v.id == item.salesLineId)[0];
      line.colorantprice = line.colorantprice ? line.colorantprice : 0;
      let itemGrossAmount: number =
        (parseFloat(line.salesprice) + parseFloat(line.colorantprice)) * parseInt(item.returnQuantity);
      let itemTotal: number =
        (parseFloat(line.salesprice) + parseFloat(line.colorantprice)) * parseInt(item.returnQuantity);
      let itemDiscount: number = 0;
      let itemVat: number = 0;
      grossAmount += itemGrossAmount;
      let returnItem: any = {};
      this.allocateReturnItem(returnItem, line);
      returnItem.appliedDiscounts = [];
      if (line.appliedDiscounts.length > 0) {
        for (let discountItem of line.appliedDiscounts) {
          if (discountItem.discountType == "TOTAL_DISCOUNT") {
            let returnDiscount =
              (parseFloat(line.salesprice) + parseFloat(line.colorantprice)) *
              (parseFloat(discountItem.percentage) / 100) *
              parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.cond,
            });
          }
          if (discountItem.discountType == "LINE_DISCOUNT") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.cond,
            });
          }
          if (discountItem.discountType == "INTERIOR_AND_EXTERIOR") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }
          if (discountItem.discountType == "SABIC_CUSTOMER_DISCOUNT") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;

            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }
          if (discountItem.discountType == "VOUCHER_DISCOUNT") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }
          if (discountItem.discountType == "SALES_DISCOUNT") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;

            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }
          if (discountItem.discountType == "INSTANT_DISCOUNT") {
            let percentage: number = 0;
            for (let range of discountItem.cond) {
              if (
                totalGrossAmountAfterReturnItems >= parseFloat(range.minamount) &&
                totalGrossAmountAfterReturnItems <= parseFloat(range.maxamount)
              ) {
                percentage = parseInt(range.discpercent);
                break;
              }
            }
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }
          if (discountItem.discountType == "MULTI_LINE_DISCOUNT") {
            let returnDiscount =
              parseFloat(line.salesprice) * (parseFloat(discountItem.percentage) / 100) * parseInt(item.returnQuantity);
            itemDiscount += returnDiscount;
            itemTotal -= returnDiscount;
            returnItem.appliedDiscounts.push({
              discountType: discountItem.discountType,
              percentage: discountItem.percentage,
              discountAmount: returnDiscount,
              cond: discountItem.code,
            });
          }

          if (discountItem.discountType == "BUY_ONE_GET_ONE_DISCOUNT") {
            console.log("========================================", line.isItemFree);
            let returnParentQty: number = 0;
            let returnFreeQty: number = 0;
            let packageItems: any[] = reqData.selectedBatches.filter((v: any) => v.linkId == item.linkId);
            let returningFreeItems: any[] = packageItems.filter((v: any) => v.isItemFree == true);
            let returningParentItems: any[] = packageItems.filter((v: any) => v.isItemFree == false);
            returningFreeItems.map((v: any) => {
              returnFreeQty += parseInt(v.returnQuantity);
            });
            returningParentItems.map((v: any) => {
              returnParentQty += parseInt(v.returnQuantity);
            });

            if (returnParentQty == returnFreeQty) {
              let returnDiscount = 0;
              let itemDiscountAmount = 0;
              if (line.isItemFree) {
                itemDiscountAmount = parseFloat(discountItem.discountAmount);
                returnDiscount = (itemDiscountAmount / parseFloat(line.salesQty)) * parseInt(item.returnQuantity);
                // console.log(returnDiscount);
              } else {
                let returningFreeLines: any[] = salesLine.filter(
                  (v: any) => v.linkId == item.linkId && v.isItemFree == true
                );
                let filteredReturningFreeLines: any[] = [];
                returningFreeItems.map((a: any) => {
                  let returningFreeLine = returningFreeLines.filter((b: any) => b.id == a.salesLineId)[0];
                  returningFreeLine.returnQuantity = a.returnQuantity;
                  filteredReturningFreeLines.push(returningFreeLine);
                });
                filteredReturningFreeLines.map((x: any) => {
                  let d: any[] = x.appliedDiscounts.filter((y: any) => y.discountType == "BUY_ONE_GET_ONE_DISCOUNT");
                  itemDiscountAmount += (parseFloat(d[0].discountAmount) / parseFloat(x.salesQty)) * x.returnQuantity;
                });
                returnDiscount = itemDiscountAmount;
                // console.log(returnDiscount);
              }
              itemDiscount += returnDiscount;
              itemTotal -= returnDiscount;
              returnItem.appliedDiscounts.push({
                discountType: discountItem.discountType,
                percentage: discountItem.percentage,
                discountAmount: returnDiscount,
                cond: discountItem.code,
              });
            } else {
              throw { message: "PLEASE_ADD_FREE_ITEMS" };
            }
          }
        }
      } else {
        itemDiscount += 0;
        itemTotal -= 0;
      }
      if (discountConditions[line.linkId]) {
        let discObj = discountConditions[line.linkId];
        // console.log(discObj);
        returnItem.appliedDiscounts.push({
          discountType: "PROMOTIONAL_DISCOUNT",
          discountAmount: discObj.deductableFreeAmount,
        });
        if (!discObj.isAmountDeducated) {
          itemDiscount += discObj.deductableFreeAmount;
          itemTotal -= discObj.deductableFreeAmount;
          discountConditions[line.linkId].deductableFreeAmount -= discObj.deductableFreeAmount;
          returnItem.remainSalesFinancial = discObj.qtyForDeducting;
          discountConditions[line.linkId].isAmountDeducated = true;
          console.log(total);
        } else {
          itemDiscount += 0;
          total -= 0;
        }
      }

      itemVat = (parseFloat(line.vatamount) / parseInt(line.salesQty)) * parseInt(item.returnQuantity);
      itemTotal += itemVat;
      vat += itemVat;
      discount += itemDiscount;
      total += itemTotal;
      returnItem.salesQty = item.returnQuantity;
      returnItem.qtyOrdered = item.returnQuantity;
      returnItem.lineTotalDisc = itemDiscount;
      returnItem.lineAmount = itemGrossAmount - line.colorantprice * item.returnQuantity;
      returnItem.vatamount = itemVat;
      returnItem.isItemFree = item.isItemFree;
      returnItem.linkId = item.linkId;
      returnItem.lineNum = lineNum;
      returnItem.batches = item.batches;
      returnOrderData.salesLine.push(returnItem);
      lineNum += 1;
    }
    let cashAmount = 0;
    let redeemAmount = 0;
    let designServiceRedeemAmount = 0;
    if (prevReturnOrderAmounts) {
      cashAmount =
        parseFloat(salesOrderData.cashAmount) +
        parseFloat(salesOrderData.cardAmount) -
        parseFloat(prevReturnOrderAmounts.cashAmount);
      redeemAmount = parseFloat(salesOrderData.redeemAmount) - parseFloat(prevReturnOrderAmounts.redeemAmount);
      designServiceRedeemAmount =
        parseFloat(salesOrderData.designServiceRedeemAmount) -
        parseFloat(prevReturnOrderAmounts.designServiceRedeemAmount);
    } else {
      cashAmount = parseFloat(salesOrderData.cashAmount) + parseFloat(salesOrderData.cardAmount);
      redeemAmount = parseFloat(salesOrderData.redeemAmount);
      designServiceRedeemAmount = parseFloat(salesOrderData.designServiceRedeemAmount);
    }
    if (cashAmount >= total) {
      returnOrderData.cashAmount = total;
      returnOrderData.redeemAmount = 0;
      returnOrderData.designServiceRedeemAmount = 0;
    } else if (cashAmount < total) {
      returnOrderData.cashAmount = cashAmount;
      if (designServiceRedeemAmount >= total - cashAmount) {
        returnOrderData.designServiceRedeemAmount = total - cashAmount;
        returnOrderData.redeemAmount = 0;
      } else if (designServiceRedeemAmount < total - cashAmount) {
        returnOrderData.designServiceRedeemAmount = designServiceRedeemAmount;
        returnOrderData.redeemAmount = total - cashAmount - designServiceRedeemAmount;
      }
    }
    // console.log(cashAmount);
    returnOrderData.amount = grossAmount;
    returnOrderData.netAmount = total;
    returnOrderData.disc = discount;
    returnOrderData.vatamount = vat;
    returnOrderData.sumTax = vat;
    if (returnOrderData.designServiceRedeemAmount > 0) {
      sendForApproval = true;
    } else if ((condition.rmApprovalRequired || condition.raApprovalRequired) && sendForApproval) {
      sendForApproval = true;
    } else {
      sendForApproval = false;
    }
    // console.log(sendForApproval, condition);
    return {
      total: total > 0 ? total : 0,
      grossTotal: grossAmount,
      discount: discount,
      vatPrice: vat,
      cashAmount: returnOrderData.cashAmount,
      redeemAmount: returnOrderData.redeemAmount,
      designServiceRedeemAmount: returnOrderData.designServiceRedeemAmount,
      sendForApproval: sendForApproval,
      returnOrderData: returnOrderData,
    };
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

  allocateReturnOrderData(salesOrderData: any, type: string) {
    return {
      salesName: salesOrderData.salesName,
      custAccount: salesOrderData.custAccount,
      invoiceAccount: salesOrderData.invoiceAccount,
      currencyCode: salesOrderData.currencyCode,
      dataareaid: salesOrderData.dataareaid,
      custGroup: salesOrderData.custGroup,
      priceGroupId: salesOrderData.priceGroupId,
      numberSequenceGroup: salesOrderData.numberSequenceGroup,
      interCompanyOriginalSalesId: salesOrderData.salesId,
      salesGroup: salesOrderData.salesGroup,
      cityCode: salesOrderData.cityCode,
      districtCode: salesOrderData.districtCode,
      latitude: salesOrderData.latitude,
      longitude: salesOrderData.longitude,
      painter: salesOrderData.painter,
      taxGroup: salesOrderData.taxGroup,
      mobileNo: salesOrderData.mobileNo,
      isCash: salesOrderData.isCash,
      payment: salesOrderData.payment,
      sumTax: salesOrderData.sumTax,
      inventLocationId: salesOrderData.inventLocationId,
      region: salesOrderData.region,
      dimension: salesOrderData.dimension,
      dimension2_: salesOrderData.dimension2_,
      dimension3_: salesOrderData.dimension3_,
      dimension4_: salesOrderData.dimension4_,
      dimension5_: salesOrderData.dimension5_,
      salesmanId: salesOrderData.salesmanId,
      dimension7_: salesOrderData.dimension7_,
      dimension8_: salesOrderData.dimension8_,
      transkind: type == "purchasereturn" ? "PURCHASERETURN" : "RETURNORDER",
      status: "CREATED",
      warehouse: salesOrderData.warehouse,
    };
  }
  allocateReturnItem(returnItem: any, item: any) {
    returnItem.itemid = item.itemid;
    returnItem.salesprice = item.salesprice;
    returnItem.salesQty = item.returnQuantity;
    returnItem.currencyCode = item.currencyCode;
    returnItem.dataareaid = item.dataareaid;
    returnItem.inventsizeid = item.inventsizeid;
    returnItem.custAccount = item.custAccount;
    returnItem.configId = item.configId;
    returnItem.numberSequenceGroupId = item.numberSequenceGroupId;
    returnItem.inventLocationId = item.inventLocationId;
    returnItem.isItemFree = item.isItemFree;
    returnItem.linkId = item.linkId;
    returnItem.colors = item.colors;
    returnItem.baseSizes = item.baseSizes;
    returnItem.numberSequenceGroupId = item.numberSequenceGroupId;
    returnItem.vat = item.vat;
    returnItem.appliedDiscounts = [];
    returnItem.colorantprice = item.colorantprice;
    returnItem.colorantId = item.colorantId;
  }
}
