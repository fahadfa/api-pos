import { getRepository, Repository } from "typeorm";
import { LedgerTrans } from "../../entities/LedgerTrans";

export class LedgerTransDAO {
    private dao: Repository<LedgerTrans>;

    constructor() {
        this.dao = getRepository(LedgerTrans);
    }

    async search(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("ledgertrans")
            .where(data)
            .getMany();
    }

    async save(data: any) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "ledgertrans",
                innerJoinAndSelect: {}
            }
        });
    }

    async delete(data: LedgerTrans[]) {
        return await this.dao.remove(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data, {
            join: {
                alias: "ledgertrans",
                innerJoinAndSelect: {}
            }
        });
    }
}

Object.seal(LedgerTransDAO);
