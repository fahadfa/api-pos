import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { MenuGroup } from "../../entities/MenuGroup";
import { MenuGroupDAO } from "../repos/MenuGroupDAO";
import { MenuService } from "./MenuService";
import { MenuDAO } from "../repos/MenuDAO";

export class MenuGroupService {
    public sessionInfo: any;
    private menuGroupRepository: MenuGroupDAO;
    private menuService: MenuService;
    private menuRepository: MenuDAO;

    constructor() {
        this.menuGroupRepository = new MenuGroupDAO();
        this.menuService = new MenuService();
        this.menuRepository = new MenuDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.menuGroupRepository.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            item.group = {
                groupid: item.groupId
            };
            let data: any = await this.menuGroupRepository.permissionData(item);
            let menu: any = await this.menuRepository.search({ active: true });
            // console.log(data.length);
            let newData: any = [];
            for (let element of menu) {
                delete element.active;
                let index = data.findIndex((value: any) => value.menuId == element.id);
                if (index == -1) {
                    let newMenu = {
                        menuId: element.id,
                        name: element.name,
                        nameAr: element.nameAr,
                        link: element.link,
                        parentId: element.parentId
                    };
                    newData.push(Object.assign({}, { active: false, writeAccess: false, deleteAccess: false }, newMenu, { groupid: item.groupId }));
                }
            }
            newData = data.concat(newData);
            newData = await this.unflatten(newData);
            return newData;
        } catch (error) {
            throw error;
        }
    }

    unflatten(arr: any) {
        let newData: any = [];
        for (let item of arr) {
            if (!item.parentId) {
                let children = arr.filter((v: any) => v.parentId == item.menuId);
                item.children = children;
                newData.push(item);
            }
        }
        return newData;
    }

    async save(data: any) {
        try {
            // let cond = await this.validate(item);
            // if (cond == true) {
            let newData: any = [];
            for (let item of data) {
                newData.push(item);
                newData = newData.concat(item.children);
            }
            let saveData: any = [];
            newData.forEach((element: any) => {
                let menugroup: any = {
                    id: element.id,
                    updatedBy: this.sessionInfo.userName,
                    writeAccess: element.writeAccess,
                    deleteAccess: element.deleteAccess,
                    active: element.active,
                    menu: {
                        id: element.menuId
                    },
                    group: {
                        groupid: element.groupid
                    }
                };
                menugroup.updatedDate = new Date(App.DateNow());
                if (!element.id) {
                    menugroup.createdBy = new Date(App.DateNow());
                }
                delete element.children;
                saveData.push(menugroup);
            });
            // console.log(saveData)
            let menuGroupData: any = await this.menuGroupRepository.save(saveData);
            let returnData = { message: 'SAVED_SUCCESSFULLY' };
            return returnData;
            // } else {
            //     throw { message: Props.INVALID_DATA };
            // }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: any) {
        try {
            let data: MenuGroup = await this.menuGroupRepository.entity(id);
            if (!data) throw { message: 'RECORD_NOT_FOUND' };
            data.updatedBy = this.sessionInfo.id;
            let result: any = await this.menuGroupRepository.delete(data);
            let returnData = { id: id, message: 'REMOVED_SUCCESSFULLY' };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: MenuGroup) {
        let previousItem: any = null;
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        } else {
            previousItem = await this.menuGroupRepository.entity(item.id);
        }
        // let condData = await this.menuGroupRepository.search({ name: item.name });
        if (!item.id) {
            // if (condData.length > 0) {
            //     return "name";
            // } else {
            //let uid = App.UniqueNumber();
            //item.id = uid;
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
