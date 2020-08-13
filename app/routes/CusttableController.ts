import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { CusttableService } from "../services/CusttableService";
import { OverDueService } from "../services/OverDueService";
import { RawQuery } from "../common/RawQuery";

export class CusttableController {
  private componentName: String = "Customers";
  private router: Router = Router();
  private service = new CusttableService();
  private overDueService = new OverDueService();
  private rawQuery = new RawQuery();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/:id/creditlimitavailable", async (request: Request, response: Response) => {
      try {
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);

        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          const params: any = request.params;
          let id: any = params.id;
          const availableLimit = await this.service.getAvailableCreditLimit(id);
          const foo = await this.rawQuery.getPaymTermDays("W45");
          console.log(foo);
          response.json({ availableLimit });
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        console.log(this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          if (reqData == "paginate") {
            let params: any = request.query;
            if (!params.skip) {
              params.skip = 1;
            }
            if (!params.take) {
              params.take = 10;
            }

            let result: any = await this.service.paginate(params);
            if (result.data.length > 0) {
              response.json({ totalCount: result.count, data: result.data });
            } else {
              response.json({ totalCount: 0, data: result.data });
            }
          } else if (reqData == "defaultcustomer") {
            result = await this.service.entity(request.body.sessionInfo.defaultcustomerid);
            result.accountnum = null;
            result.name = null;
            result.address = null;
            result.phone = null;
            // result.currency = null;
            result.rcusttype = null;
            result.contactpersonid = null;
            result.custcountry = null;
            result.city = null;
            result.street = null;
            result.districtcode = null;
            result.citycode = null;
            result.county = null;
            result.namealias = null;
            response.send({ status: 1, data: result });
          } else if (reqData == "getdefaultcustomer") {
            result = await this.service.entity(request.body.sessionInfo.defaultcustomerid);
            response.send({ status: 1, data: result });
          } else {
            result = await this.service.entity(reqData);
            response.send({ status: 1, data: result });
          }
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Search", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.search(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/paginate/customerdetails", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        let id = params.id;
        id = request.params ? id : null;
        let reqData = request.body ? request.body.data : {};

        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.mobile_paginate(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.put("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Save", this.service.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_WRITE)) {
          result = await this.service.save(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.delete("/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id = params.id;
        reqData = request.params ? id : null;
        console.log(this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.delete(reqData);
          response.send({ status: 1, data: result });
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    return this.router;
  }
}
