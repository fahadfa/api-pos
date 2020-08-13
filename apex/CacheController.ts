import { Router, Request, Response } from "express";
import { App } from "../utils/App";
import { Props } from "../constants/Props";
import { CacheService } from "../app/common/CacheService";

export class CacheController {
  private router: Router = Router();
  private service: any = new CacheService();

  getRouter(): Router {
    this.router.get("/:code", async (request: Request, response: Response) => {
      try {
        let reqData: any;

        const params: any = request.params;
        let code = params.code;

        // let code = request.params.code;
        console.log("Cache ------- " + code);
        reqData = request.query ? request.query : {};
        // if (request.body.sessionInfo) reqData.session = request.body.sessionInfo;
        // this.service.sessionInfo = request.body.sessionInfo;
        // App.PrintLog(this.constructor.name, code, this.service.sessionInfo);
        let result = null;
        console.log(reqData);
        //if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
        result = await this.service[code](reqData);

        // } else {
        //     throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        // }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });
    return this.router;
  }
}
