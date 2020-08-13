import * as path from "path";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";
import * as Handlebars from "handlebars";
import { Transport, createTransport } from "nodemailer";
import * as Config from "./Config";
import { log } from "./Log";
import { hashSync, compareSync } from "bcryptjs";
import { userInfo } from "os";
import { RawQuery } from "../app/common/RawQuery";
import { resolve } from "dns";
import { rejects } from "assert";
const dns = require("dns").promises;

export class App {
  private static uniqueId: number = 0;
  public static TOKEN_MESSAGE = "Please enter the token.";
  public static SAVED_SUCCESSFULLY = "Saved Successfully.";
  public static REMOVED_SUCCESSFULLY = "Removed Successfully.";
  public static INVALID_DATA = "Please enter valid data.";
  public static NON_ALPHA_NUMARIC = /[^\w\s]/g;

  public static UniqueCode(): string {
    var time: number = new Date().getTime();
    if (this.uniqueId == time) {
      while (new Date().getTime() < 1 + time) {}
      time = new Date().getTime();
    }
    this.uniqueId = time;
    return time.toString(36).toUpperCase();
  }

  public static UniqueNumber(): string {
    var time: number = new Date().getTime();
    if (this.uniqueId == time) {
      while (new Date().getTime() < 1 + time) {}
      time = new Date().getTime();
    }
    this.uniqueId = time;
    return time.toString(36).toUpperCase();
  }

  public static convertUTCDateToLocalDate(date: any, timezoneoffset: any) {
    if (date.getTimezoneOffset() + "" !== timezoneoffset) {
      var diffseconds: number = timezoneoffset * 60;
      let hours = parseInt(diffseconds / 3600 + "");
      let minutes = (diffseconds / 60) % 60;
      let seconds = diffseconds % 60;

      var yearOrg = date.getFullYear();
      var dateOrg = date.getDate();
      var hoursOrg = date.getHours();
      var minutesOrg = date.getMinutes();
      var secondsOrg = date.getSeconds();

      date.setDate(dateOrg);
      date.setYear(yearOrg);
      date.setHours(hoursOrg - hours);
      date.setMinutes(minutesOrg - minutes);
      date.setSeconds(secondsOrg - seconds);
    }

    return date;
  }
  public static uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  public static UniqueID(name: string, type: string): string {
    var str: string = "";

    if (type) {
      str = type + "_" + name;
    } else {
      str = name + "_" + App.UniqueNumber();
    }
    str = str.replace(App.NON_ALPHA_NUMARIC, "_");
    str = str.substr(0, 128);
    return str.toUpperCase();
  }
  public static DateNow() {
    const d1 = new Date();
    const d3 = new Date(
      d1.getUTCFullYear(),
      d1.getUTCMonth(),
      d1.getUTCDate(),
      d1.getUTCHours(),
      d1.getUTCMinutes(),
      d1.getUTCSeconds(),
      d1.getUTCMilliseconds()
    );
    return d3.toISOString();
  }
  public static Send(req: any, res: any, promise: any) {
    var respObj: any = {};
    promise
      .then((data: any) => {
        respObj.status = 1;
        respObj.data = data;
        res.jsonp(respObj);
      })
      .catch((err: any) => {
        log.info(err);
        respObj.status = 0;
        respObj.error = err;
        res.jsonp(respObj);
      });
  }

  public static HtmlRender(fileName: string, data: Object) {
    var source = path.join(__dirname, "/../assets/templates/" + fileName + ".html");
    // log.info("Html Source: " + source);
    source = fs.readFileSync(source, "utf8");
    var template = Handlebars.compile(source);
    data = JSON.parse(JSON.stringify(data));
    var result = template(data);
    // log.info(result);
    return result;
  }

  // public static Print(template: any, res: any, promise: any) {
  //   promise
  //     .then((data: any) => {
  //       template = path.join(
  //         __dirname,
  //         "/../../docs/templates/" + template + ".html"
  //       );
  //       template = fs.readFileSync(template, "utf8");
  //       data = JSON.parse(JSON.stringify(data));
  //       //log.info(data.data);
  //       jsreport
  //         .render({
  //           template: {
  //             engine: "handlebars",
  //             content: template,
  //             recipe: "html"
  //           },
  //           data: data.data
  //         })
  //         .then((out: any) => {
  //           log.info(out.stream);
  //           out.stream.pipe(res);
  //         })
  //         .catch((err: any) => {
  //           var respObj: any = {};
  //           log.info(err);
  //           respObj.status = 0;
  //           respObj.error = err;
  //           res.jsonp(respObj);
  //         });
  //     })
  //     .catch((err: any) => {
  //       var respObj: any = {};
  //       log.info(err);
  //       respObj.status = 0;
  //       respObj.error = err;
  //       res.jsonp(respObj);
  //     });
  // }

  public static EncodeJWT(data: any) {
    return jwt.sign(data, "SwanInfo");
  }

  public static DecodeJWT(token: any) {
    if (token && token != null && token != "null") {
      try {
        token = token.includes(" ") ? token.replace("jwt ", "").replace("JWT ", "") : token;
        let userInfo = jwt.verify(token, "SwanInfo");
        return userInfo;
      } catch (err) {
        log.error("--------- token error ------------->");
        log.error(err);
        log.error("<--------- token error -------------");
        return err;
      }
    } else {
      return null;
    }
  }

  public static generateOTP(otpLength: number) {
    var digits = "0123456789";
    // var otpLength = 6;
    var otp = "";
    for (let i = 1; i <= otpLength; i++) {
      var index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
    return otp;
  }

  public static CreateEmailAccount() {
    return createTransport({
      host: Config.mailOptions.host,
      port: Config.mailOptions.port,
      secure: true,
      requireTLS: true,
      auth: {
        user: Config.mailOptions.user,
        pass: Config.mailOptions.pass,
      },
    });
  }

  public static async ValildateUserAccess(data: any, component: String, access: String) {
    log.info(data);
    if (data) {
      if (data.name && data.message && data.name.lowercase().indexOf("error") > -1) {
        return false;
      } else {
        let isValid = false;
        try {
          isValid = await RawQuery.CheckUserInfo(data);
        } catch (error) {
          throw error;
        }

        if (isValid == true) {
          return true;
        } else {
          throw { message: "User not releated to this store." };
        }
      }
    } else {
      return false;
    }
  }

  public static DaysBack(date: Date, backValue: number, isDays: boolean = true) {
    date = new Date(date);
    if (isDays) {
      date.setDate(date.getDate() - backValue);
    } else {
      date.setMilliseconds(date.getMilliseconds() - backValue);
    }

    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    return date;
  }

  public static DaysDiff(d1: Date, d2: Date): number {
    let t2: number = d2.getTime();
    let t1: number = d1.getTime();
    let diff: any = (t2 - t1) / (24 * 3600 * 1000);
    return parseInt(diff);
  }

  public static PrintLog(routerName: string, routerType: string, sessionInfo: any) {
    log.info(`${new Date().toISOString()} : ${routerName} :  ${routerType} : ${JSON.stringify(sessionInfo)}`);
  }

  public static HashSync(data: string) {
    return hashSync(data, 8);
  }

  public static HashCompareSync(param1: string, param2: string) {
    return compareSync(param1, param2);
  }

  public static ArrayJoin(items: any[], attr: string) {
    let attrs: any[] = [];
    console.log(items);
    items.forEach((element: any) => {
      attrs.push(element[attr]);
    });
    return attrs.join(",");
  }

  public static async SendMail(to: string, subject: string, htmlPage: string, renderData: any) {
    let transporter = App.CreateEmailAccount();
    const Options = {
      from: Config.mailOptions.user,
      to: to,
      subject: subject,
      html: App.HtmlRender(htmlPage, {
        data: renderData,
      }),
    };
    return new Promise((reslove, reject) => {
      transporter.sendMail(Options, (err: any, info: any) => {
        console.log(info);
        if (err) {
          reject(err);
        }
        reslove({
          message: "Mail sent successfully",
        });
      });
    });
  }

  public static unflatten(arr: any) {
    let tree: any = [];
    let mappedArr: any = {};
    let arrElem: any;
    let mappedElem: any;

    // First map the nodes of the array to an object -> create a hash table.
    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]["children"] = [];
    }

    for (let id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parentId) {
          mappedArr[mappedElem["parentId"]]["children"].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  private static SystemSleep = require("system-sleep");

  public static Sleep(millseconds: number) {
    App.SystemSleep(millseconds);
  }
  public static checkInternet() {
    return dns
      .lookup("google.com")
      .then(() => true)
      .catch(() => false);
  }

  public static async getMacAddress() {
    try {
      var address = require("address");
      return new Promise((resolve, reject) => {
        address((err, addrs) => {
          if (addrs && addrs.mac) {
            console.log(addrs.ip, addrs.ipv6, addrs.mac);
            // '192.168.0.2', 'fe80::7aca:39ff:feb0:e67d', '78:ca:39:b0:e6:7d'
            resolve(addrs.mac);
          } else {
            resolve("Not Found Mac Address");
          }
        });
      });
    } catch (err) {
      return Promise.resolve("Not Found Mac Address");
    }
  }
}
