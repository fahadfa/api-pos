import { Router, Response } from "express";
import swaggerJSDoc = require("swagger-jsdoc");
import swaggerUi = require("swagger-ui-express");
import { readdirSync, statSync } from "fs";
import path = require("path");

export class APIDocs {
  private router: Router = Router();
  public config: any = null;
  getRouter(): Router {
    var options = {
      customCss: ".swagger-ui .topbar { display: none }  .info{ display: none}"
    };

    const swaggerSpec = this.apiDocsConfig();
    this.router.use(
      "/",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, options)
    );
    return this.router;
  }

  private getHost(req: any, needProtype: boolean) {
    return `${needProtype ? "http://" : ""}${req.headers.host}`;
  }

  private apiDocsConfig(host?: string): any {
    const apiList: Array<string> = APIDocs.getAllRoutes(
      path.join(__dirname, "./../assets/spec"),
      []
    );
    const spec = swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: "Spec",
          version: "1.0.0"
        },
        host: host,
        //Prefix as dledursc
        basePath: "/api/",
        produces: ["application/json"],
        consumes: ["application/x-www-form-urlencoded", "application/json"],
        securityDefinitions: {
          jwt: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
          }
        },
        security: [{ jwt: [] }]
      },
      apis: apiList
    });

    return spec;
  }

  private static getAllRoutes(
    dir: string,
    filelist: Array<string>
  ): Array<string> {
    const _files = readdirSync(dir);
    filelist = filelist || [];

    _files.map(function(file) {
      // filter out .map and hidden files
      if (file.search(".map") < 0 && file.search(/^\./) < 0) {
        if (statSync(path.join(dir, file)).isDirectory()) {
          filelist = APIDocs.getAllRoutes(path.join(dir, file), filelist);
        } else {
          if (file.search(".yaml") > 0) {
            filelist.push(path.join(dir, file));
          }
        }
      }
    });

    return filelist;
  }
}
