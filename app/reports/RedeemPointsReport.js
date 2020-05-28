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
var typeorm_1 = require("typeorm");
var App_1 = require("../../utils/App");
var SalesTableService_1 = require("../services/SalesTableService");
var RawQuery_1 = require("../common/RawQuery");
var RedeemPointsReport = /** @class */ (function () {
    function RedeemPointsReport() {
        this.db = typeorm_1.getManager();
        this.salesTableService = new SalesTableService_1.SalesTableService();
        this.rawQuery = new RawQuery_1.RawQuery();
    }
    RedeemPointsReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = params;
                        return [4 /*yield*/, this.query_to_data(params)];
                    case 1:
                        data = _a.sent();
                        data.map(function (item) {
                            item.lastModifiedDate = App_1.App.convertUTCDateToLocalDate(new Date(item.lastModifiedDate), parseInt(params.timeZoneOffSet)).toLocaleString();
                        });
                        console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RedeemPointsReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                renderData = params;
                renderData.data = result;
                renderData.printDate = App_1.App.convertUTCDateToLocalDate(new Date(App_1.App.DateNow()), parseInt(params.timeZoneOffSet))
                    .toLocaleString()
                    .replace(/T/, " ") // replace T with a space
                    .replace(/\..+/, "");
                renderData.fromDate = new Date(renderData.fromDate).toLocaleDateString();
                renderData.toDate = new Date(renderData.toDate).toLocaleDateString();
                file = params.lang == "en" ? "redeem-points-en" : "redeem-points-ar";
                try {
                    return [2 /*return*/, App_1.App.HtmlRender(file, renderData)];
                }
                catch (error) {
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    RedeemPointsReport.prototype.query_to_data = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select\n    s.salesid,\n    s.invoiceaccount as \"custAccount\",\n    c.\"name\" as \"customerNameAr\",\n    c.namealias as \"customerNameEn\",\n    to_char(s.redeempts, 'FM999999999') as \"redeemPoints\",\n    s.redeemptsamt  as \"redeemAmount\",\n    s.createddatetime as \"createdDateTime\",\n    s.lastmodifieddate  as \"lastModifiedDate\",\n    s.inventlocationid  as inventlocationid\n    from salestable s\n    left join custtable c on c.accountnum  = s.invoiceaccount\n    where redeempts > 0 and s.inventlocationid ='" + params.inventlocationid + "'\nand s.lastmodifieddate ::Date>='" + params.fromDate + "'\nand s.lastmodifieddate ::Date<='" + params.toDate + "'";
                        if (params.custaccount) {
                            query += "and s.invoiceaccount= '" + params.custaccount + "'";
                        }
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return RedeemPointsReport;
}());
exports.RedeemPointsReport = RedeemPointsReport;