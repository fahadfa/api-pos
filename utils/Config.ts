import "reflect-metadata";

export let dbOptions: any = {
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Mpos1234",
  database: "mpos_db",
  logging: true,
  synchronize: false,
  entities: [__dirname + "/../entities/**/*{.ts,.js}"],
};

// ============MS SQL CONNECTION=============

export let mssqlDbOptions = {
  username: "sysoffline",
  password: "binjzrpos",
  host: "localhost",
  database: "DAX",
  port: 1433,
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

export let stageDbOptions: any = {
  name: "stage",
  type: "postgres",
  host: "jpos.cw34ebrphxxg.eu-central-1.rds.amazonaws.com",
  port: 5432,
  username: "jpos",
  password: "Mpfrdsjposdb",
  database: "jpos_qa",
};

export let localDbOptions: any = {
  name: "local",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Mpos1234",
  database: "mpos_db",
  logging: true,
  synchronize: false,
  entities: [__dirname + "/../entities/**/*{.ts,.js}"],
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

export let mailOptions: any = {
  host: "smtp.gmail.com",
  port: 465,
  user: "jpos@jazeerapaints.com",
  pass: "J2123@2123",
};

export let setEnvConfig = () => {
  let envData: any = process.env.ENV_JPOS;
  console.log(envData);
  if (envData) {
    envData = JSON.parse(envData);
    if (envData.dbHost) {
      dbOptions.host = envData.dbHost;
      dbOptions.port = envData.dbPort;
      dbOptions.username = envData.dbUser;
      dbOptions.password = envData.dbPassword;
      dbOptions.database = envData.dbDatabase;
    }

    if (envData.mailHost) {
      mailOptions.host = envData.mailHost;
      mailOptions.port = envData.mailPort;
      mailOptions.user = envData.mailUser;
      mailOptions.pass = envData.mailPassword;
    }
  }
  console.log(envData);
};
