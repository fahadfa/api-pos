const pg = require("pg");
const config = require("./Config");
const EventEmitter = require("events");
let pool: any;
pg.types.setTypeParser(1114, (stringValue: any) => {
  return stringValue.replace(" ", "T");
});
let event: any;
export var WatcherInit = () => {
  event = new EventEmitter();
  pool = new pg.Pool({
    connectionString: `postgres://${config.dbOptions.username}:${config.dbOptions.password}@${config.dbOptions.host}:${config.dbOptions.port}/${config.dbOptions.database}`,
  });

  pool.connect((err: any, client: any) => {
    if (err) {
      console.log(err);
    }
    if (client != null) {
      client.on("notification", (msg: any) => {
        dbEmitter(msg.payload);
      });
      client.query("LISTEN notify_table");
    }
  });
};
export var DBEvent = () => {
  return event;
};

var dbEmitter = (payload: any) => {
  console.log("WATCHER", payload);
  let data = JSON.parse(payload);
  DBEvent().emit(data.name, data.record);
};
