"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Log_1 = require("./utils/Log");
var sysService_1 = require("./sysService");
var cron = require("node-cron");
var healthCount = 0;
var healthCheck = function () {
    var https = require("http");
    var options = {
        hostname: "localhost",
        port: 5000,
        path: "/",
        method: "GET",
    };
    var req = https.request(options, function (res) {
        console.log("statusCode: " + res.statusCode);
        res.on("data", function (d) {
            Log_1.hlog.debug("health check data");
            Log_1.hlog.debug(d);
            process.stdout.write(d);
        });
    });
    req.on("error", function (error) {
        Log_1.hlog.error("health check error");
        Log_1.hlog.error(error);
        if (healthCount > 2) {
            Log_1.hlog.error("system restarting ");
            sysService_1.SysService.ResetService();
        }
    });
    req.end();
    healthCount = healthCount + 1;
};
cron.schedule("* * * * *", function () {
    try {
        healthCheck();
    }
    catch (error) {
        Log_1.hlog.error(error);
        Log_1.hlog.error("******* Error on Health Check **********");
    }
});
