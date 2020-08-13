import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { OverDueService } from "../services/OverDueService";

export class OverDueController {
  private componentName: String = "OverDue";
  private router: Router = Router();
  private service = new OverDueService();

  getRouter(): Router {
    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Entity", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.entity(id);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/creditused/:id", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Entity", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.getCreditUsed(id);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.search(id);
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
