import { App } from "../../utils/App";
import { BankAccountTable } from "../../entities/BankAccountTable";
import { BankAccountTableDAO } from "../repos/BankAccountTableDAO";
import { LedgerJournalTransDAO } from "../repos/LedgerJournalTransDAO";
import { GeneralJournalService } from "../services/GeneralJournalService";

import { Props } from "../../constants/Props";
import { GeneralJournal } from "../../entities/GeneralJournal";
import { Between } from "typeorm";

export class ReceiptsService {
  public sessionInfo: any;
  private bankAccountTableDAO: BankAccountTableDAO;
  private ledgerJournalTransDAO: LedgerJournalTransDAO;
  private generalJournalService: GeneralJournalService;

  constructor() {
    this.bankAccountTableDAO = new BankAccountTableDAO();
    this.ledgerJournalTransDAO = new LedgerJournalTransDAO();
    this.generalJournalService = new GeneralJournalService();
  }

  async entity(id: string) {
    try {
      this.generalJournalService.sessionInfo = this.sessionInfo;
      let data: any = await this.generalJournalService.entity(id);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async search(item: any) {
    try {
      if (item.fromDate && item.toDate) {
        item.cashdate = Between(new Date(item.fromDate).toISOString(), new Date(item.toDate).toISOString());
      }
      this.generalJournalService.sessionInfo = this.sessionInfo;
      let data: any = await this.generalJournalService.search(item);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async save(item: GeneralJournal) {
    try {
      this.generalJournalService.sessionInfo = this.sessionInfo;
      let data: any = await this.generalJournalService.save(item);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
