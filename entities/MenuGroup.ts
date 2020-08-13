import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

import { Usergroup } from "./Usergroup";
import { Menu } from "./Menu";

@Entity("menu_group")
export class MenuGroup {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    @Column({ name: "active" })
    active: boolean;

    @Column({ name: "write_access" })
    writeAccess: boolean;

    @Column({ name: "delete_access" })
    deleteAccess: boolean;

    @Column({ name: "created_by" })
    createdBy: string;

    @Column({ name: "created_date" })
    createdDate: Date;

    @Column({ name: "updated_by" })
    updatedBy: string;

    @Column({ name: "updated_date" })
    updatedDate: Date;

    @JoinColumn({ name: "group_id" })
    @ManyToOne(type => Usergroup)
    group: Usergroup;

    @JoinColumn({ name: "menu_id" })
    @ManyToOne(type => Menu)
    menu: Menu;
}
