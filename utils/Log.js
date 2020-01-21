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
