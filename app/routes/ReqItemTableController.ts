import { Router, Request, Response } from "express";
import { ReqItemTableService } from "../services/ReqItemTableService";

export class ReqItemTableController {
  private router: Router = Router();
  private service: ReqItemTableService;
  constructor() {
    this.service = new ReqItemTableService();
  }
  getRouter(): Router {
    this.router.get("/search", async (request: Request, response: Response) => {
      try {
        let result: any = null;
        this.service.sessionInfo = request.body.sessionInfo;
        if (request.query && request.query.id) {
          result = await this.service.entity(request.body.data.id);
        } else {
          console.log(request.query);
          let query: any = request.query;
          result = await this.service.search(query);
        }
        response.send({ status: 1, data: result });
        // return {data: result};
      } catch (error) {
        console.log(error);
        response.send({ status: 0, error: error });
        // return {error: error};
      }
    });
    return this.router;
  }
}
