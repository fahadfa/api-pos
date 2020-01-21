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
var pg_1 = require("pg");
var sql = require("mssql");
var fs = require("fs");
var jsonString = fs.readFileSync(__dirname + "/data.json", "utf-8");
var dateObj = JSON.parse(jsonString);
console.log(dateObj);
fs.unlinkSync(__dirname + "/data.json");
// function LocalDBOptions() {
//   return {
//     host: Config.localDbOptions.host,
//     port: Config.localDbOptions.port,
//     user: Config.localDbOptions.username,
//     password: Config.localDbOptions.password,
//     database: Config.localDbOptions.database
//   };
// }
function LocalDBOptions() {
    return {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Test!234',
        database: 'jps_prod'
    };
}
var LocalPool = new pg_1.Pool(LocalDBOptions());
function mssqlTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var sqls, salesTableData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sqls = [];
                    return [4 /*yield*/, sql.connect("mssql://SA:Jazeera123@3.80.2.102/mpos_db")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, sql.query("\n  SELECT top 10 * FROM SALESTABLE\n  WHERE \n  SALESTYPE IN (3,4,5,6,7,10) AND \n  CREATEDDATETIME BETWEEN dateadd(day, -90, '" + dateObj.date + "') AND  '" + dateObj.date + "';\n  ")];
                case 2:
                    salesTableData = _a.sent();
                    console.log(salesTableData);
                    return [4 /*yield*/, sqls];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function BatchQuery(sqls) {
    var sqls_1, sqls_1_1;
    return __awaiter(this, void 0, void 0, function () {
        var e_1, _a, db, res, sql_1, e_1_1, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("-------------- Batch Query Starts --------------");
                    console.log(sqls);
                    db = LocalPool;
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
                    sql_1 = sqls_1_1.value;
                    return [4 /*yield*/, db.query(sql_1)];
                case 7:
                    res = _b.sent();
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
                case 16:
                    console.log("END");
                    return [4 /*yield*/, db.query("COMMIT")];
                case 17:
                    _b.sent();
                    return [3 /*break*/, 21];
                case 18:
                    e_2 = _b.sent();
                    console.error(e_2);
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
}
var sqls = mssqlTransactions();
// BatchQuery(sqls)
