import { getRepository, Repository } from "typeorm";
import { Overdue } from "../../entities/Overdue";

export class OverDueDAO {
    private dao: Repository<Overdue>;

    constructor() {
        this.dao = getRepository(Overdue);
    }

    async entity(salesId: string) {
        return await this.dao.findOne(salesId);
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async getCreditUsed(custAccNum: string) {
        return await this.dao
            .createQueryBuilder("overdue")
            .where(`overdue.accountnum = '${custAccNum}' and overdue.payment=0`)
            // .select(["overdue.invoiceamount"])
            .getMany();
    }

    async getOverDueCredit(custAccNum: string) {
        return await this.dao
            .createQueryBuilder("overdue")
            .where(`overdue.accountnum = '${custAccNum}' and overdue.payment=0 and overdue.duedate :: timestamp < now()`)
            // .select(["overdue.invoiceamount"])
            .getMany();
    }

    async createOverDue(overdue: Overdue) {
        return await this.dao.save(overdue);
    }
}

Object.seal(OverDueDAO);
