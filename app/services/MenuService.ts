import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { Menu } from "../../entities/Menu";
import { MenuDAO } from "../repos/MenuDAO";

export class MenuService {
    public sessionInfo: any;
    private menuRepository: MenuDAO;

    constructor() {
        this.menuRepository = new MenuDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.menuRepository.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let data: any = await this.menuRepository.search(item);
            data = await App.unflatten(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(item: Menu) {
        try {
            let cond = await this.validate(item);
            if (cond == true) {
                let menuData: any = await this.menuRepository.save(item);
                let returnData = { id: item.id, message: 'SAVED_SUCCESSFULLY' };
                return returnData;
            } else {
                throw { message: 'INVALID_DATA' };
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: any) {
        try {
            let data: Menu = await this.menuRepository.entity(id);
            if (!data) throw { message: "RECORD_NOT_FOUND" };
            data.updatedBy = this.sessionInfo.id;
            let result: any = await this.menuRepository.delete(data);
            let returnData = { id: id, message: 'REMOVED' };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: Menu) {
        let previousItem: any = null;
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        } else {
            previousItem = await this.menuRepository.entity(item.id);
        }
        // let condData = await this.menuRepository.search({ name: item.name });
        if (!item.id) {
            // if (condData.length > 0) {
            //     return "name";
            // } else {
            // let uid = App.UniqueCode();
            // item.id = uid;
            // item.createdBy = this.sessionInfo.id;
            // item.createdOn = new Date(App.DateNow());
            // }
        } else {
            // if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
            //     return "updated";
            // }
            // if(oldItem.name != item.name) {
            //    if (condData.length > 0) {
            //        return "name";
            //    }
            // }
        }
        item.updatedBy = this.sessionInfo.id;
        //item.updatedOn = new Date(App.DateNow());
        return true;
    }
}
