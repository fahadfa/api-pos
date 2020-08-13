import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("inventory_onhand")
export class InventoryOnhand {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "itemid" })
    itemid: string;

    @Column({ name: "configid" })
    configid: string;

    @Column({ name: "inventsizeid" })
    inventsizeid: string;

    @Column({ name: "batchno" })
    batchno: string;

    @Column({ name: "qty_in" })
    qtyIn: number;

    @Column({ name: "qty_out" })
    qtyOut: number;

    @Column({ name: "qty_reserved" })
    qtyReserved: number;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "inventlocationid" })
    inventlocationid: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "updated_on" })
    updatedOn: Date;

    @Column({ name: "updated_by" })
    updatedBy: string;
}
