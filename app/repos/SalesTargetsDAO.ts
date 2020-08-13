import { Repository, getRepository } from "typeorm";
import { SalesTargets } from '../../entities/SalesTargets';

export class SalesTargetsDAO{
    private dao: Repository<SalesTargets>;

    constructor(){
        this.dao = getRepository(SalesTargets);
    }
    getDAO(){
        return this.dao;
    }
}