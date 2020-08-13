import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("menu")
export class Menu {
  @PrimaryGeneratedColumn({ name: "id" })
  id: Number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "name_ar" })
  nameAr: string;

  @Column({ name: "link" })
  link: string;

  @Column({ name: "icon" })
  icon: string;

  @Column({ name: "active" })
  active: boolean;

  @Column({ name: "parent_id" })
  parentId: Number;

  @Column({ name: "priority" })
  priority: Number;

  @Column({ name: "is_mobile" })
  isMobile: boolean;

  @Column({ name: "created_by" })
  createdBy: string;

  @Column({ name: "created_date" })
  createdDate: Date;

  @Column({ name: "updated_by" })
  updatedBy: string;

  @Column({ name: "updated_date" })
  updatedDate: Date;
}
