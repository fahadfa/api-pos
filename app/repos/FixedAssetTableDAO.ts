import { getRepository, Repository } from "typeorm";
import { FixedAssetTable } from "../../entities/FixedAssetTable";

export class FixedAssetTableDAO {
    private dao: Repository<FixedAssetTable>;

    constructor() {
        this.dao = getRepository(FixedAssetTable);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("FixedAssetTable")
            .leftJoin("FixedAssetTable.fixedAssetGroup", "fixedAssetGroup")
            .addSelect("fixedAssetGroup.name")
            .addSelect("fixedAssetGroup.nameAlias")
            .where(data)
            .andWhere(`FixedAssetTable.deleted=false or FixedAssetTable.deleted is NULL`)
            .orderBy("FixedAssetTable.lastModifiedDate", "DESC")
            .getMany();
    }

    async save(data: FixedAssetTable) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "FixedAssetTable",
                innerJoinAndSelect: {
                    fixedAssetGroup: "FixedAssetTable.fixedAssetGroup"
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
                alias: "FixedAssetTable",
                innerJoinAndSelect: {
                    fixedAssetGroup: "FixedAssetTable.fixedAssetGroup"
                }
            }
        });
    }
}

Object.seal(FixedAssetTableDAO);
