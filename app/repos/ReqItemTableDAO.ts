import { ReqItemTable } from '../../entities/ReqItemTable';
import { getRepository, Repository } from 'typeorm';
export class ReqItemTableDAO{
    private dao: Repository<ReqItemTable>;

    constructor() {
        this.dao = getRepository(ReqItemTable);
    }

    getRepository():Repository<ReqItemTable>{
        return this.dao
    }
}