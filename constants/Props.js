"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Props = /** @class */ (function () {
    function Props() {
    }
    Props.APP_NAME = "JAZEERA TECH";
    Props.SALT_KEY = "SALT256DL";
    Props.ACCESS_READ = "READ";
    Props.ACCESS_WRITE = "WRITE";
    Props.REDEEM_CLIENT_ID = "MPOS";
    Props.REDEEM_CLIENT_SECRET = "N7ef3rqHvY6rvJM";
    Props.REDEEM_URL = "http://pos.al-jazeerapaints.com:200/api/Authenticate";
    Props.AXAPTA_URL = "http://pos.al-jazeerapaints.com:200/api/";
    Props.DAY = 'day';
    Props.WEEK = 'week';
    Props.MONTH = 'month';
    Props.YEAR = 'year';
    Props.TOKEN_MESSAGE = "Please enter the token.";
    Props.SAVED_SUCCESSFULLY = "Saved Successfully.";
    Props.REQUESTED_SUCCESSFULLY = "Requested Successfully";
    Props.REJECTED_SUCCESSFULLY = "Rejected Successfully";
    Props.UNRESERVED_SUCCESSFULLY = "Unreserved Successfully.";
    Props.PLEASE_LOGIN = "Please login.";
    Props.REMOVED_SUCCESSFULLY = "Removed Successfully.";
    Props.INVALID_DATA = "Please enter valid data.";
    Props.INVALID_AUTH = "Your not a valid Auth.";
    Props.INVALID_SALESLINE_DATA = "Please Provide The Summary Data";
    Props.MOBILE_EXISTS = "Your mobile already exists";
    Props.EMAIL_EXISTS = "Your email already exists";
    Props.NO_WORKFLOW_REQUIRED = "NO Workflow Required";
    Props.ORDER_NOT_FOUND = "Order Not Found";
    Props.INVALID_PASSWORD = "Invalid Password";
    Props.INVALID_USERNAME = "Invalid Username/Password";
    Props.INVALID_TOKEN = "Invalid Token";
    Props.PASSWORD_UPDATED_SUCCESSFULLY = "Password Updated Successfully";
    Props.PASSWORD_RESET_SUCCESSFULLY = "Password Reset Successfully";
    Props.PASSWORD_RESET_TOKEN = "Password Reset Token Sent Successfully";
    Props.CUSTOMER_RECORD_EXISTS = "Record Exists With This Customer Id";
    Props.PROVIDE_ID = "Please Provide Id";
    Props.DUPLICATE_RECORD = "Duplicate Record";
    Props.DATA_NOT_FOUND = "Data Not Found";
    Props.NO_NUMBER_SEQUENCE = "Cannot Find Sequence Format From Number Sequence Table";
    Props.VERIFIED = "Verified";
    Props.OTP_EXPIRED = "OTP Expired";
    Props.INVALID_MOBILE = "Mobile Number Is Not Valid";
    Props.SALES_ID_REQUIRED = "Sales Id Required";
    Props.NO_VENDOR_FOR_CUSTOMER = "cannot create to purchase order because there is no customer account related to this vendor id";
    Props.TRANSKIND_REQUIRED = "transkind required";
    Props.ALREADY_CONVERTED = "Already Converted";
    Props.NO_RM = "No RM For This Usergroup";
    Props.NO_RA = "No RA For This Usergroup";
    Props.NO_DESIGNER = "No Designer For This Usergroup";
    Props.RECORD_EXISTS = "Record already exists";
    Props.RECORD_NOT_EXISTS = "Record not exists";
    Props.MISS_MATCH_MESSAGE = "Some one updated the recored, please do refresh and continue.";
    Props.RECORD_NOT_FOUND = "Record not found";
    Props.ACCOUNT_DEACTIVATED = "Account Deactivated, Please Contact Admin";
    Props.TRACK_STATUS_NEW = "NEW";
    Props.TRACK_STATUS_PROCESSING = "PROCESSING";
    Props.TRACK_STATUS_COMPLETE = "COMPLETE";
    Props.TRACK_STATUS_CANCEL = "CANCEL";
    Props.TRACK_STATUS_PAID = "PAID";
    Props.TRACK_STATUS_REFUND = "REFUND";
    Props.TRACK_STATUS_REPAID = "REPAID";
    Props.TRACK_STATUS_DISCONNECT = "DISCONNECT";
    Props.TRACK_STATUS_BOOKING = "BOOKING";
    Props.TRACK_STATUS_CHECK_IN = "CHECK IN";
    Props.TRACK_STATUS_CHECK_OUT = "CHECK OUT";
    Props.PROFILE_STATUS_VERIFIED = "VERIFIED";
    Props.PROFILE_STATUS_INPROGRESS = "INPROGRESS";
    Props.PROFILE_STATUS_UNVERIFIED = "UNVERIFIED";
    Props.PROFILE_STATUS_CHANGE_REQUIRED = "CHANGE_REQUIRED";
    Props.NO_ITEM_AMOUNT = "No price is attached to this customer price group";
    Props.RCUSTTYPE = {
        0: [0, "Charity", "الاعمال الخيرية"],
        1: [1, "Individual", "أفراد"],
        2: [2, "Painters", "دهان"],
        3: [3, "Paints Contractor", "دهان مقاول - مؤسسات"],
        4: [4, "Interior Designer", "مصمم داخلي"],
        5: [5, "Decoration Shops", "محلات الديكور"],
        6: [6, "Family", "عوائل"],
        7: [7, "Real Estate", "العقاريون"],
        8: [8, "Tile Workers", "مبلطين"],
        9: [9, "ISOLATION", "عوازل"]
    };
    Props.rcusttypeEn = {
        Charity: 0,
        Individual: 1,
        Painters: 2,
        "Paints Contractor": 3,
        "Interior Designer": 4,
        "Decoration Shops": 5,
        Family: 6,
        "Real Estate": 7,
        "Tile Workers": 8,
        ISOLATION: 9
    };
    Props.rcusttypeAr = {
        "الاعمال الخيرية": 0,
        أفراد: 1,
        دهان: 2,
        "دهان مقاول - مؤسسات": 3,
        "مصمم داخلي": 4,
        "محلات الديكور": 5,
        عوائل: 6,
        العقاريون: 7,
        مبلطين: 8,
        عوازل: 9
    };
    Props.WORKFLOW_ORDER_TYPE = {
        SALESQUOTATION: [2, "SALESQUOTATION", "Sales Quotation"],
        SALESORDER: [3, "SALESORDER", "Sales Order"],
        PURCHASEREQUEST: [4, "PURCHASEREQUEST", "Purchase Request"],
        PURCHASEORDER: [5, "PURCHASEORDER", "Purchase Order"],
        INVENTORYMOVEMENT: [6, "INVENTORYMOVEMENT", "Movement"],
        RETURNORDER: [7, "RETURNORDER", "Return Order"],
        PURCHSERETURNORDER: [8, "PURCHSERETURNORDER", "Purchase Return Order"],
        DESIGNERSERVICERETURN: [9, "DESIGNERSERVICERETURN", "designer Service Return Order"],
        DESIGNERSERVICE: [10, "DESIGNERSERVICE", "designer Service"]
    };
    Props.Workflow_Order_Type = {
        2: [2, "SALESQUOTATION", "Sales Quotation"],
        3: [3, "SALESORDER", "Sales Order"],
        4: [4, "PURCHASEREQUEST", "Purchase Request"],
        5: [5, "PURCHASEORDER", "Purchase Order"],
        6: [6, "INVENTORYMOVEMENT", "Movement"],
        7: [7, "RETURNORDER", "Return Order"],
        8: [8, "PURCHSERETURNORDER", "Purchase Return Order"],
        9: [9, "DESIGNERSERVICERETURN", "designer Service Return Order"],
        10: [10, "DESIGNERSERVICE", "designer Service"]
    };
    Props.CUSTTYPE = {
        0: ["CHARITY", 0, "Charity", "Charity"],
        1: ["AGENT", 1, "Agent", "Agent"],
        2: ["PROJECT", 2, "Project", "Project"],
        3: ["SHOWROOM", 3, "Showroom", "Showroom"],
        4: ["OTHERS", 4, "Others", "Others"],
        5: ["NONE", 5, "None", "None"],
        6: ["OEM", 6, "OEM", "OEM"],
        7: ["WHOLESALE", 7, "Wholesale", "Wholesale"],
        8: ["WEBSITE", 8, "Website", "Website"]
    };
    Props.WORKFLOW_STATUSID = {
        RO_DRAFTED: ["DRAFTED", "Drafted", "تم الانشاء"],
        PENDINGDSNRAPPROVAL: ["PENDINGDSNRAPPROVAL", "Pending for Designer approval", "بانتظار موافقة مهندس التصميم"],
        APPROVEDBYDSNR: ["APPROVEDBYDSNR", "Approved by Designer", "تمت موافقة مهندس التصميم"],
        REJECTEDBYDSNR: ["REJECTEDBYDSNR", "Rejected by Designer", "مرفوضة من قبل مهندس التصميم"],
        PENDINGRMAPPROVAL: ["PENDINGRMAPPROVAL", "Pending for Regional Manager approval", "بانتظار موافقة مدير مبيعات المنطقة"],
        PENDINGRAAPPROVAL: ["PENDINGRAAPPROVAL", "Pending for Regional Accountant approval", "بانتظار موافقة محاسب المنطقة"],
        REJECTEDBYRM: ["REJECTEDBYRM", "Rejected by Regional Manager", "تم رفضها من قبل مدير مبيعات المنطقة"],
        APPROVEDBYRA: ["APPROVEDBYRA", "Approved by Regional Accountant", "تمت الموافقة من قبل محاسب المنطقة"],
        APPROVEDBYRM: ["APPROVEDBYRM", "Approved by Regional Manager", "تمت الموافقة من قبل مدير المنطقة"],
        REJECTEDBYRA: ["REJECTEDBYRA", "Rejected by Regional Accountant", "تم رفضها من قبل محاسب المنطقة"],
        RO_POSTED: ["POSTED", "Posted", "تم التأكيد"],
        PENDINGINGFORDESIGNERAPPROVAL: ["PENDINGINGFORDESIGNERAPPROVAL", "Pending For Designer Approval", "تم التأكيد"],
        APPROVEDBYDESIGNER: ["APPROVEDBYDESIGNER", "Approved By Designer", "تم التأكيد"]
    };
    Props.DIMENSION_CODE = {
        REGION: 0,
        PROJECT: 101,
        DEPARTMENT: 1,
        PRODUCTLINE: 104,
        SALESMAN: 102,
        COSTCENTER: 2,
        BRAND: 103,
        EMPLOYEE: 100
    };
    Props.ACCOUNT_TYPE = {
        0: "Profit And Loss",
        1: "Revenue",
        2: "Cost",
        3: "Balance",
        4: "Asset",
        5: "Liability",
        6: "Header",
        9: "Total",
        10: "Group Total"
    };
    Props.DIMENSION_OPTIONS = {
        0: "Optional",
        1: "ToBeFilledIn",
        2: "List",
        3: "Fixed"
    };
    Props.ITEM_TYPE = {
        0: "NONE",
        1: "INTERIOR",
        2: "EXTERIOR",
        3: "BOTH",
        4: "CEMENT"
    };
    return Props;
}());
exports.Props = Props;
