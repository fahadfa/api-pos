import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("numbersequencetable")
export class NumberSequenceTable {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "numbersequence" })
    numberSequence: string;

    @Column({ name: "txt" })
    txt: string;

    @Column({ name: "latestcleandatetime" })
    latestCleanDateTime: Date;

    @Column({ name: "latestcleandatetimetzid" })
    latestcleandatetimetzid: Number;

    @Column({ name: "lowest" })
    lowest: Number;

    @Column({ name: "highest" })
    highest: Number;

    @Column({ name: "nextrec" })
    nextrec: Number;

    @Column({ name: "blocked" })
    blocked: Number;

    @Column({ name: "format" })
    format: String;

    @Column({ name: "continuous" })
    continuous: Number;

    @Column({ name: "cyclic" })
    cyclic: Number;

    @Column({ name: "cleanataccess" })
    cleanataccess: Number;

    @Column({ name: "inuse" })
    inuse: Number;

    @Column({ name: "noincrement" })
    noIncrement: Number;

    @Column({ name: "cleaninterval" })
    cleanInterval: Number;

    @Column({ name: "allowchangeup" })
    allowChangeUp: Number;

    @Column({ name: "allowchangedown" })
    allowChangedDown: Number;

    @Column({ name: "manual" })
    manual: Number;

    @Column({ name: "fetchaheadqty" })
    fetchaheadqty: Number;

    @Column({ name: "fetchahead" })
    fetchahead: Number;

    @Column({ name: "modifiedtransactionid" })
    modifiedTransactionId: Number;

    @Column({ name: "dataareaid" })
    dataareaid: String;

    @Column({ name: "recversion" })
    recversion: Number;

    @Column({ name: "recid" })
    recid: Number;
}
