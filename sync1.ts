import { ulog as log } from "./utils/Log";
import { SyncService } from "./sync/SyncService";
import { getItem, setItem } from "./utils/Store";

var CallSync = () => {
  let syncService;
  try {
    syncService = new SyncService("1");
  } catch (err) {
    log.error("SyncService 1 Error: ");
    log.error(err);
  }
};
CallSync();
