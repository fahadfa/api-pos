"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var SalesTableDAO_1 = require("../repos/SalesTableDAO");
var RawQuery_1 = require("../common/RawQuery");
var ReturnOrderAmountService = /** @class */ (function () {
    function ReturnOrderAmountService() {
        this.salesTableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
    }
    ReturnOrderAmountService.prototype.getReturnOrderAmount = function (reqData, type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, t0, total, grossTotal, discount, vatPrice, newTotal, newGrossTotal, newDiscount, newVatPrice, salesOrderData, returnItems, returnFreeItems, nonCondDiscounts, condDiscounts, totalGrossAmount, returnItemsGrossAmount, totalGrossAmountAfterReturnItems, returnOrderData, _loop_1, this_1, _i, returnItems_1, item, t1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        t0 = new Date().getTime();
                        total = 0;
                        grossTotal = 0;
                        discount = 0;
                        vatPrice = 0;
                        newTotal = 0;
                        newGrossTotal = 0;
                        newDiscount = 0;
                        newVatPrice = 0;
                        return [4 /*yield*/, this.salesTableDAO.entity(reqData.salesid.toUpperCase())];
                    case 1:
                        salesOrderData = _b.sent();
                        returnItems = [];
                        returnFreeItems = [];
                        nonCondDiscounts = ["TOTAL_DISCOUNT", "LINE_DISCOUNT", "ARAMKO_TAHAKOM_DISOUNT", "SABIC_CUSTOMER_DISCOUNT", "VOUCHER_DISCOUNT"];
                        condDiscounts = ["BUY_ONE_GET_ONE_DISCOUNT", "PROMOTIONAL_DISCOUNT", "INSTANT_DISCOUNT", "MULTI_LINE_DISCOUNT"];
                        totalGrossAmount = 0;
                        returnItemsGrossAmount = 0;
                        salesOrderData.salesLine.forEach(function (v) {
                            totalGrossAmount += parseFloat(v.lineAmount) - v.totalSettledAmount;
                            var returnBatches = reqData.selectedBatches.filter(function (item) { return v.itemid == item.itemid && v.configId == item.configid && v.inventsizeid == item.inventsizeid; });
                            // console.log(returnBatches);
                            var returnQuantity = 0;
                            returnBatches.map(function (b) {
                                returnQuantity += b.returnQuantity;
                            });
                            if (returnQuantity > 0) {
                                v.returnQuantity = returnQuantity;
                                if (!v.isItemFree) {
                                    returnItems.push(v);
                                }
                                else if (v.isItemFree) {
                                    returnFreeItems.push(v);
                                }
                            }
                            returnItemsGrossAmount += parseFloat(v.salesprice) * returnQuantity;
                        });
                        returnFreeItems.map(function (v) {
                            var index = returnItems.findIndex(function (pv) { return pv.linkId == v.linkId; });
                            if (index == -1) {
                                index = salesOrderData.salesLine.findIndex(function (pv) { return pv.linkId == v.linkId; });
                                if (index != -1) {
                                    salesOrderData.salesLine[index].returnQuantity = 0;
                                    returnItems.push(salesOrderData.salesLine[index]);
                                }
                            }
                        });
                        totalGrossAmountAfterReturnItems = totalGrossAmount - returnItemsGrossAmount;
                        returnOrderData = this.allocateReturnOrderData(salesOrderData, type);
                        returnOrderData.salesLine = [];
                        _loop_1 = function (item) {
                            var returnItem = {};
                            this_1.allocateReturnItem(returnItem, item);
                            item.totalReturnedQuantity = item.totalReturnedQuantity ? parseInt(item.totalReturnedQuantity) : 0;
                            item.lineTotalDisc = item.lineTotalDisc ? parseInt(item.lineTotalDisc) : 0;
                            item.salesQty = item.salesQty ? parseInt(item.salesQty) : 0;
                            var itemGrossAmount = parseFloat(item.lineAmount) - item.totalSettledAmount;
                            var itemNetAmount = parseFloat(item.lineAmount) - parseFloat(item.lineTotalDisc) + parseFloat(item.vatamount) * parseInt(item.salesQty);
                            var itemVatAmount = parseFloat(item.vatamount) * (parseInt(item.salesQty) - item.totalReturnedQuantity);
                            var itemDiscountAmount = parseFloat(item.lineTotalDisc);
                            // console.log(itemDiscountAmount);
                            grossTotal += itemGrossAmount;
                            console.log(itemVatAmount, vatPrice, "===================================", item.vatamount, item.salesQty, item.totalReturnedQuantity, itemDiscountAmount);
                            total += itemNetAmount;
                            discount += itemDiscountAmount;
                            vatPrice += itemVatAmount;
                            console.log(itemGrossAmount);
                            var _loop_2 = function (itemDiscount) {
                                // console.log(itemDiscount)
                                if (nonCondDiscounts.includes(itemDiscount.discountType)) {
                                    if (item.returnQuantity > 0) {
                                        itemDiscountAmount -= parseFloat(itemDiscount.discountAmount) * (item.returnQuantity + parseInt(item.totalReturnedQuantity));
                                        // console.log("1============", itemDiscountAmount)
                                    }
                                }
                                else if (condDiscounts.includes(itemDiscount.discountType)) {
                                    itemDiscountAmount -= parseFloat(itemDiscount.discountAmount) * (item.returnQuantity + parseInt(item.totalReturnedQuantity));
                                    if (itemDiscount.discountType == "INSTANT_DISCOUNT" && itemDiscount.percentage > 0) {
                                        var instantDiscPercentage = 0;
                                        for (var _i = 0, _a = itemDiscount.cond; _i < _a.length; _i++) {
                                            var range = _a[_i];
                                            if (totalGrossAmountAfterReturnItems && totalGrossAmountAfterReturnItems >= range.minamount && totalGrossAmountAfterReturnItems <= range.maxamount) {
                                                instantDiscPercentage = parseInt(range.discpercent);
                                                break;
                                            }
                                        }
                                        if (item.returnQuantity > 0) {
                                            // console.log("2============", itemDiscountAmount, instantDiscPercentage)
                                            var newDiscountAmount = parseFloat(item.salesprice) * (instantDiscPercentage / 100);
                                            itemDiscountAmount -= newDiscountAmount * (item.returnQuantity + parseInt(item.totalReturnedQuantity));
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.percentage = instantDiscPercentage;
                                            returnItemDiscount.discountAmount = newDiscountAmount;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    // console.log("2============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "MULTI_LINE_DISOCUNT" && itemDiscount.percentage > 0) {
                                        var multiLineDiscPercentage = 0;
                                        for (var _b = 0, _c = itemDiscount.cond; _b < _c.length; _b++) {
                                            var element = _c[_b];
                                            multiLineDiscPercentage += parseFloat(element.percent1);
                                            // console.log(line.baseSizes.quantity, element.quantityamount);
                                            if (item.salesQty - item.totalReturnedQuantity - item.returnQuantity <= parseFloat(element.quantityamount)) {
                                                multiLineDiscPercentage = multiLineDiscPercentage;
                                                // line.multilineDiscRanges = multilineDiscRanges;
                                                // console.log(percent);
                                                break;
                                            }
                                        }
                                        if (item.returnQuantity > 0) {
                                            var newDiscountAmount = parseFloat(item.salesprice) * (multiLineDiscPercentage / 100);
                                            itemDiscountAmount -= newDiscountAmount * (item.returnQuantity + parseInt(item.totalReturnedQuantity));
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.percentage = multiLineDiscPercentage;
                                            returnItemDiscount.discountAmount = newDiscountAmount;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    // console.log("3============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "BUY_ONE_GET_ONE_DISCOUNT" && itemDiscount.percentage > 0) {
                                        var freeItems = returnFreeItems.filter(function (v) { return v.linkId == item.linkId; });
                                        var returningFreeQty_1 = 0;
                                        var totalDiscountOnItems_1 = 0;
                                        freeItems.map(function (v) {
                                            totalDiscountOnItems_1 += v.salesprice;
                                            returningFreeQty_1 += v.returnQuantity;
                                        });
                                        if (item.returnQuantity != returningFreeQty_1) {
                                            throw { message: "Please Return Free Item" };
                                        }
                                        else {
                                            itemDiscountAmount == totalDiscountOnItems_1;
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.percentage = 0;
                                            returnItemDiscount.discountAmount = itemDiscountAmount;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    // console.log("4============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "PROMOTIONAL_DISCOUNT" && itemDiscount.percentage > 0) {
                                        var totalReturningQty_1 = item.returnQuantity;
                                        var returningFreeItems = returnFreeItems.filter(function (v) { return v.linkId == item.linkId; });
                                        var freeItems = salesOrderData.salesLine.filter(function (v) { return v.linkId == item.linkId; });
                                        var gotFreeQty_1 = 0;
                                        returningFreeItems.map(function (v) {
                                            totalReturningQty_1 += v.returnQuantity;
                                        });
                                        freeItems.map(function (v) {
                                            gotFreeQty_1 += v.salesQty;
                                        });
                                        var eligibleFreeQty = Math.floor((parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity) - item.returnQuantity) / parseInt(itemDiscount.cond[0].multipleQty)) *
                                            parseInt(itemDiscount.cond[0].freeQty);
                                        var freeQty = gotFreeQty_1 - eligibleFreeQty;
                                        var newDiscountAmount = itemDiscount.discountAmount / gotFreeQty_1;
                                        itemDiscountAmount -= newDiscountAmount * freeQty;
                                        item.returnQuantity = totalReturningQty_1;
                                        var returnItemDiscount = __assign({}, itemDiscount);
                                        returnItemDiscount.percentage = 0;
                                        returnItemDiscount.discountAmount = itemDiscountAmount;
                                        returnItem.appliedDiscounts.push(returnItemDiscount);
                                    }
                                    // console.log("5============", itemDiscountAmount)
                                }
                            };
                            for (var _i = 0, _a = item.appliedDiscounts; _i < _a.length; _i++) {
                                var itemDiscount = _a[_i];
                                _loop_2(itemDiscount);
                            }
                            returnItem.batches = reqData.selectedBatches.filter(function (v) { return v.itemid == item.itemid && v.configid == item.configId && v.inventsizeid == item.inventsizeid; });
                            itemGrossAmount -= parseFloat(item.salesprice) * item.returnQuantity;
                            console.log(parseFloat(item.salesprice) * item.returnQuantity);
                            console.log("=========itemDiscount========", item.itemid, itemDiscountAmount, itemGrossAmount, item.vatamount, item.returnQuantity, vatPrice);
                            newGrossTotal += itemGrossAmount;
                            newTotal += itemGrossAmount - itemDiscountAmount + (itemGrossAmount - itemDiscountAmount) * (item.vat / 100);
                            newVatPrice += (itemGrossAmount - itemDiscountAmount) * (item.vat / 100);
                            newDiscount += itemDiscountAmount;
                            returnItem.lineTotalDisc = itemDiscountAmount;
                            returnItem.lineAmount = itemGrossAmount - itemDiscountAmount + (itemGrossAmount - itemDiscountAmount) * (item.vat / 100);
                            returnItem.vatamount = (itemGrossAmount - itemDiscountAmount) * (item.vat / 100);
                            returnOrderData.salesLine.push(returnItem);
                        };
                        this_1 = this;
                        for (_i = 0, returnItems_1 = returnItems; _i < returnItems_1.length; _i++) {
                            item = returnItems_1[_i];
                            _loop_1(item);
                        }
                        returnFreeItems.map(function (v) {
                            v.salesQty = v.returnQuantity;
                        });
                        (_a = returnOrderData.salesLine).push.apply(_a, returnFreeItems);
                        t1 = new Date().getTime();
                        console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
                        total -= newTotal;
                        grossTotal -= newGrossTotal;
                        discount -= newDiscount;
                        vatPrice -= newVatPrice;
                        returnOrderData.amount = grossTotal;
                        returnOrderData.netAmount = total;
                        returnOrderData.disc = discount;
                        returnOrderData.vatamount = vatPrice;
                        returnOrderData.sumTax = vatPrice;
                        return [2 /*return*/, { total: total, grossTotal: grossTotal, discount: discount, vatPrice: vatPrice, returnOrderData: returnOrderData }];
                }
            });
        });
    };
    ReturnOrderAmountService.prototype.getReturnOrderAmount1 = function (reqData, type) {
        return __awaiter(this, void 0, void 0, function () {
            var t0, total, grossTotal, discount, vatPrice, newTotal, newGrossTotal, newDiscount, newVatPrice, salesOrderData, returnItems, returnFreeItems, nonCondDiscounts, condDiscounts, totalGrossAmount, returnItemsGrossAmount, totalGrossAmountAfterReturnItems, salesLineBatches, returnOrderData, _loop_3, this_2, _i, returnItems_2, item, _loop_4, this_3, _a, returnFreeItems_1, item, t1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        t0 = new Date().getTime();
                        total = 0;
                        grossTotal = 0;
                        discount = 0;
                        vatPrice = 0;
                        newTotal = 0;
                        newGrossTotal = 0;
                        newDiscount = 0;
                        newVatPrice = 0;
                        return [4 /*yield*/, this.salesTableDAO.entity(reqData.salesid.toUpperCase())];
                    case 1:
                        salesOrderData = _b.sent();
                        returnItems = [];
                        returnFreeItems = [];
                        nonCondDiscounts = ["TOTAL_DISCOUNT", "LINE_DISCOUNT", "ARAMKO_TAHAKOM_DISOUNT", "SABIC_CUSTOMER_DISCOUNT", "VOUCHER_DISCOUNT"];
                        condDiscounts = ["BUY_ONE_GET_ONE_DISCOUNT", "PROMOTIONAL_DISCOUNT", "INSTANT_DISCOUNT", "MULTI_LINE_DISCOUNT"];
                        totalGrossAmount = 0;
                        returnItemsGrossAmount = 0;
                        salesLineBatches = [];
                        reqData.selectedBatches.map(function (v) {
                            salesLineBatches.push(v.salesLineId);
                        });
                        console.log(salesLineBatches);
                        salesOrderData.salesLine.forEach(function (v) {
                            totalGrossAmount += parseFloat(v.lineAmount) - v.totalSettledAmount;
                            var returnBatches = reqData.selectedBatches.filter(function (item) { return v.itemid == item.itemid && v.configId == item.configid && v.inventsizeid == item.inventsizeid && v.id == item.salesLineId; });
                            //   console.log(returnBatches);
                            var returnQuantity = 0;
                            returnBatches.map(function (b) {
                                returnQuantity += b.returnQuantity;
                            });
                            console.log(returnQuantity);
                            if (returnQuantity > 0) {
                                v.returnQuantity = returnQuantity;
                                console.log("isFreeItems", v.isItemFree);
                                if (!v.isItemFree && salesLineBatches.includes(v.id)) {
                                    returnItems.push(v);
                                }
                                else if (v.isItemFree && salesLineBatches.includes(v.id)) {
                                    returnFreeItems.push(v);
                                }
                            }
                            returnItemsGrossAmount += parseFloat(v.salesprice) * returnQuantity;
                        });
                        // returnFreeItems.map((v: any) => {
                        //   let index = returnItems.findIndex((pv: any) => pv.linkId == v.linkId);
                        //   if (index == -1) {
                        //     index = salesOrderData.salesLine.findIndex((pv: any) => pv.linkId == v.linkId);
                        //     if (index != -1) {
                        //       salesOrderData.salesLine[index].returnQuantity = 0;
                        //       returnItems.push(salesOrderData.salesLine[index]);
                        //     }
                        //   }
                        // });
                        totalGrossAmountAfterReturnItems = totalGrossAmount - returnItemsGrossAmount;
                        returnOrderData = this.allocateReturnOrderData(salesOrderData, type);
                        returnOrderData.salesLine = [];
                        _loop_3 = function (item) {
                            var returnItem = {};
                            this_2.allocateReturnItem(returnItem, item);
                            item.totalReturnedQuantity = item.totalReturnedQuantity ? parseInt(item.totalReturnedQuantity) : 0;
                            item.lineTotalDisc = item.lineTotalDisc ? parseInt(item.lineTotalDisc) : 0;
                            item.salesQty = item.salesQty ? parseInt(item.salesQty) : 0;
                            var itemGrossAmount = parseFloat(item.lineAmount) - item.totalSettledAmount;
                            var itemNetAmount = parseFloat(item.lineAmount) - parseFloat(item.lineTotalDisc) + parseFloat(item.vatamount);
                            var itemVatAmount = parseFloat(item.vatamount);
                            //   console.log(item.lineTotalDisc);
                            var itemDiscountAmount = 0;
                            var itemNewGrossAmount = 0;
                            var itemNewNetAmount = 0;
                            var itemNewVatAmount = 0;
                            var itemNewDiscountAmount = 0;
                            var nonReturnableDiscountAmount = 0;
                            var nonReturnableVatAmount = 0;
                            // console.log(itemDiscountAmount);
                            grossTotal += itemGrossAmount;
                            // console.log(itemVatAmount, vatPrice, "===================================", item.vatamount, item.salesQty, item.totalReturnedQuantity, itemDiscountAmount);
                            total += itemNetAmount;
                            discount += itemDiscountAmount;
                            vatPrice += itemVatAmount;
                            var _loop_5 = function (itemDiscount) {
                                // console.log(itemDiscount)
                                if (nonCondDiscounts.includes(itemDiscount.discountType)) {
                                    if (item.returnQuantity > 0) {
                                        itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                        itemNewDiscountAmount += (parseFloat(itemDiscount.discountAmount) / item.salesQty) * item.returnQuantity;
                                    }
                                }
                                else if (condDiscounts.includes(itemDiscount.discountType)) {
                                    // itemDiscountAmount -= parseFloat(itemDiscount.discountAmount) * (item.returnQuantity + parseInt(item.totalReturnedQuantity));
                                    if (itemDiscount.discountType == "INSTANT_DISCOUNT" && itemDiscount.percentage > 0) {
                                        var instantDiscPercentage = 0;
                                        for (var _i = 0, _a = itemDiscount.cond; _i < _a.length; _i++) {
                                            var range = _a[_i];
                                            if (totalGrossAmountAfterReturnItems && totalGrossAmountAfterReturnItems >= range.minamount && totalGrossAmountAfterReturnItems <= range.maxamount) {
                                                instantDiscPercentage = parseInt(range.discpercent);
                                                break;
                                            }
                                        }
                                        //   console.log(instantDiscPercentage);
                                        if (item.returnQuantity > 0) {
                                            itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                            // console.log("2============", itemDiscountAmount, instantDiscPercentage)
                                            var discountAmount = parseFloat(item.salesprice) * (instantDiscPercentage / 100);
                                            itemNewDiscountAmount += discountAmount * (parseInt(item.returnQuantity) + parseInt(item.totalReturnedQuantity));
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.percentage = instantDiscPercentage;
                                            returnItemDiscount.discountAmount = discountAmount * item.returnQuantity;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    // console.log("2============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "MULTI_LINE_DISCOUNT" && itemDiscount.percentage > 0) {
                                        var multiLineDiscPercentage = 0;
                                        for (var _b = 0, _c = itemDiscount.cond; _b < _c.length; _b++) {
                                            var element = _c[_b];
                                            multiLineDiscPercentage += parseFloat(element.percent1);
                                            // console.log(line.baseSizes.quantity, element.quantityamount);
                                            if (item.salesQty - item.totalReturnedQuantity - item.returnQuantity <= parseFloat(element.quantityamount)) {
                                                multiLineDiscPercentage = multiLineDiscPercentage;
                                                // line.multilineDiscRanges = multilineDiscRanges;
                                                // console.log(percent);
                                                break;
                                            }
                                        }
                                        if (item.returnQuantity > 0) {
                                            itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                            // console.log("2============", itemDiscountAmount, multiLineDiscPercentage)
                                            var discountAmount = parseFloat(item.salesprice) * (multiLineDiscPercentage / 100);
                                            itemNewDiscountAmount += discountAmount * (parseInt(item.returnQuantity) + parseInt(item.totalReturnedQuantity));
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.percentage = multiLineDiscPercentage;
                                            returnItemDiscount.discountAmount = discountAmount * item.returnQuantity;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    // console.log("3============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "BUY_ONE_GET_ONE_DISCOUNT") {
                                        console.log("BUY_ONE_GET_ONE_DISCOUNT");
                                        var freeItems = returnFreeItems.filter(function (v) { return v.linkId == item.linkId && v.isItemFree == true; });
                                        //   console.log(freeItems)
                                        var returningFreeQty_2 = 0;
                                        var totalDiscountOnItems_2 = 0;
                                        freeItems.map(function (v) {
                                            totalDiscountOnItems_2 += parseFloat(v.salesprice);
                                            returningFreeQty_2 += v.returnQuantity;
                                        });
                                        // console.log(returningFreeQty);
                                        if (item.returnQuantity != returningFreeQty_2) {
                                            throw { message: "Please Return Free Item" };
                                        }
                                        else {
                                            itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                            var discountAmount = parseFloat(itemDiscount.discountAmount) / parseInt(item.salesQty);
                                            itemNewDiscountAmount += discountAmount * (parseInt(item.returnQuantity) + parseInt(item.totalReturnedQuantity));
                                            var returnItemDiscount = __assign({}, itemDiscount);
                                            returnItemDiscount.discountAmount = itemNewDiscountAmount;
                                            returnItem.appliedDiscounts.push(returnItemDiscount);
                                        }
                                    }
                                    //   // console.log("4============", itemDiscountAmount)
                                    if (itemDiscount.discountType == "PROMOTIONAL_DISCOUNT") {
                                        var totalReturningQty = item.returnQuantity;
                                        var returningFreeItems = returnFreeItems.filter(function (v) { return v.linkId == item.linkId && v.isItemFree == true; });
                                        var freeItems = salesOrderData.salesLine.filter(function (v) { return v.linkId == item.linkId && v.isItemFree == true; });
                                        var gotFreeQty_2 = 0;
                                        // returningFreeItems.map((v: any) => {
                                        //   totalReturningQty += v.returnQuantity;
                                        // });
                                        freeItems.map(function (v) {
                                            gotFreeQty_2 += parseInt(v.salesQty);
                                        });
                                        console.log("gotFreeQty", gotFreeQty_2);
                                        var eligibleFreeQty = Math.floor((parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity) - parseInt(item.returnQuantity)) / parseInt(itemDiscount.cond[0].multipleQty)) *
                                            parseInt(itemDiscount.cond[0].freeQty);
                                        console.log("eligibleFreeQty", eligibleFreeQty);
                                        var freeQty = gotFreeQty_2 - eligibleFreeQty;
                                        console.log("freeQty", freeQty);
                                        itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                        var discountAmount = parseFloat(itemDiscount.discountAmount) / gotFreeQty_2;
                                        itemNewDiscountAmount += eligibleFreeQty * parseInt(item.salesprice);
                                        console.log(itemNewDiscountAmount);
                                        item.returnQuantity = totalReturningQty;
                                        var returnItemDiscount = __assign({}, itemDiscount);
                                        returnItemDiscount.discountAmount = discountAmount;
                                        returnItem.appliedDiscounts.push(returnItemDiscount);
                                    }
                                    // console.log("5============", itemDiscountAmount)
                                }
                            };
                            // console.log(itemGrossAmount);
                            for (var _i = 0, _a = item.appliedDiscounts; _i < _a.length; _i++) {
                                var itemDiscount = _a[_i];
                                _loop_5(itemDiscount);
                            }
                            itemNewGrossAmount = parseFloat(item.salesprice + parseFloat(item.colorantprice)) * item.returnQuantity;
                            itemNewVatAmount = (itemNewGrossAmount - itemNewDiscountAmount) * (item.vat / 100);
                            itemNewNetAmount = itemNewGrossAmount - itemNewDiscountAmount / (parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity)) + itemNewVatAmount;
                            nonReturnableVatAmount = (itemNewVatAmount / item.returnQuantity - itemVatAmount / (parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity))) * item.returnQuantity;
                            nonReturnableDiscountAmount =
                                (itemDiscountAmount / (parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity)) - itemNewDiscountAmount / (parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity))) *
                                    item.returnQuantity;
                            console.log("itemNewGrossAmount", itemNewGrossAmount);
                            console.log("itemNewNetAmount", itemNewNetAmount);
                            console.log("itemNewVatAmount", itemNewVatAmount);
                            console.log("itemNewDiscountAmount", itemNewDiscountAmount);
                            console.log("nonReturnableVatAmount", nonReturnableVatAmount);
                            console.log("nonReturnableDiscountAmount", nonReturnableDiscountAmount);
                            console.log("itemDiscountAmount", itemDiscountAmount);
                            console.log("itemVatAmount", itemVatAmount);
                            console.log("prevDiscountOnSingleQuantity", itemDiscountAmount / item.salesQty);
                            returnItem.batches = reqData.selectedBatches.filter(function (v) { return v.itemid == item.itemid && v.configid == item.configId && v.inventsizeid == item.inventsizeid; });
                            newGrossTotal += itemNewGrossAmount;
                            newVatPrice += itemNewVatAmount - nonReturnableVatAmount;
                            newDiscount += Math.abs(itemNewDiscountAmount / (parseInt(item.salesQty) - parseInt(item.totalReturnedQuantity)) - nonReturnableDiscountAmount);
                            newTotal += itemNewNetAmount - nonReturnableDiscountAmount - nonReturnableVatAmount;
                            returnItem.lineTotalDisc = Math.abs(itemNewDiscountAmount - nonReturnableDiscountAmount);
                            returnItem.lineAmount = itemNewGrossAmount;
                            returnItem.vatamount = Math.abs(itemNewVatAmount - nonReturnableVatAmount);
                            returnOrderData.salesLine.push(returnItem);
                        };
                        this_2 = this;
                        for (_i = 0, returnItems_2 = returnItems; _i < returnItems_2.length; _i++) {
                            item = returnItems_2[_i];
                            _loop_3(item);
                        }
                        _loop_4 = function (item) {
                            var returnItem = {};
                            this_3.allocateReturnItem(returnItem, item);
                            item.totalReturnedQuantity = item.totalReturnedQuantity ? parseInt(item.totalReturnedQuantity) : 0;
                            item.lineTotalDisc = item.lineTotalDisc ? parseInt(item.lineTotalDisc) : 0;
                            item.salesQty = item.salesQty ? parseInt(item.salesQty) : 0;
                            var itemGrossAmount = parseFloat(item.lineAmount) - item.totalSettledAmount;
                            var itemNetAmount = parseFloat(item.lineAmount) - parseFloat(item.lineTotalDisc) + parseFloat(item.vatamount);
                            var itemVatAmount = parseFloat(item.vatamount);
                            //   console.log(item.lineTotalDisc);
                            var itemDiscountAmount = 0;
                            var itemNewGrossAmount = 0;
                            var itemNewNetAmount = 0;
                            var itemNewVatAmount = 0;
                            var itemNewDiscountAmount = 0;
                            var nonReturnableDiscountAmount = 0;
                            var nonReturnableVatAmount = 0;
                            // console.log(itemDiscountAmount);
                            grossTotal += itemGrossAmount;
                            console.log(itemVatAmount, vatPrice, "===================================", item.vatamount, item.salesQty, item.totalReturnedQuantity, itemDiscountAmount);
                            total += itemNetAmount;
                            discount += itemDiscountAmount;
                            vatPrice += itemVatAmount;
                            // console.log(itemGrossAmount);
                            if (item.appliedDiscounts.length) {
                                for (var _i = 0, _a = item.appliedDiscounts; _i < _a.length; _i++) {
                                    var itemDiscount = _a[_i];
                                    if (itemDiscount.discountType == "BUY_ONE_GET_ONE_DISCOUNT") {
                                        console.log("BUY_ONE_GET_ONE_DISCOUNT");
                                        itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                        var discountAmount = parseFloat(itemDiscount.discountAmount) / parseInt(item.salesQty);
                                        itemNewDiscountAmount += discountAmount * (parseInt(item.returnQuantity) + parseInt(item.totalReturnedQuantity));
                                        var returnItemDiscount = __assign({}, itemDiscount);
                                        returnItemDiscount.discountAmount = itemNewDiscountAmount;
                                        returnItem.appliedDiscounts.push(returnItemDiscount);
                                    }
                                    else if (itemDiscount.discountType == "PROMOTIONAL_DISCOUNT") {
                                        console.log("PROMOTIONAL_DISCOUNT");
                                        itemDiscountAmount += parseFloat(itemDiscount.discountAmount);
                                        var discountAmount = parseFloat(itemDiscount.discountAmount) / parseInt(item.salesQty);
                                        itemNewDiscountAmount += discountAmount * (parseInt(item.returnQuantity) + parseInt(item.totalReturnedQuantity));
                                        var returnItemDiscount = __assign({}, itemDiscount);
                                        returnItemDiscount.discountAmount = itemNewDiscountAmount;
                                        returnItem.appliedDiscounts.push(returnItemDiscount);
                                    }
                                }
                            }
                            else {
                                console.log("==========");
                                itemDiscountAmount += 0;
                                itemNewDiscountAmount += 0;
                            }
                            itemNewGrossAmount = parseFloat(item.salesprice + parseFloat(item.colorantprice)) * item.returnQuantity;
                            itemNewVatAmount = (itemNewGrossAmount - itemNewDiscountAmount) * (item.vat / 100);
                            itemNewNetAmount = itemNewGrossAmount - itemNewDiscountAmount + itemNewVatAmount;
                            nonReturnableVatAmount = (itemNewVatAmount / item.returnQuantity - itemVatAmount / item.salesQty) * item.returnQuantity;
                            nonReturnableDiscountAmount = (itemDiscountAmount / item.salesQty - itemNewDiscountAmount / item.returnQuantity) * item.returnQuantity;
                            console.log("itemNewGrossAmount", itemNewGrossAmount);
                            console.log("itemNewNetAmount", itemNewNetAmount);
                            console.log("itemNewVatAmount", itemNewVatAmount);
                            console.log("itemNewDiscountAmount", itemNewDiscountAmount);
                            console.log("nonReturnableVatAmount", nonReturnableVatAmount);
                            console.log("nonReturnableDiscountAmount", nonReturnableDiscountAmount);
                            console.log("itemDiscountAmount", itemDiscountAmount);
                            console.log("itemVatAmount", itemVatAmount);
                            console.log("prevDiscountOnSingleQuantity", itemDiscountAmount / item.salesQty);
                            returnItem.batches = reqData.selectedBatches.filter(function (v) { return v.itemid == item.itemid && v.configid == item.configId && v.inventsizeid == item.inventsizeid; });
                            newGrossTotal += itemNewGrossAmount;
                            newVatPrice += itemNewVatAmount - nonReturnableVatAmount;
                            newDiscount += Math.abs(itemNewDiscountAmount - nonReturnableDiscountAmount);
                            newTotal += itemNewNetAmount - nonReturnableDiscountAmount - nonReturnableVatAmount;
                            returnItem.lineTotalDisc = itemNewDiscountAmount - nonReturnableDiscountAmount;
                            returnItem.lineAmount = itemNewGrossAmount;
                            returnItem.vatamount = itemNewVatAmount - nonReturnableVatAmount;
                            returnOrderData.salesLine.push(returnItem);
                        };
                        this_3 = this;
                        // console.log(returnFreeItems);
                        for (_a = 0, returnFreeItems_1 = returnFreeItems; _a < returnFreeItems_1.length; _a++) {
                            item = returnFreeItems_1[_a];
                            _loop_4(item);
                        }
                        t1 = new Date().getTime();
                        console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
                        returnOrderData.amount = newGrossTotal;
                        returnOrderData.netAmount = newTotal;
                        returnOrderData.disc = newDiscount;
                        returnOrderData.vatamount = newVatPrice;
                        returnOrderData.sumTax = vatPrice;
                        return [2 /*return*/, { total: newTotal, grossTotal: newGrossTotal, discount: newDiscount, vatPrice: newVatPrice, returnOrderData: returnOrderData }];
                }
            });
        });
    };
    ReturnOrderAmountService.prototype.returnOrderAmount = function (reqData, type) {
        return __awaiter(this, void 0, void 0, function () {
            var nonCondDiscounts, condDiscounts, returnItems, returnFreeItems, salesLineBatches, grossTotal, newGrossTotal, multilineDiscQuantity, salesOrderData, inQueryStr, multiLineItemCode, _i, _a, item, _b, _c, discount, checkDiscounts, multlineDiscItems, returnItemsGrossAmount, returnNetAmount, reutrnVat, returnDiscount, returnOrderData, _loop_6, _d, returnItems_3, item, _loop_7, _e, returnFreeItems_2, item;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        nonCondDiscounts = ["TOTAL_DISCOUNT", "LINE_DISCOUNT", "ARAMKO_TAHAKOM_DISOUNT", "SABIC_CUSTOMER_DISCOUNT", "VOUCHER_DISCOUNT"];
                        condDiscounts = ["BUY_ONE_GET_ONE_DISCOUNT", "PROMOTIONAL_DISCOUNT", "INSTANT_DISCOUNT", "MULTI_LINE_DISCOUNT"];
                        returnItems = [];
                        returnFreeItems = [];
                        salesLineBatches = [];
                        grossTotal = 0;
                        newGrossTotal = 0;
                        multilineDiscQuantity = 0;
                        reqData.selectedBatches.map(function (v) {
                            salesLineBatches.push(v.salesLineId);
                        });
                        return [4 /*yield*/, this.salesTableDAO.entity(reqData.salesid.toUpperCase())];
                    case 1:
                        salesOrderData = _f.sent();
                        inQueryStr = "";
                        salesOrderData.salesLine.map(function (v) {
                            inQueryStr += "'" + v.itemid + "',";
                        });
                        for (_i = 0, _a = salesOrderData.salesLine; _i < _a.length; _i++) {
                            item = _a[_i];
                            for (_b = 0, _c = item.appliedDiscounts; _b < _c.length; _b++) {
                                discount = _c[_b];
                                if (discount.discountType == "MULTI_LINE_DISCOUNT") {
                                    if (discount.cond && discount.cond[0]) {
                                        multiLineItemCode = discount.cond[0].itemrelation;
                                    }
                                }
                            }
                        }
                        return [4 /*yield*/, this.rawQuery.checkDiscounts(inQueryStr.substr(0, inQueryStr.length - 1))];
                    case 2:
                        checkDiscounts = _f.sent();
                        multlineDiscItems = checkDiscounts.filter(function (v) { return multiLineItemCode == v.multilinedisc; });
                        multlineDiscItems = multlineDiscItems.map(function (v) {
                            return v.itemid;
                        });
                        salesOrderData.salesLine.forEach(function (v) {
                            grossTotal += v.lineAmount + v.colorantprice * v.salesQty - (v.salesprice + v.colorantprice) * v.totalReturnedQuantity;
                            // console.log(multlineDiscItems)
                            var returnBatches = reqData.selectedBatches.filter(function (item) { return v.itemid == item.itemid && v.configId == item.configid && v.inventsizeid == item.inventsizeid && v.id == item.salesLineId; });
                            //   console.log(returnBatches);
                            var batches = [];
                            var returnQuantity = 0;
                            returnBatches.map(function (b) {
                                returnQuantity += b.returnQuantity;
                                batches.push({
                                    batchNo: b.batchno,
                                    quantity: b.returnQuantity
                                });
                            });
                            // console.log(returnQuantity);
                            if (returnQuantity > 0) {
                                v.returnQuantity = returnQuantity;
                                // console.log("isFreeItems", v.isItemFree);
                                v.batch = batches;
                                if (!v.isItemFree && salesLineBatches.includes(v.id)) {
                                    multilineDiscQuantity += multlineDiscItems.includes(v.itemid) ? parseInt(v.salesQty) - parseInt(v.totalReturnedQuantity) - returnQuantity : 0;
                                    v.batches = returnBatches;
                                    returnItems.push(v);
                                }
                                else if (v.isItemFree && salesLineBatches.includes(v.id)) {
                                    v.batches = returnBatches;
                                    returnFreeItems.push(v);
                                }
                            }
                            // console.log(grossTotal);
                            v.colorantprice = v.colorantprice ? v.colorantprice : 0;
                            v.totalReturnedQuantity = v.totalReturnedQuantity ? v.totalReturnedQuantity : 0;
                            newGrossTotal += parseFloat(v.lineAmount) + parseFloat(v.colorantprice) * parseInt(v.salesQty) - (parseFloat(v.salesprice) + parseFloat(v.colorantprice)) * parseInt(v.totalReturnedQuantity) - (parseFloat(v.salesprice) + parseFloat(v.colorantprice)) * returnQuantity;
                        });
                        console.log(newGrossTotal);
                        returnItemsGrossAmount = 0;
                        returnNetAmount = 0;
                        reutrnVat = 0;
                        returnDiscount = 0;
                        returnOrderData = this.allocateReturnOrderData(salesOrderData, type);
                        returnOrderData.salesLine = [];
                        _loop_6 = function (item) {
                            var qty = parseInt(item.returnQuantity);
                            item.colorantprice = item.colorantprice ? item.colorantprice : 0;
                            var price = parseFloat(item.salesprice) + parseFloat(item.colorantprice);
                            var lineAmount = price * qty;
                            var netAmount = lineAmount;
                            var lineTotalDisc = 0;
                            var vat = 0;
                            // let appliedVat = console.log(vat);
                            if (item.appliedDiscounts.length > 0) {
                                var _loop_8 = function (discount) {
                                    if (nonCondDiscounts.includes(discount.discountType)) {
                                        var discountAmount = lineAmount * (parseFloat(discount.percentage) / 100);
                                        netAmount -= discountAmount;
                                        // let vatAmount: number = netAmount * (parseFloat(item.vat) / 100);
                                        // console.log(vatAmount / item.salesQty);
                                        // vat -= (parseFloat(item.vatamount) / item.salesQty - vatAmount / qty) * qty;
                                        console.log(vat);
                                        lineTotalDisc += discountAmount;
                                        item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                            discountType: discount.discountType,
                                            discountAmount: parseFloat(discount.discountAmount) - discountAmount,
                                            percentage: discount.percentage,
                                            cond: discount.cond
                                        };
                                    }
                                    else if (condDiscounts.includes(discount.discountType)) {
                                        if (discount.discountType == "MULTI_LINE_DISCOUNT" && discount.percentage > 0) {
                                            var percentage = 0;
                                            var multiLineDiscPercentage = 0;
                                            for (var _i = 0, _a = discount.cond; _i < _a.length; _i++) {
                                                var element = _a[_i];
                                                percentage += parseFloat(element.percent1);
                                                if (multilineDiscQuantity >= parseFloat(element.quantityamount)) {
                                                    multiLineDiscPercentage = percentage;
                                                    break;
                                                }
                                            }
                                            // console.log(multiLineDiscPercentage, multilineDiscQuantity);
                                            if (item.returnQuantity > 0) {
                                                var discountAmount = lineAmount * (multiLineDiscPercentage / 100);
                                                // console.log(discountAmount, netAmount);
                                                lineTotalDisc += discountAmount > 0 ? discountAmount : parseFloat(discount.discountAmount) - discountAmount;
                                                netAmount -= lineTotalDisc;
                                                // console.log(netAmount);
                                                item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                                    discountType: discount.discountType,
                                                    discountAmount: discountAmount > 0 ? parseFloat(discount.discountAmount) - discountAmount : discountAmount,
                                                    percentage: multiLineDiscPercentage,
                                                    cond: discount.cond
                                                };
                                            }
                                        }
                                        if (discount.discountType == "INSTANT_DISCOUNT" && discount.percentage > 0) {
                                            var percentage = 0;
                                            for (var _b = 0, _c = discount.cond; _b < _c.length; _b++) {
                                                var range = _c[_b];
                                                if (newGrossTotal >= parseFloat(range.minamount) && newGrossTotal <= parseFloat(range.maxamount)) {
                                                    percentage = parseInt(range.discpercent);
                                                    break;
                                                }
                                            }
                                            console.log(percentage);
                                            if (item.returnQuantity > 0) {
                                                var discountAmount = lineAmount * (percentage / 100);
                                                // console.log(discountAmount, netAmount);
                                                lineTotalDisc += discountAmount > 0 ? discountAmount : parseFloat(discount.discountAmount) - discountAmount;
                                                netAmount -= lineTotalDisc;
                                                // console.log(netAmount);
                                                item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                                    discountType: discount.discountType,
                                                    discountAmount: discountAmount > 0 ? parseFloat(discount.discountAmount) - discountAmount : discountAmount,
                                                    percentage: percentage,
                                                    cond: discount.cond
                                                };
                                            }
                                        }
                                        if (discount.discountType == "BUY_ONE_GET_ONE_DISCOUNT") {
                                            console.log("BUY_ONE_GET_ONE_DISCOUNT");
                                            var freeItems = returnFreeItems.filter(function (v) { return v.linkId == item.linkId && v.isItemFree == true; });
                                            //   console.log(freeItems)
                                            var returningFreeQty_3 = 0;
                                            var totalDiscountOnItems_3 = 0;
                                            freeItems.map(function (v) {
                                                totalDiscountOnItems_3 += parseFloat(v.salesprice);
                                                returningFreeQty_3 += v.returnQuantity;
                                            });
                                            // console.log(returningFreeQty);
                                            if (item.returnQuantity != returningFreeQty_3) {
                                                throw { message: "Please Return Free Item" };
                                            }
                                            else {
                                                var discountAmount = parseFloat(discount.discountAmount) / (item.salesQty - item.totalReturnedQuantity);
                                                console.log(discountAmount);
                                                discountAmount = discountAmount * item.returnQuantity;
                                                lineTotalDisc += discountAmount;
                                                netAmount -= lineTotalDisc;
                                                item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                                    discountType: discount.discountType,
                                                    discountAmount: discountAmount > 0 ? parseFloat(discount.discountAmount) - discountAmount : discountAmount,
                                                    cond: discount.cond
                                                };
                                            }
                                        }
                                        if (discount.discountType == "PROMOTIONAL_DISCOUNT") {
                                            var promotionalDiscountItems = salesOrderData.salesLine.filter(function (v) { return v.itemid == item.itemid && v.inventsizeid == item.inventsizeid; });
                                            var selectedQuantity_1 = 0;
                                            promotionalDiscountItems.map(function (v) {
                                                selectedQuantity_1 += parseInt(v.salesQty) - parseInt(item.totalReturnedQuantity);
                                            });
                                            console.log("selectedQuantity", selectedQuantity_1);
                                            var eligibleFreeQty = Math.floor((selectedQuantity_1) / parseInt(discount.cond[0].multipleQty)) * parseInt(discount.cond[0].freeQty);
                                            console.log("eligibleFreeQty", eligibleFreeQty);
                                            // let freeQty = gotFreeQty - eligibleFreeQty;
                                            // console.log("freeQty", freeQty);
                                            var discountAmount = 0;
                                            // let promotionalDiscountAmount:number = (parseFloat(item.salesprice) / selectedQuantity) * eligibleFreeQty
                                            discountAmount = (parseFloat(discount.discountAmount) / parseInt(item.salesQty)) * item.returnQuantity;
                                            console.log(discountAmount);
                                            lineTotalDisc += discountAmount;
                                            netAmount -= lineTotalDisc;
                                            item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                                discountType: discount.discountType,
                                                discountAmount: discountAmount > 0 ? parseFloat(discount.discountAmount) - discountAmount : discountAmount,
                                                cond: discount.cond
                                            };
                                        }
                                    }
                                };
                                for (var _i = 0, _a = item.appliedDiscounts; _i < _a.length; _i++) {
                                    var discount = _a[_i];
                                    _loop_8(discount);
                                }
                            }
                            else {
                                var discountAmount = 0;
                                netAmount -= discountAmount;
                                lineTotalDisc += discountAmount;
                            }
                            vat = netAmount * (parseFloat(item.vat) / 100);
                            console.log(vat, lineTotalDisc, netAmount);
                            returnItemsGrossAmount += lineAmount;
                            reutrnVat += vat;
                            returnNetAmount += netAmount + vat;
                            returnDiscount += lineTotalDisc;
                            item.salesQty = item.returnQuantity;
                            item.lineTotalDisc = lineTotalDisc;
                            item.lineAmount = lineAmount;
                            item.vatamount = vat;
                            item.netAmount = netAmount;
                            returnOrderData.salesLine.push(item);
                        };
                        for (_d = 0, returnItems_3 = returnItems; _d < returnItems_3.length; _d++) {
                            item = returnItems_3[_d];
                            _loop_6(item);
                        }
                        _loop_7 = function (item) {
                            var qty = parseInt(item.returnQuantity);
                            var price = parseFloat(item.salesprice) + parseFloat(item.colorantprice);
                            var lineAmount = price * qty;
                            var netAmount = lineAmount;
                            var lineTotalDisc = 0;
                            var vat = 0;
                            if (item.appliedDiscounts.length > 0) {
                                var _loop_9 = function (discount) {
                                    if (discount.discountType == "BUY_ONE_GET_ONE_DISCOUNT") {
                                        console.log("BUY_ONE_GET_ONE_DISCOUNT");
                                        var freeItems = returnItems.filter(function (v) { return v.linkId == item.linkId; });
                                        //   console.log(freeItems)
                                        var returningFreeQty_4 = 0;
                                        var totalDiscountOnItems_4 = 0;
                                        freeItems.map(function (v) {
                                            totalDiscountOnItems_4 += parseFloat(v.salesprice);
                                            returningFreeQty_4 += v.returnQuantity;
                                        });
                                        // console.log(returningFreeQty);
                                        if (item.returnQuantity != returningFreeQty_4) {
                                            throw { message: "Please Return Free Item" };
                                        }
                                        else {
                                            var discountAmount = parseFloat(discount.discountAmount) / (item.salesQty - item.totalReturnedQuantity);
                                            console.log(discountAmount);
                                            discountAmount = discountAmount * item.returnQuantity;
                                            lineTotalDisc += discountAmount;
                                            netAmount -= lineTotalDisc;
                                            item.appliedDiscounts[item.appliedDiscounts.indexOf(discount)] = {
                                                discountType: discount.discountType,
                                                discountAmount: discountAmount > 0 ? parseFloat(discount.discountAmount) - discountAmount : discountAmount,
                                                cond: discount.cond
                                            };
                                        }
                                    }
                                };
                                for (var _i = 0, _a = item.appliedDiscounts; _i < _a.length; _i++) {
                                    var discount = _a[_i];
                                    _loop_9(discount);
                                }
                            }
                            else {
                                var discountAmount = 0;
                                netAmount -= discountAmount;
                                lineTotalDisc += discountAmount;
                            }
                            vat = netAmount * (parseFloat(item.vat) / 100);
                            console.log(vat, lineTotalDisc, netAmount);
                            returnItemsGrossAmount += lineAmount;
                            reutrnVat += vat;
                            returnNetAmount += netAmount + vat;
                            returnDiscount += lineTotalDisc;
                            item.salesQty = item.returnQuantity;
                            item.lineTotalDisc = lineTotalDisc;
                            item.lineAmount = lineAmount;
                            item.vatAmount = vat;
                            item.netAmount = netAmount;
                            returnOrderData.salesLine.push(item);
                        };
                        for (_e = 0, returnFreeItems_2 = returnFreeItems; _e < returnFreeItems_2.length; _e++) {
                            item = returnFreeItems_2[_e];
                            _loop_7(item);
                        }
                        returnOrderData.amount = returnItemsGrossAmount;
                        returnOrderData.netAmount = returnNetAmount;
                        returnOrderData.disc = returnDiscount;
                        returnOrderData.vatamount = reutrnVat;
                        returnOrderData.sumTax = reutrnVat;
                        // console.log(grossTotal);
                        return [2 /*return*/, { total: returnNetAmount, grossTotal: returnItemsGrossAmount, discount: returnDiscount, vatPrice: reutrnVat, returnOrderData: returnOrderData }];
                }
            });
        });
    };
    ReturnOrderAmountService.prototype.allocateReturnOrderData = function (salesOrderData, type) {
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
            inventLocationId: salesOrderData.inventLocationId,
            region: salesOrderData.region,
            //   amount: salesOrderData.amount,
            //   netAmount: salesOrderData.netAmount,
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
            warehouse: salesOrderData.warehouse
        };
    };
    ReturnOrderAmountService.prototype.allocateReturnItem = function (returnItem, item) {
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
        returnItem.configId = item.configId;
        returnItem.numberSequenceGroupId = item.numberSequenceGroupId;
        returnItem.vat = item.vat;
        returnItem.appliedDiscounts = [];
        returnItem.colorantprice = item.colorantprice;
    };
    return ReturnOrderAmountService;
}());
exports.ReturnOrderAmountService = ReturnOrderAmountService;
