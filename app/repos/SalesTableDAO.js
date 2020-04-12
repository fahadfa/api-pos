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
var SalesTable_1 = require("../../entities/SalesTable");
var SalesTableDAO = /** @class */ (function () {
    function SalesTableDAO() {
        this.dao = typeorm_1.getRepository(SalesTable_1.SalesTable);
        this.db = typeorm_1.getManager();
    }
    SalesTableDAO.prototype.getDAO = function () {
        return this.dao;
    };
    SalesTableDAO.prototype.entity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dao.findOne(id, {
                        relations: [
                            "warehouse",
                            // "customer",
                            "movementType",
                            // "toWarehouse",
                            "salesLine",
                            // "salesLine.appliedDiscounts",
                            // "salesLine.product",
                            "salesLine.color",
                            "salesLine.size",
                            "salesLine.size.product"
                        ]
                        // select: ["salesId", "inventLocationId"]
                    })];
            });
        });
    };
    SalesTableDAO.prototype.search = function (data, type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(type && type == "purchasereturn")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dao
                                .createQueryBuilder("SalesTable")
                                .leftJoin("SalesTable.warehouse", "warehouse")
                                .leftJoin("SalesTable.movementType", "movementType")
                                .addSelect("warehouse.name")
                                .addSelect("warehouse.nameAlias")
                                .addSelect("movementType.id")
                                .addSelect("movementType.movementType")
                                .addSelect("movementType.movementArabic")
                                .where(data)
                                .andWhere("SalesTable.transkind != 'SALESORDER'")
                                .orderBy("SalesTable.createddatetime", "DESC")
                                .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.dao
                            .createQueryBuilder("SalesTable")
                            .leftJoin("SalesTable.warehouse", "warehouse")
                            .leftJoin("SalesTable.movementType", "movementType")
                            .addSelect("warehouse.name")
                            .addSelect("warehouse.nameAlias")
                            .addSelect("movementType.id")
                            .addSelect("movementType.movementType")
                            .addSelect("movementType.movementArabic")
                            .where(data)
                            .orderBy("SalesTable.createddatetime", "DESC")
                            .getMany()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableDAO.prototype.delete = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dao.remove([data])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableDAO.prototype.findOne = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data);
                        return [4 /*yield*/, this.dao.findOne(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableDAO.prototype.find = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data);
                        return [4 /*yield*/, this.dao.findOne(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableDAO.prototype.pagination = function (data, inventlocationid) {
        return __awaiter(this, void 0, void 0, function () {
            var result, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        query = "";
                        switch (data.type) {
                            case "movement":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouse_name\", \n                    \"warehouse\".\"namealias\" AS \"warehouse_namealias\",\n                    \"movementType\".\"id\" AS \"movementTypeId\", \n                    \"movementType\".\"movementtype\" AS \"movementType\", \n                    \"movementType\".\"movementarabic\" AS \"movementTypeArabic\",\n                    \"SalesTable\".\"description\" AS \"description\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"  \n                    LEFT JOIN \"movementtype\" \"movementType\" ON \"movementType\".\"id\"=\"SalesTable\".\"movement_type_id\"  \n                    LEFT JOIN \"custtable\" \"customer\" ON \"customer\".\"accountnum\"=\"SalesTable\".\"custaccount\" WHERE \"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' ";
                                if (data.filter) {
                                    query += "and (\"SalesTable\".\"salesid\" ILike '%" + data.filter + "%' or  \n                    \"SalesTable\".\"salesname\" ILike '%" + data.filter + "%' or \n                    \"movementType\".\"movementtype\" ILike '%" + data.filter + "%')";
                                }
                                query += " AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC offset " + (data.page - 1) * data.pageCount + " limit " + data.pageCount;
                                break;
                            case "transferorder":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"towarehouse\".\"name\" AS \"toWarehouseAr\", \n                    \"towarehouse\".\"namealias\" AS \"toWarehouseEn\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"fromWarehouseAr\", \n                    \"warehouse\".\"namealias\" AS \"fromWarehouseEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"\n                    LEFT JOIN \"inventlocation\" \"towarehouse\" ON \"towarehouse\".\"inventlocationid\"=\"SalesTable\".\"custaccount\"  \n                    WHERE (\"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' or \"SalesTable\".\"custaccount\" = '" + inventlocationid + "') ";
                                if (data.filter) {
                                    query += "and (\"SalesTable\".\"salesid\" ILike '%" + data.filter + "%' or  \n                        \"SalesTable\".\"salesname\" ILike '%" + data.filter + "%' or \n                        \"SalesTable\".\"custaccount\" ILike '%" + data.filter + "%' or\n                        \"towarehouse\".\"name\" ='%" + data.filter + "%' or\n                        \"towarehouse\".\"namealias\" = '%" + data.filter + "%' or\n                        \"warehouse\".\"name\" ='%" + data.filter + "%' or\n                        \"warehouse\".\"namealias\" = '%" + data.filter + "%' or\n                        \"SalesTable\".\"transkind\" = '%" + data.filter + "%')\n                        ";
                                }
                                query += "AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC offset " + (data.page - 1) * data.pageCount + " limit " + data.pageCount;
                                break;
                            default:
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"customer\".\"name\" AS \"customerNameAr\", \n                    \"customer\".\"namealias\" AS \"customerNameEn\",\n                    \"customer\".\"phone\" AS \"phone\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouseNameAr\", \n                    \"warehouse\".\"namealias\" AS \"warehouseNameEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\",\n                    \"customer\".\"custtype\" as custtype\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"\n                    LEFT JOIN \"custtable\" \"customer\" ON \"customer\".\"accountnum\"=\"SalesTable\".\"custaccount\"\n                    WHERE \"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' ";
                                if (data.filter) {
                                    query += "and (\"SalesTable\".\"salesid\" ILike '%" + data.filter + "%' or  \n                            \"SalesTable\".\"salesname\" ILike '%" + data.filter + "%' or \n                            \"SalesTable\".\"custaccount\" ILike '%" + data.filter + "%' or\n                            \"customer\".\"name\"='%" + data.filter + "%' or\n                            \"customer\".\"namealias\"='%" + data.filter + "%' or\n                            \"customer\".\"phone\"='%" + data.filter + "%'\n                            )";
                                }
                                query += "AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC offset " + (data.page - 1) * data.pageCount + " limit " + data.pageCount;
                                break;
                        }
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SalesTableDAO.prototype.searchorders = function (data, inventlocationid) {
        return __awaiter(this, void 0, void 0, function () {
            var result, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        query = "";
                        switch (data.type) {
                            case "movement":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouse_name\", \n                    \"warehouse\".\"namealias\" AS \"warehouse_namealias\",\n                    \"movementType\".\"id\" AS \"movementTypeId\", \n                    \"movementType\".\"movementtype\" AS \"movementType\", \n                    \"movementType\".\"movementarabic\" AS \"movementTypeArabic\",\n                    \"SalesTable\".\"description\" AS \"description\",\n                    \"SalesTable\".lastmodifieddate As \"lastModifiedDate\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"  \n                    LEFT JOIN \"movementtype\" \"movementType\" ON \"movementType\".\"id\"=\"SalesTable\".\"movement_type_id\"  \n                    LEFT JOIN \"custtable\" \"customer\" ON \"customer\".\"accountnum\"=\"SalesTable\".\"custaccount\" WHERE \"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' \n                     AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC ";
                                break;
                            case "transferorder":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"towarehouse\".\"name\" AS \"toWarehouseAr\", \n                    \"towarehouse\".\"namealias\" AS \"toWarehouseEn\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"fromWarehouseAr\", \n                    \"warehouse\".\"namealias\" AS \"fromWarehouseEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\",\n                    \"SalesTable\".lastmodifieddate As \"lastModifiedDate\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"custaccount\"\n                    LEFT JOIN \"inventlocation\" \"towarehouse\" ON \"towarehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"  \n                    WHERE (\"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' or (\"SalesTable\".\"custaccount\" = '" + inventlocationid + "' and \"SalesTable\".\"status\" !='CREATED')) \n                    AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC";
                                break;
                            case "purchaseorder":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"vendor\".\"name\" AS \"vendorNameAr\", \n                    \"vendor\".\"namealias\" AS \"vendorNameEn\",\n                    \"vendor\".\"phone\" AS \"phone\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouseNameAr\", \n                    \"warehouse\".\"namealias\" AS \"warehouseNameEn\",\n                    \"jazeerawarehouse\".\"name\" AS \"jazeeraWarehouseNameAr\", \n                    \"jazeerawarehouse\".\"namealias\" AS \"jazeeraWarehouseNameEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\",\n                    \"SalesTable\".\"jazeerawarehouse\" As \"jazeeraWarehouse\",\n                    \"SalesTable\".lastmodifieddate As \"lastModifiedDate\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"\n                    LEFT JOIN \"inventlocation\" \"jazeerawarehouse\" ON \"jazeerawarehouse\".\"inventlocationid\"=\"SalesTable\".\"jazeerawarehouse\"\n                    LEFT JOIN \"vendortable\" \"vendor\" ON \"vendor\".\"accountnum\"=\"SalesTable\".\"custaccount\"\n                    WHERE (\"SalesTable\".\"jazeerawarehouse\" = '" + inventlocationid + "' or \"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "')\n                    AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC ";
                                break;
                            case "purchasereturn":
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"vendor\".\"name\" AS \"vendorNameAr\", \n                    \"vendor\".\"namealias\" AS \"vendorNameEn\",\n                    \"vendor\".\"phone\" AS \"phone\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouseNameAr\", \n                    \"warehouse\".\"namealias\" AS \"warehouseNameEn\",\n                    \"jazeerawarehouse\".\"name\" AS \"jazeeraWarehouseNameAr\", \n                    \"jazeerawarehouse\".\"namealias\" AS \"jazeeraWarehouseNameEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\",\n                    \"SalesTable\".\"jazeerawarehouse\" As \"jazeeraWarehouse\",\n                    \"SalesTable\".lastmodifieddate As \"lastModifiedDate\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"\n                    LEFT JOIN \"inventlocation\" \"jazeerawarehouse\" ON \"jazeerawarehouse\".\"inventlocationid\"=\"SalesTable\".\"jazeerawarehouse\"\n                    LEFT JOIN \"vendortable\" \"vendor\" ON \"vendor\".\"accountnum\"=\"SalesTable\".\"custaccount\"\n                    WHERE \"SalesTable\".\"jazeerawarehouse\" = '" + inventlocationid + "' \n                    AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC ";
                                break;
                            default:
                                query = "SELECT \"SalesTable\".\"salesid\" AS \"salesId\", \n                    \"SalesTable\".\"salesname\" AS \"salesName\", \n                    \"SalesTable\".\"custaccount\" AS \"custAccount\", \n                    \"customer\".\"name\" AS \"customerNameAr\", \n                    \"customer\".\"namealias\" AS \"customerNameEn\",\n                    \"customer\".\"phone\" AS \"phone\",\n                    \"SalesTable\".\"createddatetime\" AS \"createddatetime\", \n                    \"SalesTable\".\"inventlocationid\" AS \"inventLocationId\", \n                    \"SalesTable\".\"transkind\" AS \"transkind\", \n                    \"SalesTable\".\"status\" AS \"status\", \n                    \"warehouse\".\"name\" AS \"warehouseNameAr\", \n                    \"warehouse\".\"namealias\" AS \"warehouseNameEn\",\n                    \"SalesTable\".\"description\" AS \"description\", \n                    \"SalesTable\".\"intercompanyoriginalsalesid\" AS \"interCompanyOriginalSalesid\",\n                    \"SalesTable\".\"jazeerawarehouse\" As \"jazeeraWarehouse\",\n                    \"SalesTable\".lastmodifieddate As \"lastModifiedDate\"\n                    FROM \"salestable\" \"SalesTable\" \n                    LEFT JOIN \"inventlocation\" \"warehouse\" ON \"warehouse\".\"inventlocationid\"=\"SalesTable\".\"inventlocationid\"\n                    LEFT JOIN \"custtable\" \"customer\" ON \"customer\".\"accountnum\"=\"SalesTable\".\"custaccount\"\n                    WHERE \"SalesTable\".\"inventlocationid\" = '" + inventlocationid + "' \n                    AND \"SalesTable\".\"transkind\" IN " + data.transkind + " ORDER BY \"SalesTable\".\"lastmodifieddate\" DESC ";
                                break;
                        }
                        return [4 /*yield*/, this.db.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SalesTableDAO.prototype.save = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dao.save(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SalesTableDAO.prototype.searchVisitors = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "select s.salesname ,sl.salesqty ,s.mobileno ,s.amount,s.currencycode, sl.salesunit ,  \n        sl.itemid,c.cityname ,c.citynamearb as citynamear,it.int_ext,s.lastmodifieddate from salestable s\n        inner join salesline sl on sl.salesid =s.salesid \n        inner join inventtable it on sl.itemid =it.itemid \n        inner join citymast c on c.cityname =s.citycode \n        where s.inventlocationid ='" + data.inventlocationid + "' \n        and it.int_ext != 0\n        and transkind in ('SALESORDER') \n        and s.lastmodifieddate >= current_date - interval '15' day \n        order by s.lastmodifieddate ;";
                        return [4 /*yield*/, this.dao.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SalesTableDAO;
}());
exports.SalesTableDAO = SalesTableDAO;
Object.seal(SalesTableDAO);
