import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("fiscalyearclose")
export class FiscalYearClose {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "closingid" })
    closingId: string;

    @Column({ name: "txt" })
    txt: string;

    @Column({ name: "status" })
    status: number;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recid" })
    recid: number;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "posteddatetime" })
    postedDatetime: Date;

    @Column({ name: "postedby" })
    postedBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "yearno" })
    yearNo: number;

    @Column({ name: "endingdate" })
    endingDate: Date;
}
