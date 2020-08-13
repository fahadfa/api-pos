import { App } from "../../utils/App";
import { Products } from "../../entities/Products";
import { ProductsDAO } from "../repos/ProductsDAO";
import { Props } from "../../constants/Props";

export class ProductsService {
    public sessionInfo: any;
    private productsDAO: ProductsDAO;

    constructor() {
        this.productsDAO = new ProductsDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.productsDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(reqData: any) {
        try {
            let data: any = await this.productsDAO.search(reqData);
            return data;
        } catch (error) {
            throw error;
        }
    }
}
