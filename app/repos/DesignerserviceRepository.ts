import { getRepository, Repository } from "typeorm";
import { Designerservice } from "../../entities/Designerservice";

export class DesignerserviceRepository {
    private dao: Repository<Designerservice>;

    constructor() {
        this.dao = getRepository(Designerservice);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("designerservice")
            .innerJoinAndSelect("designerservice.customer", "customer")
            .where(data)
            .getMany();
    }

    async save(data: Designerservice) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "designerservice",
                innerJoinAndSelect: {
                    customer: "designerservice.customer"
                }
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
                alias: "designerservice",
                innerJoinAndSelect: {
                    customer: "designerservice.customer"
                }
            }
        });
    }
}

Object.seal(DesignerserviceRepository);
