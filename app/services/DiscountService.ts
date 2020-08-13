/** @format */

import { RawQuery } from "../common/RawQuery";
import { CusttableDAO } from "../repos/CusttableDAO";
import { getManager } from "typeorm";
import { App } from "../../utils/App";
import { Custtable } from "../../entities/Custtable";
var uuid = require("uuid");

export class DiscountService {
  public sessionInfo: any;
  private rawQuery: RawQuery;
  private custtableDAO: CusttableDAO;
  private db: any;
  constructor() {
    this.rawQuery = new RawQuery();
    this.custtableDAO = new CusttableDAO();
    this.db = getManager();
  }

  async getDiscount(reqData: any) {
    try {
      let result: any;
      let checkCustomer: Custtable;
      let discountBlockItems: any;
      let vendorCustomerAccount: any;
      reqData.customerId = reqData.custaccount;
      reqData.grossTotal = 0;
      reqData.inventLocationId = this.sessionInfo.inventlocationid;
      let defaultCustomer: any = await this.custtableDAO.entity(this.sessionInfo.defaultcustomerid);
      reqData.selectedItems.map((v: any) => {
        reqData.grossTotal += (parseFloat(v.price) + parseFloat(v.colorantprice)) * parseFloat(v.quantity);
      });
      if (reqData.orderType == "purchase") {
        vendorCustomerAccount = defaultCustomer;
        reqData.custaccount = vendorCustomerAccount.accountnum;
        reqData.inventLocationId = reqData.jazeeraWarehouse;
      }
      if (!reqData.custaccount) {
        checkCustomer = defaultCustomer;
        reqData.currency = checkCustomer.currency;
        reqData.custaccount = checkCustomer.accountnum;
        reqData.taxgroup = checkCustomer.taxgroup;
        reqData.walkincustomer = checkCustomer.walkincustomer;
      } else {
        checkCustomer = await this.custtableDAO.entity(reqData.custaccount);
        reqData.custaccount =
          checkCustomer && checkCustomer.walkincustomer == true
            ? this.sessionInfo.defaultcustomerid
            : reqData.custaccount;
        reqData.walkincustomer = checkCustomer.walkincustomer;
        if (!checkCustomer) {
          throw { message: "INVALID_CUSTOMER_CODE" };
        }
      }
      if (!checkCustomer) {
        throw { message: "INVALID_CUSTOMER_CODE" };
      }
      reqData.cashdisc = checkCustomer.cashdisc;
      reqData.paymtermid = checkCustomer.paymtermid;
      reqData.custtype = checkCustomer.walkincustomer ? defaultCustomer.custtype : checkCustomer.custtype;
      reqData.custgroup = checkCustomer.custgroup;
      reqData.mobile = checkCustomer.phone;
      let vatData: any;
      if (reqData.walkincustomer == true) {
        vatData = await this.rawQuery.getCustomerTax(defaultCustomer.taxgroup);
      } else {
        vatData = await this.rawQuery.getCustomerTax(checkCustomer.taxgroup);
      }

      reqData.vat = vatData ? vatData.vat : 15;
      reqData.vat = parseFloat(reqData.vat);
      discountBlockItems = await this.rawQuery.getDiscountBlockItems(
        checkCustomer.custgroup,
        checkCustomer.accountnum,
        reqData.inventLocationId
      );
      let discountBlockItemsArray: any = [];
      discountBlockItems.map((v: any) => {
        discountBlockItemsArray.push(v.itemid);
      });
      let sabicCustomers: any = await this.sessionInfo.sabiccustomers;
      if (sabicCustomers) {
        if (sabicCustomers.split(",").includes(reqData.custaccount)) {
          sabicCustomers = true;
        } else {
          sabicCustomers = false;
        }
      }
      let INTERIOR_AND_EXTERIOR: boolean = false;
      let aramkoTahkomDiscounts = await this.rawQuery.getAramkoTahkomDiscounts(
        reqData.custaccount,
        this.sessionInfo.dataareaid
      );
      if (aramkoTahkomDiscounts.length > 0) {
        INTERIOR_AND_EXTERIOR = true;
      }

      await this.allocateData(reqData);
      if (reqData.selectedItems && reqData.selectedItems.length > 0) {
        if (sabicCustomers) {
          result = await this.sabicCustomersDiscount(reqData, discountBlockItemsArray);
        } else if (INTERIOR_AND_EXTERIOR) {
          result = await this.aramkoTahkomDiscount(reqData, aramkoTahkomDiscounts, discountBlockItemsArray);
        } else {
          result = await this.calDiscount(reqData, discountBlockItemsArray);
        }
      } else {
        result = reqData;
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async calDiscount(reqData: any, discountBlockItemsArray: any) {
    let getDiscountsList = await this.getDiscountsList(reqData);
    let checkDiscounts = getDiscountsList.checkDiscounts;
    let promotionalDiscountItems: any = getDiscountsList.promotionalDiscountItems;
    let buyOneGetOneDiscountItems: any = getDiscountsList.buyOneGetOneDiscountItems;
    let salesDiscountItems: any = getDiscountsList.salesDiscountItems;
    let discounts: any = getDiscountsList.discounts;
    reqData.discount = 0;
    reqData.voucherdiscamt = 0;
    let isTotalDiscount: boolean = discounts[0].enddisc && discounts[0].enddisc != "" ? true : false;
    let isLineDiscount: boolean = discounts[0].linedisc && discounts[0].linedisc != "" ? true : false;
    let isMultiLineDiscount: boolean = discounts[0].multilinedisc && discounts[0].multilinedisc != "" ? true : false;
    let isNoDiscount: boolean = false;
    let totalPercentage: any = await this.rawQuery.getTotalDiscPercentage(
      discounts[0].enddisc,
      reqData.currency,
      this.sessionInfo.dataareaid
    );
    let linePercentage: any = await this.rawQuery.getTotalDiscPercentage(
      discounts[0].linedisc,
      reqData.currency,
      this.sessionInfo.dataareaid
    );
    let multilineDiscRanges: any = await this.rawQuery.getMultiDiscRanges(
      discounts[0].multilinedisc,
      reqData.currency,
      this.sessionInfo.dataareaid
    );
    let multilineQuantity: number = 0;
    let multiLineItemCode = multilineDiscRanges.map((v: any) => {
      return v.itemrelation;
    });
    let multlineDiscItems: any = checkDiscounts.filter((v: any) => multiLineItemCode.includes(v.multilinedisc));
    multlineDiscItems = multlineDiscItems.map((v: any) => {
      return v.itemid;
    });
    reqData.selectedItems.map((v: any) => {
      if (multlineDiscItems.includes(v.itemid)) {
        multilineQuantity += parseInt(v.quantity);
      }
    });
    let total: number = 0;
    let totalBeforeVat: number = 0;
    let grossTotal: number = 0;
    let vouchers: any;
    let isValidVoucher: boolean = false;
    let isVoucherApplied: boolean = false;
    let voucherDiscountedItems: any = [];
    let message: string;
    let instantDiscountRanges: any = [];
    let isInstantDiscount: boolean = false;
    let instantDiscountExcludeItems: any;
    let isCashDisc: boolean = false;
    if (
      reqData.paymtermid != "CASH" &&
      reqData.paymtermid != "" &&
      reqData.isCash == true &&
      reqData.cashdisc != null &&
      reqData.cashdisc.trim() != ""
    ) {
      isTotalDiscount = true;
      isCashDisc = true;
      totalPercentage = "5%";
    } else if (reqData.paymtermid != "CASH" && reqData.paymtermid != "" && reqData.isCash == false) {
      isTotalDiscount = false;
      isCashDisc = false;
      totalPercentage = 0;
    }
    if (reqData.instantDiscountChecked) {
      if (reqData.walkincustomer) {
        instantDiscountRanges = await this.rawQuery.checkInstantDiscount(this.sessionInfo.defaultcustomerid);
      } else {
        instantDiscountRanges = await this.rawQuery.checkInstantDiscount(reqData.custaccount);
      }
    }

    if (reqData.voucherDiscountChecked) {
      if (reqData.code) {
        vouchers = await this.rawQuery.getVoucherDiscounts(reqData.code, this.sessionInfo.dataareaid);
        if (vouchers) {
          if (vouchers.voucher_type == "JUNE_SALES_VOUCHER_DISCOUNT") {
            reqData.isOTPRequired = true;
          } else {
            reqData.isOTPRequired = false;
          }
          let inQueryStr = "";
          reqData.selectedItems.map((v: any) => {
            inQueryStr += "'" + v.itemid + "',";
          });
          let voucherDiscountedItem = await this.rawQuery.getVoucherDiscountItems(
            vouchers.voucher_type,
            inQueryStr.substr(0, inQueryStr.length - 1)
          );
          voucherDiscountedItems = [];
          voucherDiscountedItem.map((v: any) => {
            voucherDiscountedItems.push(v.itemid);
          });
          if (
            vouchers.is_enabled == 1 ||
            vouchers.allowed_numbers <= vouchers.used_numbers ||
            new Date(vouchers.expiry_date) < new Date(App.DateNow())
          ) {
            if (vouchers.is_enabled == 1) {
              isValidVoucher = false;
              message = "INVALID_VOUCHER";
            } else if (vouchers.allowed_numbers <= vouchers.used_numbers) {
              isValidVoucher = false;
              message = "ALREADY_USED";
            } else if (new Date(vouchers.expiry_date) < new Date(App.DateNow())) {
              isValidVoucher = false;
              message = "VOUCHER_EXPIRED";
            }
          } else {
            if (vouchers.custaccount == "" || !vouchers.custaccount) {
              isValidVoucher = true;
            } else {
              if (
                vouchers.custaccount == reqData.customerId ||
                reqData.custtype.toString() == vouchers.custaccount.toString() ||
                reqData.mobile == vouchers.custaccount ||
                vouchers.custaccount.includes(reqData.customerId) ||
                reqData.customerId.includes(vouchers.custaccount)
              ) {
                isValidVoucher = true;
              } else {
                isValidVoucher = false;
              }
            }
          }
        } else {
          message = "INVALID_VOUCHER";
        }
      }
    }
    for (let item of reqData.selectedItems) {
      let isValidVoucherItem: boolean = isValidVoucher;
      let instantDiscountPercent: number = 0;
      let isSalesDiscount: boolean = false;
      if (instantDiscountRanges.length > 0) {
        isInstantDiscount = true;
        instantDiscountExcludeItems = await this.rawQuery.instantDiscountExcludeItems(
          this.sessionInfo.usergroupconfigid
        );
        instantDiscountExcludeItems = instantDiscountExcludeItems[0].istantdiscountexclude
          ? instantDiscountExcludeItems[0].istantdiscountexclude.split(",")
          : [];

        for (let item of instantDiscountRanges) {
          if (
            reqData.grossTotal &&
            reqData.grossTotal >= parseFloat(item.minamount) &&
            reqData.grossTotal <= parseFloat(item.maxamount)
          ) {
            instantDiscountPercent = item.discpercent;
            break;
          }
        }
      }
      isMultiLineDiscount = multilineDiscRanges.length > 0 ? true : false;
      if (isMultiLineDiscount) {
        let multilinefilter = checkDiscounts.filter(
          (v: any) => v.multilinedisc == multilineDiscRanges[0].itemrelation && v.itemid == item.itemid
        );
        isMultiLineDiscount = multilinefilter.length > 0 ? true : false;
      }

      let salesDiscount: any[] = salesDiscountItems.filter((v: any) => v.itemid == item.itemid);
      salesDiscount = salesDiscount.length > 0 ? salesDiscount[0] : null;
      isSalesDiscount = salesDiscount ? true : false;
      if (reqData.voucherDiscountChecked && isValidVoucher) {
        isValidVoucherItem = vouchers.voucher_type == "ALL_ITEMS" ? true : voucherDiscountedItems.includes(item.itemid);
        if (!isValidVoucherItem) {
          message = "voucher is not valid for selected products";
        }
      }
      let condition: any =
        (reqData.discountType == "voucherDiscount" && isValidVoucherItem) || reqData.instantDiscountChecked
          ? "true"
          : "!item.isItemFree";
      condition = eval(condition);
      item.lineTotalDisc = 0;
      if (condition) {
        let appliedDiscounts: any = [];
        let freeQty: number = 0;
        let freeItem: any;
        let promotionalDiscountAmount: number = 0;
        let buy_one_get_one: number = 0;
        let promotionalDiscountDetails = promotionalDiscountItems.filter((v: any) => v.itemid == item.itemid);
        let isPromotionDiscount: boolean = false;
        let isBuyOneGetOneDiscount: boolean = false;
        let buyOneGetOneDiscountDetails: any;
        if ((!reqData.voucherDiscountChecked || isValidVoucherItem == false) && !reqData.instantDiscountChecked) {
          promotionalDiscountDetails = promotionalDiscountDetails.length > 0 ? promotionalDiscountDetails[0] : null;
          let selectedQuantity = reqData.selectedItems
            .filter((v: any) => v.itemid == v.itemid && v.inventsizeid == v.inventsizeid)
            .reduce((res: number, item: any) => res + parseInt(item.quantity), 0);
          if (promotionalDiscountDetails && item.isParent) {
            if (promotionalDiscountDetails.multipleQty && selectedQuantity >= promotionalDiscountDetails.multipleQty) {
              isPromotionDiscount = true;
              let freeItems: any = reqData.selectedItems.filter(
                (v: any) => v.linkId == item.linkId && v.isItemFree == true
              );
              for (let j in freeItems) {
                let i: number = reqData.selectedItems.indexOf(freeItems[j]);
                reqData.selectedItems[i].appliedDiscounts = [];
                promotionalDiscountAmount +=
                  parseFloat(reqData.selectedItems[i].price) * parseFloat(reqData.selectedItems[i].quantity);
                if (isCashDisc || isTotalDiscount) {
                  await this.totalDiscount(reqData.selectedItems[i], reqData, checkDiscounts, totalPercentage);
                  if (reqData.selectedItems[i].enddiscamt > 0) {
                    reqData.selectedItems[i].appliedDiscounts.push({
                      discountType: "TOTAL_DISCOUNT",
                      percentage: reqData.selectedItems[i].endDisc,
                      discountAmount: reqData.selectedItems[i].enddiscamt,
                      cond: [],
                    });
                  }
                } else {
                  await this.totalDiscount(reqData.selectedItems[i], reqData, checkDiscounts, 0);
                }
                reqData.selectedItems[i].lineamountafterdiscount = parseFloat(
                  reqData.selectedItems[i].priceAfterdiscount
                );
                reqData.selectedItems[i].vat = reqData.vat;
                reqData.selectedItems[i].vatamount =
                  parseFloat(reqData.selectedItems[i].priceAfterdiscount) * (reqData.selectedItems[i].vat / 100);
                reqData.selectedItems[i].priceAfterVat =
                  parseFloat(reqData.selectedItems[i].priceAfterdiscount) +
                  parseFloat(reqData.selectedItems[i].vatamount);
                total += reqData.selectedItems[i].priceAfterVat;
                totalBeforeVat += reqData.selectedItems[i].lineamountafterdiscount;
                grossTotal +=
                  (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                  parseInt(reqData.selectedItems[i].quantity);
              }
              freeQty =
                Math.floor(item.quantity / promotionalDiscountDetails.multipleQty) * promotionalDiscountDetails.freeQty;
            }
          }
          if (promotionalDiscountAmount > 0) {
            isPromotionDiscount = true;
          } else {
            isPromotionDiscount = false;
          }
          buyOneGetOneDiscountDetails = buyOneGetOneDiscountItems.filter((v: any) => v.itemid == item.itemid);
          buyOneGetOneDiscountDetails = buyOneGetOneDiscountDetails.length > 0 ? buyOneGetOneDiscountDetails[0] : null;
          if (buyOneGetOneDiscountDetails) {
            if (buyOneGetOneDiscountDetails.multipleQty && item.quantity >= buyOneGetOneDiscountDetails.multipleQty) {
              isBuyOneGetOneDiscount = true;
            }
          }
          if (discountBlockItemsArray.includes(item.itemid)) {
            isNoDiscount = true;
            await this.noDiscount(item, reqData);
            total += item.priceAfterVat * parseInt(item.quantity);
            totalBeforeVat += parseFloat(item.lineamountafterdiscount);
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
          }
          if (isBuyOneGetOneDiscount) {
            let freeItems: any = reqData.selectedItems.filter(
              (v: any) => v.linkId == item.linkId && v.isItemFree == true
            );

            for (let j in freeItems) {
              let i: number = reqData.selectedItems.indexOf(freeItems[j]);
              reqData.selectedItems[i].appliedDiscounts = [];
              let itemDiscount: any = parseFloat(reqData.selectedItems[i].price) / 2;
              buy_one_get_one += parseFloat(itemDiscount) * parseInt(reqData.selectedItems[i].quantity);
              reqData.selectedItems[i].buyOneGetOneDiscount =
                parseFloat(itemDiscount) * parseInt(reqData.selectedItems[i].quantity);
              if (isCashDisc || isTotalDiscount) {
                await this.totalDiscount(reqData.selectedItems[i], reqData, checkDiscounts, totalPercentage);
                if (reqData.selectedItems[i].enddiscamt > 0) {
                  reqData.selectedItems[i].appliedDiscounts.push({
                    discountType: "TOTAL_DISCOUNT",
                    percentage: reqData.selectedItems[i].endDisc,
                    discountAmount: reqData.selectedItems[i].enddiscamt,
                    cond: [],
                  });
                }
              }

              await this.buyOneGetOneDiscount(reqData.selectedItems[i], reqData);
              reqData.selectedItems[i].appliedDiscounts.push({
                discountType: "BUY_ONE_GET_ONE_DISCOUNT",
                discountAmount: reqData.selectedItems[i].buyOneGetOneDiscount,
                cond: [
                  {
                    multipleQty: buyOneGetOneDiscountDetails.multipleQty,
                    freeQty: buyOneGetOneDiscountDetails.freeQty,
                  },
                ],
              });

              reqData.selectedItems[i].lineamountafterdiscount = parseFloat(
                reqData.selectedItems[i].priceAfterdiscount
              );
              reqData.selectedItems[i].vat = reqData.vat;
              reqData.selectedItems[i].vatamount =
                parseFloat(reqData.selectedItems[i].priceAfterdiscount) * (reqData.selectedItems[i].vat / 100);
              reqData.selectedItems[i].priceAfterVat =
                parseFloat(reqData.selectedItems[i].priceAfterdiscount) +
                parseFloat(reqData.selectedItems[i].vatamount);
              total += item.priceAfterVat;
              totalBeforeVat += reqData.selectedItems[i].lineamountafterdiscount;
              grossTotal +=
                (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                parseInt(reqData.selectedItems[i].quantity);
            }
            if (buy_one_get_one > 0) {
              isBuyOneGetOneDiscount = true;
            } else {
              isBuyOneGetOneDiscount = false;
            }
          }
        }
        if (!isNoDiscount) {
          // if (isValidVoucher) {
          //   if (vouchers) {
          //     if (vouchers.voucher_type == "ALL_ITEMS") {
          //       isValidVoucher = true;
          //     } else {
          //       isValidVoucher = voucherDiscountedItems.includes(item.itemid);
          //     }
          //   }
          // }
          if (isInstantDiscount && !isNoDiscount) {
            if (
              instantDiscountExcludeItems.includes(item.itemid) ||
              instantDiscountExcludeItems.includes(item.product.itemGroupId || item.product.intExt != 4)
            ) {
              isInstantDiscount = false;
            } else {
              isInstantDiscount = true;
            }
          }
          if (isValidVoucherItem) {
            isVoucherApplied = true;
            await this.calVoucherDiscount(item, reqData, vouchers);
            if (item.voucherdiscamt > 0) {
              appliedDiscounts.push({
                discountType: "VOUCHER_DISCOUNT",
                percentage: item.voucherdisc,
                discountAmount: item.voucherdiscamt,
              });
            }
            total += item.priceAfterVat;
            totalBeforeVat += parseFloat(item.lineamountafterdiscount);
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
          } else if (isInstantDiscount && !isNoDiscount && !isSalesDiscount) {
            await this.calInstantDiscount(reqData, item, instantDiscountPercent);
            total += item.priceAfterVat;
            totalBeforeVat += item.lineamountafterdiscount;
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
            if (item.instantdiscamt > 0) {
              appliedDiscounts.push({
                discountType: "INSTANT_DISCOUNT",
                percentage: item.instantDisc,
                discountAmount: item.instantdiscamt,
                cond: instantDiscountRanges,
              });
            }
          } else if (isSalesDiscount) {
            await this.calSalesDiscount(item, reqData, salesDiscount);
            if (item.salesdiscamt > 0) {
              appliedDiscounts.push({
                discountType: "SALES_DISCOUNT",
                percentage: item.salesdisc,
                discountAmount: item.salesdiscamt,
              });
            }
            total += item.priceAfterVat;
            totalBeforeVat += parseFloat(item.lineamountafterdiscount);
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
          } else if (
            !isLineDiscount &&
            !isTotalDiscount &&
            !isMultiLineDiscount &&
            !isPromotionDiscount &&
            !isBuyOneGetOneDiscount
          ) {
            await this.noDiscount(item, reqData);
            total += item.priceAfterVat;
            totalBeforeVat += parseFloat(item.lineamountafterdiscount);
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
          } else {
            if (isTotalDiscount && !isNoDiscount) {
              await this.totalDiscount(item, reqData, checkDiscounts, totalPercentage);
              if (item.enddiscamt > 0) {
                appliedDiscounts.push({
                  discountType: "TOTAL_DISCOUNT",
                  percentage: item.endDisc,
                  discountAmount: item.enddiscamt,
                  cond: [],
                });
              }
            }
            if (isLineDiscount && !isNoDiscount && !isMultiLineDiscount) {
              await this.lineDiscount(item, reqData, checkDiscounts, linePercentage);
              if (item.linediscamt > 0) {
                appliedDiscounts.push({
                  discountType: "LINE_DISCOUNT",
                  percentage: item.linediscpercent,
                  discountAmount: item.linediscamt,
                  cond: [],
                });
              }
            }
            if (isMultiLineDiscount && !isNoDiscount) {
              await this.getMultiLinePercent(
                item,
                multilineDiscRanges,
                checkDiscounts,
                discounts[0].multilinedisc,
                multilineQuantity
              );
              await this.multiLineDiscount(item, reqData);
              if (item.multilnPercent > 0) {
                appliedDiscounts.push({
                  discountType: "MULTI_LINE_DISCOUNT",
                  discountAmount: item.multilndisc,
                  percentage: item.multilnPercent,
                  cond: multilineDiscRanges,
                });
              }
              item.multilndisc;
              item.multilnPercent;
            }
            if (isPromotionDiscount && !isNoDiscount) {
              if (promotionalDiscountAmount > 0) {
                item.promotionalDiscount = promotionalDiscountAmount;
                item.supplMultipleQty = promotionalDiscountDetails.multipleQty;
                item.supplFreeQty = promotionalDiscountDetails.freeQty;
                await this.promotionalDiscount(item, reqData);
                appliedDiscounts.push({
                  discountType: "PROMOTIONAL_DISCOUNT",
                  discountAmount: item.promotionalDiscount,
                  cond: [
                    {
                      multipleQty: promotionalDiscountDetails.multipleQty,
                      freeQty: promotionalDiscountDetails.freeQty,
                    },
                  ],
                });
              }
            }
            if (isBuyOneGetOneDiscount && !isNoDiscount) {
              item.buyOneGetOneDiscount = buy_one_get_one;
              await this.buyOneGetOneDiscount(item, reqData);
              appliedDiscounts.push({
                discountType: "BUY_ONE_GET_ONE_DISCOUNT",
                discountAmount: buy_one_get_one,
                cond: [
                  {
                    multipleQty: buyOneGetOneDiscountDetails.multipleQty,
                    freeQty: buyOneGetOneDiscountDetails.freeQty,
                  },
                ],
              });
            }
            item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
            item.vat = reqData.vat;
            item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
            item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
            total += item.priceAfterVat;
            totalBeforeVat += item.lineamountafterdiscount;
            grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
          }
          item.netAmount = item.priceAfterVat;
        }
        appliedDiscounts.map((v: any) => {
          v.percentage = v.percentage ? parseFloat(v.percentage) : v.percentage;
        });
        item.appliedDiscounts = appliedDiscounts;
      }
    }
    reqData.total = total;
    reqData.grossTotal = grossTotal;
    reqData.totalBeforeVat = totalBeforeVat;
    reqData.isVoucherApplied = isVoucherApplied;
    if (isVoucherApplied) {
      reqData.message = `You Saved ${reqData.voucherdiscamt.toFixed(2)} from this Voucher`;
    } else {
      if (message) {
        reqData.message = message;
      } else {
        reqData.message = "voucher not applied";
      }
      if (reqData.isOTORequired) {
        reqData.isOTORequired = false;
      }
    }

    await this.calData(reqData);
    return reqData;
  }

  async totalDiscount(item: any, reqData: any, checkDiscounts: any, totalPercentage: any) {
    let enddisc = checkDiscounts.filter((v: any) => v.itemid == item.itemid);
    let dummyData: any = {};
    dummyData.enddisc = "";
    enddisc = enddisc.length > 0 ? enddisc[0] : dummyData;
    if (enddisc.enddisc == "1") {
      totalPercentage = totalPercentage;
    } else {
      totalPercentage = 0;
    }
    item.endDisc = parseFloat(totalPercentage);
    item.enddiscamt =
      (parseFloat(item.price) + parseFloat(item.colorantprice)) *
      parseInt(item.quantity) *
      (parseFloat(totalPercentage) / 100);
    item.priceAfterdiscount =
      (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity) - parseFloat(item.enddiscamt);
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
    item.lineTotalDisc += item.enddiscamt;
    reqData.discount += item.enddiscamt;
  }

  async lineDiscount(item: any, reqData: any, checkDiscounts: any, linePercentage: any = 0) {
    let linedisc = checkDiscounts.filter((v: any) => v.itemid == item.itemid);
    let dummyData: any = {};
    dummyData.linedisc = "";
    linedisc = linedisc.length > 0 ? linedisc[0] : dummyData;
    if (linedisc && linedisc.linedisc && linedisc.linedisc != "") {
      linePercentage = linePercentage;
    } else {
      linePercentage = 0;
    }
    item.linediscpercent = parseFloat(linePercentage);
    item.linediscamt = parseFloat(item.price) * parseInt(item.quantity) * (parseFloat(linePercentage) / 100);
    item.priceAfterdiscount =
      (parseFloat(item.priceAfterdiscount)
        ? parseFloat(item.priceAfterdiscount) - parseFloat(item.linediscamt)
        : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity) - parseFloat(item.linediscamt);
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
    item.lineTotalDisc += parseFloat(item.linediscamt);
    reqData.discount += parseFloat(item.linediscamt);
    // }
  }

  async multiLineDiscount(line: any, reqData: any) {
    line.multilnPercent = line.multilnPercent ? parseFloat(line.multilnPercent) : 0;
    line.multilndisc = parseFloat(line.price) * parseInt(line.quantity) * (parseFloat(line.multilnPercent) / 100);
    let productPrice: number = (parseFloat(line.price) + parseFloat(line.colorantprice)) * line.quantity;
    line.priceAfterdiscount = line.priceAfterdiscount
      ? parseFloat(line.priceAfterdiscount) - parseFloat(line.multilndisc)
      : productPrice - parseFloat(line.multilndisc);
    line.lineTotalDisc = line.lineTotalDisc ? line.lineTotalDisc : 0;
    line.lineTotalDisc += line.multilndisc;
    reqData.discount += line.multilndisc;
  }

  async buyOneGetOneDiscount(item: any, reqData: any) {
    item.priceAfterdiscount = parseFloat(item.priceAfterdiscount)
      ? parseFloat(item.priceAfterdiscount) - parseFloat(item.buyOneGetOneDiscount)
      : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
        parseFloat(item.buyOneGetOneDiscount);
    item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
    item.lineTotalDisc += parseFloat(item.buyOneGetOneDiscount);
    reqData.discount += item.buyOneGetOneDiscount;
  }
  async promotionalDiscount(item: any, reqData: any) {
    item.priceAfterdiscount = parseFloat(item.priceAfterdiscount)
      ? parseFloat(item.priceAfterdiscount) - item.promotionalDiscount
      : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - item.promotionalDiscount;
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
    item.lineTotalDisc += parseFloat(item.promotionalDiscount);
    reqData.discount += item.promotionalDiscount;
  }
  async aramkoTahkomDiscount(reqData: any, aramkoTahkomDiscounts: any, discountBlockItemsArray: any) {
    let total: any = 0;
    let totalBeforeVat: number = 0;
    let grossTotal: any = 0;
    let totalPercentage: any = 0;
    reqData.discount = reqData.discount ? reqData.discount : 0;
    let inQueryStr: string = ``;
    reqData.selectedItems.forEach((v: any) => {
      inQueryStr += "'" + v.itemid + "',";
    });
    inQueryStr = inQueryStr.length > 1 ? inQueryStr.substr(0, inQueryStr.length - 1) : inQueryStr;
    let itemTypes: any = await this.db.query(
      `select itemid, int_ext as "intExt" from inventtable where itemid in (${inQueryStr})`
    );
    for (let item of reqData.selectedItems) {
      let itemtype: any = itemTypes.filter((v: any) => v.itemid == item.itemid);
      itemtype = itemtype.length > 0 ? itemtype[0] : {};
      let filteredItem = aramkoTahkomDiscounts.filter((v: any) => v.intExt == itemtype.intExt);
      filteredItem = filteredItem.length > 0 ? filteredItem[0] : {};
      totalPercentage = filteredItem.salesDiscount ? filteredItem.salesDiscount : 0;
      if (discountBlockItemsArray.includes(item.itemid)) {
        await this.noDiscount(item, reqData);
        total += item.priceAfterVat * parseInt(item.quantity);
        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
      } else {
        item.aramkoTahkomDiscount = parseFloat(item.price) * item.quantity * (parseFloat(totalPercentage) / 100);
        item.priceAfterdiscount =
          (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
          parseFloat(item.aramkoTahkomDiscount);
        item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
        item.vat = reqData.vat;
        item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
        item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
        item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
        item.lineTotalDisc = item.aramkoTahkomDiscount;
        total += item.priceAfterVat;
        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
        reqData.discount += item.aramkoTahkomDiscount;
        item.netAmount = item.priceAfterVat;
        item.appliedDiscounts = [
          {
            discountType: "INTERIOR_AND_EXTERIOR",
            percentage: totalPercentage,
            discountAmount: item.aramkoTahkomDiscount,
          },
        ];
      }
    }
    reqData.total = total;
    reqData.grossTotal = grossTotal;
    reqData.totalBeforeVat = totalBeforeVat;
    reqData.isVoucherApplied = false;
    reqData.message = "For Aramko And Thahakom Customers Other Discounts Will Not Apply";
    return reqData;
  }

  async calVoucherDiscount(item: any, reqData: any, voucher: any) {
    item.voucherdisc = parseFloat(voucher.discount_percent);
    item.voucherdiscamt = parseFloat(item.price) * item.quantity * (parseFloat(voucher.discount_percent) / 100);
    item.priceAfterdiscount =
      (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - parseFloat(item.voucherdiscamt);
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.vat = reqData.vat;
    item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
    item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
    item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    item.lineTotalDisc += item.voucherdiscamt;
    reqData.discount += item.voucherdiscamt;
    reqData.voucherdiscamt += item.voucherdiscamt;
  }

  async calSalesDiscount(item: any, reqData: any, salesDiscount: any) {
    item.salesdisc = parseFloat(salesDiscount.discount);
    item.salesdiscamt = parseFloat(item.price) * item.quantity * (parseFloat(salesDiscount.discount) / 100);
    item.priceAfterdiscount =
      (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - parseFloat(item.salesdiscamt);
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.vat = reqData.vat;
    item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
    item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
    item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    item.lineTotalDisc += item.salesdiscamt;
    reqData.discount += item.salesdiscamt;
  }

  async calInstantDiscount(reqData: any, item: any, discount: number) {
    item.instantDisc = discount;
    item.instantdiscamt = parseFloat(item.price) * item.quantity * (discount / 100);
    item.priceAfterdiscount =
      (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - parseFloat(item.instantdiscamt);
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.vat = reqData.vat;
    item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
    item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
    item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    item.lineTotalDisc += item.instantdiscamt;
    reqData.discount += item.instantdiscamt;
  }

  async sabicCustomersDiscount(reqData: any, discountBlockItemsArray: any) {
    let total: any = 0;
    let totalBeforeVat: number = 0;
    let grossTotal: any = 0;
    let totalPercentage: any = 10;
    reqData.discount = reqData.discount ? reqData.discount : 0;
    for (let item of reqData.selectedItems) {
      if (discountBlockItemsArray.includes(item.itemid)) {
        await this.noDiscount(item, reqData);
        total += item.priceAfterVat;
        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
      } else {
        item.sabicCustomerDiscount = parseFloat(item.price) * item.quantity * (parseFloat(totalPercentage) / 100);
        item.priceAfterdiscount =
          (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
          parseFloat(item.sabicCustomerDiscount);
        item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
        item.vat = reqData.vat;
        item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
        item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
        item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
        item.lineTotalDisc = item.sabicCustomerDiscount;
        total += item.priceAfterVat;
        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
        reqData.discount += item.sabicCustomerDiscount;
        item.netAmount = item.priceAfterVat;
        item.appliedDiscounts = [
          {
            discountType: "SABIC_CUSTOMER_DISCOUNT",
            percentage: parseFloat(totalPercentage),
            discountAmount: item.sabicCustomerDiscount,
          },
        ];
      }
    }
    reqData.total = total;
    reqData.grossTotal = grossTotal;
    reqData.totalBeforeVat = totalBeforeVat;
    reqData.isVoucherApplied = false;
    reqData.message = "For Sabic Customers Other Discounts Will Not Apply";
    return reqData;
  }

  async noDiscount(item: any, reqData: any) {
    item.priceAfterdiscount = (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
    item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
    item.vat = reqData.vat;
    item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
    item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
    item.lineTotalDisc += item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    reqData.discount += 0;
  }

  async getDiscountsList(reqData: any) {
    let inQueryStr = "";
    reqData.selectedItems.map((v: any) => {
      inQueryStr += "'" + v.itemid + "',";
    });
    let checkDiscounts = await this.rawQuery.checkDiscounts(inQueryStr.substr(0, inQueryStr.length - 1));
    let promotionalDiscountItems: any = await this.rawQuery.getPromotionalDiscountItems(
      inQueryStr.substr(0, inQueryStr.length - 1),
      reqData.inventLocationId,
      reqData.custaccount,
      reqData.custtype
    );
    let buyOneGetOneDiscountItems: any = await this.rawQuery.getBuyOneGetOneDiscountItems(
      inQueryStr.substr(0, inQueryStr.length - 1),
      reqData.inventLocationId,
      reqData.custaccount,
      reqData.custtype
    );
    let discounts: any = await this.rawQuery.getDiscounts(reqData.custaccount);
    let salesDiscountItems: any = await this.rawQuery.getSalesDisocuntItems(
      inQueryStr.substr(0, inQueryStr.length - 1),
      reqData.inventLocationId,
      reqData.custaccount,
      reqData.custtype
    );
    console.log(salesDiscountItems);
    return await {
      checkDiscounts: checkDiscounts,
      promotionalDiscountItems: promotionalDiscountItems,
      discounts: discounts,
      buyOneGetOneDiscountItems: buyOneGetOneDiscountItems,
      salesDiscountItems: salesDiscountItems,
    };
  }

  getMultiLinePercent(
    line: any,
    multilineDiscRanges: any,
    checkDiscounts: any,
    multiLineDisc: string,
    quantity: number
  ) {
    let percent = 0;
    let conditionQuantity = 0;
    for (let element of multilineDiscRanges) {
      conditionQuantity = parseFloat(element.quantityamount);
      percent = parseFloat(element.percent1);
      if (quantity > conditionQuantity && quantity <= parseFloat(element.quantityamount)) {
        line.multilnPercent = percent;
        line.multilineDiscRanges = multilineDiscRanges;
      } else if (quantity > conditionQuantity) {
        line.multilnPercent = percent;
        line.multilineDiscRanges = multilineDiscRanges;
      }
    }
  }

  takeTwoDecimalValues(value: number) {
    return parseFloat(value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
  }

  calData(reqData: any) {
    reqData.vatamount = 0;
    reqData.vat = parseFloat(reqData.vat);
    for (let ele of reqData.selectedItems) {
      ele.lineamount = (ele.price + ele.colorantprice) * ele.quantity + ele.vatamount - ele.lineTotalDisc;
      ele.priceAfterdiscount = ele.priceAfterdiscount;
      ele.lineamountafterdiscount = ele.lineamountafterdiscount;
      ele.vatamount = ele.vatamount;
      ele.vat = parseFloat(ele.vat);
      ele.priceAfterVat = ele.priceAfterVat;
      ele.lineTotalDisc = ele.lineTotalDisc;
      ele.lineamount = ele.lineamount;
      ele.netAmount = ele.netAmount;
      reqData.vatamount += ele.vatamount;
    }
    reqData.vatamount = reqData.vatamount;
    reqData.discount = reqData.discount;
    reqData.totalBeforeVat = reqData.totalBeforeVat;
    reqData.total = reqData.total;
    reqData.grossTotal = reqData.grossTotal;
  }

  allocateData(reqData: any) {
    reqData.selectedItems.forEach((ele: any) => {
      delete ele.instantDisc;
      delete ele.instantdiscamt;
      delete ele.vat;
      delete ele.vatamount;
      delete ele.priceAfterVat;
      delete ele.lineTotalDisc;
      delete ele.priceAfterdiscount;
      delete ele.multilndisc;
      delete ele.multilnPercent;
      delete ele.lineamountafterdiscount;
      delete ele.endDisc;
      delete ele.enddiscamt;
      delete ele.linediscpercent;
      delete ele.linediscamt;
      delete ele.lineTotalDisc;
      delete ele.sabicCustomerDiscount;
      delete ele.appliedDiscounts;
    });
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
}
