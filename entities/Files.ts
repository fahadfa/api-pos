import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("files")
export class Files {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "type" })
    type: string;

    @Column({ name: "size" })
    size: Number;

    @Column({ name: "key" })
    key: string;

    @Column({ name: "state" })
    state: string;

    @Column({ name: "inserted_at" })
    insertedAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;
}
