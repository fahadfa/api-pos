import { getRepository, Repository, getManager } from "typeorm";
import { Pricedisctable } from "../../entities/Pricedisctable";

export class PricedisctableDAO {
    private dao: Repository<Pricedisctable>;
    private db: any;

    constructor() {
        this.dao = getRepository(Pricedisctable);
        this.db = getManager();
    }

    async search(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("pricedisctable")
            .where(data)
            .getMany();
    }

    async findAll(data: any) {
        return await this.dao.find(data);
    }
    async save(data: Pricedisctable) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Pricedisctable[]) {
        return await this.dao.remove(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}
Object.seal(PricedisctableDAO);
