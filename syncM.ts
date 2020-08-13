import { ulog as log } from "./utils/Log";
import { SyncService } from "./sync/SyncService";
import { getItem, setItem } from "./utils/Store";

var CallSync = () => {
  let syncService;
  try {
    syncService = new SyncService("M");
  } catch (err) {
    log.error("SyncService M Error: ");
    log.error(err);
  }
};
CallSync();
