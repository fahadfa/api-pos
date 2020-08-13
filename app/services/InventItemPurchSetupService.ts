import { InventItemPurchSetupDAO } from "../repos/InventItemPurchSetupDAO";

export class InventItemPurchSetupService {
  public sessionInfo: any;

  private inventPurchInventSetupRepository: InventItemPurchSetupDAO;
  constructor() {
    this.inventPurchInventSetupRepository = new InventItemPurchSetupDAO();
  }

  async search(reqData: any) {
    try {
        return await this.inventPurchInventSetupRepository.find(reqData);
    } catch (error) {
      throw error;
    }
  }
}
