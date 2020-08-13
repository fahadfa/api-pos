import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { SyncSource } from "../../entities/SyncSource";
import { SyncSourceRepository } from "../repos/SyncSourceRepository";

export class SyncSourceService {
    public sessionInfo: any;
    private syncSourceRepository: SyncSourceRepository;

    constructor() {
        this.syncSourceRepository = new SyncSourceRepository();
    }

    async entity(id: string) {
        try {
            let data: any = await this.syncSourceRepository.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let data: any = await this.syncSourceRepository.search(item);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(item: SyncSource) {
        try {
            let cond = await this.validate(item);
            if (cond == true) {
                let syncSourceData: any = await this.syncSourceRepository.save(item);
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
            let data: SyncSource = await this.syncSourceRepository.entity(id);
            if (!data) throw { message: 'RECORD_NOT_FOUND' };
            data.updatedBy = this.sessionInfo.id;
            let result: any = await this.syncSourceRepository.delete(data);
            let returnData = { id: id, message: 'REMOVED' };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: SyncSource) {
        let previousItem: any = null;
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        } else {
            previousItem = await this.syncSourceRepository.entity(item.id);
        }
        // let condData = await this.syncSourceRepository.search({ name: item.name });
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
