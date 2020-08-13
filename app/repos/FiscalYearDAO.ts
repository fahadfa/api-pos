import { getRepository, Repository } from "typeorm";
import { FiscalYear } from "../../entities/FiscalYear";

export class FiscalYearDAO {
    private dao: Repository<FiscalYear>;

    constructor() {
        this.dao = getRepository(FiscalYear);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("FiscalYear")
            .where(data)
            .orderBy("FiscalYear.startDate", "ASC")
            .getMany();
    }

    async save(data: FiscalYear[]) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "FiscalYear",
                innerJoinAndSelect: {}
            }
        });
    }

    async delete(data: any) {
        data.active = !data.active;
        return await this.dao.save(data);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("FiscalYear")
            .where(data)
            .getOne();
    }
}

Object.seal(FiscalYearDAO);
