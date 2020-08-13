import { getRepository, Repository } from "typeorm";
import { Userconfig } from "../../entities/Userconfig";

export class UserconfigDAO {
    private dao: Repository<Userconfig>;

    constructor() {
        this.dao = getRepository(Userconfig);
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async save(data: Userconfig) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Userconfig) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(UserconfigDAO);
