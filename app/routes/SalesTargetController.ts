import { Router, Request, Response } from "express";
import { SalestargetService } from "../services/SalestargetService";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";

export class SalesTargetController {
  private componentName: String = "SalesTarget";
  private router: Router = Router();
  private service = new SalestargetService();

  moduleName() {
    return this.constructor.name;
  }
  getRouter(): Router {
    this.router.get("/search", async (request: Request, response: Response) => {
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
    this.router.get("/search/top20", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Search", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        console.log(reqData);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.searchTop20(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });
    this.router.get("/search/criticalinventory", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Search", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        console.log(reqData);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.seachCriticalItems(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    return this.router;
  }
}
