import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { SalesLine } from "./SalesLine";
import { isArray } from "util";

@Entity("applied_discounts")
export class AppliedDiscounts {
    @PrimaryColumn({ name: "id" })
    id: string;

    // @Column({ name: "salesline_id" })
    // saleslineId: string;

    @Column({ name: "discount_type" })
    discountType: string;

    @Column({ name: "percentage" })
    percentage: Number;

    @Column({ name: "discount_amount" })
    discountAmount: Number;

    @Column({ name: "cond", type: "json" })
    cond: JSON;

    @Column({ name: "updated_on" })
    updated_on: Date;

    @JoinColumn({ name: "salesline_id" })
    @ManyToOne(type => SalesLine)
    salesLine: SalesLine;
}
