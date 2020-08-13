import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity("bankaccounttable")
export class BankAccountTable {
    @PrimaryColumn({ name: "accountid" })
    accountId: string;

    @Column({ name: "ledgeraccount" })
    ledgerAccount: string;

    @Column({ name: "bankgroupid" })
    bankGroupId: string;

    @Column({ name: "currencycode" })
    currencyCode: string;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "address" })
    address: string;

    @Column({ name: "zipcode" })
    zipcode: string;

    @Column({ name: "county" })
    county: string;

    @Column({ name: "countryregionid" })
    countryRegionId: string;

    @Column({ name: "accountnum" })
    accountnum: string;

    @Column({ name: "bankdestinationname" })
    bankDestinationName: string;

    @Column({ name: "companygroupaccount" })
    companyGroupAccount: string;

    @Column({ name: "bankcompanystatementname" })
    bankCompanyStatementName: string;

    @Column({ name: "bankcin" })
    bankCin: string;

    @Column({ name: "bankinterbankclearingcode_be" })
    bankinterBankClearingCodeBe: Number;

    @Column({ name: "registrationnum" })
    registrationNum: string;

    @Column({ name: "phone" })
    phone: string;

    @Column({ name: "telefax" })
    teleFax: string;

    @Column({ name: "divisionpaymid" })
    divisionPaymId: string;

    @Column({ name: "email" })
    email: string;

    @Column({ name: "state" })
    state: string;

    @Column({ name: "mandatoryuser" })
    mandatoryUser: string;

    @Column({ name: "url" })
    url: string;

    @Column({ name: "telex" })
    telex: string;

    @Column({ name: "cellularphone" })
    cellularPhone: string;

    @Column({ name: "bankaccountvalidationmethod" })
    bankAccountValidationMethod: Number;

    @Column({ name: "bankmulticurrency" })
    bankMultiCurrency: Number;

    @Column({ name: "banksortcode" })
    bankSortCode: string;

    @Column({ name: "disccreditmaxmst" })
    discCreditMaxMst: string;

    @Column({ name: "bankclearingcode" })
    bankClearingCode: string;

    @Column({ name: "bankcontractaccount" })
    bankContractAccount: string;

    @Column({ name: "girocontract" })
    giroContract: string;

    @Column({ name: "girocontractaccount" })
    giroContractAccount: string;

    @Column({ name: "feecontractaccount" })
    feeContractAccount: string;

    @Column({ name: "companypaymid" })
    companyPaymId: string;

    @Column({ name: "custpaymfeepost" })
    custPaymFeePost: Number;

    @Column({ name: "custpaymfeeaccount" })
    custPaymFeeAccount: string;

    @Column({ name: "contactperson" })
    contactPerson: string;

    @Column({ name: "debitdirectid" })
    debitDirectId: string;

    @Column({ name: "swiftno" })
    swiftNo: string;

    @Column({ name: "discdelaynoticedays" })
    discDelayNoticeDays: Number;

    @Column({ name: "banksuffix" })
    bankSuffix: string;

    @Column({ name: "banktransfercode" })
    bankTransferCode: string;

    @Column({ name: "city" })
    city: string;

    @Column({ name: "street" })
    street: string;

    @Column({ name: "paymmankeepifremovedfrombatch" })
    paymManKeepIfRemovedFromBatch: number;

    @Column({ name: "pager" })
    pager: String;

    @Column({ name: "sms" })
    sms: string;

    @Column({ name: "bankcodetype" })
    bankCodeType: String;

    @Column({ name: "iban" })
    iban: number;

    @Column({ name: "ledgerjournalnameid" })
    ledgerJournalNameId: string;

    @Column({ name: "remitcollectionamount" })
    remitCollectionAmount: number;

    @Column({ name: "remitdiscountamount" })
    remitDiscountAmount: number;

    @Column({ name: "remitcollectionaccount" })
    remitCollectionAccount: string;

    @Column({ name: "remitdiscountaccount" })
    remitDiscountAccount: String;

    @Column({ name: "invoiceremitamount" })
    invoiceRemitAmount: number;

    @Column({ name: "invoiceremitaccount" })
    invoiceRemitAccount: string;

    @Column({ name: "includebankbarcode_fi" })
    includeBankBarCodeFi: number;

    @Column({ name: "printgiro_fi" })
    printGiroFi: number;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    @Column({ name: "recversion" })
    recversion: number;

    @Column({ name: "recid" })
    recid: number;
}