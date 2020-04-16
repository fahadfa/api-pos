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
var UsergroupconfigDAO_1 = require("../repos/UsergroupconfigDAO");
var WorkflowService = /** @class */ (function () {
    function WorkflowService() {
        this.workflowDAO = new WorkflowDAO_1.WorkflowDAO();
        this.rawQuery = new RawQuery_1.RawQuery();
        this.usergroupconfigDAO = new UsergroupconfigDAO_1.UsergroupconfigDAO();
        this.salesTableDAO = new SalesTableDAO_1.SalesTableDAO();
        this.db = typeorm_1.getManager();
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
            var status_1, workflowcondition, usergroupid, salesData, RM_AND_RA, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 22, , 23]);
                        status_1 = item.status;
                        return [4 /*yield*/, this.rawQuery.workflowconditions(this.sessionInfo.usergroupconfigid)];
                    case 1:
                        workflowcondition = _a.sent();
                        console.log(this.sessionInfo);
                        usergroupid = this.sessionInfo.groupid;
                        if (!(item.id || item.orderId)) return [3 /*break*/, 20];
                        if (!item.id) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.workflowDAO.entity(item.id)];
                    case 2:
                        item = _a.sent();
                        if (item) {
                            usergroupid = item.usergroupid;
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.salesTableDAO.entity(item.orderId)];
                    case 4:
                        salesData = _a.sent();
                        if (!salesData) {
                            throw Props_1.Props.ORDER_NOT_FOUND;
                        }
                        return [4 /*yield*/, this.rawQuery.getRmAndRa(usergroupid)];
                    case 5:
                        RM_AND_RA = _a.sent();
                        console.log(RM_AND_RA);
                        if (!(type == "sendforapproval")) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.allocateData(item, salesData)];
                    case 6:
                        _a.sent();
                        if (!(salesData.transkind == "RETURNORDER")) return [3 /*break*/, 7];
                        // if (workflowcondition.returnorderrmapprovalrequired) {
                        item.statusId = Props_1.Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
                        if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                            item.pendingWith = RM_AND_RA.rm;
                        }
                        else {
                            throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                        }
                        return [3 /*break*/, 14];
                    case 7:
                        if (!(salesData.transkind == "INVENTORYMOVEMENT")) return [3 /*break*/, 13];
                        if (![5, 8, 9].includes(salesData.movementType.id)) return [3 /*break*/, 8];
                        item.statusId = Props_1.Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
                        if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                            item.pendingWith = RM_AND_RA.rm;
                        }
                        else {
                            throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                        }
                        return [3 /*break*/, 12];
                    case 8:
                        if (![1, 2, 3, 4, 6, 7].includes(salesData.movementType.id)) return [3 /*break*/, 9];
                        item.statusId = Props_1.Props.WORKFLOW_STATUSID.PENDINGRAAPPROVAL[0];
                        if (RM_AND_RA.ra && RM_AND_RA.ra != "") {
                            item.pendingWith = RM_AND_RA.ra;
                        }
                        else {
                            throw { message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                        }
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, this.rawQuery.updateSalesTableWorkFlowStatus(salesData.salesId, "NOWORKFLOW")];
                    case 10: return [4 /*yield*/, _a.sent()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, { id: salesData.salesId, status: "NOWORKFLOW", message: Props_1.Props.SAVED_SUCCESSFULLY }];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (salesData.transkind == "DESIGNERSERVICERETURN") {
                            item.statusId = Props_1.Props.WORKFLOW_STATUSID.PENDINGINGFORDESIGNERAPPROVAL[0];
                            if (RM_AND_RA.designer_signing_authority && RM_AND_RA.designer_signing_authority != "") {
                                item.pendingWith = RM_AND_RA.designer_signing_authority;
                            }
                            else {
                                throw { message: "NO_DESIGNER_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT" };
                            }
                        }
                        else {
                            item.statusId = Props_1.Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0];
                            if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                                item.pendingWith = RM_AND_RA.rm;
                            }
                            else {
                                throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                            }
                        }
                        _a.label = 14;
                    case 14:
                        item.usergroupid = this.sessionInfo.groupid;
                        item.orderType = Props_1.Props.WORKFLOW_ORDER_TYPE[salesData.transkind][0];
                        item.inventLocationId = this.sessionInfo.inventlocationid;
                        return [3 /*break*/, 16];
                    case 15:
                        console.log(item.statusId);
                        if (status_1 == "accept" || status_1 == null) {
                            if (item.statusId == Props_1.Props.WORKFLOW_STATUSID.PENDINGRMAPPROVAL[0] ||
                                item.statusId == Props_1.Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0]) {
                                item.statusId = Props_1.Props.WORKFLOW_STATUSID.APPROVEDBYRM[0];
                                if (salesData.transkind == "RETURNORDER") {
                                    item.pendingWith = null;
                                }
                                else {
                                    if (RM_AND_RA.ra) {
                                        console.log(RM_AND_RA);
                                        item.pendingWith = RM_AND_RA.ra;
                                    }
                                    else {
                                        throw { message: "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                                    }
                                }
                            }
                            else if (item.statusId == Props_1.Props.WORKFLOW_STATUSID.PENDINGRAAPPROVAL[0] ||
                                item.statusId == Props_1.Props.WORKFLOW_STATUSID.APPROVEDBYRM[0]) {
                                console.log("====================================");
                                item.statusId = Props_1.Props.WORKFLOW_STATUSID.APPROVEDBYRA[0];
                                item.pendingWith = null;
                            }
                            else if (item.statusId == Props_1.Props.WORKFLOW_STATUSID.PENDINGINGFORDESIGNERAPPROVAL[0]) {
                                if (RM_AND_RA.rm && RM_AND_RA.rm != "") {
                                    item.statusId = Props_1.Props.WORKFLOW_STATUSID.APPROVEDBYDESIGNER[0];
                                    item.pendingWith = RM_AND_RA.rm;
                                }
                                else {
                                    throw { message: "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN" };
                                }
                            }
                        }
                        else if (status_1 == "reject") {
                            if (RM_AND_RA.rm == this.sessionInfo.userName) {
                                item.statusId = Props_1.Props.WORKFLOW_STATUSID.REJECTEDBYRM[0];
                            }
                            else if (RM_AND_RA.ra == this.sessionInfo.userName) {
                                item.statusId = Props_1.Props.WORKFLOW_STATUSID.REJECTEDBYRA[0];
                            }
                        }
                        _a.label = 16;
                    case 16:
                        item.lastModifiedBy = this.sessionInfo.userName;
                        // console.log(new Date());
                        item.lastModifiedDate = new Date(App_1.App.DateNow());
                        console.log("lastModifiedDate", item.lastModifiedDate);
                        return [4 /*yield*/, this.validate(item)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, this.workflowDAO.save(item)];
                    case 18:
                        data = _a.sent();
                        return [4 /*yield*/, this.rawQuery.updateSalesTableWorkFlowStatus(salesData.salesId, item.statusId)];
                    case 19:
                        _a.sent();
                        return [2 /*return*/, { id: item.id, status: status_1, message: "SAVED_SUCCESSFULLY" }];
                    case 20: throw { message: "INVALID_DATA" };
                    case 21: return [3 /*break*/, 23];
                    case 22:
                        error_3 = _a.sent();
                        throw error_3;
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    WorkflowService.prototype.validate = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var oldItem, uid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldItem = null;
                        if (!(!item.id || item.id == "" || item.id == "0")) return [3 /*break*/, 1];
                        item.id = null;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.workflowDAO.findOne({ orderId: item.orderId })];
                    case 2:
                        oldItem = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!item.id) return [3 /*break*/, 6];
                        if (!oldItem) return [3 /*break*/, 4];
                        item = oldItem;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.getWorkflowId()];
                    case 5:
                        uid = _a.sent();
                        item.id = uid;
                        _a.label = 6;
                    case 6: return [2 /*return*/, true];
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
                        return [4 /*yield*/, this.rawQuery.getNumberSequence(seqNum)];
                    case 2:
                        data = _a.sent();
                        if (!(data && data.format)) return [3 /*break*/, 4];
                        hashString = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
                        prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
                        year = new Date().getFullYear().toString().substr(2, 2);
                        data.nextrec = prevYear == year ? data.nextrec : 1;
                        id = data.format.replace(hashString, data.nextrec) + "-" + year;
                        console.log(id);
                        return [4 /*yield*/, this.rawQuery.updateNumberSequence(usergroupconfig.workflowsequencegroup, data.nextrec)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, id];
                    case 4: throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
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
    return WorkflowService;
}());
exports.WorkflowService = WorkflowService;
