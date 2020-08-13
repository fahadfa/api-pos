import { getRepository, Repository, getManager } from "typeorm";
import { DesignerProducts } from "../../entities/DesignerProducts";
import { RawQuery } from "../common/RawQuery";

export class DesignerProductsDAO {
    private dao: Repository<DesignerProducts>;
    private db: any;
    private rawQuery: RawQuery;
    constructor() {
        this.dao = getRepository(DesignerProducts);
        this.rawQuery = new RawQuery();
    }

    async search(param: any) {
        let data = await this.dao
            .createQueryBuilder("DesignerProducts")
            .where({})
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
        return data;
    }

    async find(data: any) {
        // console.log(param);
        return await this.dao
            .createQueryBuilder("DesignerProducts")
            .where(data)
            .getMany();
    }

    async save(data: DesignerProducts) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: DesignerProducts) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("DesignerProducts")
            .where(data)
            .getOne();
    }
}

Object.seal(DesignerProductsDAO);
