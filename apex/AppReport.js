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
            var params, code, paramsType, type, reqData, resData_1, report, dataFound, _i, _a, action, ns, _b, out, error_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 16, , 17]);
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
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        report = _a[_i];
                        report = report.slice(0, -3);
                        if (!(report.toLowerCase() == code + "report")) return [3 /*break*/, 7];
                        dataFound = true;
                        action = "../app/reports/" + report;
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require(action)); })];
                    case 2:
                        ns = _c.sent();
                        reqData.session = request.body.sessionInfo;
                        _b = this;
                        return [4 /*yield*/, new ns[report]()];
                    case 3:
                        _b.service = _c.sent();
                        this.service.sessionInfo = request.body.sessionInfo;
                        return [4 /*yield*/, this.service.execute(reqData)];
                    case 4:
                        resData_1 = _c.sent();
                        if (!(type != "data")) return [3 /*break*/, 6];
                        reqData.type = type;
                        return [4 /*yield*/, this.service.report(resData_1, reqData)];
                    case 5:
                        resData_1 = _c.sent();
                        _c.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8:
                        if (!(dataFound == true)) return [3 /*break*/, 14];
                        if (!(type == "data")) return [3 /*break*/, 9];
                        response.send({ status: 1, data: resData_1 });
                        return [3 /*break*/, 13];
                    case 9:
                        if (!(type == "html")) return [3 /*break*/, 10];
                        this.report
                            .then(function () {
                            return _this.jsreport
                                .render({
                                template: {
                                    content: resData_1,
                                    engine: "none",
                                    recipe: "html",
                                },
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
                        return [3 /*break*/, 13];
                    case 10:
                        if (!(type == "excel")) return [3 /*break*/, 11];
                        this.report
                            .then(function () {
                            return _this.jsreport
                                .render({
                                template: {
                                    content: resData_1,
                                    engine: "none",
                                    recipe: "html-to-xlsx",
                                },
                            })
                                .then(function (out) {
                                response.set({
                                    "Content-Type": "application/vnd.ms-excel",
                                    // instead of report.xlsx you can use any name you want, for example test.xlsx, etc
                                    "Content-Disposition": 'attachment; filename="report.xlsx',
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
                        return [3 /*break*/, 13];
                    case 11:
                        if (!(type == "pdf")) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.report
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var out;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.jsreport.render({
                                                template: {
                                                    content: resData_1,
                                                    engine: "none",
                                                    recipe: "chrome-pdf",
                                                },
                                            })];
                                        case 1:
                                            out = _a.sent();
                                            return [2 /*return*/, out];
                                    }
                                });
                            }); })
                                .catch(function (err) {
                                Log_1.log.error(err);
                                throw err;
                            })];
                    case 12:
                        out = _c.sent();
                        response.set({
                            "content-Type": "application/pdf",
                        });
                        // return out.content;
                        // console.log(out.content)
                        response.send(out.content);
                        _c.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14: throw { message: "No Report Found!!!" };
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        error_1 = _c.sent();
                        Log_1.log.error(error_1);
                        error_1 = typeof error_1 == "string" ? { message: error_1 } : error_1;
                        response.send({ status: 0, error: error_1 });
                        return [3 /*break*/, 17];
                    case 17: return [2 /*return*/];
                }
            });
        }); });
        return this.router;
    };
    return AppReport;
}());
exports.AppReport = AppReport;
