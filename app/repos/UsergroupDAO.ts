import { getRepository, Repository } from "typeorm";
import { Usergroup } from "../../entities/Usergroup";

export class UsergroupDAO {
    private dao: Repository<Usergroup>;

    constructor() {
        this.dao = getRepository(Usergroup);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("Usergroup")
            .where(data)
            .andWhere(`deleted=false or deleted IS NULL`)
            .orderBy("Usergroup.lastmodifieddate", "DESC")
            .getMany();
    }

    async save(data: Usergroup) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        return await this.dao.findOne(id);
    }

    async delete(data: Usergroup) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }
    async findAll(data: any) {
        return await this.dao
            .createQueryBuilder("Usergroup")
            .andWhere("LOWER(groupname) = LOWER(:groupname) and (deleted=false or deleted IS NULL)", {
                groupname: data.groupname
            })
            .getMany();
    }
}

Object.seal(UsergroupDAO);
