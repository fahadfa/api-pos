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
var typeorm_1 = require("typeorm");
var SyncTableRepository_1 = require("../repos/SyncTableRepository");
var pg_1 = require("pg");
var moment = require("moment");
var format = require("pg-format");
var stagingId = "'STAGING'";
var SyncService = /** @class */ (function () {
    function SyncService() {
        this.db = typeorm_1.getManager();
        this.syncTableRepository = new SyncTableRepository_1.SyncTableRepository();
        this.init();
    }
    SyncService.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sync, currentTime, query, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // App.Sleep(2000);
                        console.log("!!!!!!!!!!!!!!!!!!!!" + new Date().toISOString() + "!!!!!!!!!!!!!!!!!!!!");
                        sync = null;
                        currentTime = new Date();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        query = {};
                        query.active = true;
                        return [4 /*yield*/, this.syncTableRepository.search(query)];
                    case 2:
                        sync = _a.sent();
                        sync = sync.length > 0 ? sync[0] : null;
                        if (!sync)
                            return [2 /*return*/, Promise.resolve("")];
                        return [4 /*yield*/, this.syncDb(sync, currentTime)];
                    case 3:
                        _a.sent();
                        sync.lastUpdate = new Date();
                        sync.updatedOn = new Date();
                        return [4 /*yield*/, this.syncTableRepository.save(sync)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.executeSync = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sync, currentTime, query, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sync = null;
                        currentTime = new Date();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        query = {};
                        //  query.active = true;
                        query.id = id;
                        return [4 /*yield*/, this.syncTableRepository.findOne(query)];
                    case 2:
                        sync = _a.sent();
                        return [4 /*yield*/, this.syncDb(sync, currentTime)];
                    case 3:
                        _a.sent();
                        sync.lastUpdate = currentTime;
                        sync.updatedOn = currentTime;
                        return [4 /*yield*/, this.syncTableRepository.save(sync)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.prototype.init = function () {
        console.log("SyncService start");
        //while (true) {
        // setInterval(async () => {
        //     await this.executeSync("LOCAL_STORE1_STAGING_SYNC_SOURCE");
        //     await this.executeSync("LOCAL_STORE1_STAGING_SYNC_TABLE");
        //     await this.execute();
        // }, 30000);
        //}
        // return Promise.resolve(true);
    };
    SyncService.prototype.syncDb = function (sync, currentTime) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceDbConfig, targetDbConfig, updateSyncConfig, sqls, sql, soruceRes, primaryKeys, res, rowsAvalible_1, rowsNotAvalible, metaDataTable, updateQuery, err_1, updateQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceDbConfig = { host: sync.source.host, port: sync.source.port, user: sync.source.username, password: sync.source.password, database: sync.source.db };
                        targetDbConfig = { host: sync.target.host, port: sync.target.port, user: sync.target.username, password: sync.target.password, database: sync.target.db };
                        console.log(sourceDbConfig);
                        console.log(targetDbConfig);
                        updateSyncConfig = sync.source.id == stagingId ? sourceDbConfig : targetDbConfig;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 13, , 15]);
                        sqls = [];
                        sql = void 0;
                        console.log(new Date().toLocaleDateString());
                        sql =
                            "select * from " +
                                sync.sourceTable +
                                " where " +
                                sync.cond +
                                " and " +
                                sync.syncColumn +
                                " between '" +
                                new Date(sync.lastUpdate).toISOString() +
                                "' and '" +
                                moment().format() +
                                "' ";
                        console.log(sql);
                        return [4 /*yield*/, SyncService.ExecuteQuery(sourceDbConfig, sql)];
                    case 2:
                        soruceRes = _a.sent();
                        if (!soruceRes || soruceRes.rows.length == 0)
                            throw { message: "No Record found" };
                        primaryKeys = soruceRes.rows.map(function (ele) { return ele[sync.sourcePk]; });
                        return [4 /*yield*/, SyncService.ChackAvalibleQuery(sync.targetTable, soruceRes.metaData, primaryKeys, sync.targetPk)];
                    case 3:
                        sql = _a.sent();
                        return [4 /*yield*/, SyncService.ExecuteQuery(targetDbConfig, sql)];
                    case 4:
                        res = _a.sent();
                        rowsAvalible_1 = res.rows.map(function (ele) { return ele[sync.targetPk]; });
                        rowsNotAvalible = primaryKeys.filter(function (ele) { return rowsAvalible_1.indexOf(ele) < 0; });
                        console.log(rowsNotAvalible);
                        return [4 /*yield*/, SyncService.MetadataTable(targetDbConfig, sync.targetTable)];
                    case 5:
                        metaDataTable = _a.sent();
                        console.log("************* transaction Begin *************");
                        if (!(rowsAvalible_1 && rowsAvalible_1.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, SyncService.PrepareQuery(sync.targetTable, metaDataTable, soruceRes.rows, rowsAvalible_1, "UPDATE", sync.sourcePk, sync.targetPk)];
                    case 6:
                        sql = _a.sent();
                        sqls.push(sql);
                        _a.label = 7;
                    case 7:
                        if (!(rowsNotAvalible && rowsNotAvalible.length > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, SyncService.PrepareQuery(sync.targetTable, metaDataTable, soruceRes.rows, rowsNotAvalible, "INSERT", sync.sourcePk, sync.targetPk)];
                    case 8:
                        sql = _a.sent();
                        sqls.push(sql);
                        _a.label = 9;
                    case 9:
                        if (!(sqls && sqls.length > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, SyncService.BatchQuery(targetDbConfig, sqls)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        updateQuery = "update sync_table set last_update = '" + currentTime.toISOString() + "', updated_on = '" + currentTime.toISOString() + "'  where id='" + sync.id + "'";
                        return [4 /*yield*/, SyncService.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 15];
                    case 13:
                        err_1 = _a.sent();
                        console.log(err_1);
                        updateQuery = "update sync_table set updated_on = '" + currentTime.toISOString() + "'  where id='" + sync.id + "'";
                        return [4 /*yield*/, SyncService.BatchQuery(updateSyncConfig, [updateQuery])];
                    case 14:
                        _a.sent();
                        throw err_1;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.BatchQuery = function (config, sqls) {
        var sqls_1, sqls_1_1;
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, db, res, sql, e_1_1, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("-------------- Batch Query Starts --------------");
                        console.log(sqls);
                        db = new pg_1.Client(config);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 18, 20, 21]);
                        return [4 /*yield*/, db.connect()];
                    case 2:
                        _b.sent();
                        res = null;
                        return [4 /*yield*/, db.query("BEGIN")];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 10, 11, 16]);
                        sqls_1 = __asyncValues(sqls);
                        _b.label = 5;
                    case 5: return [4 /*yield*/, sqls_1.next()];
                    case 6:
                        if (!(sqls_1_1 = _b.sent(), !sqls_1_1.done)) return [3 /*break*/, 9];
                        sql = sqls_1_1.value;
                        return [4 /*yield*/, db.query(sql)];
                    case 7:
                        res = _b.sent();
                        console.log(res.command);
                        _b.label = 8;
                    case 8: return [3 /*break*/, 5];
                    case 9: return [3 /*break*/, 16];
                    case 10:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 16];
                    case 11:
                        _b.trys.push([11, , 14, 15]);
                        if (!(sqls_1_1 && !sqls_1_1.done && (_a = sqls_1.return))) return [3 /*break*/, 13];
                        return [4 /*yield*/, _a.call(sqls_1)];
                    case 12:
                        _b.sent();
                        _b.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 15: return [7 /*endfinally*/];
                    case 16: return [4 /*yield*/, db.query("COMMIT")];
                    case 17:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 18:
                        e_2 = _b.sent();
                        return [4 /*yield*/, db.query("ROLLBACK")];
                    case 19:
                        _b.sent();
                        throw e_2;
                    case 20:
                        db.end();
                        return [7 /*endfinally*/];
                    case 21:
                        console.log("-------------- Batch Query Ends --------------");
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncService.ExecuteQuery = function (config, sql) {
        return __awaiter(this, void 0, void 0, function () {
            var db, res, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        db = new pg_1.Client(config);
                        res = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, db.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.query(sql)];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, { metaData: res.fields, rows: res.rows }];
                    case 4:
                        e_3 = _a.sent();
                        throw e_3;
                    case 5:
                        db.end();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.PrepareQuery = function (table, metaData, rows, filterIds, type, sourcePk, targetPk) {
        var metaData_1, metaData_1_1;
        return __awaiter(this, void 0, void 0, function () {
            var e_4, _a, columns, sql, records_1, filterRows, sql_1, ele, e_4_1, records_2, filterRows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        columns = metaData.map(function (ele) { return ele.name; });
                        if (!(type == "INSERT")) return [3 /*break*/, 1];
                        sql = "insert into " + table;
                        sql += " ( " + columns.join(",");
                        sql += " ) VALUES %L";
                        records_1 = [];
                        filterRows = rows.filter(function (ele) { return filterIds.indexOf(ele[targetPk]) > -1; });
                        filterRows.map(function (ele) {
                            records_1.push(Object.values(ele));
                        });
                        sql = format(sql, records_1);
                        console.log(sql);
                        return [2 /*return*/, sql];
                    case 1:
                        if (!(type == "UPDATE")) return [3 /*break*/, 14];
                        sql_1 = "update " + table + " as t set ";
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        metaData_1 = __asyncValues(metaData);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, metaData_1.next()];
                    case 4:
                        if (!(metaData_1_1 = _b.sent(), !metaData_1_1.done)) return [3 /*break*/, 6];
                        ele = metaData_1_1.value;
                        sql_1 += " " + ele.name + " = cast(c." + ele.name + " as " + SyncService.TypeConvertion(ele.data_type) + " ), ";
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_4_1 = _b.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(metaData_1_1 && !metaData_1_1.done && (_a = metaData_1.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(metaData_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13:
                        sql_1 = sql_1.substr(0, sql_1.length - 2) + " ";
                        sql_1 += " from ( values %L)";
                        sql_1 += " as c (" + columns.join(",") + ") where ";
                        sql_1 += "  cast(t." + targetPk + " as text ) =  cast(c." + sourcePk + " as text )";
                        records_2 = [];
                        filterRows = rows.filter(function (ele) { return filterIds.indexOf(ele[targetPk]) > -1; });
                        filterRows.map(function (ele) {
                            records_2.push(Object.values(ele));
                        });
                        console.log(records_2);
                        sql_1 = format(sql_1, records_2);
                        //  sql = sql.replace(/'t'/g, "'TRUE'");
                        //  sql = sql.replace(/'f'/g, "'FALSE'");
                        console.log(sql_1);
                        return [2 /*return*/, sql_1];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    SyncService.TypeConvertion = function (type) {
        switch (type) {
            // case "int":
            //     return "integer";
            // case "int8":
            //     return "bigint";
            // case "int4":
            //     return "bigint";
            // case "bigint":
            //     return "bigint";
            case "bool":
                return "BOOLEAN";
            case "boolean":
                return "BOOLEAN";
            case "varchar":
                return "text";
            case "date":
                return "timestamp";
            default:
                return type;
        }
    };
    SyncService.ChackAvalibleQuery = function (table, metaData, primaryKeys, targetPk) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, sql;
            return __generator(this, function (_a) {
                columns = metaData.map(function (ele) { return ele.name; });
                sql = "select " + targetPk + " from " + table;
                sql += " where " + targetPk + " in  (%L)";
                sql = format(sql, primaryKeys);
                return [2 /*return*/, sql];
            });
        });
    };
    SyncService.TablesList = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var query, db, res, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n        SELECT\n            tablename\n        FROM\n            pg_catalog.pg_tables\n        WHERE\n            schemaname != 'pg_catalog'\n        AND schemaname != 'information_schema'\n    ";
                        db = new pg_1.Client(config);
                        return [4 /*yield*/, db.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.query(query)];
                    case 2:
                        res = _a.sent();
                        rows = res.rows;
                        return [4 /*yield*/, db.end()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    SyncService.MetadataTable = function (config, table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, db, res, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT DISTINCT\n            C.ordinal_position AS POS,\n              C.column_name              AS NAME,\n                  C.is_nullable              AS IS_NULLABLE,\n                  C.udt_name                 AS DATA_TYPE,\n                  C.character_maximum_length AS MAX_LENGTH,\n                  ( CASE\n                      WHEN TC.constraint_type = 'PRIMARY KEY' THEN 'ID'\n                      WHEN TC.constraint_type = 'UNIQUE' THEN NULL\n                      ELSE CCU.table_name\n                    END ) AS REF\n        FROM   information_schema.columns C\n          LEFT JOIN information_schema.key_column_usage AS KCU\n                ON ( KCU.table_name = c.table_name\n                      AND KCU.column_name = c.column_name )\n          LEFT JOIN information_schema.table_constraints TC\n                ON TC.table_name = C.table_name\n                    AND TC.table_catalog = C.table_catalog\n                    AND TC.constraint_name = kcu.constraint_name\n          LEFT JOIN information_schema.constraint_column_usage CCU\n                ON CCU.constraint_name = TC.constraint_name\n                    AND C.table_catalog = CCU.table_catalog\n        WHERE  C.table_catalog = '" + config.database + "'\n          AND C.table_name = '" + table + "'\n        ORDER  BY C.ordinal_position;\n    ";
                        db = new pg_1.Client(config);
                        return [4 /*yield*/, db.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db.query(query)];
                    case 2:
                        res = _a.sent();
                        rows = res.rows;
                        return [4 /*yield*/, db.end()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    return SyncService;
}());
exports.SyncService = SyncService;