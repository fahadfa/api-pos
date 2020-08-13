import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { SalesTableService } from "../services/SalesTableService";

export class EcommerceController {
  private componentName: String = "SalesLine";
  private router: Router = Router();
  private service = new SalesTableService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/orderdetails/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        // if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
        result = await this.service.ecommerceEntity(reqData);
        // } else {
        //     throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        // }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });
    this.router.post("/orderdetails/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        // if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
        result = await this.service.ecommerceEntity(reqData);
        // } else {
        //     throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        // }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    // this.router.get("/", async (request: Request, response: Response) => {
    //     try {
    //         const id: any = request.query;
    //         this.service.sessionInfo = request.body.sessionInfo;
    //         let result = null;
    //         let reqData = request.query ? request.query : {};
    //         App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
    //         if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
    //             result = await this.service.search(reqData);
    //         } else {
    //             throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
    //         }
    //         response.send({ status: 1, data: result });
    //     } catch (error) {
    //         console.log(error);
    //         response.send({ status: 0, error: error });
    //     }
    // });

    this.router.post("/updatepaymentstatus/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Save", this.service.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_WRITE)) {
          result = await this.service.onlineInvoicePaymentService(reqData);
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
