import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { BaseSizes } from "../entities/BaseSizes";
import { Colors } from "../entities/Colors";

@Entity("base_size_colors")
export class BaseSizeColors {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    @Column({ name: "price" })
    price: Number;

    @Column({ name: "product_id" })
    productId: Number;

    @Column({ name: "inserted_at" })
    insertedAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "deleted_at" })
    deletedAt: Date;

    @JoinColumn({ name: "color_id" })
    @ManyToOne(type => Colors)
    colors: Colors;

    @JoinColumn({ name: "base_size_id" })
    @ManyToOne(type => BaseSizes)
    baseSizes: BaseSizes;
}
