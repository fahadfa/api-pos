import { Between, Repository } from "typeorm";
import { Props } from "../../constants/Props";
import { ReqItemTable } from "../../entities/ReqItemTable";
import { ReqItemTableDAO } from "../repos/ReqItemTableDAO";
import { App } from "../../utils/App";

export class ReqItemTableService {
    public sessionInfo: any;
   
    private reqItemTableRepository: Repository<ReqItemTable>;

    constructor() {
        // this.sessionInfo = { id: "SYSTEM", compcode: "OWN" };
        this.reqItemTableRepository =new ReqItemTableDAO().getRepository();
    }

    async entity(id: string) {
        try {
            let query: any = { id: id };
            let data: any = await this.reqItemTableRepository.findOne(query, {
                relations: [],
                join: {
                    alias: "reqItemTable",
                    innerJoinAndSelect: {
                    }
                }
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: ReqItemTable) {
        try {
            let query: any = { compcode: this.sessionInfo.compcode };
            // if(item&&item.hasOwnProperty("inventLocationidReqMain")){
            //     query.inventLocationidReqMain=item.inventLocationidReqMain;
            // }else{

            // }
            // if (item.hasOwnProperty("fromDate") && item.hasOwnProperty("toDate")) {
            //     query.updatedOn = Between(new Date(item.fromDate).toISOString(), new Date(item.toDate).toISOString());
            // } else {
            //     throw { message: Props.INVALID_DATA };
            // }
            console.log(query)
            let data: any[] = await this.reqItemTableRepository.find({
                relations: [],
                where: query
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(item: ReqItemTable) {
        try {
            let cond = await this.validate(item);
            if (cond == true) {

                let reqItemTableData: any = await this.reqItemTableRepository.save(item); let returnData = { id: item.recid, message: Props.SAVED_SUCCESSFULLY };
                return returnData;
            } else {
                throw { message: Props.INVALID_DATA };
            }
        } catch (error) {
            throw error;
        }
    }

    async delete(id: any) {
        try {
            let data: ReqItemTable = await this.reqItemTableRepository.findOne(id);
            if (!data) throw { message: Props.RECORD_NOT_EXISTS };
            //data.active = !data.active;
            data.updatedBy = this.sessionInfo.id;
            data.updatedOn = new Date(App.DateNow());
            let result: any = await this.reqItemTableRepository.save(data);
            let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: ReqItemTable) {

        let previousItem: any = null;
        // if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
        //     item.id = null;
        // } else{
        //     previousItem = await this.reqItemTableRepository.findOne(item.id);
        // }
        // // let condData = await this.reqItemTableRepository.find( { where : { id: item.id } });
        // if (!item.id) {
        //         let uid = App.UniqueID("ReqItemTable"+"_"+App.UniqueCode(), item.compcode);
        //         item.id = uid; 
        // } else {
        //     if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
        //         return "updated";
        //     }
        // }
        item.updatedBy = this.sessionInfo.id;
        item.updatedOn = new Date(App.DateNow());
        return true;
    }
}