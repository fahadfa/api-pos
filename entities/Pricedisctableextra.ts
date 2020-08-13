import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("pricdisctableextra")
export class Pricedisctableextra {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "itemid" })
    itemid: string;

    @Column({ name: "inventdimid" })
    inventdimid: string;

    @Column({ name: "amount" })
    amount: Number;

    @Column({ name: "itemrelation" })
    itemrelation: string;

    @Column({ name: "configid" })
    configid: string;

    @Column({ name: "inventsizeid" })
    inventsizeid: string;

    @Column({ name: "modifieddatetime" })
    modifieddatetime: Date;

    @Column({ name: "createddatetime" })
    createddatetime: Date;
}
