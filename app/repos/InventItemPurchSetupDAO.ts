import { InventItemPurchSetup } from "../../entities/InventItemPurchSetup";
import { Repository, getRepository } from "typeorm";

export class InventItemPurchSetupDAO{
    private dao: Repository<InventItemPurchSetup>;

    constructor() {
        this.dao = getRepository(InventItemPurchSetup);
    }

    async save(data: InventItemPurchSetup) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: InventItemPurchSetup) {
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