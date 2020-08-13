import { App } from "../../utils/App";
import { BaseSizes } from "../../entities/BaseSizes";
import { BaseSizesDAO } from "../repos/BaseSizesDAO";
import { RawQuery } from "../common/RawQuery";
import { CusttableDAO } from "../repos/CusttableDAO";

export class BaseSizesService {
    public sessionInfo: any;
    private baseSizesDAO: BaseSizesDAO;
    private rawQuery: RawQuery;
    private custtableDAO: CusttableDAO;

    constructor() {
        this.rawQuery = new RawQuery();
        this.custtableDAO = new CusttableDAO();
        this.baseSizesDAO = new BaseSizesDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.baseSizesDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(params: any) {
        try {
            params.base = { id: params.baseId };
            let data: any = await this.baseSizesDAO.search(params);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getbaseSizes(params: any) {
        try {
            let paramsData = { base: { id: params.baseId } };
            let data: any = await this.baseSizesDAO.search(paramsData);
            for (let size of data) {
                let queryData = params;
                queryData.inventsizeid = size.sizes.code;
                size.price = await this.getPrice(queryData);
                console.log(size.price);
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    async getPrice(reqData: any) {
        try {
            let defaultcustomer: any;
            if (!reqData.pricegroup) {
                this.rawQuery.sessionInfo = this.sessionInfo
                defaultcustomer = await this.rawQuery.getCustomer(this.sessionInfo.defaultcustomerid);
                // console.log(defaultcustomer);
                reqData.pricegroup = defaultcustomer.pricegroup;
                reqData.currency = defaultcustomer.currency;
            }

            let amount: any = [{ amount: 0 }];
            amount = await this.rawQuery.getHighPrice(reqData);
            if (amount.length == 0) {
                amount = await this.rawQuery.getCustomerSpecificPrice(reqData);
            }
            if (amount.length == 0) {
                amount = await this.rawQuery.getNormalPrice(reqData);
            }
            // console.log(amount);
            if (amount.length == 0) {
                try {
                    defaultcustomer = !defaultcustomer ? await this.custtableDAO.entity(this.sessionInfo.defaultcustomerid) : defaultcustomer;
                    // console.log(defaultcustomer);
                    reqData.pricegroup = defaultcustomer.pricegroup;
                    reqData.currency = defaultcustomer.currency;
                    let amount: any = [];
                    // amount: any = await this.rawQuery.getHighPrice(queryData);
                    if (amount.length == 0) {
                        amount = await this.rawQuery.getCustomerSpecificPrice(reqData);
                        console.log(amount);
                    }
                    if (amount.length == 0) {
                        amount = await this.rawQuery.getNormalPrice(reqData);
                        console.log(amount);
                    }
                    if (amount.length == 0) {
                        return { amount: 0 };
                    } else {
                        console.log(amount);
                        amount[0].amount = Math.ceil(amount[0].amount);
                        return amount[0];
                    }
                } catch {
                    return { amount: 0 };
                }
            } else {
                // console.log(amount);
                amount[0].amount = Math.ceil(amount[0].amount);
                return amount[0];
            }
        } catch (error) {
            throw error;
        }
    }
}
