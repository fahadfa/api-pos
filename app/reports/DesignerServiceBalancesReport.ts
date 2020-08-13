import { getManager } from "typeorm";
import { log } from "../../utils/Log";
import { App } from "../../utils/App";
import { SalesTableService } from "../services/SalesTableService";
import { RawQuery } from "../common/RawQuery";
import { InventorytransDAO } from "../repos/InventTransDAO";
import { UpdateInventoryService } from "../services/UpdateInventoryService";

export class DesignerServiceBalancesReport {
  public sessionInfo: any;
  private db: any;
  private salesTableService: SalesTableService;
  private rawQuery: RawQuery;
  private inventTransDAO: InventorytransDAO;
  private updateInventoryService: UpdateInventoryService;
  constructor() {
    this.db = getManager();
    this.salesTableService = new SalesTableService();
    this.rawQuery = new RawQuery();
    this.inventTransDAO = new InventorytransDAO();
    this.updateInventoryService = new UpdateInventoryService();
  }

  async execute(params: any) {
    try {
      let data: any = params;
      data = await this.query_to_data(params);
      data.map((item:any)=>{
        item.lastmodifieddate = App.convertUTCDateToLocalDate(
            new Date(item.lastmodifieddate),
            parseInt(params.timeZoneOffSet)
          ).toLocaleString();
      })
      console.log(data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async report(result: any, params: any) {
    let renderData: any = params;
    renderData.data = result;
    let file = params.lang == "en" ? "designer-service-balances-en" : "designer-service-balances-ar";
    try {
      return App.HtmlRender(file, renderData);
    } catch (error) {
      throw error;
    }
  }
  async query_to_data(params: any) {
    let query = `          
select distinct d.invoiceid, d.customerid, d.custphone,
cast(coalesce(d.balanceamount, 0) as Decimal(10,2)) as "balanceAmount",
cast((coalesce(d.designerserviceamount, 0) - coalesce(d.balanceamount, 0)) as Decimal(10,2)) as "usedAmount",
cast(coalesce(d.designerserviceamount, 0) as Decimal(10,2)) 
as "designerserviceAmount",st.lastmodifieddate,st.status from
(
select
a.invoiceid,
a.customerid,
a.custphone,
(select ABS(sum(b.amount)) from designerservice b where b.invoiceid=a.invoiceid 
and b.customerid = a.customerid and b.custphone= a.custphone 
group by b.invoiceid, b.customerid, b.custphone )
as balanceamount,
(select ABS(sum(e.amount)) from 
designerservice e where e.amount > 0 
and e.salesorderid is null and e.invoiceid=a.invoiceid and e.customerid = a.customerid and e.custphone = a.custphone group by e.invoiceid, e.customerid, e.custphone)
as designerserviceamount
from designerservice a 
--                where a.customerid = '0554076508'
)  
as d 
inner join salestable as st on d.invoiceid=st.salesid 
where d.balanceamount > 0
and st.inventlocationid ='${params.inventlocationid}'
and st.lastmodifieddate ::Date>='${params.fromDate}'
and st.lastmodifieddate ::Date<='${params.toDate}'`;
    if (params.status != "ALL") {
      if (params.status == "RESERVED") {
        query += ` and st.status in ('RESERVED') `;
      } else if (params.status == "SAVED") {
        query += ` and st.status in ('SAVED') `;
      } else if (params.status == "CREATED") {
        query += ` and st.status in ('CREATED') `;
      } else if (params.status == "POSTED") {
        query += ` and st.status in ('POSTED','PAID') `;
      } else if (params.status == "PAID") {
        query += ` and st.status in ('PAID','POSTED') `;
      }
    }
    if (params.custaccount) {
      query += `and st.custaccount= '${params.custaccount}'`;
    }
    return await this.db.query(query);
  }
}
