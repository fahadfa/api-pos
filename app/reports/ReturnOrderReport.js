"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var RawQuery_1 = require("../common/RawQuery");
var InventTransDAO_1 = require("../repos/InventTransDAO");
var UpdateInventoryService_1 = require("../services/UpdateInventoryService");
var SalesLineDAO_1 = require("../repos/SalesLineDAO");
var ReturnOrderReport = /** @class */ (function () {
    function ReturnOrderReport() {
        this.db = typeorm_1.getManager();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.inventTransDAO = new InventTransDAO_1.InventorytransDAO();
        this.updateInventoryService = new UpdateInventoryService_1.UpdateInventoryService();
        this.salesLineDAO = new SalesLineDAO_1.SalesLineDAO();
    }
    ReturnOrderReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var data_1, query, batchesQuery, batches, result, new_data_1, i_1, salesQuery, salesLine, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        query = "\n            select \n                distinct\n                s.salesid as \"salesId\",\n                s.inventlocationid as \"fromWareHouse\",\n                s.custaccount as \"custaccount\",\n                s.createddatetime as \"ReturnDate\",\n                s.lastmodifieddate as \"lastModifiedDate\",\n                s.status as status,\n                s.salesname as name,\n                to_char(s.disc, 'FM999999999990.000')  as discount,\n                s.mobileno as phone,\n                to_char(s.amount , 'FM999999999990.000') as \"grossAmount\",\n                to_char(s.netamount, 'FM999999999990.000') as \"netAmount\",\n                to_char(s.vatamount,  'FM999999999990.000') as \"vatAmount\",\n                s.originalprinted as \"originalPrinted\",\n                s.createdby as \"createdBy\",\n                s.intercompanyoriginalsalesid as \"salesOrderId\",\n                w.name as \"wareHouseNameAr\",\n                w.namealias as \"wareHouseNameEn\",\n                d.\"description\" as salesman,\n                to_char(s.createddatetime, 'DD-MM-YYYY') as createddatetime\n                from salestable s\n                left join inventlocation w on w.inventlocationid=s.inventlocationid\n                left join custtable c on c.accountnum=s.custaccount\n                left join dimensions d on d.num = s.dimension6_\n            where s.transkind = 'RETURNORDER' and s.salesid = '" + params.salesId + "' limit 1\n            ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data_1 = _a.sent();
                        data_1[0].originalPrinted = data_1[0].originalPrinted == null ? false : data_1[0].originalPrinted;
                        data_1[0].vatAmount = Math.round(parseFloat((data_1[0].vatAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                        data_1[0].ReturnDate = new Date(data_1[0].ReturnDate).toLocaleDateString();
                        if (data_1[0].originalPrinted) {
                            data_1[0].isCopy = true;
                        }
                        else {
                            data_1[0].isCopy = false;
                        }
                        batchesQuery = "select \n            distinct\n            i.itemid as itemid,\n            bs.name_en as nameEn,\n            bs.name_ar as nameAr,\n            to_char(i.qty, 'FM999,999,999,999D') as qty,\n            i.configid as configid,\n            i.inventsizeid as inventsizeid,\n            i.invoiceid as invoiceid,\n            i.transrefid as transrefid,\n            s.name_en as sizenameen,\n            s.name_ar as sizenamear,\n            i.batchno as batchno,\n            b.expdate as batchExpDate,\n            b.expdate as batchExpDate,\n            sl.salesprice as price,\n            sl.lineamount as \"lineAmount\",\n            sl.vatamount as \"vatAmount\"\n            from inventtrans  i\n        left join salesline sl on sl.id = i.sales_line_id\n        left join inventbatch b on i.batchno = b.inventbatchid\n        left join bases bs on i.itemid = bs.code\n        left join sizes s on s.code = i.inventsizeid\n        where   i.invoiceid = '" + params.salesId + "'";
                        return [4 /*yield*/, this.db.query(batchesQuery)];
                    case 2:
                        batches = _a.sent();
                        result = this.groupBy(batches, function (item) {
                            return [item.itemid, item.batchno, item.configid, item.inventsizeid];
                        });
                        new_data_1 = [];
                        result.forEach(function (groupitem) {
                            var qty = groupitem.reduce(function (res, item) { return res + parseInt(item.qty); }, 0);
                            if (qty > 0) {
                                groupitem[0].qty = Math.abs(qty);
                                groupitem[0].returnQuantity = 0;
                                new_data_1.push(__assign({}, groupitem[0]));
                            }
                        });
                        i_1 = 1;
                        new_data_1.forEach(function (element) {
                            element.sNo = i_1;
                            element.price = Math.round(parseFloat((element.price * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                            element.lineAmount =
                                Math.round(parseFloat((element.lineAmount * Math.pow(10, 2)).toFixed(2))) / Math.pow(10, 2);
                            i_1++;
                        });
                        data_1[0].batches = new_data_1;
                        this.db.query(" update inventtrans set transactionclosed = true where invoiceid='" + params.salesId + "'");
                        // if (data[0].status != "POSTED") {
                        // this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED");
                        // let batches: any = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
                        // for (let item of batches) {
                        //   item.transactionClosed = true;
                        //   // this.inventTransDAO.save(item);
                        //   this.updateInventoryService.updateInventtransTable(item);
                        // }
                        return [4 /*yield*/, this.updateSalesLineData(params.salesId)];
                    case 3:
                        // if (data[0].status != "POSTED") {
                        // this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED");
                        // let batches: any = await this.inventTransDAO.findAll({ invoiceid: params.salesId });
                        // for (let item of batches) {
                        //   item.transactionClosed = true;
                        //   // this.inventTransDAO.save(item);
                        //   this.updateInventoryService.updateInventtransTable(item);
                        // }
                        _a.sent();
                        salesQuery = "\n      select\n            distinct\n            ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As \"sNo\",\n            ln.salesid,\n            ln.itemid,\n            ln.batchno,\n            ln.configid,\n            ln.inventsizeid,\n            cast(ln.salesqty as decimal(10,2)) as \"salesQty\",\n            cast(ln.salesprice as decimal(10,2)) as salesprice,\n            cast(ln.vatamount as decimal(10,2)) as \"vatAmount\",\n            cast(ln.linetotaldisc as decimal(10,2)) as \"lineTotalDisc\",\n            cast(ln.colorantprice as decimal(10,2)) as colorantprice,\n            cast(((ln.salesprice + ln.colorantprice) \n            + (ln.vatamount) - (ln.linetotaldisc)) \n            as decimal(10,2)) as \"lineAmount\",\n            ln.prodnamear as \"prodNameAr\",\n            ln.prodnameen as \"prodNameEn\",\n            ln.colNameAr as \"colNameAr\",\n            ln.colNameEn as \"colNameEn\",\n            ln.sizeNameEn as \"sizeNameEn\",\n            ln.sizeNameAr as \"sizeNameAr\",\n            cast(ln.lineamount - ln.linetotaldisc as decimal(10,2)) as \"lineAmountBeforeVat\",\n            ln.vat as vat,\n            ln.colorantid as colorant\n            from\n            (\n              select\n              i.invoiceid as salesid,\n              i.batchno,\n              i.itemid,\n              i.configid,\n              i.inventsizeid,\n              st.status as status,\n              ABS(i.qty) as salesqty,\n              b.itemname as prodnamear,\n              b.namealias as prodnameen,\n              coalesce(sl.salesprice, 0)  as salesprice,\n              coalesce(sl.vatamount, 0)  as vatamount,\n              coalesce(sl.linetotaldisc, 0) as linetotaldisc,\n              coalesce(sl.colorantprice,0) as colorantprice,\n              c.name as colNameAr,\n              c.name as colNameEn,\n              s.description as sizeNameEn,\n              s.name as sizeNameAr,\n              sl.lineamount + (sl.colorantprice * sl.salesqty) as  lineamount,\n              sl.colorantid as  colorantid,\n              sl.vat as vat,\n              sl.linenum\n              from inventtrans i\n              left join salestable st on st.salesid = i.invoiceid\n              left join salesline sl on sl.id = i.sales_line_id\n              left join inventtable b on i.itemid=b.itemid\n              left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid\n              left join configtable c on c.configid = i.configid and c.itemid = i.itemid\n            where invoiceid='" + params.salesId + "'\n            ) as ln\n      \n      ";
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 4:
                        salesLine = _a.sent();
                        data_1 = data_1.length > 0 ? data_1[0] : {};
                        data_1.salesLine = salesLine;
                        data_1.quantity = 0;
                        data_1.salesLine.map(function (v) {
                            data_1.quantity += parseInt(v.salesQty);
                        });
                        return [2 /*return*/, data_1];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ReturnOrderReport.prototype.groupBy = function (array, f) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        });
    };
    ReturnOrderReport.prototype.updateSalesLineData = function (returnOrderId) {
        return __awaiter(this, void 0, void 0, function () {
            var returnOrderlLinesQuery, returnOrderLines, _i, returnOrderLines_1, v, salesline;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        returnOrderlLinesQuery = "select \n                                                s.intercompanyoriginalsalesid as salesorderid, \n                                                sl.lineamount as lineamount, \n                                                sl.colorantprice colorantprice,\n                                                sl.salesqty as salesqty, \n                                                sl.itemid as itemid, \n                                                sl.configid as configid, \n                                                sl.inventsizeid as inventsizeid, \n                                                sl.linetotaldisc as linetotaldisc, \n                                                sl.vatamount as vatamount,\n                                                sl.is_item_free as isitemfree,\n                                                sl.applied_discounts as applied_discounts,\n                                                sl.remainsalesfinancial as remainsalesfinancial\n                                                from salesline sl\n                                                inner join salestable s on s.salesid = sl.salesid \n                                                where sl.salesid= '" + returnOrderId + "'\n                                                ";
                        return [4 /*yield*/, this.db.query(returnOrderlLinesQuery)];
                    case 1:
                        returnOrderLines = _a.sent();
                        _i = 0, returnOrderLines_1 = returnOrderLines;
                        _a.label = 2;
                    case 2:
                        if (!(_i < returnOrderLines_1.length)) return [3 /*break*/, 6];
                        v = returnOrderLines_1[_i];
                        return [4 /*yield*/, this.salesLineDAO.findOne({
                                isItemFree: v.isitemfree,
                                itemid: v.itemid,
                                configId: v.configid,
                                inventsizeid: v.inventsizeid,
                                salesId: v.salesorderid
                            })];
                    case 3:
                        salesline = _a.sent();
                        console.log(salesline);
                        salesline.totalReturnedQuantity = parseInt(salesline.totalReturnedQuantity) + parseInt(v.salesqty);
                        salesline.totalSettledAmount =
                            parseFloat(salesline.totalSettledAmount) +
                                parseFloat(v.lineamount) -
                                parseFloat(v.linetotaldisc) +
                                parseFloat(v.vatamount);
                        salesline.lastModifiedDate = new Date();
                        salesline.remainSalesFinancial = salesline.remainSalesFinancial ? parseInt(salesline.remainSalesFinancial) + parseInt(v.remainsalesfinancial) : parseInt(v.remainsalesfinancial);
                        return [4 /*yield*/, this.salesLineDAO.save(salesline)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ReturnOrderReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                renderData = result;
                file = params.lang == "en" ? "ro-en" : "ro-ar";
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
    return ReturnOrderReport;
}());
exports.ReturnOrderReport = ReturnOrderReport;
