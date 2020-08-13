import { getRepository, Repository, getManager } from "typeorm";
import { SalesOrderTokens } from "../../entities/SalesOrderTokens";
import { RawQuery } from "../common/RawQuery";

export class SalesOrderTokensDAO {
    private dao: Repository<SalesOrderTokens>;
    private db: any;
    private rawQuery: RawQuery;
    constructor() {
        this.dao = getRepository(SalesOrderTokens);
        this.rawQuery = new RawQuery();
    }

    async save(data: SalesOrderTokens) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }
}

Object.seal(SalesOrderTokensDAO);
