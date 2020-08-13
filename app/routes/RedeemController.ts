import { Request, Response, Router } from "express";
import { Props } from "../../constants/Props";
import { App } from "../../utils/App";
import { RedeemService } from "../../app/services/RedeemService";

export class RedeemController {
  private componentName: String = "Redeem";
  private router: Router = Router();
  private service = new RedeemService();

  getRouter(): Router {
    this.router.get("/getcustomerpoints", async (request: Request, response: Response) => {
      try {
        if (await App.checkInternet()) {
          let reqData: any;
          this.service.sessionInfo = request.body.sessionInfo;
          let result: any = null;
          App.PrintLog(this.constructor.name, "Redeem", this.service.sessionInfo);
          reqData = request.query ? request.query : {};
          if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
            result = await this.service.getCustomerPoints(reqData);
          } else {
            throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
          }
          result.status = 1;
          response.send({ status: 1, data: result });
        } else {
          throw { message: "PLEASE_CHECK_YOUR_INTENET_CONNECTION" };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: { message: "No redeem points" } });
      }
    });

    this.router.get("/getcustomerslabs", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Redeem", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.getCustomerSlabs(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        result.status = 1;
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/getactiveslabs", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Redeem", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.getActiveSlabs(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        result.status = 1;
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.get("/getotp", async (request: Request, response: Response) => {
      try {
        if (await App.checkInternet()) {
          let reqData: any;
          this.service.sessionInfo = request.body.sessionInfo;
          let result: any = null;
          App.PrintLog(this.constructor.name, "Redeem", this.service.sessionInfo);
          reqData = request.query ? request.query : {};
          // reqData = request
          if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
            result = await this.service.getOtp(reqData);
          } else {
            throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
          }
          result.status = 1;
          response.send({ status: 1, data: result });
        } else {
          throw { message: "PLEASE_CHECK_YOUR_INTENET_CONNECTION" };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: { message: "PLEASE_CHECK_YOUR_INTENET_CONNECTION" } });
      }
    });

    this.router.post("/validateotp", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Search", this.service.sessionInfo);
        reqData = request.body ? request.body.data : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.validateOtp(reqData);
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        result.status = 1;

        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });
    this.router.get("/gettoken", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        this.service.sessionInfo = request.body.sessionInfo;
        let result: any = null;
        App.PrintLog(this.constructor.name, "Redeem", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.componentName, Props.ACCESS_READ)) {
          result = await this.service.getToken();
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: { message: error } });
      }
    });

    return this.router;
  }
}
