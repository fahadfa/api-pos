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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("./utils/Log");
var SyncServiceHelper_1 = require("./sync/SyncServiceHelper");
var Config = __importStar(require("./utils/Config"));
var cron = require("node-cron");
var STORE_ID = process.env.ENV_STORE_ID || "HYD-001";
Config.setEnvConfig();
Config.DbEnvConfig();
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var syncResults, sqlQuery, postedQuery, notPostedQuery, data, entity, update_query, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                syncResults = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                Log_1.saleslog.info("***************************** BEGIN ***********************************");
                Log_1.saleslog.info(JSON.stringify(Config.SALES_CHECK));
                sqlQuery = Config.SALES_CHECK.SYNC_SALES.replace("XXXX-XXXX", STORE_ID);
                postedQuery = Config.SALES_CHECK.POSTED.replace("XXXX-XXXX", STORE_ID);
                notPostedQuery = Config.SALES_CHECK.NOT_POSTED.replace("XXXX-XXXX", STORE_ID);
                Log_1.saleslog.info(JSON.stringify(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions()));
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), sqlQuery)];
            case 2:
                data = _a.sent();
                if (!(data && data.rows.length > 0)) return [3 /*break*/, 8];
                entity = {
                    id: STORE_ID,
                    posted_store: {},
                    posted_stage: {},
                    not_posted_store: {},
                    not_posted_stage: {},
                    not_sync_data: {
                        posted_store: "",
                        posted_stage: "",
                        not_posted_store: "",
                        not_posted_stage: "",
                    },
                    updated_by: STORE_ID,
                    updated_on: new Date().toISOString(),
                };
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), postedQuery)];
            case 3:
                syncResults = _a.sent();
                Log_1.saleslog.info(syncResults);
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("posted store syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.posted_store = dataListToEntity(syncResults);
                }
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), postedQuery)];
            case 4:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("posted stage syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.posted_stage = dataListToEntity(syncResults);
                }
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions(), notPostedQuery)];
            case 5:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("notPosted store syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.not_posted_store = dataListToEntity(syncResults);
                }
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), notPostedQuery)];
            case 6:
                syncResults = _a.sent();
                syncResults = syncResults ? syncResults.rows : [];
                syncResults = syncResults.length > 0 ? syncResults : null;
                Log_1.saleslog.info("notPosted stage syncResults: " + JSON.stringify(syncResults));
                if (syncResults) {
                    entity.not_posted_stage = dataListToEntity(syncResults);
                }
                update_query = " UPDATE public.sync_sales_check\n      SET \n      posted_store='" + JSON.stringify(entity.posted_store) + "', \n      posted_stage='" + JSON.stringify(entity.posted_stage) + "', \n      not_posted_store='" + JSON.stringify(entity.not_posted_store) + "', \n      not_posted_stage='" + JSON.stringify(entity.not_posted_stage) + "', \n      not_sync_data='" + JSON.stringify(entity.not_sync_data) + "', \n      updated_by='" + STORE_ID + "', \n      updated_on='" + entity.updated_on + "'\n      WHERE id='" + STORE_ID + "'\n      ";
                Log_1.saleslog.info(update_query);
                return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(SyncServiceHelper_1.SyncServiceHelper.StageDBOptions(), [update_query])];
            case 7:
                _a.sent();
                return [3 /*break*/, 9];
            case 8:
                Log_1.saleslog.error("STORE_ID not found in the sync_sales_table");
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _a.sent();
                Log_1.saleslog.error(error_1);
                return [3 /*break*/, 11];
            case 11:
                Log_1.saleslog.info("***************************** END ***********************************");
                return [2 /*return*/];
        }
    });
}); };
cron.schedule("* * * * *", function () {
    try {
        main();
    }
    catch (error) {
        Log_1.saleslog.error(error);
        Log_1.saleslog.error("******* Error on sync sales check **********");
    }
});
var dataListToEntity = function (list) {
    var item = {};
    list.forEach(function (ele) {
        item[ele.transkind] = ele.count;
    });
    return item;
};
