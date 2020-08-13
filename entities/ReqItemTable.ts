import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
  

@Entity("req_item_table")
export class ReqItemTable { 
    @PrimaryColumn({name: "recid"}) 
    recid: string;

    @Column({name: "itemid"}) 
    itemid: string;

    @Column({name: "convinvent_dimid"}) 
    convinventDimid: string;

    @Column({name: "time_fence_fields_active"}) 
    timeFenceFieldsActive: number;

    @Column({name: "covrule"}) 
    covrule: number;

    @Column({name: "min_inventon_hand"}) 
    minInventonHand: number;

    @Column({name: "max_inventon_hand"}) 
    maxInventonHand: number;

    @Column({name: "lead_time_purchase"}) 
    leadTimePurchase: number;

    @Column({name: "lead_time_production"}) 
    leadTimeProduction: number;

    @Column({name: "authorization_time_fence"}) 
    authorizationTimeFence: number;

    @Column({name: "vendid"}) 
    vendid: string;

    @Column({name: "min_safety_keyid"}) 
    minSafetyKeyid: string;

    @Column({name: "min_satisfy"}) 
    minSatisfy: number;

    @Column({name: "req_groupid"}) 
    reqGroupid: string;

    @Column({name: "req_po_type"}) 
    reqPoType: number;

    @Column({name: "max_positive_days"}) 
    maxPositiveDays: number;

    @Column({name: "max_negative_days"}) 
    maxNegativeDays: number;

    @Column({name: "cov_time_efence"}) 
    covTimeEfence: number;

    @Column({name: "max_safety_keyid"}) 
    maxSafetyKeyid: string;

    @Column({name: "invent_locationid_req_main"}) 
    inventLocationidReqMain: string;

    @Column({name: "min_safety_pperiod"}) 
    minSafetyPperiod: number;

    @Column({name: "calendar_days_production"}) 
    calendarDaysProduction: number;

    @Column({name: "calendar_days_purchase"}) 
    calendarDaysPurchase: number;

    @Column({name: "lead_time_transfer"}) 
    leadTimeTransfer: number;

    @Column({name: "calendar_days_transfer"}) 
    calendarDaysTransfer: number;

    @Column({name: "lead_time_transfer_active"}) 
    leadTimeTransferActive: number;

    @Column({name: "lead_time_production_active"}) 
    leadTimeProductionActive: number;

    @Column({name: "lead_time_purchase_active"}) 
    leadTimePurchaseActive: number;

    @Column({name: "cov_fields_active"}) 
    covFieldsActive: number;

    @Column({name: "req_po_type_active"}) 
    reqPoTypeActive: number;

    @Column({name: "item_cov_fields_active"}) 
    itemCovFieldsActive: number;

    @Column({name: "locking_timefence"}) 
    lockingTimefence: number;

    @Column({name: "explosion_timefence"}) 
    explosionTimefence: number;

    @Column({name: "capacity_timefence"}) 
    capacityTimefence: number;

    @Column({name: "pmf_planning_itemid"}) 
    pmfPlanningItemid: string;

    @Column({name: "pmf_plan_priority_current"}) 
    pmfPlanPriorityCurrent: number;

    @Column({name: "pmf_plan_priority_date_changed"}) 
    pmfPlanPriorityDateChanged: Date;

    @Column({name: "pmf_plan_priority_default"}) 
    pmfPlanPriorityDefault: number;

    @Column({name: "time_fence_back_requisition"}) 
    timeFenceBackRequisition: number;

    @Column({name: "on_hand_active"}) 
    onHandActive: number;

    @Column({name: "on_hand_consumption_strategy"}) 
    onHandConsumptionStrategy: number;

    @Column({name: "data_areaid"}) 
    dataAreaid: string;

    @Column({name: "rec_version"}) 
    recVersion: number;

    @Column({name: "partition"}) 
    partition: number;

    @Column({name: "dt_max_region_stock"}) 
    dtMaxRegionStock: number;

    @Column({name: "updated_on"}) 
    updatedOn: Date;

    @Column({name: "updated_by"}) 
    updatedBy: string;
}

