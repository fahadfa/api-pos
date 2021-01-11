"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var CustTransMaster = /** @class */ (function () {
    function CustTransMaster() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ name: "invoiceid" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "invoiceid", void 0);
    __decorate([
        typeorm_1.Column({ name: "transactiontype" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "transactiontype", void 0);
    __decorate([
        typeorm_1.Column({ name: "transactiondate" }),
        __metadata("design:type", Date)
    ], CustTransMaster.prototype, "transactiondate", void 0);
    __decorate([
        typeorm_1.Column({ name: "accountnum" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "accountnum", void 0);
    __decorate([
        typeorm_1.Column({ name: "duedate" }),
        __metadata("design:type", Date)
    ], CustTransMaster.prototype, "duedate", void 0);
    __decorate([
        typeorm_1.Column({ name: "payment" }),
        __metadata("design:type", Number)
    ], CustTransMaster.prototype, "payment", void 0);
    __decorate([
        typeorm_1.Column({ name: "status" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "status", void 0);
    __decorate([
        typeorm_1.Column({ name: "seqnum" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "seqnum", void 0);
    __decorate([
        typeorm_1.Column({ name: "remittancenum" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "remittancenum", void 0);
    __decorate([
        typeorm_1.Column({ name: "invoiceamount" }),
        __metadata("design:type", Number)
    ], CustTransMaster.prototype, "invoiceamount", void 0);
    __decorate([
        typeorm_1.Column({ name: "balance" }),
        __metadata("design:type", Number)
    ], CustTransMaster.prototype, "balance", void 0);
    __decorate([
        typeorm_1.Column({ name: "currency" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "currency", void 0);
    __decorate([
        typeorm_1.Column({ name: "created_by" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "createdby", void 0);
    __decorate([
        typeorm_1.Column({ name: "created_on" }),
        __metadata("design:type", Date)
    ], CustTransMaster.prototype, "createdon", void 0);
    __decorate([
        typeorm_1.Column({ name: "updated_by" }),
        __metadata("design:type", String)
    ], CustTransMaster.prototype, "updatedby", void 0);
    __decorate([
        typeorm_1.Column({ name: "updated_on" }),
        __metadata("design:type", Date)
    ], CustTransMaster.prototype, "updatedon", void 0);
    CustTransMaster = __decorate([
        typeorm_1.Entity("cust_trans_master")
    ], CustTransMaster);
    return CustTransMaster;
}());
exports.CustTransMaster = CustTransMaster;
