import { Column, JoinColumn, PrimaryColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { GeneralJournal } from "../entities/GeneralJournal";

@Entity("ledgerjournaltrans")
export class LedgerJournalTrans {
  @PrimaryGeneratedColumn({ name: "id" })
  id: string;

  @Column({ name: "journalnum" })
  journalNum: string;

  @Column({ name: "linenum" })
  lineNum: Number;

  @Column({ name: "accounttype" })
  accountType: Number;

  @Column({ name: "accountnum" })
  accountNum: string;

  @Column({ name: "company" })
  company: string;

  @Column({ name: "txt" })
  txt: string;

  @Column({ name: "amountcurdebit", precision: 18, scale: 2 })
  amountCurDebit: Number;

  @Column({ name: "currencycode" })
  currencyCode: string;

  @Column({ name: "amountcurcredit", precision: 18, scale: 2 })
  amountCurCredit: Number;

  @Column({ name: "paymentnotes" })
  paymentNotes: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recversion" })
  recversion: Number;

  @Column({ name: "recid" })
  recid: Number;

  @Column({ name: "modifieddatetime" })
  modifiedDateTime: Date;

  @Column({ name: "modifiedby" })
  modifiedBy: string;

  @Column({ name: "createdby" })
  createdBy: string;

  @Column({ name: "createddatetime" })
  createDateTime: Date;

  @Column({ name: "lastmodifiedby" })
  lastModifiedBy: string;

  @Column({ name: "lastmodifieddate" })
  lastModifiedDate: Date;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "namearabic" })
  nameArabic: string;

  @Column({ name: "transdate" })
  transdDate: Date;

  @Column({ name: "dimension" })
  region: String;

  @Column({ name: "dimension2_" })
  department: String;

  @Column({ name: "dimension3_" })
  costcenter: String;

  @Column({ name: "dimension4_" })
  employee: String;

  @Column({ name: "dimension5_" })
  project: String;

  @Column({ name: "dimension6_" })
  salesman: String;

  @Column({ name: "dimension7_" })
  brand: String;

  @Column({ name: "dimension8_" })
  productline: String;

  @JoinColumn({ name: "journalnum" })
  @ManyToOne((type) => GeneralJournal)
  generalJournal: GeneralJournal;
}
