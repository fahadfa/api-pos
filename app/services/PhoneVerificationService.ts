import { App } from "../../utils/App";
import { Sms } from "../../utils/Sms";
import { Props } from "../../constants/Props";
import { PhoneVerification } from "../../entities/PhoneVerification";
import { PhoneVerificationDAO } from "../repos/PhoneVerificationDAO";

export class PhoneVerificationService {
  public sessionInfo: any;
  private phoneVerificationDAO: PhoneVerificationDAO;
  private sms: Sms;

  constructor() {
    this.phoneVerificationDAO = new PhoneVerificationDAO();
    this.sms = new Sms();
  }

  async entity(id: string) {
    try {
      let data: any = await this.phoneVerificationDAO.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      let data: any = await this.phoneVerificationDAO.search(item);
      data = await App.unflatten(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(item: PhoneVerification) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let data: any = await this.phoneVerificationDAO.save(item);
        let returnData = { id: data.id, message: "SAVED_SUCCESSFULLY" };
        return returnData;
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let data: PhoneVerification = await this.phoneVerificationDAO.entity(id);
      if (!data) throw { message: "RECORD_NOT_FOUND" };
      data.lastmodifiedBy = this.sessionInfo.id;
      let result: any = await this.phoneVerificationDAO.delete(data);
      let returnData = { id: id, message: "REMOVED" };
      return returnData;
    } catch (error) {
      throw error;
    }
  }

  async validate(item: PhoneVerification) {
    let previousItem: any = null;
    if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
      item.id = null;
    } else {
      previousItem = await this.phoneVerificationDAO.entity(item.id);
    }
    // let condData = await this.menuRepository.search({ name: item.name });
    if (!item.id) {
      item.createdDateTime = new Date(App.DateNow());
      // if (condData.length > 0) {
      //     return "name";
      // } else {
      // let uid = App.UniqueCode();
      // item.id = uid;
      // item.createdBy = this.sessionInfo.id;
      // item.createdOn = new Date(App.DateNow());
      // }
    } else {
      if (
        item.lastModifiedDate &&
        previousItem.lastModifiedDate.toISOString() != new Date(item.lastModifiedDate).toISOString()
      ) {
        return "updated";
      }
    }

    item.lastModifiedDate = new Date(App.DateNow());
    item.lastmodifiedBy = this.sessionInfo.userName;
    return true;
  }
  async sendOtp(item: any) {
    try {
      let phoneVerification = new PhoneVerification();
      phoneVerification.phoneNumber = item.phoneNumber;
      phoneVerification.otpSent = App.generateOTP(4);
      phoneVerification.customerId = item.customerId;
      phoneVerification.dataareaid = this.sessionInfo.dataareaid;
      phoneVerification.createdBy = this.sessionInfo.userName;
      phoneVerification.createdDateTime = new Date(App.DateNow());
      phoneVerification.countryCode = item.countryCode ? item.countryCode : 966;
      phoneVerification.otpExpiryTime = new Date(App.DateNow());
      let data = await this.save(phoneVerification);
      let message = `Your OTP is`;
      await this.sms.sendMessage(
        phoneVerification.countryCode,
        phoneVerification.phoneNumber,
        phoneVerification.otpSent
      );
      return { id: data.id, message: "OTP Sent" };
    } catch (error) {
      throw { message: error };
    }
  }
  async verfiyOtp(item: any) {
    try {
      let phoneVerification: PhoneVerification = await this.phoneVerificationDAO.findOne({
        phoneNumber: item.phoneNumber,
        customerId: item.customerId,
      });
      if (phoneVerification) {
        if (phoneVerification.otpSent == item.otp) {
          // if (phoneVerification.otpExpiryTime < new Date()) {
          phoneVerification.verificationStatus = "Verified";
          await this.save(phoneVerification);
          return { message: "VERIFIED", status: true };
          // } else {
          // throw Props.OTP_EXPIRED
          // }
        } else {
          throw { message: "INVALID_OTP" };
        }
      } else {
        throw { message: "INVALID_MOBILE_NUMBER" };
      }
    } catch (error) {
      throw error;
    }
  }
}
