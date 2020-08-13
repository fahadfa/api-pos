import { getRepository, Repository } from "typeorm";
import { AppliedDiscounts } from "../../entities/AppliedDiscounts";

export class AppliedDiscountsDAO {
    private dao: Repository<AppliedDiscounts>;

    constructor() {
        this.dao = getRepository(AppliedDiscounts);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("AppliedDiscounts")
            .where(data)
            .getMany();
    }

    async save(data: AppliedDiscounts[]) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: AppliedDiscounts[]) {
        return await this.dao.remove(data);
    }
    async findAll(data: any) {
        return await this.dao.find(data);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("AppliedDiscounts")
            .where(data)
            .getOne();
    }
}

Object.seal(AppliedDiscountsDAO);
