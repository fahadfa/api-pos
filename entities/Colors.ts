import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("colors")
export class Colors {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    @Column({ name: "name_ar" })
    nameArabic: string;

    @Column({ name: "name_en" })
    nameEnglish: string;

    @Column({ name: "code" })
    code: string;

    @Column({ name: "hex" })
    hexCode: string;

    // @Column({ name: "red" })
    // red: Number;

    // @Column({ name: "green" })
    // green: Number;

    // @Column({ name: "blue" })
    // blue: Number;

    // @Column({ name: "hue" })
    // hue: Number;

    // @Column({ name: "saturation" })
    // saturation: Number;

    // @Column({ name: "value" })
    // value: Number;

    // @Column({ name: "img_id" })
    // imgId: string;

    @Column({ name: "deleted_at" })
    deletedAt: Date;

    // @Column({ name: "inserted_at" })
    // insertedAt: Date;

    // @Column({ name: "updated_at" })
    // updatedAt: Date;

    // @Column({ name: "order_index" })
    // orderIndex: Number;

    // @Column({ name: "badge_text" })
    // badgeText: Number;

    @Column({ name: "active" })
    active: boolean;
}
