import { getRepository, Repository } from "typeorm";
import { SyncTable } from "../../entities/SyncTable";

export class SyncTableRepository {
    private dao: Repository<SyncTable>;

    constructor() {
        this.dao = getRepository(SyncTable);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("syncTable")
            .innerJoinAndSelect("syncTable.source", "source")
            .innerJoinAndSelect("syncTable.target", "target")
            .where(data)
            .getMany();
    }

    async save(data: SyncTable) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "syncTable",
                innerJoinAndSelect: {
                    source: "syncTable.source",
                    target: "syncTable.target"
                }
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
                alias: "syncTable",
                innerJoinAndSelect: {
                    source: "syncTable.source",
                    target: "syncTable.target"
                }
            },
            order: {
                updatedOn: "ASC"
            }
        });
    }
}

Object.seal(SyncTableRepository);
