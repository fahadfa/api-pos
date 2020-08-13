import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("sales_targets")
export  class SalesTargets{
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({name:"store_code"})
    storeCode:string;

    @Column({name:"year"})
    year:string;

    @Column({name:"month_1"})
    month1:number;

    @Column({name:"month_2"})
    month2:number;

    @Column({name:"month_3"})
    month3:number;

    @Column({name:"month_4"})
    month4:number;

    @Column({name:"month_5"})
    month5:number;

    @Column({name:"month_6"})
    month6:number;

    @Column({name:"month_7"})
    month7:number;

    @Column({name:"month_8"})
    month8:string;

    @Column({name:"month_9"})
    month9:number;

    @Column({name:"month_10"})
    month10:string;

    @Column({name:"month_11"})
    month11:number;

    @Column({name:"month_12"})
    month12:number;

    @Column({name:"year_target"})
    yearTarget:number;
    
    @Column({name:"updatedby"})
    updatedBy:string;
    
    @Column({name:"updatedon"})
    updatedOn:Date;
    
}