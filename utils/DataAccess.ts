import { createConnection } from "typeorm";
import { log } from "./Log";
class DataAccess {
    constructor() {
        DataAccess.connect();
    }

    static connect(): any {
        createConnection().then(async connection => {
            log.debug("connection created successfully");
        });
    }
}

DataAccess.connect();
export { DataAccess };
