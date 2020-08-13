import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Inventlocation } from "./Inventlocation";
import { MovementType } from "./MovemenntType";
import { Custtable } from "./Custtable";
import { SalesLine } from "./SalesLine";

@Entity("salestable")
export class SalesTable {
  @PrimaryColumn({ name: "salesid" })
  salesId: string;

  @Column({ name: "salesname" })
  salesName: string;

  @Column({ name: "reservation" })
  reservation: Number;

  @Column({ name: "custaccount" })
  custAccount: string;

  @Column({ name: "invoiceaccount" })
  invoiceAccount: string;

  @Column({ name: "deliverydate" })
  deliveryDate: Date;

  @Column({ name: "deliveryaddress" })
  deliveryAddress: string;

  @Column({ name: "documentstatus" })
  documentStatus: Boolean;

  @Column({ name: "currencycode" })
  currencyCode: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recversion" })
  recversion: Number;

  @Column({ name: "recid" })
  recId: Number;

  @Column({ name: "languageid" })
  lang: string;

  @Column({ name: "payment" })
  payment: string;

  @Column({ name: "custgroup" })
  custGroup: string;

  @Column({ name: "pricegroupid" })
  priceGroupId: string;

  @Column({ name: "shippingdaterequested" })
  shippingDateRequested: Date;

  @Column({ name: "deliverystreet" })
  deliveryStreet: string;

  @Column({ name: "salestype" })
  salesType: Number;

  @Column({ name: "salesstatus" })
  salesStatus: Number;

  @Column({ name: "numbersequencegroup" })
  numberSequenceGroup: string;

  @Column({ name: "cashdisc" })
  cashDisc: string;

  @Column({ name: "intercompanyoriginalsalesid" })
  interCompanyOriginalSalesId: string;

  @Column({ name: "freightsliptype" })
  freightsliptype: string;

  @Column({ name: "salestaker" })
  salesTaker: string;

  @Column({ name: "salesgroup" })
  salesGroup: string;

  @Column({ name: "url" })
  url: string;

  @Column({ name: "purchorderformnum" })
  purchOrderFormNum: string;

  @Column({ name: "shippingdateconfirmed" })
  shippingDateConfirmed: Date;

  @Column({ name: "deadline" })
  deadline: Date;

  @Column({ name: "fixedduedate" })
  fixedDueDate: Date;

  @Column({ name: "receiptdateconfirmed" })
  receiptDateConfirmed: Date;

  @Column({ name: "returndeadline" })
  returnDeadLine: Date;

  @Column({ name: "createddatetime" })
  createddatetime: Date;

  @Column({ name: "createdby" })
  createdby: string;

  @Column({ name: "customerref" })
  customerRef: string;

  @Column({ name: "syncstatus" })
  syncStatus: Number;

  @Column({ name: "amount" })
  amount: Number;

  @Column({ name: "disc" })
  disc: Number;

  @Column({ name: "netamount" })
  netAmount: Number;

  @Column({ name: "citycode" })
  cityCode: string;

  @Column({ name: "districtcode" })
  districtCode: string;

  @Column({ name: "latitude" })
  latitude: string;

  @Column({ name: "longitude" })
  longitude: string;

  @Column({ name: "forcustomer" })
  forCustomer: Number;

  @Column({ name: "vehiclecode" })
  vehicleCode: string;

  @Column({ name: "apptype" })
  appType: Number;

  @Column({ name: "vouchernum" })
  voucherNum: string;

  @Column({ name: "painter" })
  painter: string;

  @Column({ name: "ajpenddisc" })
  ajpenddisc: string;

  @Column({ name: "taxgroup" })
  taxGroup: string;

  @Column({ name: "sumtax" })
  sumTax: Number;

  @Column({ name: "mobileno" })
  mobileNo: string;

  @Column({ name: "inventlocationid" })
  inventLocationId: string;

  @Column({ name: "region" })
  region: string;

  @Column({ name: "dimension" })
  dimension: string;

  @Column({ name: "dimension2_" })
  dimension2_: string;

  @Column({ name: "dimension3_" })
  dimension3_: string;

  @Column({ name: "dimension4_" })
  dimension4_: string;

  @Column({ name: "dimension5_" })
  dimension5_: string;

  @Column({ name: "dimension6_" })
  salesmanId: string;

  @Column({ name: "dimension7_" })
  dimension7_: string;

  @Column({ name: "dimension8_" })
  dimension8_: string;

  @Column({ name: "instantdiscchecked" })
  instantDiscChecked: Boolean;

  @Column({ name: "voucherdiscchecked" })
  voucherDiscChecked: boolean;

  @Column({ name: "vatamount" })
  vatamount: Number;

  @Column({ name: "pricediscgroupid" })
  priceDiscGroupId: string;

  @Column({ name: "invoicedate" })
  invoiceDate: Date;

  @Column({ name: "invoicecreatedby" })
  invoiceCreatedBy: string;

  @Column({ name: "multilinediscountgroupid" })
  multilineDiscountGroupId: string;

  @Column({ name: "lastmodifiedby" })
  lastModifiedBy: string;

  @Column({ name: "lastmodifieddate" })
  lastModifiedDate: Date;

  @Column({ name: "deletedby" })
  deletedBy: string;

  @Column({ name: "deleteddatetime" })
  deletedDateTime: Date;

  @Column({ name: "deleted" })
  deleted: Boolean;

  @Column({ name: "originalprinted" })
  originalPrinted: Boolean;

  @Column({ name: "iscash" })
  isCash: boolean;

  @Column({ name: "approvers" })
  approvers: String;

  @Column({ name: "isredeemable" })
  isRedeemable: String;

  @Column({ name: "transkind" })
  transkind: string;

  @Column({ name: "status" })
  status: string;

  @Column({ name: "deliverytype" })
  deliverytype: string;

  @Column({ name: "redeempts" })
  redeemPoints: Number;

  @Column({ name: "redeemptsamt" })
  redeemAmount: Number;

  @Column({ name: "voucherdiscamt" })
  voucherdiscamt: Number;

  @Column({ name: "zipcode" })
  zipcode: string;

  @Column({ name: "country_code" })
  countryCode: string;

  @Column({ name: "design_service_redeem_amount" })
  designServiceRedeemAmount: Number;

  @Column({ name: "voucherdiscpercent" })
  voucherdiscpercent: Number;

  @Column({ name: "vouchertype" })
  vouchertype: String;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "is_movement_in" })
  isMovementIn: boolean;

  @Column({ name: "jazeerawarehouse" })
  jazeeraWarehouse: String;

  @Column({ name: "card_amount" })
  cardAmount: number;

  @Column({ name: "cash_amount" })
  cashAmount: number;

  @Column({ name: "online_amount" })
  onlineAmount: number;

  @Column({ name: "cust_email" })
  custEmail: number;

  @Column({ name: "shipping_amount" })
  shippingAmount: number;

  @Column({ name: "payment_type" })
  paymentType: String;

  @OneToMany((type) => SalesLine, (salesLine) => salesLine.salestable)
  salesLine: SalesLine[];

  @JoinColumn({ name: "inventlocationid" })
  @ManyToOne((type) => Inventlocation)
  warehouse: Inventlocation;

  @JoinColumn({ name: "movement_type_id" })
  @ManyToOne((type) => MovementType)
  movementType: MovementType;

  @Column({ name: "info", type: "json" })
  info: JSON;

  // @JoinColumn({ name: "custaccount" })
  // @ManyToOne(type => Custtable)
  // customer: Custtable;

  // @JoinColumn({ name: "custaccount" })
  // @ManyToOne(type => Inventlocation)
  // toWarehouse: Inventlocation;
}
