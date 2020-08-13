import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { BaseSizesService } from "../services/BaseSizesService";

export class BaseSizesController {
  private router: Router = Router();
  private service = new BaseSizesService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        console.log(this.service.sessionInfo);
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

    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.entity(reqData);
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
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Save", this.service.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_WRITE)) {
          result = await this.service.getbaseSizes(reqData);
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
