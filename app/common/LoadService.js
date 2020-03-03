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
var Props_1 = require("../../constants/Props");
var RawQuery_1 = require("./RawQuery");
var LoadService = /** @class */ (function () {
    function LoadService() {
        this.db = typeorm_1.getManager();
        this.rawQuery = new RawQuery_1.RawQuery();
    }
    LoadService.prototype.customer = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var additionalcustomer, customergroup, sabicCustomers, query, data, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("customer search");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        additionalcustomer = this.sessionInfo.additionalcustomer
                            ? this.sessionInfo.additionalcustomer.split(",")
                            : [];
                        customergroup = this.sessionInfo.customergroup ? this.sessionInfo.customergroup.split(",") : [];
                        sabicCustomers = this.sessionInfo.sabiccustomers ? this.sessionInfo.sabiccustomers.trim().split(",") : [];
                        //   param.additionalcustomer = "";
                        //   param.customergroup = "";
                        //   param.sabiccustomers = "";
                        param.additionalcustomer = additionalcustomer.map(function (d) { return "'" + d + "'"; }).join(",");
                        param.customergroup = customergroup.map(function (d) { return "'" + d + "'"; }).join(",");
                        param.sabiccustomers = sabicCustomers.map(function (d) { return "'" + d + "'"; }).join(",");
                        //   additionalcustomer.forEach((element: any) => {
                        //     param.additionalcustomer += additionalcustomer.indexOf(element) == additionalcustomer.length - 1 ? "'" + element + "'" : "'" + element + "' ,";
                        //   });
                        //   customergroup.forEach((element: any) => {
                        //     param.customergroup += customergroup.indexOf(element) == customergroup.length - 1 ? "'" + element + "'" : "'" + element + "' ,";
                        //   });
                        //   sabicCustomers.forEach((element: any) => {
                        //     param.sabiccustomers += sabicCustomers.indexOf(element) == sabicCustomers.length - 1 ? "'" + element + "'" : "'" + element + "' ,";
                        //   });
                        //   param.customergroup.replace(/,\s*$/, "")
                        //   param.additionalcustomer.replace(/,\s*$/, "")
                        //   param.sabiccustomers.replace(/,\s*$/, "")
                        console.log(param);
                        query = "select \n            accountnum, \n            name, \n            namealias, \n            address, \n            phone,\n            districtcode,\n            citycode, \n            rcusttype, \n            pricegroup,\n            inventlocation,\n            dataareaid,\n            walkincustomer,\n            custgroup,\n            cashdisc,\n            salesgroup,\n            currency,\n            vendaccount,\n            vatnum,\n            countryregionid,\n            inventlocation,\n            email,\n            url,\n            blocked,\n            taxgroup,\n            paymmode,\n            paymtermid,\n            creditmax,\n            bankaccount,\n            namealias,\n            invoiceaddress,\n            incltax,\n            numbersequencegroup,\n            city,\n            custclassificationid,\n            identificationnumber,\n            modifieddatetime,\n            createddatetime,\n            dataareaid,\n            recversion,\n            recid,\n            custtype,\n            walkincustomer,\n            lastmodifiedby,\n            lastmodifieddate,\n            createdby,\n            dimension as regionid,\n            dimension2_ as departmentid,\n            dimension3_ as costcenterid,\n            dimension4_ as employeeid,\n            dimension5_ as projectid,\n            dimension6_ as salesmanid,\n            dimension7_ as brandid,\n            dimension8_ as productlineid\n           from custtable ";
                        if (param.key == "customer") {
                            query += "where (name ILike '%" + param.param + "%' or namealias ILike '%" + param.param + "%' or accountnum ILike '%" + param.param + "%' or phone ILike '%" + param.param + "%') and dataareaid='" + this.sessionInfo.dataareaid + "' ";
                        }
                        else if (param.key == "painter") {
                            query += "where (name ILike '%" + param.param + "%' or namealias ILike '%" + param.param + "%'  or accountnum ILike '%" + param.param + "%' or phone ILike '%" + param.param + "%') and dataareaid='" + this.sessionInfo.dataareaid + "' and rcusttype = 2";
                        }
                        else if (param.key == "mobile") {
                            query += "where phone ILike '%" + param.param + "%'";
                            // } else {
                            //     query += `where dataareaid='${this.sessionInfo.dataareaid}' `;
                        }
                        if (param.type == "DESIGNERSERVICE") {
                            query += " and paymtermid = 'CASH' ";
                        }
                        query += " and (" + (param.customergroup.length > 0 ? "custgroup in (" + param.customergroup + ")" : "") + " " + (param.customergroup.length > 0 ? "OR" : "") + "  " + (param.additionalcustomer.length > 0 ? "accountnum in (" + param.additionalcustomer + ")" : "") + " " + (param.additionalcustomer.length > 0 ? "OR" : "") + " " + (param.sabiccustomers.length > 0 ? "accountnum in (" + param.sabiccustomers + ")" : "") + " " + (param.sabiccustomers.length > 0 ? "OR" : "") + " " + ("accountnum='" + this.sessionInfo.defaultcustomerid + "'") + " or walkincustomer = true) and deleted = false and dataareaid='" + this.sessionInfo.dataareaid + "' " + (param.type == "DESIGNERSERVICE" ? " and accountnum!='" + this.sessionInfo.defaultcustomerid + "'" : "") + " limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        // console.log(data);
                        data.map(function (v) {
                            v.salesmanid = v.salesmanid == "" || !v.salesmanid ? _this.sessionInfo.salesmanid[0] : v.salesmanid;
                        });
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.getCustomer = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rawQuery.getCustomer(param.param)];
                    case 1:
                        customer = _a.sent();
                        return [2 /*return*/, [customer]];
                }
            });
        });
    };
    LoadService.prototype.visitor = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = " select \n        visitorid as \"visitorId\",\n        visitorsequencenumber as \"visitorSequenceNumber\",\n        dateofvisit as \"dateOfVisit\",\n        salesmanname as \"salesmanName\",\n        salesmanid as \"salesmanId\",\n        regionnumber as \"regionNumber\",\n        showroomid as \"showroomId\",\n        usergroupid as \"userGroupId\",\n        visitormobilenumber as \"visitorMobileNumber\",\n        visitorname as \"visitorName\",\n        purchased as \"purchased\",\n        visitortype as \"visitorType\",\n        reasonfornotpurchase as \"description\",\n        dataareaid as \"dataareaid\"\n         from visitcustomer where visitorsequencenumber Ilike '%" + param.key + "%' and dataareaid='" + this.sessionInfo.dataareaid + "' limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_salesQuotation = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "SALESQUOTATION";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_designerService = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "DESIGNERSERVICE";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_salesOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind1 = "SALESORDER";
                        param.transkind2 = "RESERVED";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_salesOrderForReturnOrderPage = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "SALESORDER";
                        param.status = "PAID','POSTED";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_returnOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "RETURNORDER";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_designerServiceReturn = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "DESIGNERSERVICERETURN";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_inventoryMovement = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "INVENTORYMOVEMENT";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_transferOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "TRANSFERORDER";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_pendingTransferOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "TRANSFERORDER";
                        param.status = "REQUESTED";
                        query = "Select salestable.salesid as salesid, salestable.salesname as salesname, inventlocationid as inventlocationid\n                 from salestable where  salestable.custaccount='" + this.sessionInfo.inventlocationid + "' and status = 'REQUESTED' and salesid ILike '%" + param.key + "%' ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_shipmentOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "ORDERSHIPMENT";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_recieveOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "ORDERRECIEVE";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_purchaseQuotation = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "PURCHASEREQUEST";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_purchaseOrder = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "PURCHASEORDER";
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_purchaseOrderForReturnOrderPage = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "PURCHASEORDER";
                        param.status = "PAID";
                        param.cond = true;
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_purchaseReturn = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        param.transkind = "PURCHASERETURN";
                        param.cond = true;
                        return [4 /*yield*/, this.search_salesTable(param)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.search_salesTable = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "Select salestable.salesid as salesid, salestable.salesname as salesname, \n                        \n                        " + (param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? " vendortable.name as name, vendortable.namealias as namealias"
                            : " custtable.name as name, custtable.namealias as namealias") + "\n                        from salestable \n                        " + (param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? "  left join vendortable on vendortable.accountnum = salestable.custaccount"
                            : "  left join custtable on custtable.accountnum = salestable.custaccount") + "\n                       \n                        where salestable.dataareaid='" + this.sessionInfo.dataareaid + "' and (salestable.inventlocationid='" + this.sessionInfo.inventlocationid + "' or\n                        salestable.custaccount='" + this.sessionInfo.inventlocationid + "' " + (!param.cond == true ? "or salestable.jazeerawarehouse='" + this.sessionInfo.inventlocationid + "'" : "") + ")\n                        and (salestable.salesid  ILike '%" + param.key + "%' or salestable.salesname  ILike '%" + param.key + "%' or\n                         " + (param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? "vendortable.name"
                            : "custtable.name") + " ILike '%" + param.key + "%' or  " + (param.transkind == "PURCHASEORDER" || param.transkind == "PURCHASERETURN"
                            ? "vendortable.namealias"
                            : "custtable.namealias") + "  ILike '%" + param.key + "%') ";
                        if (param.transkind1 && param.transkind2) {
                            query += "and (salestable.transkind='" + param.transkind1 + "' or salestable.transkind='" + param.transkind2 + "')  ";
                        }
                        else if (param.transkind) {
                            query += "and salestable.transkind='" + param.transkind + "'";
                        }
                        if (param.status) {
                            query += "and salestable.status in ('" + param.status + "') ";
                        }
                        query += " LIMIT 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.search_custpaymmode = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select * from custpaymmodetable";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.search_paymterm = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select * from paymterm";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_4 = _a.sent();
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.countries = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select id as code, name as namear, nameeng as nameen from country";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_5 = _a.sent();
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.cities = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select cityname as nameen, citynamearb as namear, citycode as citycode from citymast";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_6 = _a.sent();
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.districts = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select districtname as nameen, districtnamearb as namear, districtcode, citycode from districtmast";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_7 = _a.sent();
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.salesman = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select name as \"name\",\n                description as \"nameAlias\",\n                dimensioncode as  dimensioncode,\n                num as salesmanid\n                from dimensions where num = (select salesmanid from usergroupconfig where id = '" + this.sessionInfo.usergroupconfigid + "')";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_8 = _a.sent();
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.locationsalesman = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select name as \"name\",\n                description as \"nameAlias\",\n                dimensioncode as  dimensioncode,\n                num as salesmanid\n                from dimensions where num in  (select salesmanid from usergroupconfig where inventlocationid = '" + this.sessionInfo.inventlocationid + "')";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_9 = _a.sent();
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.currency = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "select currencycode as currencycode from currency";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        // console.log(data);
                        return [2 /*return*/, data];
                    case 2:
                        error_10 = _a.sent();
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.custtype = function () {
        var data = [
            {
                custtype: 1,
                custypenameen: "Individual",
                custtypenamear: "أفراد"
            },
            {
                custtype: 2,
                custypenameen: "Painters",
                custtypenamear: "دهان"
            },
            {
                custtype: 3,
                custypenameen: "Paints Contractor",
                custtypenamear: "دهان مقاول - مؤسسات"
            },
            {
                custtype: 4,
                custypenameen: "Interior Designer",
                custtypenamear: "مصمم داخلي"
            },
            {
                custtype: 5,
                custypenameen: "Decoration Shops",
                custtypenamear: "محلات الديكور"
            },
            {
                custtype: 6,
                custypenameen: "Family",
                custtypenamear: "عوائل"
            },
            {
                custtype: 7,
                custypenameen: "Real Estate",
                custtypenamear: "العقاريون"
            },
            {
                custtype: 8,
                custypenameen: "Tile Workers",
                custtypenamear: "مبلطين"
            },
            {
                custtype: 9,
                custypenameen: "ISOLATION",
                custtypenamear: "عوازل"
            }
        ];
        return data;
    };
    LoadService.prototype.movementName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select journalnameid as \"movementName\" from usergroupconfig where id='" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.length > 0 ? data[0] : { movementName: "" }];
                }
            });
        });
    };
    LoadService.prototype.movementType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select * from movementtype";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.jazeerawarehouses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var warehouseQuery, regionalWarehouses, inQueryStr, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        warehouseQuery = "select regionalwarehouse from usergroupconfig where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        regionalWarehouses = _a.sent();
                        inQueryStr = "";
                        if (!(regionalWarehouses.length > 0)) return [3 /*break*/, 5];
                        if (!regionalWarehouses[0].regionalwarehouse) return [3 /*break*/, 3];
                        regionalWarehouses[0].regionalwarehouse.split(",").map(function (item) {
                            inQueryStr += "'" + item + "',";
                        });
                        inQueryStr += "'" + this.sessionInfo.inventlocationid + "'";
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid in (" + inQueryStr + ") order by namealias";
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.warehouses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var warehouseQuery, regionalWarehouses, inQueryStr, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        warehouseQuery = "select warehouse from usergroupconfig where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        regionalWarehouses = _a.sent();
                        inQueryStr = "";
                        if (!(regionalWarehouses.length > 0)) return [3 /*break*/, 5];
                        if (!regionalWarehouses[0].warehouse) return [3 /*break*/, 3];
                        regionalWarehouses[0].warehouse.split(",").map(function (item) {
                            inQueryStr += "'" + item + "',";
                        });
                        inQueryStr += "'" + this.sessionInfo.inventlocationid + "'";
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid in (" + inQueryStr + ")";
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.agentwarehouses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var warehouseQuery, jazeeraWarehouses, inQueryStr_1, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        warehouseQuery = "select agentwarehouses from usergroupconfig where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        jazeeraWarehouses = _a.sent();
                        if (!(jazeeraWarehouses.length > 0)) return [3 /*break*/, 5];
                        if (!jazeeraWarehouses[0].agentwarehouses) return [3 /*break*/, 3];
                        inQueryStr_1 = "";
                        jazeeraWarehouses[0].agentwarehouses.split(",").map(function (item) {
                            inQueryStr_1 += "'" + item + "',";
                        });
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid in (" + inQueryStr_1.substr(0, inQueryStr_1.length - 1) + ")";
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.warehouseName = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid ='" + param.key + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? data[0] : {}];
                }
            });
        });
    };
    LoadService.prototype.workflowconditionsforreturnorder = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select \n            returnorderapprovalrequired , \n            returnorderrmapprovalrequired,\n            returnorderraapprovalrequired, \n            projectcustomer, \n            agentcustomer from usergroupconfig\n            where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data ? data[0] : {}];
                }
            });
        });
    };
    LoadService.prototype.usergroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select groupid, groupname from usergroup where deleted != true or deleted is NULL";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.vendors = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var vendorsQuery, vendorslist, inQueryStr, query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vendorsQuery = "select vendors from usergroupconfig where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(vendorsQuery)];
                    case 1:
                        vendorslist = _a.sent();
                        console.log(vendorslist);
                        inQueryStr = "";
                        if (!(vendorslist.length > 0)) return [3 /*break*/, 5];
                        if (!vendorslist[0].vendors) return [3 /*break*/, 3];
                        vendorslist[0].vendors.split(",").map(function (item) {
                            inQueryStr += "'" + item + "',";
                        });
                        query = "select accountnum, \n                                    name,\n                                    namealias,\n                                    address,\n                                    phone,\n                                    vendgroup,\n                                    inventlocation,\n                                    currency\n                                    from vendortable where accountnum in (" + inQueryStr.substr(0, inQueryStr.length - 1) + ") ";
                        if (param.key) {
                            query += " and (accountnum ILIKE '%" + param.key + "%' or name ILIKE '%" + param.key + "%' or namealias ILIKE '%" + param.key + "%') ";
                        }
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 3: return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, []];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.showrooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, warehouseQuery, regionalWarehouses, inQueryStr_2, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        warehouseQuery = "select regionalwarehouse from usergroupconfig where id= '" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(warehouseQuery)];
                    case 1:
                        regionalWarehouses = _a.sent();
                        console.log(regionalWarehouses);
                        if (!(regionalWarehouses.length > 0)) return [3 /*break*/, 5];
                        if (!regionalWarehouses[0].regionalwarehouse) return [3 /*break*/, 3];
                        inQueryStr_2 = "";
                        regionalWarehouses[0].regionalwarehouse.split(",").map(function (item) {
                            inQueryStr_2 += "'" + item + "',";
                        });
                        query = "select inventlocationid, name, namealias from inventlocation where inventlocationid in (" + inQueryStr_2.substr(0, inQueryStr_2.length - 1) + ")";
                        return [4 /*yield*/, this.db.query(query)];
                    case 2:
                        data = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        data = [];
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        data = [];
                        _a.label = 6;
                    case 6:
                        result = [
                            {
                                inventlocationid: "ALL",
                                name: "الكل",
                                namealias: "All"
                            }
                        ];
                        data.sort(function (a, b) {
                            var nameA = a.name;
                            var nameB = b.name;
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });
                        return [2 /*return*/, result.concat(data)];
                }
            });
        });
    };
    LoadService.prototype.products = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct\n        b.itemid as \"itemid\",\n        b.namealias as \"nameEn\",\n        b.itemname as nameAr\n        from  inventtable b\n        where b.itemid Ilike '%" + param.param + "%' or b.namealias Ilike '%" + param.param + "%' or b.itemname Ilike '%" + param.param + "%' limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    LoadService.prototype.colors = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct\n        c.name as \"nameEn\", \n        c.name as \"nameAr\",\n        c.configid as configid,\n        c.hexcode as \"hex\"\n        from configtable c where c.configid Ilike '%" + param.param + "%' or c.name Ilike '%" + param.param + "%' or c.name Ilike '%" + param.param + "%' limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.sizes = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct\n        s.description as \"nameEn\", \n        s.name as \"nameAr\",\n        s.inventsizeid as inventsizeid\n        from inventsize s where s.inventsizeid Ilike '%" + param.param + "%' or s.description Ilike '%" + param.param + "%' or s.name Ilike '%" + param.param + "%' limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.batches = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct\n        i.inventbatchid as \"batchNo\", \n        i.itemid as \"itemId\"\n        from inventbatch i \n         where  i.inventbatchid Ilike '%" + param.param + "%' limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.dimensions = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = "select \n            description as \"nameArabic\",\n            name as \"NameEn\",\n            num as num,\n            dimensioncode as \"DimensionCode\",\n            closed\n            from dimensions\n             where dimensioncode=" + Props_1.Props.DIMENSION_CODE[param.key];
                return [2 /*return*/, this.db.query(query)];
            });
        });
    };
    LoadService.prototype.accountType = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accountType;
            return __generator(this, function (_a) {
                accountType = [
                    {
                        accountType: 0,
                        accountTypeName: "Profit And Loss"
                    },
                    {
                        accountType: 1,
                        accountTypeName: "Revenue"
                    },
                    {
                        accountType: 2,
                        accountTypeName: "Cost"
                    },
                    {
                        accountType: 3,
                        accountTypeName: "Balance"
                    },
                    {
                        accountType: 4,
                        accountTypeName: "Asset"
                    },
                    {
                        accountType: 5,
                        accountTypeName: "Liability"
                    },
                    {
                        accountType: 6,
                        accountTypeName: "Header"
                    },
                    {
                        accountType: 9,
                        accountTypeName: "Total"
                    },
                    {
                        accountType: 10,
                        accountTypeName: "Group Total"
                    }
                ];
                return [2 /*return*/, accountType];
            });
        });
    };
    LoadService.prototype.dimentionOptions = function () {
        var options = [
            {
                value: 0,
                text: "Optional"
            },
            {
                value: 1,
                text: "ToBeFilledIn"
            },
            {
                value: 2,
                text: "List"
            },
            {
                value: 3,
                text: "Fixed"
            }
        ];
        return options;
    };
    LoadService.prototype.chartOfAccounts = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select \n        accountnum as \"accountNum\",\n        accountname as \"accountName\",\n        accountpltype as accounttype,\n        dimension as \"region\",\n        dimension2_ as \"department\",\n        dimension3_ as \"costcenter\",\n        dimension4_ as \"employee\",\n        dimension5_ as \"project\",\n        dimension6_ as \"salesman\",\n        dimension7_ as \"brand\",\n        dimension8_ as \"productline\",\n        mandatorydimension as \"mandatoryRegion\",\n        mandatorydimension2_ as \"mandatorydDepartment\",\n        mandatorydimension3_ as \"mandatoryCostcenter\",\n        mandatorydimension4_ as \"mandatoryEmployee\",\n        mandatorydimension5_ as \"mandatoryProject\",\n        mandatorydimension6_ as \"mandatorySalesman\",\n        mandatorydimension7_ as \"mandatoryBrand\",\n        mandatorydimension8_ as \"mandatoryproductLine\"\n        from accountstable where\n        (accountnum ILIKE '%" + param.key + "%' or accountname ILIKE '%" + param.key + "%') and \n        dataareaid = '" + this.sessionInfo.dataareaid + "' and closed=0 and locked=0 and accountpltype in (0, 1,2,4,5) limit 15";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.propertytype = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            id: 0,
                            name: "Fixed Asset",
                            nameArabic: "Fixed Asset"
                        },
                        {
                            id: 1,
                            name: "Continue Property",
                            nameArabic: "Continue Property"
                        },
                        {
                            id: 2,
                            name: "Other",
                            nameArabic: "Other"
                        }
                    ]];
            });
        });
    };
    LoadService.prototype.assettype = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, [
                        {
                            id: 0,
                            name: "Tangible",
                            nameArabic: "Tangible"
                        },
                        {
                            id: 1,
                            name: "Intangible",
                            nameArabic: "Intangible"
                        },
                        {
                            id: 2,
                            name: "Financial",
                            nameArabic: "Financial"
                        },
                        {
                            id: 3,
                            name: "Land and Building",
                            nameArabic: "Land and Building"
                        },
                        {
                            id: 4,
                            name: "Goodwill",
                            nameArabic: "Goodwill"
                        },
                        {
                            id: 5,
                            name: "Other",
                            nameArabic: "Other"
                        }
                    ]];
            });
        });
    };
    LoadService.prototype.numbersequence = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n        select recid as id,\n        numbersequence as numbersequence,\n        format as format,\n        dataareaid as dataareaid\n        from numbersequencetable\n        ";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.assetcondition = function () {
        return [
            {
                value: "USABLE",
                text: "Usable"
            },
            {
                value: "NOTUSABLE",
                text: "Not Usable"
            },
            {
                value: "SOLD",
                text: "Sold"
            },
            {
                value: "WRITEOFF",
                text: "WriteOff"
            }
        ];
    };
    LoadService.prototype.periodfreequency = function () {
        return [
            {
                value: 12,
                text: "Monthly"
            },
            {
                value: 3,
                text: "Quarterly"
            },
            {
                value: 2,
                text: "Half Yearly"
            },
            {
                value: 1,
                text: "Yearly"
            }
        ];
    };
    LoadService.prototype.years = function () {
        var data = [];
        var currentYear = new Date().getFullYear();
        for (var i = 0; i < 99; i++) {
            data.push({
                yearNo: currentYear
            });
            currentYear += 1;
        }
        return data;
    };
    LoadService.prototype.months = function () {
        var data = [
            {
                month: "January",
                value: 1
            },
            {
                month: "February",
                value: 2
            },
            {
                month: "March",
                value: 3
            },
            {
                month: "April",
                value: 4
            },
            {
                month: "May",
                value: 5
            },
            {
                month: "June",
                value: 6
            },
            {
                month: "July",
                value: 7
            },
            {
                month: "August",
                value: 8
            },
            {
                month: "Sepetember",
                value: 9
            },
            {
                month: "October",
                value: 10
            },
            {
                month: "November",
                value: 12
            },
            {
                month: "December",
                value: 13
            }
        ];
        return data;
    };
    LoadService.prototype.JournalName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select journalnameid as \"JournalName\" from usergroupconfig where id='" + this.sessionInfo.usergroupconfigid + "' limit 1";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0].JournalName.split(",") : [];
                        result = [];
                        data.forEach(function (ele) {
                            result.push({
                                name: ele
                            });
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    };
    LoadService.prototype.assetgroup = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select groupid as \"assetGroup\", name as name, namealias as \"nameAlias\" from \n        fixedassetgroup where groupid ILIKE '%" + param.key + "%' or name ILIKE '%" + param.key + "%' or namealias ILIKE '%" + param.key + "%'";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.checkfordiscounts = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var promotionalDiscountQuery, buyOneGetOneDiscountQuery, data, freebieItems, freebieItemsArray_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promotionalDiscountQuery = "select\n                                                    dataareaid, \n                                                    inventlocationid, \n                                                    itemid,\n                                                    inventsizeid,\n                                                    configid,\n                                                    multiple_qty as \"multipleQty\", \n                                                    free_qty as \"freeQty\", \n                                                    price_disc_item_code as \"priceDiscItemCode\", \n                                                    price_disc_account_relation as \"priceDiscAccountRelation\"\n                                                    from sales_promotion_items where \n                                                    inventlocationid = '" + this.sessionInfo.inventlocationid + "'\n                                                    and (price_disc_account_relation = '" + param.custaccount + "' \n                                                    or price_disc_account_relation='" + param.custtype + "' or price_disc_item_code=2)\n                                                    and itemid = '" + param.itemid + "'";
                        buyOneGetOneDiscountQuery = "select\n                                                    dataareaid, \n                                                    inventlocationid, \n                                                    itemid,\n                                                    inventsizeid,\n                                                    configid,\n                                                    multiple_qty as \"multipleQty\", \n                                                    free_qty as \"freeQty\", \n                                                    price_disc_item_code as \"priceDiscItemCode\", \n                                                    price_disc_account_relation as \"priceDiscAccountRelation\"\n                                                    from sales_promotion_items_equal where \n                                                    inventlocationid = '" + this.sessionInfo.inventlocationid + "'\n                                                    and (price_disc_account_relation = '" + param.custaccount + "' \n                                                    or price_disc_account_relation='" + param.custtype + "' or price_disc_item_code=2)\n                                                    and itemid = '" + param.itemid + "'";
                        return [4 /*yield*/, this.db.query(buyOneGetOneDiscountQuery)];
                    case 1:
                        data = _a.sent();
                        if (!(data.length > 0)) return [3 /*break*/, 3];
                        data = data[0];
                        data.discountType = "BUY_ONE_GET_ONE";
                        return [4 /*yield*/, this.db.query("select itemid from inventtable where itemgroupid in (select itemgroupid from inventtable where itemid='" + param.itemid + "')")];
                    case 2:
                        freebieItems = _a.sent();
                        freebieItemsArray_1 = [];
                        freebieItems.map(function (v) {
                            freebieItemsArray_1.push(v.itemid);
                        });
                        data.freebieItems = freebieItemsArray_1;
                        return [2 /*return*/, data];
                    case 3: return [4 /*yield*/, this.db.query(promotionalDiscountQuery)];
                    case 4:
                        data = _a.sent();
                        if (data.length > 0) {
                            data = data[0];
                            data.discountType = "PROMOTIONAL_DISCOUNT";
                            data.freebieItems = [param.itemid];
                            return [2 /*return*/, data];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, {}];
                }
            });
        });
    };
    LoadService.prototype.itemslist = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select id, name_en as \"nameEn\", name_ar as \"nameAr\", code as \"baseCode\" from bases where code ILIKE '%" + param.key + "%' or name_en ILIKE '%" + param.key + "%' or name_ar ILIKE '%" + param.key + "%'  limit 20";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.sizeslist = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select id, name_en as \"nameEn\", name_ar as \"nameAr\", code as \"sizeCode\" from sizes  where code ILIKE '%" + param.key + "%' or name_en ILIKE '%" + param.key + "%' or name_ar ILIKE '%" + param.key + "%' limit 20";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.colorslist = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select id, name_en as \"nameEn\", name_ar as \"nameAr\", code as \"colorCode\", hex as \"hexCode\" from colors where code ILIKE '%" + param.key + "%' or name_en ILIKE '%" + param.key + "%' or name_ar ILIKE '%" + param.key + "%'  limit 20";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.batcheslist = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct inventbatchid as batchno, itemid as itemid, configid as configid from inventbatch where inventbatchid ILIKE '%" + param.batchno + "%' and configid = '" + param.configid + "' and itemid = '" + param.itemid + "' limit 10";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        data.push({
                            batchno: "-",
                            itemid: "-",
                            configid: "-"
                        });
                        return [2 /*return*/, data];
                }
            });
        });
    };
    LoadService.prototype.validatebatchno = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select distinct inventbatchid as batchno, itemid as itemid, configid as configid from inventbatch where inventbatchid = '" + param.batchno + "' and configid = '" + param.configid + "' and itemid = '" + param.itemid + "' limit 10";
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.length > 0 || param.batchno == "-" ? true : false];
                }
            });
        });
    };
    LoadService.prototype.checkInstantDiscount = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rawQuery.checkInstantDiscount(param.key)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.length > 0 ? { cond: true, amount: data[0].minamount } : { cond: false, amount: 0 }];
                }
            });
        });
    };
    LoadService.prototype.getHSNData = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var offset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!param.key)
                            return [2 /*return*/, "key is required!"];
                        offset = param.param ? param.param : 0;
                        return [4 /*yield*/, this.db.query("select configid from pricedisctable where itemrelation = 'HSN-00001' \n        and configid ilike '%" + param.key + "%' group by configid limit 15 offset " + offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadService.prototype.checkIsBase = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!param.key)
                            return [2 /*return*/, "key is required!"];
                        return [4 /*yield*/, this.db.query("select itemid, citbaseproduct from inventtable where itemid = '" + param.key + "'")];
                    case 1:
                        data = _a.sent();
                        if (data.length > 0) {
                            if (data[0].itemid != data[0].citbaseproduct) {
                                return [2 /*return*/, true];
                            }
                            else {
                                return [2 /*return*/, false];
                            }
                        }
                        else {
                            throw { message: "INVALID ID" };
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _a.sent();
                        return [2 /*return*/, error_11];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.checkForColorantOption = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db.query("select nocolorantcheckgroup, blocklistedbasecolor from usergroupconfig where id = '" + this.sessionInfo.usergroupconfigid + "'")];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0] : {};
                        data.nocolorantcheckgroup = data.nocolorantcheckgroup ? data.nocolorantcheckgroup.split(",") : [];
                        data.blocklistedbasecolor = data.blocklistedbasecolor ? data.blocklistedbasecolor.split(",") : [];
                        return [2 /*return*/, data];
                    case 2:
                        error_12 = _a.sent();
                        return [2 /*return*/, error_12];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadService.prototype.instantDiscountExcludeItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query("select istantdiscountexclude from usergroupconfig where id = '" + this.sessionInfo.usergroupconfigid + "'")];
                    case 1:
                        data = _a.sent();
                        data = data.length > 0 ? data[0].istantdiscountexclude.split(",") : [];
                        return [2 /*return*/, data];
                }
            });
        });
    };
    LoadService.prototype.checkForOrderReceive = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var shipOrderData, receiveOrderData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.query("select salesid, custaccount, inventlocationid from salestable where salesid = '" + param.key + "'")];
                    case 1:
                        shipOrderData = _a.sent();
                        shipOrderData = shipOrderData.length > 0 ? shipOrderData[0] : null;
                        console.log(this.sessionInfo.inventlocationid);
                        if (!(shipOrderData && shipOrderData.custaccount == this.sessionInfo.inventlocationid)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.query("select salesid, custaccount, inventlocationid from salestable where intercompanyoriginalsalesid = '" + param.key + "'")];
                    case 2:
                        receiveOrderData = _a.sent();
                        return [2 /*return*/, receiveOrderData.length > 0 ? false : true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    return LoadService;
}());
exports.LoadService = LoadService;
