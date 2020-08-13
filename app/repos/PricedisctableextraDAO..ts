import { getRepository, Repository, getManager } from "typeorm";
import { Pricedisctableextra } from "../../entities/Pricedisctableextra";

export class PricedisctableextraDAO {
    private dao: Repository<Pricedisctableextra>;
    private db: any;

    constructor() {
        this.dao = getRepository(Pricedisctableextra);
        this.db = getManager();
    }

    async search(data: any) {
        console.log(data);
        return await this.dao
            .createQueryBuilder("pricdisctableextra")
            .where(data)
            .getMany();
    }

    async findAll(data: any) {
        return await this.dao.find(data);
    }
    async save(data: Pricedisctableextra) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Pricedisctableextra[]) {
        return await this.dao.remove(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(PricedisctableextraDAO);
