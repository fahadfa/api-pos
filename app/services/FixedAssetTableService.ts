import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { FixedAssetTable } from "../../entities/FixedAssetTable";
import { FixedAssetTableDAO } from "../repos/FixedAssetTableDAO";
import { UsergroupconfigDAO } from "../repos/UsergroupconfigDAO";
import { RawQuery } from "../common/RawQuery";
import { FixedAssetGroupDAO } from "../repos/FixedAssetGroupDAO";
import { FixedAssetGroup } from "../../entities/FixedAssetGroup";

export class FixedAssetTableService {
  public sessionInfo: any;
  private fixedassettableRepository: FixedAssetTableDAO;
  private usergroupconfigDAO: UsergroupconfigDAO;
  private fixedAssetGroupDAO: FixedAssetGroupDAO;
  private rawQuery: RawQuery;

  constructor() {
    this.fixedassettableRepository = new FixedAssetTableDAO();
    this.usergroupconfigDAO = new UsergroupconfigDAO();
    this.rawQuery = new RawQuery();
    this.fixedAssetGroupDAO = new FixedAssetGroupDAO();
  }

  async entity(id: string) {
    try {
      let data: any = await this.fixedassettableRepository.entity(id);
      data.createdDateTime = data.createdDateTime
        ? data.createdDateTime.toISOString().substr(0, 10)
        : data.createdDateTime;
      data.lastModifiedDate = data.lastModifiedDate
        ? data.lastModifiedDate.toISOString().substr(0, 10)
        : data.lastModifiedDate;
      data.guaranteeDate = data.guaranteeDate ? data.guaranteeDate.toISOString().substr(0, 10) : data.guaranteeDate;
      data.insuranceDate1 = data.insuranceDate1 ? data.insuranceDate1.toISOString().substr(0, 10) : data.insuranceDate1;
      data.insuranceDate2 = data.insuranceDate2 ? data.insuranceDate2.toISOString().substr(0, 10) : data.insuranceDate2;
      data.lastMaintenance = data.lastMaintenance
        ? data.lastMaintenance.toISOString().substr(0, 10)
        : data.lastMaintenance;
      data.nextMaintenance = data.nextMaintenance
        ? data.nextMaintenance.toISOString().substr(0, 10)
        : data.nextMaintenance;
      data.physicalInventory = data.physicalInventory
        ? data.physicalInventory.toISOString().substr(0, 10)
        : data.physicalInventory;
      data.policyExpiration = data.policyExpiration
        ? data.policyExpiration.toISOString().substr(0, 10)
        : data.policyExpiration;
      data.lastFactorUpdateDate = data.lastFactorUpdateDate
        ? data.lastFactorUpdateDate.toISOString().substr(0, 10)
        : data.lastFactorUpdateDate;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      item.dataareaid = this.sessionInfo.dataareaid;
      let data: any = await this.fixedassettableRepository.search(item);
      data.map((i: any) => {
        i.createdDateTime = i.createdDateTime ? i.createdDateTime.toISOString().substr(0, 10) : i.createdDateTime;
        i.lastModifiedDate = i.lastModifiedDate ? i.lastModifiedDate.toISOString().substr(0, 10) : i.lastModifiedDate;
        i.guaranteeDate = i.guaranteeDate ? i.guaranteeDate.toISOString().substr(0, 10) : i.guaranteeDate;
        i.insuranceDate1 = i.insuranceDate1 ? i.insuranceDate1.toISOString().substr(0, 10) : i.insuranceDate1;
        i.insuranceDate2 = i.insuranceDate2 ? i.insuranceDate2.toISOString().substr(0, 10) : i.insuranceDate2;
        i.lastMaintenance = i.lastMaintenance ? i.lastMaintenance.toISOString().substr(0, 10) : i.lastMaintenance;
        i.nextMaintenance = i.nextMaintenance ? i.nextMaintenance.toISOString().substr(0, 10) : i.nextMaintenance;
        i.physicalInventory = i.physicalInventory
          ? i.physicalInventory.toISOString().substr(0, 10)
          : i.physicalInventory;
        i.policyExpiration = i.policyExpiration ? i.policyExpiration.toISOString().substr(0, 10) : i.policyExpiration;
        i.lastFactorUpdateDate = i.lastFactorUpdateDate
          ? i.lastFactorUpdateDate.toISOString().substr(0, 10)
          : i.lastFactorUpdateDate;
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(item: FixedAssetTable) {
    try {
      let cond = await this.validate(item);
      console.log(cond);
      if (cond == true || cond == "updated") {
        item.dataareaid = this.sessionInfo.dataareaid;
        let fixedassettableData: any = await this.fixedassettableRepository.save(item);
        let returnData = { id: fixedassettableData.assetId, message: "SAVED_SUCCESSFULLY" };
        return returnData;
      } else if (cond == "assetId") {
        throw { message: "RECORD_ALREADY_EXISTS" };
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: any) {
    try {
      let entity: any = await this.fixedassettableRepository.entity(id);
      if (entity) {
        entity.deleted = true;
      } else {
        throw { MESSAGE: "RECORD_NOT_FOUND" };
      }
      entity.deletedby = this.sessionInfo.userName;
      await this.fixedassettableRepository.save(entity);
      return { id: entity.assetId, message: "REMOVED" };
    } catch (error) {
      throw error;
    }
  }

  async validate(item: FixedAssetTable) {
    let previousItem: any = null;
    if (!item.assetId || item.assetId.toString() == "" || item.assetId.toString() == "0") {
      item.assetId = null;
    } else {
      previousItem = await this.fixedassettableRepository.entity(item.assetId);
    }
    let condData: any = [];
    if (item.assetId) {
      condData = await this.fixedassettableRepository.search({ assetId: item.assetId });
    }

    if (!item.assetId) {
      if (condData.length > 0) {
        return "assetId";
      } else {
        let uid = await this.getaccountNum(item);
        item.assetId = uid;
        item.createdBy = this.sessionInfo.userName;
        item.createdDateTime = new Date(App.DateNow());
      }
    } else {
      if (
        item.lastModifiedDate &&
        previousItem.lastModifiedDate.toISOString() != new Date(item.lastModifiedDate).toISOString()
      ) {
        return "updated";
      }
      // if(oldItem.name != item.name) {
      //    if (condData.length > 0) {
      //        return "name";
      //    }
      // }
    }
    item.lastModifiedDate = this.sessionInfo.userName;
    item.lastModifiedDate = new Date(App.DateNow());
    return true;
  }
  async getaccountNum(item: FixedAssetTable) {
    try {
      let usergroupconfig = await this.usergroupconfigDAO.findOne({
        inventlocationid: this.sessionInfo.inventlocationid,
      });
      let data: any;
      let seqNum: any;
      let fixedAssetGroup: FixedAssetGroup = await this.fixedAssetGroupDAO.entity(item.assetGroup);
      if (fixedAssetGroup) {
        if (fixedAssetGroup.autoNumberSequence) {
          seqNum = fixedAssetGroup.autoNumberSequence;
        } else {
          seqNum = usergroupconfig.fixedassestgroupsequencegroup;
        }
      } else {
        seqNum = usergroupconfig.fixedassestgroupsequencegroup;
      }

      data = await this.rawQuery.getNumberSequence(seqNum);
      if (data) {
        let prevYear = new Date(data.lastmodifieddate).getFullYear().toString().substr(2, 2);
        let year: string = new Date().getFullYear().toString().substr(2, 2);

        data.nextrec = prevYear == year ? data.nextrec : 1;

        let hashString: string = data.format.slice(data.format.indexOf("#"), data.format.lastIndexOf("#") + 1);
        let salesId: string = data.format.replace(hashString, year) + "-" + data.nextrec;
        console.log(salesId);
        await this.rawQuery.updateNumberSequence(seqNum, data.nextrec);
        return await salesId;
      } else {
        throw { message: "CANNOT_FIND_SEQUENCE_FORMAT_FROM_NUMBER_SEQUENCE_TABLE" };
      }
    } catch (error) {
      if (error == {}) {
        error = { message: "TECHNICAL_ISSUE,_PLEASE_CONTACT_YOUR_TECHNICAL_TEAM" };
      }
      throw error;
    }
  }
}
