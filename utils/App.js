"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var jwt = __importStar(require("jsonwebtoken"));
var Handlebars = __importStar(require("handlebars"));
var nodemailer_1 = require("nodemailer");
var Config = __importStar(require("./Config"));
var Log_1 = require("./Log");
var bcryptjs_1 = require("bcryptjs");
var RawQuery_1 = require("../app/common/RawQuery");
var dns = require("dns").promises;
var App = /** @class */ (function () {
    function App() {
    }
    App.UniqueCode = function () {
        var time = new Date().getTime();
        if (this.uniqueId == time) {
            while (new Date().getTime() < 1 + time) { }
            time = new Date().getTime();
        }
        this.uniqueId = time;
        return time.toString(36).toUpperCase();
    };
    App.UniqueNumber = function () {
        var time = new Date().getTime();
        if (this.uniqueId == time) {
            while (new Date().getTime() < 1 + time) { }
            time = new Date().getTime();
        }
        this.uniqueId = time;
        return time.toString(36).toUpperCase();
    };
    App.convertUTCDateToLocalDate = function (date, timezoneoffset) {
        if (date.getTimezoneOffset() + "" !== timezoneoffset) {
            var diffseconds = timezoneoffset * 60;
            var hours = parseInt(diffseconds / 3600 + "");
            var minutes = (diffseconds / 60) % 60;
            var seconds = diffseconds % 60;
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
    };
    App.uuidv4 = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    App.UniqueID = function (name, type) {
        var str = "";
        if (type) {
            str = type + "_" + name;
        }
        else {
            str = name + "_" + App.UniqueNumber();
        }
        str = str.replace(App.NON_ALPHA_NUMARIC, "_");
        str = str.substr(0, 128);
        return str.toUpperCase();
    };
    App.DateNow = function () {
        var d1 = new Date();
        var d3 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds(), d1.getUTCMilliseconds());
        return d3.toISOString();
    };
    App.Send = function (req, res, promise) {
        var respObj = {};
        promise
            .then(function (data) {
            respObj.status = 1;
            respObj.data = data;
            res.jsonp(respObj);
        })
            .catch(function (err) {
            Log_1.log.info(err);
            respObj.status = 0;
            respObj.error = err;
            res.jsonp(respObj);
        });
    };
    App.HtmlRender = function (fileName, data) {
        var source = path.join(__dirname, "/../assets/templates/" + fileName + ".html");
        // log.info("Html Source: " + source);
        source = fs.readFileSync(source, "utf8");
        var template = Handlebars.compile(source);
        data = JSON.parse(JSON.stringify(data));
        var result = template(data);
        // log.info(result);
        return result;
    };
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
    App.EncodeJWT = function (data) {
        return jwt.sign(data, "SwanInfo");
    };
    App.DecodeJWT = function (token) {
        if (token) {
            try {
                token = token.replace("jwt ", "").replace("JWT ", "");
                var userInfo_1 = jwt.verify(token, "SwanInfo");
                return userInfo_1;
            }
            catch (err) {
                return err;
            }
        }
        else {
            return null;
        }
    };
    App.generateOTP = function (otpLength) {
        var digits = "0123456789";
        // var otpLength = 6;
        var otp = "";
        for (var i = 1; i <= otpLength; i++) {
            var index = Math.floor(Math.random() * digits.length);
            otp = otp + digits[index];
        }
        return otp;
    };
    App.CreateEmailAccount = function () {
        return nodemailer_1.createTransport({
            host: Config.mailOptions.host,
            port: Config.mailOptions.port,
            secure: true,
            requireTLS: true,
            auth: {
                user: Config.mailOptions.user,
                pass: Config.mailOptions.pass,
            },
        });
    };
    App.ValildateUserAccess = function (data, component, access) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1.log.info(data);
                        if (!data) return [3 /*break*/, 7];
                        if (!(data.name && data.message && data.name.lowercase().indexOf("error") > -1)) return [3 /*break*/, 1];
                        return [2 /*return*/, false];
                    case 1:
                        isValid = false;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, RawQuery_1.RawQuery.CheckUserInfo(data)];
                    case 3:
                        isValid = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        throw error_1;
                    case 5:
                        if (isValid == true) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw { message: "User not releated to this store." };
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, false];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    App.DaysBack = function (date, backValue, isDays) {
        if (isDays === void 0) { isDays = true; }
        date = new Date(date);
        if (isDays) {
            date.setDate(date.getDate() - backValue);
        }
        else {
            date.setMilliseconds(date.getMilliseconds() - backValue);
        }
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        return date;
    };
    App.DaysDiff = function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
        var diff = (t2 - t1) / (24 * 3600 * 1000);
        return parseInt(diff);
    };
    App.PrintLog = function (routerName, routerType, sessionInfo) {
        Log_1.log.info(new Date().toISOString() + " : " + routerName + " :  " + routerType + " : " + JSON.stringify(sessionInfo));
    };
    App.HashSync = function (data) {
        return bcryptjs_1.hashSync(data, 8);
    };
    App.HashCompareSync = function (param1, param2) {
        return bcryptjs_1.compareSync(param1, param2);
    };
    App.ArrayJoin = function (items, attr) {
        var attrs = [];
        console.log(items);
        items.forEach(function (element) {
            attrs.push(element[attr]);
        });
        return attrs.join(",");
    };
    App.SendMail = function (to, subject, htmlPage, renderData) {
        return __awaiter(this, void 0, void 0, function () {
            var transporter, Options;
            return __generator(this, function (_a) {
                transporter = App.CreateEmailAccount();
                Options = {
                    from: Config.mailOptions.user,
                    to: to,
                    subject: subject,
                    html: App.HtmlRender(htmlPage, {
                        data: renderData,
                    }),
                };
                return [2 /*return*/, new Promise(function (reslove, reject) {
                        transporter.sendMail(Options, function (err, info) {
                            console.log(info);
                            if (err) {
                                reject(err);
                            }
                            reslove({
                                message: "Mail sent successfully",
                            });
                        });
                    })];
            });
        });
    };
    App.unflatten = function (arr) {
        var tree = [];
        var mappedArr = {};
        var arrElem;
        var mappedElem;
        // First map the nodes of the array to an object -> create a hash table.
        for (var i = 0, len = arr.length; i < len; i++) {
            arrElem = arr[i];
            mappedArr[arrElem.id] = arrElem;
            mappedArr[arrElem.id]["children"] = [];
        }
        for (var id in mappedArr) {
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
    };
    App.Sleep = function (millseconds) {
        App.SystemSleep(millseconds);
    };
    App.checkInternet = function () {
        return dns
            .lookup("google.com")
            .then(function () { return true; })
            .catch(function () { return false; });
    };
    App.uniqueId = 0;
    App.TOKEN_MESSAGE = "Please enter the token.";
    App.SAVED_SUCCESSFULLY = "Saved Successfully.";
    App.REMOVED_SUCCESSFULLY = "Removed Successfully.";
    App.INVALID_DATA = "Please enter valid data.";
    App.NON_ALPHA_NUMARIC = /[^\w\s]/g;
    App.SystemSleep = require("system-sleep");
    return App;
}());
exports.App = App;
