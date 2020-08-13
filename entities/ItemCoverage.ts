import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("item_coverage")
export class ItemCoverage{
    @PrimaryColumn({ name: "recid" })
    recid:number;

    @Column({name:"itemid"})
    itemid :string;

    @Column({name:"min_qty"})
    minQty :number;


    @Column({name:"max_qty"})
    maxQty :string;

    @Column({name:"main_ware_house"})
    mainWareHouse:string;

    @Column({name:"dataareaid"})
    dataareaid :string;

    @Column({name:"invent_dimid"})
    inventDimid :string;

    @Column({name:"configid"})
    configid :string;

    @Column({name:"inventsizeid"})
    inventsizeid :string;

    @Column({name:"inventlocationid"})
    inventlocationid :string;

    @Column({name:"updated_by"})
    updatedBy :string;

    @Column({name:"updated_on"})
    updatedOn :Date;

    @Column({name:"lead_time"})
    leadTime :number;


}