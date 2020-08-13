import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("fixedassetgroup")
export class FixedAssetGroup {
    @PrimaryColumn({ name: "groupid" })
    groupid: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "autonumber" })
    autoNumber: number;

    @Column({ name: "autonumbersequence" })
    autoNumberSequence: string;

    @Column({ name: "barcodenumbersequence" })
    barCodeNumberSequence: string;

    @Column({ name: "autonumberbarcode" })
    autoNumberBarCode: number;

    @Column({ name: "assettype" })
    assetType: number;

    @Column({ name: "majortype" })
    majorType: string;

    @Column({ name: "propertytype" })
    propertyType: number;

    @Column({ name: "gislayerid" })
    gislayerId: string;

    @Column({ name: "location" })
    location: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "recid" })
    recid: number;

    @Column({ name: "deletedby" })
    deletedBy: string;

    @Column({ name: "deleteddatetime" })
    deletedDateTime: Date;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({ name: "deleted" })
    deleted: boolean;

    @Column({ name: "namealias" })
    nameAlias: string;

    @Column({ name: "servicelife" })
    serviceLife: number;

    @Column({ name: "depricationperiod" })
    depricationPeriod: number;

    @Column({ name: "deprication" })
    deprication: boolean;

    @Column({ name: "periodfrequency" })
    periodFrequency: number;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: string;

    @Column({ name: "capitalizationthreshold" })
    capitalizationThreshold: number;

    @Column({ name: "replacementcostfactor" })
    replacementCostFactor: number;

    @Column({ name: "insuredvaluefactor" })
    insuredValueFactor: number;
}
