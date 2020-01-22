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
var SyncServiceHelper_1 = require("../sync/SyncServiceHelper");
var Props_1 = require("../constants/Props");
var App_1 = require("../utils/App");
var moment = require("moment");
var Log_1 = require("../utils/Log");
var STAGING_ID = "STAGING";
var STORE_ID = process.env.ENV_STORE_ID || "LOCAL-TEST";
var SyncDMLService = /** @class */ (function () {
    function SyncDMLService() {
        this.limitData = 1000;
    }
    SyncDMLService.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stageDbConfig, localDbConfig, sql, utcDate, utcDateTime, currentTime, syncResults, sourceDB, targetDB, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1.slog.info("###########################################");
                        Log_1.slog.info("###########################################");
                        // App.Sleep(2000);
                        Log_1.slog.info("!!!!!!!!!!!!!!!!!!!! " + STORE_ID + " - " + new Date().toISOString() + "!!!!!!!!!!!!!!!!!!!!");
                        stageDbConfig = SyncServiceHelper_1.SyncServiceHelper.StageDBOptions();
                        localDbConfig = SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions();
                        sql = "SELECT to_char (now(), 'YYYY-MM-DD\"T\"HH24:MI:SS') as utc_date";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(stageDbConfig, sql)];
                    case 1:
                        utcDate = _a.sent();
                        utcDateTime = utcDate.rows[0]["utc_date"];
                        currentTime = moment().format();
                        // log.info("currentTime Date: ", currentTime);
                        if (App_1.App.DaysDiff(new Date(utcDateTime), new Date(currentTime)) != 0) {
                            Log_1.slog.info("Db Date: " + utcDateTime);
                            Log_1.slog.info("Sys Date: " + currentTime);
                            Log_1.slog.error("+++++++++++++++++++++++ INVALID DATE SYNC +++++++++++++++++++++++");
                            return [2 /*return*/, Promise.resolve("")];
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        if (stageDbConfig.host == localDbConfig.host)
                            throw { message: "Invalid DB config Data" };
                        sql = " select * from sync_table \n                    where (source_id = '" + STORE_ID + "' or target_id = '" + STORE_ID + "' ) \n                    and active = true \n                    order by updated_on  ASC \n                    limit 1";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(stageDbConfig, sql)];
                    case 3:
                        syncResults = _a.sent();
                        syncResults = syncResults ? syncResults.rows : [];
                        syncResults = syncResults.length > 0 ? syncResults[0] : null;
                        console.table(syncResults);
                        if (!syncResults)
                            return [2 /*return*/, Promise.resolve("")];
                        if (!(syncResults.source_id != syncResults.target_id)) return [3 /*break*/, 5];
                        sourceDB = syncResults.source_id == STAGING_ID ? stageDbConfig : localDbConfig;
                        targetDB = syncResults.target_id == STORE_ID ? localDbConfig : stageDbConfig;
                        return [4 /*yield*/, this.syncDb(sourceDB, targetDB, syncResults, currentTime)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        Log_1.slog.info(error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        Log_1.slog.info("###########################################");
                        Log_1.slog.info("###########################################");
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncDMLService.prototype.syncDb = function (sourceDb, targetDb, sync, currentTime) {
        return __awaiter(this, void 0, void 0, function () {
            var updateSyncConfig, batchSql, sql, isChunkEnd, offset, isTableUpdated, _loop_1, this_1, updateQuery, err_1, updateQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1.slog.info(sync);
                        updateSyncConfig = SyncServiceHelper_1.SyncServiceHelper.StageDBOptions();
                        batchSql = [];
                        isChunkEnd = false;
                        offset = 0;
                        isTableUpdated = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 8]);
                        _loop_1 = function () {
                            var soruceRes, primaryKeys, res, rowsAvalible_1, rowsNotAvalible, metaDataTable;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        sql = this_1.buildDDLQuery(sync, offset);
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(sourceDb, sql)];
                                    case 1:
                                        soruceRes = _a.sent();
                                        if (!(soruceRes && soruceRes.rows.length != 0)) return [3 /*break*/, 11];
                                        primaryKeys = soruceRes.rows.map(function (ele) { return ele[sync.map_pk]; });
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ChackAvalibleQuery(sync.map_table, soruceRes.metaData, primaryKeys, sync.map_pk)];
                                    case 2:
                                        sql = _a.sent();
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(targetDb, sql)];
                                    case 3:
                                        res = _a.sent();
                                        rowsAvalible_1 = res.rows.map(function (ele) { return ele[sync.map_pk]; });
                                        rowsNotAvalible = primaryKeys.filter(function (ele) { return rowsAvalible_1.indexOf(ele) < 0; });
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.MetadataTable(targetDb, sync.map_table)];
                                    case 4:
                                        metaDataTable = _a.sent();
                                        Log_1.slog.info("\n\n************* ***** *************");
                                        Log_1.slog.debug("\t\tUpdate Records: " + rowsAvalible_1.length);
                                        Log_1.slog.debug("\t\tInsert Records: " + rowsNotAvalible.length);
                                        Log_1.slog.info("************* ***** *************");
                                        if (!(rowsAvalible_1 && rowsAvalible_1.length > 0)) return [3 /*break*/, 6];
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.PrepareQuery(sync.map_table, metaDataTable, soruceRes.rows, rowsAvalible_1, "UPDATE", sync.map_pk)];
                                    case 5:
                                        sql = _a.sent();
                                        batchSql.push(sql);
                                        _a.label = 6;
                                    case 6:
                                        if (!(rowsNotAvalible && rowsNotAvalible.length > 0)) return [3 /*break*/, 8];
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.PrepareQuery(sync.map_table, metaDataTable, soruceRes.rows, rowsNotAvalible, "INSERT", sync.map_pk)];
                                    case 7:
                                        sql = _a.sent();
                                        batchSql.push(sql);
                                        _a.label = 8;
                                    case 8:
                                        if (!(batchSql && batchSql.length > 0)) return [3 /*break*/, 10];
                                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(targetDb, batchSql)];
                                    case 9:
                                        _a.sent();
                                        _a.label = 10;
                                    case 10:
                                        offset = offset + this_1.limitData;
                                        Log_1.slog.warn("Offset: " + offset);
                                        /** check loop ends */
                                        if (soruceRes.rows.length < this_1.limitData) {
                                            Log_1.slog.debug("completed batch data ...");
                                            isChunkEnd = true;
                                        }
                                        return [3 /*break*/, 12];
                                    case 11:
                                        isTableUpdated = false;
                                        Log_1.slog.debug("No data found...");
                                        isChunkEnd = true;
                                        _a.label = 12;
                                    case 12: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        if (!(isChunkEnd == false)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 4:
                        updateQuery = null;
                        if (isTableUpdated == true) {
                            updateQuery = "update sync_table set last_update = '" + new Date().toDateString() + "', updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        else {
                            updateQuery = "update sync_table set  updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 5:
                        _a.sent();
                        Log_1.slog.info("************* ***** *************");
                        Log_1.slog.info("************* ***** *************\n\n");
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        Log_1.slog.info(":::::::::::::::::::CATCH BLOCK START ::::::::::::::::::::::");
                        Log_1.slog.info(err_1);
                        updateQuery = null;
                        if (err_1 == Props_1.Props.RECORD_NOT_FOUND) {
                            updateQuery = "update sync_table set last_update = '" + new Date().toDateString() + "', updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        else {
                            updateQuery = "update sync_table set updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 7:
                        _a.sent();
                        Log_1.slog.info(":::::::::::::::::::CATCH BLOCK ENDS ::::::::::::::::::::::");
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    SyncDMLService.prototype.buildDDLQuery = function (sync, offset) {
        var sql = "select * from " + sync.map_table + "\n                  where " + sync.cond + "  \n                  and " + sync.sync_column + " >= '" + new Date(sync.last_update).toISOString() + "'\n                 offset " + offset + " limit " + this.limitData;
        return sql;
    };
    return SyncDMLService;
}());
exports.SyncDMLService = SyncDMLService;
