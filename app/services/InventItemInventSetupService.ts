import { Repository } from "typeorm";
import { InventItemInventSetupDAO } from "../repos/InventItemInventSetupDAO";

export class InventItemInventSetupService {
  public sessionInfo: any;

  private inventItemInventSetupRepository: InventItemInventSetupDAO;
  constructor() {
    this.inventItemInventSetupRepository = new InventItemInventSetupDAO();
  }

  async search(reqData: any) {
    try {
        return await this.inventItemInventSetupRepository.find(reqData);
    } catch (error) {
      throw error;
    }
  }
}
