import { getRepository, Repository } from "typeorm";
import { BankAccountTable } from "../../entities/BankAccountTable";

export class BankAccountTableDAO {
    private dao: Repository<BankAccountTable>;

    constructor() {
        this.dao = getRepository(BankAccountTable);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("BankAccountTable")
            .where(data)
            .getMany();
    }

    async save(data: BankAccountTable) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: BankAccountTable) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(BankAccountTableDAO);
