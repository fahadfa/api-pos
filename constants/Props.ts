export class Props {
  public static APP_NAME: string = "JAZEERA TECH";
  public static SALT_KEY: string = "SALT256DL";

  public static ACCESS_READ = "READ";
  public static ACCESS_WRITE = "WRITE";

  public static REDEEM_CLIENT_ID = "MPOS";
  public static REDEEM_CLIENT_SECRET = "N7ef3rqHvY6rvJM";
  public static REDEEM_URL = "http://pos.al-jazeerapaints.com:200/api/Authenticate";
  public static AXAPTA_URL = "http://pos.al-jazeerapaints.com:200/api/";
  public static ECOMMERCE_PAYMENT_URL = "https://qa.jazeerapaints.com/jpos_orders/";
  //public static ECOMMERCE_PAYMENT_URL = "https://pre-prod.jazeerapaints.com/jpos_orders/";
  public static DAY = "day";
  public static WEEK = "week";
  public static MONTH = "month";
  public static YEAR = "year";

  public static TOKEN_MESSAGE: string = "PLEASE_ENTER_THE_TOKEN";
  public static SAVED_SUCCESSFULLY: string = "SAVED_SUCCESSFULLY";
  public static REQUESTED_SUCCESSFULLY = "REQUESTED";
  public static REJECTED_SUCCESSFULLY = "REJECTED";
  public static UNRESERVED_SUCCESSFULLY: string = "UNRESERVED";
  public static PLEASE_LOGIN: string = "PLEASE_LOGIN";
  public static REMOVED_SUCCESSFULLY: string = "REMOVED";
  public static INVALID_DATA: string = "PLEASE_ENTER_VALID_DATA";
  public static INVALID_AUTH: string = "INVALID_AUTHENTICATION";
  public static INVALID_SALESLINE_DATA: string = "PLEASE_PROVIDE_THE_SUMMARY_DATA";
  public static MOBILE_EXISTS: string = "MOBILE_ALREADY_EXISTS";
  public static EMAIL_EXISTS: string = "Your email already exists";
  public static NO_WORKFLOW_REQUIRED = "WORKFLOW_NOT_REQUIRED";
  public static ORDER_NOT_FOUND = "ORDER_NOT_FOUND";
  public static INVALID_PASSWORD = "INVAILD_PASWORD";
  public static INVALID_USERNAME = "INVALID_USERNAME/PASSWORD";
  public static INVALID_TOKEN = "INVALID_TOKEN";
  public static PASSWORD_UPDATED_SUCCESSFULLY = "PASSWORD_UPDATED";
  public static PASSWORD_RESET_SUCCESSFULLY = "PASSWORD_RESETED";
  public static PASSWORD_RESET_TOKEN = "RESET_TOKEN_SENT_TO_YOUR_MAIL";
  public static TECHNICAL_ISSUE: "TECHNICAL_ISSUE,_PLEASE_CONTACT_YOUR_TECHNICAL_TEAM";
  public static CUSTOMER_RECORD_EXISTS = "RECORD_ALREASY_EXISTS";
  public static PROVIDE_ID = "PLEASE_PROVIDE_ID";
  public static DUPLICATE_RECORD = "DUPLICATE_RECORD";
  public static DATA_NOT_FOUND = "DATA_NOT_FOUND";
  public static NO_NUMBER_SEQUENCE = "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE";
  public static VERIFIED = "VERIFIED";
  public static OTP_EXPIRED = "OTP_EXPIRED";
  public static INVALID_MOBILE = "MOBILE_NUMBER_IS_NOT_VALID";
  public static SALES_ID_REQUIRED = "Sales Id Required";
  public static NO_VENDOR_FOR_CUSTOMER =
    "CANNOT_CREATE_PURCHASE_ORDER_BECAUSE_THERE_IS_NO_CUSTOMER_ACCOUNT_RELATED_TO_THIS_VENDOR_ID";
  public static TRANSKIND_REQUIRED = "TRANSKIND_REQUIRED";
  public static ALREADY_CONVERTED = "ALREADY_CONVERTED";
  public static NO_RM = "NO_RM_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN";
  public static NO_RA = "NO_RA_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT_SYSTEM_ADMIN";
  public static NO_DESIGNER = "NO_DESIGNER_ADDED_TO_YOUR_GROUP_PLEASE_CONTACT";

  public static RECORD_EXISTS: string = "RECORD_ALREADY_EXISTS";
  public static RECORD_NOT_EXISTS: string = "RECORD_NOT_FOUND";
  public static MISS_MATCH_MESSAGE: string =
    "ALREADY_UPDATED_THE_RECORD_PLEASE_DO_REFRESH_AND_CONTINUESome one updated the recored, please do refresh and continue.";
  public static RECORD_NOT_FOUND: string = "RECORD_NOT_FOUND";
  public static ACCOUNT_DEACTIVATED = "ACCOUNT_DEACTIVATED,_PLEASE_CONTACT_ADMIN";

  public static TRACK_STATUS_NEW: string = "NEW";
  public static TRACK_STATUS_PROCESSING: string = "PROCESSING";
  public static TRACK_STATUS_COMPLETE: string = "COMPLETE";
  public static TRACK_STATUS_CANCEL: string = "CANCEL";
  public static TRACK_STATUS_PAID: string = "PAID";
  public static TRACK_STATUS_REFUND: string = "REFUND";
  public static TRACK_STATUS_REPAID: string = "REPAID";
  public static TRACK_STATUS_DISCONNECT: string = "DISCONNECT";
  public static TRACK_STATUS_BOOKING: string = "BOOKING";
  public static TRACK_STATUS_CHECK_IN: string = "CHECK IN";
  public static TRACK_STATUS_CHECK_OUT: string = "CHECK OUT";

  public static PROFILE_STATUS_VERIFIED: string = "VERIFIED";
  public static PROFILE_STATUS_INPROGRESS: string = "INPROGRESS";
  public static PROFILE_STATUS_UNVERIFIED: string = "UNVERIFIED";
  public static PROFILE_STATUS_CHANGE_REQUIRED: string = "CHANGE_REQUIRED";

  public static NO_ITEM_AMOUNT: string = "No price is attached to this customer price group";

  public static RCUSTTYPE: any = {
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

  public static rcusttypeEn: any = {
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
  public static rcusttypeAr: any = {
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

  public static customerBlocked: {
    0: "OPEN";
    1: "INVOICE BLOCKED";
    2: "COMPLETLY BLOCKED";
  };

  public static WORKFLOW_ORDER_TYPE: any = {
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

  public static Workflow_Order_Type: any = {
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

  public static CUSTTYPE = {
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

  public static WORKFLOW_STATUSID: any = {
    RO_DRAFTED: ["DRAFTED", "Drafted", "تم الانشاء"],
    PENDINGDSNRAPPROVAL: ["PENDINGDSNRAPPROVAL", "Pending for Designer approval", "بانتظار موافقة مهندس التصميم"],
    APPROVEDBYDSNR: ["APPROVEDBYDSNR", "Approved by Designer", "تمت موافقة مهندس التصميم"],
    REJECTEDBYDSNR: ["REJECTEDBYDSNR", "Rejected by Designer", "مرفوضة من قبل مهندس التصميم"],
    PENDINGRMAPPROVAL: [
      "PENDINGRMAPPROVAL",
      "Pending for Regional Manager approval",
      "بانتظار موافقة مدير مبيعات المنطقة"
    ],
    PENDINGRAAPPROVAL: [
      "PENDINGRAAPPROVAL",
      "Pending for Regional Accountant approval",
      "بانتظار موافقة محاسب المنطقة"
    ],
    REJECTEDBYRM: ["REJECTEDBYRM", "Rejected by Regional Manager", "تم رفضها من قبل مدير مبيعات المنطقة"],
    APPROVEDBYRA: ["APPROVEDBYRA", "Approved by Regional Accountant", "تمت الموافقة من قبل محاسب المنطقة"],
    APPROVEDBYRM: ["APPROVEDBYRM", "Approved by Regional Manager", "تمت الموافقة من قبل مدير المنطقة"],
    REJECTEDBYRA: ["REJECTEDBYRA", "Rejected by Regional Accountant", "تم رفضها من قبل محاسب المنطقة"],
    RO_POSTED: ["POSTED", "Posted", "تم التأكيد"],
    PENDINGINGFORDESIGNERAPPROVAL: ["PENDINGINGFORDESIGNERAPPROVAL", "Pending For Designer Approval", "تم التأكيد"],
    APPROVEDBYDESIGNER: ["APPROVEDBYDESIGNER", "Approved By Designer", "تم التأكيد"]
  };

  public static DIMENSION_CODE: any = {
    REGION: 0,
    PROJECT: 101,
    DEPARTMENT: 1,
    PRODUCTLINE: 104,
    SALESMAN: 102,
    COSTCENTER: 2,
    BRAND: 103,
    EMPLOYEE: 100
  };

  public static ACCOUNT_TYPE: any = {
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

  public static DIMENSION_OPTIONS: any = {
    0: "Optional",
    1: "ToBeFilledIn",
    2: "List",
    3: "Fixed"
  };

  public static ITEM_TYPE: any = {
    0: "NONE",
    1: "INTERIOR",
    2: "EXTERIOR",
    3: "BOTH",
    4: "CEMENT"
  };

  // public static REGION_NAME = "REGION";
  // public static PROJECT_NAME = "PROJECT";
  // public static DEPARTMENT_NAME = "DEPARTMENT";
  // public static PRODUCTLINE_NAME = "PRODUCTLINE";
  // public static SALESMAN_NAME = "SALESMAN";
  // public static COSTCENTER_NAME = "COSTCENTER";
  // public static BRAND_NAME = "BRAND";
  // public static EMPLOYEE_NAME = "EMPLOYEE";
}
