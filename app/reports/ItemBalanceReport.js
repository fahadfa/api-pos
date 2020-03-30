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
var ItemBalanceReport = /** @class */ (function () {
    function ItemBalanceReport() {
        this.db = typeorm_1.getManager();
    }
    ItemBalanceReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var query, warehouseQuery, regionalWarehouses, inQueryStr_1, data, i, _i, data_1, item, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        query = "\n            select\n            i.itemid as itemid,\n            bs.namealias as nameEn,\n            bs.itemname as nameAr,\n            to_char(SUM(i.qty), 'FM999,999,999D') as availability,\n            i.configid as configid,\n            i.inventsizeid as inventsizeid,\n            i.batchno as batchno,\n            case when qty>0 then abs(qty) else 0 end as \"qtyIn\",\n            case when qty<0 then abs(qty) else 0 end as \"qtyOut\",\n            i.inventlocationid as inventlocationid,\n            i.location as location,\n            w.name as \"WareHouseNameAr\", \n            w.namealias as \"WareHouseNameEn\",\n            to_char(b.expdate, 'yyyy-MM-dd') as batchexpdate,\n            sz.description as \"sizeNameEn\",\n            sz.name as \"sizeNameAr\"\n        from inventtrans  i\n        inner join inventlocation w on w.inventlocationid=i.inventlocationid\n        left join inventbatch b on i.batchno = b.inventbatchid\n        left join inventtable bs on i.itemid = bs.itemid\n        left join inventsize sz on sz.inventsizeid = i.inventsizeid and sz.itemid = i.itemid\n        where i.dateinvent >= '" + params.fromDate + "' ::date\n        AND  i.dateinvent < ('" + params.toDate + "' ::date + '1 day'::interval)";
                        if (!(params.key == "ALL")) return [3 /*break*/, 2];
                        warehouseQuery = "select regionalwarehouse from usergroupconfig where inventlocationid= '" + params.inventlocationid + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        regionalWarehouses = _a.sent();
                        inQueryStr_1 = "";
                        regionalWarehouses[0].regionalwarehouse.split(",").map(function (item) {
                            inQueryStr_1 += "'" + item + "',";
                        });
                        inQueryStr_1 += "'" + params.inventlocationid + "',";
                        query += " and i.inventlocationid in (" + inQueryStr_1.substr(0, inQueryStr_1.length - 1) + ") and (transactionclosed = true or transactionclosed is NULL) ";
                        return [3 /*break*/, 3];
                    case 2:
                        query += " and i.inventlocationid='" + params.key + "' and (transactionclosed = true or transactionclosed is NULL) ";
                        _a.label = 3;
                    case 3:
                        if (params.itemId) {
                            query = query + (" and i.itemid = '" + params.itemId + "'");
                        }
                        if (params.configId) {
                            query = query + (" and i.configid='" + params.configId + "'");
                        }
                        if (params.inventsizeid) {
                            query = query + (" and i.inventsizeid='" + params.inventsizeid + "'");
                        }
                        if (params.batchno) {
                            query = query + (" and i.batchno='" + params.batchno + "'");
                        }
                        query =
                            query +
                                " GROUP BY\n                    i.itemid,  i.configid, i.inventsizeid, i.batchno, i.qty, b.expdate, bs.namealias, bs.itemname, sz.name, sz.description, i.inventlocationid, w.name, w.namealias, i.location";
                        return [4 /*yield*/, this.db.query(query)];
                    case 4:
                        data = _a.sent();
                        i = 1;
                        data = data.filter(function (item) { return item.availability > 0; });
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            item = data_1[_i];
                            item.sNo = i;
                            i += 1;
                        }
                        result = {
                            printDate: new Date().toLocaleString(),
                            data: data,
                            user: params.user
                        };
                        return [2 /*return*/, result];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ItemBalanceReport.prototype.warehouseName = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid ='" + param + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? data[0] : {}];
                }
            });
        });
    };
    ItemBalanceReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                // console.log(result.salesLine[0].product.nameEnglish);
                renderData = result;
                renderData.fromDate = params.fromDate;
                renderData.toDate = params.toDate;
                renderData.inventlocationid = params.inventlocationid;
                if (params.type == "excel") {
                    file = params.lang == "en" ? "itembalance-excel" : "itembalance-excel-ar";
                }
                else {
                    file = params.lang == "en" ? "itembalance-report" : "itembalance-report-ar";
                }
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
    return ItemBalanceReport;
}());
exports.ItemBalanceReport = ItemBalanceReport;
