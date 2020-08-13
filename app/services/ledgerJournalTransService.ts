import { App } from "../../utils/App";
import { Props } from "../../constants/Props";
import { Menu } from "../../entities/Menu";
import { LedgerJournalTransDAO } from "../repos/LedgerJournalTransDAO";

export class ledgerJournalTransService {
    public sessionInfo: any;
    private ledgerJournalTransDAO: LedgerJournalTransDAO;

    constructor() {
        this.ledgerJournalTransDAO = new LedgerJournalTransDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.ledgerJournalTransDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            // item.dataareaid = this.sessionInfo.dataareaid;
            let data: any = await this.ledgerJournalTransDAO.search(item);
            return data;
        } catch (error) {
            throw error;
        }
    }
}
