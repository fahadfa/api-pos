import { App } from "../../utils/App";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import { Props } from "../../constants/Props";
import { BasesDAO } from "../repos/BasesDAO";

export class SalesLineService {
    public sessionInfo: any;
    private salesLineDAO: SalesLineDAO;
    private basesDAO: BasesDAO;

    constructor() {
        this.salesLineDAO = new SalesLineDAO();
        this.basesDAO = new BasesDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.salesLineDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let data: any = await this.salesLineDAO.mobilesearch(item);
            // for (let item of data) {
            // let product: any = await this.basesDAO.findOne({ code: item.itemid });
            // item.product = product;
            // }
            return data;
        } catch (error) {
            throw error;
        }
    }
}
