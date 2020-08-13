import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { OpeningBalanceService } from "../services/OpeningBalanceService";

export class OpeningBalanceController {
  private componentName: String = "OpeningBalance";
  private router: Router = Router();
  private service = new OpeningBalanceService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/checkdatacomplete", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        let reqData: any = request.query ? request.query : {};
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.check_data_complete();
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        let reqData: any = request.body ? request.body.data : {};
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.getOpeningBalance(reqData);
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
        let result: any = null;
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

    return this.router;
  }
}
