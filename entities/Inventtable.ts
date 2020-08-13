import { Entity, PrimaryColumn,PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
 
@Entity("inventtable")
export class Inventtable {
 @Column({ name: "id" })
 id: String;
 
 @PrimaryColumn({ name: "itemid" })
 code: string;
 
 @Column({ name: "itemgroupid" })
 itemGroupId: string;
 
 @Column({ name: "itemname" })
 nameAr: string;
 
 @Column({ name: "itemtype" })
 itemtype: number;
 
 @Column({ name: "namealias" })
 nameEn: string;
 
 @Column({ name: "int_ext" })
 intExt: string;

 @Column({ name: "citgroupid" })
 citGroupId: string;
 
 @Column({ name: "updated_on" })
 updatedOn: string;
 
 @Column({ name: "citbaseproduct" })
 citbaseproduct: string;
 
 @Column({ name: "dataareaid" })
 dataareaid: string;
 
 @Column({ name: "recid" })
 recid: Number;
 
 @JoinColumn({name: "citbaseproduct"})
 @ManyToOne(type=>Inventtable)
 product: Inventtable
}
 
 

