import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

import { Custtable } from "./Custtable";

@Entity("designerservice")
export class Designerservice {
    @PrimaryGeneratedColumn({ name: "serviceid" })
    serviceid: number;

    @Column({ name: "custphone" })
    custphone: string;

    @Column({ name: "amount" })
    amount: number;

    @Column({ name: "invoiceid" })
    invoiceid: string;

    @Column({ name: "salesorderid" })
    salesorderid: string;

    @Column({ name: "syncstatus" })
    syncstatus: number;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recordtype" })
    recordtype: number;

    @Column({ name: "settle" })
    settle: number;

    @Column({ name: "selectedforsettle" })
    selectedforsettle: number;

    @Column({ name: "approvalstatus" })
    approvalstatus: number;

    @Column({ name: "createdby" })
    createdby: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedby: string;

    @Column({ name: "lastmodifieddate" })
    lastmodifieddate: Date;

    @JoinColumn({ name: "customerid" })
    @ManyToOne(type => Custtable)
    customer: Custtable;
}
