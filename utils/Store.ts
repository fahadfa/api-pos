import { openSync, closeSync, readFileSync, writeFileSync, existsSync } from "fs";
var file = __dirname + "/../assets/store.json";

export var StoreInIt = () => {
  console.log("StoreInIt: " + file);
  let isExist = existsSync(file) && readFile() != "{}";

  if (!isExist) {
    closeSync(openSync(file, "w"));
    writeFile(JSON.stringify({ syncdate: "1900-01-01T01:01:01" }));
  }
};
//main();

export var writeFile = (data: any) => {
  if (data) {
    writeFileSync(file, data, "utf8");
  }
};
export var readFile = () => {
  let data = readFileSync(file, "utf8");
  if (data && data.trim() != "" && data.includes("T")) {
    return data;
  } else {
    return "{}";
  }
};

export var getItem = (key: string, source?: string) => {
  console.log("store.getItem", key, source);
  if (key) {
    let data: any = readFile();
    return JSON.parse(data)[key];
  } else {
    return { syncdate: "1900-01-01T01:01:01" };
  }
};

export var setItem = (key: string, value: string, source?: string) => {
  if (key) {
    console.log("store.setItem", key, value, source);
    let data: any = readFile();
    if (data) data = JSON.parse(data);
    if (value && value.trim() != "") {
      data[key] = value;
      data = JSON.stringify(data);
      writeFile(data);
    }
  }
};
