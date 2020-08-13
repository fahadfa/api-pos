import express from "express";
import bodyParser, { json, urlencoded } from "body-parser";
import { APIDocs } from "./ApiDocs";
import { AppController } from "./AppController";
import { App } from "../utils/App";
import { log } from "../utils/Log";
import fileUpload from "express-fileupload";

export default class AppExpress {
  public express: any;

  constructor() {
    this.express = express();
    this.express.use(json({ limit: "150mb" }));
    this.express.use(fileUpload());
    // this.express.use(bodyParser.json({limit: '150mb'}))
    this.errorHandle();
    this.chunkDataHandle();
    this.mountRoutes();
  }

  public async mountRoutes() {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({
        message: "Hello World! Website Applications",
      });
    });
    this.express.use("/", router);

    let apiDocs = new APIDocs();
    this.express.use("/apidocs", apiDocs.getRouter());

    let appController = new AppController();
    this.express.use("/api", await appController.getRouter());
  }

  private chunkDataHandle(): void {
    this.express.all("*", (req: any, res: express.Response, next: any) => {
      log.info("----------------> req.url: " + req.url);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
      res.setHeader("Access-Control-Allow-Headers", "accept, Content-Type, Authorization");
      if (
        req.headers["content-type"] &&
        req.headers["content-type"].indexOf("application/x-www-form-urlencoded") > -1
      ) {
        this.parsePost(req, (data: any) => {
          if (data && data != "") {
            req.body = data;
          }
          this.addSessionInfo(req);
          next();
        });
      } else {
        this.addSessionInfo(req);
        next();
      }
    });
  }

  private addSessionInfo = (req: any) => {
    log.info("-----------------------------------------------------");
    let sessionInfo = App.DecodeJWT(req.headers["authorization"]);
    log.info("sessionInfo: ", sessionInfo);
    log.info("-----------------------------------------------------");
    if (!req.body) {
      req.body = {};
    }
    if (sessionInfo) {
      req.body.sessionInfo = sessionInfo.identity;
    }
  };

  private parsePost(req: express.Request, callback: any) {
    var data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (data != "") {
        data = JSON.parse(data);
      }
      callback(data);
    });
  }

  private errorHandle(): void {
    this.express.use(
      (
        err: Error & { status: number },
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ): void => {
        //response.status(err.status || 500);
        response.json({
          status: 0,
          error: {
            code: err.status,
            message: "Server side error",
          },
        });
      }
    );
  }

  getServer() {
    return require("http").Server(this.express);
  }
}
