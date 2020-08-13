import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { SalesTable } from "../entities/SalesTable";
import { Colors } from "../entities/Colors";
import { BaseSizes } from "../entities/BaseSizes";
import { AppliedDiscounts } from "./AppliedDiscounts";
import { Inventtable } from "./Inventtable";
import { Configtable } from "./Configtable";
import { Inventsize } from "./InventSize";

@Entity("salesline")
export class SalesLine {
    @PrimaryColumn({ name: "id" })
    id: Number;

    @Column({ name: "salesid" })
    salesId: string;

    @Column({ name: "linenum" })
    lineNum: Number;

    @Column({ name: "itemid" })
    itemid: String;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "salesprice" })
    salesprice: Number;

    @Column({ name: "currencycode" })
    currencyCode: String;

    @Column({ name: "salesqty" })
    salesQty: Number;

    @Column({ name: "lineamount" })
    lineAmount: Number;

    @Column({ name: "salesunit" })
    salesUnit: string;

    @Column({ name: "priceunit" })
    netAmount: Number;

    @Column({ name: "qtyordered" })
    qtyOrdered: Number;

    @Column({ name: "remainsalesphysical" })
    remainSalesPhysical: Number;

    @Column({ name: "remainsalesfinancial" })
    remainSalesFinancial: Number;

    @Column({ name: "receiptdateconfirmed" })
    receiptDateConfirmed: Date;

    @Column({ name: "shippingdaterequested" })
    shippingDateRequested: Date;

    @Column({ name: "shippingdateconfirmed" })
    shippingDateConfirmed: Date;

    @Column({ name: "confirmeddlv" })
    confirmedDlv: Date;

    @Column({ name: "salestype" })
    salesType: Number;

    @Column({ name: "dataareaid" })
    dataareaid: String;

    @Column({ name: "recversion" })
    recversion: Number;

    @Column({ name: "recid" })
    recid: Number;

    @Column({ name: "custgroup" })
    custGroup: string;

    @Column({ name: "custaccount" })
    custAccount: string;

    @Column({ name: "inventsizeid" })
    inventsizeid: string;

    @Column({ name: "configid" })
    configId: string;

    @Column({ name: "numbersequencegroupid" })
    numberSequenceGroupId: string;

    @Column({ name: "inventlocationid" })
    inventLocationId: string;

    @Column({ name: "inventtransid" })
    inventTransid: Date;

    @Column({ name: "salesdelivernow" })
    salesDeliverNow: Number;

    @Column({ name: "salesstatus" })
    salesStatus: Number;

    @Column({ name: "location" })
    location: String;

    @Column({ name: "batchno" })
    batchNo: String;

    @Column({ name: "instantdisc" })
    instantDisc: Number;

    @Column({ name: "instantdiscamt" })
    instantdiscamt: Number;

    @Column({ name: "voucherdisc" })
    voucherDisc: Number;

    @Column({ name: "redeemdisc" })
    redeeDisc: Number;

    @Column({ name: "promotiondisc" })
    promotiondisc: Number;

    @Column({ name: "linetotaldisc" })
    lineTotalDisc: Number;

    @Column({ name: "linesalestax" })
    lineSalesTax: Number;

    @Column({ name: "netamttax" })
    netAmtTax: Number;

    @Column({ name: "linesalestaxpercent" })
    lineSalesTaxPercent: Number;

    @Column({ name: "taxgroup" })
    taxGroup: string;

    @Column({ name: "taxitemgroup" })
    taxItemGroup: string;

    @Column({ name: "linediscamt" })
    linediscamt: Number;

    @Column({ name: "linediscpercent" })
    linediscpercent: Number;

    @Column({ name: "customdiscamt" })
    customDiscAmt: Number;

    @Column({ name: "supplmultipleqty" })
    supplMultipleQty: Number;

    @Column({ name: "supplfreeqty" })
    supplFreeQty: Number;

    @Column({ name: "multilndisc" })
    multilndisc: Number;

    @Column({ name: "multilnpercent" })
    multilnPercent: Number;

    @Column({ name: "enddisc" })
    endDisc: Number;

    @Column({ name: "enddiscamt" })
    enddiscamt: Number;

    @Column({ name: "linesalestaxperent" })
    linesalestaxperent: Number;

    @Column({ name: "hexcode" })
    hexCode: String;

    @Column({ name: "colorantid" })
    colorantId: string;

    @Column({ name: "colorantprice" })
    colorantprice: Number;

    @Column({ name: "baseproduct" })
    baseProduct: Boolean;

    @Column({ name: "totalreturnedquantity" })
    totalReturnedQuantity: Number;

    @Column({ name: "totalsettledamount" })
    totalSettledAmount: Number;

    @Column({ name: "coloranthexcode" })
    coloranthexcode: string;

    @Column({ name: "coloractive" })
    coloractive: Boolean;

    @Column({ name: "colorantactive" })
    colorantactive: Boolean;

    @Column({ name: "customprice" })
    customPrice: Number;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifieBby: String;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({ name: "vatamount" })
    vatamount: Number;

    @Column({ name: "vat" })
    vat: Number;

    @Column({ name: "voucherdiscamt" })
    voucherdiscamt: Number;

    @Column({ name: "voucherdiscpercent" })
    voucherdiscpercent: Number;

    @Column({ name: "status" })
    status: string;

    @Column({ name: "is_item_free" })
    isItemFree: boolean;

    @Column({ name: "link_id" })
    linkId: string;

    @Column({ name: "batches", type: "json" })
    batch: JSON;

    @Column({ name: "applied_discounts", type: "json" })
    appliedDiscounts: JSON;

    @Column({ name: "jazeerawarehouse" })
    jazeeraWarehouse: String;

    @JoinColumn({ name: "itemid" })
    @ManyToOne(type => Inventtable)
    product: Inventtable;

    @JoinColumn([{name: "configid", referencedColumnName: "code"}, {name: "itemid", referencedColumnName: "itemid"}])
    @ManyToOne(type => Configtable)
    color: Configtable;

    @JoinColumn([{name: "inventsizeid", referencedColumnName: "code"}, {name: "itemid", referencedColumnName: "itemid"}])
    @ManyToOne(type=> Inventsize)
    size: Inventsize

    @JoinColumn({ name: "salesid" })
    @ManyToOne(type => SalesTable)
    salestable: SalesTable;

   

    // @OneToMany(
    //     type => AppliedDiscounts,
    //     appliedDiscounts => appliedDiscounts.salesLine
    // )
    // appliedDiscounts: AppliedDiscounts[];
}
