import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("usergroup")
export class Usergroup {
    @PrimaryColumn({ name: "groupid" })
    groupid: string;

    @Column({ name: "groupname" })
    groupname: string;

    @Column({ name: "status" })
    status: string;

    @Column({ name: "usercount" })
    usercount: string;

    @Column({ name: "comment" })
    comment: string;

    @Column({ name: "createdby" })
    createdby: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedby: string;

    @Column({ name: "lastmodifieddate" })
    lastmodifieddate: Date;

    @Column({ name: "deletedby" })
    deletedby: string;

    @Column({ name: "deleteddatetime" })
    deleteddatetime: Date;

    @Column({ name: "deleted" })
    deleted: boolean;

    @Column({ name: "permissiondata" })
    permissiondata: string;

    @Column({ name: "role" })
    role: string;
}
