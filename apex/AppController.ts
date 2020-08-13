import { Router } from "express";
import { LoadController } from "./LoadController";
import { CacheController } from "./CacheController";
import { AppReport } from "./AppReport";
import { WebController } from "./WebController";
import * as fs from "fs";
import { log } from "../utils/Log";
import { AccountsTableController } from "../app/routes/AccountsTableController";
import { AuthController } from "../app/routes/AuthController";
import { BaseSizeColorsController } from "../app/routes/BaseSizeColorsController";
import { BaseSizesController } from "../app/routes/BaseSizesController";
import { BasesController } from "../app/routes/BasesController";
import { ColorsController } from "../app/routes/ColorsController";
import { CusttableController } from "../app/routes/CusttableController";
import { DesignerProductsController } from "../app/routes/DesignerProductsController";
import { DesignerserviceController } from "../app/routes/DesignerserviceController";
import { FiscalYearCloseController } from "../app/routes/FiscalYearCloseController";
import { FiscalYearController } from "../app/routes/FiscalYearController";
import { FixedAssetGroupController } from "../app/routes/FixedAssetGroupController";
import { FixedAssetTableController } from "../app/routes/FixedAssetTableController";
import { GeneralJournalController } from "../app/routes/GeneralJournalController";
import { InventtransController } from "../app/routes/InventtransController";
import { LedgerJournalTransController } from "../app/routes/LedgerJournalTransController";
import { MenuController } from "../app/routes/MenuController";
import { MenuGroupController } from "../app/routes/MenuGroupController";
import { OverDueController } from "../app/routes/OverDueController";
import { PhoneVerificationController } from "../app/routes/PhoneVerificationController";
import { PriceController } from "../app/routes/PriceController";
import { ProductsController } from "../app/routes/ProductsController";
import { RedeemController } from "../app/routes/RedeemController";
import { SalesLineController } from "../app/routes/SalesLineController";
import { SalesTableController } from "../app/routes/SalesTableController";
import { TransferOrderFromAxaptaController } from "../app/routes/TransferOrderFromAxaptaController";
import { UserGroupController } from "../app/routes/UserGroupController";
import { UserInfoController } from "../app/routes/UserInfoController";
import { UsergroupConfigController } from "../app/routes/UsergroupConfigController";
import { VisitCustomerController } from "../app/routes/VisitCustomerController";
import { WorkflowController } from "../app/routes/WorkflowController";

export class AppController {
  private router: Router = Router();
  routes = fs.readdirSync(`${__dirname}/../app/routes`);

  async getRouter() {
    this.router.use("/load", await new LoadController().getRouter());
    this.router.use("/report", await new AppReport().getRouter());
    this.router.use("/cache", await new CacheController().getRouter());
    this.router.use("/web", await new WebController().getRouter());

    // this.router.use("/accountstable", await new AccountsTableController().getRouter());
    // this.router.use("/auth", await new AuthController().getRouter());
    // this.router.use("/basesizecolors", await new BaseSizeColorsController().getRouter());
    // this.router.use("/basesizes", await new BaseSizesController().getRouter());
    // this.router.use("/bases", await new BasesController().getRouter());
    // this.router.use("/colors", await new ColorsController().getRouter());
    // this.router.use("/custtable", await new CusttableController().getRouter());
    // this.router.use("/designerproducts", await new DesignerProductsController().getRouter());
    // this.router.use("/designerservice", await new DesignerserviceController().getRouter());
    // this.router.use("/fiscalyearclose", await new FiscalYearCloseController().getRouter());
    // this.router.use("/fiscalyear", await new FiscalYearController().getRouter());
    // this.router.use("/fixedassetgroup", await new FixedAssetGroupController().getRouter());
    // this.router.use("/fixedassettable", await new FixedAssetTableController().getRouter());
    // this.router.use("/generaljournal", await new GeneralJournalController().getRouter());
    // this.router.use("/inventtrans", await new InventtransController().getRouter());
    // this.router.use("/ledgerjournaltrans", await new LedgerJournalTransController().getRouter());
    // this.router.use("/menu", await new MenuController().getRouter());
    // this.router.use("/menugroup", await new MenuGroupController().getRouter());
    // this.router.use("/overdue", await new OverDueController().getRouter());
    // this.router.use("/phoneverification", await new PhoneVerificationController().getRouter());
    // this.router.use("/price", await new PriceController().getRouter());
    // this.router.use("/products", await new ProductsController().getRouter());
    // this.router.use("/redeem", await new RedeemController().getRouter());
    // this.router.use("/salesline", await new SalesLineController().getRouter());
    // this.router.use("/salestable", await new SalesTableController().getRouter());
    // this.router.use("/transferorderfromaxapta", await new TransferOrderFromAxaptaController().getRouter());
    // this.router.use("/usergroup", await new UserGroupController().getRouter());
    // this.router.use("/userinfo", await new UserInfoController().getRouter());
    // this.router.use("/usergroupconfig", await new UsergroupConfigController().getRouter());
    // this.router.use("/visitcustomer", await new VisitCustomerController().getRouter());
    // this.router.use("/workflow", await new WorkflowController().getRouter());
    let route: any;
    for (route of this.routes) {
      route = route.slice(0, -3);
      let path = `/${route.replace("Controller", "").toLowerCase()}`;
      let action = `../app/routes/${route}`;
      var ns = await import(action);
      log.info(path);
      this.router.use(path, new ns[route]().getRouter());
    }
    return this.router;
  }
}
