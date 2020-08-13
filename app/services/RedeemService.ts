import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import Axios, { AxiosStatic, AxiosRequestConfig, AxiosPromise } from "axios";
import { Utils } from "handlebars";
import { Sms } from "../../utils/Sms";
import { PhoneVerificationService } from "../services/PhoneVerificationService";

export class RedeemService {
  public sessionInfo: any;
  axios = require("axios");
  url = "https://api-qa.jazeerapaints.com/api";
  otpStore: Map<string, any> = new Map();
  private phoneVerificationService: PhoneVerificationService;
  private otp_token: string = "WTRNVnBLa3Q5UE5tTy9MczVtRWY0QT09";
  constructor() {
    this.phoneVerificationService = new PhoneVerificationService();
  }
  async getCustomerPoints(params: any) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = `http://pos.al-jazeerapaints.com:200/api/CustomerPoints?mobileNum=${params.mobile}&inventLocationId=${params.inventLocationId}`;
      console.log(url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.get(url);
      console.log(data);
      return data.data;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }

  async getCustomerSlabs(params: any) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = `http://pos.al-jazeerapaints.com:200/api/CustomerSlabs?mobileNum=${params.mobile}`;
      console.log(url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.get(url);
      console.log(data);
      return data.data;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }
  //0550590391
  async getOtp(params: any) {
    try {
      // let token = await this.getToken();
      // console.log(token);
      // let url = `https://api.jazeerapaints.com/api/gen_otp?phone=${params.mobile}`;
      // let url = `${this.url}/gen_otp`;
      // console.log(url);
      // this.axios.defaults.headers["Token"] = token;
      // console.log(this.axios.defaults.headers);
      // let data = await this.axios.get(url + `?phone=${params.mobile}`);
      // console.log(data);
      // this.otpStore.set(params.mobile, { token: data.data.otp_token, validate: false });
      // return data.data;
      this.phoneVerificationService.sessionInfo = this.sessionInfo;
      let reqData: any = { phoneNumber: params.mobile, customerId: "REDEEM_SERVICE" };
      let data = await this.phoneVerificationService.sendOtp(reqData);
      return { otp_token: "WTRNVnBLa3Q5UE5tTy9MczVtRWY0QT09", status: 1, message: data.message };
    } catch (error) {
      throw error;
    }
  }

  async validateOtp(reqdata: any) {
    try {
      // let token = await this.getToken();
      // console.log(this.otpStore.get(reqdata.mobile));
      // let otp_token: any = this.otpStore.get(reqdata.mobile).token;
      // let otp: any = reqdata.otp;
      // console.log(reqdata);
      // let url = `${this.url}/check_otp`;
      // console.log(url);
      // this.axios.defaults.headers["Token"] = token;
      // // console.log(this.axios.defaults.headers);
      // let data = await this.axios.post(url, { phone: reqdata.mobile, otp: otp, otp_token: otp_token });
      // console.log(data.data);
      // return data.data;
      this.phoneVerificationService.sessionInfo = this.sessionInfo;
      let reqData: any = { customerId: "REDEEM_SERVICE", phoneNumber: reqdata.mobile, otp: reqdata.otp };
      console.log(reqData);
      let data: any = await this.phoneVerificationService.verfiyOtp(reqData);
      return { message: "VERIFIED", status: true };
    } catch (error) {
      throw error;
    }
  }

  async getActiveSlabs(params: any) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = `http://pos.al-jazeerapaints.com:200/api/ActiveSlabs`;
      console.log(url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.get(url);
      console.log(Object.keys(data));
      console.log();
      return data.data;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }

  async Redeem(reqData: any) {
    try {
      let token = await this.getToken();
      console.log(token);
      let url = `http://pos.al-jazeerapaints.com:200/api/Redeem`;
      console.log(url);
      this.axios.defaults.headers["Token"] = token;
      console.log(this.axios.defaults.headers);
      let data = await this.axios.post(url, reqData);
      console.log(Object.keys(data));
      console.log();
      return data.data;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }

  async getToken() {
    try {
      let token: string;
      let url = `${Props.REDEEM_URL}?clientId=${Props.REDEEM_CLIENT_ID}&clientSecret=${Props.REDEEM_CLIENT_SECRET}`;
      console.log(url);
      let data = await this.axios.post(url);
      token = data.headers.token;
      return token;
    } catch (error) {
      throw error;
      // console.error(error);
    }
  }
}
