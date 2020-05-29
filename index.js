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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var AppExpress_1 = __importDefault(require("./apex/AppExpress"));
var typeorm_1 = require("typeorm");
var Config = __importStar(require("./utils/Config"));
var Log_1 = require("./utils/Log");
//import { main } from "./sync";
var http = require("http");
var Store_1 = require("./utils/Store");
var port = 5000;
var ENV_STORE_ID = process.env ? process.env.ENV_STORE_ID : null;
var count = 0;
Config.setEnvConfig();
var conn = null;
var run = function () { return __awaiter(_this, void 0, void 0, function () {
    var appExpress, express, httpServer, error_1;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                Log_1.log.log(Config.dbOptions);
                if (!(!conn || !conn.isConnected)) return [3 /*break*/, 2];
                return [4 /*yield*/, typeorm_1.createConnection(Config.dbOptions)];
            case 1:
                conn = _a.sent();
                _a.label = 2;
            case 2:
                Log_1.log.debug(" ************************************** " + conn.isConnected);
                if (conn && conn.isConnected) {
                    appExpress = new AppExpress_1.default();
                    express = appExpress.express;
                    httpServer = http.Server(express);
                    // const io = require("socket.io")(httpServer);
                    // io.on("connection", function(socket: any) {
                    //   console.log("Client connected!");
                    //   socket.on("message", function(data: any) {
                    //     console.log("Sending update!");
                    //     socket.emit("update", "Working!");
                    //   });
                    // });
                    express.use("/api", function (req, res, next) {
                        if (ENV_STORE_ID) {
                            var diff = syncTimeDiff();
                            Log_1.log.warn("sync Time Diff:", diff);
                            if (diff > 3) {
                                Log_1.log.error("----->: sync time start : " + diff);
                                sync();
                            }
                        }
                        next();
                    });
                    httpServer.listen(port, function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (err) {
                                Log_1.log.error(err);
                                throw err;
                            }
                            return [2 /*return*/, Log_1.log.log("info", "\n                    ***********************************************\n                            server is listening on " + port + "\n                    ***********************************************\n          ")];
                        });
                    }); });
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                Log_1.log.error(error_1);
                setTimeout(function () {
                    if (count <= 5) {
                        count += 1;
                        Log_1.log.error("================ " + count);
                        run();
                    }
                    else {
                        Log_1.log.error(error_1);
                    }
                }, 5000);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
run();
var sync = function () {
    var child_process = require("child_process");
    var fs = require("fs");
    var syncFileUpdate = __dirname + "/update.ts";
    syncFileUpdate = fs.existsSync(syncFileUpdate) ? __dirname + "/update.ts" : __dirname + "/update.js";
    child_process.fork(syncFileUpdate);
    Log_1.log.warn("syncFileUpdate:", syncFileUpdate);
    var syncMFile = __dirname + "/syncM.ts";
    syncMFile = fs.existsSync(syncMFile) ? __dirname + "/syncM.ts" : __dirname + "/syncM.js";
    child_process.fork(syncMFile);
    Log_1.log.warn("syncMFile:", syncMFile);
    var syncTFile = __dirname + "/syncT.ts";
    syncTFile = fs.existsSync(syncTFile) ? __dirname + "/syncT.ts" : __dirname + "/syncT.js";
    child_process.fork(syncTFile);
    Log_1.log.warn("syncTFile:", syncTFile);
    var sync1File = __dirname + "/sync1.ts";
    sync1File = fs.existsSync(sync1File) ? __dirname + "/sync1.ts" : __dirname + "/sync1.js";
    child_process.fork(sync1File);
    Log_1.log.warn("syncFile:", sync1File);
};
var syncTimeDiff = function () {
    try {
        var lastSyncDate = Store_1.getItem("syncdate", "index -> cron");
        Log_1.log.warn("Last sync time: ", lastSyncDate);
        lastSyncDate = new Date(lastSyncDate);
        var diff = (new Date().getTime() - lastSyncDate.getTime()) / 60000;
        return diff;
    }
    catch (error) {
        Log_1.log.error(error);
        Store_1.StoreInIt();
        return 0;
    }
};
try {
    if (ENV_STORE_ID) {
        var lastSyncDate = null;
        var diff = null;
        Store_1.StoreInIt();
        sync();
    }
}
catch (error) {
    Log_1.log.error("Sync Error");
    Log_1.log.error(error);
}
process.on("uncaughtException", function (err) {
    Log_1.log.error("Caught exception: " + err);
    setTimeout(function () {
        if (count <= 5) {
            count += 1;
            Log_1.log.error("================ " + count);
            run();
        }
        else {
            Log_1.log.error(err);
        }
    }, 5000);
});
