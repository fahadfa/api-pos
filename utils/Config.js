"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.dbOptions = {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Mpos1234",
    database: "mpos_db",
    logging: true,
    synchronize: false,
    entities: [__dirname + "/../entities/**/*{.ts,.js}"]
};
// ============MS SQL CONNECTION=============
exports.mssqlDbOptions = {
    username: "sysoffline",
    password: "binjzrpos",
    host: "localhost",
    database: "DAX",
    port: 1433
};
//============== QA DATABASE ================
// export let dbOptions: any = {
//     name: "default",
//     type: "postgres",
//     host: "qa-jazsales.cuy19ulnh0kz.us-east-1.rds.amazonaws.com",
//     port: 5432,
//     username: "jazsales",
//     password: "Evoke1234",
//     database: "jazsalesqa",
//     logging: true,
//     synchronize: false,
//     entities: [__dirname + "/../entities/**/*{.ts,.js}"]
// };
// host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "Mpos1234",
//   database: "mpos_db",
// export let dbOptions: any = {
//   name: "default",
//   type: "postgres",
//   host: "database-1.cw34ebrphxxg.eu-central-1.rds.amazonaws.com",
//   port: 5432,
//   username: "qa_db",
//   password: "jazeera#1234",
//   database: "mpos_qa_db",
//   logging: true,
//   synchronize: false,
//   entities: [__dirname + "/../entities/**/*{.ts,.js}"]
// };
exports.stageDbOptions = {
    name: "stage",
    type: "postgres",
    host: "jpos.cw34ebrphxxg.eu-central-1.rds.amazonaws.com",
    port: 5432,
    username: "jpos",
    password: "Mpfrdsjposdb",
    database: "jpos_qa"
};
exports.localDbOptions = {
    name: "local",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Mpos1234",
    database: "mpos_db",
    logging: true,
    synchronize: false,
    entities: [__dirname + "/../entities/**/*{.ts,.js}"]
};
//============ PRE PROD_DB DATABASE ==========
// export let dbOptions: any = {
//     name: "default",
//     type: "postgres",
//     host: "database-1.cw34ebrphxxg.eu-central-1.rds.amazonaws.com",
//     port: 5432,
//     username: "mpos_pre_prod_user",
//     password: "jazeera@1234",
//     database: "mpos_pre_prod_db",
//     logging: true,
//     synchronize: false,
//     entities: [__dirname + "/../entities/**/*{.ts,.js}"]
// };
//======= PREPROD FOR KEY USERS DATABASE ======
// export let dbOptions: any = {
//     name: "default",
//     type: "postgres",
//     host: "mposdb-preprod.cw34ebrphxxg.eu-central-1.rds.amazonaws.com",
//     port: 5432,
//     username: "mposdb",
//     password: "mdbmpfpp",
//     database: "mpos_preprod",
//     logging: true,
//     synchronize: false,
//     entities: [__dirname + "/../entities/**/*{.ts,.js}"]
// };
exports.mailOptions = {
    host: "smtp.gmail.com",
    port: 465,
    user: "jpos@jazeerapaints.com",
    pass: "12345678"
};
exports.setEnvConfig = function () {
    var envData = process.env.ENV_JPOS;
    console.log(envData);
    if (envData) {
        envData = JSON.parse(envData);
        if (envData.dbHost) {
            exports.dbOptions.host = envData.dbHost;
            exports.dbOptions.port = envData.dbPort;
            exports.dbOptions.username = envData.dbUser;
            exports.dbOptions.password = envData.dbPassword;
            exports.dbOptions.database = envData.dbDatabase;
        }
        if (envData.mailHost) {
            exports.mailOptions.host = envData.mailHost;
            exports.mailOptions.port = envData.mailPort;
            exports.mailOptions.user = envData.mailUser;
            exports.mailOptions.pass = envData.mailPassword;
        }
    }
    console.log(envData);
};
