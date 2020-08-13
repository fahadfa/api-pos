import { getRepository, Repository, getManager } from "typeorm";
import { BaseSizeColors } from "../../entities/BaseSizeColors";

export class BaseSizeColorsDAO {
    private dao: Repository<BaseSizeColors>;
    private db: any;

    constructor() {
        this.dao = getRepository(BaseSizeColors);
        this.db = getManager();
    }

    async search(data: any, items: any[]) {
        if (data.baseId) {
            if (data.type == "salesorder" && items.length > 0) {
                return await this.dao
                    .createQueryBuilder("baseSizeColors")
                    .leftJoinAndSelect("baseSizeColors.colors", "colors")
                    .leftJoinAndSelect("baseSizeColors.baseSizes", "baseSizes")
                    .leftJoinAndSelect("baseSizes.sizes", "sizes")
                    .leftJoin("baseSizes.base", "base")
                    .addSelect("base.code")
                    .where({})
                    .where("colors.id IN (:...names)", { names: items })
                    .andWhere(`base.id = '${data.baseId}'`)
                    .getMany();
            } else {
                return await this.dao
                    .createQueryBuilder("baseSizeColors")
                    .leftJoinAndSelect("baseSizeColors.colors", "colors")
                    .leftJoinAndSelect("baseSizeColors.baseSizes", "baseSizes")
                    .leftJoinAndSelect("baseSizes.sizes", "sizes")
                    .leftJoin("baseSizes.base", "base")
                    .addSelect("base.code")
                    .where({})
                    // .where("colors.id IN (:...names)", { names: items })
                    .andWhere(`base.id = '${data.baseId}'`)
                    .getMany();
            }
        } else {
            throw "ProductId or BaseId is Required";
        }
    }

    async save(data: BaseSizeColors[]) {
        // console.log(data);
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao
            .createQueryBuilder("baseSizeColors")
            .innerJoinAndSelect("baseSizeColors.colors", "colors")
            .innerJoinAndSelect("baseSizeColors.baseSizes", "baseSizes")
            .innerJoinAndSelect("baseSizes.sizes", "sizes")
            .innerJoin("baseSizes.base", "base")
            .addSelect("base.code")
            .where({ id: id })
            .getOne();
    }

    async delete(id: any) {
        return await this.dao.delete(id);
    }

    async findOne(data: any) {
        // console.log(data);
        return await this.dao
            .createQueryBuilder("baseSizeColors")
            .innerJoinAndSelect("baseSizeColors.colors", "colors")
            .innerJoinAndSelect("baseSizeColors.baseSizes", "baseSizes")
            .innerJoinAndSelect("baseSizes.sizes", "sizes")
            .innerJoinAndSelect("baseSizes.base", "base")
            // .where(data)
            .where(`base.code = '${data.itemid}' and sizes.code = '${data.sizeid}' and  colors.code = '${data.configid}'`)
            .getOne();
    }

    async find(data: any) {
        // console.log(data);
        return await this.dao
            .createQueryBuilder("baseSizeColors")
            .innerJoinAndSelect("baseSizeColors.colors", "colors")
            .innerJoinAndSelect("baseSizeColors.baseSizes", "baseSizes")
            .innerJoinAndSelect("baseSizes.sizes", "sizes")
            .innerJoinAndSelect("baseSizes.base", "base")
            .where({})
            .getMany();
    }

    async pagination(data: any) {
        let query: string = `
                select 
                i.basecode as "baseCode",
                i.sizeCode as "sizeCode",
                i.colorcode as "colorCode",
                i.price as price  
                from
                (select
                b.code as basecode,
                s.code as sizecode,
                c.code as colorcode,
                bsc.price as price
                from base_size_colors bsc
                inner join base_sizes bs on bs.id = bsc.base_size_id
                inner join colors c on c.id = bsc.color_id
                inner join sizes s on s.id = bs.size_id
                inner join bases b on b.id = bs.base_id) 
                as i
                `;

        let countQuery = `select 
                count(*)
                from base_size_colors`;
        if (data.filter != null && data.filter != "null") {
            console.log(data.filter);
            data.filter = JSON.parse(data.filter);
            let new_filter_data = [];
            for (let item of data.filter) {
                if (typeof item[0] == "object") {
                    for (let value of item) {
                        new_filter_data.push(value);
                    }
                } else {
                    new_filter_data.push(item);
                }
            }
            data.filter = new_filter_data;
            let filter = ``;
            if (typeof data.filter[0] == "object") {
                for (let item of data.filter) {
                    if (typeof item == "object") {
                        filter += item[0] + " ILike " + `'%${item[2]}%'`;
                    }
                    if (typeof item == "string") {
                        filter += " " + item + " ";
                    }
                }
            } else if (typeof data.filter[0] == "string") {
                filter += data.filter[0] + " ILike " + `'%${data.filter[2]}%'`;
            }
            console.log(filter);
            countQuery += ` where ` + filter;

            query += ` where ` + filter;
            // if (!data.orderby) {
            //     query += ` ORDER BY dateOfVisit DESC `;
            // }
            if (data.orderby && data.orderby != "null") {
                query += ` ORDER BY ${data.column} ${data.orderby} `;
            }
            query += `offset '${data.skip}' limit '${data.take}'`;
            console.log(query);
            let baseSizeColorData = await this.db.query(query);
            let count = baseSizeColorData.length;
            return { data: baseSizeColorData, count: count };
        }

        if (data.orderby && data.orderby != "null") {
            query += ` ORDER BY ${data.column} ${data.orderby} `;
        }
        query += `offset ${data.skip} limit ${data.take}`;
        let count = await this.db.query(countQuery);
        let baseSizeColorData = await this.db.query(query);
        return { data: baseSizeColorData, count: count[0].count };
    }
}

Object.seal(BaseSizeColorsDAO);
