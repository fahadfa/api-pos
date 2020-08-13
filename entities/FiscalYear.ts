import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("fiscalyear")
export class FiscalYear {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "yearno" })
    yearNo: number;

    @Column({ name: "recid" })
    recid: number;

    @Column({ name: "closing" })
    closing: number;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "endingdate" })
    endingDate: Date;

    @Column({ name: "startdate" })
    startDate: Date;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    status: any;
}
