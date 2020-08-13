import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("visitcustomer")
export class VisitCustomer {
    @PrimaryColumn({ name: "visitorid" })
    visitorId: string;

    @Column({ name: "visitorsequencenumber" })
    visitorSequenceNumber: string;

    @Column({ name: "dateofvisit" })
    dateOfVisit: Date;

    @Column({ name: "salesmanname" })
    salesmanName: string;

    @Column({ name: "salesmanid" })
    salesmanId: string;

    @Column({ name: "regionnumber" })
    regionNumber: string;

    @Column({ name: "showroomid" })
    showroomId: string;

    @Column({ name: "usergroupid" })
    userGroupId: string;

    @Column({ name: "visitormobilenumber" })
    visitorMobileNumber: string;

    @Column({ name: "visitorname" })
    visitorName: string;

    @Column({ name: "purchased" })
    purchased: string;

    @Column({ name: "visitortype" })
    visitorType: string;

    @Column({ name: "reasonfornotpurchase" })
    description: string;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;
}
