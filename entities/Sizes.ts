import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("sizes")
export class Sizes {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "name_en" })
    nameEn: string;

    @Column({ name: "name_ar" })
    nameAr: string;

    @Column({ name: "code" })
    code: string;

    @Column({ name: "unit" })
    unit: string;

    @Column({ name: "volume" })
    volume: string;

    @Column({ name: "inserted_at" })
    insertedAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "deleted_at" })
    deletedAt: Date;
}
