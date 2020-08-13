import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { Inventtable } from "./Inventtable";

@Entity("inventsize")
export class Inventsize {
  @Column({ name: "id" })
  id: String;

  @Column({ name: "itemid" })
  itemid: string;

  @Column({ name: "name" })
  nameArabic: string;

  @Column({ name: "description" })
  nameEnglish: string;

  @PrimaryColumn({ name: "inventsizeid" })
  code: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recid" })
  recid: Number;

  @JoinColumn({ name: "itemid" })
  @ManyToOne(type => Inventtable)
  product: Inventtable;
}
