import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("invent_item_sales_setup")
export class InventItemSalesSetup {
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

  @Column({ name: "multipleqty" })
  multipleqty: number;

  @Column({ name: "lowestqty" })
  lowestqty: number;

  @Column({ name: "highestqty" })
  highestqty: number;

  @Column({ name: "leadtime" })
  leadtime: number;
  
  @Column({ name: "atp_incl_planned_orders" })
  atpInclPlannedOrders: number;

  @Column({ name: "stopped" })
  stopped: number;

  @Column({ name: "override" })
  override: number;

  @Column({ name: "atp_timefence" })
  atpTimefence: number;

  @Column({ name: "delivery_date_control_type" })
  deliveryDateControlType: number;

  @Column({ name: "overide_sales_leadtime" })
  overideSalesLeadtime: number;

  @Column({ name: "atp_apply_supply_timefence" })
  atpApplySupplyTimefence: number;

  @Column({ name: "atp_apply_demand_and_timefence" })
  atpApplyDemandAndTimefence: number;

  @Column({ name: "atp_backward_demand_timefence" })
  atpBackwardDemandTimefence: number;

  @Column({ name: "atp_backward_supply_timefence" })
  atpBackwardSupplyTimefence: number;

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
