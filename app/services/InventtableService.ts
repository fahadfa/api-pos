import { App } from "../../utils/App";
import { Products } from "../../entities/Products";
import { InventtableDAO } from "../repos/InventtableDAO";
import { Props } from "../../constants/Props";
import { RawQuery } from "../common/RawQuery";
 
export class InventtableService {
   public sessionInfo: any;
   private inventtableDAO: InventtableDAO;
   private rawQuery: RawQuery;
 
   constructor() {
       this.inventtableDAO = new InventtableDAO();
       this.rawQuery = new RawQuery();
   }
 
   async entity(id: string) {
       try {
           let data: any = await this.inventtableDAO.entity(id);
           return data;
       } catch (error) {
           throw error;
       }
   }
 
   async search(reqData: any) {
       try {
           let items = await this.rawQuery.getIitemIds();
           let data: any;
           if (items.length > 0) {
               data = await this.inventtableDAO.search(reqData, items);
           } else {
               data = [];
           }
          
           return data;
       } catch (error) {
           throw error;
       }
   }
 
   async searchSalesOrderProducts(params: any) {
       try {
           // console.log(params);
           var t0 = new Date().getTime();
           let Items: any = await this.rawQuery.getItemsInStock(this.sessionInfo.inventlocationid);
           // console.log(Items);
           let data = await this.inventtableDAO.search(params.dataareaid, Items);
           console.log(data.length);
           var t1 = new Date().getTime();
           console.log("took " + (t1 - t0) / 1000 + " milliseconds.");
           return data;
       } catch (error) {
           throw error;
       }
   }
}
 

