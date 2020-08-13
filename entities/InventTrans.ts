import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Inventbatch } from "../entities/Inventbatch";

@Entity("inventtrans")
export class Inventorytrans {
  @PrimaryColumn({ name: "id" })
  id: String;

  @Column({ name: "itemid" })
  itemid: string;

  @Column({ name: "statusissue" })
  statusissue: string;

  @Column({ name: "datephysical" })
  datephysical: Date;

  @Column({ name: "qty" })
  qty: Number;

  @Column({ name: "transtype" })
  transtype: Number;

  @Column({ name: "transrefid" })
  transrefid: string;

  @Column({ name: "invoiceid" })
  invoiceid: string;

  @Column({ name: "voucher" })
  voucher: string;

  @Column({ name: "inventtransidtransfer" })
  inventtransidtransfer: string;

  @Column({ name: "dateexpected" })
  dateexpected: Date;

  @Column({ name: "datefinancial" })
  datefinancial: Date;

  @Column({ name: "costamountphysical" })
  costamountphysical: Number;

  @Column({ name: "inventtransid" })
  inventtransid: string;

  @Column({ name: "statusreceipt" })
  statusreceipt: Number;

  @Column({ name: "packingslipreturned" })
  packingslipreturned: Number;

  @Column({ name: "invoicereturned" })
  invoicereturned: Number;

  @Column({ name: "packingslipid" })
  packingslipid: string;

  @Column({ name: "dateinvent" })
  dateinvent: Date;

  @Column({ name: "custvendac" })
  custvendac: string;

  @Column({ name: "dateclosed" })
  dateclosed: Date;

  @Column({ name: "datestatus" })
  datestatus: Date;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recid" })
  recid: Number;

  @Column({ name: "inventsizeid" })
  inventsizeid: string;

  @Column({ name: "configid" })
  configid: string;

  @Column({ name: "location" })
  location: string;

  @Column({ name: "reservationid" })
  reservationid: string;

  @Column({ name: "inventlocationid" })
  inventlocationid: string;

  @Column({ name: "transactionclosed" })
  transactionClosed: boolean;

  @Column({ name: "batchno" })
  batchno: string;

  @Column({ name: "reserve_status" })
  reserveStatus: string;

  @Column({ name: "sales_line_id" })
  salesLineId: string;

  @JoinColumn({ name: "batchno" })
  @ManyToOne((type) => Inventbatch)
  inventbatch: Inventbatch;
}
