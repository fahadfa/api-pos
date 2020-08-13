import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Products } from "../entities/Products";

@Entity("bases")
export class Bases {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "name_en" })
    nameEn: string;

    @Column({ name: "name_ar" })
    nameAr: string;

    @Column({ name: "code" })
    code: string;

    // @Column({ name: "inserted_at" })
    // insertedAt: Date;

    // @Column({ name: "updated_at" })
    // updatedAt: Date;

    // @Column({ name: "deleted_at" })
    // deletedAt: Date;

    @JoinColumn({ name: "product_id" })
    @ManyToOne(type => Products)
    products: Products;
}
