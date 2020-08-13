import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Sizes } from "../entities/Sizes";
import { Bases } from "./Bases";

@Entity("base_sizes")
export class BaseSizes {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    // @Column({ name: "price_ap" })
    // priceAp: Number;

    // @Column({ name: "price_ap2" })
    // priceAp2: Number;

    // @Column({ name: "price_app" })
    // priceApp: Number;

    // @Column({ name: "price_p1" })
    // priceP1: Number;

    // @Column({ name: "price_p2" })
    // priceP2: Number;

    // @Column({ name: "price_p3" })
    // priceP3: Number;

    // @Column({ name: "price_p4" })
    // priceP4: Number;

    // @Column({ name: "price_p5" })
    // priceP5: Number;

    // @Column({ name: "price_p6" })
    // priceP6: Number;

    // @Column({ name: "price_p7" })
    // priceP7: Number;

    // @Column({ name: "price_ip" })
    // priceIp: Number;

    // @Column({ name: "price_ap10m" })
    // priceAp10m: Number;

    // @Column({ name: "price_ap10per" })
    // priceAp10per: Number;

    // @Column({ name: "product_id" })
    // productId: Number;

    @Column({ name: "inserted_at" })
    insertedAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;

    @Column({ name: "deleted_at" })
    deletedAt: Date;

    @JoinColumn({ name: "base_id" })
    @ManyToOne(type => Bases)
    base: Bases;

    @JoinColumn({ name: "size_id" })
    @ManyToOne(type => Sizes)
    sizes: Sizes;
}
