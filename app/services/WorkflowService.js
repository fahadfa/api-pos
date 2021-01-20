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
var App_1 = require("../../utils/App");
var typeorm_1 = require("typeorm");
var WorkflowDAO_1 = require("../repos/WorkflowDAO");
var Props_1 = require("../../constants/Props");
var RawQuery_1 = require("../common/RawQuery");
var SalesTableDAO_1 = require("../repos/SalesTableDAO");
var Workflow_1 = require("../../entities/Workflow");
var SalesTable_1 = require("../../entities/SalesTable");
var SelectedLines_1 = require("../../entities/SelectedLines");
var UsergroupconfigDAO_1 = require("../repos/UsergroupconfigDAO");
var UpdateInventoryService_1 = require("../services/UpdateInventoryService");
var InventtransService_1 = require("../services/InventtransService");
var InventTransDAO_1 = require("../repos/InventTransDAO");
var Watcher_1 = require("../../utils/Watcher");
var typeorm_2 = require("typeorm");
var ENV_STORE_ID = process.env ? process.env.ENV_STORE_ID : null;
var WorkflowService = /** @class */ (function () {
    function WorkflowService() {
        var _this = this;
        this.workflowDAO = new WorkflowDAO_1.WorkflowDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.usergroupconfigDAO = new UsergroupconfigDAO_1.UsergroupconfigDAO();
        this.salesTableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.updateInventoryService = new UpdateInventoryService_1.UpdateInventoryService();
        this.inventtransDAO = new InventTransDAO_1.InventorytransDAO();
        this.inventtransService = new InventtransService_1.InventtransService();
        this.db = typeorm_1.getManager();
        Watcher_1.DBEvent().on("workflow", function (value) {
            console.log("&&&&&&&&&&&&&&&&workflow watcher&&&&&&&&&&&&&&&&&&&: ", value);
            _this.workflowUpdate(value);
        });
    }
    WorkflowService.prototype.entity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.workflowDAO.entity(id)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WorkflowService.prototype.search = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        item.pendingWith = this.sessionInfo.userName;
                        item.groupid = this.sessionInfo.groupid;
                        return [4 /*yield*/, this.workflowDAO.search(item)];
                    case 1:
                        data = _a.sent();
                        data.map(function (item) {
                            // console.log(item.orderType);
                            // console.log(item.SalesTable.movementType)
                            item.orderTypeAr = Props_1.Props.Workflow_Order_Type[item.orderType][1];
                            item.orderTypeEn = Props_1.Props.Workflow_Order_Type[item.orderType][1];
                            item.ordertype = Props_1.Props.Workflow_Order_Type[item.orderType][1];
                            item.descriptionEn = Props_1.Props.WORKFLOW_STATUSID[item.statusId][1];
                            item.descriptionAr = Props_1.Props.WORKFLOW_STATUSID[item.statusId][2];
                            item.createdDateTime = new Date(item.createdDateTime).toLocaleDateString();
                            // item.inventoryType = item.SalesTable.movementType.movementType;
                            // item.inventoryTypeAr = item.SalesTable.movementType.movementArabic;
                            item.inventoryType = item.SalesTable ? item.SalesTable.movementType : null;
                            item.inventoryTypeAr = item.SalesTable ? item.SalesTable.movementType : null;
                            item.selectedLines = item.selectedLines ? item.selectedLines.lines : null;
                            item.invoiceDate = new Date(item.SalesTable.invoiceDate).toLocaleDateString();
                            item.invoiceId = item.SalesTable.interCompanyOriginalSalesId;
                            item.info = item.SalesTable.info;
                            delete item.SalesTable;
                        });
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WorkflowService.prototype.save = function (item, type) {
        if (type === void 0) { type = null; }
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, status_1, info, promistList, usergroupid, inventlocationid, selectedLinesData, condition, salesData, RM_AND_RA, canSendForApproval, date, inventtransQuery, selectedLines, cond, salesSaveData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = typeorm_2.getConnection().createQueryRunner();
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 35, 37, 39]);
                        status_1 = item.status;
                        info = item.info;
                        promistList = [];
                        usergroupid = this.sessionInfo.groupid;
                        inventlocationid = this.sessionInfo.inventlocationid;
                        selectedLinesData = null;
                        if (!(item.id || item.orderId)) return [3 /*break*/, 33];
                        if (!item.id) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.workflowDAO.entity(item.id)];
                    case 4:
                        item = _a.sent();
                        // console.log(item);
                        if (item) {
                            usergroupid = item.usergroupid;
                            inventlocationid = item.inventLocationId;
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.rawQuery.workflowconditions(usergroupid, inventlocationid)];
                    case 6:
                        condition = _a.sent();
                        return [4 /*yield*/, this.salesTableDAO.transferorderEntity(item.orderId)];
                    case 7:
                        salesData = _a.sent();
                        if (!salesData) {
                            throw { status: 0, message: "ORDER_NOT_FOUND" };
                        }
                        return [4 /*yield*/, this.rawQuery.getRmAndRa(usergroupid)];
                    case 8:
                        RM_AND_RA = _a.sent();
                        if (!(type == "sendforapproval")) return [3 /*break*/, 23];
                        return [4 /*yield*/, this.allocateData(item, salesData)];
                    case 9:
                        _a.sent();
                        if (!(salesData.transkind == "RETURNORDER")) return [3 /*break*/, 10];
                        //  else {
                        if (condition.rmApprovalRequired) {
                            item.statusId = "PENDINGRMAPPROVAL";
                            if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                                item.pendingWith = RM_AND_RA.rm;
                            }
                            else {
                                throw { status: 0, message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                            }
                        }
                        else if (condition.raApprovalRequired) {
                            item.statusId = "PENDINGRAPPROVAL";
                            if (RM_AND_RA.ra && RM_AND_RA.ra != "") {
                                item.pendingWith = RM_AND_RA.ra;
                            }
                            else {
                                throw { status: 0, message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                            }
                        }
                        return [3 /*break*/, 21];
                    case 10:
                        if (!(salesData.transkind == "INVENTORYMOVEMENT")) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.stockOnHandCheck(salesData)];
                    case 11:
                        canSendForApproval = _a.sent();
                        if (!canSendForApproval) return [3 /*break*/, 18];
                        if (![5, 8, 9].includes(salesData.movementType.id)) return [3 /*break*/, 12];
                        item.statusId = "PENDINGRMAPPROVAL";
                        if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                            item.pendingWith = RM_AND_RA.rm;
                        }
                        else {
                            throw { status: 0, message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                        }
                        return [3 /*break*/, 16];
                    case 12:
                        if (![1, 2, 3, 4, 6, 7].includes(salesData.movementType.id)) return [3 /*break*/, 13];
                        item.statusId = "PENDINGRAAPPROVAL";
                        if (RM_AND_RA.ra && RM_AND_RA.ra != "") {
                            item.pendingWith = RM_AND_RA.ra;
                        }
                        else {
                            throw { status: 0, message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                        }
                        return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, this.rawQuery.updateSalesTableWorkFlowStatus(salesData.salesId, "NOWORKFLOW")];
                    case 14: return [4 /*yield*/, _a.sent()];
                    case 15:
                        _a.sent();
                        return [2 /*return*/, { id: salesData.salesId, status: "NOWORKFLOW", message: Props_1.Props.SAVED_SUCCESSFULLY }];
                    case 16:
                        date = new Date().toISOString();
                        inventtransQuery = " UPDATE inventtrans SET transactionclosed = " + true + ", reserve_status = 'RESERVED'  ";
                        if (date) {
                            inventtransQuery += ",dateinvent = '" + date + "' ";
                        }
                        inventtransQuery += " WHERE invoiceid = '" + salesData.salesId.toUpperCase() + "' and qty < 0";
                        return [4 /*yield*/, queryRunner.query(inventtransQuery)];
                    case 17:
                        _a.sent();
                        return [3 /*break*/, 19];
                    case 18: throw { status: 0, message: "SOME_OF_THE_ITEMS_ARE_OUT_OF_STOCK" };
                    case 19: return [3 /*break*/, 21];
                    case 20:
                        if (salesData.transkind == "DESIGNERSERVICERETURN") {
                            item.statusId = "PENDINGINGFORDESIGNERAPPROVAL";
                            if (RM_AND_RA.designer_signing_authority && RM_AND_RA.designer_signing_authority != "") {
                                item.pendingWith = RM_AND_RA.designer_signing_authority;
                            }
                            else {
                                throw { status: 0, message: "NO_DESIGNER_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT" };
                            }
                        }
                        else {
                            item.statusId = "PENDINGRMAPPROVAL";
                            if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                                item.pendingWith = RM_AND_RA.rm;
                            }
                            else {
                                throw { status: 0, message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                            }
                        }
                        _a.label = 21;
                    case 21:
                        item.usergroupid = this.sessionInfo.groupid;
                        item.orderType = Props_1.Props.WORKFLOW_ORDER_TYPE[salesData.transkind][0];
                        item.inventLocationId = this.sessionInfo.inventlocationid;
                        this.inventtransService.sessionInfo = this.sessionInfo;
                        return [4 /*yield*/, this.inventtransService.getSelectedBatches({
                                salesid: salesData.salesId,
                                type: salesData.transkind,
                            })];
                    case 22:
                        selectedLines = _a.sent();
                        selectedLinesData = {
                            lines: selectedLines,
                        };
                        return [3 /*break*/, 24];
                    case 23:
                        // console.log(item.statusId);
                        if (status_1 == "accept" || status_1 == null) {
                            if (salesData.transkind == "RETURNORDER") {
                                console.log("================11111");
                                if (salesData.reservation > parseInt(condition.returnOrderDays) &&
                                    item.statusId != "PENDINGCOORDINATORAPPROVAL") {
                                    item.statusId = "PENDINGCOORDINATORAPPROVAL";
                                    if (RM_AND_RA.salescoordinator && RM_AND_RA.salescoordinator != "") {
                                        item.pendingWith = RM_AND_RA.salescoordinator;
                                    }
                                    else {
                                        throw { status: 0, message: "NO_COORDINATOR_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                                    }
                                }
                                else if (item.statusId == "PENDINGRMAPPROVAL" || item.statusId == "APPROVEDBYDESIGNER") {
                                    item.statusId = "APPROVEDBYRM";
                                    if (RM_AND_RA.ra) {
                                        // console.log(RM_AND_RA);
                                        if (condition.raApprovalRequired) {
                                            item.pendingWith = RM_AND_RA.ra;
                                        }
                                        else {
                                            item.pendingWith = null;
                                            item.statusId = "APPROVED";
                                        }
                                    }
                                    else {
                                        throw { status: 0, message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                                    }
                                }
                                else if (item.statusId == "PENDINGCOORDINATORAPPROVAL") {
                                    console.log("PENDINGCOORDINATORAPPROVAL");
                                    item.statusId = "PENDINGRAAPPROVAL";
                                    // console.log(item.statusId);
                                    if (RM_AND_RA.ra) {
                                        // console.log(RM_AND_RA);
                                        console.log("PENDINGCOORDINATORAPPROVAL", condition, RM_AND_RA.ra, usergroupid);
                                        if (condition.raApprovalRequired) {
                                            item.pendingWith = RM_AND_RA.ra;
                                        }
                                        else {
                                            item.pendingWith = null;
                                            item.statusId = "APPROVED";
                                        }
                                    }
                                    else {
                                        throw { status: 0, message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                                    }
                                    console.log(item.statusId);
                                }
                                else if (item.statusId == "PENDINGRAAPPROVAL" || item.statusId == "APPROVEDBYRM") {
                                    console.log("====================================");
                                    item.statusId = "APPROVEDBYRA";
                                    item.pendingWith = null;
                                }
                                else if (item.statusId == "PENDINGINGFORDESIGNERAPPROVAL") {
                                    if (condition.rmApprovalRequired) {
                                        item.statusId = "APPROVEDBYDESIGNER";
                                        item.pendingWith = RM_AND_RA.rm;
                                    }
                                    else if (condition.rmApprovalRequired) {
                                        item.statusId = "APPROVEDBYRA";
                                        item.pendingWith = RM_AND_RA.ra;
                                    }
                                    else {
                                        item.statusId = "APPROVED";
                                        item.pendingWith = null;
                                    }
                                }
                            }
                            else {
                                if (item.statusId == "PENDINGRMAPPROVAL" || item.statusId == "APPROVEDBYDESIGNER") {
                                    item.statusId = "APPROVEDBYRM";
                                    if (RM_AND_RA.ra) {
                                        item.pendingWith = RM_AND_RA.ra;
                                    }
                                    else {
                                        item.pendingWith = null;
                                        item.statusId = "APPROVED";
                                    }
                                }
                                else if (item.statusId == "PENDINGRAAPPROVAL" || item.statusId == "APPROVEDBYRM") {
                                    item.statusId = "APPROVEDBYRA";
                                    item.pendingWith = null;
                                }
                                else if (item.statusId == "PENDINGINGFORDESIGNERAPPROVAL") {
                                    if (RM_AND_RA.rm) {
                                        item.statusId = "APPROVEDBYDESIGNER";
                                        item.pendingWith = RM_AND_RA.rm;
                                    }
                                    else if (RM_AND_RA.ra) {
                                        item.statusId = "APPROVEDBYRA";
                                        item.pendingWith = RM_AND_RA.ra;
                                    }
                                    else {
                                        item.statusId = "APPROVED";
                                        item.pendingWith = null;
                                    }
                                }
                            }
                        }
                        else if (status_1 == "reject") {
                            console.log("==========================", status_1);
                            if (RM_AND_RA.rm == this.sessionInfo.groupid) {
                                item.statusId = "REJECTEDBYRM";
                            }
                            else if (RM_AND_RA.ra == this.sessionInfo.groupid) {
                                item.statusId = "REJECTEDBYRA";
                            }
                            else {
                                item.statusId = "REJECTED";
                            }
                            item.pendingWith = null;
                            // await this.inventryTransUpdate(salesData);
                        }
                        _a.label = 24;
                    case 24:
                        // console.log(item);
                        // throw "error";
                        item.lastModifiedBy = this.sessionInfo.userName;
                        // console.log(new Date());
                        item.lastModifiedDate = new Date(App_1.App.DateNow());
                        return [4 /*yield*/, this.validate(item, type)];
                    case 25:
                        cond = _a.sent();
                        console.log(cond);
                        if (!(cond == true)) return [3 /*break*/, 31];
                        salesSaveData = {};
                        salesSaveData.salesId = item.orderId;
                        salesSaveData.status = item.statusId;
                        salesSaveData.info = info;
                        salesSaveData.lastModifiedDate = new Date(App_1.App.DateNow());
                        console.log("lastModifiedDate", salesSaveData.lastModifiedDate, salesSaveData.status);
                        // promistList.push(this.workflowDAO.save(item), this.salesTableDAO.save(salesSaveData));
                        return [4 /*yield*/, queryRunner.manager.getRepository(Workflow_1.Workflow).save(item)];
                    case 26:
                        // promistList.push(this.workflowDAO.save(item), this.salesTableDAO.save(salesSaveData));
                        _a.sent();
                        if (!selectedLinesData) return [3 /*break*/, 28];
                        selectedLinesData.id = item.id;
                        selectedLinesData.updatedOn = new Date(App_1.App.DateNow());
                        selectedLinesData.createdOn = new Date(App_1.App.DateNow());
                        return [4 /*yield*/, queryRunner.manager.getRepository(SelectedLines_1.SelectedLines).save(selectedLinesData)];
                    case 27:
                        _a.sent();
                        _a.label = 28;
                    case 28: return [4 /*yield*/, queryRunner.manager.getRepository(SalesTable_1.SalesTable).save(salesSaveData)];
                    case 29:
                        _a.sent();
                        // let salesTableData: any = await this.salesTableDAO.save(salesData);
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 30:
                        // let salesTableData: any = await this.salesTableDAO.save(salesData);
                        _a.sent();
                        return [2 /*return*/, { id: item.id, status: item.statusId, message: "SAVED_SUCCESSFULLY" }];
                    case 31:
                        if (cond == "ALREADY_MODIFIED") {
                            throw { status: 0, message: "ALREADY_MODIFIED" };
                        }
                        else if (cond == "ALREADY_SENT_FOR_APPROVAL") {
                            throw { status: 0, message: "ALREADY_SENT_FOR_APPROVAL" };
                        }
                        else {
                            throw { status: 0, message: "INVALID_DATA" };
                        }
                        _a.label = 32;
                    case 32: return [3 /*break*/, 34];
                    case 33: throw { status: 0, message: "INVALID_DATA" };
                    case 34: return [3 /*break*/, 39];
                    case 35:
                        error_3 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 36:
                        _a.sent();
                        throw error_3;
                    case 37: return [4 /*yield*/, queryRunner.release()];
                    case 38:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 39: return [2 /*return*/];
                }
            });
        });
    };
    WorkflowService.prototype.validate = function (item, type) {
        if (type === void 0) { type = null; }
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, uid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldItem = null;
                        return [4 /*yield*/, this.workflowDAO.findOne({ orderId: item.orderId })];
                    case 1:
                        oldItem = _a.sent();
                        if (!item.id || item.id == "" || item.id == "0") {
                            item.id = null;
                        }
                        console.log(oldItem);
                        if (oldItem) {
                            if (type == "sendforapproval") {
                                return [2 /*return*/, "ALREADY_SENT_FOR_APPROVAL"];
                            }
                            else {
                                console.log("=====================", oldItem.pendingWith, this.sessionInfo.groupid);
                                if (oldItem.pendingWith == this.sessionInfo.groupid) {
                                    item = oldItem;
                                    return [2 /*return*/, true];
                                }
                                else {
                                    return [2 /*return*/, "ALREADY_MODIFIED"];
                                }
                            }
                        }
                        if (!!item.id) return [3 /*break*/, 4];
                        if (!oldItem) return [3 /*break*/, 2];
                        item = oldItem;
                        return [2 /*return*/, true];
                    case 2: return [4 /*yield*/, this.getWorkflowId()];
                    case 3:
                        uid = _a.sent();
                        item.id = uid;
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    WorkflowService.prototype.getWorkflowId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usergroupconfig, seqNum, data, hashString, prevYear, year, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usergroupconfigDAO.findOne({
                            groupid: this.sessionInfo.groupid,
                        })];
                    case 1:
                        usergroupconfig = _a.sent();
                        seqNum = usergroupconfig.workflowsequencegroup;
                        return [4 /*yield*/, this.rawQuery.getNumberSequence("WORKFLOW", this.sessionInfo.inventlocationid)];
                    case 2:
                        data = _a.sent();
                        if (!(data && data.format)) return [3 /*break*/, 4];
                        hashString = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
                        prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
                        year = new Date().getFullYear().toString().substr(2, 2);
                        data.nextrec = prevYear == year ? data.nextrec : 1;
                        id = data.format.replace(hashString, data.nextrec) + "-" + year;
                        console.log(id);
                        return [4 /*yield*/, this.rawQuery.updateNumberSequence(data.numbersequence, data.nextrec)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, id];
                    case 4: throw { status: 0, message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
                }
            });
        });
    };
    WorkflowService.prototype.allocateData = function (item, salesData) {
        item.partyId = salesData.custAccount;
        item.partyName = salesData.salesName;
        item.orderCreatedBy = salesData.createdby;
        item.orderCreatedDateTime = salesData.createddatetime;
        item.orderLastModifiedBy = salesData.lastModifiedBy;
        item.orderLastModifiedDate = salesData.lastModifiedDate;
        item.createdBy = this.sessionInfo.userName;
        item.createdDateTime = new Date(App_1.App.DateNow());
        item.inventLocationId = this.sessionInfo.inventlocationid;
    };
    WorkflowService.prototype.stockOnHandCheck = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var lines, canConvert_1, colors_1, items_1, sizes_1, batches_1, itemString_1, itemsInStock_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.inventtransDAO.findAll({ invoiceid: reqData.salesId })];
                    case 1:
                        lines = _a.sent();
                        lines = lines.filter(function (v) { return v.qty < 0; });
                        if (!(lines.length > 0)) return [3 /*break*/, 3];
                        canConvert_1 = true;
                        colors_1 = [];
                        items_1 = [];
                        sizes_1 = [];
                        batches_1 = [];
                        itemString_1 = "";
                        lines.map(function (v) {
                            items_1.push(v.itemid), colors_1.push(v.configid), sizes_1.push(v.inventsizeid), batches_1.push(v.batchno);
                        });
                        return [4 /*yield*/, this.rawQuery.checkBatchAvailability(this.sessionInfo.inventlocationid, items_1, colors_1, sizes_1, batches_1)];
                    case 2:
                        itemsInStock_1 = _a.sent();
                        console.log(itemsInStock_1);
                        lines.map(function (v) {
                            if (v.itemid != "HSN-00001") {
                                var index = itemsInStock_1.findIndex(function (value) {
                                    return value.itemid.toLowerCase() == v.itemid.toLowerCase() &&
                                        value.configid.toLowerCase() == v.configid.toLowerCase() &&
                                        value.inventsizeid.toLowerCase() == v.inventsizeid.toLowerCase() &&
                                        value.batchno.toLowerCase() == v.batchno.toLowerCase();
                                });
                                if (index >= 0) {
                                    if (Math.abs(parseInt(v.qty)) > parseInt(itemsInStock_1[index].qty)) {
                                        canConvert_1 = canConvert_1 == true ? false : false;
                                        itemString_1 += v.itemid + ",";
                                    }
                                }
                                else {
                                    canConvert_1 = canConvert_1 == true ? false : false;
                                    itemString_1 += v.itemid + ",";
                                }
                            }
                        });
                        console.log(itemString_1);
                        return [2 /*return*/, canConvert_1];
                    case 3: return [2 /*return*/, true];
                }
            });
        });
    };
    WorkflowService.prototype.inventryTransUpdate = function (reqData) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, batches, _i, batches_2, batch, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = typeorm_2.getConnection().createQueryRunner();
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 10, 12, 14]);
                        return [4 /*yield*/, this.inventtransDAO.findAll({
                                invoiceid: reqData.salesId,
                            })];
                    case 4:
                        batches = _a.sent();
                        batches = batches.filter(function (v) { return v.qty < 0; });
                        if (!(batches.length > 0)) return [3 /*break*/, 8];
                        _i = 0, batches_2 = batches;
                        _a.label = 5;
                    case 5:
                        if (!(_i < batches_2.length)) return [3 /*break*/, 8];
                        batch = batches_2[_i];
                        batch.qty = batch.qty;
                        return [4 /*yield*/, this.updateInventoryService.updateUnReserveQty(batch, queryRunner)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 10:
                        error_4 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 11:
                        _a.sent();
                        throw error_4;
                    case 12: return [4 /*yield*/, queryRunner.release()];
                    case 13:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    WorkflowService.prototype.workflowUpdate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var transkind, salesData, reqData, date, inventtransQuery, salesSaveData, offlineSystems, salesData, reqData, date, inventtransQuery, salesSaveData, salesSaveData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        transkind = ["SALESORDER", "INVENTORYMOVEMENT", "RETURNORDER"];
                        if (!(data && data.statusid.includes("REJECTED"))) return [3 /*break*/, 13];
                        if (!(process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID)) return [3 /*break*/, 5];
                        // console.log("TODO", data.orderid);
                        console.log("11111111============================offline============");
                        return [4 /*yield*/, this.salesTableDAO.transferorderEntity(data.orderid)];
                    case 1:
                        salesData = _a.sent();
                        if (!transkind.includes(salesData.transkind)) return [3 /*break*/, 4];
                        reqData = {
                            salesId: data.orderid,
                        };
                        date = new Date().toISOString();
                        inventtransQuery = "UPDATE inventtrans SET transactionclosed = " + false + ", reserve_status = 'REJECTED' ";
                        if (date) {
                            inventtransQuery += ",dateinvent = '" + date + "' ";
                        }
                        inventtransQuery += " WHERE invoiceid = '" + salesData.salesId.toUpperCase() + "'";
                        console.log(inventtransQuery);
                        return [4 /*yield*/, this.db.query(inventtransQuery)];
                    case 2:
                        _a.sent();
                        salesSaveData = {
                            salesId: data.orderid,
                            status: data.statusid,
                        };
                        return [4 /*yield*/, this.salesTableDAO.save(salesSaveData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, this.rawQuery.offlineSystems()];
                    case 6:
                        offlineSystems = _a.sent();
                        console.log(offlineSystems);
                        offlineSystems = offlineSystems.find(function (v) { return v.id == data.inventlocationid; });
                        console.log(offlineSystems);
                        if (!!offlineSystems) return [3 /*break*/, 10];
                        console.log("22222222online");
                        console.log("TODO", data.orderid, data);
                        return [4 /*yield*/, this.salesTableDAO.transferorderEntity(data.orderid)];
                    case 7:
                        salesData = _a.sent();
                        if (!transkind.includes(salesData.transkind)) return [3 /*break*/, 9];
                        reqData = {
                            salesId: data.orderid,
                        };
                        date = new Date().toISOString();
                        inventtransQuery = "UPDATE inventtrans SET transactionclosed = " + false + ", reserve_status = 'REJECTED' ";
                        if (date) {
                            inventtransQuery += ",dateinvent = '" + date + "' ";
                        }
                        inventtransQuery += " WHERE invoiceid = '" + salesData.salesId.toUpperCase() + "'";
                        console.log(inventtransQuery);
                        return [4 /*yield*/, this.db.query(inventtransQuery)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        console.log("33333333offline");
                        if (!(process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID)) return [3 /*break*/, 12];
                        // console.log("TODO", data.orderid);
                        console.log("44444============================offline============");
                        salesSaveData = {
                            salesId: data.orderid,
                            status: data.statusid,
                        };
                        return [4 /*yield*/, this.salesTableDAO.save(salesSaveData)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        if (!(process.env.ENV_STORE_ID && data.inventlocationid == process.env.ENV_STORE_ID)) return [3 /*break*/, 15];
                        // console.log("TODO", data.orderid);
                        console.log("44444============================offline============");
                        salesSaveData = {
                            salesId: data.orderid,
                            status: data.statusid,
                        };
                        return [4 /*yield*/, this.salesTableDAO.save(salesSaveData)];
                    case 14:
                        _a.sent();
                        _a.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return WorkflowService;
}());
exports.WorkflowService = WorkflowService;
