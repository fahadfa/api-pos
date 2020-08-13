import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { SyncTable } from "../../entities/SyncTable";
import { SyncTableRepository } from "./../repos/SyncTableRepository";

export class SyncTableService {
    public sessionInfo: any;
    private syncTableRepository: SyncTableRepository;

    constructor() {
        this.syncTableRepository = new SyncTableRepository();
    }

    async entity(id: string) {
        try {
            let data: any = await this.syncTableRepository.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let data: any = await this.syncTableRepository.search(item);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(item: SyncTable) {
        try {
            let cond = await this.validate(item);
            if (cond == true) {
                let syncTableData: any = await this.syncTableRepository.save(item);
                let returnData = { id: item.id, message: 'SAVED_SUCCESSFULLY' };
                return returnData;
            } else if (cond == "updated") {
                throw { message: Props.MISS_MATCH_MESSAGE };
            } else if (cond == "name") {
                throw { message: 'RECORD_ALREADY_EXISTS' };
            } else {
                throw { message: 'INVALID_DATA' };
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: any) {
        try {
            let data: SyncTable = await this.syncTableRepository.entity(id);
            if (!data) throw { message: 'RECORD_NOT_FOUND' };
            data.updatedBy = this.sessionInfo.id;
            let result: any = await this.syncTableRepository.delete(data);
            let returnData = { id: id, message: 'REMOVED' };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: SyncTable) {
        let previousItem: any = null;
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        } else {
            previousItem = await this.syncTableRepository.entity(item.id);
        }
        // let condData = await this.syncTableRepository.search({ name: item.name });
        if (!item.id) {
            // if (condData.length > 0) {
            //     return "name";
            // } else {
            let uid = App.UniqueNumber();
            item.id = uid;
            // item.createdBy = this.sessionInfo.id;
            // item.createdOn = new Date(App.DateNow());
            // }
        } else {
            if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
                return "updated";
            }
            // if(oldItem.name != item.name) {
            //    if (condData.length > 0) {
            //        return "name";
            //    }
            // }
        }
        item.updatedBy = this.sessionInfo.id;
        item.updatedOn = new Date(App.DateNow());
        return true;
    }
}
