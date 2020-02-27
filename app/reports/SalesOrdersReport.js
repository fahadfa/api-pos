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
var SalesOrdersReport = /** @class */ (function () {
    function SalesOrdersReport() {
        this.db = typeorm_1.getManager();
    }
    SalesOrdersReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var data, query, warehouseQuery, regionalWarehouses, inQueryStr_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        data = void 0;
                        query = "\n            select \n            distinct\n            s.salesid as \"salesId\",\n            s.dimension6_ as \"salesManId\",\n            s.inventlocationid as \"fromWareHouse\",\n            s.custaccount as \"custaccount\",\n            to_char(s.createddatetime, 'DD-MM-YYYY') as \"createddatetime\",\n            to_char(s.lastmodifieddate, 'DD-MM-YYYY') as \"lastmodifieddate\",\n            s.status as status,\n            to_char(s.disc , 'FM999999999990.000') as discount,\n            s.salesname as name,\n            s.salesname as \"nameAlias\",\n            to_char(s.amount , 'FM999999999990.000') as \"netAmount\",\n            to_char(s.netamount , 'FM999999999990.000') as \"grossAmount\",\n            to_char(s.vatamount , 'FM999999999990.000') as \"vatAmount\",\n            w.name as \"wareHouseNameAr\",\n            w.namealias as \"wareHouseNameEn\",\n            s.payment as \"paymentMode\",\n            c.walkincustomer as \"walkincustomer\",\n            s.mobileno as phone,\n            s.createddatetime,\n            coalesce(s.deliveryaddress, '') || coalesce(s.citycode, '') || coalesce(s.districtcode, '') || coalesce(s.country_code, '') as deliveryaddress,\n            d.\"name\" as salesman\n            from salestable s\n            left join inventlocation w on w.inventlocationid=s.inventlocationid\n            left join custtable c on c.accountnum=s.custaccount\n            left join dimensions d on d.num = s.dimension6_\n            where s.transkind = 'SALESORDER' \n            and s.createddatetime >= '" + params.fromDate + "' ::date\n            AND  s.createddatetime < ('" + params.toDate + "' ::date + '1 day'::interval) \n            ";
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
                        query += " and s.inventlocationid in (" + inQueryStr_1.substr(0, inQueryStr_1.length - 1) + ") ";
                        return [3 /*break*/, 3];
                    case 2:
                        query += " and s.inventlocationid='" + params.inventlocationid + "' ";
                        _a.label = 3;
                    case 3:
                        if (params.status != "ALL") {
                            query += " and  s.status = '" + params.status + "' ";
                        }
                        if (params.accountnum) {
                            query += " and s.custaccount = '" + params.accountnum + "'";
                        }
                        query += " order by s.createddatetime DESC";
                        return [4 /*yield*/, this.db.query(query)];
                    case 4:
                        data = _a.sent();
                        data.map(function (v) {
                            v.discount = v.discount ? v.discount : 0;
                        });
                        // console.log("salesorders  ", data);
                        return [2 /*return*/, data];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SalesOrdersReport.prototype.warehouseName = function (param) {
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
    SalesOrdersReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                renderData = {
                    printDate: new Date().toLocaleString(),
                    fromDate: params.fromDate,
                    toDate: params.toDate,
                    status: params.status,
                    user: params.user
                };
                // renderData.total = 0;
                renderData.grossAmount = 0;
                renderData.discount = 0;
                renderData.vatAmount = 0;
                renderData.netAmount = 0;
                result.map(function (v) {
                    renderData.grossAmount += parseFloat(v.grossAmount);
                    renderData.discount += parseFloat(v.discount);
                    renderData.vatAmount += parseFloat(v.vatAmount);
                    renderData.netAmount += parseFloat(v.netAmount);
                });
                renderData.grossAmount = renderData.grossAmount.toFixed(3);
                renderData.discount = renderData.discount.toFixed(3);
                renderData.vatAmount = renderData.vatAmount.toFixed(3);
                renderData.netAmount = renderData.netAmount.toFixed(3);
                // console.log(result.salesLine[0].product.nameEnglish);
                renderData.data = result;
                console.log(renderData);
                if (params.type == "excel") {
                    file = params.lang == "en" ? "salesorder-excel" : "salesorder-excel-ar";
                }
                else {
                    file = params.lang == "en" ? "salesorder-report" : "salesorder-report-ar";
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
    return SalesOrdersReport;
}());
exports.SalesOrdersReport = SalesOrdersReport;
