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
var App_1 = require("../../utils/App");
var SalesTableDAO_1 = require("../repos/SalesTableDAO");
var InventTransDAO_1 = require("../repos/InventTransDAO");
var SalesLineDAO_1 = require("../repos/SalesLineDAO");
var CusttableDAO_1 = require("../repos/CusttableDAO");
var UsergroupconfigDAO_1 = require("../repos/UsergroupconfigDAO");
var ColorsDAO_1 = require("../repos/ColorsDAO");
var RawQuery_1 = require("../common/RawQuery");
var Props_1 = require("../../constants/Props");
var Overdue_1 = require("../../entities/Overdue");
var OverDueDAO_1 = require("../repos/OverDueDAO");
var InventbatchDAO_1 = require("../repos/InventbatchDAO");
var VisitCustomerService_1 = require("./VisitCustomerService");
var VisitCustomer_1 = require("../../entities/VisitCustomer");
var DesignerserviceRepository_1 = require("../repos/DesignerserviceRepository");
var AppliedDiscountsDAO_1 = require("../repos/AppliedDiscountsDAO");
var InventLoactionDAO_1 = require("../repos/InventLoactionDAO");
var UpdateInventoryService_1 = require("../services/UpdateInventoryService");
var RedeemService_1 = require("../services/RedeemService");
var moment = require("moment");
// to generate uuid for salesline data
var uuid = require("uuid");
var Sms_1 = require("../../utils/Sms");
var SalesTableService = /** @class */ (function () {
    function SalesTableService() {
        this.colorsDAO = new ColorsDAO_1.ColorsDAO();
        this.salestableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.salesLineDAO = new SalesLineDAO_1.SalesLineDAO();
        this.usergroupconfigDAO = new UsergroupconfigDAO_1.UsergroupconfigDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.custtableDAO = new CusttableDAO_1.CusttableDAO();
        this.overDueDAO = new OverDueDAO_1.OverDueDAO();
        this.inventbatchDAO = new InventbatchDAO_1.InventbatchDAO();
        this.visitCustomerService = new VisitCustomerService_1.VisitCustomerService();
        this.designerServiceDAO = new DesignerserviceRepository_1.DesignerserviceRepository();
        this.appliedDiscountsDAO = new AppliedDiscountsDAO_1.AppliedDiscountsDAO();
        this.inventlocationDAO = new InventLoactionDAO_1.InventlocationDAO();
        this.visitCustomerService.sessionInfo = this.sessionInfo;
        this.inventTransDAO = new InventTransDAO_1.InventorytransDAO();
        this.updateInventoryService = new UpdateInventoryService_1.UpdateInventoryService();
        this.updateInventoryService.sessionInfo = this.sessionInfo;
        this.redeemService = new RedeemService_1.RedeemService();
    }
    SalesTableService.prototype.entity = function (id, type) {
        if (type === void 0) { type = null; }
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, _b, _c, salesLine, _i, salesLine_1, item, baseSizeBatchesList_1, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 12, , 13]);
                        return [4 /*yield*/, this.salestableDAO.entity(id.toUpperCase())];
                    case 1:
                        data = _d.sent();
                        if (!data) {
                            throw { message: "ORDER_NOT_FOUND" };
                        }
                        return [4 /*yield*/, this.calData(data)];
                    case 2:
                        _d.sent();
                        data.custAccount = data.custAccount ? data.custAccount.trim() : null;
                        _a = data;
                        return [4 /*yield*/, this.custtableDAO.entity(data.custAccount)];
                    case 3:
                        _a.customer = _d.sent();
                        data.customer = data.customer ? data.customer : {};
                        _b = data;
                        return [4 /*yield*/, this.inventlocationDAO.entity(data.custAccount)];
                    case 4:
                        _b.toWarehouse = _d.sent();
                        _c = data;
                        return [4 /*yield*/, this.custtableDAO.entity(data.painter)];
                    case 5:
                        _c.painter = _d.sent();
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
                        salesLine = data.salesLine;
                        return [4 /*yield*/, this.allocateSalesLineData(salesLine)];
                    case 6:
                        _d.sent();
                        salesLine.sort(function (a, b) {
                            var lineA = a.lineNum, lineB = b.lineNum;
                            if (lineA < lineB)
                                //sort string ascending
                                return -1;
                            if (lineA > lineB)
                                return 1;
                            return 0; //default return value (no sorting)
                        });
                        _i = 0, salesLine_1 = salesLine;
                        _d.label = 7;
                    case 7:
                        if (!(_i < salesLine_1.length)) return [3 /*break*/, 10];
                        item = salesLine_1[_i];
                        item.product = item.size ? item.size.product : {};
                        item.size = item.size ? item.size : {};
                        delete item.size.product;
                        if (!(data.transkind == "TRANSFERORDER" && data.custAccount == this.sessionInfo.inventlocationid)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.inventoryOnHandCheck(item, data.transkind, data.custAccount)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.rawQuery.getBaseSizeBatchesList(id)];
                    case 11:
                        baseSizeBatchesList_1 = _d.sent();
                        if (data.transkind == "SALESORDER" || data.transkind == "TRANSFERORDER") {
                            salesLine.map(function (item) {
                                item.batches = baseSizeBatchesList_1.filter(function (v) {
                                    return v.itemid == item.itemid &&
                                        v.configid == item.configId &&
                                        v.inventsizeid == item.inventsizeid &&
                                        v.saleslineid == item.id;
                                });
                            });
                        }
                        if (type == "mobile") {
                            delete data.salesLine;
                            data.selectedItems = salesLine;
                        }
                        else {
                            delete data.salesLine;
                            data.salesLine = salesLine;
                        }
                        return [2 /*return*/, data];
                    case 12:
                        error_1 = _d.sent();
                        throw error_1;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.allocateSalesLineData = function (salesLine) {
        salesLine.map(function (v) {
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
            v.appliedDiscounts = v.appliedDiscounts ? v.appliedDiscounts : [];
            v.appliedDiscounts.map(function (value) {
                value.percentage = value.percentage ? parseFloat(value.percentage) : 0;
                value.discountAmount = value.discountAmount ? parseFloat(value.discountAmount) : 0;
            });
        });
    };
    SalesTableService.prototype.designerServiceEntity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, salesLine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.salestableDAO.entity(id.toUpperCase())];
                    case 1:
                        data = _a.sent();
                        if (!data) {
                            throw { message: "ORDER_NOT_FOUND" };
                        }
                        return [4 /*yield*/, this.salesLineDAO.getDesignerServiceLines(id)];
                    case 2:
                        salesLine = _a.sent();
                        data.salesLine = salesLine;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SalesTableService.prototype.inventoryOnHandCheck = function (item, transkind, custAccount) {
        return __awaiter(this, void 0, void 0, function () {
            var inventory, availabilty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rawQuery.inventoryOnHand({
                            inventlocationid: custAccount == this.sessionInfo.inventlocationid ? custAccount : this.sessionInfo.inventlocationid,
                            itemId: item.itemid,
                            configid: item.color ? item.color.code : null,
                            inventsizeid: item.size.code
                        })];
                    case 1:
                        inventory = _a.sent();
                        availabilty = 0;
                        inventory.forEach(function (element) {
                            availabilty += Number(element.availabilty);
                        });
                        //console.log("--------------------------------------------", availabilty);
                        if (availabilty > 0) {
                            // item.batches = inventory;
                            //console.log("--------------------------------------------", transkind, item.status);
                            if (parseInt(item.salesQty) > availabilty && transkind == "SALESORDER") {
                                item.availablequatity = availabilty;
                                item.adjustedquantity = item.salesQty - availabilty;
                            }
                            else if (parseInt(item.salesQty) > availabilty && transkind == "TRANSFERORDER") {
                                if (item.status == "REQUESTED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.availableQuantity = availabilty;
                                }
                                else if (item.status == "APPROVED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                }
                                else if (item.status == "SHIPPED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                    item.shippedQuantity = item.remainSalesPhysical;
                                }
                                else if (item.status == "RECEIVED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                    item.shippedQuantity = item.remainSalesPhysical;
                                    item.receivedQuantity = item.remainSalesFinancial;
                                }
                                else {
                                    item.requestedQuantity = item.salesQty;
                                }
                            }
                            else {
                                if (transkind == "TRANSFERORDER" && (item.status == "REQUESTED" || item.status == null)) {
                                    item.requestedQuantity = item.salesQty;
                                    item.availableQuantity = availabilty;
                                }
                                else {
                                    item.availablequatity = availabilty;
                                    item.adjustedquantity = 0;
                                }
                            }
                        }
                        else {
                            if (transkind == "TRANSFERORDER") {
                                if (item.status == "REQUESTED" || item.status == null) {
                                    item.requestedQuantity = item.salesQty;
                                    item.availableQuantity = availabilty;
                                    //console.log("--------------------------------------------", availabilty);
                                }
                                else if (item.status == "APPROVED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                }
                                else if (item.status == "SHIPPED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                    item.shippedQuantity = item.remainSalesPhysical;
                                }
                                else if (item.status == "RECEIVED") {
                                    item.requestedQuantity = item.salesQty;
                                    item.approvedQuantity = item.qtyOrdered;
                                    item.shippedQuantity = item.remainSalesPhysical;
                                    item.receivedQuantity = item.remainSalesFinancial;
                                }
                                else {
                                    item.requestedQuantity = item.salesQty;
                                }
                            }
                            else {
                                item.availablequatity = 0;
                                item.adjustedquantity = item.salesQty;
                            }
                        }
                        return [4 /*yield*/, item];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableService.prototype.search = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, newData_1, error_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        switch (reqData.type) {
                            case "quotation":
                                reqData.transkind = "('SALESQUOTATION')";
                                break;
                            case "movement":
                                reqData.transkind = "('INVENTORYMOVEMENT')";
                                break;
                            case "salesorder":
                                reqData.transkind = "('SALESORDER')";
                                break;
                            case "returnorder":
                                reqData.transkind = "('RETURNORDER')";
                                break;
                            case "transferorder":
                                reqData.transkind = "('TRANSFERORDER', 'ORDERSHIPMENT', 'ORDERRECEIVE')";
                                break;
                            case "ordershipment":
                                reqData.transkind = "('ORDERSHIPMENT')";
                                break;
                            case "orderrecieve":
                                reqData.transkind = "('ORDERRECEIVE')";
                                break;
                            case "purchaseorder":
                                reqData.transkind = "('PURCHASEORDER', 'PURCHASERETURN')";
                                break;
                            case "purchaseorderreturn":
                                reqData.transkind = "('PURCHASERETURN')";
                                break;
                            default:
                                reqData.transkind = null;
                        }
                        if (!reqData.transkind) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.salestableDAO.searchorders(reqData, this.sessionInfo.inventlocationid)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.salestableDAO.search(reqData, null)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        data = _a;
                        newData_1 = [];
                        data.forEach(function (item) {
                            if (item.custAccount == _this.sessionInfo.inventlocationid && item.status != "CREATED") {
                                newData_1.push(item);
                            }
                            else if (item.inventLocationId == _this.sessionInfo.inventlocationid) {
                                newData_1.push(item);
                            }
                            else if (item.jazeeraWarehouse == _this.sessionInfo.inventlocationid) {
                                newData_1.push(item);
                            }
                        });
                        return [2 /*return*/, newData_1];
                    case 5:
                        error_2 = _b.sent();
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.paginate = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        switch (reqData.type) {
                            case "quotation":
                                reqData.transkind = "('SALESQUOTATION')";
                                break;
                            case "movement":
                                reqData.transkind = "('INVENTORYMOVEMENT')";
                                break;
                            case "salesorder":
                                reqData.transkind = "('SALESORDER')";
                                break;
                            case "returnorder":
                                reqData.transkind = "('RETURNORDER')";
                                break;
                            case "transferorder":
                                reqData.transkind = "('TRANSFERORDER', 'ORDERSHIPMENT', 'ORDERRECEIVE')";
                                break;
                            case "ordershipment":
                                reqData.transkind = "('ORDERSHIPMENT')";
                                break;
                            case "orderreceive":
                                reqData.transkind = "('ORDERRECEIVE')";
                                break;
                            case "purchaseorder":
                                reqData.transkind = "('PURCHASEORDER')";
                        }
                        return [4 /*yield*/, this.salestableDAO.pagination(reqData, this.sessionInfo.inventlocationid)];
                    case 1:
                        data = _a.sent();
                        // data.map((v: any) => {});
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.save = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, custAccount, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 38, , 39]);
                        if (!(reqData.salesLine && reqData.salesLine.length > 0)) return [3 /*break*/, 36];
                        _a = reqData.transkind;
                        switch (_a) {
                            case "SALESQUOTATION": return [3 /*break*/, 1];
                            case "SALESORDER": return [3 /*break*/, 3];
                            case "RESERVED": return [3 /*break*/, 5];
                            case "RETURNORDER": return [3 /*break*/, 7];
                            case "DESIGNERSERVICERETURN": return [3 /*break*/, 9];
                            case "INVENTORYMOVEMENT": return [3 /*break*/, 11];
                            case "TRANSFERORDER": return [3 /*break*/, 13];
                            case "ORDERSHIPMENT": return [3 /*break*/, 15];
                            case "ORDERRECEIVE": return [3 /*break*/, 19];
                            case "PURCHASEREQUEST": return [3 /*break*/, 23];
                            case "PURCHASEORDER": return [3 /*break*/, 25];
                            case "PURCHASERETURN": return [3 /*break*/, 29];
                            case "DESIGNERSERVICE": return [3 /*break*/, 31];
                        }
                        return [3 /*break*/, 34];
                    case 1: return [4 /*yield*/, this.saveQuotation(reqData)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [4 /*yield*/, this.saveSalesOrder(reqData)];
                    case 4: return [2 /*return*/, _b.sent()];
                    case 5: return [4 /*yield*/, this.saveSalesOrder(reqData)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [4 /*yield*/, this.saveReturnOrder(reqData)];
                    case 8: return [2 /*return*/, _b.sent()];
                    case 9: return [4 /*yield*/, this.saveReturnOrder(reqData)];
                    case 10: return [2 /*return*/, _b.sent()];
                    case 11: return [4 /*yield*/, this.saveInventoryMovementOrder(reqData)];
                    case 12: return [2 /*return*/, _b.sent()];
                    case 13: return [4 /*yield*/, this.saveQuotation(reqData)];
                    case 14: return [2 /*return*/, _b.sent()];
                    case 15:
                        if (!(reqData.interCompanyOriginalSalesId && reqData.interCompanyOriginalSalesId != "")) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.saveOrderShipment(reqData)];
                    case 16: return [2 /*return*/, _b.sent()];
                    case 17: throw { message: "INVOICE_ID_REQUIRED" };
                    case 18: return [3 /*break*/, 35];
                    case 19:
                        if (!(reqData.interCompanyOriginalSalesId && reqData.interCompanyOriginalSalesId != "")) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.saveOrderReceive(reqData)];
                    case 20: return [2 /*return*/, _b.sent()];
                    case 21: throw { message: "INVOICE_ID_REQUIRED" };
                    case 22: return [3 /*break*/, 35];
                    case 23: return [4 /*yield*/, this.saveQuotation(reqData)];
                    case 24: return [2 /*return*/, _b.sent()];
                    case 25: return [4 /*yield*/, this.rawQuery.get_vedor_related_custaccount(reqData.custAccount)];
                    case 26:
                        custAccount = _b.sent();
                        if (!custAccount) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.saveQuotation(reqData)];
                    case 27: return [2 /*return*/, _b.sent()];
                    case 28: throw { message: "NO_VENDOR_FOR_CUSTOMER" };
                    case 29: return [4 /*yield*/, this.saveReturnOrder(reqData)];
                    case 30: return [2 /*return*/, _b.sent()];
                    case 31:
                        if (!reqData.mobileNo) return [3 /*break*/, 33];
                        return [4 /*yield*/, this.saveQuotation(reqData)];
                    case 32: return [2 /*return*/, _b.sent()];
                    case 33: throw { message: "PLEASE_ENTER_MOBILE_NUMBER" };
                    case 34: throw { message: "TRANSKIND_REQUIRED" };
                    case 35: return [3 /*break*/, 37];
                    case 36: throw { message: "INVALID_DATA" };
                    case 37: return [3 /*break*/, 39];
                    case 38:
                        error_4 = _b.sent();
                        throw error_4;
                    case 39: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.validate = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, uid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldItem = null;
                        if (!(!item.salesId || item.salesId == "" || item.salesId == "0")) return [3 /*break*/, 1];
                        item.salesId = null;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.salestableDAO.entity(item.salesId)];
                    case 2:
                        oldItem = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!item.salesId) return [3 /*break*/, 6];
                        if (!false) return [3 /*break*/, 4];
                        return [3 /*break*/, 6];
                    case 4:
                        item.dataareaid = this.sessionInfo.dataareaid;
                        item.deleted = false;
                        item.inventLocationId = this.sessionInfo.inventlocationid;
                        item.createdby = this.sessionInfo.userName;
                        item.createddatetime = moment().format();
                        return [4 /*yield*/, this.getSalesid(item.transkind)];
                    case 5:
                        uid = _a.sent();
                        item.salesId = uid;
                        _a.label = 6;
                    case 6:
                        item.lastModifiedBy = this.sessionInfo.userName;
                        item.lastModifiedDate = moment().format();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    SalesTableService.prototype.getSalesid = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var usergroupconfig, data, _a, hashString, date, prevYear, year, salesId, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 33, , 34]);
                        return [4 /*yield*/, this.usergroupconfigDAO.findOne({
                                groupid: this.sessionInfo.groupid
                            })];
                    case 1:
                        usergroupconfig = _b.sent();
                        data = void 0;
                        _a = type;
                        switch (_a) {
                            case "SALESQUOTATION": return [3 /*break*/, 2];
                            case "SALESORDER": return [3 /*break*/, 4];
                            case "RESERVED": return [3 /*break*/, 6];
                            case "DESIGNERSERVICE": return [3 /*break*/, 8];
                            case "RETURNORDER": return [3 /*break*/, 10];
                            case "DESIGNERSERVICERETURN": return [3 /*break*/, 12];
                            case "INVENTORYMOVEMENT": return [3 /*break*/, 14];
                            case "TRANSFERORDER": return [3 /*break*/, 16];
                            case "ORDERSHIPMENT": return [3 /*break*/, 18];
                            case "ORDERRECEIVE": return [3 /*break*/, 20];
                            case "PURCHASEREQUEST": return [3 /*break*/, 22];
                            case "PURCHASEORDER": return [3 /*break*/, 24];
                            case "PURCHASERETURN": return [3 /*break*/, 26];
                        }
                        return [3 /*break*/, 28];
                    case 2:
                        this.seqNum = usergroupconfig.quotationsequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 3:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 4:
                        this.seqNum = usergroupconfig.salesordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 5:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 6:
                        this.seqNum = usergroupconfig.salesordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 7:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 8:
                        this.seqNum = usergroupconfig.salesordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 9:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 10:
                        this.seqNum = usergroupconfig.returnordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 11:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 12:
                        this.seqNum = usergroupconfig.returnordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 13:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 14:
                        this.seqNum = usergroupconfig.movementsequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 15:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 16:
                        this.seqNum = usergroupconfig.transferordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 17:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 18:
                        this.seqNum = usergroupconfig.ordershipmentsequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 19:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 20:
                        this.seqNum = usergroupconfig.orderreceivesequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 21:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 22:
                        this.seqNum = usergroupconfig.purchaserequestsequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 23:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 24:
                        this.seqNum = usergroupconfig.purchaseordersequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 25:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 26:
                        this.seqNum = usergroupconfig.purchaseReturnSequenceGroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(this.seqNum)];
                    case 27:
                        data = _b.sent();
                        return [3 /*break*/, 29];
                    case 28: throw { message: "TRANSKIND_REQUIRED" };
                    case 29:
                        if (!(data && data.format)) return [3 /*break*/, 31];
                        hashString = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
                        date = new Date(data.lastmodifieddate).toLocaleString();
                        console.log(date);
                        console.log(data);
                        prevYear = new Date(data.lastmodifieddate)
                            .getFullYear()
                            .toString()
                            .substr(2, 2);
                        year = new Date()
                            .getFullYear()
                            .toString()
                            .substr(2, 2);
                        data.nextrec = prevYear == year ? data.nextrec : "000001";
                        salesId = data.format.replace(hashString, data.nextrec) + "-" + year;
                        //console.log(salesId);
                        return [4 /*yield*/, this.rawQuery.updateNumberSequence(this.seqNum, data.nextrec)];
                    case 30:
                        //console.log(salesId);
                        _b.sent();
                        return [2 /*return*/, salesId];
                    case 31: throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
                    case 32: return [3 /*break*/, 34];
                    case 33:
                        error_5 = _b.sent();
                        if (error_5 == {}) {
                            error_5 = { message: "SERVER_SIDE_ERROR" };
                        }
                        throw error_5;
                    case 34: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.convertToSalesOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salesData, canConvert, colors, items, sizes, itemsInStock, itemString, reqData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.salestableDAO.entity(data.salesId)];
                    case 1:
                        salesData = _a.sent();
                        canConvert = true;
                        colors = [];
                        items = [];
                        sizes = [];
                        salesData.salesLine.map(function (v) {
                            items.push("" + v.itemid), colors.push(v.configId), sizes.push(v.inventsizeid);
                        });
                        return [4 /*yield*/, this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items, colors, sizes)];
                    case 2:
                        itemsInStock = _a.sent();
                        itemString = "";
                        salesData.salesLine.map(function (v) {
                            var index = itemsInStock.findIndex(function (value) {
                                return value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
                                    value.configid.toLowerCase() == v.configId.toLowerCase() &&
                                    value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase();
                            });
                            if (index >= 0) {
                                if (parseInt(v.salesQty) > parseInt(itemsInStock[index].qty)) {
                                    canConvert = canConvert == true ? false : false;
                                    itemString += v.itemid + ",";
                                }
                            }
                            else {
                                canConvert = canConvert == true ? false : false;
                                itemString += v.itemid + ",";
                            }
                        });
                        console.log(canConvert);
                        if (!canConvert) return [3 /*break*/, 5];
                        salesData.status = "CONVERTED";
                        return [4 /*yield*/, this.salestableDAO.save(salesData)];
                    case 3:
                        _a.sent();
                        salesData.interCompanyOriginalSalesId = salesData.salesId;
                        delete salesData.salesId;
                        reqData = __assign({}, salesData);
                        reqData.transkind = "SALESORDER";
                        reqData.status = "CREATED";
                        reqData.message = "CONVERTED";
                        reqData.inventLocationId = this.sessionInfo.inventlocationid;
                        reqData.salesLine = salesData.salesLine;
                        return [4 /*yield*/, this.save(reqData)];
                    case 4:
                        data = _a.sent();
                        data.status = "CONVERTED";
                        return [2 /*return*/, data];
                    case 5: throw {
                        message: "CANNOT_CONVERT_TO_SALESORDER"
                    };
                }
            });
        });
    };
    SalesTableService.prototype.convertToPurchaseOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salesData, reqData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.salestableDAO.entity(data.salesId)];
                    case 1:
                        salesData = _b.sent();
                        //console.log(salesData);
                        salesData.status = "CONVERTED";
                        return [4 /*yield*/, this.salestableDAO.save(salesData)];
                    case 2:
                        _b.sent();
                        salesData.interCompanyOriginalSalesId = salesData.salesId;
                        delete salesData.salesId;
                        reqData = __assign({}, salesData);
                        reqData.transkind = "PURCHASEORDER";
                        reqData.message = "CONVERTED";
                        reqData.status = "CREATED";
                        _a = reqData.warehouse;
                        return [4 /*yield*/, this.sessionInfo.inventlocationid];
                    case 3:
                        _a.inventLocationId = _b.sent();
                        delete reqData.warehouse;
                        reqData.salesLine = salesData.salesLine;
                        data.status = "CONVERTED";
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SalesTableService.prototype.convertPurchaseOrderToSalesOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salesData, convertedData, canConvert_1, colors_1, items_1, sizes_1, itemString_1, itemsInStock_1, reqData, custAccount, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.salestableDAO.entity(data.salesId)];
                    case 1:
                        salesData = _a.sent();
                        //console.log(salesData);
                        salesData.status = "CONVERTED";
                        return [4 /*yield*/, this.rawQuery.salesTableInterCompanyOriginalData(data.salesId)];
                    case 2:
                        convertedData = _a.sent();
                        if (!(convertedData.length > 0)) return [3 /*break*/, 3];
                        throw { message: "ALREADY_CONVERTED" };
                    case 3: return [4 /*yield*/, this.salestableDAO.save(salesData)];
                    case 4:
                        _a.sent();
                        canConvert_1 = true;
                        colors_1 = [];
                        items_1 = [];
                        sizes_1 = [];
                        itemString_1 = "";
                        salesData.salesLine.map(function (v) {
                            items_1.push(v.itemid), colors_1.push(v.configId), sizes_1.push(v.inventsizeid);
                        });
                        return [4 /*yield*/, this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items_1, colors_1, sizes_1)];
                    case 5:
                        itemsInStock_1 = _a.sent();
                        salesData.salesLine.map(function (v) {
                            var index = itemsInStock_1.findIndex(function (value) {
                                return value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
                                    value.configid.toLowerCase() == v.configId.toLowerCase() &&
                                    value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase();
                            });
                            if (index >= 0) {
                                if (parseInt(v.salesQty) > parseInt(itemsInStock_1[index].qty)) {
                                    canConvert_1 = canConvert_1 == true ? false : false;
                                    itemString_1 += v.itemid + ",";
                                }
                            }
                            else {
                                canConvert_1 = canConvert_1 == true ? false : false;
                                itemString_1 += v.itemid + ",";
                            }
                        });
                        console.log(canConvert_1);
                        if (!canConvert_1) return [3 /*break*/, 7];
                        salesData.interCompanyOriginalSalesId = salesData.salesId;
                        delete salesData.salesId;
                        reqData = __assign({}, salesData);
                        reqData.transkind = "SALESORDER";
                        reqData.message = "CONVERTED";
                        reqData.status = "CREATED";
                        reqData.inventLocationId = salesData.jazeeraWarehouse;
                        reqData.warehouse.inventLocationId = salesData.jazeeraWarehouse;
                        return [4 /*yield*/, this.rawQuery.get_vedor_related_custaccount(salesData.custAccount)];
                    case 6:
                        custAccount = _a.sent();
                        //console.log(custAccount);
                        if (custAccount) {
                            reqData.custAccount = custAccount;
                            reqData.salesLine = salesData.salesLine;
                            data.status = "CONVERTED";
                            return [2 /*return*/, data];
                        }
                        else {
                            throw { message: "NO_VENDOR_FOR_CUSTOMER" };
                        }
                        return [3 /*break*/, 8];
                    case 7: throw {
                        message: "CANNOT_CONVERT_TO_SALESORDER"
                    };
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_6 = _a.sent();
                        throw { message: error_6 };
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.convertPurchaseReturnToReturnOrder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var purchaseReturnData, purchaseOrderData, salesOrderData, batches, _i, batches_1, batch, reqData, salesLine, _loop_1, _a, salesLine_2, item, custAccount, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.salestableDAO.entity(data.salesId)];
                    case 1:
                        purchaseReturnData = _b.sent();
                        //console.log(purchaseReturnData);
                        purchaseReturnData.status = "CONVERTED";
                        return [4 /*yield*/, this.salestableDAO.save(purchaseReturnData)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.rawQuery.salesTableData(purchaseReturnData.interCompanyOriginalSalesId)];
                    case 3:
                        purchaseOrderData = _b.sent();
                        //console.log(purchaseOrderData);
                        purchaseOrderData = purchaseOrderData.length > 0 ? purchaseOrderData[0] : {};
                        if (!(purchaseOrderData == {})) return [3 /*break*/, 4];
                        throw { message: "TECHNICAL_ISSUE,_PLEASE_CONTACT_YOUR_TECHNICAL_TEAM" };
                    case 4: return [4 /*yield*/, this.rawQuery.salesTableInterCompanyOriginalData(purchaseOrderData.salesid, "SALESORDER")];
                    case 5:
                        salesOrderData = _b.sent();
                        salesOrderData = salesOrderData.length > 0 ? salesOrderData[0] : {};
                        purchaseReturnData.interCompanyOriginalSalesId = salesOrderData.salesid;
                        return [4 /*yield*/, this.inventTransDAO.findAll({
                                invoiceid: purchaseReturnData.salesId
                            })];
                    case 6:
                        batches = _b.sent();
                        for (_i = 0, batches_1 = batches; _i < batches_1.length; _i++) {
                            batch = batches_1[_i];
                            delete batch.id;
                            batch.returnQuantity = Math.abs(batch.qty);
                            batch.transrefid = purchaseReturnData.interCompanyOriginalSalesId;
                        }
                        delete purchaseReturnData.salesId;
                        reqData = __assign({}, purchaseReturnData);
                        reqData.transkind = "RETURNORDER";
                        reqData.message = "CONVERTED";
                        reqData.status = "CREATED";
                        salesLine = purchaseReturnData.salesLine;
                        _loop_1 = function (item) {
                            //console.log(item);
                            var batch = batches.filter(function (v) { return v.itemid == item.itemid && v.inventsizeid == item.inventsizeid && v.configid == item.configId; });
                            //console.log(batch);
                            item.batches = batch;
                        };
                        //console.log(batches);
                        for (_a = 0, salesLine_2 = salesLine; _a < salesLine_2.length; _a++) {
                            item = salesLine_2[_a];
                            _loop_1(item);
                        }
                        reqData.inventLocationId = purchaseReturnData.jazeeraWarehouse;
                        reqData.warehouse.inventLocationId = purchaseReturnData.jazeeraWarehouse;
                        return [4 /*yield*/, this.rawQuery.get_vedor_related_custaccount(purchaseReturnData.custAccount)];
                    case 7:
                        custAccount = _b.sent();
                        //console.log(custAccount);
                        reqData.custAccount = custAccount;
                        reqData.salesLine = salesLine;
                        data.status = "CONVERTED";
                        return [2 /*return*/, data];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_7 = _b.sent();
                        throw { message: error_7 };
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.updateinventtransstatus = function (id, status) {
        if (status === void 0) { status = null; }
        return __awaiter(this, void 0, void 0, function () {
            var salesData, batches, _i, batches_2, item, returnData, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.salestableDAO.entity(id)];
                    case 1:
                        salesData = _a.sent();
                        //console.log(salesData);
                        salesData.status = !status ? "UNRESERVED" : status;
                        this.salestableDAO.save(salesData);
                        return [4 /*yield*/, this.inventTransDAO.findAll({ invoiceid: id })];
                    case 2:
                        batches = _a.sent();
                        _i = 0, batches_2 = batches;
                        _a.label = 3;
                    case 3:
                        if (!(_i < batches_2.length)) return [3 /*break*/, 6];
                        item = batches_2[_i];
                        item.reserveStatus = salesData.status;
                        item.transactionClosed = false;
                        item.dateinvent = new Date(App_1.App.dateNow());
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(item)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        returnData = {
                            id: id,
                            message: "UNRESERVED",
                            status: salesData.status
                        };
                        //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 7:
                        error_8 = _a.sent();
                        throw error_8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveQuotation = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var salesLine, cond, salesTable, lineData, _i, salesLine_3, item, salesline, designerServiceData, returnData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        return [4 /*yield*/, this.validate(reqData)];
                    case 1:
                        cond = _a.sent();
                        if (!(cond == true)) return [3 /*break*/, 12];
                        reqData.payment = reqData.transkind == "DESIGNERSERVICE" ? 'CASH' : false;
                        reqData.status = reqData.status ? reqData.status : "CREATED";
                        reqData.salesType = reqData.transkind == "TRANSFERORDER" ? 1 : null;
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 2:
                        salesTable = _a.sent();
                        return [4 /*yield*/, this.salesLineDAO.findAll({
                                salesId: reqData.salesId
                            })];
                    case 3:
                        lineData = _a.sent();
                        if (!lineData) return [3 /*break*/, 5];
                        // for (let v of lineData) {
                        //   let appliedDiscounts: any = await this.appliedDiscountsDAO.findAll({ saleslineId: v.id });
                        //   await this.appliedDiscountsDAO.delete(appliedDiscounts);
                        // }
                        return [4 /*yield*/, this.salesLineDAO.delete(lineData)];
                    case 4:
                        // for (let v of lineData) {
                        //   let appliedDiscounts: any = await this.appliedDiscountsDAO.findAll({ saleslineId: v.id });
                        //   await this.appliedDiscountsDAO.delete(appliedDiscounts);
                        // }
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i = 0, salesLine_3 = salesLine;
                        _a.label = 6;
                    case 6:
                        if (!(_i < salesLine_3.length)) return [3 /*break*/, 9];
                        item = salesLine_3[_i];
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = new Date(App_1.App.dateNow());
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        return [4 /*yield*/, this.salesLineDAO.save(item)];
                    case 7:
                        salesline = _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        if (!(reqData.status == "PAID")) return [3 /*break*/, 11];
                        if (!(reqData.transkind == "DESIGNERSERVICE")) return [3 /*break*/, 11];
                        designerServiceData = {
                            custphone: reqData.mobileNo,
                            amount: reqData.netAmount,
                            invoiceid: reqData.salesId,
                            dataareaid: this.sessionInfo.dataareaid,
                            recordtype: 0,
                            settle: 0,
                            selectedforsettle: 0,
                            approvalstatus: reqData.approvalstatus,
                            createdby: this.sessionInfo.userName,
                            createddatetime: new Date(),
                            lastmodifiedby: this.sessionInfo.userName,
                            lastmodifieddate: new Date(),
                            customer: {
                                accountnum: reqData.custAccount
                            }
                        };
                        return [4 /*yield*/, this.designerServiceDAO.save(designerServiceData)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveSalesOrder = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var customer, salesLine, canConvert_2, colors_2, items_2, sizes_2, itemString_2, itemsInStock_2, cond, salesTable, lineData, batches, _i, batches_3, batch, _a, salesLine_4, item, _b, _c, batch, availability, fiofoBatches, fiofoBatches, _d, batches_4, batch, salesline, condData, voucherData, _e, batches_5, v, customerDetails, _f, message, sms, visitorData, userName, paymTerDays, days, now, dueDate, overDue, overDueSaved, designerServiceData, redeemData, error_9, returnData;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        if (!(reqData.transkind == "PAID")) return [3 /*break*/, 2];
                        reqData.invoiceDate = new Date();
                        canConvert_2 = true;
                        colors_2 = [];
                        items_2 = [];
                        sizes_2 = [];
                        itemString_2 = "";
                        salesLine.map(function (v) {
                            items_2.push(v.itemid), colors_2.push(v.configId), sizes_2.push(v.inventsizeid);
                        });
                        return [4 /*yield*/, this.rawQuery.checkItems(this.sessionInfo.inventlocationid, items_2, colors_2, sizes_2)];
                    case 1:
                        itemsInStock_2 = _g.sent();
                        salesLine.map(function (v) {
                            var index = itemsInStock_2.findIndex(function (value) {
                                return value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
                                    value.configid.toLowerCase() == v.configId.toLowerCase() &&
                                    value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase();
                            });
                            if (index >= 0) {
                                if (parseInt(v.salesQty) > parseInt(itemsInStock_2[index].qty)) {
                                    canConvert_2 = canConvert_2 == true ? false : false;
                                    itemString_2 += v.itemid + ",";
                                }
                            }
                            else {
                                canConvert_2 = canConvert_2 == true ? false : false;
                                itemString_2 += v.itemid + ",";
                            }
                        });
                        if (!canConvert_2) {
                            throw { message: "CANNOT_CONVERT_TO_SALESORDER" };
                        }
                        _g.label = 2;
                    case 2: return [4 /*yield*/, this.validate(reqData)];
                    case 3:
                        cond = _g.sent();
                        if (!(cond == true)) return [3 /*break*/, 56];
                        !reqData.warehouse ? (reqData.warehouse = {}) : (reqData.warehouse = reqData.warehouse);
                        reqData.warehouse.inventLocationId = this.sessionInfo.inventlocationid;
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 4:
                        salesTable = _g.sent();
                        if (reqData.status == "CREATED" || reqData.status == "CONVERTED") {
                            this.rawQuery.salesTableInventlocation(reqData.inventLocationId, reqData.salesId);
                        }
                        return [4 /*yield*/, this.salesLineDAO.findAll({
                                salesId: reqData.salesId
                            })];
                    case 5:
                        lineData = _g.sent();
                        if (!lineData) return [3 /*break*/, 7];
                        // for (let v of lineData) {
                        //   let appliedDiscounts: any = await this.appliedDiscountsDAO.findAll({ salesLine: { id: v.id } });
                        //   await this.appliedDiscountsDAO.delete(appliedDiscounts);
                        // }
                        return [4 /*yield*/, this.salesLineDAO.delete(lineData)];
                    case 6:
                        // for (let v of lineData) {
                        //   let appliedDiscounts: any = await this.appliedDiscountsDAO.findAll({ salesLine: { id: v.id } });
                        //   await this.appliedDiscountsDAO.delete(appliedDiscounts);
                        // }
                        _g.sent();
                        _g.label = 7;
                    case 7: return [4 /*yield*/, this.inventTransDAO.findAll({
                            invoiceid: reqData.salesId
                        })];
                    case 8:
                        batches = _g.sent();
                        _i = 0, batches_3 = batches;
                        _g.label = 9;
                    case 9:
                        if (!(_i < batches_3.length)) return [3 /*break*/, 12];
                        batch = batches_3[_i];
                        if (!(batch.reserveStatus == "RESERVED")) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.updateInventoryService.updateUnReserveQty(batch)];
                    case 10:
                        _g.sent();
                        _g.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12: return [4 /*yield*/, this.inventTransDAO.delete(batches)];
                    case 13:
                        _g.sent();
                        _a = 0, salesLine_4 = salesLine;
                        _g.label = 14;
                    case 14:
                        if (!(_a < salesLine_4.length)) return [3 /*break*/, 28];
                        item = salesLine_4[_a];
                        item.id = uuid();
                        // let color: any = await this.colorsDAO.entity(item.colors.id);
                        // let configId = item.configId;
                        batches = [];
                        item.batch = [];
                        if (!(item.salesQty > 0)) return [3 /*break*/, 23];
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = new Date(App_1.App.dateNow());
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        item.appliedDiscounts.map(function (v) {
                            delete v.id;
                        });
                        if (!(item.batches && item.batches.length > 0)) return [3 /*break*/, 21];
                        item.batches = item.batches.filter(function (v) { return v.quantity > 0; });
                        _b = 0, _c = item.batches;
                        _g.label = 15;
                    case 15:
                        if (!(_b < _c.length)) return [3 /*break*/, 20];
                        batch = _c[_b];
                        return [4 /*yield*/, this.rawQuery.getbatchavailability({
                                inventlocationid: this.sessionInfo.inventlocationid,
                                itemid: item.itemid,
                                configid: item.configId,
                                inventsizeid: item.inventsizeid,
                                batchno: batch.batchNo
                            })];
                    case 16:
                        availability = _g.sent();
                        if (!(availability <= 0 || availability < Math.abs(batch.qty))) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.dofifo(item, reqData.status)];
                    case 17:
                        fiofoBatches = _g.sent();
                        batches = batches.concat(fiofoBatches);
                        return [3 /*break*/, 19];
                    case 18:
                        batch.itemid = item.itemid;
                        batch.transrefid = item.salesId;
                        batch.invoiceid = item.salesId;
                        batch.batchno = batch.batchNo;
                        batch.configid = item.configId;
                        batch.inventsizeid = item.inventsizeid;
                        batch.inventlocationid = this.sessionInfo.inventlocationid;
                        batch.dataareaid = this.sessionInfo.dataareaid;
                        batch.qty = -batch.quantity;
                        batch.reserveStatus = reqData.status;
                        batch.dataareaid = this.sessionInfo.dataareaid;
                        batch.transactionClosed = reqData.status == "PAID" || reqData.status == "RESERVED" ? true : false;
                        batch.dateinvent = new Date(App_1.App.dateNow());
                        batches.push(batch);
                        _g.label = 19;
                    case 19:
                        _b++;
                        return [3 /*break*/, 15];
                    case 20: return [3 /*break*/, 23];
                    case 21: return [4 /*yield*/, this.dofifo(item, reqData.status)];
                    case 22:
                        fiofoBatches = _g.sent();
                        batches = batches.concat(fiofoBatches);
                        _g.label = 23;
                    case 23:
                        _d = 0, batches_4 = batches;
                        _g.label = 24;
                    case 24:
                        if (!(_d < batches_4.length)) return [3 /*break*/, 27];
                        batch = batches_4[_d];
                        item.batch.push({
                            batchNo: batch.batchno,
                            quantity: batch.quantity
                        });
                        batch.salesLineId = item.id;
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batch, true)];
                    case 25:
                        _g.sent();
                        _g.label = 26;
                    case 26:
                        _d++;
                        return [3 /*break*/, 24];
                    case 27:
                        _a++;
                        return [3 /*break*/, 14];
                    case 28: return [4 /*yield*/, this.salesLineDAO.save(salesLine)];
                    case 29:
                        salesline = _g.sent();
                        return [4 /*yield*/, this.inventTransDAO.findAll({
                                invoiceid: reqData.salesId
                            })];
                    case 30:
                        batches = _g.sent();
                        if (!(reqData.status == "PAID")) return [3 /*break*/, 55];
                        return [4 /*yield*/, this.rawQuery.salesTableData(reqData.interCompanyOriginalSalesId)];
                    case 31:
                        condData = _g.sent();
                        condData = condData.length >= 0 ? condData[0] : {};
                        if (!reqData.voucherDiscChecked) return [3 /*break*/, 33];
                        voucherData = {
                            salesId: reqData.salesId,
                            voucherNum: reqData.voucherNum,
                            custAccount: reqData.custAccount
                        };
                        return [4 /*yield*/, this.rawQuery.updateVoucherDiscounts(voucherData)];
                    case 32:
                        _g.sent();
                        _g.label = 33;
                    case 33:
                        condData = condData ? condData : {};
                        if (!(condData.transkind == "PURCHASEORDER")) return [3 /*break*/, 39];
                        return [4 /*yield*/, this.rawQuery.updateSalesTableWorkFlowStatus(reqData.interCompanyOriginalSalesId, "PAID")];
                    case 34:
                        _g.sent();
                        return [4 /*yield*/, this.inventTransDAO.findAll({
                                invoiceid: reqData.salesId
                            })];
                    case 35:
                        batches = _g.sent();
                        _e = 0, batches_5 = batches;
                        _g.label = 36;
                    case 36:
                        if (!(_e < batches_5.length)) return [3 /*break*/, 39];
                        v = batches_5[_e];
                        delete v.id;
                        v.invoiceid = reqData.interCompanyOriginalSalesId;
                        v.transrefid = reqData.salesId;
                        v.qty = Math.abs(v.qty);
                        v.dataareaid = this.sessionInfo.dataareaid;
                        v.inventlocationid = condData.inventlocationid;
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(v, true)];
                    case 37:
                        _g.sent();
                        _g.label = 38;
                    case 38:
                        _e++;
                        return [3 /*break*/, 36];
                    case 39:
                        if (!customer) return [3 /*break*/, 40];
                        _f = customer;
                        return [3 /*break*/, 42];
                    case 40: return [4 /*yield*/, this.rawQuery.getCustomer(reqData.custAccount)];
                    case 41:
                        _f = _g.sent();
                        _g.label = 42;
                    case 42:
                        customerDetails = _f;
                        if (!reqData.mobileNo) return [3 /*break*/, 44];
                        message = "  \u0631\u0636\u0627\u0624\u0643\u0645 \u0647\u0648 \u0647\u062F\u0641\u0646\u0627 \u062F\u0647\u0627\u0646\u0627\u062A \u0627\u0644\u062C\u0632\u064A\u0631\u0629 \u062C\u0648\u062F\u0629 \u0648\u062C\u0645\u0627\u0644 \u0642\u064A\u0645\u0629 \u0645\u0634\u062A\u0631\u064A\u0627\u062A\u0643\u0645 \u0647\u064A " + reqData.netAmount + " ";
                        sms = new Sms_1.Sms();
                        return [4 /*yield*/, sms.sendMessage("966", reqData.mobileNo, message)];
                    case 43:
                        _g.sent();
                        _g.label = 44;
                    case 44:
                        if (!customerDetails.walkincustomer) return [3 /*break*/, 46];
                        visitorData = new VisitCustomer_1.VisitCustomer();
                        this.visitCustomerService.sessionInfo = this.sessionInfo;
                        visitorData.visitorName = reqData.salesName;
                        visitorData.purchased = "Yes";
                        visitorData.visitorMobileNumber = customerDetails.phone;
                        visitorData.visitorType =
                            Props_1.Props.RCUSTTYPE[customerDetails.rcusttype] && Props_1.Props.RCUSTTYPE[customerDetails.rcusttype][1]
                                ? Props_1.Props.RCUSTTYPE[customerDetails.rcusttype][1]
                                : "Individual";
                        return [4 /*yield*/, this.visitCustomerService.save(visitorData)];
                    case 45:
                        _g.sent();
                        _g.label = 46;
                    case 46:
                        userName = this.sessionInfo.userName;
                        if (!(reqData.paymtermid != "CASH" && !reqData.isCash)) return [3 /*break*/, 49];
                        return [4 /*yield*/, this.rawQuery.getPaymTermDays(reqData.paymtermid)];
                    case 47:
                        paymTerDays = _g.sent();
                        days = paymTerDays[0].numofdays;
                        now = new Date();
                        dueDate = new Date(App_1.App.dateNow());
                        dueDate.setDate(dueDate.getDate() + days);
                        overDue = new Overdue_1.Overdue();
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
                        this.overDueDAO = new OverDueDAO_1.OverDueDAO();
                        return [4 /*yield*/, this.overDueDAO.createOverDue(overDue)];
                    case 48:
                        overDueSaved = _g.sent();
                        _g.label = 49;
                    case 49:
                        if (!(reqData.designServiceRedeemAmount > 0)) return [3 /*break*/, 51];
                        designerServiceData = {
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
                            createddatetime: new Date(),
                            lastmodifiedby: this.sessionInfo.userName,
                            lastmodifieddate: new Date(),
                            customer: {
                                accountnum: reqData.designerServiceCustAccount
                            }
                        };
                        return [4 /*yield*/, this.designerServiceDAO.save(designerServiceData)];
                    case 50:
                        _g.sent();
                        _g.label = 51;
                    case 51:
                        redeemData = {
                            TransactionId: reqData.salesId,
                            MobileNo: reqData.mobileNo,
                            InvoiceNo: reqData.salesId,
                            InvoiceAmount: reqData.netAmount,
                            RedeemPoints: reqData.redeempts,
                            SyncStatus: 0,
                            InventLocationId: this.sessionInfo.inventlocationid,
                            LoyaltyStatus: 0
                        };
                        _g.label = 52;
                    case 52:
                        _g.trys.push([52, 54, , 55]);
                        return [4 /*yield*/, this.redeemService.Redeem(redeemData)];
                    case 53:
                        _g.sent();
                        return [3 /*break*/, 55];
                    case 54:
                        error_9 = _g.sent();
                        console.error(error_9);
                        return [3 /*break*/, 55];
                    case 55:
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        return [2 /*return*/, returnData];
                    case 56: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveReturnOrder = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var salesLine, cond, salesTable, lineData, _i, salesLine_5, item, _a, _b, batches, PrevReturnedData, designerServiceData, returnData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        return [4 /*yield*/, this.validate(reqData)];
                    case 1:
                        cond = _c.sent();
                        if (!(cond == true)) return [3 /*break*/, 18];
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 2:
                        salesTable = _c.sent();
                        return [4 /*yield*/, this.salesLineDAO.findAll({
                                salesId: reqData.salesId
                            })];
                    case 3:
                        lineData = _c.sent();
                        if (!lineData) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.salesLineDAO.delete(lineData)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i = 0, salesLine_5 = salesLine;
                        _c.label = 6;
                    case 6:
                        if (!(_i < salesLine_5.length)) return [3 /*break*/, 13];
                        item = salesLine_5[_i];
                        item.batch = [];
                        if (!(item.salesQty > 0)) return [3 /*break*/, 10];
                        delete item.id;
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = new Date(App_1.App.dateNow());
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        item.lastModifiedDate = new Date(App_1.App.dateNow());
                        if (!(item.batches && item.batches.length > 0)) return [3 /*break*/, 10];
                        _a = 0, _b = item.batches;
                        _c.label = 7;
                    case 7:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        batches = _b[_a];
                        if (!(batches.returnQuantity > 0)) return [3 /*break*/, 9];
                        batches.itemid = item.itemid;
                        batches.transrefid = reqData.interCompanyOriginalSalesId;
                        batches.invoiceid = item.salesId;
                        batches.qty = reqData.transkind == "PURCHASERETURN" ? -batches.returnQuantity : batches.returnQuantity;
                        batches.batchno = batches.batchno;
                        batches.configid = item.configId;
                        batches.inventsizeid = item.inventsizeid;
                        batches.dataareaid = this.sessionInfo.dataareaid;
                        batches.inventlocationid = this.sessionInfo.inventlocationid;
                        batches.reserveStatus = reqData.transkind;
                        batches.transactionClosed = false;
                        batches.dateinvent = new Date();
                        batches.salesLineId = item.id;
                        // await this.inventTransDAO.save(batches);
                        item.batch.push({
                            batchNo: batches.batchno,
                            quantity: batches.returnQuantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.salesLineDAO.save(item)];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 6];
                    case 13:
                        if (!(reqData.transkind == "DESIGNERSERVICERETURN")) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.salestableDAO.find({
                                interCompanyOriginalSalesId: reqData.interCompanyOriginalSalesId
                            })];
                    case 14:
                        PrevReturnedData = _c.sent();
                        if (PrevReturnedData.length > 0) {
                            throw { message: "ALREADY_RETURNED" };
                        }
                        return [4 /*yield*/, this.designerServiceDAO.findOne({
                                invoiceid: reqData.interCompanyOriginalSalesId
                            })];
                    case 15:
                        designerServiceData = _c.sent();
                        delete designerServiceData.serviceid;
                        designerServiceData.amount = -designerServiceData.amount;
                        designerServiceData.salesorderid = reqData.salesId;
                        return [4 /*yield*/, this.designerServiceDAO.save(designerServiceData)];
                    case 16:
                        _c.sent();
                        _c.label = 17;
                    case 17:
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveOrderShipment = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var salesLine, transactionClosed, salesData, checkStatus, cond, salesTable, _i, salesLine_6, item, _a, _b, batches, salesline, returnData;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        reqData.interCompanyOriginalSalesId;
                        transactionClosed = false;
                        checkStatus = false;
                        return [4 /*yield*/, this.salestableDAO.findOne({
                                salesId: reqData.interCompanyOriginalSalesId
                            })];
                    case 1:
                        salesData = _c.sent();
                        if (!salesData) return [3 /*break*/, 3];
                        salesData.status = "SHIPPED";
                        salesData.salesType = 2;
                        return [4 /*yield*/, this.salestableDAO.save(salesData)];
                    case 2:
                        _c.sent();
                        reqData.salesType = 2;
                        reqData.isMovementIn = false;
                        reqData.status = "SHIPPED";
                        transactionClosed = true;
                        _c.label = 3;
                    case 3: return [4 /*yield*/, this.validate(reqData)];
                    case 4:
                        cond = _c.sent();
                        if (!(cond == true)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 5:
                        salesTable = _c.sent();
                        salesLine = salesLine.filter(function (v) { return v.status == "SHIPPED"; });
                        _i = 0, salesLine_6 = salesLine;
                        _c.label = 6;
                    case 6:
                        if (!(_i < salesLine_6.length)) return [3 /*break*/, 11];
                        item = salesLine_6[_i];
                        delete item.id;
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = moment().format();
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        item.batch = [];
                        if (!(item.batches && item.batches.length > 0)) return [3 /*break*/, 10];
                        _a = 0, _b = item.batches;
                        _c.label = 7;
                    case 7:
                        if (!(_a < _b.length)) return [3 /*break*/, 10];
                        batches = _b[_a];
                        if (!(batches.quantity > 0)) return [3 /*break*/, 9];
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
                        batches.transactionClosed = true;
                        batches.custvendac = reqData.custAccount;
                        batches.dateinvent = moment().format();
                        batches.salesLineId = item.id;
                        item.batch.push({
                            batchNo: batches.batchNo,
                            quantity: batches.quantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches, true)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10:
                        _i++;
                        return [3 /*break*/, 6];
                    case 11: return [4 /*yield*/, this.salesLineDAO.save(salesLine)];
                    case 12:
                        salesline = _c.sent();
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        // //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveOrderReceive = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var salesLine, transactionClosed, salesData, checkStatus, transferData, cond, salesTable, batches_6, _i, salesLine_7, item, _a, _b, batches_7, _c, _d, batches_8, salesline, returnData;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        reqData.interCompanyOriginalSalesId;
                        transactionClosed = false;
                        checkStatus = false;
                        return [4 /*yield*/, this.salestableDAO.findOne({
                                salesId: reqData.interCompanyOriginalSalesId
                            })];
                    case 1:
                        salesData = _e.sent();
                        if (!salesData) return [3 /*break*/, 5];
                        // salesData.status = "RECEIVED";
                        salesData.salesType = 3;
                        return [4 /*yield*/, this.salestableDAO.save(salesData)];
                    case 2:
                        _e.sent();
                        reqData.salesType = 3;
                        reqData.isMovementIn = true;
                        reqData.status = "RECEIVED";
                        transactionClosed = true;
                        return [4 /*yield*/, this.salestableDAO.findOne({
                                salesId: salesData.interCompanyOriginalSalesId
                            })];
                    case 3:
                        transferData = _e.sent();
                        if (!transferData) return [3 /*break*/, 5];
                        transferData.status = "RECEIVED";
                        return [4 /*yield*/, this.salestableDAO.save(transferData)];
                    case 4:
                        _e.sent();
                        _e.label = 5;
                    case 5: return [4 /*yield*/, this.validate(reqData)];
                    case 6:
                        cond = _e.sent();
                        if (!(cond == true)) return [3 /*break*/, 21];
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 7:
                        salesTable = _e.sent();
                        salesLine = salesLine.filter(function (v) { return v.status == "RECEIVED"; });
                        return [4 /*yield*/, this.inventTransDAO.findAll({
                                invoiceid: reqData.interCompanyOriginalSalesId
                            })];
                    case 8:
                        batches_6 = _e.sent();
                        if (batches_6.length > 0) {
                            salesLine.map(function (v) {
                                v.batches = batches_6.filter(function (b) { return b.configid == v.configId && b.itemid == v.itemid && b.inventsizeid == v.inventsizeid; });
                            });
                        }
                        _i = 0, salesLine_7 = salesLine;
                        _e.label = 9;
                    case 9:
                        if (!(_i < salesLine_7.length)) return [3 /*break*/, 19];
                        item = salesLine_7[_i];
                        delete item.id;
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = moment().format();
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        item.batch = [];
                        if (!(batches_6 && batches_6.length > 0)) return [3 /*break*/, 14];
                        _a = 0, _b = item.batches;
                        _e.label = 10;
                    case 10:
                        if (!(_a < _b.length)) return [3 /*break*/, 13];
                        batches_7 = _b[_a];
                        batches_7.itemid = item.itemid;
                        batches_7.transrefid = reqData.interCompanyOriginalSalesId;
                        batches_7.invoiceid = reqData.salesId;
                        batches_7.qty = Math.abs(batches_7.qty);
                        batches_7.batchno = batches_7.batchno;
                        batches_7.configid = item.configId;
                        batches_7.inventsizeid = item.inventsizeid;
                        batches_7.inventlocationid = reqData.inventLocationId;
                        batches_7.dataareaid = reqData.dataareaid;
                        batches_7.custvendac = reqData.custAccount;
                        batches_7.reserveStatus = reqData.status;
                        batches_7.transactionClosed = true;
                        batches_7.dateinvent = moment().format();
                        batches_7.salesLineId = item.id;
                        item.batch.push({
                            batchNo: batches_7.batchNo,
                            quantity: batches_7.quantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches_7, true)];
                    case 11:
                        _e.sent();
                        _e.label = 12;
                    case 12:
                        _a++;
                        return [3 /*break*/, 10];
                    case 13: return [3 /*break*/, 18];
                    case 14:
                        if (!(item.batches && item.batches.length > 0)) return [3 /*break*/, 18];
                        _c = 0, _d = item.batches;
                        _e.label = 15;
                    case 15:
                        if (!(_c < _d.length)) return [3 /*break*/, 18];
                        batches_8 = _d[_c];
                        if (!(batches_8.quantity > 0)) return [3 /*break*/, 17];
                        batches_8.itemid = item.itemid;
                        batches_8.transrefid = reqData.interCompanyOriginalSalesId
                            ? reqData.interCompanyOriginalSalesId
                            : reqData.salesId;
                        batches_8.invoiceid = reqData.salesId;
                        batches_8.qty = parseInt(batches_8.quantity);
                        batches_8.batchno = batches_8.batchNo;
                        batches_8.configid = item.configId;
                        batches_8.inventsizeid = item.inventsizeid;
                        batches_8.inventlocationid = reqData.inventLocationId;
                        batches_8.dataareaid = reqData.dataareaid;
                        batches_8.custvendac = reqData.custAccount;
                        batches_8.reserveStatus = reqData.status;
                        batches_8.transactionClosed = true;
                        batches_8.dateinvent = moment().format();
                        batches_8.salesLineId = item.id;
                        item.batch.push({
                            batchNo: batches_8.batchNo,
                            quantity: batches_8.quantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches_8, true)];
                    case 16:
                        _e.sent();
                        _e.label = 17;
                    case 17:
                        _c++;
                        return [3 /*break*/, 15];
                    case 18:
                        _i++;
                        return [3 /*break*/, 9];
                    case 19: return [4 /*yield*/, this.salesLineDAO.save(salesLine)];
                    case 20:
                        salesline = _e.sent();
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        // //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.saveInventoryMovementOrder = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var salesLine, transactionClosed, salesData, checkStatus, cond, salesTable, lineData, batches, _i, batches_9, batch, _a, salesLine_8, item, _b, _c, batches_11, batches_12, _d, batches_10, batch, returnData;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        salesLine = reqData.salesLine;
                        delete reqData.salesLine;
                        reqData.interCompanyOriginalSalesId;
                        transactionClosed = false;
                        checkStatus = false;
                        switch (reqData.transkind) {
                            case "PURCHASEORDER":
                                reqData.isMovementIn = true;
                                reqData.status = reqData.status ? reqData.status : "PURCHASEORDER";
                                transactionClosed = true;
                                break;
                            default:
                                reqData.interCompanyOriginalSalesId = reqData.salesId;
                        }
                        return [4 /*yield*/, this.validate(reqData)];
                    case 1:
                        cond = _e.sent();
                        if (!(cond == true)) return [3 /*break*/, 28];
                        return [4 /*yield*/, this.salestableDAO.save(reqData)];
                    case 2:
                        salesTable = _e.sent();
                        if (!(reqData.status == "CONVERTED")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rawQuery.salesTableInventlocation(reqData.inventLocationId, reqData.salesId)];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4: return [4 /*yield*/, this.salesLineDAO.findAll({
                            salesId: reqData.salesId
                        })];
                    case 5:
                        lineData = _e.sent();
                        if (!lineData) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.salesLineDAO.delete(lineData)];
                    case 6:
                        _e.sent();
                        _e.label = 7;
                    case 7: return [4 /*yield*/, this.inventTransDAO.findAll({
                            invoiceid: reqData.salesId
                        })];
                    case 8:
                        batches = _e.sent();
                        _i = 0, batches_9 = batches;
                        _e.label = 9;
                    case 9:
                        if (!(_i < batches_9.length)) return [3 /*break*/, 12];
                        batch = batches_9[_i];
                        if (!(batch.reserveStatus == "RESERVED")) return [3 /*break*/, 11];
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateUnReserveQty(batch)];
                    case 10:
                        _e.sent();
                        _e.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 9];
                    case 12: return [4 /*yield*/, this.inventTransDAO.delete(batches)];
                    case 13:
                        _e.sent();
                        _a = 0, salesLine_8 = salesLine;
                        _e.label = 14;
                    case 14:
                        if (!(_a < salesLine_8.length)) return [3 /*break*/, 27];
                        item = salesLine_8[_a];
                        delete item.id;
                        item.id = uuid();
                        item.salesId = reqData.salesId;
                        item.createddatetime = new Date();
                        item.createdBy = this.sessionInfo.userName;
                        item.numberSequenceGroupId = this.seqNum;
                        item.batch = [];
                        if (!(item.batches && item.batches.length > 0)) return [3 /*break*/, 19];
                        _b = 0, _c = item.batches;
                        _e.label = 15;
                    case 15:
                        if (!(_b < _c.length)) return [3 /*break*/, 18];
                        batches_11 = _c[_b];
                        if (!(batches_11.quantity > 0)) return [3 /*break*/, 17];
                        batches_11.itemid = item.itemid;
                        batches_11.transrefid = reqData.interCompanyOriginalSalesId
                            ? reqData.interCompanyOriginalSalesId
                            : reqData.salesId;
                        batches_11.invoiceid = reqData.salesId;
                        batches_11.qty = reqData.isMovementIn ? parseInt(batches_11.quantity) : -parseInt(batches_11.quantity);
                        batches_11.batchno = batches_11.batchNo;
                        batches_11.configid = item.configId;
                        batches_11.inventsizeid = item.inventsizeid;
                        batches_11.inventlocationid = this.sessionInfo.inventlocationid;
                        batches_11.dataareaid = this.sessionInfo.dataareaid;
                        batches_11.reserveStatus = reqData.transkind;
                        batches_11.transactionClosed = transactionClosed;
                        batches_11.dateinvent = new Date();
                        batches_11.salesLineId = item.id;
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
                            batchNo: batches_11.batchNo,
                            quantity: batches_11.quantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches_11)];
                    case 16:
                        _e.sent();
                        _e.label = 17;
                    case 17:
                        _b++;
                        return [3 /*break*/, 15];
                    case 18: return [3 /*break*/, 24];
                    case 19: return [4 /*yield*/, this.inventTransDAO.findAll({
                            invoiceid: reqData.interCompanyOriginalSalesId
                        })];
                    case 20:
                        batches_12 = _e.sent();
                        _d = 0, batches_10 = batches_12;
                        _e.label = 21;
                    case 21:
                        if (!(_d < batches_10.length)) return [3 /*break*/, 24];
                        batch = batches_10[_d];
                        delete batch.id;
                        batch.transrefid = reqData.interCompanyOriginalSalesId;
                        batch.invoiceid = reqData.salesId;
                        batch.reserveStatus = reqData.transkind;
                        batch.transactionClosed = transactionClosed;
                        batch.inventlocationid = this.sessionInfo.inventlocationid;
                        batch.qty = reqData.isMovementIn ? Math.abs(batch.qty) : -Math.abs(batch.qty);
                        batch.dateinvent = new Date();
                        // this.inventTransDAO.save(batch);
                        item.batch.push({
                            batchNo: batch.batchNo,
                            quantity: batch.quantity
                        });
                        this.updateInventoryService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batch)];
                    case 22:
                        _e.sent();
                        _e.label = 23;
                    case 23:
                        _d++;
                        return [3 /*break*/, 21];
                    case 24: return [4 /*yield*/, this.salesLineDAO.save(item)];
                    case 25:
                        _e.sent();
                        _e.label = 26;
                    case 26:
                        _a++;
                        return [3 /*break*/, 14];
                    case 27:
                        returnData = {
                            id: salesTable.salesId,
                            message: "SAVED_SUCCESSFULLY",
                            status: reqData.status
                        };
                        // //console.log(returnData);
                        return [2 /*return*/, returnData];
                    case 28: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.sendForTransferOrderRequest = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var transferorder, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.salestableDAO.entity(reqData.salesId)];
                    case 1:
                        transferorder = _a.sent();
                        transferorder.status = reqData.status ? reqData.status : "REQUESTED";
                        return [4 /*yield*/, this.salestableDAO.save(transferorder)];
                    case 2:
                        transferorder = _a.sent();
                        return [2 /*return*/, {
                                id: transferorder.salesId,
                                message: "REQUESTED",
                                status: transferorder.status
                            }];
                    case 3:
                        error_10 = _a.sent();
                        throw error_10;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.rejectTransferOrder = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var transferorder, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.salestableDAO.entity(reqData.salesId)];
                    case 1:
                        transferorder = _a.sent();
                        transferorder.status = "REJECTED";
                        return [4 /*yield*/, this.salestableDAO.save(transferorder)];
                    case 2:
                        transferorder = _a.sent();
                        return [2 /*return*/, {
                                id: transferorder.salesId,
                                message: "REJECTED",
                                status: transferorder.status
                            }];
                    case 3:
                        error_11 = _a.sent();
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.dofifo = function (item, status) {
        return __awaiter(this, void 0, void 0, function () {
            var batches, inventory, val_1, _i, inventory_1, batch, _a, inventory_2, batch;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        batches = [];
                        return [4 /*yield*/, this.rawQuery.inventoryOnHand({
                                inventlocationid: this.sessionInfo.inventlocationid,
                                itemId: item.itemid,
                                configid: item.configId,
                                inventsizeid: item.inventsizeid
                            })];
                    case 1:
                        inventory = _b.sent();
                        console.log("======dofifo=======", inventory);
                        val_1 = parseInt(item.salesQty);
                        console.log("quantity", val_1);
                        for (_i = 0, inventory_1 = inventory; _i < inventory_1.length; _i++) {
                            batch = inventory_1[_i];
                            if (parseInt(batch.availabilty) >= val_1) {
                                batch.quantity = val_1;
                                val_1 = 0;
                                break;
                            }
                            else {
                                batch.quantity = parseInt(batch.availabilty);
                                val_1 -= parseInt(batch.availabilty);
                            }
                        }
                        for (_a = 0, inventory_2 = inventory; _a < inventory_2.length; _a++) {
                            batch = inventory_2[_a];
                            if (batch.quantity > 0) {
                                batch.itemid = item.itemid;
                                batch.transrefid = item.salesId;
                                batch.invoiceid = item.salesId;
                                batch.dataareaid = this.sessionInfo.dataareaid;
                                batch.inventlocationid = this.sessionInfo.inventlocationid;
                                batch.transactionClosed = status == "PAID" || status == "RESERVED" ? true : false;
                                batch.qty = -batch.quantity;
                                batch.reserveStatus = status;
                                batch.dateinvent = moment().format();
                                // this.inventTransDAO.save(batche);
                                batches.push(batch);
                                // await this.updateInventoryService.updateInventtransTable(batche, true);
                            }
                        }
                        return [4 /*yield*/, batches];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    SalesTableService.prototype.dofifo__ = function (batch, status) {
        return __awaiter(this, void 0, void 0, function () {
            var inventory, FIFObatch, val_1, _i, inventory_3, i, fifob, _a, FIFObatch_1, invent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.rawQuery.getInventTrans({
                            inventlocationid: this.sessionInfo.inventlocationid,
                            itemId: batch.itemid,
                            configid: batch.configid,
                            inventsizeid: batch.inventsizeid
                        })];
                    case 1:
                        inventory = _b.sent();
                        FIFObatch = [];
                        val_1 = Math.abs(batch.qty);
                        //console.log(val_1);
                        inventory = inventory.filter(function (v) { return v.availabilty > 0; });
                        //console.log(inventory);
                        for (_i = 0, inventory_3 = inventory; _i < inventory_3.length; _i++) {
                            i = inventory_3[_i];
                            fifob = {
                                itemid: batch.itemid,
                                configid: batch.configid,
                                inventsizeid: batch.inventsizeid,
                                invoiceid: batch.invoiceid,
                                transrefid: batch.transrefid,
                                inventlocationid: batch.inventlocationid,
                                batchno: i.batchno,
                                transactionclosed: status == "PAID" || status == "RESERVED" ? true : false,
                                dateinvent: new Date(),
                                reserveStatus: status
                            };
                            if (i.availabilty >= val_1) {
                                fifob.qty = val_1;
                                val_1 = 0;
                                FIFObatch.push(fifob);
                                //console.log(val_1);
                            }
                            else {
                                fifob.qty = val_1;
                                val_1 -= i.availabilty;
                            }
                            if (val_1 == 0) {
                                break;
                            }
                        }
                        _a = 0, FIFObatch_1 = FIFObatch;
                        _b.label = 2;
                    case 2:
                        if (!(_a < FIFObatch_1.length)) return [3 /*break*/, 5];
                        invent = FIFObatch_1[_a];
                        return [4 /*yield*/, this.inventTransDAO.save(invent)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.inventTransDAO.delete(batch)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SalesTableService.prototype.groupBy = function (array, f) {
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
    SalesTableService.prototype.calItem = function (item) {
        item.salesprice = item.salesprice
            ? Math.round(parseFloat((item.salesprice * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.salesQty = item.salesQty
            ? Math.round(parseFloat((item.salesQty * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.lineAmount = item.lineAmount
            ? Math.round(parseFloat((item.lineAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.remainSalesPhysical = item.remainSalesPhysical
            ? Math.round(parseFloat((item.remainSalesPhysical * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.lineTotalDisc = item.lineTotalDisc
            ? Math.round(parseFloat((item.lineTotalDisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.colorantprice = item.colorantprice
            ? Math.round(parseFloat((item.colorantprice * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.vatamount = item.vatamount
            ? Math.round(parseFloat((item.vatamount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.qtyOrdered = item.qtyOrdered
            ? Math.round(parseFloat((item.qtyOrdered * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.voucherdiscpercent = item.voucherdiscpercent
            ? Math.round(parseFloat((item.voucherdiscpercent * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.voucherdiscamt = item.voucherdiscamt
            ? Math.round(parseFloat((item.voucherdiscamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.enddiscamt = item.enddiscamt
            ? Math.round(parseFloat((item.enddiscamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.endDisc = item.endDisc
            ? Math.round(parseFloat((item.endDisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.multilnPercent = item.multilnPercent
            ? Math.round(parseFloat((item.multilnPercent * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.multilndisc = item.multilndisc
            ? Math.round(parseFloat((item.multilndisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.linediscpercent = item.linediscpercent
            ? Math.round(parseFloat((item.linediscpercent * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.linediscamt = item.linediscamt
            ? Math.round(parseFloat((item.linediscamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.lineTotalDisc = item.lineTotalDisc
            ? Math.round(parseFloat((item.lineTotalDisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.promotiondisc = item.promotiondisc
            ? Math.round(parseFloat((item.promotiondisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.instantdiscamt = item.instantdiscamt
            ? Math.round(parseFloat((item.instantdiscamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.instantDisc = item.instantDisc
            ? Math.round(parseFloat((item.instantDisc * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        item.vat = item.vat ? Math.round(parseFloat((item.vat * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2) : 0;
    };
    SalesTableService.prototype.calData = function (data) {
        data.sumTax = parseFloat(data.sumTax);
        data.vatamount = parseFloat(data.vatamount);
        data.voucherdiscpercent = data.voucherdiscpercent
            ? Math.round(parseFloat((data.vatamount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        data.redeemptsamt = data.redeemptsamt
            ? Math.round(parseFloat((data.redeemptsamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        data.voucherdiscamt = data.voucherdiscamt
            ? Math.round(parseFloat((data.voucherdiscamt * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
        data.redeempts = data.redeempts
            ? Math.round(parseFloat((data.redeempts * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2)
            : 0;
    };
    return SalesTableService;
}());
exports.SalesTableService = SalesTableService;
