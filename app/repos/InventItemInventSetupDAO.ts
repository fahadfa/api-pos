import { Repository, getRepository } from "typeorm";
import { InventItemInventSetup } from "../../entities/InventItemInventSetup";


export class InventItemInventSetupDAO{
    private dao: Repository<InventItemInventSetup>;

    constructor() {
        this.dao = getRepository(InventItemInventSetup);
    }

    async save(data: InventItemInventSetup) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: InventItemInventSetup) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne({
            where:data
        });            
    }

    async find(data: any) {
        return await this.dao.find({
            where:data
        });            
    }
}