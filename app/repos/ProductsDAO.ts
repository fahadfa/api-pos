import { getRepository, Repository } from "typeorm";
import { Products } from "../../entities/Products";

export class ProductsDAO {
    private dao: Repository<Products>;

    constructor() {
        this.dao = getRepository(Products);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("products")
            .innerJoinAndSelect("products.canImages", "canImages")
            .where(data)
            .getMany();
    }

    async save(data: Products) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Products) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
}

Object.seal(ProductsDAO);
