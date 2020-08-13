import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Custgroup } from "../entities/Custgroup";

@Entity("custtable")
export class Custtable {
  @PrimaryColumn({ name: "accountnum" })
  accountnum: string;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "address" })
  address: string;

  @Column({ name: "country_code" })
  countryCode: string;

  @Column({ name: "phone" })
  phone: Number;

  @Column({ name: "cashdisc" })
  cashdisc: string;

  @Column({ name: "invoiceaccount" })
  invoiceaccount: string;

  @Column({ name: "custgroup" })
  custgroup: string;

  @Column({ name: "paymtermid" })
  paymtermid: string;

  @Column({ name: "currency" })
  currency: string;

  @Column({ name: "salesgroup" })
  salesgroup: string;

  @Column({ name: "blocked" })
  blocked: number;

  @Column({ name: "onetimecustomer" })
  onetimecustomer: String;

  @Column({ name: "accountstatement" })
  accountstatement: Number;

  @Column({ name: "creditmax" })
  creditmax: Number;

  @Column({ name: "mandatorycreditlimit" })
  mandatorycreditlimit: string;

  @Column({ name: "vendaccount" })
  vendaccount: string;

  @Column({ name: "vatnum" })
  vatnum: string;

  @Column({ name: "pricegroup" })
  pricegroup: string;

  @Column({ name: "countryregionid" })
  countryregionid: string;

  @Column({ name: "inventlocation" })
  inventlocation: string;

  @Column({ name: "markupgroup" })
  markupgroup: string;

  @Column({ name: "clearingperiod" })
  clearingperiod: String;

  @Column({ name: "zipcode" })
  zipcode: string;

  @Column({ name: "state" })
  state: string;

  @Column({ name: "custcountry" })
  custcountry: string;

  @Column({ name: "statisticsgroup" })
  statisticsgroup: string;

  @Column({ name: "url" })
  url: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "cellularphone" })
  cellularphone: string;

  @Column({ name: "phonelocal" })
  phonelocal: string;

  @Column({ name: "creditrating" })
  creditrating: string;

  @Column({ name: "taxgroup" })
  taxgroup: string;

  @Column({ name: "paymmode" })
  paymmode: string;

  @Column({ name: "bankaccount" })
  bankaccount: string;

  @Column({ name: "paymsched" })
  paymsched: string;

  @Column({ name: "namealias" })
  namealias: string;

  @Column({ name: "contactpersonid" })
  contactpersonid: string;

  @Column({ name: "invoiceaddress" })
  invoiceaddress: string;

  @Column({ name: "salespoolid" })
  salespoolid: string;

  @Column({ name: "incltax" })
  incltax: Number;

  @Column({ name: "custitemgroupid" })
  custitemgroupid: string;

  @Column({ name: "languageid" })
  languageid: string;

  @Column({ name: "paymdayid" })
  paymdayid: string;

  @Column({ name: "taxlicensenum" })
  taxlicensenum: string;

  @Column({ name: "paymspec" })
  paymspec: string;

  @Column({ name: "city" })
  city: string;

  @Column({ name: "street" })
  street: string;

  @Column({ name: "pager" })
  pager: string;

  @Column({ name: "sms" })
  sms: string;

  @Column({ name: "maincontactid" })
  maincontactid: string;

  @Column({ name: "identificationnumber" })
  identificationnumber: string;

  @Column({ name: "partyid" })
  partyid: string;

  @Column({ name: "partytype" })
  partytype: string;

  @Column({ name: "partycountry" })
  partycountry: string;

  @Column({ name: "partystate" })
  partystate: string;

  @Column({ name: "orgid" })
  orgid: string;

  @Column({ name: "paymidtype" })
  paymidtype: string;

  @Column({ name: "createddatetime" })
  createdDateTime: Date;

  @Column({ name: "dataareaid" })
  dataareaId: string;

  @Column({ name: "custtype" })
  custtype: string;

  @Column({ name: "citycode" })
  citycode: string;

  @Column({ name: "districtcode" })
  districtcode: string;

  @Column({ name: "latitude" })
  latitude: Number;

  @Column({ name: "longitude" })
  longitude: Number;

  @Column({ name: "rcusttype" })
  rcusttype: Number;

  @Column({ name: "county" })
  county: string;

  @Column({ name: "walkincustomer" })
  walkincustomer: Boolean;

  @Column({ name: "lastmodifiedby" })
  lastmodifiedby: string;

  @Column({ name: "lastmodifieddate" })
  lastmodifieddate: Date;

  @Column({ name: "deletedby" })
  deletedby: string;

  @Column({ name: "deleteddatetime" })
  deleteddatetime: Date;

  @Column({ name: "createdby" })
  createdby: string;

  @Column({ name: "deleted" })
  deleted: Boolean;

  @Column({ name: "multilinedisc" })
  multilinedisc: String;

  @Column({ name: "linedisc" })
  linedisc: String;

  @Column({ name: "enddisc" })
  enddisc: String;

  @Column({ name: "dimension" })
  regionid: String;

  @Column({ name: "dimension2_" })
  departmentid: String;

  @Column({ name: "dimension3_" })
  costcenterid: String;

  @Column({ name: "dimension4_" })
  employeeid: String;

  @Column({ name: "dimension5_" })
  projectid: String;

  @Column({ name: "dimension6_" })
  salesmanid: String;

  @Column({ name: "dimension7_" })
  brandid: String;

  @Column({ name: "dimension8_" })
  productlineid: String;

  @JoinColumn({ name: "custgroup" })
  @ManyToOne((type) => Custgroup)
  Custgroup: Custgroup;
}
