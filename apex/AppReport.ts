import JsReport from "jsreport-core";
import { Router, Request, Response } from "express";
import * as fs from "fs";
import { log } from "../utils/Log";

export class AppReport {
  private router: Router = Router();
  private service: any = null;
  private jsreport = JsReport();
  private report: Promise<JsReport.Reporter> = null;

  private reports = fs.readdirSync(`${__dirname}/../app/reports`);
  constructor() {
    log.info("AppReport constructor");
    this.jsreport.use(require("jsreport-chrome-pdf")());
    this.jsreport.use(require("jsreport-html-to-xlsx")());
    this.report = this.jsreport.init();
  }
  getRouter(): Router {
    this.router.get("/:code/:type", async (request: Request, response: Response) => {
      try {
        const params: any = request.params;
        // let reqData: any;
        let code = params.code;
        // let code = request.params.code;

        // let type = request.params.type;
        const paramsType: any = request.params;
        let type = paramsType.type;
        let reqData = request.query ? request.query : {};
        console.log(reqData);
        let resData: any = null;
        log.info("report: " + code + " --> type: " + type);
        let report: any;
        let dataFound: boolean = false;
        for (report of this.reports) {
          report = report.slice(0, -3);
          if (report.toLowerCase() == code + "report") {
            dataFound = true;
            let action = `../app/reports/${report}`;
            var ns = await import(action);
            reqData.session = request.body.sessionInfo;
            this.service = await new ns[report]();
            this.service.sessionInfo = request.body.sessionInfo;
            resData = await this.service.execute(reqData);
            if (type != "data") {
              reqData.type = type;
              resData = await this.service.report(resData, reqData);
            }
            break;
          }
        }
        if (dataFound == true) {
          if (type == "data") {
            response.send({ status: 1, data: resData });
          } else if (type == "html") {
            this.report
              .then(() => {
                return this.jsreport
                  .render({
                    template: {
                      content: resData,
                      engine: "none",
                      recipe: "html",
                    },
                  })
                  .then((out) => {
                    out.stream.pipe(response);
                  })
                  .catch((err) => {
                    log.error(err);
                    throw err;
                  });
              })
              .catch((err) => {
                log.error(err);
                throw err;
              });
          } else if (type == "excel") {
            this.report
              .then(() => {
                return this.jsreport
                  .render({
                    template: {
                      content: resData,
                      engine: "none",
                      recipe: "html-to-xlsx",
                    },
                  })
                  .then((out) => {
                    response.set({
                      "Content-Type": "application/vnd.ms-excel",
                      // instead of report.xlsx you can use any name you want, for example test.xlsx, etc
                      "Content-Disposition": 'attachment; filename="report.xlsx',
                    });
                    out.stream.pipe(response);
                  })
                  .catch((err) => {
                    log.error(err);
                    throw err;
                  });
              })
              .catch((err) => {
                log.error(err);
                throw err;
              });
          }
        } else {
          throw { message: "No Report Found!!!" };
        }
      } catch (error) {
        log.error(error);
        error = typeof error == "string" ? { message: error } : error;
        response.send({ status: 0, error: error });
      }
    });
    return this.router;
  }

  // async getRouter() {
  //     await this.routes.forEach(async route => {
  //         route = route.slice(0, -3);
  //         let path = `/${route.replace("Controller", "").toLowerCase()}`;
  //         let action = `../app/routes/${route}`;
  //         var ns = await import(action);
  //         this.router.use(path, new ns[route]().getRouter());
  //     });
  //     this.router.use("/load", new AccessLoadController().getRouter());
  //     return this.router;
  // }
}
