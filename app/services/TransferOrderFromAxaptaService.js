"use strict";
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
                            salesData.dataareaid = data.data_area_id;
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
                                salesLine.salesQty = v.shipped_qty;
                                salesLine.dataareaid = v.data_area_id;
                                salesLine.inventLocationId = data.invent_location_id_to;
                                salesLine.batchNo = v.batch_no;
                                // salesLine.colors = await this.colorsDAO.findOne({ code: v.config_id });
                                // salesLine.baseSizes = await this.baseSizeDAO.findOneforaxaptadata({ base: { code: v.item_id }, sizes: { code: v.invent_size_id } });
                                salesLine.lastModifiedDate = new Date(App_1.App.DateNow());
                                salesLine.createddatetime = new Date(App_1.App.DateNow());
                                batches = {};
                                batches.qty = v.shipped_qty;
                                batches.itemid = salesLine.itemid;
                                batches.transrefid = salesLine.salesId;
                                batches.invoiceid = salesLine.salesId;
                                batches.batchno = salesLine.batchNo;
                                batches.configid = salesLine.configId;
                                batches.inventsizeid = salesLine.inventsizeid;
                                batches.inventlocationid = salesLine.inventLocationId;
                                batches.dataareaid = salesLine.dataareaid;
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
            var salesData, usergroupconfig, seqNum, seqData, hashString, date, prevYear, year, salesLines, prevSalesLines, _i, salesLines_1, item, batches, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 19, , 20]);
                        if (!data.inventLocationId) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.salesTableDAO.findOne({ interCompanyOriginalSalesId: data.salesId })];
                    case 1:
                        salesData = _a.sent();
                        if (!salesData) return [3 /*break*/, 2];
                        throw { message: "ALREADY_RECEIVED" };
                    case 2: return [4 /*yield*/, this.usergroupconfigDAO.findOne({
                            groupid: this.sessionInfo.groupid,
                        })];
                    case 3:
                        usergroupconfig = _a.sent();
                        salesData = data;
                        salesData.status = data.saleStatus;
                        salesData.interCompanyOriginalSalesId = salesData.salesId;
                        salesData.transkind = "ORDERRECEIVE";
                        seqNum = usergroupconfig.orderreceivesequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(seqNum)];
                    case 4:
                        seqData = _a.sent();
                        if (!(seqData && seqData.format)) return [3 /*break*/, 6];
                        hashString = seqData.format.slice(seqData.format.indexOf("#"), seqData.format.lastIndexOf("#") + 1);
                        date = new Date(seqData.lastmodifieddate).toLocaleString();
                        console.log(date);
                        console.log(seqData);
                        prevYear = new Date(seqData.lastmodifieddate).getFullYear().toString().substr(2, 2);
                        year = new Date().getFullYear().toString().substr(2, 2);
                        seqData.nextrec = prevYear == year ? seqData.nextrec : "000001";
                        salesData.salesId = seqData.format.replace(hashString, year) + "-" + seqData.nextrec;
                        //console.log(salesId);
                        return [4 /*yield*/, this.rawQuery.updateNumberSequence(seqNum, seqData.nextrec)];
                    case 5:
                        //console.log(salesId);
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6: throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
                    case 7:
                        salesLines = data.salesLines;
                        delete salesData.salesLines;
                        return [4 /*yield*/, this.salesTableDAO.save(salesData)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.salesLineDAO.findAll({ salesId: salesData.interCompanyOriginalSalesId })];
                    case 9:
                        prevSalesLines = _a.sent();
                        return [4 /*yield*/, this.salesLineDAO.delete(prevSalesLines)];
                    case 10:
                        _a.sent();
                        _i = 0, salesLines_1 = salesLines;
                        _a.label = 11;
                    case 11:
                        if (!(_i < salesLines_1.length)) return [3 /*break*/, 15];
                        item = salesLines_1[_i];
                        item.id = uuid();
                        item.salesId = salesData.salesId;
                        item.batch = [
                            {
                                batchNo: item.batches.batchno,
                                quantity: item.batches.qty,
                            },
                        ];
                        batches = item.batches;
                        batches.invoiceid = salesData.salesId;
                        batches.salesLineId = item.id;
                        return [4 /*yield*/, this.salesLineDAO.save(item)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.updateInventoryService.updateInventtransTable(batches)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 11];
                    case 15: return [2 /*return*/, { status: 1, id: salesData.salesId, message: Props_1.Props.SAVED_SUCCESSFULLY }];
                    case 16: return [3 /*break*/, 18];
                    case 17: throw { status: 0, message: "INVALID_DATA" };
                    case 18: return [3 /*break*/, 20];
                    case 19:
                        error_3 = _a.sent();
                        throw error_3;
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getTransferOrder = function (transferID) {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, error_4;
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
                        error_4 = _a.sent();
                        // console.log(Object.keys(error));
                        // console.log(error.response.data.Message);
                        throw { status: 0, message: error_4.response.data.Message };
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderFromAxaptaService.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, error_5;
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
                        error_5 = _a.sent();
                        throw { status: 0, message: error_5 };
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TransferOrderFromAxaptaService;
}());
exports.TransferOrderFromAxaptaService = TransferOrderFromAxaptaService;
