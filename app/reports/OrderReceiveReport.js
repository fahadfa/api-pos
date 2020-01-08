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
            var id, status_1, query, data, salesQuery, salesLine, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        id = params.salesId;
                        query = "\n            select \n            st.salesid as \"salesId\",\n            st.custaccount as \"custAccount\",\n            st.status as status,\n            st.transkind as transkind,\n            st.vatamount as vatamount,\n            st.netamount as \"netAmount\",\n            st.disc as disc,\n            amount as amount,\n            st.createddatetime as createddatetime,\n            st.originalprinted as \"originalPrinted\",\n            st.inventlocationid as \"inventLocationId\",\n            fw.namealias as fwnamealias,\n            fw.name as fwname,\n            tw.namealias as twnamealias,\n            tw.name as twname,\n            st.intercompanyoriginalsalesid as \"interCompanyOriginalSalesId\",\n            (select intercompanyoriginalsalesid from salestable where salesid = st.intercompanyoriginalsalesid limit 1) as transferid\n            from salestable st \n            left join inventlocation fw on fw.inventlocationid = st.inventlocationid\n            left join inventlocation tw on tw.inventlocationid = st.custaccount\n            where salesid='" + id + "'\n            ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        data = data.length >= 1 ? data[0] : {};
                        data.originalPrinted = data.originalPrinted ? data.originalPrinted : false;
                        if (data.originalPrinted == false && data.status == "RECEIVED") {
                            status_1 = "POSTED";
                            this.rawQuery.updateSalesTable(id.toUpperCase(), status_1);
                            data.isCopy = true;
                        }
                        else {
                            status_1 = "POSTED";
                            this.rawQuery.updateSalesTable(id.toUpperCase(), status_1);
                            data.isCopy = true;
                        }
                        salesQuery = "\n            select\n            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As \"sNo\",\n            ln.salesid,\n            ln.itemid,\n            ln.batchno,\n            ln.configid,\n            ln.inventsizeid,\n            ln.status,\n            cast(ln.salesqty as decimal(10,2)) as \"salesQty\",\n            cast(ln.salesprice as decimal(10,2)) as salesprice,\n            cast(ln.vatamount as decimal(10,2)) as \"vatAmount\",\n            cast(ln.linetotaldisc as decimal(10,2)) as \"lineTotalDisc\",\n            cast(ln.colorantprice as decimal(10,2)) as colorantprice,\n            cast(((ln.salesqty * (ln.salesprice + ln.colorantprice)) \n            + (ln.salesqty * ln.vatamount) - (ln.salesqty * ln.linetotaldisc)) \n            as decimal(10,2)) as \"lineAmount\",\n            ln.prodnamear as \"prodNameAr\",\n            ln.prodnameen as \"prodNameEn\",\n            ln.colNameAr as \"colNameAr\",\n            ln.colNameEn as \"colNameEn\",\n            ln.sizeNameEn as \"sizeNameEn\",\n            ln.sizeNameAr as \"sizeNameAr\"\n            from\n            (\n            select\n            i.invoiceid as salesid,\n            i.batchno,\n            i.itemid,\n            i.configid,\n            i.inventsizeid,\n            (\n            select status from salestable st\n            where st.salesid=i.invoiceid  limit 1\n            ) as status,\n            ABS(i.qty) as salesqty,\n            b.name_ar as prodnamear,\n            b.name_en as prodnameen,\n            (\n            select coalesce(sl.salesprice, 0) from salesline sl\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) as salesprice,\n            (\n            select coalesce(sl.vatamount, 0) from salesline sl\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) as vatamount,\n            (\n            select coalesce(sl.linetotaldisc, 0) from salesline sl\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) as linetotaldisc,\n            (\n            select coalesce(sl.colorantprice,0) from salesline sl\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) as colorantprice,\n            (\n            select c.name_ar from salesline sl\n            left join colors c on c.id=sl.colorid\n            where sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) colNameAr,\n            (\n            select c.name_en from salesline sl\n            left join colors c on c.id=sl.colorid\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) colNameEn,\n            (\n            select s.name_en from salesline sl\n            left join base_sizes bs on bs.id=sl.base_size_id\n            left join sizes s on s.id=bs.size_id\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) sizeNameEn,\n            (\n            select s.name_ar from salesline sl\n            left join base_sizes bs on bs.id=sl.base_size_id\n            left join sizes s on s.id=bs.size_id\n            where sl.salesid=i.invoiceid and sl.itemid=i.itemid and sl.configid = i.configid and sl.inventsizeid = i.inventsizeid limit 1\n            ) sizeNameAr\n            from inventtrans i\n            left join bases b on i.itemid=b.code\n            where invoiceid='" + id + "'\n            ) as ln\n            ";
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 2:
                        salesLine = _a.sent();
                        // salesLine = salesLine.length > 0 ? salesLine : [];
                        data.salesLine = salesLine;
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
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
                        return [2 /*return*/, data ? data[0] : {}];
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
    return OrderReceiveReport;
}());
exports.OrderReceiveReport = OrderReceiveReport;
