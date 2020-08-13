import { getRepository, Repository, getManager } from "typeorm";
import { VisitCustomer } from "../../entities/VisitCustomer";

export class VisitCustomerDAO {
    private dao: Repository<VisitCustomer>;
    private db: any;

    constructor() {
        this.dao = getRepository(VisitCustomer);
        this.db = getManager();
    }

    async search(data: any) {
        return await this.dao.find(data);
    }

    async searchInventLocationId(data:any){
        let query=`select v.* 
        from visitcustomer v inner join usergroupconfig ucg 
        on v.usergroupid =ucg.usergroupid where ucg.inventlocationid ='${data.inventlocationid}'
        and v.dateofvisit >= current_date - interval '15' day`;
       
        return await this.dao.query(query)
    }

    async save(data: VisitCustomer) {
        return await this.dao.save(data);
    }

    async entity(id: string) {
        console.log(id);
        return await this.dao.findOne({ visitorSequenceNumber: id });
    }

    async delete(data: VisitCustomer) {
        return await this.dao.remove([data]);
    }

    async findOne(data: any) {
        return await this.dao.findOne(data);
    }

    async findAll(data: any) {
        return await this.dao.find(data);
    }

    async pagination(data: any) {
        let query = `select 
            v.visitorid as "visitorId",
            v.visitorsequencenumber as "visitorSequenceNumber",
            v.dateofvisit as "dateOfVisit",
            d.description as "salesmanName",
            d.name as name,
            v.salesmanid as "salesmanId",
            v.regionnumber as "regionNumber",
            v.showroomid as "showroomId",
            v.usergroupid as "userGroupId",
            v.visitormobilenumber as "visitorMobileNumber",
            v.visitorname as "visitorName",
            v.purchased as "purchased",
            v.visitortype as "visitorType",
            v.reasonfornotpurchase as "description",
            v.createdby as "createdBy",
            v.createddatetime as "createdDateTime",
            v.lastmodifiedby as "lastModifiedBy",
            v.dataareaid as "dataareaid",
            v.lastmodifieddate as "lastModifiedDate"
            from visitcustomer v
            left join dimensions as d on d.num = v.salesmanid `;
        let countQuery = `select 
        count(*)
        from visitcustomer v
        left join dimensions as d on d.num = v.salesmanid `;
        if (data.filter != null && data.filter != "null") {
            console.log(data.filter);
            data.filter = JSON.parse(data.filter);
            let new_filter_data = [];
            for (let item of data.filter) {
                if (typeof item[0] == "object") {
                    for (let value of item) {
                        new_filter_data.push(value);
                    }
                } else {
                    new_filter_data.push(item);
                }
            }
            data.filter = new_filter_data;
            let filter = ``;
            if (typeof data.filter[0] == "object") {
                for (let item of data.filter) {
                    if (typeof item == "object") {
                        if (item[0] == "dateOfVisit") {
                            filter += `dateOfVisit ` + `${item[1]}` + `'${new Date(item[2]).toDateString()}'`;
                        } else {
                            filter += item[0] + " ILike " + `'%${item[2]}%'`;
                        }
                    }
                    if (typeof item == "string") {
                        if (item == "dateOfVisit") {
                            filter += `dateOfVisit ` + `${item[1]}` + `'${new Date(item[2]).toDateString()}'`;
                        } else {
                            filter += " " + item + " ";
                        }
                    }
                }
            } else if (typeof data.filter[0] == "string") {
                if (data.filter[0] == "dateOfVisit") {
                    filter += `dateOfVisit ` + `${data.filter[1]}` + `'${new Date(data.filter[2]).toDateString()}'`;
                } else {
                    filter += data.filter[0] + " ILike " + `'%${data.filter[2]}%'`;
                }
            }
            console.log(filter);
            countQuery += ` where ` + filter;

            query += ` where ` + filter;
            // if (!data.orderby) {
            //     query += ` ORDER BY dateOfVisit DESC `;
            // }
            query += data.orderby && data.orderby != "null" ? ` ORDER BY ${data.column} ${data.orderby} ` : ` ORDER BY dateOfVisit DESC `;
            query += `offset '${data.skip}' limit '${data.take}'`;
            let count = await this.db.query(countQuery);
            let visitorData = await this.db.query(query);
            return { data: visitorData, count: count[0].count };
        }
        // if (!data.orderby) {
        //     query += ` ORDER BY dateOfVisit DESC `;
        // }
        query += data.orderby && data.orderby != "null" ? ` ORDER BY ${data.column} ${data.orderby} ` : ` ORDER BY dateOfVisit DESC `;
        query += `offset ${data.skip} limit ${data.take}`;
        let count = await this.db.query(countQuery);
        let visitorData = await this.db.query(query);
        return { data: visitorData, count: count[0].count };
    }

    async mobile_pagination(data: any) {

        let query = `select 
        v.visitorid as "visitorId",
        v.visitorsequencenumber as "visitorSequenceNumber",
        v.dateofvisit as "dateOfVisit",
        d.description as "salesmanName",
        d.name as name,
        v.salesmanid as "salesmanId",
        v.regionnumber as "regionNumber",
        v.showroomid as "showroomId",
        v.usergroupid as "userGroupId",
        v.visitormobilenumber as "visitorMobileNumber",
        v.visitorname as "visitorName",
        v.purchased as "purchased",
        v.visitortype as "visitorType",
        v.reasonfornotpurchase as "description",
        v.createdby as "createdBy",
        v.createddatetime as "createdDateTime",
        v.lastmodifiedby as "lastModifiedBy",
        v.dataareaid as "dataareaid",
        v.lastmodifieddate as "lastModifiedDate"
        from visitcustomer v
        left join dimensions as d on d.num = v.salesmanid `;
        if (data.filter) {
            query += `where (v.visitorsequencenumber ILike '%${data.filter}%' or 
            v.visitorname ILike '%${data.filter}%')`
        }

        query += `  ORDER BY 
        v.createddatetime DESC offset ${(data.page - 1) * data.pageCount} limit ${data.pageCount}`;

        return await this.db.query(query);
    }
}

Object.seal(VisitCustomerDAO);
