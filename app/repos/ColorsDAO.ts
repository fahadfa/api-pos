import { getRepository, Repository } from "typeorm";
import { Colors } from "../../entities/Colors";

export class ColorsDAO {
    private dao: Repository<Colors>;

    constructor() {
        this.dao = getRepository(Colors);
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async save(data: Colors[]) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Colors) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(ColorsDAO);
