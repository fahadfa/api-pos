import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Colorizer } from "logform";

@Entity("usergroupconfig")
export class Usergroupconfig {
  @PrimaryColumn({ name: "id" })
  id: string;

  @Column({ name: "inventlocationid" })
  inventlocationid: string;

  @Column({ name: "currencycode" })
  currencycode: string;

  @Column({ name: "salesorderformat" })
  salesorderformat: string;

  @Column({ name: "proximitycheck" })
  proximitycheck: boolean;

  @Column({ name: "defaultcustomerid" })
  defaultcustomerid: string;

  @Column({ name: "createdby" })
  createdby: string;

  @Column({ name: "createddatetime" })
  createddatetime: Date;

  @Column({ name: "lastmodifiedby" })
  lastmodifiedby: string;

  @Column({ name: "packingslipformat" })
  packinfslipformat: string;

  @Column({ name: "packingslipsequencegroup" })
  packingslipsequencegroup: string;

  @Column({ name: "invoiceformat" })
  invoiceformat: string;

  @Column({ name: "invoicesequencegroup" })
  invoicesequencegroup: string;

  @Column({ name: "reservationformat" })
  reservationformat: string;

  @Column({ name: "reservationsequencegroup" })
  reservationsequencegroup: string;

  @Column({ name: "returnorderformt" })
  returnorderformt: string;

  @Column({ name: "returnordersequencegroup" })
  returnordersequencegroup: string;

  @Column({ name: "quotationformat" })
  quotationformat: string;

  @Column({ name: "quotationsequencegroup" })
  quotationsequencegroup: string;

  @Column({ name: "warehouse" })
  warehouse: string;

  @Column({ name: "regionalwarehouse" })
  regionalwarehouse: string;

  @Column({ name: "factorywarehouse" })
  factorywarehouse: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "salesordersequencegroup" })
  salesordersequencegroup: string;

  @Column({ name: "stockrequestsequencegroup" })
  stockrequestsequencegroup: string;

  @Column({ name: "ordershipmentsequencegroup" })
  ordershipmentsequencegroup: string;

  @Column({ name: "orderreceivesequencegroup" })
  orderreceivesequencegroup: string;

  @Column({ name: "purchase_return_sequence_group" })
  purchaseReturnSequenceGroup: string;

  @Column({ name: "additionalcustomer" })
  additionalcustomer: string;

  @Column({ name: "sabic_customers" })
  sabiccustomers: string;

  @Column({ name: "isstorewarehouse" })
  istorewarehouse: string;

  @Column({ name: "customergroup" })
  customergroup: string;

  @Column({ name: "blocklistedbasecolor" })
  blocklistedbasecolor: string;

  @Column({ name: "nocolorantcheckgroup" })
  nocolorantcheckgroup: string;

  @Column({ name: "iscolorantrequired" })
  iscolorantrequired: boolean;

  @Column({ name: "returnitemblocked" })
  returnitemblocked: string;

  @Column({ name: "iscityrequired" })
  iscityrequired: boolean;

  @Column({ name: "isvehiclerequired" })
  isvehiclerequired: boolean;

  @Column({ name: "mobilevan" })
  mobilevan: string;

  @Column({ name: "showroomemail" })
  showroomemail: string;

  @Column({ name: "telephone" })
  telephone: string;

  @Column({ name: "fax" })
  fax: string;

  @Column({ name: "istantdiscountexclude" })
  istantdiscountexclude: string;

  @Column({ name: "showroomcountrycode" })
  showroomcountrycode: string;

  @Column({ name: "customercreationaccess" })
  customercreationaccess: string;

  @Column({ name: "iscustomersalesmaneditable" })
  iscustomersalesmaneditable: boolean;

  @Column({ name: "regionid" })
  regionId: string;

  @Column({ name: "departmentid" })
  departmentid: string;

  @Column({ name: "costcenterid" })
  costCenterId: string;

  @Column({ name: "employeeid" })
  employeeid: string;

  @Column({ name: "projectid" })
  projectid: string;

  @Column({ name: "salesmanid" })
  salesmanid: string;

  @Column({ name: "brandid" })
  brandid: string;

  @Column({ name: "productlineid" })
  productlineid: string;

  @Column({ name: "deletedby" })
  deletedby: string;

  @Column({ name: "deleteddatetime" })
  deleteddatetime: string;

  @Column({ name: "deleted" })
  deleted: boolean;

  @Column({ name: "defaultcustomer" })
  defaultcustomer: string;

  @Column({ name: "sequencegroup" })
  sequencegroup: string;

  @Column({ name: "lastmodifieddate" })
  lastmodifieddate: Date;

  @Column({ name: "journalnameid" })
  journalnameid: string;

  @Column({ name: "movementsequencegroup" })
  movementsequencegroup: string;

  @Column({ name: "movementsequenceformat" })
  movementsequenceformat: string;

  @Column({ name: "rmsigningauthority" })
  rmsigningauthority: string;

  @Column({ name: "rasigningauthority" })
  rasigningauthority: string;

  @Column({ name: "designer_signing_authority" })
  designerSigningAuthority: string;

  @Column({ name: "transferordersequencegroup" })
  transferordersequencegroup: string;

  @Column({ name: "purchaserequestsequencegroup" })
  purchaserequestsequencegroup: string;

  @Column({ name: "purchaseordersequencegroup" })
  purchaseordersequencegroup: string;

  @Column({ name: "purchasepackingslipgroup" })
  purchasepackingslipgroup: string;

  @Column({ name: "purchaseinvoicegroup" })
  purchaseinvoicegroup: string;

  @Column({ name: "returnorderapprovalrequired" })
  returnorderapprovalrequired: boolean;

  @Column({ name: "returnorderapproval" })
  returnorderapproval: string;

  @Column({ name: "inventoryclosesequencegroup" })
  inventoryclosesequencegroup: string;

  @Column({ name: "salesforecastsequencegroup" })
  salesforecastsequencegroup: string;

  @Column({ name: "returnorderrmapprovalrequired" })
  returnorderrmapprovalrequired: boolean;

  @Column({ name: "returnorderraapprovalrequired" })
  returnorderraapprovalrequired: boolean;

  @Column({ name: "projectcustomer" })
  projectcustomer: boolean;

  @Column({ name: "agentcustomer" })
  agentcustomer: boolean;

  @Column({ name: "fixedassestgroupsequencegroup" })
  fixedassestgroupsequencegroup: string;

  @Column({ name: "agentwarehouses" })
  agentwarehouses: string;

  @Column({ name: "vendors" })
  vendors: string;

  @Column({ name: "legeraccountsequencegroup" })
  legeraccountsequencegroup: string;

  @Column({ name: "workflowcustomers" })
  workflowcustomers: string;

  @Column({ name: "workflowsequencegroup" })
  workflowsequencegroup: string;

  @Column({ name: "generaljournalsequencegroup" })
  generaljournalsequencegroup: string;

  @Column({ name: "financialcompanycode" })
  financialcompanycode: string;

  @Column({ name: "fiscalyearclosesequencegroup" })
  fiscalyearclosesequencegroup: string;

  @Column({ name: "partnercode" })
  partnercode: string;

  @Column({ name: "ledgeraccount" })
  ledgeraccount: string;

  @Column({ name: "usergroupid" })
  groupid: string;

  @Column({ name: "special_products_for_colorant_option" })
  specialproductsforcolorantoption: string;

  @Column({ name: "report_warehouses" })
  reportwarehouses: string;

  @Column({ name: "is_export_excel" })
  isExportExcel: boolean;

  @Column({ name: "salesman_editable_customers" })
  salesmanEditableCustomers: string;
}
