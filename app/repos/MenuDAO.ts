import { getRepository, Repository } from "typeorm";
import { Menu } from "../../entities/Menu";

export class MenuDAO {
    private dao: Repository<Menu>;

    constructor() {
        this.dao = getRepository(Menu);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("menu")
            .where(data)
            .orderBy("priority", "ASC")
            .getMany();
    }

    async save(data: Menu) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "menu",
                innerJoinAndSelect: {}
            }
        });
    }

    async delete(data: any) {
        data.active = !data.active;
        return await this.dao.save(data);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data, {
            join: {
                alias: "menu",
                innerJoinAndSelect: {}
            }
        });
    }
}

Object.seal(MenuDAO);
