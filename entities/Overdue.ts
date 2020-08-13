import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("overdue")
export class Overdue {
    @PrimaryColumn({ name: "overdueid" })
    overdueId: Number;

    @Column({ name: "salesid" })
    salesId: string;

    @Column({ name: "accountnum" })
    accountNum: string;

    @Column({ name: "customername" })
    customerName: string;

    @Column({ name: "invoiceid" })
    invoiceId: string;

    @Column({ name: "invoiceamount" })
    invoiceAmount: Number;

    @Column({ name: "invoicedate" })
    invoicedate: Date;

    @Column({ name: "duedate" })
    duedate: Date;

    @Column({ name: "payment" })
    payment: Number;

    @Column({ name: "actualduedate" })
    actualDueDate: Date;

    @Column({ name: "createdby" })
    createdby: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedby: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;
}
