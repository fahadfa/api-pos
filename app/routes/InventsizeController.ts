import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { InventsizeService } from "../services/InventsizeService";

export class InventsizeController {
  private componentName: String = "Products";
  private router: Router = Router();
  private service = new InventsizeService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let id: any = params.id;
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        App.PrintLog(this.constructor.name, "Entity", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          if (id == "salesorderpagesizes") {
            let reqData = request.query ? request.query : {};
            result = await this.service.searchSalesOrderSizes(reqData);
          } else if ((id = "sizeswithnoprice")) {
            let reqData = request.query ? request.query : {};
            result = await this.service.searchSizesWithNoPrice(reqData);
          } else {
            result = await this.service.entity(id);
          }
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/salesorderpagesizes", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let reqData: any = request.body ? request.body.data : {};
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.searchSalesOrderSizes(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/sizeswithnoprice", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let reqData: any = request.body ? request.body.data : {};
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.searchSizesWithNoPrice(reqData);
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
        let reqData: any = request.query ? request.query : {};
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
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

    this.router.post("/", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        let reqData: any = request.body ? request.body.data : {};
        // const id: any = request.params.id;
        this.service.sessionInfo = request.body.sessionInfo;
        let result = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
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

    return this.router;
  }
}
