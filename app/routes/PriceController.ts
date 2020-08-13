import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { DiscountService } from "../services/DiscountService";
import { ReturnOrderAmountService } from "../services/ReturnOrderAmountService";
import { PriceService } from "../services/PriceService";

export class PriceController {
  private componentName: String = "SalesTable";
  private router: Router = Router();
  private discountService = new DiscountService();
  private returnOrderAmountService = new ReturnOrderAmountService();
  private priceService = new PriceService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.post("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.priceService.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.priceService.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.priceService.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.priceService.getPrice(reqData);
        } else {
          throw this.priceService.sessionInfo ? this.priceService.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/getSizePrices", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.priceService.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.priceService.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.priceService.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.priceService.getPrices(reqData);
        } else {
          throw this.priceService.sessionInfo ? this.priceService.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/discount", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.discountService.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.discountService.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.discountService.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.discountService.getDiscount(reqData);
        } else {
          throw this.discountService.sessionInfo ? this.discountService.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/returnorderamount", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.returnOrderAmountService.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.returnOrderAmountService.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (
          await App.ValildateUserAccess(
            this.returnOrderAmountService.sessionInfo,
            this.componentName,
            Props.ACCESS_READ
          )
        ) {
          // result = await this.service.calculateReturnAmount(reqData, null);
          result = await this.returnOrderAmountService.returnAmount(reqData, null);
        } else {
          throw this.discountService.sessionInfo ? this.discountService.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/purchasereturnorderamount", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.returnOrderAmountService.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.returnOrderAmountService.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (
          await App.ValildateUserAccess(
            this.returnOrderAmountService.sessionInfo,
            this.componentName,
            Props.ACCESS_READ
          )
        ) {
          result = await this.returnOrderAmountService.returnAmount(reqData, "purchasereturn");
        } else {
          throw this.discountService.sessionInfo ? this.discountService.sessionInfo : { message: Props.TOKEN_MESSAGE };
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
