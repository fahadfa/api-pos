import { PrimaryColumn, Column, Entity } from "typeorm";

@Entity("invent_item_invent_setup")
export class InventItemInventSetup {
  @PrimaryColumn({ name: "recid" })
  recid: number;

  @Column({ name: "itemid" })
  itemid: string;

  @Column({ name: "inventdimid" })
  inventdimid: string;

  @Column({ name: "inventdimid_default" })
  inventdimidDefault: string;

  @Column({ name: "mandatory_invent_site" })
  mandatoryInventSite: number;

  @Column({ name: "mandatory_invent_location" })
  mandatoryInventLocation: number;

  @Column({ name: "lowestqty" })
  lowestqty: number;

  @Column({ name: "highestqty" })
  highestqty: number;

  @Column({ name: "standardqty" })
  standardqty: number;

  @Column({ name: "leadtime" })
  leadtime: number;

  @Column({ name: "multipleqty" })
  multipleqty: number;

  @Column({ name: "calenrdays" })
  calenrdays: number;

  @Column({ name: "stopped" })
  stopped: number;

  @Column({ name: "override" })
  override: number;

  @Column({ name: "atp_incl_planned_orders" })
  atpInclPlannedOrders: number;

  @Column({ name: "atp_timefence" })
  atpTimefence: number;

  @Column({ name: "delivery_date_control_type" })
  deliveryDateControlType: number;

  @Column({ name: "atp_backward_supply_timefence" })
  atpBackwardSupplyTimefence: number;

  @Column({ name: "atp_backward_demand_timefence" })
  atpBackwardDemandTimefence: number;

  @Column({ name: "atp_apply_demand_timefence" })
  atpApplyDemandTimefence: number;

  @Column({ name: "atp_apply_suppliy_timefence" })
  atpApplySuppliyTimefence: number;

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
