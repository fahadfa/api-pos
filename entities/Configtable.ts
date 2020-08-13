import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Inventtable } from "./Inventtable";

@Entity("configtable")
export class Configtable {
  @Column({ name: "id" })
  id: String;

  @Column({ name: "itemid" })
  itemid: string;

  @Column({ name: "name" })
  nameArabic: string;

  @Column({ name: "name" })
  nameEnglish: string;

  @PrimaryColumn({ name: "configid" })
  code: string;

  @Column({ name: "hexcode" })
  hexCode: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recid" })
  recid: Number;

//   @JoinColumn({ name: "itemid" })
//   @ManyToOne(type => Inventtable)
//   product: Inventtable;
}
