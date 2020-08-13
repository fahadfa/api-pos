import { getRepository, Repository, getManager } from "typeorm";
import { Bases } from "../../entities/Bases";
import { RawQuery } from "../common/RawQuery";

export class BasesDAO {
    private dao: Repository<Bases>;
    private db: any;
    private rawQuery: RawQuery;
    constructor() {
        this.dao = getRepository(Bases);
        this.rawQuery = new RawQuery();
    }

    async search(param: any, items: any[]) {
        // let items = await this.rawQuery.getProductIds(param);
        // console.log(items);
        let data: any;
        if (items.length > 0) {
            data = await this.dao
                .createQueryBuilder("bases")
                .leftJoinAndSelect("bases.products", "products")
                // .leftJoinAndSelect("products.canImages", "canImages")
                .where({})
                .where("bases.id IN (:...names)", { names: items })
                .getMany();
            var t0 = new Date().getTime();
            data.sort(function(a: any, b: any) {
                var nameA = a.nameEn.toLowerCase(),
                    nameB = b.nameEn.toLowerCase();
                if (nameA < nameB)
                    //sort string ascending
                    return -1;
                if (nameA > nameB) return 1;
                return 0; //default return value (no sorting)
            });
            var t1 = new Date().getTime();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
        } else {
            data = [];
        }

        return data;
    }

    async find(data: any) {
        // console.log(param);
        return await this.dao
            .createQueryBuilder("bases")
            .innerJoinAndSelect("bases.products", "products")
            .where(data)
            .getMany();
    }

    async save(data: Bases) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Bases) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("bases")
            .leftJoinAndSelect("bases.products", "products")
            .where(data)
            .getOne();
    }
}

Object.seal(BasesDAO);
