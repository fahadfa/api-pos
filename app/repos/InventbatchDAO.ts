import { getRepository, Repository } from "typeorm";
import { Inventbatch } from "../../entities/Inventbatch";

export class InventbatchDAO {
    private dao: Repository<Inventbatch>;

    constructor() {
        this.dao = getRepository(Inventbatch);
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async save(data: Inventbatch) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Inventbatch) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(InventbatchDAO);
