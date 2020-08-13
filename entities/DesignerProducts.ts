import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Products } from "./Products";

@Entity("designer_products")
export class DesignerProducts {
    @PrimaryGeneratedColumn({ name: "id" })
    id: string;

    @Column({ name: "name_en" })
    nameEn: string;

    @Column({ name: "name_ar" })
    nameAr: string;

    @Column({ name: "code" })
    code: string;

    @Column({ name: "price" })
    price: string;

    @Column({ name: "vat" })
    vat: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "created_by" })
    createdBy: string;

    @Column({ name: "updated_by" })
    updatedBy: string;

    @Column({ name: "created_on" })
    createdOn: Date;

    @Column({ name: "updated_on" })
    updatedOn: Date;
}
