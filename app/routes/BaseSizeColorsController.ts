import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { BaseSizeColorsService } from "../services/BaseSizeColorsService";
var csv = require("csvtojson");
const excelToJson = require("convert-excel-to-json");

export class BaseSizeColorsController {
  private router: Router = Router();
  private service = new BaseSizeColorsService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Search", this.service.sessionInfo);
        reqData = request.query ? request.query : {};
        if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
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

    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        // if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
        if (reqData == "basesizecolor") {
          let params: any = request.query ? request.query : {};
          result = await this.service.getBaseSizeColor(params);
        } else if ((reqData = "getcolorprices")) {
          let params: any = request.query ? request.query : {};
          if (!params.skip) {
            params.skip = 0;
          }
          if (!params.take) {
            params.take = 10;
          }
          result = await this.service.paginate(params);
        } else {
          result = await this.service.entity(reqData);
        }
        // } else {
        //     throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        // }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.post("/uploadcsv", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "uploadcsv", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.files ? request.files : null;
        // console.log(reqData)
        let list: any;
        if (reqData["file"].mimetype == "text/csv") {
          list = await csv().fromString(reqData["file"].data.toString());
          // console.log(list)
        } else if (reqData["file"].mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          // list = 'excel list'
          list = excelToJson({
            source: reqData["file"].data,
            header: {
              rows: 1,
            },
            columnToKey: {
              "*": "{{columnHeader}}",
            },
          });
          let keys = Object.keys(list);
          list = list[keys[0]];
        } else {
          list = await csv().fromString(reqData["file"].data.toString());
          // console.log(list)
        }
        result = await this.service.save(list);
        // console.log(reqData["file"].data)
        // if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
        //     if (reqData == "basesizecolor") {
        //         let params = request.query ? request.query : {};
        //         result = await this.service.getBaseSizeColor(params);
        //     } else {
        //         result = await this.service.entity(reqData);
        //     }
        // } else {
        //     throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        // }
        response.send({ status: 1, data: result });
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

    this.router.put("/", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Save", this.service.sessionInfo);
        reqData = request.body ? request.body.data : {};
        // if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_WRITE)) {
        result = await this.service.save([reqData]);
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
