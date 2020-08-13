import { getRepository, Repository } from "typeorm";
import { LedgerJournalTrans } from "../../entities/LedgerJournalTrans";

export class LedgerJournalTransDAO {
    private dao: Repository<LedgerJournalTrans>;

    constructor() {
        this.dao = getRepository(LedgerJournalTrans);
    }

    async search(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("LedgerJournalTrans")
            .where(data)
            .getMany();
    }

    async findAll(data: any) {
        return await this.dao.find(data);
    }

    async save(data: LedgerJournalTrans[]) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: LedgerJournalTrans[]) {
        return await this.dao.remove(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(LedgerJournalTransDAO);
