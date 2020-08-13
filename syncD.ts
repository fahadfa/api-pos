import { ulog as log } from "./utils/Log";
import { SyncService } from "./sync/SyncService";
import { getItem, setItem } from "./utils/Store";

var CallSync = () => {
  let syncService;
  try {
    syncService = new SyncService("D");
  } catch (err) {
    log.error("SyncService D Error: ");
    log.error(err);
  }
};
CallSync();
