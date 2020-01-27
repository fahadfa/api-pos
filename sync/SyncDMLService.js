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
                        Log_1.slog.debug(JSON.stringify(syncResults));
                        if (!syncResults)
                            return [2 /*return*/, Promise.resolve("")];
                        syncResults.last_update = new Date(syncResults.last_update).toISOString();
                        if (!(syncResults.source_id != syncResults.target_id)) return [3 /*break*/, 5];
                        sourceDB = syncResults.source_id == STAGING_ID ? stageDbConfig : localDbConfig;
                        targetDB = syncResults.target_id == STORE_ID ? localDbConfig : stageDbConfig;
                        if (syncResults.source_id != STAGING_ID) {
                            syncResults.last_update = moment(syncResults.last_update)
                                .format()
                                .split("+")[0];
                        }
                        Log_1.slog.warn("\n\n((((((<<<< " + syncResults.map_table + "::" + syncResults.last_update + " >>>>))))))\n\n");
                        return [4 /*yield*/, this.syncDb(sourceDB, targetDB, syncResults, currentTime)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        Log_1.slog.error(error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        Log_1.slog.info("###########################################");
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncDMLService.prototype.syncDb = function (sourceDb, targetDb, sync, currentTime) {
        return __awaiter(this, void 0, void 0, function () {
            var updateSyncConfig, batchSql, sql, isChunkEnd, offset, isTableUpdated, lastUpdate, rowsAvalible_1, rowsNotAvalible, soruceRes, rowsLength, primaryKeys, res, metaDataTable, updateQuery, err_1, updateQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.table(sync);
                        updateSyncConfig = SyncServiceHelper_1.SyncServiceHelper.StageDBOptions();
                        batchSql = [];
                        isChunkEnd = false;
                        offset = 0;
                        isTableUpdated = true;
                        lastUpdate = currentTime;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 17, 19, 20]);
                        rowsAvalible_1 = null;
                        rowsNotAvalible = null;
                        _a.label = 2;
                    case 2:
                        if (!(isChunkEnd == false)) return [3 /*break*/, 15];
                        Log_1.slog.info("************* ***** *************");
                        rowsAvalible_1 = null;
                        rowsNotAvalible = null;
                        batchSql = [];
                        sql = this.buildDDLQuery(sync, offset);
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(sourceDb, sql)];
                    case 3:
                        soruceRes = _a.sent();
                        if (!(soruceRes && soruceRes.rows.length != 0)) return [3 /*break*/, 13];
                        rowsLength = soruceRes.rows.length;
                        primaryKeys = soruceRes.rows.map(function (ele) { return ele[sync.map_pk]; });
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ChackAvalibleQuery(sync.map_table, soruceRes.metaData, primaryKeys, sync.map_pk)];
                    case 4:
                        sql = _a.sent();
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(targetDb, sql)];
                    case 5:
                        res = _a.sent();
                        rowsAvalible_1 = res.rows.map(function (ele) { return ele[sync.map_pk]; });
                        rowsNotAvalible = primaryKeys.filter(function (ele) { return rowsAvalible_1.indexOf(ele) < 0; });
                        Log_1.slog.debug("\t\tUpdate Records: " + sync.map_table + " --> " + rowsAvalible_1.length);
                        Log_1.slog.debug("\t\tInsert Records: " + sync.map_table + " --> " + rowsNotAvalible.length);
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.MetadataTable(targetDb, sync.map_table)];
                    case 6:
                        metaDataTable = _a.sent();
                        if (!(rowsAvalible_1 && rowsAvalible_1.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.PrepareQuery(sync.map_table, metaDataTable, soruceRes.rows, rowsAvalible_1, "UPDATE", sync.map_pk)];
                    case 7:
                        sql = _a.sent();
                        batchSql.push(sql);
                        _a.label = 8;
                    case 8:
                        if (!(rowsNotAvalible && rowsNotAvalible.length > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.PrepareQuery(sync.map_table, metaDataTable, soruceRes.rows, rowsNotAvalible, "INSERT", sync.map_pk)];
                    case 9:
                        sql = _a.sent();
                        batchSql.push(sql);
                        _a.label = 10;
                    case 10:
                        if (!(batchSql && batchSql.length > 0)) return [3 /*break*/, 12];
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(targetDb, batchSql)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        offset = offset + this.limitData;
                        Log_1.slog.warn("Offset: " + offset);
                        /** check loop ends */
                        if (rowsLength < this.limitData) {
                            Log_1.slog.debug("completed batch data ...");
                            isChunkEnd = true;
                        }
                        return [3 /*break*/, 14];
                    case 13:
                        isTableUpdated = false;
                        Log_1.slog.debug("No data found...");
                        isChunkEnd = true;
                        _a.label = 14;
                    case 14:
                        Log_1.slog.info("************* ***** *************");
                        return [3 /*break*/, 2];
                    case 15:
                        Log_1.slog.info(":::::::::::::::::::UPDATE " + sync.id + " START ::::::::::::::::::::::");
                        updateQuery = null;
                        if (isTableUpdated == true) {
                            updateQuery = "update sync_table set last_update = '" + lastUpdate + "', updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        else {
                            updateQuery = "update sync_table set  updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 16:
                        _a.sent();
                        Log_1.slog.info(":::::::::::::::::::UPDATE " + sync.id + " END ::::::::::::::::::::::\n\n");
                        return [3 /*break*/, 20];
                    case 17:
                        err_1 = _a.sent();
                        Log_1.slog.info(":::::::::::::::::::CATCH BLOCK START ::::::::::::::::::::::");
                        Log_1.slog.info(err_1);
                        updateQuery = null;
                        if (err_1 == Props_1.Props.RECORD_NOT_FOUND) {
                            updateQuery = "update sync_table set last_update = '" + lastUpdate + "', updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        else {
                            updateQuery = "update sync_table set updated_on = '" + currentTime + "'  where id='" + sync.id + "'";
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 18:
                        _a.sent();
                        Log_1.slog.info(":::::::::::::::::::CATCH BLOCK ENDS ::::::::::::::::::::::");
                        return [3 /*break*/, 20];
                    case 19: return [7 /*endfinally*/];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    SyncDMLService.prototype.buildDDLQuery = function (sync, offset) {
        var sql = "select * from " + sync.map_table + " where " + sync.cond + "  \n    and " + sync.sync_column + " >= '" + sync.last_update + "' \n    offset " + offset + " limit " + this.limitData;
        return sql;
    };
    return SyncDMLService;
}());
exports.SyncDMLService = SyncDMLService;
