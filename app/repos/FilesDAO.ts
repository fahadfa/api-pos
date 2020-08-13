import { getRepository, Repository } from "typeorm";
import { Files } from "../../entities/Files";

export class FilesDAO {
    private dao: Repository<Files>;

    constructor() {
        this.dao = getRepository(Files);
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async save(data: Files) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Files) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(FilesDAO);
