import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("invent_item_purch_setup")
export class InventItemPurchSetup {
  @PrimaryColumn({ name: "recid" })
  recid: number;

  @Column({ name: "itemid" })
  itemid: string;

  @Column({ name: "inventdimid" })
  inventdimid: string;

  @Column({ name: "inventdimid_default" })
  inventdimidDefault: string;

  @Column({ name: "mandatory_invent_site" })
  mandatoryInventSite: number

  @Column({ name: "mandatory_invent_location" })
  mandatoryInventLocation: number;

  @Column({ name: "multipleqty" })
  multipleqty: number;

  @Column({ name: "lowestqty" })
  lowestqty: number;

  @Column({ name: "highestqty" })
  highestqty: number;

  @Column({ name: "standardqty" })
  standardqty: number;

  @Column({ name: "leadtime" })
  leadtime: number;

  @Column({ name: "calenrdays" })
  calenrdays: number;

  @Column({ name: "stopped" })
  stopped: number;

  @Column({ name: "override" })
  override: number;

  @Column({ name: "dataareaid" })
  dataareaid: string;

  @Column({ name: "recversion" })
  recversion: number;

  @Column({ name: "partition" })
  partition: number;


  @Column({ name: "updated_by" })
  updatedBy: string;

  @Column({ name: "updated_on" })
  updatedOn: Date;

}
