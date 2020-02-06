--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5 (Ubuntu 11.5-3.pgdg19.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';



CREATE TABLE public.accountstable (
    accountnum character varying(40) NOT NULL,
    accountname character varying(120),
    accountpltype integer,
    offsetaccount character varying(40),
    ledgerclosing boolean DEFAULT false,
    taxgroup character varying(60),
    blockedinjournal boolean DEFAULT false,
    debcredproposal integer,
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    conversionprinciple integer,
    srucode character varying(6),
    openingaccount character varying(40),
    companygroupaccount character varying(20),
    dimspec integer,
    taxcode character varying(60),
    mandatorytaxcode integer,
    currencycode character varying(6),
    mandatorycurrency integer,
    autoallocate integer,
    posting integer,
    mandatoryposting integer,
    user_ character varying(10),
    mandatoryuser integer,
    debcredcheck integer,
    reversesign integer,
    mandatorydimension integer,
    mandatorydimension2_ integer,
    mandatorydimension3_ integer,
    column_ integer,
    taxdirection integer,
    linesub integer,
    lineexceed integer,
    underlinenumerals integer,
    underlinetxt integer,
    italic integer,
    boldtypeface integer,
    exchadjusted integer,
    accountnamealias character varying(300),
    closed integer,
    debcredbalancedemand integer,
    taxfree integer,
    taxitemgroup character varying(60),
    monetary integer,
    totalbyperiod_fr integer,
    accountcategoryref integer,
    mandatorypaymreference integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    dimension4_ character varying(60),
    mandatorydimension4_ integer,
    dimension5_ character varying(60),
    mandatorydimension5_ integer,
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    mandatorydimension6_ integer,
    mandatorydimension7_ integer,
    dimension8_ character varying(60),
    mandatorydimension8_ integer,
    modifieddatetime timestamp without time zone,
    modifiedby character varying(10),
    deletedby character varying(50),
    deleteddatetime timestamp without time zone,
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    deleted boolean,
    balance numeric(28,12),
    financialdataareaid character varying(20),
    locked integer DEFAULT 0,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.accountstable OWNER TO mposdb;

--
-- Name: ajp_block_discounts; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.ajp_block_discounts (
    id text NOT NULL,
    dataareaid character varying(32) NOT NULL,
    inventlocationid character varying(32) NOT NULL,
    itemid character varying(32),
    accountnum character varying(32),
    price_disc_item_code character varying(32),
    price_disc_account_relation character varying(32),
    account_name character varying(150),
    created_date_time timestamp without time zone,
    modified_date_time timestamp without time zone,
    created_by character varying(32),
    modified_by character varying(32),
    recversion integer,
    recid bigint
);


ALTER TABLE public.ajp_block_discounts OWNER TO mposdb;

--
-- Name: app_lang; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.app_lang (
    id character varying(512) NOT NULL,
    en text NOT NULL,
    ar text NOT NULL,
    updated_by character varying(128) DEFAULT 'system'::character varying,
    updated_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.app_lang OWNER TO mposdb;

--
-- Name: applied_discounts; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.applied_discounts (
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    salesline_id uuid NOT NULL,
    discount_type character varying NOT NULL,
    percentage numeric(4,2) DEFAULT 0,
    discount_amount numeric(18,2) DEFAULT 0 NOT NULL,
    updated_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applied_discounts OWNER TO mposdb;

--
-- Name: base_size_colors; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.base_size_colors (
    price numeric DEFAULT 0,
    base_size_id character varying(255),
    color_id character varying(255),
    product_id bigint,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE public.base_size_colors OWNER TO mposdb;

--
-- Name: base_size_colors_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.base_size_colors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.base_size_colors_id_seq OWNER TO mposdb;

--
-- Name: base_size_colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.base_size_colors_id_seq OWNED BY public.base_size_colors.id;


--
-- Name: base_sizes; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.base_sizes (
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    price_ap numeric,
    price_ap2 numeric,
    price_app numeric,
    price_p1 numeric,
    price_p2 numeric,
    price_p3 numeric,
    price_p4 numeric,
    price_p5 numeric,
    price_p6 numeric,
    price_p7 numeric,
    price_ip numeric,
    price_ap10m numeric,
    price_ap10per numeric,
    base_id character varying(255),
    size_id character varying(255),
    product_id bigint,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    deleted boolean DEFAULT false
);


ALTER TABLE public.base_sizes OWNER TO mposdb;

--
-- Name: base_sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.base_sizes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.base_sizes_id_seq OWNER TO mposdb;

--
-- Name: base_sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.base_sizes_id_seq OWNED BY public.base_sizes.id;


--
-- Name: bases; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.bases (
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    name_en character varying(255),
    name_ar character varying(255),
    code character varying(255) NOT NULL,
    product_id bigint,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone,
    dataareaid text,
    deleted boolean DEFAULT false
);


ALTER TABLE public.bases OWNER TO mposdb;

--
-- Name: bases_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.bases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bases_id_seq OWNER TO mposdb;

--
-- Name: bases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.bases_id_seq OWNED BY public.bases.id;


--
-- Name: citymast; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.citymast (
    citycode character varying(20) NOT NULL,
    cityname character varying(300),
    citynamearb character varying(300),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    latitude numeric(28,12),
    longitude numeric(28,12),
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    jaz_fleet_id text,
    sub_region_code text,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.citymast OWNER TO mposdb;

--
-- Name: color_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.color_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.color_id_seq OWNER TO mposdb;

--
-- Name: colors; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.colors (
    id character varying DEFAULT public.uuid_generate_v1() NOT NULL,
    name_en character varying(255),
    name_ar character varying(255),
    code character varying(255) NOT NULL,
    hex character varying(255),
    red double precision,
    green double precision,
    blue double precision,
    hue double precision,
    saturation double precision,
    value double precision,
    img_id bigint,
    deleted_at timestamp without time zone,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    order_index integer DEFAULT 0,
    active boolean DEFAULT true,
    badge_text character varying(255),
    product_id bigint,
    deleted boolean DEFAULT false
);


ALTER TABLE public.colors OWNER TO mposdb;

--
-- Name: colors_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.colors_id_seq OWNER TO mposdb;

--
-- Name: colors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.colors_id_seq OWNED BY public.colors.id;


--
-- Name: configtable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.configtable (
    itemid character varying(40),
    configid character varying(60),
    name character varying(300),
    autogenerated integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    modifiedby character varying(10),
    allowsplitting integer,
    hexcode character varying(10),
    id bigint NOT NULL,
    created_by character varying(100),
    deleted boolean DEFAULT false
);


ALTER TABLE public.configtable OWNER TO mposdb;

--
-- Name: configtable_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.configtable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.configtable_id_seq OWNER TO mposdb;

--
-- Name: configtable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.configtable_id_seq OWNED BY public.configtable.id;


--
-- Name: country; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.country (
    id character varying(100) NOT NULL,
    name character varying(100),
    nameeng character varying(100),
    updated_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.country OWNER TO mposdb;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.currency (
    currencycode character varying(6) NOT NULL,
    txt character varying(300),
    ledgeraccountprofit character varying(40),
    ledgeraccountloss character varying(40),
    roundoffsales numeric(28,12),
    roundoffpurch numeric(28,12),
    roundoffamount numeric(28,12),
    ledgeraccountnonrealloss character varying(40),
    ledgeraccountnonrealprofit character varying(40),
    roundofftypepurch integer,
    roundofftypesales integer,
    roundofftypeamount integer,
    roundoffproject numeric(28,12),
    roundofftypeproject integer,
    consclosingratemonetary numeric(28,12),
    roundofftypeprice integer,
    roundoffprice numeric(28,12),
    symbol character varying(10),
    currencyprefix character varying(20),
    currencysuffix character varying(20),
    onlineconversiontool integer,
    currencycodeiso character varying(6),
    gendermalefemale integer,
    consavgratenonmonetary numeric(28,12),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    namearabic character varying(120) DEFAULT NULL::character varying,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.currency OWNER TO mposdb;

--
-- Name: custgroup; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.custgroup (
    custgroup character varying(60) NOT NULL,
    name character varying(120),
    clearingperiod character varying(60),
    paymtermid character varying(60),
    taxgroupid character varying(60),
    paymidtype character varying(60),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    namearabic character varying(120) DEFAULT NULL::character varying,
    updated_on timestamp without time zone DEFAULT now() NOT NULL,
    modified_by character varying(100),
    created_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by character varying(100)
);


ALTER TABLE public.custgroup OWNER TO mposdb;

--
-- Name: custtable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.custtable (
    accountnum character varying(100) NOT NULL,
    name character varying(300),
    address character varying(500),
    phone character varying(100),
    telefax character varying(40),
    invoiceaccount character varying(100),
    custgroup character varying(60),
    linedisc character varying(60),
    paymtermid character varying(60),
    cashdisc character varying(60),
    currency character varying(6),
    salesgroup character varying(60),
    blocked integer,
    onetimecustomer integer,
    accountstatement integer,
    creditmax numeric(28,12),
    mandatorycreditlimit integer,
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    vendaccount character varying(40),
    telex character varying(40),
    pricegroup character varying(60),
    multilinedisc character varying(60),
    enddisc character varying(60),
    vatnum character varying(40),
    countryregionid character varying(60),
    inventlocation character varying(60),
    dlvterm character varying(60),
    dlvmode character varying(60),
    markupgroup character varying(60),
    clearingperiod character varying(60),
    zipcode character varying(20),
    state character varying(60),
    county character varying(60),
    url character varying(510),
    email character varying(160),
    cellularphone character varying(40),
    phonelocal character varying(20),
    freightzone character varying(60),
    creditrating character varying(20),
    taxgroup character varying(60),
    statisticsgroup character varying(60),
    paymmode character varying(60),
    commissiongroup character varying(60),
    bankaccount character varying(20),
    paymsched character varying(60),
    namealias character varying(300),
    contactpersonid character varying(40),
    invoiceaddress integer,
    ouraccountnum character varying(40),
    salespoolid character varying(60),
    incltax integer,
    custitemgroupid character varying(60),
    numbersequencegroup character varying(60),
    languageid character varying(14),
    paymdayid character varying(60),
    lineofbusinessid character varying(60),
    destinationcodeid character varying(60),
    girotype integer,
    suppitemgroupid character varying(60),
    girotypeinterestnote integer,
    taxlicensenum character varying(40),
    paymspec character varying(60),
    bankcentralbankpurposetext character varying(280),
    bankcentralbankpurposecode character varying(20),
    city character varying(300),
    street character varying(500),
    pager character varying(40),
    sms character varying(160),
    packmaterialfeelicensenum character varying(40),
    taxbordernumber_fi character varying(20),
    einvoiceeannum character varying(26),
    fiscalcode character varying(32),
    dlvreason character varying(60),
    girotypecollectionletter integer,
    salescalendarid character varying(20),
    custclassificationid character varying(60),
    enterprisenumber character varying(100),
    shipcarrieraccount character varying(50),
    girotypeprojinvoice integer,
    inventsiteid character varying(20),
    orderentrydeadlinegroupid character varying(60),
    shipcarrierid character varying(20),
    shipcarrierfuelsurcharge integer,
    shipcarrierblindshipment integer,
    partytype integer,
    partyid character varying(40),
    shipcarrieraccountcode character varying(40),
    projpricegroup character varying(60),
    girotypefreetextinvoice integer,
    syncentityid uuid,
    syncversion bigint,
    memo text,
    salesdistrictid character varying(40),
    segmentid character varying(40),
    subsegmentid character varying(40),
    rfiditemtagging integer,
    rfidcasetagging integer,
    rfidpallettagging integer,
    companychainid character varying(40),
    maincontactid character varying(40),
    companyidsiret character varying(28),
    companyidnaf character varying(8),
    identificationnumber character varying(100),
    partycountry character varying(60),
    partystate character varying(60),
    orgid character varying(20),
    paymidtype character varying(60),
    factoringaccount character varying(40),
    pbacustgroupid character varying(60),
    modifieddatetime timestamp without time zone,
    createddatetime timestamp without time zone,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    citstartdate timestamp without time zone,
    citenddate timestamp without time zone,
    citstickertext character varying(100),
    dimension4_ character varying(60),
    dimension5_ character varying(60),
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    dimension8_ character varying(60),
    custtype integer,
    citycode character varying(120),
    districtcode character varying(60),
    latitude real,
    longitude real,
    custclass integer,
    rcusttype integer DEFAULT 1 NOT NULL,
    custcountry character varying(100),
    walkincustomer boolean,
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone DEFAULT now(),
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    createdby character varying(100),
    deleted boolean DEFAULT false,
    country_code character varying(8) DEFAULT '966'::character varying NOT NULL
);


ALTER TABLE public.custtable OWNER TO mposdb;

--
-- Name: custtotaldiscount; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.custtotaldiscount (
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    custaccount character varying(40),
    minamount bigint,
    maxamount bigint,
    discpercent numeric(28,12),
    modifieddatetime timestamp without time zone,
    modifiedby character varying(10),
    createddatetime timestamp without time zone,
    createdby character varying(10),
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.custtotaldiscount OWNER TO mposdb;

--
-- Name: designer_products; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.designer_products (
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    code character varying(32),
    name_ar character varying(128),
    name_en character varying(128),
    price numeric,
    vat numeric(4,2),
    dataareaid character varying(32),
    created_by character varying(32),
    updated_by character varying(32),
    created_on timestamp without time zone DEFAULT now(),
    updated_on timestamp without time zone DEFAULT now() NOT NULL,
    recid integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.designer_products OWNER TO mposdb;

--
-- Name: designer_products_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.designer_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.designer_products_id_seq OWNER TO mposdb;

--
-- Name: designer_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.designer_products_id_seq OWNED BY public.designer_products.id;


--
-- Name: designerservice; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.designerservice (
    custphone character varying(50) NOT NULL,
    customerid character varying(100) NOT NULL,
    amount numeric(28,12) NOT NULL,
    invoiceid character varying(50) NOT NULL,
    salesorderid character varying(50) DEFAULT NULL::character varying,
    syncstatus integer DEFAULT 0 NOT NULL,
    dataareaid character varying(20) DEFAULT NULL::character varying,
    recordtype integer,
    settle smallint,
    selectedforsettle smallint DEFAULT 0 NOT NULL,
    approvalstatus integer,
    createdby character varying(100),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    serviceid uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.designerservice OWNER TO mposdb;

--
-- Name: dimensions; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.dimensions (
    description character varying(120),
    num character varying(60),
    dimensioncode integer,
    incharge character varying(40),
    companygroup character varying(20),
    closed integer,
    reversesign integer,
    column_ integer,
    boldtypeface integer,
    italic integer,
    lineexceed integer,
    linesub integer,
    underlinetxt integer,
    underlinenumerals integer,
    cosblockpostcost integer,
    cosblockpostwork integer,
    cosblockdistribution integer,
    cosblockallocation integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone,
    createddatetime timestamp without time zone NOT NULL,
    name character varying(120) DEFAULT NULL::character varying,
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.dimensions OWNER TO mposdb;

--
-- Name: dimensions_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.dimensions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dimensions_id_seq OWNER TO mposdb;

--
-- Name: dimensions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.dimensions_id_seq OWNED BY public.dimensions.id;


--
-- Name: discountvoucher; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.discountvoucher (
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    dataareaid character varying(32),
    recversion bigint,
    recid bigint,
    salesid character varying(64),
    custaccount character varying(64),
    is_used integer,
    is_enabled integer,
    modified_datetime timestamp without time zone,
    modified_by character varying(64),
    created_datetime timestamp without time zone,
    created_by character varying(64),
    voucher_num character varying(255),
    voucher_type character varying(64),
    discount_percent numeric(5,2),
    allowed_numbers integer,
    used_numbers integer,
    expiry_date timestamp without time zone
);


ALTER TABLE public.discountvoucher OWNER TO mposdb;

--
-- Name: districtmast; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.districtmast (
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    districtname character varying(500),
    districtnamearb character varying(500),
    districtcode character varying(20) NOT NULL,
    citycode character varying(120),
    latitude numeric(28,12),
    longitude numeric(28,12),
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    zone_code text,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.districtmast OWNER TO mposdb;

--
-- Name: fiscalyear; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.fiscalyear (
    yearno bigint,
    recid bigint NOT NULL,
    closing integer,
    financialdataareaid character varying(4),
    dataareaid character varying(4),
    recversion integer,
    lastmodifiedby character varying(20),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createdby character varying(20),
    endingdate date,
    startdate date,
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.fiscalyear OWNER TO mposdb;

--
-- Name: fiscalyearclose; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.fiscalyearclose (
    closingid character varying(20),
    txt character varying(150),
    status integer,
    financialdataareaid character varying(4),
    dataareaid character varying(4),
    recid bigint NOT NULL,
    recversion integer,
    posteddatetime timestamp without time zone,
    postedby character varying(20),
    createddatetime timestamp without time zone,
    createdby character varying(20),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    lastmodifiedby character varying(20),
    yearno bigint NOT NULL,
    endingdate date,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.fiscalyearclose OWNER TO mposdb;

--
-- Name: fixedassetgroup; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.fixedassetgroup (
    name character varying(60),
    groupid character varying(60) NOT NULL,
    autonumber integer,
    autonumbersequence character varying(60),
    barcodenumbersequence character varying(60),
    autonumberbarcode integer,
    assettype integer,
    capitalizationthreshold numeric(28,12),
    majortype character varying(40),
    propertytype integer,
    replacementcostfactor numeric(28,12),
    insuredvaluefactor numeric(28,12),
    gislayerid character varying(20),
    location character varying(20),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    deletedby character varying(50),
    deleteddatetime timestamp without time zone,
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    deleted boolean,
    namealias character varying(100),
    servicelife bigint,
    depricationperiod bigint,
    deprication boolean,
    periodfrequency integer,
    financialdataareaid character varying(20)
);


ALTER TABLE public.fixedassetgroup OWNER TO mposdb;

--
-- Name: fixedassettable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.fixedassettable (
    assetid character varying(40) NOT NULL,
    assetgroup character varying(60),
    name character varying(60),
    location character varying(20),
    documents character varying(518),
    serialnum character varying(40),
    insurancepolicynum character varying(40),
    insuredvalue numeric(28,12),
    make character varying(300),
    model character varying(300),
    guaranteedate timestamp without time zone,
    mainassetid character varying(40),
    responsible character varying(40),
    assettype integer,
    quantity numeric(28,12),
    barcode character varying(40),
    unitofmeasure character varying(60),
    insurancedate1 timestamp without time zone,
    insurancedate2 timestamp without time zone,
    assetreplacecost numeric(28,12),
    sortingid character varying(20),
    taxcountyno character varying(60),
    subventionno numeric(28,12),
    subventiontaxfreeno numeric(28,12),
    assessmentno numeric(28,12),
    assessmenttaxno numeric(28,12),
    acquisitionvalueno numeric(28,12),
    valueat19840101no numeric(28,12),
    returnoninvestmentsno numeric(28,12),
    sortingid2 character varying(20),
    sortingid3 character varying(20),
    namealias character varying(300),
    techinfo1 character varying(508),
    techinfo2 character varying(508),
    techinfo3 character varying(508),
    lastmaintenance timestamp without time zone,
    nextmaintenance timestamp without time zone,
    maintenanceinfo1 character varying(508),
    maintenanceinfo2 character varying(508),
    maintenanceinfo3 text,
    physicalinventory timestamp without time zone,
    reference character varying(508),
    es text,
    unitcost numeric(28,12),
    purchlinerecid bigint,
    majortype character varying(40),
    parcelid character varying(100),
    propertytype integer,
    gisreferencenumber character varying(100),
    locationmemo character varying(2000),
    roomnumber character varying(40),
    contactname character varying(40),
    modelyear character varying(20),
    disposalrestriction character varying(2000),
    lease character varying(2000),
    titleholder character varying(300),
    insurancevendor character varying(40),
    insuranceagent character varying(300),
    policyexpiration timestamp without time zone,
    policyamount numeric(28,12),
    lastfactorupdatedate timestamp without time zone,
    insuredatmarketvalue integer,
    condition character varying(40),
    modifieddatetime timestamp without time zone,
    del_modifiedtime integer,
    modifiedby character varying(10),
    createddatetime timestamp without time zone,
    del_createdtime integer,
    createdby character varying(10),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    dimension character varying(30) DEFAULT NULL::character varying,
    dimension2_ character varying(30) DEFAULT NULL::character varying,
    dimension3_ character varying(30) DEFAULT NULL::character varying,
    dimension4_ character varying(30) DEFAULT NULL::character varying,
    dimension5_ character varying(30) DEFAULT NULL::character varying,
    dimension6_ character varying(30) DEFAULT NULL::character varying,
    dimension7_ character varying(30) DEFAULT NULL::character varying,
    dimension8_ character varying(30) DEFAULT NULL::character varying,
    deletedby character varying(50),
    deleteddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    deleted boolean,
    reponsible character varying(50),
    insuranceplicynum character varying(100),
    latitude character varying(50),
    longitude character varying(50),
    citycode character varying(20),
    districtcode character varying(20),
    deliveryaddress character varying(500),
    financialdataareaid character varying(20)
);


ALTER TABLE public.fixedassettable OWNER TO mposdb;

--
-- Name: interior_exterior; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.interior_exterior (
    id text NOT NULL,
    dataareaid character varying(32) NOT NULL,
    int_ext integer NOT NULL,
    sales_discount numeric,
    customer_id character varying(32),
    account_name character varying(150),
    created_date_time timestamp without time zone,
    modified_date_time timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(32),
    modified_by character varying(32),
    recversion integer,
    recid bigint
);


ALTER TABLE public.interior_exterior OWNER TO mposdb;

--
-- Name: inventbatch; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventbatch (
    inventbatchid character varying(40) NOT NULL,
    expdate timestamp without time zone DEFAULT now(),
    itemid character varying(40),
    proddate timestamp without time zone,
    description text,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now(),
    createddatetime timestamp without time zone DEFAULT now(),
    configid character varying(60),
    created_by character varying(100),
    modified_by character varying(100),
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.inventbatch OWNER TO mposdb;

--
-- Name: inventlocation; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventlocation (
    inventlocationid character varying(30) NOT NULL,
    name character varying(150) NOT NULL,
    manual integer NOT NULL,
    wmslocationiddefaultreceipt character varying(10),
    wmslocationiddefaultissue character varying(10),
    inventlocationidreqmain character varying(30),
    reqrefill integer,
    inventlocationtype integer NOT NULL,
    inventlocationidquarantine character varying(30),
    inventlocationlevel integer,
    reqcalendarid character varying(10),
    wmsaislenameactive integer,
    wmsracknameactive integer,
    wmsrackformat character varying(10),
    wmslevelnameactive integer,
    wmslevelformat character varying(10),
    wmspositionnameactive integer,
    wmspositionformat character varying(10),
    inventlocationidtransit character varying(30),
    vendaccount character varying(20),
    branchnumber character varying(13),
    inventsiteid character varying(10) NOT NULL,
    dataareaid character varying(4) NOT NULL,
    recversion integer NOT NULL,
    recid bigint NOT NULL,
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    telphone character varying(10) NOT NULL,
    selectformps integer,
    wip character varying(50) NOT NULL,
    dimensions character varying(50),
    dimensions2_ character varying(50),
    dimensions3_ character varying(50),
    dimensions4_ character varying(50),
    dimensions5_ character varying(50),
    dimensions6_ character varying(50),
    dimensions7_ character varying(50),
    dimensions8_ character varying(50),
    journalnameid character varying(50),
    namealias character varying(150),
    status character varying(20),
    warehouse_type text,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.inventlocation OWNER TO mposdb;

--
-- Name: inventory_onhand; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventory_onhand (
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    itemid character varying(32) NOT NULL,
    configid character varying(32) NOT NULL,
    inventsizeid character varying(32) NOT NULL,
    batchno character varying(32) DEFAULT '-'::character varying NOT NULL,
    qty_in bigint DEFAULT 0 NOT NULL,
    qty_out bigint DEFAULT 0 NOT NULL,
    qty_reserved bigint DEFAULT 0 NOT NULL,
    dataareaid character varying(32) NOT NULL,
    inventlocationid character varying(64) NOT NULL,
    updated_on timestamp without time zone DEFAULT now() NOT NULL,
    name text,
    updated_by text
);


ALTER TABLE public.inventory_onhand OWNER TO mposdb;

--
-- Name: inventsize; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventsize (
    inventsizeid character varying(60),
    itemid character varying(40),
    description character varying(100),
    name character varying(300),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    jzragentprice numeric(28,12),
    jzrsalesprice numeric(28,12),
    jzrcostprice numeric(28,12),
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE public.inventsize OWNER TO mposdb;

--
-- Name: inventsize_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.inventsize_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventsize_id_seq OWNER TO mposdb;

--
-- Name: inventsize_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.inventsize_id_seq OWNED BY public.inventsize.id;


--
-- Name: inventtable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventtable (
    itemgroupid character varying(60),
    itemid character varying(40) NOT NULL,
    itemname character varying(300),
    itemtype integer,
    purchmodel integer,
    height numeric(28,12),
    width numeric(28,12),
    salesmodel integer,
    costgroupid character varying(60),
    reqgroupid character varying(20),
    epcmanager numeric(28,12),
    primaryvendorid character varying(40),
    netweight numeric(28,12),
    depth numeric(28,12),
    unitvolume numeric(28,12),
    bomunitid character varying(60),
    itempricetolerancegroupid character varying(60),
    density numeric(28,12),
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    dimension4_ character varying(60),
    dimension5_ character varying(60),
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    dimension8_ character varying(60),
    costmodel integer,
    usealtitemid integer,
    altitemid character varying(40),
    intracode character varying(60),
    prodflushingprincip integer,
    pbaitemautogenerated integer,
    wmsarrivalhandlingtime integer,
    bommanualreceipt integer,
    stopexplode integer,
    phantom integer,
    intraunit numeric(28,12),
    bomlevel integer,
    batchnumgroupid character varying(60),
    autoreportfinished integer,
    origcountryregionid character varying(60),
    statisticsfactor numeric(28,12),
    altconfigid character varying(60),
    standardconfigid character varying(60),
    prodpoolid character varying(60),
    abctieup integer,
    abcrevenue integer,
    abcvalue integer,
    abccontributionmargin integer,
    commissiongroupid character varying(60),
    configurable integer,
    salespercentmarkup numeric(28,12),
    salescontributionratio numeric(28,12),
    salespricemodelbasic integer,
    namealias character varying(300),
    prodgroupid character varying(60),
    projcategoryid character varying(20),
    grossdepth numeric(28,12),
    grosswidth numeric(28,12),
    grossheight numeric(28,12),
    sortcode integer,
    configsimilar integer,
    serialnumgroupid character varying(60),
    dimgroupid character varying(20),
    modelgroupid character varying(60),
    itembuyergroupid character varying(60),
    taxpackagingqty numeric(28,12),
    origstateid character varying(60),
    taraweight numeric(28,12),
    packaginggroupid character varying(60),
    scrapvar numeric(28,12),
    scrapconst numeric(28,12),
    standardinventcolorid character varying(60),
    standardinventsizeid character varying(60),
    itemdimcombinationautocreate integer,
    itemdimcostprice integer,
    altinventsizeid character varying(60),
    altinventcolorid character varying(60),
    pallettagging integer,
    itemtagginglevel integer,
    fiscallifoavoidcalc integer,
    fiscallifonormalvalue numeric(28,12),
    fiscallifogroup character varying(60),
    fiscallifonormalvaluecalc integer,
    bomcalcgroupid character varying(60),
    pbaitemconfigurable integer,
    pbainventitemgroupid character varying(60),
    pbahidedialog integer,
    pbahideapproval integer,
    pbaautostart integer,
    pbamandatoryconfig integer,
    citbrandid character varying(2),
    citgroupid character varying(2),
    citfamilyid character varying(2),
    cittypeid character varying(2),
    citfgno integer,
    citproducttype integer,
    citslno integer,
    citbasetypeid character varying(10),
    citbaseproduct character varying(40),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    jzritemstatus integer,
    jzrapprovedby character varying(300),
    typeselect integer,
    jzrspecificgravity numeric(28,12),
    jzrmms numeric(28,12),
    modifieddatetime timestamp without time zone,
    createddatetime timestamp without time zone,
    citdensity numeric(28,12),
    packingmaterialqty numeric(28,12),
    mark integer,
    propertyid character varying(60),
    categoryid numeric,
    subcategoryid numeric,
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    updated_on timestamp without time zone DEFAULT now() NOT NULL,
    int_ext integer
);


ALTER TABLE public.inventtable OWNER TO mposdb;

--
-- Name: inventtable_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.inventtable_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventtable_id_seq OWNER TO mposdb;

--
-- Name: inventtable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.inventtable_id_seq OWNED BY public.inventtable.id;


--
-- Name: inventtablemodule; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventtablemodule (
    itemid character varying(40),
    moduletype integer,
    unitid character varying(60),
    price numeric(28,12),
    priceunit numeric(28,12),
    markup numeric(28,12),
    linedisc character varying(60),
    multilinedisc character varying(60),
    enddisc integer,
    taxitemgroupid character varying(60),
    markupgroupid character varying(60),
    pricedate timestamp without time zone,
    priceqty numeric(28,12),
    allocatemarkup integer,
    overdeliverypct numeric(28,12),
    underdeliverypct numeric(28,12),
    suppitemgroupid character varying(60),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.inventtablemodule OWNER TO mposdb;

--
-- Name: inventtrans; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.inventtrans (
    itemid character varying(40) NOT NULL,
    statusissue integer,
    datephysical timestamp without time zone,
    qty numeric(28,12) NOT NULL,
    costamountposted numeric(28,12),
    currencycode character varying(6),
    transtype integer,
    transrefid character varying(40),
    invoiceid character varying(40),
    voucher character varying(40),
    inventtransidtransfer character varying(40),
    dateexpected timestamp without time zone,
    datefinancial timestamp without time zone,
    costamountphysical numeric(28,12),
    inventtransid character varying(40),
    statusreceipt integer,
    packingslipreturned integer,
    invoicereturned integer,
    packingslipid character varying(40),
    voucherphysical character varying(40),
    costamountadjustment numeric(28,12),
    shippingdaterequested timestamp without time zone,
    shippingdateconfirmed timestamp without time zone,
    qtysettled numeric(28,12),
    costamountsettled numeric(28,12),
    valueopen integer,
    direction integer,
    activitynumber character varying(20),
    datestatus timestamp without time zone,
    costamountstd numeric(28,12),
    dateclosed timestamp without time zone,
    pickingrouteid character varying(20),
    inventtransidfather character varying(40),
    costamountoperations numeric(28,12),
    itemrouteid character varying(40),
    itembomid character varying(40),
    inventtransidreturn character varying(40),
    projid character varying(20),
    projcategoryid character varying(20),
    inventdimid character varying(40),
    inventdimfixed integer,
    dateinvent timestamp without time zone DEFAULT now() NOT NULL,
    custvendac character varying(40),
    transchildrefid character varying(40),
    transchildtype integer,
    revenueamountphysical numeric(28,12),
    assetid character varying(40),
    projadjustrefid character varying(40),
    taxamountphysical numeric(28,12),
    assetbookid character varying(20),
    inventreftransid character varying(40),
    probabilityid integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    unitid character varying(60),
    unit character varying(60),
    production integer,
    timeexpected integer,
    inventsizeid character varying(100) NOT NULL,
    configid character varying(100),
    batchno character varying(100) NOT NULL,
    location character varying(100),
    reservationid character varying(40),
    inventlocationid character varying(40) NOT NULL,
    transactionclosed boolean DEFAULT false,
    reserve_status character varying(32),
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    sales_line_id text
);


ALTER TABLE public.inventtrans OWNER TO mposdb;

--
-- Name: ledgerjournaltrans; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.ledgerjournaltrans (
    journalnum character varying(40),
    linenum numeric(28,12),
    accounttype integer,
    accountnum character varying(40),
    company character varying(8),
    txt character varying(300),
    amountcurdebit numeric(28,12),
    currencycode character varying(6),
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    amountcurcredit numeric(28,12),
    paymentnotes character varying(2000),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    dimension4_ character varying(60),
    dimension5_ character varying(60),
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    dimension8_ character varying(60),
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    modifiedby character varying(50),
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    name character varying(300),
    namearabic character varying(300),
    transdate date,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.ledgerjournaltrans OWNER TO mposdb;

--
-- Name: ledgertrans; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.ledgertrans (
    accountnum character varying(20),
    transdate timestamp without time zone,
    txt character varying(150),
    amountmst numeric(28,12),
    closing integer,
    currencycode character varying(3),
    dimension character varying(30),
    dimension2_ character varying(30),
    dimension3_ character varying(30),
    journalnum character varying(10),
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    modifiedby character varying(20),
    createddatetime timestamp without time zone,
    createdby character varying(20),
    financialdataareaid character varying(4),
    dataareaid character varying(4),
    recversion integer,
    recid bigint,
    dimension4_ character varying(30),
    dimension5_ character varying(30),
    dimension6_ character varying(30),
    dimension7_ character varying(30),
    dimension8_ character varying(30),
    accountpltype integer,
    isfiscalyearclosureaccount boolean,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.ledgertrans OWNER TO mposdb;

--
-- Name: menu; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    name character varying(256),
    name_ar character varying(256),
    link text,
    icon text,
    active boolean,
    parent_id bigint,
    created_by character varying(128),
    created_date timestamp without time zone,
    updated_by character varying(128),
    updated_date timestamp without time zone DEFAULT now(),
    priority integer
);


ALTER TABLE public.menu OWNER TO mposdb;

--
-- Name: menu_access; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.menu_access (
    id character varying(255) NOT NULL,
    role_id character varying(255) NOT NULL,
    link_id character varying(255) NOT NULL,
    read_access boolean DEFAULT false NOT NULL,
    write_access boolean DEFAULT false NOT NULL,
    delete_access boolean DEFAULT false NOT NULL,
    vid character varying(255) DEFAULT 'OWN'::character varying NOT NULL,
    priority integer DEFAULT 999 NOT NULL,
    updated_by character varying(255) DEFAULT 'system'::character varying,
    updated_on timestamp without time zone DEFAULT now()
);


ALTER TABLE public.menu_access OWNER TO mposdb;

--
-- Name: menu_group; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.menu_group (
    group_id text,
    menu_id bigint NOT NULL,
    write_access boolean,
    delete_access boolean,
    created_by character varying(128),
    created_date timestamp without time zone,
    updated_by character varying(128),
    updated_date timestamp without time zone DEFAULT now(),
    active boolean,
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.menu_group OWNER TO mposdb;

--
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_id_seq OWNER TO mposdb;

--
-- Name: menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.menu_id_seq OWNED BY public.menu.id;


--
-- Name: menu_link; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.menu_link (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    link text,
    icon text,
    active boolean DEFAULT true NOT NULL,
    parent_id character varying(255),
    updated_by character varying(255) DEFAULT 'system'::character varying,
    updated_on timestamp without time zone DEFAULT now()
);


ALTER TABLE public.menu_link OWNER TO mposdb;

--
-- Name: menu_role; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.menu_role (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    updated_by character varying(255) DEFAULT 'system'::character varying,
    updated_on timestamp without time zone DEFAULT now()
);


ALTER TABLE public.menu_role OWNER TO mposdb;

--
-- Name: movementtype; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.movementtype (
    id integer NOT NULL,
    movementtype character varying(100),
    offsetaccount character varying(100),
    dataareaid character varying(40),
    movementarabic character varying(100),
    inuse integer,
    updated_on timestamp without time zone DEFAULT now() NOT NULL,
    recid integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.movementtype OWNER TO mposdb;

--
-- Name: numbersequencetable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.numbersequencetable (
    numbersequence character varying(60) NOT NULL,
    txt character varying(300),
    latestcleandatetime timestamp without time zone,
    latestcleandatetimetzid integer,
    lowest integer,
    highest integer,
    nextrec integer NOT NULL,
    blocked integer,
    format character varying(40) NOT NULL,
    continuous integer,
    cyclic integer,
    cleanataccess integer,
    inuse integer,
    noincrement integer,
    cleaninterval numeric(28,12),
    allowchangeup integer,
    allowchangedown integer,
    manual integer,
    fetchaheadqty integer,
    fetchahead integer,
    modifiedtransactionid bigint,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.numbersequencetable OWNER TO mposdb;

--
-- Name: overdue; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.overdue (
    salesid character varying(40) NOT NULL,
    accountnum character varying(100) NOT NULL,
    customername character varying(200),
    invoiceid character varying(20),
    invoiceamount numeric(28,12),
    invoicedate timestamp without time zone,
    duedate timestamp without time zone,
    payment integer DEFAULT 0,
    actualduedate timestamp without time zone,
    createdby character varying(100),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    overdueid character varying DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.overdue OWNER TO mposdb;

--
-- Name: paymterm; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.paymterm (
    paymtermid character varying(60) NOT NULL,
    paymmethod integer,
    numofdays integer,
    description character varying(120),
    numofmonths integer,
    cashaccount character varying(40),
    paymsched character varying(60),
    cash integer,
    paymdayid character varying(60),
    shipcarrierancillarycharge integer,
    postoffsettingar integer,
    shipcarriercertifiedcheck integer,
    creditcardpaymenttype integer,
    creditcardcreditcheck integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createddatetime timestamp without time zone,
    namearabic character varying(120) DEFAULT NULL::character varying,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.paymterm OWNER TO mposdb;

--
-- Name: phoneverification; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.phoneverification (
    country_code character varying(8) DEFAULT '966'::character varying NOT NULL,
    phonenumber character varying(50) NOT NULL,
    otpsent character varying(10) NOT NULL,
    otpexpirytime timestamp without time zone DEFAULT (now() + ((120)::double precision * '00:01:00'::interval)) NOT NULL,
    verificationstatus character varying(20) DEFAULT 'Pending'::character varying NOT NULL,
    customerid character varying(100) DEFAULT NULL::character varying,
    dataareaid character varying(20) NOT NULL,
    createdby character varying(100) DEFAULT NULL::character varying,
    createddatetime timestamp without time zone DEFAULT now(),
    lastmodifiedby character varying(100) DEFAULT NULL::character varying,
    lastmodifieddate timestamp without time zone,
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.phoneverification OWNER TO mposdb;

--
-- Name: pricdisctableextra; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.pricdisctableextra (
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    itemid character varying(40),
    inventdimid character varying(40),
    amount numeric(28,12),
    itemrelation character varying(40),
    configid character varying(60),
    inventsizeid character varying(60),
    modifieddatetime timestamp without time zone NOT NULL,
    createddatetime timestamp without time zone,
    id text DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.pricdisctableextra OWNER TO mposdb;

--
-- Name: pricdisctableextra_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.pricdisctableextra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pricdisctableextra_id_seq OWNER TO mposdb;

--
-- Name: pricdisctableextra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.pricdisctableextra_id_seq OWNED BY public.pricdisctableextra.id;


--
-- Name: pricediscgroup; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.pricediscgroup (
    module integer,
    type integer,
    groupid character varying(60),
    name character varying(300),
    incltax integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createddatetime timestamp without time zone,
    namearabic character varying(120) DEFAULT NULL::character varying,
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.pricediscgroup OWNER TO mposdb;

--
-- Name: pricediscgroup_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.pricediscgroup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pricediscgroup_id_seq OWNER TO mposdb;

--
-- Name: pricediscgroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.pricediscgroup_id_seq OWNED BY public.pricediscgroup.id;


--
-- Name: pricedisctable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.pricedisctable (
    agreement character varying(20),
    itemcode integer,
    accountcode integer,
    itemrelation character varying(40),
    accountrelation character varying(40),
    quantityamount numeric(28,12),
    fromdate timestamp without time zone,
    todate timestamp without time zone,
    amount numeric(28,12),
    currency character varying(6),
    percent1 numeric(28,12),
    percent2 numeric(28,12),
    deliverytime integer,
    searchagain integer,
    priceunit numeric(28,12),
    relation integer,
    unitid character varying(60),
    markup numeric(28,12),
    allocatemarkup integer,
    module integer,
    inventdimid character varying(40),
    calendardays integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createddatetime timestamp without time zone,
    tinventsizeid character varying(40),
    configid character varying,
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    created_by character varying(100),
    modified_by character varying(100)
);


ALTER TABLE public.pricedisctable OWNER TO mposdb;

--
-- Name: products; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.products (
    id bigint DEFAULT nextval('public.designer_products_id_seq'::regclass) NOT NULL,
    name_en character varying(255),
    general_info_en text,
    description_en text,
    description_short_en text,
    features_en text,
    specs_en text,
    dry_time_en text,
    recoat_time_en text,
    coverage_en text,
    resin_type_en text,
    recommended_for_en text,
    surface_type_en text,
    painting_system_en text,
    application_tools_en text,
    thinner_en text,
    name_ar character varying(255),
    general_info_ar text,
    description_ar text,
    description_short_ar text,
    features_ar text,
    specs_ar text,
    dry_time_ar text,
    recoat_time_ar text,
    coverage_ar text,
    resin_type_ar text,
    recommended_for_ar text,
    surface_type_ar text,
    painting_system_ar text,
    application_tools_ar text,
    thinner_ar text,
    dry_time character varying(255),
    recoat_time character varying(255),
    coverage character varying(255),
    resin_type character varying(255),
    code character varying(255) NOT NULL,
    rating integer,
    subcategory_id bigint,
    professional_subcategory_id bigint,
    can_img_id bigint,
    image_ids bigint[],
    realization_ids bigint[],
    tds_en_ids bigint[],
    tds_ar_ids bigint[],
    brochure_en_ids bigint[],
    brochure_ar_ids bigint[],
    deleted_at timestamp without time zone,
    preview boolean,
    active boolean,
    inquiry_only boolean,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    consumer_subcategory_ids bigint[],
    professional_subcategory_ids bigint[],
    prof_subs_en character varying[],
    prof_subs_ar character varying[],
    distinct_features_ar text[],
    distinct_features_en text[],
    dry_time_short_en character varying(255),
    dry_time_short_ar character varying(255),
    recoat_time_short_en character varying(255),
    recoat_time_short_ar character varying(255),
    coverage_short_en character varying(255),
    coverage_short_ar character varying(255),
    slug character varying(255),
    seo_title_en text,
    seo_title_ar text,
    seo_keywords_en text,
    seo_keywords_ar text,
    seo_description_en text,
    seo_description_ar text,
    popular_colors_ids bigint[],
    attribute_ids bigint[],
    videos_en jsonb[],
    videos_ar jsonb[],
    hide_can_image boolean,
    product_taxes jsonb[],
    badge_color character varying(255),
    badge_text_ar character varying(255),
    badge_text_en character varying(255),
    product_catalogue_en_id bigint,
    product_catalogue_ar_id bigint,
    color_type character varying(255),
    dataareaid character varying,
    groupid character varying(32),
    deleted boolean DEFAULT false
);


ALTER TABLE public.products OWNER TO mposdb;

--
-- Name: profile; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.profile (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    country_code character varying(8) DEFAULT '966'::character varying NOT NULL,
    mobile character varying(15),
    email character varying(255),
    password character varying(255),
    token character varying(255),
    role character varying(255) DEFAULT 'USER'::character varying NOT NULL,
    status character varying(255) DEFAULT 'NA'::character varying NOT NULL,
    provision character varying(255) DEFAULT 'EMAIL'::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    vid character varying(255) DEFAULT 'OWN'::character varying NOT NULL,
    created_by character varying(255) DEFAULT 'system'::character varying NOT NULL,
    created_on timestamp without time zone DEFAULT now() NOT NULL,
    updated_by character varying(255) DEFAULT 'system'::character varying NOT NULL,
    updated_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.profile OWNER TO mposdb;

--
-- Name: redeem; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.redeem (
    redeem_code character varying(50) NOT NULL,
    transaction_id character varying(50) NOT NULL,
    mobileno character varying(16) NOT NULL,
    invoice_id character varying(50) NOT NULL,
    sales_id character varying(50),
    description character varying(200),
    customer_name character varying(50),
    invoice_amount numeric(28,12),
    redeem_points numeric(18,12),
    status character varying(20),
    sync_status integer,
    inventlocation_id character varying(20),
    inventlocation_name character varying(50),
    deletedby character varying(100) DEFAULT NULL::character varying,
    deleteddatetime timestamp without time zone,
    deleted boolean,
    createdby character varying(100) DEFAULT NULL::character varying,
    createddatetime timestamp without time zone,
    postedby character varying(100) DEFAULT NULL::character varying,
    posteddatetime timestamp without time zone,
    lastmodifieddate timestamp without time zone,
    max_discount_percent numeric(18,2),
    loyalty_status integer,
    customer_type character varying(20),
    slab_id integer,
    slab_name_en character varying(20),
    slab_name_ar character varying(20),
    earned_points numeric(18,2),
    expired_points numeric(18,2),
    return_points numeric(18,2),
    balance_points numeric(18,2),
    max_redeem_amout numeric(18,2),
    redeem_amout numeric(18,2),
    mobile_otp character varying(4),
    lastmodifiedby character varying(100),
    originalprinted boolean
);


ALTER TABLE public.redeem OWNER TO mposdb;

--
-- Name: redeempoints; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.redeempoints (
    transactionid character varying(60) NOT NULL,
    cardno character varying(32),
    invoiceno character varying(60),
    invoiceamount numeric(28,12),
    redeempoints numeric(18,2),
    syncstatus integer,
    warehouse character varying(40),
    createddatetime timestamp without time zone,
    modifieddatetime timestamp without time zone NOT NULL,
    maxdiscpercent numeric(18,2),
    loyaltystatus smallint
);


ALTER TABLE public.redeempoints OWNER TO mposdb;

--
-- Name: sales_promotion_items; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.sales_promotion_items (
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    dataareaid character varying(32) NOT NULL,
    inventlocationid character varying(32) NOT NULL,
    itemid character varying(32),
    multiple_qty integer NOT NULL,
    free_qty integer NOT NULL,
    sales_channel character varying(32),
    accountnum character varying(32),
    inventsizeid character varying(32),
    configid character varying(32),
    price_disc_item_code integer,
    price_disc_account_relation character varying(32),
    created_date_time timestamp without time zone,
    modified_date_time timestamp without time zone,
    created_by character varying(32),
    modified_by character varying(32),
    recversion integer,
    recid bigint
);


ALTER TABLE public.sales_promotion_items OWNER TO mposdb;

--
-- Name: sales_promotion_items_equal; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.sales_promotion_items_equal (
    id text NOT NULL,
    dataareaid character varying(32) NOT NULL,
    inventlocationid character varying(32) NOT NULL,
    itemid character varying(32),
    multiple_qty integer NOT NULL,
    free_qty integer NOT NULL,
    sales_channel character varying(32),
    accountnum character varying(32),
    inventsizeid character varying(32),
    configid character varying(32),
    price_disc_item_code integer,
    price_disc_account_relation character varying(32),
    group_id character varying(32),
    created_date_time timestamp without time zone,
    modified_date_time timestamp without time zone,
    created_by character varying(32),
    modified_by character varying(32),
    recversion integer,
    recid bigint
);


ALTER TABLE public.sales_promotion_items_equal OWNER TO mposdb;

--
-- Name: salesline; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.salesline (
    salesid character varying(40) NOT NULL,
    linenum numeric(28,0),
    itemid character varying(40) NOT NULL,
    name character varying(2000),
    salesprice numeric(28,12) DEFAULT 0 NOT NULL,
    currencycode character varying(6),
    salesqty numeric(28,12) DEFAULT 0 NOT NULL,
    lineamount numeric(28,12) DEFAULT 0,
    salesunit character varying(60) DEFAULT 0,
    priceunit numeric(28,12) DEFAULT 0,
    qtyordered numeric(28,12) DEFAULT 0,
    remainsalesphysical numeric(28,12) DEFAULT 0,
    remainsalesfinancial numeric(28,12) DEFAULT 0,
    receiptdateconfirmed timestamp without time zone,
    shippingdaterequested timestamp without time zone,
    shippingdateconfirmed timestamp without time zone,
    confirmeddlv timestamp without time zone,
    salestype integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    custgroup character varying(300),
    custaccount character varying(40),
    inventsizeid character varying(60),
    configid character varying(60),
    numbersequencegroupid character varying(60),
    inventlocationid character varying(60),
    inventtransid character varying(40),
    salesdelivernow numeric(28,12),
    salesstatus integer,
    location character varying(100),
    batchno character varying(100),
    instantdisc numeric(28,12),
    voucherdisc numeric(28,12),
    redeemdisc numeric(28,12),
    promotiondisc numeric(28,12),
    linetotaldisc real DEFAULT 0,
    linesalestax numeric(28,12),
    netamttax numeric(28,12),
    linesalestaxpercent numeric(28,12),
    taxgroup character varying(100),
    taxitemgroup character varying(100),
    linediscamt numeric(28,12),
    customdiscamt numeric(28,12),
    supplmultipleqty numeric(18,3) DEFAULT 0,
    supplfreeqty numeric(18,3) DEFAULT 0,
    multilndisc numeric(18,5),
    multilnpercent numeric(18,5),
    enddisc numeric(18,5),
    linesalestaxperent numeric(18,5),
    hexcode character varying(10),
    colorantid character varying(30),
    colorantprice numeric(16,2),
    baseproduct boolean,
    totalreturnedquantity numeric(28,12) DEFAULT 0,
    totalsettledamount numeric(28,12) DEFAULT 0,
    coloranthexcode character varying(10),
    coloractive boolean,
    colorantactive boolean,
    customprice numeric(12,0),
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    colorid character varying(255),
    base_size_id character varying(255),
    linediscpercent numeric,
    enddiscamt numeric,
    instantdiscamt numeric,
    vatamount numeric,
    vat numeric,
    voucherdiscamt numeric,
    voucherdiscpercent numeric,
    status character varying(32),
    sabic_customer_discount numeric(4,2) DEFAULT 0,
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    is_item_free boolean DEFAULT false NOT NULL,
    link_id uuid,
    batches json,
    applied_discounts json
);


ALTER TABLE public.salesline OWNER TO mposdb;

--
-- Name: salestable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.salestable (
    salesid character varying(128) NOT NULL,
    salesname text,
    reservation integer,
    custaccount character varying(128),
    invoiceaccount character varying(128),
    deliverydate timestamp without time zone,
    deliveryaddress character varying(500),
    documentstatus boolean,
    currencycode character varying(6),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    languageid character varying(14),
    payment character varying(60),
    custgroup character varying(300),
    pricegroupid character varying(60),
    shippingdaterequested timestamp without time zone,
    deliverystreet character varying(500),
    salestype integer,
    salesstatus integer,
    numbersequencegroup character varying(60),
    cashdisc character varying(60),
    intercompanyoriginalsalesid character varying(600),
    freightsliptype integer,
    salestaker character varying(40),
    salesgroup character varying(60),
    url character varying(510),
    purchorderformnum character varying(40),
    shippingdateconfirmed timestamp without time zone,
    deadline timestamp without time zone,
    fixedduedate timestamp without time zone,
    receiptdateconfirmed timestamp without time zone,
    returndeadline timestamp without time zone,
    createddatetime timestamp without time zone,
    createdby character varying(100),
    customerref character varying(300),
    syncstatus smallint DEFAULT 0,
    amount real,
    disc real,
    netamount real,
    citycode character varying(120),
    districtcode character varying(120),
    latitude character varying(100),
    longitude character varying(100),
    forcustomer integer,
    vehiclecode character varying(40),
    apptype integer,
    vouchernum character varying(400),
    painter character varying(1000),
    ajpenddisc character varying(60),
    taxgroup character varying(100),
    sumtax numeric(18,3),
    mobileno character varying(40),
    inventlocationid character varying(40),
    region character varying(40),
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    dimension4_ character varying(60),
    dimension5_ character varying(60),
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    dimension8_ character varying(60),
    instantdiscchecked boolean,
    vatamount numeric(18,5),
    pricediscgroupid character varying(60),
    invoicedate timestamp without time zone,
    invoicecreatedby character varying(100),
    multilinediscountgroupid character varying(40),
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone,
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    deleted boolean,
    originalprinted boolean,
    iscash boolean DEFAULT false,
    approvers character varying(800),
    isredeemable character varying(5),
    transkind character varying(128),
    status character varying,
    redeempts numeric,
    redeemptsamt numeric,
    deliverytype character varying,
    voucherdiscamt numeric,
    voucherdiscpercent numeric,
    vouchertype character varying,
    voucherdiscchecked boolean,
    movement_type_id integer,
    description character varying(255),
    is_movement_in boolean,
    jazeerawarehouse character varying,
    sabic_customer_discount numeric(4,2) DEFAULT 0,
    design_service_redeem_amount numeric DEFAULT 0,
    loyalty_status integer DEFAULT 0 NOT NULL,
    country_code character varying(255) DEFAULT 'SA'::character varying NOT NULL,
    zipcode character varying
);


ALTER TABLE public.salestable OWNER TO mposdb;

--
-- Name: sizes; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.sizes (
    id character varying(255) DEFAULT public.uuid_generate_v1() NOT NULL,
    name_en character varying(255),
    name_ar character varying(255),
    code character varying(255) NOT NULL,
    unit character varying(255),
    volume double precision,
    deleted_at timestamp without time zone,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted boolean DEFAULT false
);


ALTER TABLE public.sizes OWNER TO mposdb;

--
-- Name: sizes_id_seq; Type: SEQUENCE; Schema: public; Owner: mposdb
--

CREATE SEQUENCE public.sizes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sizes_id_seq OWNER TO mposdb;

--
-- Name: sizes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mposdb
--

ALTER SEQUENCE public.sizes_id_seq OWNED BY public.sizes.id;


--
-- Name: taxdata; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.taxdata (
    taxcode character varying(60) NOT NULL,
    taxvalue numeric(28,12),
    taxlimitmin numeric(28,12),
    taxlimitmax numeric(28,12),
    vatexemptpct numeric(28,12),
    taxfromdate timestamp without time zone,
    taxtodate timestamp without time zone,
    investmenttaxpct numeric(28,12),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    modifiedby character varying(10),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createdby character varying(10)
);


ALTER TABLE public.taxdata OWNER TO mposdb;

--
-- Name: taxgroupdata; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.taxgroupdata (
    taxgroup character varying(60) NOT NULL,
    taxcode character varying(60),
    exempttax integer,
    usetax integer,
    taxexemptcode character varying(60),
    intracomvat integer,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    modifiedby character varying(10),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createdby character varying(10)
);


ALTER TABLE public.taxgroupdata OWNER TO mposdb;

--
-- Name: taxonitem; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.taxonitem (
    taxitemgroup character varying(60) NOT NULL,
    taxcode character varying(60),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    modifieddatetime timestamp without time zone DEFAULT now() NOT NULL,
    modifiedby character varying(10),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    createdby character varying(10)
);


ALTER TABLE public.taxonitem OWNER TO mposdb;

--
-- Name: test; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.test (
    id character varying(255) NOT NULL,
    name text,
    updated_on timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.test OWNER TO mposdb;

--
-- Name: user_info; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.user_info (
    id character varying(50) NOT NULL,
    user_name character varying(150) NOT NULL,
    password character varying(200),
    description character varying(255),
    email character varying(50),
    role character varying(50),
    status character varying(20),
    securitytoken character varying(255),
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    organization_id character varying(20),
    phone character varying(20),
    groupid character varying(50),
    resetkey character varying(100),
    resetdate timestamp without time zone,
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    deleted boolean,
    full_name character varying(100)
);


ALTER TABLE public.user_info OWNER TO mposdb;

--
-- Name: userconfig; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.userconfig (
    id character varying(50) NOT NULL,
    inventlocationid character varying(20),
    currencycode character varying(20),
    salesorderformat character varying(20),
    sequencegroup character varying(20),
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    userid character varying(50),
    proximitycheck character varying(20),
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    deleted integer
);


ALTER TABLE public.userconfig OWNER TO mposdb;

--
-- Name: usergroup; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.usergroup (
    groupid character varying(50) DEFAULT public.uuid_generate_v1() NOT NULL,
    groupname character varying(150),
    status character varying(20),
    usercount character varying(20),
    comment character varying(255),
    createdby character varying(50),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    deleted boolean,
    permissiondata character varying(4000),
    role character varying(50)
);


ALTER TABLE public.usergroup OWNER TO mposdb;

--
-- Name: usergroupconfig; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.usergroupconfig (
    id character varying(50) DEFAULT public.uuid_generate_v1() NOT NULL,
    inventlocationid character varying(100),
    currencycode character varying(20),
    salesorderformat character varying(20),
    proximitycheck boolean,
    usergroupid character varying(50),
    defaultcustomerid character varying(50),
    createdby character varying(100),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    packingslipformat character varying(20),
    packingslipsequencegroup character varying(20),
    invoiceformat character varying(20),
    invoicesequencegroup character varying(20),
    reservationformat character varying(20),
    reservationsequencegroup character varying(20),
    returnorderformt character varying(20),
    returnordersequencegroup character varying(20),
    quotationformat character varying(20),
    quotationsequencegroup character varying(20),
    warehouse character varying(50),
    regionalwarehouse character varying(2000),
    factorywarehouse character varying(50),
    dataareaid character varying(50),
    salesordersequencegroup character varying(50),
    stockrequestsequencegroup character varying(50),
    ordershipmentsequencegroup character varying(50),
    orderreceivesequencegroup character varying(50),
    additionalcustomer character varying(800),
    isstorewarehouse boolean,
    customergroup text,
    blocklistedbasecolor character varying(50),
    nocolorantcheckgroup character varying(50),
    iscolorantrequired boolean,
    returnitemblocked character varying(50),
    iscityrequired boolean,
    isvehiclerequired boolean,
    mobilevan character varying(50),
    showroomemail character varying(50),
    telephone character varying(50),
    fax character varying(50),
    istantdiscountexclude character varying(50),
    showroomcountrycode character varying(50),
    customercreationaccess character varying(50),
    iscustomersalesmaneditable boolean,
    regionid character varying(50),
    departmentid character varying(50),
    costcenterid character varying(50),
    employeeid character varying(50),
    projectid character varying(50),
    salesmanid character varying(50),
    brandid character varying(50),
    productlineid character varying(50),
    deletedby character varying(100),
    deleteddatetime timestamp without time zone,
    deleted boolean DEFAULT false,
    defaultcustomer character varying(50),
    sequencegroup character varying(50),
    journalnameid character varying(60),
    movementsequencegroup character varying(20),
    movementsequenceformat character varying(20),
    rmsigningauthority character varying(200),
    rasigningauthority character varying(200),
    transferordersequencegroup character varying(20),
    purchaserequestsequencegroup character varying(50) DEFAULT NULL::character varying,
    purchaseordersequencegroup character varying(50) DEFAULT NULL::character varying,
    purchasepackingslipgroup character varying(100) DEFAULT NULL::character varying,
    purchaseinvoicegroup character varying(100) DEFAULT NULL::character varying,
    returnorderapprovalrequired boolean,
    returnorderapproval character varying,
    inventoryclosesequencegroup character varying(20),
    salesforecastsequencegroup character varying(20),
    returnorderrmapprovalrequired boolean,
    returnorderraapprovalrequired boolean,
    projectcustomer boolean,
    agentcustomer boolean,
    fixedassestgroupsequencegroup character varying(20),
    agentwarehouses character varying(500),
    vendors character varying(1000),
    legeraccountsequencegroup character varying(20),
    workflowcustomers character varying(1000),
    generaljournalsequencegroup character varying(20),
    financialcompanycode character varying(100),
    fiscalyearclosesequencegroup character varying(20),
    partnercode character varying(100),
    ledgeraccount character varying(20),
    purchase_return_sequence_group character varying(32),
    sabic_customers text,
    workflowsequencegroup character varying,
    designer_signing_authority character varying
);


ALTER TABLE public.usergroupconfig OWNER TO mposdb;

--
-- Name: vendortable; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.vendortable (
    accountnum character varying(40) NOT NULL,
    name character varying(300),
    address character varying(500),
    phone character varying(40),
    telefax character varying(40),
    invoiceaccount character varying(40),
    vendgroup character varying(60),
    paymtermid character varying(60),
    cashdisc character varying(60),
    currency character varying(6),
    companyidnaf character varying(8),
    linedisc character varying(60),
    enterprisenumber character varying(100),
    blocked integer,
    onetimevendor integer,
    dimension character varying(60),
    dimension2_ character varying(60),
    dimension3_ character varying(60),
    telex character varying(40),
    pricegroup character varying(60),
    multilinedisc character varying(60),
    enddisc character varying(60),
    paymid character varying(400),
    custaccount character varying(40),
    vatnum character varying(40),
    countryregionid character varying(60),
    inventlocation character varying(60),
    youraccountnum character varying(40),
    dlvterm character varying(60),
    dlvmode character varying(60),
    bankaccount character varying(20),
    paymmode character varying(60),
    paymspec character varying(60),
    markupgroup character varying(60),
    clearingperiod character varying(60),
    zipcode character varying(20),
    state character varying(60),
    county character varying(60),
    url character varying(510),
    email character varying(160),
    cellularphone character varying(40),
    phonelocal character varying(20),
    companyidsiret character varying(28),
    taxgroup character varying(60),
    freightzone character varying(60),
    minorityowned integer,
    femaleowned integer,
    creditrating character varying(20),
    creditmax numeric(28,12),
    tax1099reports integer,
    tax1099regnum character varying(22),
    paymsched character varying(60),
    tax1099box character varying(60),
    namealias character varying(300),
    itembuyergroupid character varying(60),
    contactpersonid character varying(40),
    purchpoolid character varying(60),
    purchamountpurchaseorder integer,
    incltax integer,
    venditemgroupid character varying(60),
    numbersequencegroup character varying(60),
    languageid character varying(14),
    paymdayid character varying(60),
    destinationcodeid character varying(60),
    lineofbusinessid character varying(60),
    suppitemgroupid character varying(60),
    bankcentralbankpurposetext character varying(280),
    bankcentralbankpurposecode character varying(20),
    city character varying(300),
    street character varying(500),
    offsetaccount character varying(40),
    offsetaccounttype integer,
    purchcalendarid character varying(20),
    pager character varying(40),
    sms character varying(160),
    organizationnumber character varying(40),
    fiscalcode character varying(32),
    partyid character varying(40),
    taxwithholdcalculate integer,
    taxwithholdgroup character varying(60),
    birthdate timestamp without time zone,
    birthplace character varying(300),
    residenceforeigncountryregio86 character varying(60),
    namecontrol character varying(8),
    foreignentityindicator integer,
    taxidtype integer,
    dba character varying(300),
    tax1099namechoice integer,
    secondtin integer,
    inventsiteid character varying(20),
    segmentid character varying(40),
    subsegmentid character varying(40),
    companychainid character varying(40),
    maincontactid character varying(40),
    vendpricetolerancegroupid character varying(60),
    memo text,
    smallbusiness integer,
    partytype integer,
    locallyowned integer,
    bidonly integer,
    w9 integer,
    orgid character varying(20),
    factoringaccount character varying(40),
    modifieddatetime timestamp without time zone NOT NULL,
    del_modifiedtime integer,
    modifiedby character varying(10),
    createddatetime timestamp without time zone DEFAULT now() NOT NULL,
    del_createdtime integer,
    createdby character varying(10),
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    abbreviation character varying(20),
    dimension4_ character varying(60),
    dimension5_ character varying(60),
    dimension6_ character varying(60),
    dimension7_ character varying(60),
    dimension8_ character varying(60),
    vendcountry character varying(60),
    purchtype integer,
    deleted boolean,
    deletedby character varying(50),
    deleteddatetime timestamp without time zone,
    lastmodifiedby character varying(50),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vendortable OWNER TO mposdb;

--
-- Name: visitcustomer; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.visitcustomer (
    visitorsequencenumber character varying(40) NOT NULL,
    dateofvisit timestamp without time zone DEFAULT now() NOT NULL,
    salesmanid character varying(100) NOT NULL,
    salesmanname character varying(100) DEFAULT NULL::character varying,
    regionnumber character varying(100) NOT NULL,
    showroomid character varying(20),
    usergroupid character varying(50) NOT NULL,
    visitortype character varying(100) NOT NULL,
    visitormobilenumber character varying(20),
    visitorname character varying(150) NOT NULL,
    purchased character varying(5) NOT NULL,
    reasonfornotpurchase character varying(255) DEFAULT NULL::character varying,
    createdby character varying(100),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(100),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    dataareaid character varying(20) DEFAULT NULL::character varying,
    visitorid uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.visitcustomer OWNER TO mposdb;

--
-- Name: visitorstype; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.visitorstype (
    id character varying(20) NOT NULL,
    dataareaid character varying(8),
    recversion integer,
    recid bigint,
    type character varying(20),
    modifieddatetime timestamp without time zone NOT NULL,
    modifiedby character varying(10),
    createddatetime timestamp without time zone,
    createdby character varying(10)
);


ALTER TABLE public.visitorstype OWNER TO mposdb;

--
-- Name: voucher; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.voucher (
    code character varying(255),
    name character varying(99),
    is_multiple boolean,
    voucher_type character varying(32),
    relation_type character varying(64),
    relation text,
    percentage numeric(4,2),
    discount_amount numeric,
    amount_used_till_date numeric,
    min_amount numeric,
    max_amount numeric,
    min_quantity integer,
    max_quantity integer,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    quota integer,
    max_quota integer,
    currency_type character varying(16),
    communication_channel character varying(32),
    dataareaid character varying(32),
    created_date timestamp without time zone,
    updated_date timestamp without time zone,
    created_by character varying(64),
    updated_by character varying(64),
    id uuid DEFAULT public.uuid_generate_v1() NOT NULL
);


ALTER TABLE public.voucher OWNER TO mposdb;

--
-- Name: voucherdiscountitems; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.voucherdiscountitems (
    id text DEFAULT public.uuid_generate_v1() NOT NULL,
    dataareaid character varying(32),
    recversion bigint,
    recid bigint,
    itemid character varying(32),
    from_date timestamp without time zone,
    to_date timestamp without time zone,
    discount_percent numeric(5,2),
    modified_datetime timestamp without time zone DEFAULT now(),
    modified_by character varying(64) DEFAULT 'SYSTEM'::character varying,
    created_datetime timestamp without time zone DEFAULT now(),
    created_by character varying(64) DEFAULT 'SYSTEM'::character varying,
    voucher_type character varying(255)
);


ALTER TABLE public.voucherdiscountitems OWNER TO mposdb;

--
-- Name: workflow; Type: TABLE; Schema: public; Owner: mposdb
--

CREATE TABLE public.workflow (
    id character varying(60) NOT NULL,
    ordertype numeric(60,0),
    orderid character varying(60),
    statusid character varying(60),
    createdby character varying(60),
    createddatetime timestamp without time zone,
    lastmodifiedby character varying(500),
    lastmodifieddate timestamp without time zone DEFAULT now() NOT NULL,
    pendingwith character varying(30),
    accesskey character varying(100),
    ordername character varying(600),
    partyid character varying(40),
    partyname character varying(300),
    inventlocationid character varying(40),
    statusmessage character varying(100),
    statusmessagearabic character varying(100),
    ordercreatedby character varying(50),
    ordercreateddatetime timestamp without time zone,
    orderlastmodifiedby character varying(50),
    orderlastmodifieddate timestamp without time zone,
    usergroupid character varying
);


ALTER TABLE public.workflow OWNER TO mposdb;

--
-- Name: configtable id; Type: DEFAULT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.configtable ALTER COLUMN id SET DEFAULT nextval('public.configtable_id_seq'::regclass);


--
-- Name: menu id; Type: DEFAULT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu ALTER COLUMN id SET DEFAULT nextval('public.menu_id_seq'::regclass);


--
-- Name: accountstable accountstable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.accountstable
    ADD CONSTRAINT accountstable_pk PRIMARY KEY (id);


--
-- Name: ajp_block_discounts ajp_block_discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.ajp_block_discounts
    ADD CONSTRAINT ajp_block_discounts_pkey PRIMARY KEY (id);


--
-- Name: app_lang app_lang_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.app_lang
    ADD CONSTRAINT app_lang_pkey PRIMARY KEY (id);


--
-- Name: applied_discounts applied_discounts_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.applied_discounts
    ADD CONSTRAINT applied_discounts_pk PRIMARY KEY (id);


--
-- Name: base_size_colors base_size_colors_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_size_colors
    ADD CONSTRAINT base_size_colors_pkey PRIMARY KEY (id);


--
-- Name: base_sizes base_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_sizes
    ADD CONSTRAINT base_sizes_pkey PRIMARY KEY (id);


--
-- Name: bases bases_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.bases
    ADD CONSTRAINT bases_pkey PRIMARY KEY (id);


--
-- Name: citymast citymast_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.citymast
    ADD CONSTRAINT citymast_pk PRIMARY KEY (citycode);


--
-- Name: colors colors_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_pkey PRIMARY KEY (id);


--
-- Name: configtable configtable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.configtable
    ADD CONSTRAINT configtable_pk PRIMARY KEY (id);


--
-- Name: country country_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pk PRIMARY KEY (id);


--
-- Name: currency currency_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pk PRIMARY KEY (currencycode);


--
-- Name: custgroup custgroup_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.custgroup
    ADD CONSTRAINT custgroup_pk PRIMARY KEY (custgroup);


--
-- Name: custtable custtable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.custtable
    ADD CONSTRAINT custtable_pk PRIMARY KEY (accountnum);


--
-- Name: custtotaldiscount custtotaldiscount_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.custtotaldiscount
    ADD CONSTRAINT custtotaldiscount_pkey PRIMARY KEY (id);


--
-- Name: designer_products designer_products_code_key; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.designer_products
    ADD CONSTRAINT designer_products_code_key UNIQUE (code);


--
-- Name: designer_products designer_products_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.designer_products
    ADD CONSTRAINT designer_products_pkey PRIMARY KEY (id);


--
-- Name: designerservice designerservice_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.designerservice
    ADD CONSTRAINT designerservice_pk PRIMARY KEY (serviceid);


--
-- Name: dimensions dimensions_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.dimensions
    ADD CONSTRAINT dimensions_pk PRIMARY KEY (id);


--
-- Name: discountvoucher discountvoucher_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.discountvoucher
    ADD CONSTRAINT discountvoucher_pkey PRIMARY KEY (id);


--
-- Name: districtmast districtmast_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.districtmast
    ADD CONSTRAINT districtmast_pk PRIMARY KEY (districtcode);


--
-- Name: fiscalyear fiscalyear_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.fiscalyear
    ADD CONSTRAINT fiscalyear_pk PRIMARY KEY (id);


--
-- Name: fiscalyearclose fiscalyearclose_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.fiscalyearclose
    ADD CONSTRAINT fiscalyearclose_pk PRIMARY KEY (id);


--
-- Name: fixedassetgroup fixedassetgroup_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.fixedassetgroup
    ADD CONSTRAINT fixedassetgroup_pk PRIMARY KEY (groupid);


--
-- Name: fixedassettable fixedassettable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.fixedassettable
    ADD CONSTRAINT fixedassettable_pk PRIMARY KEY (assetid);


--
-- Name: interior_exterior interior_exterior_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.interior_exterior
    ADD CONSTRAINT interior_exterior_pkey PRIMARY KEY (id);


--
-- Name: inventbatch inventbatch_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventbatch
    ADD CONSTRAINT inventbatch_pk PRIMARY KEY (id);


--
-- Name: inventlocation inventlocation_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventlocation
    ADD CONSTRAINT inventlocation_pk PRIMARY KEY (inventlocationid);


--
-- Name: inventory_onhand inventory_onhand_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventory_onhand
    ADD CONSTRAINT inventory_onhand_pkey PRIMARY KEY (id);


--
-- Name: inventory_onhand inventory_onhand_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventory_onhand
    ADD CONSTRAINT inventory_onhand_un UNIQUE (itemid, configid, inventsizeid, batchno, inventlocationid);


--
-- Name: inventsize inventsize_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventsize
    ADD CONSTRAINT inventsize_pk PRIMARY KEY (id);


--
-- Name: inventtable inventtable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventtable
    ADD CONSTRAINT inventtable_pk PRIMARY KEY (id);


--
-- Name: inventtable inventtable_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventtable
    ADD CONSTRAINT inventtable_un UNIQUE (itemid);


--
-- Name: inventtablemodule inventtablemodule_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventtablemodule
    ADD CONSTRAINT inventtablemodule_pkey PRIMARY KEY (id);


--
-- Name: inventtrans inventtrans_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.inventtrans
    ADD CONSTRAINT inventtrans_pk PRIMARY KEY (id);


--
-- Name: ledgerjournaltrans ledgerjournaltrans_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.ledgerjournaltrans
    ADD CONSTRAINT ledgerjournaltrans_pk PRIMARY KEY (id);


--
-- Name: ledgertrans ledgertrans_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.ledgertrans
    ADD CONSTRAINT ledgertrans_pk PRIMARY KEY (id);


--
-- Name: menu_access menu_access_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_access
    ADD CONSTRAINT menu_access_pkey PRIMARY KEY (id);


--
-- Name: menu_group menu_group_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_group
    ADD CONSTRAINT menu_group_pkey PRIMARY KEY (id);


--
-- Name: menu_link menu_link_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_link
    ADD CONSTRAINT menu_link_pkey PRIMARY KEY (id);


--
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- Name: menu_role menu_role_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_role
    ADD CONSTRAINT menu_role_pkey PRIMARY KEY (id);


--
-- Name: movementtype movementtype_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.movementtype
    ADD CONSTRAINT movementtype_pk PRIMARY KEY (id);


--
-- Name: numbersequencetable numbersequencetable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.numbersequencetable
    ADD CONSTRAINT numbersequencetable_pk PRIMARY KEY (id);


--
-- Name: numbersequencetable numbersequencetable_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.numbersequencetable
    ADD CONSTRAINT numbersequencetable_un UNIQUE (numbersequence);


--
-- Name: overdue overdue_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.overdue
    ADD CONSTRAINT overdue_pk PRIMARY KEY (overdueid);


--
-- Name: overdue overdue_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.overdue
    ADD CONSTRAINT overdue_un UNIQUE (salesid, accountnum, invoiceamount);


--
-- Name: paymterm paymterm_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.paymterm
    ADD CONSTRAINT paymterm_pk PRIMARY KEY (paymtermid);


--
-- Name: phoneverification phoneverification_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.phoneverification
    ADD CONSTRAINT phoneverification_pk PRIMARY KEY (id);


--
-- Name: pricdisctableextra pricdisctableextra_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.pricdisctableextra
    ADD CONSTRAINT pricdisctableextra_pkey PRIMARY KEY (id);


--
-- Name: pricediscgroup pricediscgroup_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.pricediscgroup
    ADD CONSTRAINT pricediscgroup_pk PRIMARY KEY (id);


--
-- Name: pricedisctable pricedisctable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.pricedisctable
    ADD CONSTRAINT pricedisctable_pk PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: redeem redeem_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.redeem
    ADD CONSTRAINT redeem_pkey PRIMARY KEY (redeem_code);


--
-- Name: redeem redeem_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.redeem
    ADD CONSTRAINT redeem_transaction_id_key UNIQUE (transaction_id);


--
-- Name: redeempoints redeempoints_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.redeempoints
    ADD CONSTRAINT redeempoints_pk PRIMARY KEY (transactionid);


--
-- Name: sales_promotion_items_equal sales_promotion_items_equal_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sales_promotion_items_equal
    ADD CONSTRAINT sales_promotion_items_equal_pkey PRIMARY KEY (id);


--
-- Name: sales_promotion_items sales_promotion_items_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sales_promotion_items
    ADD CONSTRAINT sales_promotion_items_pkey PRIMARY KEY (id);


--
-- Name: salesline salesline_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.salesline
    ADD CONSTRAINT salesline_pk PRIMARY KEY (id);


--
-- Name: salestable salestable_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.salestable
    ADD CONSTRAINT salestable_pkey PRIMARY KEY (salesid);


--
-- Name: sizes sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_pkey PRIMARY KEY (id);


--
-- Name: sizes sizes_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sizes
    ADD CONSTRAINT sizes_un UNIQUE (code);


--
-- Name: sync_ddl sync_ddl_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_ddl
    ADD CONSTRAINT sync_ddl_pkey PRIMARY KEY (id);


--
-- Name: sync_error sync_error_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_error
    ADD CONSTRAINT sync_error_pkey PRIMARY KEY (id);


--
-- Name: sync_source sync_source_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_source
    ADD CONSTRAINT sync_source_pkey PRIMARY KEY (id);


--
-- Name: sync_table sync_table_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_table
    ADD CONSTRAINT sync_table_pkey PRIMARY KEY (id);


--
-- Name: taxdata taxdata_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.taxdata
    ADD CONSTRAINT taxdata_pk PRIMARY KEY (taxcode);


--
-- Name: taxgroupdata taxgroupdata_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.taxgroupdata
    ADD CONSTRAINT taxgroupdata_pk PRIMARY KEY (taxgroup);


--
-- Name: taxonitem taxonitem_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.taxonitem
    ADD CONSTRAINT taxonitem_pk PRIMARY KEY (taxitemgroup);


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: bases uq_code_dataareaid; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.bases
    ADD CONSTRAINT uq_code_dataareaid UNIQUE (code, dataareaid);


--
-- Name: user_info user_info_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_pk PRIMARY KEY (id);


--
-- Name: user_info user_info_un; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.user_info
    ADD CONSTRAINT user_info_un UNIQUE (user_name);


--
-- Name: userconfig userconfig_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.userconfig
    ADD CONSTRAINT userconfig_pk PRIMARY KEY (id);


--
-- Name: usergroup usergroup_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.usergroup
    ADD CONSTRAINT usergroup_pk PRIMARY KEY (groupid);


--
-- Name: usergroupconfig usergroupconfig_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.usergroupconfig
    ADD CONSTRAINT usergroupconfig_pk PRIMARY KEY (id);


--
-- Name: usergroupconfig usergroupconfig_usergroupid_key; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.usergroupconfig
    ADD CONSTRAINT usergroupconfig_usergroupid_key UNIQUE (usergroupid);


--
-- Name: vendortable vendortable_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.vendortable
    ADD CONSTRAINT vendortable_pk PRIMARY KEY (accountnum);


--
-- Name: visitcustomer visitcustomer_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.visitcustomer
    ADD CONSTRAINT visitcustomer_pk PRIMARY KEY (visitorid);


--
-- Name: visitorstype visitorstype_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.visitorstype
    ADD CONSTRAINT visitorstype_pk PRIMARY KEY (id);


--
-- Name: voucher voucher_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pk PRIMARY KEY (id);


--
-- Name: voucherdiscountitems voucherdiscounttable_pkey; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.voucherdiscountitems
    ADD CONSTRAINT voucherdiscounttable_pkey PRIMARY KEY (id);


--
-- Name: workflow workflow_pk; Type: CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.workflow
    ADD CONSTRAINT workflow_pk PRIMARY KEY (id);


--
-- Name: base_size_colors_base_size_id_color_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE UNIQUE INDEX base_size_colors_base_size_id_color_id_index ON public.base_size_colors USING btree (base_size_id, color_id) WHERE (deleted_at IS NULL);


--
-- Name: base_size_colors_base_size_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_size_colors_base_size_id_index ON public.base_size_colors USING btree (base_size_id);


--
-- Name: base_size_colors_color_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_size_colors_color_id_index ON public.base_size_colors USING btree (color_id);


--
-- Name: base_size_colors_product_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_size_colors_product_id_index ON public.base_size_colors USING btree (product_id);


--
-- Name: base_sizes_base_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_sizes_base_id_index ON public.base_sizes USING btree (base_id);


--
-- Name: base_sizes_base_id_size_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE UNIQUE INDEX base_sizes_base_id_size_id_index ON public.base_sizes USING btree (base_id, size_id) WHERE (deleted_at IS NULL);


--
-- Name: base_sizes_product_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_sizes_product_id_index ON public.base_sizes USING btree (product_id);


--
-- Name: base_sizes_size_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX base_sizes_size_id_index ON public.base_sizes USING btree (size_id);


--
-- Name: bases_product_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX bases_product_id_index ON public.bases USING btree (product_id);


--
-- Name: colors_order_index_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX colors_order_index_index ON public.colors USING btree (order_index);


--
-- Name: colors_product_id_code_img_id_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE UNIQUE INDEX colors_product_id_code_img_id_index ON public.colors USING btree (product_id, code, img_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL) AND (img_id IS NOT NULL));


--
-- Name: configtable_itemid_configid; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX configtable_itemid_configid ON public.configtable USING btree (itemid, configid);


--
-- Name: custtable_accountnum; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX custtable_accountnum ON public.custtable USING btree (accountnum);


--
-- Name: hex_colors_code_unique_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE UNIQUE INDEX hex_colors_code_unique_index ON public.colors USING btree (code) WHERE ((img_id IS NULL) AND (deleted_at IS NULL));


--
-- Name: inventsize_itemid_sizeid; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX inventsize_itemid_sizeid ON public.inventsize USING btree (itemid, inventsizeid);


--
-- Name: inventtable_itemid; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE INDEX inventtable_itemid ON public.inventtable USING btree (itemid);


--
-- Name: sizes_code_index; Type: INDEX; Schema: public; Owner: mposdb
--

CREATE UNIQUE INDEX sizes_code_index ON public.sizes USING btree (code);


--
-- Name: sync_error watch_sync_error_trigger; Type: TRIGGER; Schema: public; Owner: mposdb
--

CREATE TRIGGER watch_sync_error_trigger AFTER INSERT ON public.sync_error FOR EACH ROW EXECUTE PROCEDURE public.notify_sync_error();


--
-- Name: sync_table watch_sync_table_trigger; Type: TRIGGER; Schema: public; Owner: mposdb
--

CREATE TRIGGER watch_sync_table_trigger AFTER UPDATE ON public.sync_table FOR EACH ROW EXECUTE PROCEDURE public.notify_sync_table();


--
-- Name: base_size_colors base_size_colors_fk; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_size_colors
    ADD CONSTRAINT base_size_colors_fk FOREIGN KEY (color_id) REFERENCES public.colors(id);


--
-- Name: base_size_colors base_size_colors_fk_base_sizes; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_size_colors
    ADD CONSTRAINT base_size_colors_fk_base_sizes FOREIGN KEY (base_size_id) REFERENCES public.base_sizes(id);


--
-- Name: base_sizes base_sizes_fk; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_sizes
    ADD CONSTRAINT base_sizes_fk FOREIGN KEY (base_id) REFERENCES public.bases(id);


--
-- Name: base_sizes base_sizes_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.base_sizes
    ADD CONSTRAINT base_sizes_fk_1 FOREIGN KEY (size_id) REFERENCES public.sizes(id);


--
-- Name: bases bases_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.bases
    ADD CONSTRAINT bases_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: colors colors_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: designerservice designerservice_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.designerservice
    ADD CONSTRAINT designerservice_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.custtable(accountnum);


--
-- Name: menu_access menu_access_fk_link_id; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_access
    ADD CONSTRAINT menu_access_fk_link_id FOREIGN KEY (link_id) REFERENCES public.menu_link(id);


--
-- Name: menu_access menu_access_fk_role_id; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.menu_access
    ADD CONSTRAINT menu_access_fk_role_id FOREIGN KEY (role_id) REFERENCES public.menu_role(id);


--
-- Name: sync_table sync_table_fk_source_id; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_table
    ADD CONSTRAINT sync_table_fk_source_id FOREIGN KEY (source_id) REFERENCES public.sync_source(id);


--
-- Name: sync_table sync_table_fk_target_id; Type: FK CONSTRAINT; Schema: public; Owner: mposdb
--

ALTER TABLE ONLY public.sync_table
    ADD CONSTRAINT sync_table_fk_target_id FOREIGN KEY (target_id) REFERENCES public.sync_source(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mposdb
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO mposdb;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

