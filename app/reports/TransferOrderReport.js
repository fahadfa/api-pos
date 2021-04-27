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
var QuotationReport_1 = require("./QuotationReport");
var SalesTableDAO_1 = require("../repos/SalesTableDAO");
var RawQuery_1 = require("../common/RawQuery");
var CusttableDAO_1 = require("../repos/CusttableDAO");
var QRCode = require("qrcode");
var TransferOrderReport = /** @class */ (function () {
    function TransferOrderReport() {
        this.db = typeorm_1.getManager();
        this.salesTableService = new SalesTableService_1.SalesTableService();
        this.quoatationReport = new QuotationReport_1.QuotationReport();
        this.salesTableService = new SalesTableService_1.SalesTableService();
        this.salestableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.custtableDAO = new CusttableDAO_1.CusttableDAO();
    }
    TransferOrderReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, status_1, data_1, shipOrderData, salesLine, quantity_1, sNo_1, saleslines, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log("TransferOrderReport");
                        id = params.salesId;
                        return [4 /*yield*/, this.query_to_data(id)];
                    case 1:
                        data_1 = _a.sent();
                        data_1 = data_1.length >= 0 ? data_1[0] : {};
                        data_1.originalPrinted = data_1.originalPrinted ? data_1.originalPrinted : false;
                        return [4 /*yield*/, this.db.query("select salesid, custaccount,transkind, inventlocationid from salestable where intercompanyoriginalsalesid = '" + id + "'")];
                    case 2:
                        shipOrderData = _a.sent();
                        console.log(shipOrderData);
                        // shipOrderData = shipOrderData.length > 0 ? shipOrderData[0] : null
                        if (data_1.status != "POSTED" && shipOrderData.length != 0) {
                            this.rawQuery.updateSalesTable(params.salesId.toUpperCase(), "POSTED", new Date().toISOString());
                        }
                        console.log(data_1);
                        return [4 /*yield*/, this.salesline_query_to_data(id)];
                    case 3:
                        salesLine = _a.sent();
                        quantity_1 = 0;
                        sNo_1 = 1;
                        salesLine.map(function (v) {
                            v.sNo = sNo_1;
                            v.salesQty = parseInt(v.salesQty);
                            quantity_1 += parseInt(v.salesQty);
                            sNo_1 += 1;
                        });
                        return [4 /*yield*/, this.chunkArray(salesLine, 12)];
                    case 4:
                        saleslines = _a.sent();
                        data_1.salesLine = saleslines.map(function (v) {
                            var salesLine = {};
                            salesLine.salesLine = v;
                            salesLine.quantity = 0;
                            salesLine.salesId = data_1.salesId;
                            salesLine.custAccount = data_1.custAccount;
                            salesLine.status = data_1.status;
                            salesLine.statusEn = data_1.statusEn;
                            salesLine.statusAr = data_1.statusAr;
                            salesLine.transkindEn = data_1.transkindEn;
                            salesLine.transkindAr = data_1.transkindAr;
                            salesLine.transkind = data_1.transkind;
                            salesLine.vatamount = data_1.vatamount;
                            salesLine.netAmount = data_1.netAmount;
                            salesLine.disc = data_1.disc;
                            salesLine.notes = data_1.notes;
                            salesLine.amount = data_1.amount;
                            salesLine.createddatetime = data_1.createddatetime;
                            salesLine.lastmodifieddate = data_1.lastmodifieddate;
                            salesLine.originalPrinted = data_1.originalPrinted;
                            salesLine.inventLocationId = data_1.inventLocationId;
                            salesLine.fwnamealias = data_1.fwnamealias;
                            salesLine.fwname = data_1.fwname;
                            salesLine.twnamealias = data_1.twnamealias;
                            salesLine.twname = data_1.twname;
                            salesLine.interCompanyOriginalSalesId = data_1.interCompanyOriginalSalesId;
                            v.forEach(function (element) {
                                element.salesQty = parseInt(element.salesQty);
                                salesLine.quantity += element.salesQty;
                            });
                            return salesLine;
                        });
                        // salesLine = salesLine.length > 0 ? salesLine : [];
                        // data.salesLine = salesLine;
                        // data.quantity = 0;
                        console.log(data_1);
                        // data.qr =  await QRCode.toDataURL(JSON.stringify(data));
                        return [2 /*return*/, data_1];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    TransferOrderReport.prototype.warehouseName = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid ='" + param + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.length > 0 ? data[0] : {}];
                }
            });
        });
    };
    TransferOrderReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, file;
            return __generator(this, function (_a) {
                // console.log(result.salesLine[0].product.nameEnglish);
                renderData = result;
                console.log(renderData);
                file = params.lang == "en" ? "to-en" : "to-ar";
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
    TransferOrderReport.prototype.query_to_data = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            select \n              st.salesid as \"salesId\",\n              st.custaccount as \"custAccount\",\n              st.status as status,\n              als.en as \"statusEn\",\n              als.ar as \"statusAr\",              \n              alt.en as \"transkindEn\",\n              alt.ar as \"transkindAr\", \n              st.transkind as transkind,\n              st.vatamount as vatamount,\n              st.netamount as \"netAmount\",\n              st.disc as disc,\n              st.description as notes,\n              amount as amount,\n              to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,\n              to_char(st.lastmodifieddate, 'DD-MM-YYYY') as lastmodifieddate,\n              st.originalprinted as \"originalPrinted\",\n              st.inventlocationid as \"inventLocationId\",\n              fw.namealias as fwnamealias,\n              fw.name as fwname,\n              tw.namealias as twnamealias,\n              tw.name as twname,\n              st.intercompanyoriginalsalesId as \"interCompanyOriginalSalesId\"\n            from salestable st \n              left join inventlocation fw on fw.inventlocationid = st.inventlocationid\n              left join inventlocation tw on tw.inventlocationid = st.custaccount            \n              left join app_lang als on als.id = st.status\n              left join app_lang alt on alt.id = st.transkind\n            where salesid='" + id + "'\n            ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TransferOrderReport.prototype.salesline_query_to_data = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var salesQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salesQuery = "\n            select\n            distinct on (ln.id)\n            ln.itemid as itemid,\n            ln.inventsizeid as inventsizeid,\n            ln.configid as configid,\n            ln.colorantid,\n            ln.salesqty as \"salesQty\",\n            b.itemname as \"prodNameAr\",\n            b.namealias as \"prodNameEn\",\n            c.name as \"colNameAr\",\n            c.name as \"colNameEn\",\n            s.description as \"sizeNameEn\",\n            s.name as \"sizeNameAr\"\n            from salesline ln\n            inner join inventtable b on b.itemid = ln.itemid\n            inner join configtable c on c.configid = ln.configid and c.itemid = ln.itemid\n            inner join inventsize s on s.inventsizeid=ln.inventsizeid and s.itemid = ln.itemid\n            where ln.salesid = '" + id + "'\n            ";
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TransferOrderReport.prototype.chunkArray = function (myArray, chunk_size) {
        return __awaiter(this, void 0, void 0, function () {
            var index, arrayLength, tempArray, myChunk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = 0;
                        arrayLength = myArray.length;
                        tempArray = [];
                        for (index = 0; index < arrayLength; index += chunk_size) {
                            myChunk = myArray.slice(index, index + chunk_size);
                            // Do something if you want with the group
                            tempArray.push(myChunk);
                        }
                        return [4 /*yield*/, tempArray];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TransferOrderReport;
}());
exports.TransferOrderReport = TransferOrderReport;
