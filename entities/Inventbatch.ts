import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("inventbatch")
export class Inventbatch {
    @PrimaryColumn({ name: "inventbatchid" })
    inventBatchId: string;

    @Column({ name: "itemid" })
    itemId: string;

    @Column({ name: "expdate" })
    expDate: Date;

    @Column({ name: "proddate" })
    prodDate: Date;

    @Column({ name: "description" })
    description: string;

    @Column({ name: "dataareaid" })
    dataAreaId: string;

    @Column({ name: "recversion" })
    recversion: Number;

    @Column({ name: "recid" })
    recId: Number;

    @Column({ name: "modifieddatetime" })
    modifiedDateTime: Date;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "configid" })
    configId: String;
}
