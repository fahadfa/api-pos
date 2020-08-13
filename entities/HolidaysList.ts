import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity("holidays_list")
export class HolidaysList {
  @PrimaryColumn({ name: "id" })
  id: string;

  @Column({ name: "day_name" })
  dayName: string;

  @Column({ name: "day_no" })
  dayNo: number;

  @Column({ name: "date" })
  date: Date;

  @Column({ name: "type" })
  type: string;

  @Column({ name: "reason" })
  reason: string;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "updated_by" })
  updatedBy: string;

  @Column({ name: "updated_on" })
  updatedOn: Date;

  @Column({ name: "store_code" })
  storeCode: string;
}
