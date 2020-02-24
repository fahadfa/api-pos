"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var file = __dirname + "/../assets/store.json";
exports.StoreInIt = function () {
    console.log("StoreInIt: " + file);
    var isExist = fs_1.existsSync(file) && exports.readFile() != "";
    if (!isExist) {
        fs_1.closeSync(fs_1.openSync(file, "w"));
        exports.writeFile(JSON.stringify({ syncdate: "1900-01-01T00:00:00" }));
    }
};
//main();
exports.writeFile = function (data) {
    fs_1.writeFileSync(file, data, "utf8");
};
exports.readFile = function () {
    return fs_1.readFileSync(file, "utf8");
};
exports.getItem = function (key) {
    var data = exports.readFile();
    return JSON.parse(data)[key];
};
exports.setItem = function (key, value) {
    var data = exports.readFile();
    data = JSON.parse(data);
    data[key] = value;
    data = JSON.stringify(data);
    exports.writeFile(data);
};
