import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("inventlocation")
export class Inventlocation {
    @PrimaryColumn({ name: "inventlocationid" })
    inventLocationId: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "namealias" })
    nameAlias: string;

    @Column({ name: "manual" })
    manual: Number;

    @Column({ name: "wmslocationiddefaultreceipt" })
    wmsLocationIdDefaultReceipt: string;

    @Column({ name: "wmslocationiddefaultissue" })
    recoawmsLocationIdDefaultIssuetTimeAr: string;

    @Column({ name: "inventlocationidreqmain" })
    inventLocationIdReqMain: string;

    @Column({ name: "reqrefill" })
    reqRefill: Number;

    @Column({ name: "inventlocationtype" })
    inventLocationType: Number;

    @Column({ name: "inventlocationidquarantine" })
    inventLocationIdQuarantine: string;

    @Column({ name: "inventlocationlevel" })
    inventLocationLevel: Number;

    @Column({ name: "reqcalendarid" })
    reqCalendarId: string;

    @Column({ name: "wmsaislenameactive" })
    wmsaisleNameActive: Number;

    @Column({ name: "wmsracknameactive" })
    wmsrackNameActive: Number;

    @Column({ name: "wmsrackformat" })
    wmsrackformat: string;

    @Column({ name: "wmslevelformat" })
    wmsLevelFormat: string;

    @Column({ name: "wmspositionnameactive" })
    wmsPositionNameActive: Number;

    @Column({ name: "wmspositionformat" })
    wmsPositionFormat: Number;

    @Column({ name: "inventlocationidtransit" })
    inventLocationIdTransit: string;

    @Column({ name: "vendaccount" })
    vendAccount: string;

    @Column({ name: "branchnumber" })
    branchNumber: string;

    @Column({ name: "inventsiteid" })
    inventSiteId: string;

    @Column({ name: "dataareaid" })
    dataAreaId: string;

    @Column({ name: "recversion" })
    recVersion: Number;

    @Column({ name: "recid" })
    recId: Number;

    @Column({ name: "modifieddatetime" })
    modifiedDateTime: Date;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "telphone" })
    telphone: string;

    @Column({ name: "selectformps" })
    selectFormps: Number;

    @Column({ name: "wip" })
    wip: string;

    @Column({ name: "dimensions" })
    dimensions: string;

    @Column({ name: "dimensions2_" })
    dimensions2_: string;

    @Column({ name: "dimensions3_" })
    dimensions3_: string;

    @Column({ name: "dimensions4_" })
    dimensions4_: string;

    @Column({ name: "dimensions5_" })
    dimensions5_: string;

    @Column({ name: "dimensions6_" })
    dimensions6_: string;

    @Column({ name: "dimensions7_" })
    dimensions7_: string;

    @Column({ name: "dimensions8_" })
    dimensions8_: string;

    @Column({ name: "journalnameid" })
    journalnameId: string;

    @Column({ name: "status" })
    status: string;
}
