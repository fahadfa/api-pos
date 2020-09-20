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
var Props_1 = require("../../constants/Props");
var SalesTable_1 = require("../../entities/SalesTable");
var SalesLine_1 = require("../../entities/SalesLine");
var UpdateInventoryService_1 = require("../services/UpdateInventoryService");
var BaseSizesDAO_1 = require("../repos/BaseSizesDAO");
var ColorsDAO_1 = require("../repos/ColorsDAO");
var SalesTableDAO_1 = require("../repos/SalesTableDAO");
var SalesLineDAO_1 = require("../repos/SalesLineDAO");
var uuid = require("uuid");
var UsergroupconfigDAO_1 = require("../repos/UsergroupconfigDAO");
var RawQuery_1 = require("../common/RawQuery");
var typeorm_1 = require("typeorm");
var TransferOrderFromAxaptaService = /** @class */ (function () {
    function TransferOrderFromAxaptaService() {
        this.axios = require("axios");
        this.updateInventoryService = new UpdateInventoryService_1.UpdateInventoryService();
        this.colorsDAO = new ColorsDAO_1.ColorsDAO();
        this.baseSizeDAO = new BaseSizesDAO_1.BaseSizesDAO();
        this.salesTableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.salesLineDAO = new SalesLineDAO_1.SalesLineDAO();
        this.usergroupconfigDAO = new UsergroupconfigDAO_1.UsergroupconfigDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
    }
    TransferOrderFromAxaptaService.prototype.get = function (transferID) {
        return __awaiter(this, void 0, void 0, function () {
            var axaptaData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.getTransferOrder(transferID)];
                    case 1:
                        axaptaData = _a.sent();
                        console.log("data-----------------", axaptaData);
                        axaptaData.invent_location_id_to.trim();
                        if (!(axaptaData.invent_location_id_to.trim() == this.sessionInfo.inventlocationid)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.mapSalesData(axaptaData)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw { message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.mapSalesData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salesData, i, _i, _a, v, salesLine, batches, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.salesTableDAO.findOne({ salesId: data.transfer_id })];
                    case 1:
                        salesData = _b.sent();
                        console.log(data.invent_location_id_to, this.sessionInfo.inventlocationid);
                        if (data.invent_location_id_to == this.sessionInfo.inventlocationid) {
                            salesData = new SalesTable_1.SalesTable();
                            salesData.salesId = data.transfer_id;
                            salesData.inventLocationId = data.invent_location_id_to;
                            salesData.transkind = "TRANSFERORDER";
                            salesData.saleStatus = "RECEIVED";
                            salesData.custAccount = data.invent_location_id_from;
                            salesData.invoiceDate = data.shipdate;
                            salesData.shippingDateConfirmed = data.shipdate;
                            salesData.dataareaid = data.data_area_id.toLowerCase();
                            salesData.lastModifiedDate = new Date(App_1.App.DateNow());
                            salesData.createddatetime = new Date(App_1.App.DateNow());
                            salesData.salesType = 4;
                            // await this.salesTableDAO.save(salesData);
                            // let salesLines = await this.salesLineDAO.findAll({ salesId: salesData.salesId });
                            // await this.salesLineDAO.delete(salesLines);
                            salesData.salesLines = [];
                            i = 1;
                            for (_i = 0, _a = data.orderLines; _i < _a.length; _i++) {
                                v = _a[_i];
                                salesLine = new SalesLine_1.SalesLine();
                                salesLine.salesId = v.transfer_id;
                                salesLine.lineNum = i;
                                salesLine.itemid = v.item_id;
                                salesLine.configId = v.config_id;
                                salesLine.inventsizeid = v.invent_size_id;
                                salesLine.salesQty = parseInt(v.shipped_qty);
                                salesLine.dataareaid = v.data_area_id.toLowerCase();
                                salesLine.inventLocationId = data.invent_location_id_to;
                                salesLine.batchNo = v.batch_no;
                                salesLine.custAccount = data.invent_location_id_from;
                                // salesLine.colors = await this.colorsDAO.findOne({ code: v.config_id });
                                // salesLine.baseSizes = await this.baseSizeDAO.findOneforaxaptadata({ base: { code: v.item_id }, sizes: { code: v.invent_size_id } });
                                salesLine.lastModifiedDate = new Date(App_1.App.DateNow());
                                salesLine.createddatetime = new Date(App_1.App.DateNow());
                                batches = {};
                                batches.qty = parseInt(v.shipped_qty);
                                batches.itemid = salesLine.itemid;
                                batches.transrefid = salesLine.salesId;
                                batches.invoiceid = salesLine.salesId;
                                batches.batchno = salesLine.batchNo;
                                batches.configid = salesLine.configId;
                                batches.inventsizeid = salesLine.inventsizeid;
                                batches.inventlocationid = salesLine.inventLocationId;
                                batches.dataareaid = salesLine.dataareaid.toLowerCase();
                                batches.transactionClosed = false;
                                batches.dateinvent = new Date(App_1.App.DateNow());
                                salesLine.batches = batches;
                                // await this.updateInventoryService.updateInventtransTable(batches);
                                salesData.salesLines.push(salesLine);
                                i += 1;
                            }
                            salesData.status = 1;
                            // return { message: Props.SAVED_SUCCESSFULLY };
                            return [2 /*return*/, salesData];
                        }
                        else {
                            throw { status: 1, message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.save = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, salesData, prevSalesData, usergroupconfig, oldItem, salesIdExists, uid, salesLines, _i, salesLines_1, item, batches, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = typeorm_1.getConnection().createQueryRunner();
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 21, 23, 25]);
                        console.log(data);
                        if (!(data.inventLocationId == this.sessionInfo.inventlocationid)) return [3 /*break*/, 19];
                        salesData = void 0;
                        return [4 /*yield*/, this.salesTableDAO.findOne({ interCompanyOriginalSalesId: data.salesId })];
                    case 4:
                        prevSalesData = _a.sent();
                        if (!prevSalesData) return [3 /*break*/, 5];
                        throw { message: "ALREADY_RECEIVED" };
                    case 5: return [4 /*yield*/, this.usergroupconfigDAO.findOne({
                            groupid: this.sessionInfo.groupid,
                        })];
                    case 6:
                        usergroupconfig = _a.sent();
                        salesData = data;
                        salesData.status = "RECEIVED";
                        salesData.interCompanyOriginalSalesId = salesData.salesId;
                        salesData.transkind = "ORDERRECEIVE";
                        oldItem = null;
                        salesIdExists = true;
                        _a.label = 7;
                    case 7:
                        if (!salesIdExists) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.getSalesid('ORDERRECEIVE', salesData)];
                    case 8:
                        uid = _a.sent();
                        return [4 /*yield*/, this.salesTableDAO.findOne(uid)];
                    case 9:
                        oldItem = _a.sent();
                        if (oldItem) {
                            console.log(oldItem.salesId);
                        }
                        else {
                            salesData.salesId = uid;
                            salesIdExists = false;
                        }
                        return [3 /*break*/, 7];
                    case 10:
                        salesLines = data.salesLines;
                        delete salesData.salesLines;
                        // await this.salesTableDAO.save(salesData);
                        return [4 /*yield*/, queryRunner.manager.getRepository(SalesTable_1.SalesTable).save(salesData)];
                    case 11:
                        // await this.salesTableDAO.save(salesData);
                        _a.sent();
                        _i = 0, salesLines_1 = salesLines;
                        _a.label = 12;
                    case 12:
                        if (!(_i < salesLines_1.length)) return [3 /*break*/, 16];
                        item = salesLines_1[_i];
                        item.id = uuid();
                        item.salesId = salesData.salesId;
                        item.batch = [
                            {
                                batchNo: item.batches.batchno,
                                quantity: parseInt(item.batches.qty),
                            },
                        ];
                        batches = item.batches;
                        console.log("==========================================================", batches);
                        batches.invoiceid = salesData.salesId;
                        batches.salesLineId = item.id;
                        batches.transactionClosed = false;
                        // await this.salesLineDAO.save(item);
                        return [4 /*yield*/, queryRunner.manager.getRepository(SalesLine_1.SalesLine).save(item)];
                    case 13:
                        // await this.salesLineDAO.save(item);
                        _a.sent();
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches, false, false, queryRunner)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 12];
                    case 16: return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 17:
                        _a.sent();
                        return [2 /*return*/, { status: 1, id: salesData.salesId, message: Props_1.Props.SAVED_SUCCESSFULLY }];
                    case 18: return [3 /*break*/, 20];
                    case 19: throw { status: 0, message: "INVOICE_ID_NOT_RELATED_TO_THIS_STORE" };
                    case 20: return [3 /*break*/, 25];
                    case 21:
                        error_3 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 22:
                        _a.sent();
                        throw error_3;
                    case 23: return [4 /*yield*/, queryRunner.release()];
                    case 24:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 25: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getSalesid = function (type, item) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, hashString, date, prevYear, year, salesId, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 32, , 33]);
                        data = void 0;
                        _a = type;
                        switch (_a) {
                            case "SALESQUOTATION": return [3 /*break*/, 1];
                            case "SALESORDER": return [3 /*break*/, 3];
                            case "RESERVED": return [3 /*break*/, 5];
                            case "DESIGNERSERVICE": return [3 /*break*/, 7];
                            case "RETURNORDER": return [3 /*break*/, 9];
                            case "DESIGNERSERVICERETURN": return [3 /*break*/, 11];
                            case "INVENTORYMOVEMENT": return [3 /*break*/, 13];
                            case "TRANSFERORDER": return [3 /*break*/, 15];
                            case "ORDERSHIPMENT": return [3 /*break*/, 17];
                            case "ORDERRECEIVE": return [3 /*break*/, 19];
                            case "PURCHASEREQUEST": return [3 /*break*/, 21];
                            case "PURCHASEORDER": return [3 /*break*/, 23];
                            case "PURCHASERETURN": return [3 /*break*/, 25];
                        }
                        return [3 /*break*/, 27];
                    case 1: return [4 /*yield*/, this.rawQuery.getNumberSequence("SALESQUOTATION", this.sessionInfo.inventlocationid)];
                    case 2:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 3: return [4 /*yield*/, this.rawQuery.getNumberSequence("SALESORDER", this.sessionInfo.inventlocationid)];
                    case 4:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 5: return [4 /*yield*/, this.rawQuery.getNumberSequence("SALESORDER", this.sessionInfo.inventlocationid)];
                    case 6:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 7: return [4 /*yield*/, this.rawQuery.getNumberSequence("SALESORDER", this.sessionInfo.inventlocationid)];
                    case 8:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 9: return [4 /*yield*/, this.rawQuery.getNumberSequence("RETURNORDER", this.sessionInfo.inventlocationid)];
                    case 10:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 11: return [4 /*yield*/, this.rawQuery.getNumberSequence("RETURNORDER", this.sessionInfo.inventlocationid)];
                    case 12:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 13: return [4 /*yield*/, this.rawQuery.getNumberSequence("INVENTORYMOVEMENT", this.sessionInfo.inventlocationid)];
                    case 14:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 15: return [4 /*yield*/, this.rawQuery.getNumberSequence("TRANSFERORDER", this.sessionInfo.inventlocationid)];
                    case 16:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 17: return [4 /*yield*/, this.rawQuery.getNumberSequence("ORDERSHIPMENT", this.sessionInfo.inventlocationid)];
                    case 18:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 19: return [4 /*yield*/, this.rawQuery.getNumberSequence("ORDERRECEIVE", this.sessionInfo.inventlocationid)];
                    case 20:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 21: return [4 /*yield*/, this.rawQuery.getNumberSequence("PURCHASEREQUEST", this.sessionInfo.inventlocationid)];
                    case 22:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 23: return [4 /*yield*/, this.rawQuery.getNumberSequence("PURCHASEORDER", this.sessionInfo.inventlocationid)];
                    case 24:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 25: return [4 /*yield*/, this.rawQuery.getNumberSequence("PURCHASERETURN", this.sessionInfo.inventlocationid)];
                    case 26:
                        data = _b.sent();
                        return [3 /*break*/, 28];
                    case 27: throw { message: "TRANSKIND_REQUIRED" };
                    case 28:
                        if (!(data && data.format)) return [3 /*break*/, 30];
                        hashString = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
                        date = new Date(data.lastmodifieddate).toLocaleString();
                        console.log(date);
                        console.log(data);
                        prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
                        year = new Date(App_1.App.DateNow()).getFullYear().toString().substr(2, 2);
                        data.nextrec = prevYear == year ? data.nextrec : "000001";
                        if (data.nextrec == 1 || data.nextrec == "1") {
                            data.nextrec = "000001";
                        }
                        salesId = data.format.replace(hashString, year) + "-" + data.nextrec;
                        //console.log(salesId);
                        item.numberSequenceGroup = data.numbersequence;
                        return [4 /*yield*/, this.rawQuery.updateNumberSequence(data.numbersequence, data.nextrec)];
                    case 29:
                        _b.sent();
                        return [2 /*return*/, salesId];
                    case 30: throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
                    case 31: return [3 /*break*/, 33];
                    case 32:
                        error_4 = _b.sent();
                        if (error_4 == {}) {
                            error_4 = { message: "SERVER_SIDE_ERROR" };
                        }
                        throw error_4;
                    case 33: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getTransferOrder = function (transferID) {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getToken()];
                    case 1:
                        token = _a.sent();
                        console.log(token);
                        url = Props_1.Props.AXAPTA_URL + ("ShippedTransferOrder?transferID=" + transferID);
                        console.log("axpta url :  ", url);
                        this.axios.defaults.headers["Token"] = token;
                        console.log(this.axios.defaults.headers);
                        return [4 /*yield*/, this.axios.get(url)];
                    case 2:
                        data = _a.sent();
                        console.log(Object.keys(data));
                        console.log();
                        return [2 /*return*/, data.data];
                    case 3:
                        error_5 = _a.sent();
                        // console.log(Object.keys(error));
                        // console.log(error.response.data.Message);
                        throw { status: 0, message: error_5.response.data.Message };
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getQrStringToData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.qrToData(data.qrStringList)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.qrToData = function (qrStringList) {
        return __awaiter(this, void 0, void 0, function () {
            var dataList, pageCount, salesId, scannedPages_1, _i, qrStringList_1, qrString, list, header, warehousearray, pages, salestable, salesLines, _a, _b, item, salesline, lineArray, batches, salesData, salesLine_1, i_1, totalPages, missingPages_1, i;
            return __generator(this, function (_c) {
                try {
                    dataList = [];
                    pageCount = 0;
                    salesId = "0";
                    scannedPages_1 = [];
                    for (_i = 0, qrStringList_1 = qrStringList; _i < qrStringList_1.length; _i++) {
                        qrString = qrStringList_1[_i];
                        list = qrString.split("|");
                        header = list[0];
                        warehousearray = header.split("^");
                        pages = qrString.substring(0, qrString.indexOf("$")).split("%");
                        pageCount = pages[1];
                        salestable = {
                            salesId: header.substring(header.lastIndexOf("$") + 1, header.indexOf("^")),
                            custAccount: warehousearray[1],
                            inventLocationId: warehousearray[2],
                            page: pages[0],
                        };
                        scannedPages_1.push(parseInt(salestable.page));
                        if (salesId == "0") {
                            salesId = salestable.salesId;
                        }
                        else if (salesId != salestable.salesId) {
                            throw { message: "PLEASE_SCAN_ALL_PAGES_WITH_SAME_ORDER_ID" };
                        }
                        salesLines = [];
                        for (_a = 0, _b = list[1].split("*"); _a < _b.length; _a++) {
                            item = _b[_a];
                            salesline = {};
                            lineArray = item.split("+");
                            if (lineArray[0] == "HSN-00001") {
                                salesLines[salesLines.length - 1].colorantId = lineArray[1];
                            }
                            else {
                                salesline.salesId = salestable.salesId;
                                salesline.itemid = lineArray[0];
                                salesline.configId = lineArray[1];
                                salesline.inventsizeid = lineArray[2];
                                // salesline.batch = { batchNo: lineArray[3], quantity: parseInt(lineArray[4]) };
                                salesline.salesQty = parseInt(lineArray[4]);
                                salesline.lastModifiedDate = new Date(App_1.App.DateNow());
                                salesline.createddatetime = new Date(App_1.App.DateNow());
                                salesline.inventLocationId = salestable.inventLocationId;
                                salesline.batchNo = lineArray[3];
                                salesline.dataareaid = this.sessionInfo.dataareaid;
                                salesline.custAccount = salestable.custAccount;
                                salesline.numberSequenceGroupId = salestable.numberSequenceGroup;
                                batches = {};
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
                                batches.dateinvent = new Date(App_1.App.DateNow());
                                salesline.batches = batches;
                                console.log("===", salesLines.length);
                                salesLines.push(salesline);
                            }
                        }
                        salestable.salesLine = salesLines;
                        dataList.push(salestable);
                    }
                    if (pageCount == qrStringList.length) {
                        dataList.sort(function (a, b) {
                            if (a.page < b.page)
                                return -1;
                            if (a.page > b.page)
                                return 1;
                            return 0;
                        });
                        salesData = __assign({}, dataList[0]);
                        delete salesData.salesLine;
                        salesLine_1 = [];
                        dataList.map(function (v) {
                            salesLine_1.push.apply(salesLine_1, v.salesLine);
                        });
                        i_1 = 1;
                        salesLine_1.map(function (v) {
                            v.lineNum = i_1;
                            i_1 += 1;
                        });
                        salesData.lastModifiedDate = new Date(App_1.App.DateNow());
                        salesData.createddatetime = new Date(App_1.App.DateNow());
                        salesData.transkind = "ORDERSHIPMENT";
                        salesData.saleStatus = "RECEIVED";
                        salesData.dataareaid = this.sessionInfo.dataareaid;
                        salesData.salesType = 4;
                        salesData.salesLines = salesLine_1;
                        console.log(scannedPages_1);
                        return [2 /*return*/, salesData];
                    }
                    else {
                        console.log(scannedPages_1);
                        totalPages = [];
                        missingPages_1 = [];
                        for (i = 1; i <= pageCount; i++) {
                            totalPages.push(i);
                        }
                        totalPages.map(function (v) {
                            if (!scannedPages_1.includes(v)) {
                                missingPages_1.push(v);
                            }
                        });
                        console.log(totalPages, scannedPages_1);
                        throw { message: "PLEASE_SCAN_ALL_PAGES", missingPages: missingPages_1 };
                    }
                }
                catch (err) {
                    throw { message: err };
                }
                return [2 /*return*/];
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        token = void 0;
                        url = Props_1.Props.REDEEM_URL + "?clientId=" + Props_1.Props.REDEEM_CLIENT_ID + "&clientSecret=" + Props_1.Props.REDEEM_CLIENT_SECRET;
                        console.log(url);
                        return [4 /*yield*/, this.axios.post(url)];
                    case 1:
                        data = _a.sent();
                        token = data.headers.token;
                        return [2 /*return*/, token];
                    case 2:
                        error_6 = _a.sent();
                        throw { status: 0, message: error_6 };
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TransferOrderFromAxaptaService;
}());
exports.TransferOrderFromAxaptaService = TransferOrderFromAxaptaService;
