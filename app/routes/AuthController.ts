import { Router, Request, Response } from "express";
import { App } from "../..//utils/App";
import { AuthService } from "../services/AuthService";
import { log } from "../../utils/Log";

export class AuthController {
  private router: Router = Router();
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }
  checkProceed(request: Request) {}
  getRouter(): Router {
    this.router.get("/forgotpassword", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        reqData = request.query ? request.query : {};
        result = await this.authService.forgotPassword(reqData);
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.put("/resetpassword", async (request: Request, response: Response) => {
      try {
        let reqData: any = request.body.data;
        let result: any = null;
        result = await this.authService.resetPassword(reqData);
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    //signin Controller
    this.router.post("/", async (request: Request, response: Response) => {
      log.info("signin Controller ");
      let reqData: any = request.body;
      let sessionInfo: any = {};
      let result: any = null;
      if (reqData) {
        this.authService.sessionInfo = sessionInfo;
        result = this.authService.signin(reqData);
      } else {
        result = { message: "Invalid Data" };
      }
      //App.Send(request, response, result);
      result.then((data: any) => {
        log.info("signin Controller response");
        response.send(data);
      });
      result.catch((error: any) => {
        log.info("signin Controller error");
        response.send({ status: 0, error: error });
      });
    });
    return this.router;
  }
}
