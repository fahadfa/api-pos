import { getManager, Any } from "typeorm";

export class DashboardService {
    public sessionInfo: any;
    private db: any;

    constructor() {
        this.db = getManager();
    }
}
