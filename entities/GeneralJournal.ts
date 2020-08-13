import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { LedgerJournalTrans } from "./LedgerJournalTrans";

@Entity("ledgerjournaltable")
export class GeneralJournal {
  @PrimaryColumn({ name: "journalnum" })
  journalNum: string;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "voucherseries" })
  voucherSeries: string;

  @Column({ name: "log" })
  log: string;

  @Column({ name: "journaltype" })
  journalType: Number;

  @Column({ name: "journalname" })
  journalName: string;

  @Column({ name: "posted" })
  posted: Number;

  @Column({ name: "currencycode" })
  currencyCode: string;

  @Column({ name: "posteddatetime" })
  postedDatetime: Date;

  @Column({ name: "createdby" })
  createdBy: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recversion" })
  recversion: Number;

  @Column({ name: "recid" })
  recid: Number;

  @Column({ name: "cashdate" })
  cashdate: Date;

  @Column({ name: "modifieddatetime" })
  modifiedDatetime: Date;

  @Column({ name: "modifiedby" })
  modifiedBy: string;

  @Column({ name: "syncstatus" })
  syncStatus: string;

  @Column({ name: "deleted" })
  deleted: Boolean;

  @Column({ name: "lastmodifiedby" })
  lastModifiedBy: string;

  @Column({ name: "lastmodifieddate" })
  lastModifiedDate: Date;

  @Column({ name: "deletedby" })
  deletedby: string;

  @Column({ name: "deleteddatetime" })
  deletedDateTime: Date;

  @Column({ name: "postedby" })
  postedBy: string;

  @Column({ name: "createddatetime" })
  createdDatetime: Date;

  @Column({ name: "description" })
  description: string;

  @Column({ name: "financialdataareaid" })
  financialDataareaid: string;

  // @Column({ name: "dimension" })
  // region: String;

  // @Column({ name: "dimension2_" })
  // department: String;

  // @Column({ name: "dimension3_" })
  // costcenter: String;

  // @Column({ name: "dimension4_" })
  // employee: String;

  // @Column({ name: "dimension5_" })
  // project: String;

  // @Column({ name: "dimension6_" })
  // salesman: String;

  // @Column({ name: "dimension7_" })
  // brand: String;

  // @Column({ name: "dimension8_" })
  // productline: String;
  status: string;

  @Column({ name: "custaccount" })
  custaccount: string;
  // legerJournalTras: any;

  @OneToMany((type) => LedgerJournalTrans, (legerJournalTras) => legerJournalTras.generalJournal)
  legerJournalTras: LedgerJournalTrans[];
}
