import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { FixedAssetGroup } from "../../entities/FixedAssetGroup";
import { FixedAssetGroupDAO } from "../repos/FixedAssetGroupDAO";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { RawQuery } from "../common/RawQuery";

export class FixedAssetGroupService {
    public sessionInfo: any;
    private fixedassetgroupRepository: FixedAssetGroupDAO;
    private usergroupconfigDAO: UsergroupconfigDAO;
    private rawQuery: RawQuery;

    constructor() {
        this.fixedassetgroupRepository = new FixedAssetGroupDAO();
        this.usergroupconfigDAO = new UsergroupconfigDAO();
        this.rawQuery = new RawQuery();
    }

    async entity(id: string) {
        try {
            let data: any = await this.fixedassetgroupRepository.entity(id);
            data.createdDateTime = data.createdDateTime ? data.createdDateTime.toLocaleDateString() : data.createdDateTime;
            data.lastModifiedDate = data.lastModifiedDate ? data.lastModifiedDate.toLocaleDateString() : data.lastModifiedDate;
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            item.dataareaid = this.sessionInfo.dataareaid;
            let data: any = await this.fixedassetgroupRepository.search(item);
            data.map((element: any) => {
                element.createdDateTime = element.createdDateTime ? element.createdDateTime.toLocaleDateString() : element.createdDateTime;
                element.lastModifiedDate = element.lastModifiedDate ? element.lastModifiedDate.toLocaleDateString() : element.lastModifiedDate;
            });
            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(item: FixedAssetGroup) {
        try {
            let cond = await this.validate(item);
            if (cond == true) {
                let fixedassetgroupData: any = await this.fixedassetgroupRepository.save(item);
                let returnData = { id: fixedassetgroupData.groupid, message: 'SAVED_SUCCESSFULLY' };
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
            let entity: any = await this.fixedassetgroupRepository.entity(id);
            if (entity) {
                entity.deleted = true;
            } else {
                throw {message: 'DATA_NOT_FOUND'};
            }
            entity.deletedby = this.sessionInfo.userName;
            await this.fixedassetgroupRepository.save(entity);
            return { id: entity.assetId, message: 'REMOVED_SUCCESSFULLY' };
        } catch (error) {
            throw error;
        }
    }

    async validate(item: FixedAssetGroup) {
        let previousItem: any = null;
        console.log(item.groupid);
        if (!item.groupid || item.groupid.toString() == "" || item.groupid.toString() == "0") {
            item.groupid = null;
        } else {
            previousItem = await this.fixedassetgroupRepository.entity(item.groupid);
        }
        let condData: any = [];
        if (item.groupid) {
            condData = await this.fixedassetgroupRepository.search({ groupid: item.groupid });
        }

        if (!item.groupid) {
            if (condData.length > 0) {
                return "name";
            } else {
                let uid = await this.getaccountNum();
                item.groupid = uid;
                item.createdBy = this.sessionInfo.userName;
                item.createdDateTime = new Date(App.DateNow());
            }
        } else {
            if (item.lastModifiedDate && previousItem.lastModifiedDate.toISOString() != new Date(item.lastModifiedDate).toISOString()) {
                return "updated";
            }
        }
        item.lastModifiedBy = this.sessionInfo.userName;
        item.lastModifiedDate = new Date(App.DateNow());
        return true;
    }

    async getaccountNum() {
        try {
            let usergroupconfig = await this.usergroupconfigDAO.findOne({
                inventlocationid: this.sessionInfo.inventlocationid
            });
            let data: any;

            let seqNum = usergroupconfig.fixedassestgroupsequencegroup;
            data = await this.rawQuery.getNumberSequence(seqNum);
            if (data) {
                let prevYear = new Date(data.lastmodifieddate)
                    .getFullYear()
                    .toString()
                    .substr(2, 2);
                let year: string = new Date()
                    .getFullYear()
                    .toString()
                    .substr(2, 2);

                data.nextrec = prevYear == year ? data.nextrec : 1;

                let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
                let salesId: string = data.format.replace(hashString, data.nextrec) + "-" + year;
                console.log(salesId);
                await this.rawQuery.updateNumberSequence(seqNum, data.nextrec);
                return await salesId;
            } else {
                throw {message: 'CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE'};
            }
        } catch (error) {
            if (error == {}) {
                error = {message: 'SERVER_SIDE_ERROR'}
            }
            throw error;
        }
    }
}
