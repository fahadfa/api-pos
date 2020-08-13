import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { FixedAssetGroup } from "./FixedAssetGroup";

@Entity("fixedassettable")
export class FixedAssetTable {
    @PrimaryColumn({ name: "assetid" })
    assetId: string;

    @Column({ name: "assetgroup" })
    assetGroup: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "location" })
    location: string;

    @Column({ name: "documents" })
    documents: string;

    @Column({ name: "serialnum" })
    serialNum: string;

    @Column({ name: "insurancepolicynum" })
    insurancePolicyNum: string;

    @Column({ name: "make" })
    make: string;

    @Column({ name: "model" })
    model: string;

    @Column({ name: "guaranteedate" })
    guaranteeDate: Date;

    @Column({ name: "mainassetid" })
    mainassetId: string;

    @Column({ name: "responsible" })
    responsible: string;

    @Column({ name: "assettype" })
    assetType: number;

    @Column({ name: "quantity" })
    quantity: number;

    @Column({ name: "barcode" })
    barCode: string;

    @Column({ name: "unitofmeasure" })
    unitOfMeasure: string;

    @Column({ name: "insurancedate1" })
    insuranceDate1: Date;

    @Column({ name: "insurancedate2" })
    insuranceDate2: Date;

    @Column({ name: "sortingid" })
    sortingId: string;

    @Column({ name: "taxcountyno" })
    taxCountyNo: string;

    @Column({ name: "subventionno" })
    subVentionNo: number;

    @Column({ name: "subventiontaxfreeno" })
    subVentionTaxFreeNo: number;

    @Column({ name: "assessmentno" })
    assessmentNo: number;

    @Column({ name: "assessmenttaxno" })
    assessmentTaxNo: number;

    @Column({ name: "acquisitionvalueno" })
    acquisitionValueNo: number;

    @Column({ name: "valueat19840101no" })
    valueAt19840101No: number;

    @Column({ name: "returnoninvestmentsno" })
    returnOnInvestmentsNo: number;

    @Column({ name: "sortingid2" })
    sortingId2: string;

    @Column({ name: "sortingid3" })
    sortingId3: string;

    @Column({ name: "namealias" })
    namealias: string;

    @Column({ name: "techinfo1" })
    techInfo1: string;

    @Column({ name: "techinfo2" })
    techInfo2: string;

    @Column({ name: "techinfo3" })
    techInfo3: string;

    @Column({ name: "lastmaintenance" })
    lastMaintenance: Date;

    @Column({ name: "nextmaintenance" })
    nextMaintenance: Date;

    @Column({ name: "maintenanceinfo1" })
    maintenanceInfo1: string;

    @Column({ name: "maintenanceinfo2" })
    maintenanceInfo2: string;

    @Column({ name: "maintenanceinfo3" })
    maintenanceInfo3: string;

    @Column({ name: "physicalinventory" })
    physicalInventory: Date;

    @Column({ name: "reference" })
    reference: string;

    @Column({ name: "es" })
    es: string;

    @Column({ name: "unitcost" })
    unitCost: number;

    @Column({ name: "purchlinerecid" })
    purchLineRecid: number;

    @Column({ name: "majortype" })
    majorType: string;

    @Column({ name: "parcelid" })
    parcelId: string;

    @Column({ name: "propertytype" })
    propertyType: number;

    @Column({ name: "gisreferencenumber" })
    gisReferenceNumber: string;

    @Column({ name: "locationmemo" })
    locationMemo: string;

    @Column({ name: "roomnumber" })
    roomNumber: string;

    @Column({ name: "contactname" })
    contactName: string;

    @Column({ name: "modelyear" })
    modelYear: string;

    @Column({ name: "disposalrestriction" })
    disposalRestriction: string;

    @Column({ name: "lease" })
    lease: string;

    @Column({ name: "titleholder" })
    titleHolder: string;

    @Column({ name: "insurancevendor" })
    insuranceVendor: string;

    @Column({ name: "insuranceagent" })
    insuranceAgent: string;

    @Column({ name: "policyexpiration" })
    policyExpiration: Date;

    @Column({ name: "lastfactorupdatedate" })
    lastFactorUpdateDate: Date;

    @Column({ name: "insuredatmarketvalue" })
    insureDatMarketValue: number;

    @Column({ name: "condition" })
    condition: string;

    @Column({ name: "modifieddatetime" })
    modifiedDateTime: Date;

    @Column({ name: "del_modifiedtime" })
    delModifiedTime: number;

    @Column({ name: "modifiedby" })
    modifiedBy: string;

    @Column({ name: "createddatetime" })
    createdDateTime: Date;

    @Column({ name: "del_createdtime" })
    delCreatedTime: number;

    @Column({ name: "createdby" })
    createdBy: string;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "recid" })
    recid: number;

    @Column({ name: "dimension" })
    region: String;

    @Column({ name: "dimension2_" })
    department: String;

    @Column({ name: "dimension3_" })
    costcenter: String;

    @Column({ name: "dimension4_" })
    employee: String;

    @Column({ name: "dimension5_" })
    project: String;

    @Column({ name: "dimension6_" })
    salesman: String;

    @Column({ name: "dimension7_" })
    brand: String;

    @Column({ name: "dimension8_" })
    productline: String;

    @Column({ name: "deletedby" })
    deletedBy: string;

    @Column({ name: "deleteddatetime" })
    deletedDateTime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: string;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({ name: "deleted" })
    deleted: boolean;

    @Column({ name: "reponsible" })
    reponsible: string;

    @Column({ name: "insuranceplicynum" })
    insurancePlicyNum: string;

    @Column({ name: "latitude" })
    latitude: string;

    @Column({ name: "longitude" })
    longitude: string;

    @Column({ name: "citycode" })
    cityCode: string;

    @Column({ name: "districtcode" })
    districtCode: string;

    @Column({ name: "deliveryaddress" })
    deliveryAddress: string;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: string;

    @Column({ name: "insuredvalue" })
    insuredValue: number;

    @Column({ name: "assetreplacecost" })
    assetReplaceCost: number;

    @Column({ name: "policyamount" })
    policyAmount: number;

    @JoinColumn({ name: "assetgroup" })
    @ManyToOne(type => FixedAssetGroup)
    fixedAssetGroup: FixedAssetGroup;
}
