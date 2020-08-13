import { getRepository, Repository } from "typeorm";
import { FiscalYearClose } from "../../entities/FiscalYearClose";

export class FiscalYearCloseDAO {
    private dao: Repository<FiscalYearClose>;

    constructor() {
        this.dao = getRepository(FiscalYearClose);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("FiscalYearClose")
            .where(data)
            .orderBy("FiscalYearClose.lastModifiedDate", "DESC")
            .getMany();
    }

    async save(data: FiscalYearClose) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "FiscalYearClose",
                innerJoinAndSelect: {}
            }
        });
    }

    async delete(data: any) {
        data.active = !data.active;
        return await this.dao.save(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data, {
            join: {
                alias: "FiscalYearClose",
                innerJoinAndSelect: {}
            }
        });
    }
}

Object.seal(FiscalYearCloseDAO);
