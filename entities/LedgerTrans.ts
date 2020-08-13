import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("ledgertrans")
export class LedgerTrans {
    @PrimaryGeneratedColumn({ name: "id" })
    id: Number;

    @Column({ name: "accountnum" })
    accountNum: string;

    @Column({ name: "transdate" })
    transDate: Date;

    @Column({ name: "txt" })
    txt: string;

    @Column({ name: "amountmst" })
    amountMst: Number;

    @Column({ name: "closing" })
    closing: number;

    @Column({ name: "currencycode" })
    currencyCode: string;

    @Column({ name: "journalnum" })
    journalNum: string;

    @Column({ name: "modifieddatetime" })
    modifiedDateTime: Date;

    @Column({ name: "modifiedby" })
    modifiedBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "accountpltype" })
    accountpltype: Number;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "recid" })
    recid: number;

    @Column({ name: "isfiscalyearclosureaccount" })
    isFiscalYearClosureAccount: boolean = false;

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
}
