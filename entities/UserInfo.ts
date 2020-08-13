import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usergroup } from "../entities/Usergroup";
import { Usergroupconfig } from "../entities/Usergroupconfig";

@Entity("user_info")
export class UserInfo {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "user_name" })
    userName: string;

    @Column({ name: "password" })
    password: string;

    @Column({ name: "description" })
    description: string;

    @Column({ name: "email" })
    email: string;

    @Column({ name: "role" })
    role: string;

    @Column({ name: "status" })
    status: string;

    @Column({ name: "securitytoken" })
    securitytoken: string;

    @Column({ name: "createdby" })
    createdby: string;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastmodifiedby: string;

    @Column({ name: "lastmodifieddate" })
    lastmodifieddate: Date;

    @Column({ name: "organization_id" })
    organizationId: string;

    @Column({ name: "phone" })
    phone: string;

    @Column({ name: "groupid" })
    groupid: string;

    @Column({ name: "resetkey" })
    resetkey: string;

    @Column({ name: "resetdate" })
    resetdate: Date;

    @Column({ name: "deletedby" })
    deletedby: string;

    @Column({ name: "deleteddatetime" })
    deleteddatetime: Date;

    @Column({ name: "deleted" })
    deleted: boolean;

    @Column({ name: "full_name" })
    fullName: string;

    @JoinColumn({ name: "groupid" })
    @ManyToOne(type => Usergroupconfig)
    userGroupConfig: Usergroupconfig;

    @JoinColumn({ name: "groupid" })
    @ManyToOne(type => Usergroup)
    userGroup: Usergroup;
}
