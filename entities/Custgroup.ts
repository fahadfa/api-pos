import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("custgroup")
export class Custgroup {
    @PrimaryColumn({ name: "custgroup" })
    custgroup: Number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "namearabic" })
    namearabic: string;
}
