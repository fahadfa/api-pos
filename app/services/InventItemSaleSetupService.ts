import { InventItemSalesSetupDAO } from "../repos/InventItemSalesSetupDAO";

export class InventItemSaleSetupService {
  public sessionInfo: any;

  private inventItemSalesSetupRepository: InventItemSalesSetupDAO;
  constructor() {
    this.inventItemSalesSetupRepository = new InventItemSalesSetupDAO();
  }

  async search(reqData: any) {
    try {
        let result= await this.inventItemSalesSetupRepository.find(reqData);
        // console.log(result);
        return result
    } catch (error) {
      throw error;
    }
  }
}
