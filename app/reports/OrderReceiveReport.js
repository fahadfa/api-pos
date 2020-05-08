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
var InventTransDAO_1 = require("../repos/InventTransDAO");
var UpdateInventoryService_1 = require("../services/UpdateInventoryService");
var OrderReceiveReport = /** @class */ (function () {
    function OrderReceiveReport() {
        this.db = typeorm_1.getManager();
        this.salesTableService = new SalesTableService_1.SalesTableService();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.inventTransDAO = new InventTransDAO_1.InventorytransDAO();
        this.updateInventoryService = new UpdateInventoryService_1.UpdateInventoryService();
    }
    OrderReceiveReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, status_1, data_1, salesLine, batches, _i, batches_1, item, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        id = params.salesId;
                        return [4 /*yield*/, this.query_to_data(id)];
                    case 1:
                        data_1 = _a.sent();
                        data_1 = data_1.length >= 1 ? data_1[0] : {};
                        data_1.originalPrinted = data_1.originalPrinted ? data_1.originalPrinted : false;
                        return [4 /*yield*/, this.salesline_query_to_data(id)];
                    case 2:
                        salesLine = _a.sent();
                        // salesLine = salesLine.length > 0 ? salesLine : [];
                        data_1.salesLine = salesLine;
                        data_1.quantity = 0;
                        salesLine.map(function (v) {
                            data_1.quantity += parseInt(v.salesQty);
                        });
                        if (!(data_1.status != "POSTED")) return [3 /*break*/, 4];
                        this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED");
                        return [4 /*yield*/, this.inventTransDAO.findAll({ invoiceid: params.salesId })];
                    case 3:
                        batches = _a.sent();
                        for (_i = 0, batches_1 = batches; _i < batches_1.length; _i++) {
                            item = batches_1[_i];
                            item.transactionClosed = true;
                            // this.inventTransDAO.save(item);
                            this.updateInventoryService.updateInventtransTable(item);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, data_1];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OrderReceiveReport.prototype.warehouseName = function (param) {
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
    OrderReceiveReport.prototype.transferOrderId = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select intercompanyoriginalsalesid as transferid from salestable where salesid = '" + param + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.length > 0 ? data[0] : {}];
                }
            });
        });
    };
    OrderReceiveReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                // console.log(result.salesLine[0].product.nameEnglish);
                renderData = result;
                renderData.printDate = renderData.printDate = App_1.App.convertUTCDateToLocalDate(new Date(App_1.App.DateNow()), parseInt(params.timeZoneOffSet)).toLocaleString();
                console.log(params.lang);
                file = params.lang == "en" ? "or-en" : "or-ar";
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
    OrderReceiveReport.prototype.query_to_data = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            select \n            st.salesid as \"salesId\",\n            st.custaccount as \"custAccount\",\n            st.status as status,\n            st.transkind as transkind,\n            als.en as \"statusEn\",\n            als.ar as \"statusAr\",\n            alt.en as \"transkindEn\",\n            alt.ar as \"transkindAr\",\n            st.vatamount as vatamount,\n            st.netamount as \"netAmount\",\n            st.disc as disc,\n            amount as amount,\n            to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,\n            st.originalprinted as \"originalPrinted\",\n            st.inventlocationid as \"inventLocationId\",\n            fw.namealias as fwnamealias,\n            fw.name as fwname,\n            tw.namealias as twnamealias,\n            tw.name as twname,\n            st.intercompanyoriginalsalesid as \"interCompanyOriginalSalesId\",\n            (select intercompanyoriginalsalesid from salestable where salesid = st.intercompanyoriginalsalesid limit 1) as transferid\n            from salestable st \n            left join inventlocation fw on fw.inventlocationid = st.custaccount\n            left join inventlocation tw on tw.inventlocationid = st.inventlocationid\n            left join app_lang als on als.id = st.status\n            left join app_lang alt on alt.id = st.transkind\n            where salesid='" + id + "'\n            ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OrderReceiveReport.prototype.salesline_query_to_data = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var salesQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salesQuery = "\n            select\n            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As \"sNo\",\n            ln.salesid,\n            ln.itemid,\n            ln.batchno,\n            ln.configid,\n            ln.inventsizeid,\n            ln.status,\n            to_char(ln.salesqty, 'FM999,999,999,999D') as \"salesQty\",\n            ln.prodnamear as \"prodNameAr\",\n            ln.prodnameen as \"prodNameEn\",\n            ln.colNameAr as \"colNameAr\",\n            ln.colNameEn as \"colNameEn\",\n            ln.sizeNameEn as \"sizeNameEn\",\n            ln.sizeNameAr as \"sizeNameAr\"\n            from\n            (\n                select\n                i.invoiceid as salesid,\n                i.batchno,\n                i.itemid,\n                i.configid,\n                i.inventsizeid,\n                st.status as status,\n                ABS(i.qty) as salesqty,\n                b.itemname as prodnamear,\n                b.namealias as prodnameen,\n                c.name as colNameAr,\n                c.name as colNameEn,\n                s.description as sizeNameEn,\n                s.name as sizeNameAr,\n                sl.colorantid as  colorantid,\n                sl.linenum\n                from inventtrans i\n                left join salestable st on st.salesid = i.invoiceid\n                left join salesline sl on sl.id = i.sales_line_id\n                left join inventtable b on i.itemid=b.itemid\n                left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid\n                left join configtable c on c.configid = i.configid and c.itemid = i.itemid\n            where invoiceid='" + id + "'\n            ) as ln\n            ";
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return OrderReceiveReport;
}());
exports.OrderReceiveReport = OrderReceiveReport;
