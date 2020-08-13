import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("movementtype")
export class MovementType {
    @PrimaryColumn({ name: "id" })
    id: number;

    @Column({ name: "movementtype" })
    movementType: string;

    @Column({ name: "offsetaccount" })
    offsetaccount: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "movementarabic" })
    movementArabic: string;

    @Column({ name: "inuse" })
    inuse: string;
}
