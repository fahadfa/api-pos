import { App } from "../../utils/App";
import { Bases } from "../../entities/Bases";
import { BasesDAO } from "../repos/BasesDAO";
import { getManager } from "typeorm";
import { CacheService } from "../common/CacheService";
import { RawQuery } from "../common/RawQuery";

export class BasesService {
    public sessionInfo: any;
    private basesDAO: BasesDAO;
    private db: any;
    private cacheService: CacheService;
    private rawQuery: RawQuery;

    constructor() {
        this.basesDAO = new BasesDAO();
        this.cacheService = new CacheService();
        this.db = getManager();
        this.rawQuery = new RawQuery();
    }

    async entity(id: string) {
        try {
            let data: any = await this.basesDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(params: any) {
        try {
            console.log(params);
            var t0 = new Date().getTime();
            // let data: any = await this.cacheService.cache("bases");
            // data.filter((item: any) => item.products.dataareaid == params.dataareaid);
            let items = await this.rawQuery.getProductIds(params.dataareaid);
            let data: any;
            if (items.length > 0) {
                data = await this.basesDAO.search(params.dataareaid, items);
            } else {
                data = [];
            }

            // console.log(data.length);
            var t1 = new Date().getTime();
            console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
            return data;
        } catch (error) {
            throw error;
        }
    }

    async searchSalesOrderProducts(params: any) {
        try {
            // console.log(params);
            var t0 = new Date().getTime();
            let Items: any = await this.rawQuery.getStockInHandArray(this.sessionInfo.inventlocationid);
            // console.log(Items);
            let data = await this.basesDAO.search(params.dataareaid, Items);
            console.log(data.length);
            var t1 = new Date().getTime();
            console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
            return data;
        } catch (error) {
            throw error;
        }
    }
}
