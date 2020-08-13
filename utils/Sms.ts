var sms = require("mobily-sms");
export class Sms {
  private mobilySms: any;

  constructor() {
    this.mobilySms = sms("AL-JAZEERAPAINTS7", "63314694");
  }

  async execute(message: string, mobiles: string[]) {
    console.log("message : " + message);
    console.log(mobiles);
    return new Promise((resolve: any, reject: any) => {
      this.mobilySms.sendSms(message, mobiles, "JazeraPaint", {}, (error: any, data: any) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    });
  }

  async sendMessage(countryCode: string, mobile: string, message: string) {
    try {
      let phone: string = mobile;
      phone = phone[0] == "0" ? phone.substring(1) : phone;
      phone = countryCode + phone;
      return await this.execute(message, [phone]);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
