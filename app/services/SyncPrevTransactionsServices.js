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
Object.defineProperty(exports, "__esModule", { value: true });
var Config = __importStar(require("../../utils/Config"));
var SyncServiceHelper_1 = require("../../sync/SyncServiceHelper");
// let mssqlDbOptions = {
//   username: "SA",
//   password: "Jazeera123",
//   host: "3.80.2.102",
//   database: "jpos_dev",
//   port: 1433
// };
// let mssqlDbOptions = Config.mssqlDbOptions
// let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;
var SyncPrevTransactionsService = /** @class */ (function () {
    function SyncPrevTransactionsService() {
        var _this = this;
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var mssqlClient;
            return __generator(this, function (_a) {
                try {
                    mssqlClient = require("mssql/msnodesqlv8");
                    // const connectionString =
                    //   "server=localhost;Database=DAX;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
                    // let mssqlString = `mssql://${mssqlDbOptions.username}:${mssqlDbOptions.password}@${mssqlDbOptions.host}/${mssqlDbOptions.database}`;
                    // const connectionString = mssqlString;
                    // this.pool = new mssqlClient.ConnectionPool(connectionString);
                }
                catch (err) {
                    this.pool = null;
                }
                return [2 /*return*/];
            });
        }); };
        // this.run();
        this.fs = require("fs");
        this.jsonString = this.fs.readFileSync(__dirname + "/data.json", "utf-8");
        this.dateObj = JSON.parse(this.jsonString);
        // this.fs.unlinkSync(`${__dirname}/data.json`);
        this.mssqlDbOptions = Config.mssqlDbOptions;
        // this.mssqlDbOptions = mssqlDbOptions;
        this.localDbConfig = SyncServiceHelper_1.SyncServiceHelper.LocalDBOptions();
        // this.localDbConfig = LocalDBOptions();
    }
    SyncPrevTransactionsService.prototype.mssqlTransactions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cond, mssqlClient, mssqlString, connectionString, data, rows, query, sCond, slCond, tCond, optDate, current_date, transactionclosed, _i, data_1, item, err_1, _a, data_2, item, err_2, _b, data_3, item, err_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        cond = true;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 25, 26, 27]);
                        mssqlClient = require("mssql");
                        mssqlString = "mssql://" + this.dateObj.username + ":" + this.dateObj.password + "@" + this.dateObj.host + "/" + this.dateObj.database;
                        connectionString = mssqlString;
                        this.pool = new mssqlClient.ConnectionPool(connectionString);
                        return [4 /*yield*/, this.pool.connect()];
                    case 2:
                        _c.sent();
                        data = [];
                        rows = void 0;
                        query = void 0;
                        sCond = void 0;
                        slCond = void 0;
                        tCond = void 0;
                        optDate = this.dateObj.date;
                        current_date = new Date().toISOString().slice(0, 10);
                        transactionclosed = false;
                        console.log(optDate, current_date);
                        if (optDate === current_date) {
                            sCond = " CREATEDDATETIME BETWEEN dateadd(day, -120, '" + this.dateObj.date + "') AND  '" + this.dateObj.date + "' ORDER BY RECID ASC ";
                            slCond = " CREATEDDATETIME BETWEEN dateadd(day, -120, '" + this.dateObj.date + "') AND  '" + this.dateObj.date + "') ORDER BY RECID ASC ";
                            tCond = "  DATEPHYSICAL BETWEEN dateadd(day, -120, '" + this.dateObj.date + "') AND  '" + this.dateObj.date + "' ORDER BY RECID ASC ";
                        }
                        else {
                            sCond = " CREATEDDATETIME BETWEEN '" + this.dateObj.date + "' AND  getdate() ORDER BY RECID ASC ";
                            tCond = " DATEPHYSICAL BETWEEN '" + this.dateObj.date + "' AND  getdate() ORDER BY RECID ASC ";
                            slCond = " CREATEDDATETIME BETWEEN  '" + this.dateObj.date + "' AND  getdate()) ORDER BY RECID ASC ";
                            transactionclosed = true;
                        }
                        console.log(tCond, sCond);
                        query = salesTableQuery + sCond;
                        return [4 /*yield*/, this.pool.request().query(query)];
                    case 3:
                        rows = _c.sent();
                        return [4 /*yield*/, this.chunkArray(rows.recordset, 5000)];
                    case 4:
                        data = _c.sent();
                        _i = 0, data_1 = data;
                        _c.label = 5;
                    case 5:
                        if (!(_i < data_1.length)) return [3 /*break*/, 10];
                        item = data_1[_i];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, this.sync_salesTableData(item)];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        err_1 = _c.sent();
                        console.log(err_1);
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 5];
                    case 10:
                        query = salesLineQuery + slCond;
                        return [4 /*yield*/, this.pool.request().query(query)];
                    case 11:
                        // console.log(cond);
                        rows = _c.sent();
                        return [4 /*yield*/, this.chunkArray(rows.recordset, 5000)];
                    case 12:
                        data = _c.sent();
                        _a = 0, data_2 = data;
                        _c.label = 13;
                    case 13:
                        if (!(_a < data_2.length)) return [3 /*break*/, 18];
                        item = data_2[_a];
                        _c.label = 14;
                    case 14:
                        _c.trys.push([14, 16, , 17]);
                        return [4 /*yield*/, this.sync_salesLineData(item)];
                    case 15:
                        _c.sent();
                        return [3 /*break*/, 17];
                    case 16:
                        err_2 = _c.sent();
                        console.log(err_2);
                        return [3 /*break*/, 17];
                    case 17:
                        _a++;
                        return [3 /*break*/, 13];
                    case 18:
                        query = inventTransQuery + tCond;
                        return [4 /*yield*/, this.pool.request().query(query)];
                    case 19:
                        rows = _c.sent();
                        return [4 /*yield*/, this.chunkArray(rows.recordset, 1)];
                    case 20:
                        data = _c.sent();
                        _b = 0, data_3 = data;
                        _c.label = 21;
                    case 21:
                        if (!(_b < data_3.length)) return [3 /*break*/, 24];
                        item = data_3[_b];
                        // try {
                        return [4 /*yield*/, this.syncInventTransData(item, [], transactionclosed)];
                    case 22:
                        // try {
                        _c.sent();
                        _c.label = 23;
                    case 23:
                        _b++;
                        return [3 /*break*/, 21];
                    case 24: return [3 /*break*/, 27];
                    case 25:
                        err_3 = _c.sent();
                        console.log(err_3);
                        cond = false;
                        return [3 /*break*/, 27];
                    case 26:
                        this.pool.close();
                        this.fs.unlinkSync(__dirname + "/data.json");
                        return [7 /*endfinally*/];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    SyncPrevTransactionsService.prototype.sync_salesTableData = function (salesTableData, queryData) {
        if (queryData === void 0) { queryData = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, salesTableData_1, item, query, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        for (_i = 0, salesTableData_1 = salesTableData; _i < salesTableData_1.length; _i++) {
                            item = salesTableData_1[_i];
                            item.createdby = "SYSTEM";
                            item.syncstatus = 4;
                            item.inventlocationid = this.dateObj.inventlocationid;
                            item.invoicecreatedby = "SYSTEM";
                            item.lastmodifiedby = "SYSTEM";
                            item.lastmodifieddate = new Date();
                            item.originalprinted = true;
                            item.iscash = item.payment == "CASH" ? true : false;
                            item.deliverytype = "self";
                            item.documentstatus = item.documentstatus == 0 ? false : true;
                            query = "INSERT INTO public.salestable (salesid,salesname, reservation, custaccount, invoiceaccount, deliverydate,\n          deliveryaddress, documentstatus, currencycode, dataareaid, recversion,\n          recid, languageid, payment, custgroup, pricegroupid, shippingdaterequested,\n          deliverystreet, salestype, salesstatus, numbersequencegroup, cashdisc,\n           intercompanyoriginalsalesid, salesgroup, shippingdateconfirmed, deadline, fixedduedate, returndeadline, createddatetime, createdby, syncstatus, amount, disc, netamount,\n           citycode, districtcode, latitude, vehiclecode, vouchernum, painter, ajpenddisc, taxgroup, sumtax, inventlocationid, vatamount, invoicedate, invoicecreatedby, multilinediscountgroupid,\n           lastmodifiedby, lastmodifieddate, originalprinted, iscash,  transkind, status, redeempts, redeemptsamt, deliverytype, customerref) VALUES(\n          '" + item.salesid + "','" + item.salesname + "'," + item.reservation + ",'" + item.custaccount + "','" + item.invoiceaccount + "','" + item.deliverydate + "', '" + item.deliveryaddress + "'," + item.documentstatus + ",'" + item.currencycode + "','" + item.dataareaid + "',\n          " + item.recversion + "," + item.recid + ", '" + item.languageid + "', '" + item.payment + "', '" + item.custgroup + "','" + item.pricegroupid + "', '" + item.shippingdaterequested + "', '" + item.deliverystreet + "',\n          " + item.salestype + "," + item.salesstatus + ",'" + item.numbersequencegroup + "','" + item.cashdisc + "','" + (item.salestype == 4 ? item.customerref : item.intercompanyoriginalsalesid) + "','" + item.salesgroup + "','" + item.shippingdateconfirmed + "',\n          '" + item.deadline + "','" + item.fixedduedate + "','" + item.returndeadline + "',\n          '" + item.createddatetime + "','" + item.createdby + "'," + item.syncstatus + "," + item.amount + "," + item.disc + "," + item.netamount + ",'" + item.citycode + "','" + item.districtcode + "','" + item.latitude + "','" + item.vehiclecode + "','" + item.vouchernum + "',\n          '" + item.painter + "','" + item.ajpenddisc + "','" + item.taxgroup + "'," + item.sumtax + ",'" + item.inventlocationid + "',\n           " + item.vatamount + ",'" + item.createddatetime + "','" + item.invoicecreatedby + "','" + item.multilinediscountgroupid + "','" + item.lastmodifiedby + "',\n           '" + item.createddatetime + "'," + item.originalprinted + ",'" + item.iscash + "','" + item.transkind + "', '" + item.status + "', " + item.redeempts + "," + item.redeemptsamt + ",'" + item.deliverytype + "', '" + item.customerref + "');";
                            queryData.push(query);
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(this.localDbConfig, queryData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        console.log(err_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncPrevTransactionsService.prototype.sync_salesLineData = function (salesLineData, queryData) {
        if (queryData === void 0) { queryData = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _i, salesLineData_1, line, query, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        for (_i = 0, salesLineData_1 = salesLineData; _i < salesLineData_1.length; _i++) {
                            line = salesLineData_1[_i];
                            line.applied_discounts = [];
                            line.applied_discounts = JSON.stringify(line.applied_discounts);
                            line.batches = JSON.stringify([
                                {
                                    batchNo: line.BATCHNO,
                                    quantity: line.SALESQTY
                                }
                            ]);
                            query = "INSERT INTO public.salesline\n        (salesid, linenum, itemid, \"name\", salesprice, currencycode, salesqty, lineamount, salesunit, priceunit, qtyordered, remainsalesphysical, remainsalesfinancial,\n        salestype, dataareaid, custgroup, custaccount, inventsizeid, configid, numbersequencegroupid, inventlocationid, salesdelivernow, salesstatus, \"location\", batchno, instantdisc, voucherdisc,\n          redeemdisc, promotiondisc, linetotaldisc, linesalestax, netamttax, linesalestaxpercent, taxgroup, taxitemgroup, linediscamt, customdiscamt, supplmultipleqty, supplfreeqty, multilndisc, multilnpercent, enddisc,\n          createdby, createddatetime, lastmodifiedby, lastmodifieddate, \n            vatamount, vat, voucherdiscamt, sabic_customer_discount, is_item_free, link_id, batches, applied_discounts)\n        VALUES('" + line.SALESID + "', " + line.LINENUM + ", '" + line.ITEMID + "', '" + line.NAME + "', " + line.SALESPRICE + ", '" + line.CURRENCYCODE + "', " + line.SALESQTY + ", " + line.LINEAMOUNT + ", '" + line.SALESUNIT + "', " + line.PRICEUNIT + ", " + line.QTYORDERED + ", \n        " + line.REMAINSALESPHYSICAL + ", " + line.REMAINSALESFINANCIAL + ",  " + line.SALESTYPE + ", '" + (line.DATAAREAID ? line.DATAAREAID.toLowerCase() : null) + "', '" + line.CUSTGROUP + "', '" + line.CUSTACCOUNT + "', '" + line.INVENTSIZEID + "', '" + line.CONFIGID + "',\n         '" + line.NUMBERSEQUENCEGROUPID + "', '" + line.INVENTLOCATIONID + "', " + line.SALESDELIVERNOW + ", " + line.SALESSTATUS + ", '" + line.LOCATION + "', '" + line.BATCHNO + "', " + (line.InstantDisc ? line.InstantDisc : 0) + ", " + (line.VoucherDisc ? line.VoucherDisc : 0) + ", " + (line.RedeemDisc ? line.RedeemDisc : 0) + ", " + (line.PromotionDisc ? line.PromotionDisc : 0) + ", \n         " + (line.LineTotalDisc ? line.LineTotalDisc : 0) + ", " + (line.LineSalesTax ? line.LineSalesTax : 0) + ", " + (line.NetAmtTax ? line.NetAmtTax : 0) + ", " + (line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0) + ", '" + line.TAXGROUP + "', '" + line.TAXITEMGROUP + "', " + (line.LINEDISCAMT ? line.LINEDISCAMT : 0) + ", " + (line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0) + ", " + (line.SupplMultipleQty ? line.SupplMultipleQty : 0) + ", " + (line.SupplFreeQty ? line.SupplFreeQty : 0) + ",\n         " + (line.MulLnDisc ? line.MultiLineDisc : 0) + ", " + (line.MultiPercent ? line.MultiPercent : 0) + ", " + (line.CUSTOMDISCAMT ? line.CUSTOMDISCAMT : 0) + ", '" + line.createdby + "', now(), '" + line.createdby + "', now(),\n          " + (line.LineSalesTax ? line.LineSalesTax : 0) + ", " + (line.LineSalesTaxPercent ? line.LineSalesTaxPercent : 0) + ",\n           " + (line.VoucherDisc ? line.VoucherDisc : 0) + ", " + (line.InteriorExteriorAmount ? line.InteriorExteriorAmount : 0) + ", " + (line.isitemfree ? line.isitemfree : false) + ", NULL, '" + line.batches + "', '" + line.applied_discounts + "')\n        ";
                            // console.log(query)
                            queryData.push(query);
                        }
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(this.localDbConfig, queryData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        console.log(err_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyncPrevTransactionsService.prototype.syncInventTransData = function (inventTransData, queryData, transactionclosed) {
        if (queryData === void 0) { queryData = []; }
        return __awaiter(this, void 0, void 0, function () {
            var inventoryOnHandQuery, text, _i, inventTransData_1, trans, salesOrderData, salesOrderData, saleslinequery, salesLineData, query, onhanddata, onhandquery, onhandquery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        inventoryOnHandQuery = [];
                        _i = 0, inventTransData_1 = inventTransData;
                        _a.label = 1;
                    case 1:
                        if (!(_i < inventTransData_1.length)) return [3 /*break*/, 10];
                        trans = inventTransData_1[_i];
                        if (!(trans.TRANSTYPE == 4)) return [3 /*break*/, 3];
                        text = "select salesid from salestable where intercompanyoriginalsalesid = '" + trans.TRANSREFID + "' limit 1";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(this.localDbConfig, text)];
                    case 2:
                        salesOrderData = _a.sent();
                        trans.INVOICEID = salesOrderData.rows[0] ? salesOrderData.rows[0].salesid : trans.TRANSREFID;
                        return [3 /*break*/, 5];
                    case 3:
                        text = "select intercompanyoriginalsalesid from salestable where salesid = '" + trans.TRANSREFID + "' limit 1";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(this.localDbConfig, text)];
                    case 4:
                        salesOrderData = _a.sent();
                        trans.INVOICEID = trans.TRANSREFID;
                        trans.TRANSREFID = salesOrderData.rows[0]
                            ? salesOrderData.rows[0].intercompanyoriginalsalesid
                            : trans.TRANSREFID;
                        trans.TRANSREFID = trans.TRANSREFID == "Nothing" ? trans.INVOICEID : trans.TRANSREFID;
                        _a.label = 5;
                    case 5:
                        saleslinequery = "select id from salesline where salesid = '" + trans.INVOICEID + "' AND itemid = '" + trans.ITEMID + "' AND configid = '" + trans.ConfigId + "' AND inventsizeid = '" + trans.InventSizeId + "' AND batchno = '" + trans.BATCHNO + "' limit 1";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(this.localDbConfig, saleslinequery)];
                    case 6:
                        salesLineData = _a.sent();
                        // console.log(salesLineData);
                        trans.saleslineid = salesLineData.rows[0] ? salesLineData.rows[0].id : "";
                        query = "INSERT INTO public.inventtrans\n        (itemid, qty, datephysical, transtype, transrefid, invoiceid, dataareaid, recversion, recid, inventsizeid, configid, batchno, inventlocationid, transactionclosed, reserve_status, sales_line_id)\n        VALUES('" + trans.ITEMID + "', " + trans.QTY + ", '" + trans.DATEPHYSICAL + "'," + trans.TRANSTYPE + ", '" + trans.TRANSREFID + "', '" + trans.INVOICEID + "', '" + trans.DATAAREAID + "', " + trans.RECVERSION + ", " + trans.RECID + ", '" + trans.InventSizeId + "',\n         '" + trans.ConfigId + "', '" + trans.BATCHNO + "', '" + this.dateObj.inventlocationid + "', " + transactionclosed + ", 'OLD_POS_DATA', '" + trans.saleslineid + "');\n        ";
                        if (!(transactionclosed == true && trans.ITEMID != 'HSN-00001')) return [3 /*break*/, 8];
                        text = "select * from inventory_onhand where itemid = '" + trans.ITEMID + "' AND configid = '" + trans.ConfigId + "' and inventsizeid = '" + trans.InventSizeId + "' and batchno = '" + trans.BATCHNO + "' and inventlocationid = '" + this.dateObj.inventlocationid + "'";
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.ExecuteQuery(this.localDbConfig, text)];
                    case 7:
                        onhanddata = _a.sent();
                        console.log(onhanddata);
                        if (onhanddata && onhanddata.rows.length > 0) {
                            trans.qty_in = parseInt(trans.QTY) > 0 ? parseInt(onhanddata.rows[0].qty_in) + Math.abs(parseInt(trans.QTY)) : parseInt(onhanddata.rows[0].qty_in) + 0;
                            trans.qty_out = parseInt(trans.QTY) <= 0 ? parseInt(onhanddata.rows[0].qty_out) + Math.abs(parseInt(trans.QTY)) : parseInt(onhanddata.rows[0].qty_out) + 0;
                            onhandquery = "UPDATE public.inventory_onhand SET  qty_in='" + trans.qty_in + "', qty_out= '" + trans.qty_out + "', updated_on=now() WHERE id='" + onhanddata.rows[0].id + "'";
                            inventoryOnHandQuery.push(onhandquery);
                        }
                        else {
                            trans.qty_in = parseInt(trans.QTY) > 0 ? Math.abs(parseInt(trans.QTY)) : 0;
                            trans.qty_out = parseInt(trans.QTY) <= 0 ? Math.abs(parseInt(trans.QTY)) : 0;
                            onhandquery = "INSERT INTO public.inventory_onhand (itemid, configid, inventsizeid, batchno, qty_in, qty_out, qty_reserved, dataareaid, inventlocationid, updated_on, \"name\", updated_by) VALUES('" + trans.ITEMID + "', '" + trans.ConfigId + "', '" + trans.InventSizeId + "', '" + trans.BATCHNO + "', '" + trans.qty_in + "', '" + trans.qty_out + "', 0, '" + trans.DATAAREAID + "', '" + this.dateObj.inventlocationid + "', now(), 'OPEN_BALANCE', 'sayeed');";
                            inventoryOnHandQuery.push(onhandquery);
                        }
                        _a.label = 8;
                    case 8:
                        queryData.push(query);
                        _a.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 1];
                    case 10:
                        console.log(inventoryOnHandQuery);
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(this.localDbConfig, queryData)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, SyncServiceHelper_1.SyncServiceHelper.BatchQuery(this.localDbConfig, inventoryOnHandQuery)];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SyncPrevTransactionsService.prototype.chunkArray = function (myArray, chunk_size) {
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
    return SyncPrevTransactionsService;
}());
exports.SyncPrevTransactionsService = SyncPrevTransactionsService;
var sync = new SyncPrevTransactionsService();
try {
    sync.mssqlTransactions();
}
catch (err) {
    console.log(err);
}
var salesTableQuery = "\nSELECT SALESID AS salesid,\nSALESTYPE as salestype,\nSALESSTATUS AS salesstatus,\nSALESGROUP as salesgroup,\nCAST(CASE SALESTYPE \n  WHEN 3 THEN 'SALESORDER' \n  WHEN 4 THEN 'RETURNORDER' \n  WHEN 5 THEN 'TRANSFERORDER'\n  WHEN 6 THEN 'ORDERSHIPMENT'\n  WHEN 7 THEN 'ORDERRECEIVE'\n  WHEN 10 THEN 'INVENTORYMOVEMENT'\n  ELSE ''\nEND AS VARCHAR(20)) AS transkind,\nSALESGROUP as intercompanyoriginalsalesid,\nCUSTOMERREF AS customerref,\nCAST(CASE SALESSTATUS \n  WHEN 2 THEN 'POSTED' \n  WHEN 3 THEN 'POSTED'\n  ELSE ''\nEND AS VARCHAR(20)) AS status,\nSALESNAME as salesname,\nRESERVATION as reservation,\n    CUSTACCOUNT as custaccount,\n    INVOICEACCOUNT as invoiceaccount,\n    DELIVERYADDRESS as deliveryaddress,\n    CONVERT(VARCHAR(10), DELIVERYDATE, 120) as deliverydate,\n    DOCUMENTSTATUS as documentstatus,\n    CURRENCYCODE as currencycode,\n    lower(DATAAREAID) as dataareaid,\n    RECVERSION as recversion,\n    RECID as recid,\n    LANGUAGEID as languageid,\n    PAYMENT as payment,\n    CUSTGROUP as custgroup,\n    PRICEGROUPID as pricegroupid,\n    CONVERT(VARCHAR(10), SHIPPINGDATEREQUESTED, 120) as shippingdaterequested,\n    DELIVERYSTREET as deliverystreet,\n    NUMBERSEQUENCEGROUP as numbersequencegroup,\n    CASHDISC as cashdisc,\n    CONVERT(VARCHAR(10), SHIPPINGDATECONFIRMED, 120) as shippingdateconfirmed,\n    CONVERT(VARCHAR(10), DEADLINE, 120) AS deadline,\n    CONVERT(VARCHAR(10), FIXEDDUEDATE, 120) as fixedduedate,\n    CONVERT(VARCHAR(10), RETURNDEADLINE, 120) as returndeadline,\n    CONVERT(VARCHAR(10), CREATEDDATETIME, 120) as createddatetime,\n    AMOUNT AS amount,\n    DISC as disc,\n    NETAMOUNT as netamount,\n    CITYCODE as citycode,\n    DISTRICTCODE as districtcode,\n    LATITUDE AS latitude,\n    LONGITUDE as longitude,\n    VehicleCode as vehiclecode,\n    APPTYPE as apptype,\n    VOUCHERNUM as vouchernum,\n    Painter as painter,\n    AJPENDDISC as ajpenddisc,\n    TAXGROUP as taxgroup,\n    SUMTAX as sumtax,\n    SUMTAX as vatamount,\n    CardNo as cardno,\n    REDEEMPOINTS as redeempts,\n    REDEEMAMT as redeemptsamt,\n    MultiLineDisc as multilinediscountgroupid,\n    BANKCARDNO as bankcardno,\n    CARDHOLDERNAME as cardholdername,\n    CARDEXPIRY as cardexpiry\nFROM SALESTABLE\nWHERE \nSALESTYPE IN (3,4,5,6,7,10) AND  SALESSTATUS IN (2,3)\nAND ";
var salesLineQuery = "SELECT * FROM SALESLINE WHERE SALESID IN (\n  SELECT SALESID\n  FROM SALESTABLE\n  WHERE \n  SALESTYPE IN (3,4,5,6,7,10) AND  SALESSTATUS IN (2,3)\n  AND ";
var inventTransQuery = "\nSELECT \nITEMID,\nCONVERT(VARCHAR(10), DATEPHYSICAL, 120) as DATEPHYSICAL,\nQTY,\nTRANSTYPE,\nTRANSREFID,\nINVOICEID,\nRECVERSION,\nRECID,\nInventSizeId,\nConfigId,\nBATCHNO,\nlower(DATAAREAID) as DATAAREAID\nFROM INVENTTRANS where ";
