import { App } from "../../utils/App";
import { Colors } from "../../entities/Colors";
import { ColorsDAO } from "../repos/ColorsDAO";
import { Props } from "../../constants/Props";

export class ColorsService {
    public sessionInfo: any;
    private colorsDAO: ColorsDAO;

    constructor() {
        this.colorsDAO = new ColorsDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.colorsDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async save(reqData: any) {
        try {
            let data = await this.validate(reqData)
            // console.log(data)
            let colors: any = await this.colorsDAO.save(reqData);
            let returnData = { message: "SAVED_SUCCESSFULLY" };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(reqData: any){
        let colors: Colors[] = await this.colorsDAO.search({})
        let newData: any =[]
        for (let d of reqData){
            let color: any = await colors.filter((v:any)=>(v.code == d.code))
            
            if (color.length > 0){
                d.id = color[0].id
                d.insertedAt = color[0].insertedAt
            }else{
                d.insertedAt = new Date()
            }
            d.updatedAt =  new Date()
        }
        return reqData
    }

    async search(item: any) {
        try {
            let data: any = await this.colorsDAO.search(item);
            return data;
        } catch (error) {
            throw error;
        }
    }
}
