import { getRepository, Repository } from "typeorm";
import { Inventlocation } from "../../entities/Inventlocation";

export class InventlocationDAO {
    private dao: Repository<Inventlocation>;

    constructor() {
        this.dao = getRepository(Inventlocation);
    }

    async save(data: Inventlocation) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Inventlocation) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("Inventlocation")
            .where(data)
            .getOne();
    }
}

Object.seal(InventlocationDAO);
