import { getRepository, Repository } from "typeorm";
import { SyncSource } from "../../entities/SyncSource";

export class SyncSourceRepository {
    private dao: Repository<SyncSource>;

    constructor() {
        this.dao = getRepository(SyncSource);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("syncSource")
            .where(data)
            .getMany();
    }

    async save(data: SyncSource) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "syncSource",
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
                alias: "syncSource",
                innerJoinAndSelect: {}
            }
        });
    }
}

Object.seal(SyncSourceRepository);
