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
var sql = require("mssql");
var InventTrans_1 = require("../../entities/InventTrans");
var InventTransDAO_1 = require("../repos/InventTransDAO");
var InventoryOnhandDAO_1 = require("../repos/InventoryOnhandDAO");
var RawQuery_1 = require("../common/RawQuery");
var Props_1 = require("../../constants/Props");
var OpeningBalanceService = /** @class */ (function () {
    function OpeningBalanceService() {
        this.inventtransDAO = new InventTransDAO_1.InventorytransDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.inventoryTrans = new InventTrans_1.Inventorytrans();
        this.inventoryOnhandDAO = new InventoryOnhandDAO_1.InventoryOnhandDAO();
    }
    OpeningBalanceService.prototype.getOpeningBalance = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var data, fs, rawdata, syncDataDate, child_process, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, sql.connect("mssql://SA:Jazeera123@3.80.2.102/mpos_db")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, sql.query("\n        SELECT \n        ITEMID as itemid, \n        ConfigId as configid, \n        InventSizeId as inventsizeid, \n        BatchNo as batchno, \n        SUM(qty) as qty,\n        LOWER(DATAAREAID) as dataareaid, \n        CUSTVENDAC as inventlocationid\n        FROM INVENTTRANS i\n        where i.ITEMID NOT LIKE 'HSN%' and i.DATEPHYSICAL < '" + reqData.date + "'\n        group by i.ITEMID, i.ConfigId, i.InventSizeId, i.BatchNo, i.DATAAREAID, i.CUSTVENDAC HAVING sum(QTY) >0 \n    ")];
                    case 2:
                        data = _a.sent();
                        fs = require("fs");
                        rawdata = { date: reqData.date };
                        syncDataDate = JSON.stringify(rawdata);
                        console.log(syncDataDate);
                        fs.writeFile(__dirname + "/data.json", syncDataDate, function (err) {
                            if (err) {
                                console.log("Error writing file", err);
                            }
                            else {
                                console.log("Successfully wrote file");
                            }
                        });
                        child_process = require("child_process");
                        child_process.fork(__dirname + "/SyncPrevTransactionsServices.ts");
                        return [2 /*return*/, data.recordset];
                    case 3:
                        err_1 = _a.sent();
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpeningBalanceService.prototype.save = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var inventtransData, onhandInventoryData, child_process, returnData, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.rawQuery.deleteBalances()];
                    case 1:
                        _a.sent();
                        reqData.map(function (v) {
                            v.dateinvent = new Date();
                            v.datephysical = new Date();
                            v.transactionClosed = true;
                            v.invoiceid = "OPEN_BALANCE";
                        });
                        return [4 /*yield*/, this.inventtransDAO.savearr(reqData)];
                    case 2:
                        inventtransData = _a.sent();
                        reqData.map(function (v) {
                            v.qtyIn = v.qty;
                            v.updatedOn = new Date();
                            v.updatedBy = _this.sessionInfo.userName;
                            v.name = "OPEN_BALANCE";
                        });
                        return [4 /*yield*/, this.inventoryOnhandDAO.savearr(reqData)];
                    case 3:
                        onhandInventoryData = _a.sent();
                        child_process = require("child_process");
                        child_process.fork(this.syncTransactions());
                        returnData = { message: Props_1.Props.SAVED_SUCCESSFULLY };
                        return [2 /*return*/, returnData];
                    case 4:
                        err_2 = _a.sent();
                        throw err_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OpeningBalanceService.prototype.syncTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    console.log("********************syncTransactions************************");
                    return [2 /*return*/, Promise.resolve("")];
                }
                catch (err) {
                    throw err;
                }
                return [2 /*return*/];
            });
        });
    };
    return OpeningBalanceService;
}());
exports.OpeningBalanceService = OpeningBalanceService;
