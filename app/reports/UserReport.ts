import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { compareSync } from "bcryptjs";
import { App } from "../../utils/App";
export class UserReport {
    public sessionInfo: any;
    private db: any;

    constructor() {
        this.db = getManager();
    }

    async execute(params: any) {
        try {
            console.log(params);
            const query = `select * from salestable 
                          inner join custtable on (custtable.accountnum=salestable.custaccount)
                          inner join salesline on (salesline.salesid=salestable.salesid)
                          where salesid=${params.salesId}`

            let data: any = await this.db.query(query);
            return data;
            return { name: "Testing" };
            // return Promise.resolve(["abcd"]);
        } catch (error) {
            throw error;
        }
    }

    async report(result: any, params: any) {
        let renderData: any ;

        renderData.data = result;
        try {
            return App.HtmlRender("invoice", renderData);
        } catch (error) {
            throw error;
        }
    }
}
