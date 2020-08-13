import { getRepository, Repository } from "typeorm";
import { FixedAssetGroup } from "../../entities/FixedAssetGroup";

export class FixedAssetGroupDAO {
    private dao: Repository<FixedAssetGroup>;

    constructor() {
        this.dao = getRepository(FixedAssetGroup);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("FixedAssetGroup")
            .where(data)
            .andWhere(`FixedAssetGroup.deleted=false or FixedAssetGroup.deleted is NULL`)
            .orderBy("FixedAssetGroup.lastModifiedDate", "DESC")
            .getMany();
    }

    async save(data: FixedAssetGroup) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "FixedAssetGroup"
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
                alias: "FixedAssetGroup"
            }
        });
    }
}

Object.seal(FixedAssetGroupDAO);
