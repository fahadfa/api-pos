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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var InventTrans_1 = require("../../entities/InventTrans");
var InventTransDAO_1 = require("../repos/InventTransDAO");
var InventoryOnhandDAO_1 = require("../repos/InventoryOnhandDAO");
var RawQuery_1 = require("../common/RawQuery");
var Props_1 = require("../../constants/Props");
var fs = __importStar(require("fs"));
// let mssqlDbOptions = {
//   username: 'sysoffline',
//   password: 'binjzrpos',
//   host: 'localhost',
//   database: 'DAX',
//   port: 1433
// }
// let mssqlDbOptions = {
//   username: "SA",
//   password: "Jazeera123",
//   host: "3.80.2.102",
//   database: "jpos_dev",
//   port: 1433
// };
// let mssqlDbOptions = Config.mssqlDbOptions
// let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;
// const query = "SELECT name FROM sys.databases";
var OpeningBalanceService = /** @class */ (function () {
    function OpeningBalanceService() {
        var _this = this;
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var mssqlClient, connectionString;
            return __generator(this, function (_a) {
                try {
                    mssqlClient = require("mssql/msnodesqlv8");
                    connectionString = "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
                    this.pool = new mssqlClient.ConnectionPool(connectionString);
                }
                catch (err) {
                    this.pool = null;
                }
                return [2 /*return*/];
            });
        }); };
        this.run();
        this.inventtransDAO = new InventTransDAO_1.InventorytransDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.inventoryTrans = new InventTrans_1.Inventorytrans();
        this.inventoryOnhandDAO = new InventoryOnhandDAO_1.InventoryOnhandDAO();
    }
    OpeningBalanceService.prototype.getOpeningBalance = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, fs_1, rawdata, syncDataDate, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        //await sql.connect();
                        // const conn = new sql.connect(config);
                        return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        //await sql.connect();
                        // const conn = new sql.connect(config);
                        _a.sent();
                        query = "SELECT\n      ITEMID as itemid, \n      ConfigId as configid, \n      InventSizeId as inventsizeid, \n      BatchNo as batchno, \n      SUM(qty) as qty\n      FROM INVENTTRANS i\n      where i.ITEMID NOT LIKE 'HSN%' and i.DATEPHYSICAL < '" + reqData.date + "'\n      group by i.ITEMID, i.ConfigId, i.InventSizeId, i.BatchNo HAVING sum(QTY) >0 ";
                        return [4 /*yield*/, this.pool.request().query(query)];
                    case 2:
                        rows = _a.sent();
                        fs_1 = require("fs");
                        rawdata = {
                            date: reqData.date,
                            inventlocationid: this.sessionInfo.inventlocationid,
                            dataareaid: this.sessionInfo.dataareaid
                        };
                        syncDataDate = JSON.stringify(rawdata);
                        console.log(syncDataDate);
                        fs_1.writeFile(__dirname + "/data.json", syncDataDate, function (err) {
                            if (err) {
                                console.log("Error writing file", err);
                            }
                            else {
                                console.log("Successfully wrote file");
                            }
                        });
                        return [4 /*yield*/, this.pool.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, rows.recordset];
                    case 4:
                        err_1 = _a.sent();
                        throw err_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OpeningBalanceService.prototype.save = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var chunkData, _i, chunkData_1, item, inventtransData, onhandInventoryData, child_process, syncFile, returnData, err_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, this.rawQuery.deleteBalances()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.chunkArray(reqData, 100)];
                    case 2:
                        chunkData = _a.sent();
                        _i = 0, chunkData_1 = chunkData;
                        _a.label = 3;
                    case 3:
                        if (!(_i < chunkData_1.length)) return [3 /*break*/, 7];
                        item = chunkData_1[_i];
                        item.map(function (v) {
                            // v.id = v.recid ? v.recid.toString() : App.UniqueCode()
                            v.dateinvent = new Date();
                            v.datephysical = new Date();
                            v.transactionClosed = true;
                            v.invoiceid = "OPEN_BALANCE";
                            v.inventlocationid = _this.sessionInfo.inventlocationid;
                            v.dataareaid = "ajp";
                        });
                        return [4 /*yield*/, this.inventtransDAO.savearr(item)];
                    case 4:
                        inventtransData = _a.sent();
                        item.map(function (v) {
                            // v.id =v.recid ? v.recid.toString() : App.UniqueCode()
                            v.qtyIn = v.qty;
                            v.updatedOn = new Date();
                            v.updatedBy = _this.sessionInfo.userName;
                            v.name = "OPEN_BALANCE";
                            v.inventlocationid = _this.sessionInfo.inventlocationid;
                            v.dataareaid = "ajp";
                        });
                        return [4 /*yield*/, this.inventoryOnhandDAO.savearr(item)];
                    case 5:
                        onhandInventoryData = _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7:
                        child_process = require("child_process");
                        syncFile = __dirname + "/SyncPrevTransactionsServices.ts";
                        syncFile = fs.existsSync(syncFile)
                            ? __dirname + "/SyncPrevTransactionsServices.ts"
                            : __dirname + "/SyncPrevTransactionsServices.js";
                        child_process.fork(syncFile);
                        returnData = { message: Props_1.Props.SAVED_SUCCESSFULLY };
                        return [2 /*return*/, returnData];
                    case 8:
                        err_2 = _a.sent();
                        throw err_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    OpeningBalanceService.prototype.chunkArray = function (myArray, chunk_size) {
        return __awaiter(this, void 0, void 0, function () {
            var index, arrayLength, tempArray, myChunk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = 0;
                        arrayLength = myArray.length;
                        tempArray = [];
                        for (index = 0; index < arrayLength; index += chunk_size) {
                            myChunk = myArray.slice(index, index + chunk_size);
                            // Do something if you want with the group
                            tempArray.push(myChunk);
                        }
                        return [4 /*yield*/, tempArray];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return OpeningBalanceService;
}());
exports.OpeningBalanceService = OpeningBalanceService;