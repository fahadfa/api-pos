import { Router, Request, Response } from "express";
import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { ledgerJournalTransService } from "../services/ledgerJournalTransService";

export class LedgerJournalTransController {
  private componentName: String = "GeneralJournal";
  private router: Router = Router();
  private service = new ledgerJournalTransService();

  moduleName() {
    return this.constructor.name;
  }

  getRouter(): Router {
    this.router.get("/:id", async (request: Request, response: Response) => {
      try {
        let reqData: any;
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        App.PrintLog(this.moduleName(), "Entity", this.service.sessionInfo);
        const params: any = request.params;
        let id: any = params.id;
        reqData = request.params ? id : null;
        if (reqData == "paginate") {
          if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
            let data: any[] = await this.service.search({});
            let count: any = request.query.count ? request.query.count : 10;
            const pageCount: any = Math.ceil(data.length / count);
            let page: any = request.query.page;
            page = parseInt(page);
            if (!page) {
              page = 1;
            }
            if (page > pageCount) {
              page = pageCount;
            }
            response.json({
              page: page,
              pageCount: pageCount,
              customers: data.slice(page * count - count, page * count),
            });
          } else {
            throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
          }
        } else if (await App.ValildateUserAccess(this.service.sessionInfo, this.moduleName(), Props.ACCESS_READ)) {
          result = await this.service.entity(reqData);
          response.send({ status: 1, data: result });
        } else {
          throw this.service.sessionInfo ? this.service.sessionInfo : { message: Props.TOKEN_MESSAGE };
        }
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
      }
    });

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

    return this.router;
  }
}
