"use strict";
/** @format */
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
var RawQuery_1 = require("../common/RawQuery");
var CusttableDAO_1 = require("../repos/CusttableDAO");
var typeorm_1 = require("typeorm");
var uuid = require("uuid");
var DiscountService = /** @class */ (function () {
    function DiscountService() {
        this.rawQuery = new RawQuery_1.RawQuery();
        this.custtableDAO = new CusttableDAO_1.CusttableDAO();
        this.db = typeorm_1.getManager();
    }
    DiscountService.prototype.getDiscount = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, checkCustomer, discountBlockItems, checkCustomer_1, discountBlockItemsArray_1, sabicCustomers, ARAMKO_THAKAKOM_DISCOUNT, aramkoTahkomDiscounts, t0, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 17, , 18]);
                        result = void 0;
                        checkCustomer = void 0;
                        discountBlockItems = void 0;
                        reqData.grossTotal = 0;
                        reqData.selectedItems.map(function (v) {
                            reqData.grossTotal += parseFloat(v.price) * parseFloat(v.quantity);
                        });
                        if (!!reqData.custaccount) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.custtableDAO.entity(this.sessionInfo.defaultcustomerid)];
                    case 1:
                        checkCustomer_1 = _a.sent();
                        reqData.currency = checkCustomer_1.currency;
                        reqData.custaccount = checkCustomer_1.accountnum;
                        reqData.taxgroup = checkCustomer_1.taxgroup;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.custtableDAO.entity(reqData.custaccount)];
                    case 3:
                        checkCustomer = _a.sent();
                        if (!checkCustomer) {
                            throw { message: "INVALID CUSTOMER" };
                        }
                        _a.label = 4;
                    case 4:
                        if (!checkCustomer) {
                            throw { message: "INVALID CUSTOMER" };
                        }
                        reqData.cashdisc = checkCustomer.cashdisc;
                        reqData.paymtermid = checkCustomer.paymtermid;
                        reqData.custtype = checkCustomer.custtype;
                        reqData.custgroup = checkCustomer.custgroup;
                        return [4 /*yield*/, this.rawQuery.getDiscountBlockItems(checkCustomer.custgroup, checkCustomer.accountnum, this.sessionInfo.inventlocationid)];
                    case 5:
                        discountBlockItems = _a.sent();
                        discountBlockItemsArray_1 = [];
                        discountBlockItems.map(function (v) {
                            discountBlockItemsArray_1.push(v.itemid);
                        });
                        return [4 /*yield*/, this.sessionInfo.sabiccustomers];
                    case 6:
                        sabicCustomers = _a.sent();
                        if (sabicCustomers) {
                            if (sabicCustomers.split(",").includes(reqData.custaccount)) {
                                sabicCustomers = true;
                            }
                            else {
                                sabicCustomers = false;
                            }
                        }
                        ARAMKO_THAKAKOM_DISCOUNT = false;
                        return [4 /*yield*/, this.rawQuery.getAramkoTahkomDiscounts(reqData.custaccount, this.sessionInfo.dataareaid)];
                    case 7:
                        aramkoTahkomDiscounts = _a.sent();
                        if (aramkoTahkomDiscounts.length > 0) {
                            ARAMKO_THAKAKOM_DISCOUNT = true;
                        }
                        // let instantDiscountRanges: any;
                        // let isInstantDiscount: boolean = false;
                        // if (reqData.discountType == "instantDiscount") {
                        //     instantDiscountRanges = await this.rawQuery.checkInstantDiscount(reqData.custaccount);
                        //     if (instantDiscountRanges.length > 0) {
                        //         isInstantDiscount = true;
                        //     }
                        // }
                        //console.log(sabicCustomers);
                        return [4 /*yield*/, this.allocateData(reqData)];
                    case 8:
                        // let instantDiscountRanges: any;
                        // let isInstantDiscount: boolean = false;
                        // if (reqData.discountType == "instantDiscount") {
                        //     instantDiscountRanges = await this.rawQuery.checkInstantDiscount(reqData.custaccount);
                        //     if (instantDiscountRanges.length > 0) {
                        //         isInstantDiscount = true;
                        //     }
                        // }
                        //console.log(sabicCustomers);
                        _a.sent();
                        if (!(reqData.selectedItems && reqData.selectedItems.length > 0)) return [3 /*break*/, 15];
                        t0 = new Date().getTime();
                        if (!sabicCustomers) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.sabicCustomersDiscount(reqData, discountBlockItemsArray_1)];
                    case 9:
                        result = _a.sent();
                        return [3 /*break*/, 14];
                    case 10:
                        if (!ARAMKO_THAKAKOM_DISCOUNT) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.aramkoTahkomDiscount(reqData, aramkoTahkomDiscounts, discountBlockItemsArray_1)];
                    case 11:
                        result = _a.sent();
                        return [3 /*break*/, 14];
                    case 12: return [4 /*yield*/, this.calDiscount(reqData, discountBlockItemsArray_1)];
                    case 13:
                        //console.log("===================");
                        result = _a.sent();
                        _a.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        result = reqData;
                        _a.label = 16;
                    case 16: return [2 /*return*/, result];
                    case 17:
                        error_1 = _a.sent();
                        throw error_1;
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    DiscountService.prototype.calDiscount = function (reqData, discountBlockItemsArray) {
        return __awaiter(this, void 0, void 0, function () {
            var getDiscountsList, checkDiscounts, promotionalDiscountItems, buyOneGetOneDiscountItems, discounts, isTotalDiscount, isLineDiscount, isMultiLineDiscount, isNoDiscount, totalPercentage, linePercentage, multilineDiscRanges, multilineQuantity, multiLineItemCode, multlineDiscItems, total, totalBeforeVat, grossTotal, vouchers, isValidVoucher, isVoucherApplied, voucherDiscountedItems, message, instantDiscountRanges, isInstantDiscount, instantDiscountExcludeItems, inQueryStr_1, voucherDiscountedItem, _loop_1, this_1, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getDiscountsList(reqData)];
                    case 1:
                        getDiscountsList = _b.sent();
                        checkDiscounts = getDiscountsList.checkDiscounts;
                        promotionalDiscountItems = getDiscountsList.promotionalDiscountItems;
                        buyOneGetOneDiscountItems = getDiscountsList.buyOneGetOneDiscountItems;
                        discounts = getDiscountsList.discounts;
                        reqData.discount = 0;
                        reqData.voucherdiscamt = 0;
                        isTotalDiscount = (discounts[0].enddisc && discounts[0].enddisc) != "" ? true : false;
                        isLineDiscount = (discounts[0].linedisc && discounts[0].linedisc) != "" ? true : false;
                        isMultiLineDiscount = (discounts[0].multilinedisc && discounts[0].multilinedisc) != "" ? true : false;
                        isNoDiscount = false;
                        return [4 /*yield*/, this.rawQuery.getTotalDiscPercentage(discounts[0].enddisc, reqData.currency, this.sessionInfo.dataareaid)];
                    case 2:
                        totalPercentage = _b.sent();
                        return [4 /*yield*/, this.rawQuery.getTotalDiscPercentage(discounts[0].linedisc, reqData.currency, this.sessionInfo.dataareaid)];
                    case 3:
                        linePercentage = _b.sent();
                        return [4 /*yield*/, this.rawQuery.getMultiDiscRanges(discounts[0].multilinedisc, reqData.currency, this.sessionInfo.dataareaid)];
                    case 4:
                        multilineDiscRanges = _b.sent();
                        multilineQuantity = 0;
                        multiLineItemCode = multilineDiscRanges.map(function (v) {
                            return v.itemrelation;
                        });
                        multlineDiscItems = checkDiscounts.filter(function (v) { return multiLineItemCode.includes(v.multilinedisc); });
                        multlineDiscItems = multlineDiscItems.map(function (v) {
                            return v.itemid;
                        });
                        //console.log(multlineDiscItems);
                        reqData.selectedItems.map(function (v) {
                            if (multlineDiscItems.includes(v.itemid)) {
                                multilineQuantity += parseInt(v.quantity);
                            }
                        });
                        total = 0;
                        totalBeforeVat = 0;
                        grossTotal = 0;
                        isValidVoucher = false;
                        isVoucherApplied = false;
                        voucherDiscountedItems = [];
                        instantDiscountRanges = [];
                        isInstantDiscount = false;
                        //console.log(reqData);
                        //  console.log("===================",discountBlockItemsArray)
                        // console.log("======================", isTotalDiscount, totalPercentage);
                        if (reqData.paymtermid != "CASH" && reqData.paymtermid != "" && reqData.isCash == true) {
                            isTotalDiscount = true;
                            totalPercentage = "5%";
                        }
                        else if (reqData.paymtermid != "CASH" && reqData.paymtermid != "" && reqData.isCash == false) {
                            isTotalDiscount = false;
                            totalPercentage = 0;
                        }
                        if (!(reqData.discountType == "instantDiscount")) return [3 /*break*/, 8];
                        if (!reqData.walkincustomer) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.rawQuery.checkInstantDiscount(this.sessionInfo.defaultcustomerid)];
                    case 5:
                        instantDiscountRanges = _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.rawQuery.checkInstantDiscount(reqData.custaccount)];
                    case 7:
                        instantDiscountRanges = _b.sent();
                        _b.label = 8;
                    case 8:
                        if (!(reqData.discountType == "voucherDiscount")) return [3 /*break*/, 12];
                        if (!reqData.code) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.rawQuery.getVoucherDiscounts(reqData.code, this.sessionInfo.dataareaid)];
                    case 9:
                        vouchers = _b.sent();
                        if (!vouchers) return [3 /*break*/, 11];
                        inQueryStr_1 = "";
                        reqData.selectedItems.map(function (v) {
                            inQueryStr_1 += "'" + v.itemid + "',";
                        });
                        return [4 /*yield*/, this.rawQuery.getVoucherDiscountItems(vouchers.voucher_type, inQueryStr_1.substr(0, inQueryStr_1.length - 1))];
                    case 10:
                        voucherDiscountedItem = _b.sent();
                        voucherDiscountedItems = [];
                        voucherDiscountedItem.map(function (v) {
                            voucherDiscountedItems.push(v.itemid);
                        });
                        //console.log(vouchers, new Date(vouchers.expiry_date));
                        if (vouchers.is_enabled == 1 ||
                            vouchers.allowed_numbers <= vouchers.used_numbers ||
                            new Date(vouchers.expiry_date) < new Date()) {
                            // console.log("=========================");
                            if (vouchers.is_enabled == 1) {
                                isValidVoucher = false;
                                message = "VOUCHER NUMBER IS DISABLED";
                            }
                            else if (vouchers.allowed_numbers <= vouchers.used_numbers) {
                                isValidVoucher = false;
                                message = "ALREADY USED";
                            }
                            else if (new Date(vouchers.expiry_date) < new Date()) {
                                isValidVoucher = false;
                                message = "VOUCHER EXPIRED";
                            }
                        }
                        else {
                            isValidVoucher = true;
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        message = "INVALID VOUCHER";
                        _b.label = 12;
                    case 12:
                        _loop_1 = function (item) {
                            var instantDiscountPercent, _i, instantDiscountRanges_1, item_1, multilinefilter, condition, appliedDiscounts, freeQty, freeItem, promotionalDiscountAmount, buy_one_get_one, promotionalDiscountDetails, isPromotionDiscount, isBuyOneGetOneDiscount, buyOneGetOneDiscountDetails, promotionalDiscountItemsFilter, itemsquantity_1, freeItems, j, i, itemDiscount;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        instantDiscountPercent = 0;
                                        if (!(instantDiscountRanges.length > 0)) return [3 /*break*/, 2];
                                        isInstantDiscount = true;
                                        return [4 /*yield*/, this_1.rawQuery.instantDiscountExcludeItems(this_1.sessionInfo.usergroupconfigid)];
                                    case 1:
                                        instantDiscountExcludeItems = _a.sent();
                                        console.log(instantDiscountExcludeItems);
                                        instantDiscountExcludeItems = instantDiscountExcludeItems[0].istantdiscountexclude
                                            ? instantDiscountExcludeItems[0].istantdiscountexclude.split(",")
                                            : [];
                                        for (_i = 0, instantDiscountRanges_1 = instantDiscountRanges; _i < instantDiscountRanges_1.length; _i++) {
                                            item_1 = instantDiscountRanges_1[_i];
                                            console.log(item_1, reqData.grossTotal);
                                            // istantDiscountPercentage += parseFloat(item.discpercent);
                                            // istantDiscountPercentage = item.discpercent;
                                            if (reqData.grossTotal && reqData.grossTotal >= parseFloat(item_1.minamount) && reqData.grossTotal <= parseFloat(item_1.maxamount)) {
                                                // discount = istantDiscountPercentage;
                                                instantDiscountPercent = item_1.discpercent;
                                                console.log(instantDiscountPercent);
                                                break;
                                            }
                                        }
                                        _a.label = 2;
                                    case 2:
                                        isMultiLineDiscount = multilineDiscRanges.length > 0 ? true : false;
                                        if (isMultiLineDiscount) {
                                            multilinefilter = checkDiscounts.filter(function (v) { return v.multilinedisc == multilineDiscRanges[0].itemrelation && v.itemid == item.product.products.code; });
                                            isMultiLineDiscount = multilinefilter.length > 0 ? true : false;
                                        }
                                        if (reqData.discountType == "voucherDiscount" && isValidVoucher) {
                                            isValidVoucher = vouchers.voucher_type == "ALL_ITEMS" ? true : voucherDiscountedItems.includes(item.itemid);
                                        }
                                        condition = reqData.discountType == "voucherDiscount" || reqData.discountType == "instantDiscount"
                                            ? "true"
                                            : "!item.isItemFree";
                                        condition = eval(condition);
                                        item.lineTotalDisc = 0;
                                        if (!condition) return [3 /*break*/, 25];
                                        appliedDiscounts = [];
                                        freeQty = 0;
                                        freeItem = void 0;
                                        promotionalDiscountAmount = 0;
                                        buy_one_get_one = 0;
                                        promotionalDiscountDetails = promotionalDiscountItems.filter(function (v) { return v.itemid == item.itemid; });
                                        isPromotionDiscount = false;
                                        isBuyOneGetOneDiscount = false;
                                        buyOneGetOneDiscountDetails = void 0;
                                        if (!(reqData.discountType != "voucherDiscount" && reqData.discountType != "instantDiscount")) return [3 /*break*/, 5];
                                        promotionalDiscountDetails = promotionalDiscountDetails.length > 0 ? promotionalDiscountDetails[0] : null;
                                        // if (promotionalDiscountDetails) {
                                        //   if (promotionalDiscountDetails.multipleQty && item.quantity >= promotionalDiscountDetails.multipleQty) {
                                        //     isPromotionDiscount = true;
                                        //     let freeItems: any = reqData.selectedItems.filter(
                                        //       (v: any) => v.linkId == item.linkId && v.isItemFree == true
                                        //     );
                                        //     console.log(freeItems);
                                        //     for (let j in freeItems) {
                                        //       let i: number = reqData.selectedItems.indexOf(freeItems[j]);
                                        //       promotionalDiscountAmount +=
                                        //         (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                                        //         parseFloat(reqData.selectedItems[i].quantity);
                                        //       reqData.selectedItems[i].priceAfterdiscount =
                                        //         (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                                        //           reqData.selectedItems[i].quantity -
                                        //         0;
                                        //       // console.log(
                                        //       //   "==========================priceAfterdiscount===========================",
                                        //       //   0,
                                        //       //   reqData.selectedItems[i].priceAfterdiscount
                                        //       // );
                                        //       reqData.selectedItems[i].lineTotalDisc = 0;
                                        //       reqData.selectedItems[i].lineamountafterdiscount = parseFloat(
                                        //         reqData.selectedItems[i].priceAfterdiscount
                                        //       );
                                        //       reqData.selectedItems[i].vat = 5;
                                        //       reqData.selectedItems[i].vatamount =
                                        //         parseFloat(reqData.selectedItems[i].priceAfterdiscount) * (reqData.selectedItems[i].vat / 100);
                                        //       reqData.selectedItems[i].priceAfterVat =
                                        //         parseFloat(reqData.selectedItems[i].priceAfterdiscount) +
                                        //         parseFloat(reqData.selectedItems[i].vatamount);
                                        //       reqData.selectedItems[i].lineTotalDisc = reqData.selectedItems[i].lineTotalDisc
                                        //         ? parseFloat(reqData.selectedItems[i].lineTotalDisc)
                                        //         : 0;
                                        //       reqData.discount += reqData.selectedItems[i].lineTotalDisc;
                                        //       total += reqData.selectedItems[i].priceAfterVat;
                                        //       totalBeforeVat += parseFloat(reqData.selectedItems[i].lineamountafterdiscount);
                                        //       //console.log(i, grossTotal);
                                        //       grossTotal +=
                                        //         (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                                        //         parseInt(reqData.selectedItems[i].quantity);
                                        //       console.log(parseFloat(reqData.selectedItems[i].price) * parseInt(reqData.selectedItems[i].quantity));
                                        //       //console.log(i, grossTotal);
                                        //     }
                                        //     freeQty =
                                        //       Math.floor(item.quantity / promotionalDiscountDetails.multipleQty) * promotionalDiscountDetails.freeQty;
                                        //   }
                                        // }
                                        // if (promotionalDiscountAmount > 0) {
                                        //   isPromotionDiscount = true;
                                        // } else {
                                        //   isPromotionDiscount = false;
                                        // }
                                        if (promotionalDiscountDetails) {
                                            promotionalDiscountItemsFilter = reqData.selectedItems.filter(function (v) { return v.itemid == item.itemid && v.inventsizeid == item.inventsizeid; });
                                            itemsquantity_1 = 0;
                                            promotionalDiscountItemsFilter.map(function (v) {
                                                itemsquantity_1 += v.quantity;
                                            });
                                            if (promotionalDiscountDetails.multipleQty && itemsquantity_1 >= promotionalDiscountDetails.multipleQty) {
                                                freeQty =
                                                    Math.floor(itemsquantity_1 / promotionalDiscountDetails.multipleQty) * promotionalDiscountDetails.freeQty;
                                            }
                                            console.log(freeQty);
                                            if (freeQty > 0) {
                                                isPromotionDiscount = true;
                                                promotionalDiscountAmount = (parseFloat(item.price) / itemsquantity_1) * freeQty;
                                                //console.log(promotionalDiscountAmount);
                                                item.promotionalDiscount = promotionalDiscountAmount * item.quantity;
                                                item.supplMultipleQty = promotionalDiscountDetails.multipleQty;
                                                item.supplFreeQty = promotionalDiscountDetails.freeQty;
                                                appliedDiscounts.push({
                                                    discountType: "PROMOTIONAL_DISCOUNT",
                                                    discountAmount: item.promotionalDiscount,
                                                    cond: [
                                                        {
                                                            multipleQty: promotionalDiscountDetails.multipleQty,
                                                            freeQty: promotionalDiscountDetails.freeQty
                                                        }
                                                    ]
                                                });
                                            }
                                        }
                                        buyOneGetOneDiscountDetails = buyOneGetOneDiscountItems.filter(function (v) { return v.itemid == item.itemid; });
                                        //console.log(item.itemid);
                                        //console.log(buyOneGetOneDiscountItems);
                                        //console.log(buyOneGetOneDiscountDetails);
                                        buyOneGetOneDiscountDetails = buyOneGetOneDiscountDetails.length > 0 ? buyOneGetOneDiscountDetails[0] : null;
                                        //console.log(buyOneGetOneDiscountDetails);
                                        if (buyOneGetOneDiscountDetails) {
                                            if (buyOneGetOneDiscountDetails.multipleQty && item.quantity >= buyOneGetOneDiscountDetails.multipleQty) {
                                                isBuyOneGetOneDiscount = true;
                                                //console.log("=============##########################=========================");
                                            }
                                        }
                                        if (!discountBlockItemsArray.includes(item.itemid)) return [3 /*break*/, 4];
                                        isNoDiscount = true;
                                        return [4 /*yield*/, this_1.noDiscount(item, reqData)];
                                    case 3:
                                        _a.sent();
                                        total += item.priceAfterVat * parseInt(item.quantity);
                                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        _a.label = 4;
                                    case 4:
                                        if (isBuyOneGetOneDiscount) {
                                            freeItems = reqData.selectedItems.filter(function (v) { return v.linkId == item.linkId && v.isItemFree == true; });
                                            for (j in freeItems) {
                                                i = reqData.selectedItems.indexOf(freeItems[j]);
                                                itemDiscount = (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) / 2;
                                                //console.log("===itemDiscount===", itemDiscount, reqData.selectedItems[i].quantity);
                                                //console.log("===buy_one_get_one===", buy_one_get_one);
                                                buy_one_get_one += parseFloat(itemDiscount) * parseInt(reqData.selectedItems[i].quantity);
                                                //console.log("===buy_one_get_one===", buy_one_get_one);
                                                reqData.selectedItems[i].buyOneGetOneDiscount =
                                                    parseFloat(itemDiscount) * parseInt(reqData.selectedItems[i].quantity);
                                                reqData.selectedItems[i].priceAfterdiscount =
                                                    (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                                                        reqData.selectedItems[i].quantity -
                                                        reqData.selectedItems[i].buyOneGetOneDiscount;
                                                //console.log("==========================priceAfterdiscount===========================", itemDiscount, reqData.selectedItems[i].priceAfterdiscount);
                                                reqData.selectedItems[i].lineTotalDisc = reqData.selectedItems[i].buyOneGetOneDiscount;
                                                reqData.selectedItems[i].lineamountafterdiscount = parseFloat(reqData.selectedItems[i].priceAfterdiscount);
                                                reqData.selectedItems[i].vat = 5;
                                                reqData.selectedItems[i].vatamount =
                                                    parseFloat(reqData.selectedItems[i].priceAfterdiscount) * (reqData.selectedItems[i].vat / 100);
                                                reqData.selectedItems[i].priceAfterVat =
                                                    parseFloat(reqData.selectedItems[i].priceAfterdiscount) +
                                                        parseFloat(reqData.selectedItems[i].vatamount);
                                                reqData.selectedItems[i].lineTotalDisc = reqData.selectedItems[i].lineTotalDisc
                                                    ? parseFloat(reqData.selectedItems[i].lineTotalDisc)
                                                    : 0;
                                                reqData.discount += reqData.selectedItems[i].lineTotalDisc;
                                                total += reqData.selectedItems[i].priceAfterVat;
                                                totalBeforeVat += parseFloat(reqData.selectedItems[i].lineamountafterdiscount);
                                                //console.log(i, grossTotal);
                                                grossTotal +=
                                                    (parseFloat(reqData.selectedItems[i].price) + parseFloat(reqData.selectedItems[i].colorantprice)) *
                                                        parseInt(reqData.selectedItems[i].quantity);
                                                //console.log(parseFloat(reqData.selectedItems[i].price) * parseInt(reqData.selectedItems[i].quantity));
                                                //console.log(i, grossTotal);
                                                reqData.selectedItems[i].appliedDiscounts = [
                                                    {
                                                        discountType: "BUY_ONE_GET_ONE_DISCOUNT",
                                                        discountAmount: reqData.selectedItems[i].lineTotalDisc,
                                                        cond: [
                                                            {
                                                                multipleQty: buyOneGetOneDiscountDetails.multipleQty,
                                                                freeQty: buyOneGetOneDiscountDetails.freeQty
                                                            }
                                                        ]
                                                    }
                                                ];
                                                // }
                                            }
                                            //console.log(buy_one_get_one);
                                            if (buy_one_get_one > 0) {
                                                isBuyOneGetOneDiscount = true;
                                            }
                                            else {
                                                isBuyOneGetOneDiscount = false;
                                            }
                                            // if (buy_one_get_one > 0) {
                                            //   item.buyOneGetOneDiscount = Math.round(parseFloat(((buy_one_get_one / parseInt(item.quantity)) * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                                            //   console.log(buy_one_get_one);
                                            //   await this.buyOneGetOneDiscount(item, reqData);
                                            //   reqData.discount += item.lineTotalDisc;
                                            //   total += item.priceAfterVat * parseInt(item.quantity);
                                            //   totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                            //   grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                            //   console.log(grossTotal);
                                            //   appliedDiscounts.push({
                                            //     discountType: "BUY_ONE_GET_DISCOUNT",
                                            //     discountAmount: buy_one_get_one,
                                            //     cond: [
                                            //       {
                                            //         multipleQty: buyOneGetOneDiscountDetails.multipleQty,
                                            //         freeQty: buyOneGetOneDiscountDetails.freeQty
                                            //       }
                                            //     ]
                                            //   });
                                            // } else {
                                            //   isBuyOneGetOneDiscount = false;
                                            //   // buy_one_get_one = (item.price + item.colorantprice) / 2;
                                            //   // item.buyOneGetOneDiscount = buy_one_get_one;
                                            //   // console.log("==============", buy_one_get_one);
                                            //   // item.freeQty = item.quantity;
                                            //   // await this.buyOneGetOneDiscount(item, reqData);
                                            //   // reqData.discount += item.buyOneGetOneDiscount * parseInt(item.quantity);
                                            //   // total += item.priceAfterVat * parseInt(item.quantity);
                                            //   // totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                            //   // grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                            //   // console.log(grossTotal);
                                            // }
                                        }
                                        _a.label = 5;
                                    case 5:
                                        if (!!isNoDiscount) return [3 /*break*/, 24];
                                        //console.log("valid voucher", isValidVoucher);
                                        if (isValidVoucher) {
                                            if (vouchers) {
                                                if (vouchers.voucher_type == "GROUP_ITEMS" || vouchers.voucher_type == "SPECIFIC_ITEMS") {
                                                    isValidVoucher = voucherDiscountedItems.includes(item.itemid);
                                                    //console.log("valid voucher", isValidVoucher, item.itemid, voucherDiscountedItems);
                                                }
                                                else if (vouchers.voucher_type == "ALL_ITEMS") {
                                                    isValidVoucher = true;
                                                }
                                                // if (vouchers.relationtype == "SPECIFIC_USERS") {
                                                //   isValidVoucher = voucherDiscountedItems.includes(reqData.custaccount);
                                                // }
                                            }
                                        }
                                        if (isInstantDiscount && !isNoDiscount) {
                                            //console.log(instantDiscountExcludeItems, item.itemid);
                                            if (instantDiscountExcludeItems.includes(item.itemid)) {
                                                isInstantDiscount = false;
                                            }
                                            else {
                                                isInstantDiscount = true;
                                            }
                                        }
                                        if (!(isInstantDiscount && !isNoDiscount)) return [3 /*break*/, 7];
                                        // //console.log("kd;hgigh;osihg;osihg;oishrg;oi");
                                        //console.log(instantDiscountPercent);
                                        return [4 /*yield*/, this_1.calInstantDiscount(reqData, item, instantDiscountPercent)];
                                    case 6:
                                        // //console.log("kd;hgigh;osihg;osihg;oishrg;oi");
                                        //console.log(instantDiscountPercent);
                                        _a.sent();
                                        total += item.priceAfterVat;
                                        totalBeforeVat += item.lineamountafterdiscount;
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        appliedDiscounts.push({
                                            discountType: "INSTANT_DISCOUNT",
                                            percentage: item.instantDisc,
                                            discountAmount: item.instantdiscamt,
                                            cond: instantDiscountRanges
                                        });
                                        return [3 /*break*/, 23];
                                    case 7:
                                        if (!isValidVoucher) return [3 /*break*/, 9];
                                        isVoucherApplied = true;
                                        return [4 /*yield*/, this_1.calVoucherDiscount(item, reqData, vouchers)];
                                    case 8:
                                        _a.sent();
                                        appliedDiscounts.push({
                                            discountType: "VOUCHER_DISCOUNT",
                                            percentage: item.voucherdisc,
                                            discountAmount: item.voucherdiscamt
                                        });
                                        // ////console.log(item.baseSizes);
                                        total += item.priceAfterVat;
                                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        return [3 /*break*/, 23];
                                    case 9:
                                        if (!(!isLineDiscount &&
                                            !isTotalDiscount &&
                                            !isMultiLineDiscount &&
                                            !isPromotionDiscount &&
                                            !isBuyOneGetOneDiscount)) return [3 /*break*/, 11];
                                        return [4 /*yield*/, this_1.noDiscount(item, reqData)];
                                    case 10:
                                        _a.sent();
                                        total += item.priceAfterVat;
                                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        return [3 /*break*/, 23];
                                    case 11:
                                        if (!isTotalDiscount) return [3 /*break*/, 13];
                                        // console.log("======isTotalDiscount============", grossTotal);
                                        return [4 /*yield*/, this_1.totalDiscount(item, reqData, checkDiscounts, totalPercentage)];
                                    case 12:
                                        // console.log("======isTotalDiscount============", grossTotal);
                                        _a.sent();
                                        appliedDiscounts.push({
                                            discountType: "TOTAL_DISCOUNT",
                                            percentage: item.endDisc,
                                            discountAmount: item.enddiscamt,
                                            cond: []
                                        });
                                        _a.label = 13;
                                    case 13:
                                        if (!(isLineDiscount && !isNoDiscount)) return [3 /*break*/, 15];
                                        //console.log("======isLineDiscount============", grossTotal);
                                        return [4 /*yield*/, this_1.lineDiscount(item, reqData, checkDiscounts, linePercentage)];
                                    case 14:
                                        //console.log("======isLineDiscount============", grossTotal);
                                        _a.sent();
                                        appliedDiscounts.push({
                                            discountType: "LINE_DISCOUNT",
                                            percentage: item.linediscpercent,
                                            discountAmount: item.linediscamt,
                                            cond: []
                                        });
                                        _a.label = 15;
                                    case 15:
                                        if (!(isMultiLineDiscount && !isNoDiscount)) return [3 /*break*/, 18];
                                        ////console.log("======isMultiLineDiscount============", grossTotal);
                                        return [4 /*yield*/, this_1.getMultiLinePercent(item, multilineDiscRanges, checkDiscounts, discounts[0].multilinedisc, multilineQuantity)];
                                    case 16:
                                        ////console.log("======isMultiLineDiscount============", grossTotal);
                                        _a.sent();
                                        return [4 /*yield*/, this_1.multiLineDiscount(item, reqData)];
                                    case 17:
                                        _a.sent();
                                        appliedDiscounts.push({
                                            discountType: "MULTI_LINE_DISCOUNT",
                                            discountAmount: item.multilndisc,
                                            percentage: item.multilnPercent,
                                            cond: multilineDiscRanges
                                        });
                                        item.multilndisc;
                                        item.multilnPercent;
                                        _a.label = 18;
                                    case 18:
                                        if (!(isPromotionDiscount && !isNoDiscount)) return [3 /*break*/, 20];
                                        if (!(promotionalDiscountAmount > 0)) return [3 /*break*/, 20];
                                        // console.log("======promotionalDiscount============", grossTotal);
                                        // console.log(promotionalDiscountAmount);
                                        // item.promotionalDiscount = promotionalDiscountAmount;
                                        // item.supplMultipleQty = promotionalDiscountDetails.multipleQty;
                                        // item.supplFreeQty = promotionalDiscountDetails.freeQty;
                                        return [4 /*yield*/, this_1.promotionalDiscount(item, reqData)];
                                    case 19:
                                        // console.log("======promotionalDiscount============", grossTotal);
                                        // console.log(promotionalDiscountAmount);
                                        // item.promotionalDiscount = promotionalDiscountAmount;
                                        // item.supplMultipleQty = promotionalDiscountDetails.multipleQty;
                                        // item.supplFreeQty = promotionalDiscountDetails.freeQty;
                                        _a.sent();
                                        _a.label = 20;
                                    case 20:
                                        if (!(isBuyOneGetOneDiscount && !isNoDiscount)) return [3 /*break*/, 22];
                                        item.buyOneGetOneDiscount = buy_one_get_one;
                                        ////console.log(buy_one_get_one);
                                        return [4 /*yield*/, this_1.buyOneGetOneDiscount(item, reqData)];
                                    case 21:
                                        ////console.log(buy_one_get_one);
                                        _a.sent();
                                        // reqData.discount += item.lineTotalDisc;
                                        // total += item.priceAfterVat;
                                        // totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        // grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        ////console.log(grossTotal);
                                        appliedDiscounts.push({
                                            discountType: "BUY_ONE_GET_ONE_DISCOUNT",
                                            discountAmount: buy_one_get_one,
                                            cond: [
                                                {
                                                    multipleQty: buyOneGetOneDiscountDetails.multipleQty,
                                                    freeQty: buyOneGetOneDiscountDetails.freeQty
                                                }
                                            ]
                                        });
                                        _a.label = 22;
                                    case 22:
                                        // console.log(
                                        //   "===========================item.priceAfterdiscount========================================",
                                        //   parseFloat(item.priceAfterdiscount)
                                        // );
                                        item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                                        item.vat = 5;
                                        item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                                        // console.log(item.baseSizes);
                                        item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                                        total += item.priceAfterVat;
                                        totalBeforeVat += item.lineamountafterdiscount;
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        _a.label = 23;
                                    case 23:
                                        item.netAmount = item.priceAfterVat;
                                        _a.label = 24;
                                    case 24:
                                        // //console.log(discounts);
                                        // }
                                        item.appliedDiscounts = appliedDiscounts;
                                        _a.label = 25;
                                    case 25: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = reqData.selectedItems;
                        _b.label = 13;
                    case 13:
                        if (!(_i < _a.length)) return [3 /*break*/, 16];
                        item = _a[_i];
                        return [5 /*yield**/, _loop_1(item)];
                    case 14:
                        _b.sent();
                        _b.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 13];
                    case 16:
                        //console.log(grossTotal);
                        reqData.total = total;
                        reqData.grossTotal = grossTotal;
                        reqData.totalBeforeVat = totalBeforeVat;
                        reqData.isVoucherApplied = isVoucherApplied;
                        // //console.log("!!!!!!!", reqData.grossTotal, "||||||");
                        if (isVoucherApplied) {
                            message = "You Saved " + reqData.voucherdiscamt + " from this Voucher";
                        }
                        //console.log(message);
                        reqData.message = message;
                        return [4 /*yield*/, this.calData(reqData)];
                    case 17:
                        _b.sent();
                        return [2 /*return*/, reqData];
                }
            });
        });
    };
    DiscountService.prototype.totalDiscount = function (item, reqData, checkDiscounts, totalPercentage) {
        return __awaiter(this, void 0, void 0, function () {
            var enddisc, dummyData;
            return __generator(this, function (_a) {
                enddisc = checkDiscounts.filter(function (v) { return v.itemid == item.itemid; });
                dummyData = {};
                dummyData.enddisc = "";
                enddisc = enddisc.length > 0 ? enddisc[0] : dummyData;
                if (enddisc.enddisc == "1") {
                    totalPercentage = totalPercentage;
                }
                else {
                    totalPercentage = 0;
                }
                item.endDisc = parseFloat(totalPercentage);
                item.enddiscamt = parseFloat(item.price) * parseInt(item.quantity) * (parseFloat(totalPercentage) / 100);
                item.priceAfterdiscount =
                    (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity) - parseFloat(item.enddiscamt);
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
                item.lineTotalDisc += item.enddiscamt;
                reqData.discount += item.enddiscamt;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.lineDiscount = function (item, reqData, checkDiscounts, linePercentage) {
        if (linePercentage === void 0) { linePercentage = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var linedisc, dummyData;
            return __generator(this, function (_a) {
                linedisc = checkDiscounts.filter(function (v) { return v.itemid == item.product.products.code; });
                dummyData = {};
                dummyData.linedisc = "";
                linedisc = linedisc.length > 0 ? linedisc[0] : dummyData;
                if (linedisc && linedisc.linedisc && linedisc.linedisc != "") {
                    linePercentage = linePercentage;
                }
                else {
                    linePercentage = 0;
                }
                // item.discount = parseFloat(percentage);
                item.linediscpercent = parseFloat(linePercentage);
                item.linediscamt = parseFloat(item.price) * parseInt(item.quantity) * (parseFloat(linePercentage) / 100);
                item.priceAfterdiscount =
                    (parseFloat(item.priceAfterdiscount)
                        ? parseFloat(item.priceAfterdiscount) - parseFloat(item.linediscamt)
                        : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity) - parseFloat(item.linediscamt);
                // await this.calLineAmounts(item);
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
                item.lineTotalDisc += parseFloat(item.linediscamt);
                reqData.discount += parseFloat(item.linediscamt);
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.multiLineDiscount = function (line, reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var productPrice;
            return __generator(this, function (_a) {
                line.multilnPercent = line.multilnPercent ? parseFloat(line.multilnPercent) : 0;
                line.multilndisc = parseFloat(line.price) * parseInt(line.quantity) * (parseFloat(line.multilnPercent) / 100);
                productPrice = (parseFloat(line.price) + parseFloat(line.colorantprice)) * line.quantity;
                line.priceAfterdiscount = line.priceAfterdiscount
                    ? parseFloat(line.priceAfterdiscount) - parseFloat(line.multilndisc)
                    : productPrice - parseFloat(line.multilndisc);
                // await this.calLineAmounts(line);
                // console.log("=====================", productPrice - parseFloat(line.multilndisc));
                //console.log();
                line.lineTotalDisc = line.lineTotalDisc ? line.lineTotalDisc : 0;
                line.lineTotalDisc += line.multilndisc;
                reqData.discount += line.multilndisc;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.buyOneGetOneDiscount = function (item, reqData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                item.priceAfterdiscount = parseFloat(item.priceAfterdiscount)
                    ? parseFloat(item.priceAfterdiscount) - parseFloat(item.buyOneGetOneDiscount)
                    : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
                        parseFloat(item.buyOneGetOneDiscount);
                console.log("=================priceAfterdiscount=============", item.priceAfterdiscount, item.price, item.colorantprice, item.buyOneGetOneDiscount);
                // item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                // item.vat = 5;
                // item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                // item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
                item.lineTotalDisc += parseFloat(item.buyOneGetOneDiscount);
                reqData.discount += item.buyOneGetOneDiscount;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.promotionalDiscount = function (item, reqData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // let discForEachItem: number = parseFloat(item.promotionalDiscount) / parseInt(item.quantity);
                // console.log("==========discForEachItem==============", item.price, discForEachItem);
                item.priceAfterdiscount = parseFloat(item.priceAfterdiscount)
                    ? parseFloat(item.priceAfterdiscount) - item.promotionalDiscount
                    : (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - item.promotionalDiscount;
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                // item.vat = 5;
                item.lineTotalDisc = item.lineTotalDisc ? item.lineTotalDisc : 0;
                // item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                // item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                item.lineTotalDisc += parseFloat(item.promotionalDiscount);
                reqData.discount += item.promotionalDiscount;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.aramkoTahkomDiscount = function (reqData, aramkoTahkomDiscounts, discountBlockItemsArray) {
        return __awaiter(this, void 0, void 0, function () {
            var total, totalBeforeVat, grossTotal, totalPercentage, inQueryStr, itemTypes, _loop_2, this_2, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        total = 0;
                        totalBeforeVat = 0;
                        grossTotal = 0;
                        totalPercentage = 0;
                        reqData.discount = reqData.discount ? reqData.discount : 0;
                        inQueryStr = "";
                        reqData.selectedItems.forEach(function (v) {
                            inQueryStr += "'" + v.itemid + "',";
                        });
                        inQueryStr = inQueryStr.length > 1 ? inQueryStr.substr(0, inQueryStr.length - 1) : inQueryStr;
                        return [4 /*yield*/, this.db.query("select itemid, int_ext as \"intExt\" from inventtable where itemid in (" + inQueryStr + ")")];
                    case 1:
                        itemTypes = _b.sent();
                        _loop_2 = function (item) {
                            var itemtype, filteredItem;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        itemtype = itemTypes.filter(function (v) { return v.itemid == item.itemid; });
                                        // console.log(itemtype);
                                        itemtype = itemtype.length > 0 ? itemtype[0] : {};
                                        filteredItem = aramkoTahkomDiscounts.filter(function (v) { return v.intExt == itemtype.intExt; });
                                        // console.log(filteredItem)
                                        filteredItem = filteredItem.length > 0 ? filteredItem[0] : {};
                                        // console.log(filteredItem);
                                        totalPercentage = filteredItem.salesDiscount ? filteredItem.salesDiscount : 0;
                                        if (!discountBlockItemsArray.includes(item.itemid)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_2.noDiscount(item, reqData)];
                                    case 1:
                                        _a.sent();
                                        total += item.priceAfterVat * parseInt(item.quantity);
                                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        item.aramkoTahkomDiscount = parseFloat(item.price) * item.quantity * (parseFloat(totalPercentage) / 100);
                                        item.priceAfterdiscount =
                                            (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
                                                parseFloat(item.aramkoTahkomDiscount);
                                        // await this.calLineAmounts(item);
                                        item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                                        item.vat = 5;
                                        item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                                        item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                                        item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
                                        item.lineTotalDisc = item.aramkoTahkomDiscount;
                                        total += item.priceAfterVat;
                                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * parseInt(item.quantity);
                                        reqData.discount += item.aramkoTahkomDiscount;
                                        //console.log(reqData.discount);
                                        item.netAmount = item.priceAfterVat;
                                        item.appliedDiscounts = [
                                            {
                                                discountType: "ARAMKO_TAHAKOM_DISOUNT",
                                                percentage: totalPercentage,
                                                discountAmount: item.aramkoTahkomDiscount
                                            }
                                        ];
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, _a = reqData.selectedItems;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        item = _a[_i];
                        return [5 /*yield**/, _loop_2(item)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        reqData.total = total;
                        reqData.grossTotal = grossTotal;
                        reqData.totalBeforeVat = totalBeforeVat;
                        reqData.isVoucherApplied = false;
                        reqData.message = "For Aramko And Thahakom Customers Other Discounts Will Not Apply";
                        // console.log(reqData);
                        return [2 /*return*/, reqData];
                }
            });
        });
    };
    DiscountService.prototype.calVoucherDiscount = function (item, reqData, voucher) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // if (voucher.vouchertype == "PERCENTAGE") {
                //console.log("percentage", voucher);
                item.voucherdisc = parseFloat(voucher.discount_percent);
                item.voucherdiscamt = parseFloat(item.price) * item.quantity * (parseFloat(voucher.discount_percent) / 100);
                item.priceAfterdiscount =
                    (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - parseFloat(item.voucherdiscamt);
                // await this.calLineAmounts(item);
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                item.vat = 5;
                item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
                item.lineTotalDisc += item.voucherdiscamt;
                reqData.discount += item.voucherdiscamt;
                reqData.voucherdiscamt += item.voucherdiscamt;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.calInstantDiscount = function (reqData, item, discount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                item.instantDisc = discount;
                item.instantdiscamt = parseFloat(item.price) * item.quantity * (discount / 100);
                item.priceAfterdiscount =
                    (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity - parseFloat(item.instantdiscamt);
                // await this.calLineAmounts(item);
                // item.lineTotalDisc += parseFloat(item.price) * (discount / 100) * parseInt(item.quantity);
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                item.vat = 5;
                item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
                item.lineTotalDisc += item.instantdiscamt;
                reqData.discount += item.instantdiscamt;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.sabicCustomersDiscount = function (reqData, discountBlockItemsArray) {
        return __awaiter(this, void 0, void 0, function () {
            var total, totalBeforeVat, grossTotal, totalPercentage, _i, _a, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        total = 0;
                        totalBeforeVat = 0;
                        grossTotal = 0;
                        totalPercentage = 10;
                        reqData.discount = reqData.discount ? reqData.discount : 0;
                        _i = 0, _a = reqData.selectedItems;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        item = _a[_i];
                        if (!discountBlockItemsArray.includes(item.product.products.code)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.noDiscount(item, reqData)];
                    case 2:
                        _b.sent();
                        total += item.priceAfterVat;
                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
                        return [3 /*break*/, 5];
                    case 3:
                        item.sabicCustomerDiscount = parseFloat(item.price) * item.quantity * (parseFloat(totalPercentage) / 100);
                        console.log(item.sabicCustomerDiscount);
                        item.priceAfterdiscount =
                            (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity -
                                parseFloat(item.sabicCustomerDiscount);
                        return [4 /*yield*/, this.calLineAmounts(item)];
                    case 4:
                        _b.sent();
                        item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                        item.vat = 5;
                        item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                        item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                        item.lineTotalDisc = item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
                        item.lineTotalDisc = item.sabicCustomerDiscount;
                        total += item.priceAfterVat;
                        totalBeforeVat += parseFloat(item.lineamountafterdiscount);
                        grossTotal += (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
                        reqData.discount += item.sabicCustomerDiscount;
                        //console.log(reqData.discount);
                        item.netAmount = item.priceAfterVat;
                        item.appliedDiscounts = [
                            {
                                discountType: "SABIC_CUSTOMER_DISCOUNT",
                                percentage: totalPercentage,
                                discountAmount: item.sabicCustomerDiscount
                            }
                        ];
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        reqData.total = total;
                        reqData.grossTotal = grossTotal;
                        reqData.totalBeforeVat = totalBeforeVat;
                        reqData.isVoucherApplied = false;
                        reqData.message = "For Sabic Customers Other Discounts Will Not Apply";
                        return [2 /*return*/, reqData];
                }
            });
        });
    };
    DiscountService.prototype.noDiscount = function (item, reqData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("noDiscount");
                item.priceAfterdiscount = (parseFloat(item.price) + parseFloat(item.colorantprice)) * item.quantity;
                console.log(item.quantity, item.price, item.priceAfterdiscount);
                item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
                item.vat = 5;
                item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
                item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
                item.lineTotalDisc += item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
                reqData.discount += 0;
                return [2 /*return*/];
            });
        });
    };
    DiscountService.prototype.getDiscountsList = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var inQueryStr, checkDiscounts, promotionalDiscountItems, buyOneGetOneDiscountItems, discounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inQueryStr = "";
                        reqData.selectedItems.map(function (v) {
                            inQueryStr += "'" + v.itemid + "',";
                        });
                        return [4 /*yield*/, this.rawQuery.checkDiscounts(inQueryStr.substr(0, inQueryStr.length - 1))];
                    case 1:
                        checkDiscounts = _a.sent();
                        return [4 /*yield*/, this.rawQuery.getPromotionalDiscountItems(inQueryStr.substr(0, inQueryStr.length - 1), this.sessionInfo.inventlocationid, reqData.custaccount, reqData.custtype)];
                    case 2:
                        promotionalDiscountItems = _a.sent();
                        return [4 /*yield*/, this.rawQuery.getBuyOneGetOneDiscountItems(inQueryStr.substr(0, inQueryStr.length - 1), this.sessionInfo.inventlocationid, reqData.custaccount, reqData.custtype)];
                    case 3:
                        buyOneGetOneDiscountItems = _a.sent();
                        return [4 /*yield*/, this.rawQuery.getDiscounts(reqData.custaccount, reqData.orderType)];
                    case 4:
                        discounts = _a.sent();
                        return [4 /*yield*/, {
                                checkDiscounts: checkDiscounts,
                                promotionalDiscountItems: promotionalDiscountItems,
                                discounts: discounts,
                                buyOneGetOneDiscountItems: buyOneGetOneDiscountItems
                            }];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DiscountService.prototype.getMultiLinePercent = function (line, multilineDiscRanges, checkDiscounts, multiLineDisc, quantity) {
        var percent = 0;
        // console.log(multilineDiscRanges)
        for (var _i = 0, multilineDiscRanges_1 = multilineDiscRanges; _i < multilineDiscRanges_1.length; _i++) {
            var element = multilineDiscRanges_1[_i];
            percent += parseFloat(element.percent1);
            // console.log(line.quantity, element.quantityamount);
            if (quantity >= parseFloat(element.quantityamount)) {
                line.multilnPercent = percent;
                line.multilineDiscRanges = multilineDiscRanges;
                // console.log(percent);
                // }
            }
        }
    };
    DiscountService.prototype.takeTwoDecimalValues = function (value) {
        return parseFloat(value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
    };
    DiscountService.prototype.calData = function (reqData) {
        //console.log(reqData.grossTotal);
        reqData.vatamount = 0;
        for (var _i = 0, _a = reqData.selectedItems; _i < _a.length; _i++) {
            var ele = _a[_i];
            reqData.vatamount += parseFloat(ele.vatamount);
            ele.lineamount = (ele.price + ele.colorantprice) * ele.quantity + ele.vatamount - ele.lineTotalDisc;
            ele.priceAfterdiscount = ele.priceAfterdiscount;
            ele.lineamountafterdiscount = ele.lineamountafterdiscount;
            ele.vatamount = ele.vatamount;
            ele.priceAfterVat = ele.priceAfterVat;
            ele.lineTotalDisc = ele.lineTotalDisc;
            ele.instantdiscamt = ele.instantdiscamt;
            ele.lineamount = ele.lineamount;
        }
        reqData.discount = reqData.discount;
        reqData.totalBeforeVat = reqData.totalBeforeVat;
        reqData.total = reqData.total;
        reqData.grossTotal = reqData.grossTotal;
        //console.log(reqData.grossTotal);
        // console.log("=======================================================");
    };
    DiscountService.prototype.calLineAmounts = function (item) {
        console.log("===================priceAfterdiscount=============", item.priceAfterdiscount);
        // item.lineamountafterdiscount = parseFloat(item.priceAfterdiscount);
        // item.vat = 5;
        // item.vatamount = parseFloat(item.priceAfterdiscount) * (item.vat / 100);
        // item.priceAfterVat = parseFloat(item.priceAfterdiscount) + parseFloat(item.vatamount);
        // item.lineTotalDisc += item.lineTotalDisc ? parseFloat(item.lineTotalDisc) : 0;
    };
    DiscountService.prototype.allocateData = function (reqData) {
        reqData.selectedItems.forEach(function (ele) {
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
        });
    };
    DiscountService.prototype.groupBy = function (array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    };
    return DiscountService;
}());
exports.DiscountService = DiscountService;
