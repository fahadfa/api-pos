"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var Config_1 = require("./Config");
exports.log = winston_1.createLogger({
    exitOnError: false,
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DDTHH:mm:ss"
    }), winston_1.format.simple()),
    transports: [new winston_1.transports.File(Config_1.logOptions.file), new winston_1.transports.Console(Config_1.logOptions.console)]
});
exports.slog = winston_1.createLogger({
    exitOnError: false,
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DDTHH:mm:ss"
    }), winston_1.format.simple()),
    transports: [new winston_1.transports.File(Config_1.logSyncOptions.file), new winston_1.transports.Console(Config_1.logSyncOptions.console)]
});
exports.ulog = winston_1.createLogger({
    exitOnError: false,
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DDTHH:mm:ss"
    }), winston_1.format.simple()),
    transports: [new winston_1.transports.File(Config_1.logUpdateOptions.file), new winston_1.transports.Console(Config_1.logUpdateOptions.console)]
});
// export const log = require("log4js");
// export const slog = require("log4js");
// export const ulog = require("log4js");
// log.configure({
//   appenders: [{ type: "file", filename: __dirname + "/../../logs/jpos.log", maxLogSize: 20480, backups: 10 }]
// });
// slog.configure({
//   appenders: [{ type: "file", filename: __dirname + "/../../logs/jpos.log", maxLogSize: 20480, backups: 10 }]
// });
// ulog.configure({
//   appenders: [{ type: "file", filename: __dirname + "/../../logs/jpos.log", maxLogSize: 20480, backups: 10 }]
// });
// import* as log4js from "log4js";
// log4js.loadAppender("file");
// log4js.addAppender(log4js.appenders.file(__dirname + "/../../logs/jpos.log"), "log");
// log4js.addAppender(log4js.appenders.file(__dirname + "/../../logs/sync.log"), "slog");
// log4js.addAppender(log4js.appenders.file(__dirname + "/../../logs/update.log"), "ulog");
// export const log = log4js.getLogger("log");
// export const slog = log4js.getLogger("slog");
// export const ulog = log4js.getLogger("ulog");
// import { configure, getLogger } from "log4js";
// configure({
//   appenders: {
//     app: {
//       type: "file",
//       filename: __dirname + "/../../logs/jpos.log",
//       maxLogSize: 10485760,
//       backups: 100
//     },
//     out: { type: "stdout", layout: { type: "coloured" } }
//   },
//   categories: { default: { appenders: ["app", "out"], level: "all" } }
// });
// export const log = getLogger("app");
// export const slog = getLogger("sync");
// export const ulog = getLogger("update");
