import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("salesorder_tokens")
export class SalesOrderTokens {
    @PrimaryColumn({ name: "order_id" })
    orderId: string;

    @Column({ name: "customer_id" })
    customerId: string;

    @Column({ name: "email" })
    email: string;

    @Column({ name: "auth_token" })
    authToken: string;

    @Column({ name: "updated_by" })
    updatedBy: string;

    @Column({ name: "updated_on" })
    updatedOn: Date;
}
