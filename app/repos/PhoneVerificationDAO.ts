import { getRepository, Repository } from "typeorm";
import { PhoneVerification } from "../../entities/PhoneVerification";

export class PhoneVerificationDAO {
    private dao: Repository<PhoneVerification>;

    constructor() {
        this.dao = getRepository(PhoneVerification);
    }

    async search(data: any) {
        return await this.dao
            .createQueryBuilder("PhoneVerification")
            .where(data)
            .getMany();
    }

    async save(data: PhoneVerification) {
        return await this.dao.save(data);
    }

    async entity(id: any) {
        return await this.dao.findOne(id, {
            join: {
                alias: "PhoneVerification"
            }
        });
    }

    async delete(data: any) {
        data.active = !data.active;
        return await this.dao.save(data);
    }

    async findOne(data: any) {
        return await this.dao
            .createQueryBuilder("phoneverification")
            .where(data)
            .orderBy("createdDateTime", "DESC")
            .getOne();
    }
}

Object.seal(PhoneVerificationDAO);
