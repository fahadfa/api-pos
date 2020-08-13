import { Entity, PrimaryColumn, Column } from "typeorm";
@Entity("workdays")
export class WorkDays {
  @PrimaryColumn({ name: "id", type: "uuid" })
  id: string;

  @Column({ name: "day_name" })
  dayName: string;

  @Column({ name: "day_no" })
  dayNo: number;

  @Column({ name: "is_working_day" })
  isWorkingDay: boolean;

  @Column({ name: "year" })
  year: string;
  
  @Column({ name: "store_code" })
  storeCode: string;

  @Column({ name: "date" })
  date: Date;

  @Column({ name: "dataareaid" })
  dataAreaId: string;

  @Column({ name: "updated_by" })
  updatedBy: string;

  @Column({ name: "updated_on" })
  updatedOn: Date;
}

export enum WeekdayNames {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY"
}
export enum WeekdayNumber{
    SUNDAY=0,
    MONDAY=1,
    TUESDAY=2,
    WEDNESDAY=3,
    THURSDAY=4,
    FRIDAY=5,
    SATURDAY=6
   }