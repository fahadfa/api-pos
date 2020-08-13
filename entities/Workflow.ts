import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Inventlocation } from "./Inventlocation";
import { SalesTable } from "./SalesTable";

@Entity("workflow")
export class Workflow {
    @PrimaryColumn({ name: "id" })
    id: number;

    @Column({ name: "ordertype" })
    orderType: string;

    @Column({ name: "orderid" })
    orderId: string;

    @Column({ name: "statusid" })
    statusId: string;

    @Column({ name: "pendingwith" })
    pendingWith: string;

    @Column({ name: "accesskey" })
    accessKey: string;

    @Column({ name: "ordername" })
    orderName: string;

    @Column({ name: "partyid" })
    partyId: string;

    @Column({ name: "partyname" })
    partyName: string;

    @Column({ name: "inventlocationid" })
    inventLocationId: string;

    @Column({ name: "statusmessage" })
    statusMessage: string;

    @Column({ name: "statusmessagearabic" })
    statusMessageArabic: string;

    @Column({ name: "ordercreatedby" })
    orderCreatedBy: string;

    @Column({ name: "ordercreateddatetime" })
    orderCreatedDateTime: Date;

    @Column({ name: "orderlastmodifiedby" })
    orderLastModifiedBy: string;

    @Column({ name: "orderlastmodifieddate" })
    orderLastModifiedDate: Date;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({name: "usergroupid"})
    usergroupid: string

    @JoinColumn({ name: "inventlocationid" })
    @ManyToOne(type => Inventlocation)
    Inventlocation: Inventlocation;

    @JoinColumn({ name: "orderid" })
    @ManyToOne(type => SalesTable)
    SalesTable: SalesTable;
}
