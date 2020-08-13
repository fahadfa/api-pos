import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("phoneverification")
export class PhoneVerification {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    @Column({ name: "phonenumber" })
    phoneNumber: string;

    @Column({ name: "country_code" })
    countryCode: string;

    @Column({ name: "otpsent" })
    otpSent: string;

    @Column({ name: "otpexpirytime" })
    otpExpiryTime: Date;

    @Column({ name: "verificationstatus" })
    verificationStatus: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "customerid" })
    customerId: string;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedBy: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;
}
