import { getRepository, Repository } from "typeorm";
import { AccountsTable } from "../../entities/AccountsTable";

export class AccountsTableDAO {
    private dao: Repository<AccountsTable>;

    constructor() {
        this.dao = getRepository(AccountsTable);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("AccountsTable")
            .where(data)
            .andWhere(`AccountsTable.deleted=false or AccountsTable.deleted is NULL`)
            .orderBy("AccountsTable.lastModifiedDate", "DESC")
            .getMany(); 
            
    }

    async save(data: AccountsTable) {
        return await this.dao.save(data);
    }

    async entity(accountNum: string) {
        return await this.dao.findOne(accountNum);
    }

    async delete(data: AccountsTable) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(AccountsTableDAO);
