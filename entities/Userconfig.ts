import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("userconfig")
export class Userconfig {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "inventlocationid" })
    inventlocationid: string;

    @Column({ name: "currencycode" })
    currencycode: string;

    @Column({ name: "salesorderformat" })
    salesorderformat: string;

    @Column({ name: "sequencegroup" })
    sequencegroup: string;

    @Column({ name: "createdby" })
    createdby: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedby: string;

    @Column({ name: "lastmodifieddate" })
    lastmodifieddate: Date;

    @Column({ name: "userid" })
    userid: string;

    @Column({ name: "proximitycheck" })
    proximitycheck: string;

    @Column({ name: "deletedby" })
    deletedby: string;

    @Column({ name: "deleteddatetime" })
    deleteddatetime: Date;

    @Column({ name: "deleted" })
    role: Number;
}
