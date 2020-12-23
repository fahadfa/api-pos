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
var RawQuery_1 = require("../common/RawQuery");
var App_1 = require("../../utils/App");
var Props_1 = require("../../constants/Props");
var axios = require("axios");
var HistoricalTransactionReport = /** @class */ (function () {
    function HistoricalTransactionReport() {
        this.db = typeorm_1.getManager();
        this.rawQuery = new RawQuery_1.RawQuery();
    }
    HistoricalTransactionReport.prototype.execute = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var id, data_1, salesLine, _a, list, j, chunkArray, olddata, salesTableFromAxpta, salesLinesFromAxpta, workFlowOrder, items, sizes, frominvloc_1, toinvloc_1, query, wquery, names_1, invlocation, from, to, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 14, , 15]);
                        id = params.salesId;
                        if (!id) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.query_to_data(id)];
                    case 1:
                        data_1 = _b.sent();
                        console.log("=========================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data_1);
                        if (!(data_1 && data_1.length > 0)) return [3 /*break*/, 7];
                        data_1 = data_1 && data_1.length > 0 ? data_1[0] : {};
                        data_1.lastmodifieddate = App_1.App.convertUTCDateToLocalDate(new Date(data_1.lastmodifieddate), params.timeZoneOffSet);
                        if (!(data_1.transkind == 'DESIGNERSERVICE' || data_1.transkind == 'DESIGNERSERVICERETURN')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.salesline_query_to_data_designer(id)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.salesline_query_to_data(id)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        salesLine = _a;
                        list = [];
                        j = 0;
                        return [4 /*yield*/, this.chunkArray(salesLine, 12)];
                    case 6:
                        chunkArray = _b.sent();
                        list = list.concat(chunkArray);
                        // console.log("Lines",salesLine)
                        data_1["salesLine"] = salesLine;
                        // data.salesLine.shippedDate = data.lastmodifieddate.split(",")[0];
                        data_1.quantity = 0;
                        data_1.salesLine.map(function (v, index) {
                            data_1.salesLine[index].sNo = index + 1;
                            var quan = data_1.transkind == "INVENTORYMOVEMENT" ? v.actualsalesqty = parseInt(v.actualsalesqty) : v.salesQty;
                            data_1.quantity += parseInt(quan);
                        });
                        data_1.disc = data_1.disc ? data_1.disc : 0;
                        data_1.vat = data_1.salesLine.length > 0 ? parseInt(data_1.salesLine[0].vat) : "-";
                        return [3 /*break*/, 11];
                    case 7: return [4 /*yield*/, this.oldDataUrl(params)];
                    case 8:
                        olddata = _b.sent();
                        data_1 = {};
                        salesTableFromAxpta = olddata.OrderTable && olddata.OrderTable.length > 0 ? olddata.OrderTable[0] : {};
                        salesLinesFromAxpta = olddata.OrderLine && olddata.OrderLine.length > 0 ? olddata.OrderLine : [];
                        data_1.salesId = salesTableFromAxpta.SALESID;
                        data_1.interCompanyOriginalSalesId = salesTableFromAxpta.INTERCOMPANYORIGINALSALESID;
                        data_1.custAccount = salesTableFromAxpta.CUSTACCOUNT;
                        data_1.invoiceAccount = salesTableFromAxpta.INVOICEACCOUNT;
                        data_1.status = "Printed";
                        workFlowOrder = Props_1.Props.WorkFlowNumsForOld[salesTableFromAxpta.SALESTYPE];
                        data_1.transkind = workFlowOrder ? workFlowOrder.type : "";
                        data_1.transkindEn = workFlowOrder ? workFlowOrder.en : "";
                        data_1.transkindAr = workFlowOrder ? workFlowOrder.ar : "";
                        // data.movementtype=salesTableFromAxpta.;
                        // data.movementtypear=salesTableFromAxpta.;
                        data_1.customername = salesTableFromAxpta.SALESNAME;
                        // data.custmobilenumber=salesTableFromAxpta.;
                        data_1.vatamount = salesTableFromAxpta.SumTax;
                        data_1.netAmount = salesTableFromAxpta.NETAMOUNT;
                        data_1.disc = salesTableFromAxpta.DISC;
                        data_1.amount = salesTableFromAxpta.AMOUNT;
                        // data.shippingAmount=salesTableFromAxpta.;
                        data_1.shippingDate = salesTableFromAxpta.SHIPPINGDATECONFIRMED;
                        // data.cname=salesTableFromAxpta.;
                        // data.cnamealias=salesTableFromAxpta.;
                        // data.voucherdiscchecked=salesTableFromAxpta.;
                        data_1.vouchernum = salesTableFromAxpta.VOUCHERNUM;
                        data_1.paymentType = salesTableFromAxpta.PAYMENT;
                        // data.cphone=salesTableFromAxpta.
                        data_1.createddatetime = salesTableFromAxpta.CREATEDDATETIME;
                        // data.lastmodifieddate=salesTableFromAxpta.
                        data_1.originalPrinted = true;
                        data_1.inventLocationId = salesLinesFromAxpta && salesLinesFromAxpta.length > 0 ?
                            salesLinesFromAxpta[0].INVENTLOCATIONID : "";
                        // data.wnamealias=salesTableFromAxpta.
                        // data.wname=salesTableFromAxpta.
                        // data.twnamealias=salesTableFromAxpta.
                        // data.twname=salesTableFromAxpta.
                        data_1.paymentMode = salesTableFromAxpta.PAYMENT;
                        // data.iscash=salesTableFromAxpta.
                        data_1.createdby = salesTableFromAxpta.CREATEDBY;
                        // data.notes=salesTableFromAxpta.
                        // data.cashAmount=salesTableFromAxpta.
                        // data.cardAmount=salesTableFromAxpta.
                        // data.onlineAmount=salesTableFromAxpta.
                        // data.designServiceRedeemAmount=salesTableFromAxpta.
                        data_1.redeemAmount = salesTableFromAxpta.REDEEMAMT;
                        data_1.deliveryaddress = salesTableFromAxpta.DELIVERYADDRESS;
                        data_1.salesman = salesTableFromAxpta.SALESNAME;
                        data_1.deliveryDate = salesTableFromAxpta.DELIVERYDATE;
                        data_1.salesLine = [{}, {}];
                        if (!(salesLinesFromAxpta && salesLinesFromAxpta.length > 0)) return [3 /*break*/, 11];
                        items = salesLinesFromAxpta.map(function (d) { return "'" + d.ITEMID + "'"; }).join(",");
                        sizes = salesLinesFromAxpta.map(function (d) { return "'" + d.CONFIGID + "'"; }).join(",");
                        frominvloc_1 = salesLinesFromAxpta[0].INVENTLOCATIONID;
                        toinvloc_1 = salesLinesFromAxpta[0].CUSTACCOUNT;
                        query = "select distinct on (i.id, i.itemid, i.configid, i.inventsizeid, i.batchno)\n                        b.itemid,i.configid ,b.itemname as prodnamear,\n                        b.namealias as prodnameen,\n                        s.description as sizeNameEn,\n                        s.name as sizeNameAr\n                        from inventtrans i\n                        left join inventtable b on i.itemid=b.itemid\n                        left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid\n                        left join configtable c on c.configid = i.configid and c.itemid = i.itemid\n                        where i.itemid in(" + items + ") and i.configid in(" + sizes + ")";
                        wquery = "select i.inventlocationid,i.namealias as wnamealias,i.\"name\" as wname from inventlocation i where i.inventlocationid in('" + frominvloc_1 + "','" + toinvloc_1 + "');";
                        console.log(wquery);
                        return [4 /*yield*/, this.db.query(query)];
                    case 9:
                        names_1 = _b.sent();
                        return [4 /*yield*/, this.db.query(wquery)];
                    case 10:
                        invlocation = _b.sent();
                        // console.log(items);
                        // console.log(names);
                        // console.log("===================names====================");
                        salesLinesFromAxpta.sort(function (a, b) { return a.LINENUM - b.LINENUM; });
                        data_1.salesLine = salesLinesFromAxpta.map(function (item, index) {
                            var line = {};
                            line.salesid = item.SALESID;
                            line.actualsalesqty = parseInt(item.SALESQTY);
                            line.itemid = item.ITEMID;
                            line.batchno = item.BATCHNO;
                            line.configid = item.CONFIGID;
                            line.inventsizeid = item.INVENTSIZEID;
                            line.saleslineqty = item.SALESQTY;
                            line.netAmount = item.LINEAMOUNT;
                            // line.shippingDate=item.
                            line.salesQty = item.SALESQTY;
                            line.salesprice = item.SALESPRICE;
                            line.vatAmount = item.LineSalesTax;
                            line.lineTotalDisc = item.LINEDISCAMT;
                            line.colorantprice = 0;
                            // line.lineAmount=line.LINEAMOUNT;
                            line.lineAmount = item.NetAmtTax;
                            line.linetotaldisc = item.LineTotalDisc;
                            var product = names_1.find(function (prod) { return prod.itemid == line.itemid && prod.configid == line.configid; });
                            console.table(product);
                            line.prodNameAr = product.prodnamear;
                            line.prodNameEn = product.prodnameen;
                            // line.colNameAr=product.sizenameen
                            // line.colNameEn=item.
                            line.sizeNameEn = product.sizenameen;
                            line.sizeNameAr = product.sizenamear;
                            line.lineAmountBeforeVat = ((item.LINEAMOUNT / line.saleslineqty) * line.salesQty + (line.colorantprice * line.salesQty) - (line.linetotaldisc / line.saleslineqty) * line.salesQty);
                            line.vat = parseInt(item.LineSalesTaxPercent);
                            // line.colorant=item.
                            line.linenum = item.LINENUM;
                            line.sNo = index + 1;
                            return line;
                        });
                        console.table(invlocation);
                        from = invlocation.find(function (loc) { return loc.inventlocationid == frominvloc_1; });
                        to = invlocation.find(function (loc) { return loc.inventlocationid == toinvloc_1; });
                        if (from) {
                            data_1.wnamealias = from.wnamealias;
                            data_1.wname = from.wname;
                        }
                        if (to) {
                            data_1.twnamealias = to.wnamealias;
                            data_1.twname = to.wname;
                        }
                        _b.label = 11;
                    case 11:
                        data_1.disc = data_1.disc ? data_1.disc : '0.00';
                        data_1.vat = data_1.salesLine[0].vat;
                        // console.log("=================final review=======================",data)
                        return [2 /*return*/, data_1];
                    case 12: throw { message: "Select Invoice ID" };
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_1 = _b.sent();
                        throw error_1;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    HistoricalTransactionReport.prototype.oldDataUrl = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getToken()];
                    case 1:
                        token = _a.sent();
                        console.log(token);
                        url = "http://pos.al-jazeerapaints.com:200/API/HistoricalData?OrderId=" + params.salesId;
                        axios.defaults.headers["Token"] = token;
                        return [4 /*yield*/, axios.get(url)];
                    case 2:
                        data = _a.sent();
                        // console.log(data);
                        // this.otpStore.set(params.mobile, { token: data.data.otp_token, validate: false });
                        return [2 /*return*/, data.data];
                    case 3:
                        e_1 = _a.sent();
                        throw { message: Props_1.Props.DATA_NOT_FOUND };
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    HistoricalTransactionReport.prototype.report = function (result, params) {
        return __awaiter(this, void 0, void 0, function () {
            var renderData, FILES, file;
            return __generator(this, function (_a) {
                renderData = result;
                FILES = {
                    "DESIGNERSERVICE": params.lang == "en" ? "historical-transaction-designer-service-en" : "historical-transaction-designer-service-ar",
                    "DESIGNERSERVICERETURN": params.lang == "en" ? "historical-transaction-designer-service-en" : "historical-transaction-designer-service-ar",
                    "INVENTORYMOVEMENT": params.lang == "en" ? "historical-transaction-movement-en" : "historical-transaction-movement-ar",
                    "ORDERRECEIVE": params.lang == "en" ? "historical-transaction-orderreceive-en" : "historical-transaction-orderreceive-ar",
                    "ORDERSHIPMENT": params.lang == "en" ? "historical-transaction-ordershipment-en" : "historical-transaction-ordershipment-ar",
                    "OTHERS": params.lang == "en" ? "historical-transaction-en" : "historical-transaction-ar"
                };
                file = FILES[renderData.transkind];
                file = file ? file : FILES["OTHERS"];
                params.user ? renderData.user = params.user : null;
                if (renderData.transkind == 'DESIGNERSERVICERETURN') {
                    renderData.isDesignerServiceReturn = true;
                }
                // console.log("Report ======> ", file);
                console.log(renderData);
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
    HistoricalTransactionReport.prototype.query_to_data = function (id, inventlocationid) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n                select \n                st.salesid as \"salesId\",\n                st.intercompanyoriginalsalesid as \"interCompanyOriginalSalesId\",\n                st.custaccount as \"custAccount\",\n                st.invoiceaccount as \"invoiceAccount\",\n                st.status as status,\n                alt.en as \"transkindEn\",\n                alt.ar as \"transkindAr\",\n                st.transkind as transkind,\n                mt.movementtype as movementtype,\n                mt.movementarabic as movementtypear,\n                st.salesname as customername,\n                st.mobileno as custmobilenumber,\n                to_char(st.vatamount, 'FM999999999990.00')  as vatamount,\n                to_char(st.netamount, 'FM999999999990.00')  as \"netAmount\",\n                to_char(st.disc, 'FM999999999990.00')  as disc,\n                to_char(st.amount , 'FM999999999990.00') as amount,\n                to_char(st.shipping_amount, 'FM999999999990.00') as \"shippingAmount\",\n                to_char(st.lastmodifieddate, 'DD-MM-YYYY') as \"shippingDate\",\n                st.salesname as cname,\n                st.salesname as \"cnamealias\",\n                st.voucherdiscchecked as \"voucherdiscchecked\",\n                st.vouchernum as \"vouchernum\",\n                st.payment_type as \"paymentType\",\n                c.phone as \"cphone\",\n                to_char(st.createddatetime, 'DD-MM-YYYY') as createddatetime,\n                st.lastmodifieddate as lastmodifieddate,\n                st.originalprinted as \"originalPrinted\",\n                st.inventlocationid as \"inventLocationId\",\n                w.namealias as wnamealias,\n                w.name as wname,\n                tw.namealias as twnamealias,\n                tw.name as twname,\n                st.payment as \"paymentMode\",\n                st.iscash as iscash,\n                st.createdby,\n                st.description as notes,\n                to_char(st.cash_amount, 'FM999999999990.00') as \"cashAmount\",\n                to_char(st.card_amount, 'FM999999999990.00') as \"cardAmount\",\n                to_char(st.shipping_amount, 'FM999999999990.00') as \"shippingAmount\",\n                to_char(st.online_amount, 'FM999999999990.00') as \"onlineAmount\",\n                to_char(st.design_service_redeem_amount, 'FM999999999990.00') as \"designServiceRedeemAmount\",\n                to_char(st.redeemptsamt, 'FM999999999990.00') as \"redeemAmount\",\n                coalesce(st.deliveryaddress, ' ') || (' ') || coalesce(st.citycode, ' ') || (' ') || coalesce(st.districtcode, ' ') || (' ') || coalesce(st.country_code, ' ') as deliveryaddress,\n                concat(d.num,' - ', d.description) as salesman,\n                to_char(st.deliverydate, 'DD-MM-YYYY') as \"deliveryDate\"\n                from salestable st \n                left join dimensions d on st.dimension6_ = d.num\n                left join inventlocation w on w.inventlocationid = st.inventlocationid\n                left join inventlocation tw on tw.inventlocationid = st.custaccount\n                left join custtable c on c.accountnum = st.custaccount\n                left join paymterm p on p.paymtermid = st.payment\n                left join app_lang alt on alt.id = st.transkind\n                left join movementtype mt on st.movement_type_id=mt.id\n                where salesid='" + id + "' \n                ";
                        if (inventlocationid) {
                            query += "and inventlocationid='" + inventlocationid + "'";
                        }
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HistoricalTransactionReport.prototype.salesline_query_to_data = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var salesQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salesQuery = "\n                  select\n                  distinct\n                  ln.salesid,\n                  ln.actualsalesqty,\n                  ln.itemid,\n                  ln.batchno,\n                  ln.configid,\n                  ln.inventsizeid,\n                  ln.saleslineqty,\n                  to_char(ln.lineamount, 'FM999999999990.00') as \"netAmount\",\n                  to_char(ln.lastmodifieddate, 'DD-MM-YYYY') as \"shippingDate\",\n                  to_char(ln.salesqty, 'FM999999999D') as \"salesQty\",\n                  to_char(ln.salesprice, 'FM999999999990.00') as salesprice,\n                  to_char((ln.vatamount/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as \"vatAmount\",\n                  to_char((ln.linetotaldisc/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as \"lineTotalDisc\",\n                  to_char(ln.colorantprice, 'FM999999999990.00') as colorantprice,\n                  to_char((ln.lineamount / ln.saleslineqty)*ln.salesqty + (ln.colorantprice*ln.salesqty) - (ln.linetotaldisc / ln.saleslineqty)*ln.salesqty + (ln.vatamount / ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as \"lineAmount\",\n                  ln.prodnamear as \"prodNameAr\",\n                  ln.prodnameen as \"prodNameEn\",\n                  ln.colNameAr as \"colNameAr\",\n                  ln.colNameEn as \"colNameEn\",\n                  ln.sizeNameEn as \"sizeNameEn\",\n                  ln.sizeNameAr as \"sizeNameAr\",\n                  to_char((ln.lineamount/ln.saleslineqty)*ln.salesqty + (ln.colorantprice*ln.salesqty) - (ln.linetotaldisc/ln.saleslineqty)*ln.salesqty, 'FM999999999990.00') as \"lineAmountBeforeVat\",\n                  ln.vat as vat,\n                  ln.colorantid as colorant,\n                  ln.linenum as linenum\n                  from\n                  (\n                    select distinct on (i.id, i.invoiceid, i.itemid, i.configid, i.inventsizeid, i.qty, i.batchno, i.sales_line_id)\n                    i.invoiceid as salesid,\n                    i.batchno,\n                    i.itemid,\n                    i.configid,\n                    i.inventsizeid,\n                    st.status as status,\n                    i.qty as actualsalesqty,\n                    ABS(i.qty) as salesqty,\n                    b.itemname as prodnamear,\n                    b.namealias as prodnameen,\n                    coalesce(sl.salesprice, 0)  as salesprice,\n                    coalesce(sl.vatamount, 0)  as vatamount,\n                    coalesce(sl.linetotaldisc, 0) as linetotaldisc,\n                    coalesce(sl.colorantprice,0) as colorantprice,\n                    c.name as colNameAr,\n                    c.name as colNameEn,\n                    s.description as sizeNameEn,\n                    s.name as sizeNameAr,\n                    coalesce(sl.lineamount,0) as  lineamount,\n                    sl.colorantid as  colorantid,\n                    sl.salesqty as saleslineqty,\n                    sl.vat as vat,\n                    sl.linenum,\n                    sl.lastmodifieddate\n                    from inventtrans i\n                    left join salestable st on st.salesid = i.invoiceid\n                    left join salesline sl on sl.id = i.sales_line_id\n                    left join inventtable b on i.itemid=b.itemid\n                    left join inventsize s on s.itemid = i.itemid and i.inventsizeid = s.inventsizeid\n                    left join configtable c on c.configid = i.configid and c.itemid = i.itemid\n                    \n                where invoiceid='" + id + "'\n                ) as ln order by linenum ASC\n                ";
                        console.log(salesQuery);
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HistoricalTransactionReport.prototype.salesline_query_to_data_designer = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var salesQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        salesQuery = "\n                select\n                ROW_NUMBER()  OVER (ORDER BY  ln.salesid) As \"sNo\",\n                ln.itemid as itemid,\n                cast(ln.salesqty as INTEGER) as \"salesQty\",\n                ln.configid as configid,\n                to_char(ln.salesprice , 'FM999,999,999,990D00') as salesprice,\n                to_char(ln.linetotaldisc , 'FM999,999,999,990D00') as \"lineTotalDisc\",\n                to_char(ln.vat , 'FM999,999,999,990D00') as vat,\n                to_char(ln.vatamount, 'FM999,999,990d00') as \"vatAmount\",\n                to_char(ln.salesprice- ln.linetotaldisc +ln.vatamount, 'FM999,999,999,990D00') as \"lineAmount\",\n                to_char(ln.salesprice- ln.linetotaldisc, 'FM999,999,999,990D00') as \"lineAmountBeforeVat\",\n                ln.inventsizeid as inventsizeid\n                from salesline ln\n                left join designer_products dp on dp.code = ln.itemid\n                where ln.salesid='" + id + "'\n                ";
                        return [4 /*yield*/, this.db.query(salesQuery)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    HistoricalTransactionReport.prototype.chunkArray = function (myArray, chunk_size) {
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
    HistoricalTransactionReport.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, url, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        token = void 0;
                        url = Props_1.Props.REDEEM_URL + "?clientId=" + Props_1.Props.REDEEM_CLIENT_ID + "&clientSecret=" + Props_1.Props.REDEEM_CLIENT_SECRET;
                        console.log(url);
                        return [4 /*yield*/, axios.post(url)];
                    case 1:
                        data = _a.sent();
                        token = data.headers.token;
                        return [2 /*return*/, token];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return HistoricalTransactionReport;
}());
exports.HistoricalTransactionReport = HistoricalTransactionReport;
