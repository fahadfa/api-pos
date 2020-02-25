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
var itemTransactionsReport = /** @class */ (function () {
    function itemTransactionsReport() {
        this.db = typeorm_1.getManager();
    }
    itemTransactionsReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var data, query, warehouseQuery, regionalWarehouses, inQueryStr_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        data = void 0;
                        query = "\n            select \n            distinct\n            i.salesid as \"salesId\",\n            i.itemid as itemid, \n            i.configid as configid, \n            to_char(sum(qtyin), 'FM999,999,999D') as \"qtyIn\", \n            to_char(sum(qtyout), 'FM999,999,999D') as \"qtyOut\", \n            to_char((sum(qtyin)-sum(qtyout)), 'FM999,999,999D') as balance,\n            i.inventsizeid as inventsizeid,\n            sizenameen,\n            sizenamear,\n            nameEn,\n            nameAr,\n            i.transtype as \"transType\",\n            wareHouseNameAr as \"wareHouseNameAr\",\n            wareHouseNameEn as \"wareHouseNameEn\",\n           i.lastmodifieddate as \"lastModifiedDate\",\n            i.batchno as batchno from (\n            select \n            distinct\n            i.itemid as itemid,\n            coalesce(case when i.qty > 0 then sum(i.qty) end, 0) as qtyin,\n            coalesce(case when i.qty < 0 then sum(i.qty) end, 0) as qtyout,\n            i.configid as configid,\n            i.inventsizeid as inventsizeid,\n            i.invoiceid as salesid,\n            i.batchno as batchno,\n            s.description as sizenameen,\n            s.name as sizenamear,\n            bs.namealias as nameEn,\n            bs.itemname as nameAr,\n            w.name as wareHouseNameAr,\n            w.namealias as wareHouseNameEn,\n            i.datestatus as datestatus,\n            st.transkind as transtype,\n            to_char(st.lastmodifieddate, 'DD-MM-YYYY') as lastmodifieddate\n            from inventtrans  i\n            left join inventbatch b on i.batchno = b.inventbatchid\n            left join inventtable bs on i.itemid = bs.itemid\n            left join inventsize s on s.inventsizeid = i.inventsizeid and s.itemid = i.itemid\n            left join salesline sl on sl.id = i.sales_line_id\n            left join salestable st on st.salesid = i.invoiceid \n            left join inventlocation w on w.inventlocationid=i.inventlocationid\n             where ((reserve_status!='UNRESERVED' AND reserve_status != 'SAVED') or reserve_status is null) and\n            sl.createddatetime >= '" + params.fromDate + "' ::date\n            AND  sl.createddatetime < ('" + params.toDate + "' ::date + '1 day'::interval) and i.transactionclosed = true ";
                        if (!(params.inventlocationid == "ALL")) return [3 /*break*/, 2];
                        warehouseQuery = "select regionalwarehouse from usergroupconfig where inventlocationid= '" + params.key + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        regionalWarehouses = _a.sent();
                        inQueryStr_1 = "";
                        regionalWarehouses[0].regionalwarehouse.split(",").map(function (item) {
                            inQueryStr_1 += "'" + item + "',";
                        });
                        inQueryStr_1 += "'" + params.key + "',";
                        query += " and i.inventlocationid in (" + inQueryStr_1.substr(0, inQueryStr_1.length - 1) + ") ";
                        return [3 /*break*/, 3];
                    case 2:
                        query += " and i.inventlocationid='" + params.inventlocationid + "' ";
                        _a.label = 3;
                    case 3:
                        if (params.status && params.status != "ALL") {
                            query += " and  i.reserve_status = '" + params.status + "' ";
                        }
                        if (params.color) {
                            query += " and  i.configid = '" + params.color + "' ";
                        }
                        if (params.product) {
                            query += " and  i.itemid = '" + params.product + "' ";
                        }
                        if (params.transType && params.transType != "ALL") {
                            query += " and  st.transkind = '" + params.transType + "' ";
                        }
                        if (params.batchNo) {
                            query += " and  i.batchno = '" + params.batchNo + "' ";
                        }
                        if (params.inventsizeid) {
                            query += " and  i.batchno = '" + params.inventsizeid + "' ";
                        }
                        query += " group by i.itemid, i.qty,\n            i.inventsizeid, i.configid,  i.batchno, b.expdate, s.description, s.name, bs.itemname, bs.namealias, i.datestatus, w.name, w.namealias, i.invoiceid, st.transkind, st.lastmodifieddate\n            ) as i\n            \n              group by i.itemid, \n            i.inventsizeid, i.configid,  i.batchno, sizenameen, sizenamear, nameEn,nameAr, i.datestatus, wareHouseNameAr, wareHouseNameEn, salesid, i.transtype, i.lastmodifieddate ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 4:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    itemTransactionsReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                renderData = {
                    printDate: new Date().toLocaleString(),
                    fromDate: params.fromDate,
                    toDate: params.toDate,
                    status: params.status,
                    transType: params.transType,
                    batchNo: params.batchNo,
                    product: params.product ? params.product : "ALL",
                    color: params.color,
                    user: params.user
                };
                renderData.qtyIn = 0;
                renderData.qtyOut = 0;
                renderData.balance = 0;
                result.map(function (v) {
                    renderData.qtyIn += parseFloat(v.qtyIn);
                    renderData.qtyOut += parseFloat(v.qtyOut);
                    renderData.balance += parseFloat(v.balance);
                });
                // console.log(result.salesLine[0].product.nameEnglish);
                renderData.data = result;
                console.log('--------------------------');
                console.log(renderData);
                console.log('--------------------------');
                if (params.type == "excel") {
                    file = params.lang == "en" ? "itemtransactions-excel" : "itemtransactions-excel-ar";
                }
                else {
                    file = params.lang == "en" ? "itemtransactions-report" : "itemtransactions-report-ar";
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
    return itemTransactionsReport;
}());
exports.itemTransactionsReport = itemTransactionsReport;
