import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("accountstable")
export class AccountsTable {
    @PrimaryColumn({ name: "accountnum" })
    accountNum: string;

    @Column({ name: "accountname" })
    accountName: string;

    @Column({ name: "accountpltype" })
    accountType: Number;

    @Column({ name: "offsetaccount" })
    offsetAccount: String;

    @Column({ name: "ledgerclosing" })
    ledgerClosing: Boolean;

    @Column({ name: "taxgroup" })
    taxGroup: String;

    @Column({ name: "blockedinjournal" })
    blockedInJournal: Number;

    @Column({ name: "debcredproposal" })
    debcredProposal: Number;

    @Column({ name: "srucode" })
    sruCode: String;

    @Column({ name: "conversionprinciple" })
    conversionPrinciple: Number;

    @Column({ name: "openingaccount" })
    openingAccount: String;

    @Column({ name: "companygroupaccount" })
    companyGroupAccount: String;

    @Column({ name: "dimspec" })
    dimSpec: Number;

    @Column({ name: "taxcode" })
    taxCode: String;

    @Column({ name: "mandatorytaxcode" })
    mandatoryTaxCode: Number;

    @Column({ name: "currencycode" })
    currencyCode: String;

    @Column({ name: "mandatorycurrency" })
    mandatoryCurrency: Number;

    @Column({ name: "autoallocate" })
    autoalLocate: Number;

    @Column({ name: "posting" })
    posting: Number;

    @Column({ name: "mandatoryposting" })
    mandatoryPosting: Number;

    @Column({ name: "user_" })
    user_: String;

    @Column({ name: "mandatoryuser" })
    mandatoryUser: Number;

    @Column({ name: "debcredcheck" })
    debcredCheck: Number;

    @Column({ name: "reversesign" })
    reverseSign: Number;

    @Column({ name: "column_" })
    column_: Number;

    @Column({ name: "taxdirection" })
    taxDirection: Number;

    @Column({ name: "linesub" })
    lineSub: Number;

    @Column({ name: "lineexceed" })
    lineExceed: Number;

    @Column({ name: "underlinenumerals" })
    underLinenumerals: Number;

    @Column({ name: "underlinetxt" })
    underLineTxt: Number;

    @Column({ name: "italic" })
    italic: Number;

    @Column({ name: "boldtypeface" })
    boldTypeFace: Number;

    @Column({ name: "exchadjusted" })
    exchAdjusted: Number;

    @Column({ name: "accountnamealias" })
    accountNameAlias: String;

    @Column({ name: "closed" })
    closed: Number;

    @Column({ name: "debcredbalancedemand" })
    debCredBalanceDemand: Number;

    @Column({ name: "taxfree" })
    taxFree: Number;

    @Column({ name: "taxitemgroup" })
    taxItemGroup: String;

    @Column({ name: "monetary" })
    monetary: Number;

    @Column({ name: "totalbyperiod_fr" })
    totalByPeriodFr: Number;

    @Column({ name: "accountcategoryref" })
    accountCategoryRef: Number;

    @Column({ name: "mandatorypaymreference" })
    mandatoryPaymReference: Number;

    @Column({ name: "dataareaid" })
    dataareaid: String;

    @Column({ name: "recversion" })
    recVersion: Number;

    @Column({ name: "recid" })
    recId: Number;

    @Column({ name: "modifieddatetime" })
    modifiedDatetime: Date;

    @Column({ name: "deletedby" })
    deletedBy: String;

    @Column({ name: "deleteddatetime" })
    deletedDatetime: Date;

    @Column({ name: "createdby" })
    createdBy: String;

    @Column({ name: "createddatetime" })
    createdDatetime: Date;

    @Column({ name: "lastmodifiedby" })
    lastModifiedBy: String;

    @Column({ name: "lastmodifieddate" })
    lastModifiedDate: Date;

    @Column({ name: "deleted" })
    deleted: Boolean;

    @Column({ name: "balance" })
    balance: Number;

    @Column({ name: "financialdataareaid" })
    financialDataareaid: String;

    @Column({ name: "locked" })
    locked: Number;

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

    @Column({ name: "mandatorydimension" })
    mandatoryRegion: Number;

    @Column({ name: "mandatorydimension2_" })
    mandatorydDepartment: Number;

    @Column({ name: "mandatorydimension3_" })
    mandatoryCostcenter: Number;

    @Column({ name: "mandatorydimension4_" })
    mandatoryEmployee: Number;

    @Column({ name: "mandatorydimension5_" })
    mandatoryProject: Number;

    @Column({ name: "mandatorydimension6_" })
    mandatorySalesman: Number;

    @Column({ name: "mandatorydimension7_" })
    mandatoryBrand: Number;

    @Column({ name: "mandatorydimension8_" })
    mandatoryproductLine: String;
}
