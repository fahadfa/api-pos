import { getRepository, Repository } from "typeorm";
import { BaseSizes } from "../../entities/BaseSizes";

export class BaseSizesDAO {
    private dao: Repository<BaseSizes>;

    constructor() {
        this.dao = getRepository(BaseSizes);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("baseSizes")
            .innerJoin("baseSizes.sizes", "sizes")
            .innerJoin("baseSizes.base", "base")
            .addSelect(["sizes.id", "sizes.nameEn", "sizes.nameAr", "sizes.code", "base.code"])
            .where(data)
            .getMany();
    }

    async save(data: BaseSizes) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao
            .createQueryBuilder("baseSizes")
            .innerJoin("baseSizes.sizes", "sizes")
            .addSelect(["sizes.id", "sizes.nameEn", "sizes.nameAr", "sizes.code"])
            .addSelect("base.code")
            .where({ id: id })
            .getOne();
    }

    async findOne(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("baseSizes")
            .innerJoinAndSelect("baseSizes.sizes", "sizes")
            .innerJoinAndSelect("baseSizes.bases", "bases")
            .where(data)
            .getOne();
    }

    async findOneforaxaptadata(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("baseSizes")
            .innerJoinAndSelect("baseSizes.sizes", "sizes")
            .innerJoinAndSelect("baseSizes.base", "base")
            .where({})
            .andWhere(`base.code = '${data.base.code}' and sizes.code= '${data.sizes.code}'`)
            .getOne();
    }
}

Object.seal(BaseSizesDAO);
