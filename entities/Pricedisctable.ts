import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("productdisctable")
export class Pricedisctable {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "agreement" })
    agreement: string;

    @Column({ name: "itemcode" })
    itemcode: Number;

    @Column({ name: "accountcode" })
    accountcode: Number;

    @Column({ name: "itemrelation" })
    itemrelation: string;

    @Column({ name: "accountrelation" })
    accountrelation: string;

    @Column({ name: "quantityamount" })
    quantityamount: Number;

    @Column({ name: "fromdate" })
    fromdae: Date;

    @Column({ name: "todate" })
    todate: Date;

    @Column({ name: "amount" })
    amount: Number;

    @Column({ name: "currency" })
    currency: string;

    @Column({ name: "prcent1" })
    percent1: Number;

    @Column({ name: "percent2" })
    percent2: Number;

    @Column({ name: "deliverytime" })
    delivery: Number;

    @Column({ name: "searchagain" })
    searchagain: Number;

    @Column({ name: "priceunit" })
    priceunit: Number;

    @Column({ name: "relation" })
    relation: Number;

    @Column({ name: "unitid" })
    unitid: string;

    @Column({ name: "markup" })
    markup: string;

    @Column({ name: "allocatemarkup" })
    allocatemarkup: string;

    @Column({ name: "module" })
    module: Number;

    @Column({ name: "inventdimid" })
    inventdimid: string;

    @Column({ name: "calenderdays" })
    calenderdays: Number;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "modifieddatetime" })
    modifieddatetime: Date;

    @Column({ name: "createddatetime" })
    createddatetime: Date;

    @Column({ name: "tinventsizeid" })
    inventsizeid: string;
}
