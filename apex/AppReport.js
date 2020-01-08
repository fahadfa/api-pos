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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsreport_core_1 = __importDefault(require("jsreport-core"));
var express_1 = require("express");
var fs = __importStar(require("fs"));
var Log_1 = require("../utils/Log");
var conversion = require("phantom-html-to-pdf")();
var AppReport = /** @class */ (function () {
    function AppReport() {
        this.router = express_1.Router();
        this.service = null;
        this.jsreport = jsreport_core_1.default();
        this.report = null;
        this.reports = fs.readdirSync(__dirname + "/../app/reports");
        Log_1.log.info("AppReport constructor");
        this.jsreport.use(require("jsreport-chrome-pdf")());
        this.jsreport.use(require("jsreport-html-to-xlsx")());
        this.report = this.jsreport.init();
    }
    AppReport.prototype.getRouter = function () {
        var _this = this;
        this.router.get("/:code/:type", function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var params, code, paramsType, type, reqData, resData_1, report, dataFound, _i, _a, action, ns, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        params = request.params;
                        code = params.code;
                        paramsType = request.params;
                        type = paramsType.type;
                        reqData = request.query ? request.query : {};
                        console.log(reqData);
                        resData_1 = null;
                        Log_1.log.info("report: " + code + " --> type: " + type);
                        report = void 0;
                        dataFound = false;
                        _i = 0, _a = this.reports;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        report = _a[_i];
                        report = report.slice(0, -3);
                        if (!(report.toLowerCase() == code + "report")) return [3 /*break*/, 6];
                        dataFound = true;
                        action = "../app/reports/" + report;
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(action)); })];
                    case 2:
                        ns = _b.sent();
                        return [4 /*yield*/, new ns[report]().execute(reqData)];
                    case 3:
                        resData_1 = _b.sent();
                        if (!(type != "data")) return [3 /*break*/, 5];
                        reqData.type = type;
                        return [4 /*yield*/, new ns[report]().report(resData_1, reqData)];
                    case 4:
                        resData_1 = _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7:
                        if (dataFound == true) {
                            if (type == "data") {
                                response.send({ status: 1, data: resData_1 });
                            }
                            else if (type == "pdf") {
                                conversion({
                                    html: resData_1,
                                }, function (err, pdf) {
                                    var output = fs.createWriteStream('output.pdf');
                                    console.log(output.path);
                                    console.log(pdf.numberOfPages);
                                    // since pdf.stream is a node.js stream you can use it
                                    // to save the pdf to a file (like in this example) or to
                                    // respond an http request.
                                    pdf.stream.pipe(output);
                                    fs.readFile('output.pdf', function (err, data) {
                                        // console.log(data);
                                        response.contentType("application/pdf");
                                        response.send(data);
                                    });
                                });
                                // this.report
                                //     .then(() => {
                                //         return this.jsreport
                                //             .render({
                                //                 template: {
                                //                     content: resData,
                                //                     engine: "none",
                                //                     recipe: "chrome-pdf"
                                //                 }
                                //             })
                                //             .then(out => {
                                //                 out.stream.pipe(response);
                                //             })
                                //             .catch(err => {
                                //                 log.error(err);
                                //                 throw err;
                                //             });
                                //     })
                                //     .catch(err => {
                                //         log.error(err);
                                //         throw err;
                                //     });
                            }
                            else if (type == "html") {
                                this.report
                                    .then(function () {
                                    return _this.jsreport
                                        .render({
                                        template: {
                                            content: resData_1,
                                            engine: "none",
                                            recipe: "html"
                                        }
                                    })
                                        .then(function (out) {
                                        out.stream.pipe(response);
                                    })
                                        .catch(function (err) {
                                        Log_1.log.error(err);
                                        throw err;
                                    });
                                })
                                    .catch(function (err) {
                                    Log_1.log.error(err);
                                    throw err;
                                });
                            }
                            else if (type == "excel") {
                                this.report
                                    .then(function () {
                                    return _this.jsreport
                                        .render({
                                        template: {
                                            content: resData_1,
                                            engine: "none",
                                            recipe: "html-to-xlsx"
                                        }
                                    })
                                        .then(function (out) {
                                        response.set({
                                            "Content-Type": "application/vnd.ms-excel",
                                            // instead of report.xlsx you can use any name you want, for example test.xlsx, etc
                                            "Content-Disposition": 'attachment; filename="report.xlsx'
                                        });
                                        out.stream.pipe(response);
                                    })
                                        .catch(function (err) {
                                        Log_1.log.error(err);
                                        throw err;
                                    });
                                })
                                    .catch(function (err) {
                                    Log_1.log.error(err);
                                    throw err;
                                });
                            }
                        }
                        else {
                            throw { message: "No Report Found!!!" };
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        Log_1.log.error(error_1);
                        error_1 = typeof error_1 == "string" ? { message: error_1 } : error_1;
                        response.send({ status: 0, error: error_1 });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        return this.router;
    };
    return AppReport;
}());
exports.AppReport = AppReport;
