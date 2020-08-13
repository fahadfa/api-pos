import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
export class ExcelReport {
    public sessionInfo: any;
    private db: any;
    private salesTableService: SalesTableService;
    constructor() {
        this.db = getManager();
        this.salesTableService = new SalesTableService();
    }

    async execute(params: any) {
        try {
            let data: any = {};
            return data;
        } catch (error) {
            throw error;
        }
    }

    async report(result: any, params: any) {
        let renderData: any;
        // console.log(result.salesLine[0].product.nameEnglish);
        renderData = result;
        console.log(params.lang);
        let file = "exampleexcel";
        try {
            return App.HtmlRender(file, renderData);
        } catch (error) {
            throw error;
        }
    }
}
