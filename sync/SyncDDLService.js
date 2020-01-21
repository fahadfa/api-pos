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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Props_1 = require("../constants/Props");
var SyncServiceHelper_1 = require("../sync/SyncServiceHelper");
var App_1 = require("../utils/App");
var STAGING_ID = "STAGING";
var STORE_ID = process.env.ENV_STORE_ID || "LOCAL-TEST";
var Log_1 = require("../utils/Log");
var SyncDDLService = /** @class */ (function () {
    function SyncDDLService() {
    }
    SyncDDLService.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sync, currentTime, sql, stageDb, syncResults, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1.slog.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                        Log_1.slog.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                        Log_1.slog.info("!!!!!!!!!!!!!!!!!!!! SYNC_DDL - " + new Date().toISOString() + "!!!!!!!!!!!!!!!!!!!!");
                        sync = null;
                        currentTime = new Date();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        stageDb = SyncServiceHelper_1.SyncServiceHelper.StageDBOptions();
                        sql = "select * from sync_source\n            where id='" + STORE_ID + "' \n            and sync_ddl IS NOT NULL";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(stageDb, sql)];
                    case 2:
                        syncResults = _a.sent();
                        syncResults = syncResults.rows;
                        syncResults = syncResults.length > 0 ? syncResults[0] : null;
                        console.table(syncResults);
                        if (!syncResults)
                            return [2 /*return*/, Promise.resolve("")];
                        return [4 /*yield*/, this.syncDDL(syncResults, currentTime)];
                    case 3:
                        _a.sent();
                        Log_1.slog.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                        Log_1.slog.info("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SyncDDLService.prototype.syncDDL = function (sync, currentTime) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, params, sql, stageDb, localDb, syncResults, syncResults_1, syncResults_1_1, res, syncDDLval, index, err_1, summary, e_1_1, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        params = "";
                        sql = "";
                        stageDb = SyncServiceHelper_1.SyncServiceHelper.StageDBOptions();
                        localDb = SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 20, , 21]);
                        params = "";
                        sync.sync_ddl.map(function (ele) {
                            params = params + "'" + ele + "',";
                        });
                        if (params && params.length)
                            params = params.substring(0, params.length - 1);
                        sql = " SELECT id,summary FROM sync_ddl WHERE id IN (" + params + ")";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(stageDb, sql)];
                    case 2:
                        syncResults = _b.sent();
                        syncResults = syncResults.rows;
                        if (syncResults.length == 0)
                            throw Props_1.Props.RECORD_NOT_FOUND;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 13, 14, 19]);
                        syncResults_1 = __asyncValues(syncResults);
                        _b.label = 4;
                    case 4: return [4 /*yield*/, syncResults_1.next()];
                    case 5:
                        if (!(syncResults_1_1 = _b.sent(), !syncResults_1_1.done)) return [3 /*break*/, 12];
                        res = syncResults_1_1.value;
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 9, , 11]);
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(localDb, [res.summary])];
                    case 7:
                        _b.sent();
                        syncDDLval = sync.sync_ddl;
                        index = syncDDLval.indexOf(res.id);
                        if (index > -1)
                            syncDDLval.splice(index, 1);
                        if (syncDDLval.length == 0) {
                            sql = "UPDATE sync_source SET  sync_ddl = NULL WHERE id='" + sync.id + "'";
                        }
                        else {
                            sql = "UPDATE sync_source SET  sync_ddl= '{" + syncDDLval + "}' WHERE id='" + sync.id + "'";
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(stageDb, [sql])];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        err_1 = _b.sent();
                        summary = res.summary.replace(/'/g, "''");
                        sql = "\n                    INSERT INTO sync_error \n                    (id, store_id, \"type\", error_id, error_msg, error_desc) \n                    VALUES(\n                      '" + App_1.App.UniqueNumber() + "', '" + STORE_ID + "', 'DDL', '" + res.id + "', '" + summary + "', '" + (err_1.message ? err_1.message : JSON.stringify(err_1)) + "'\n                    )\n                  ";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(stageDb, [sql])];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 4];
                    case 12: return [3 /*break*/, 19];
                    case 13:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 19];
                    case 14:
                        _b.trys.push([14, , 17, 18]);
                        if (!(syncResults_1_1 && !syncResults_1_1.done && (_a = syncResults_1.return))) return [3 /*break*/, 16];
                        return [4 /*yield*/, _a.call(syncResults_1)];
                    case 15:
                        _b.sent();
                        _b.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 18: return [7 /*endfinally*/];
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        err_2 = _b.sent();
                        console.error(err_2);
                        return [3 /*break*/, 21];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    return SyncDDLService;
}());
exports.SyncDDLService = SyncDDLService;
