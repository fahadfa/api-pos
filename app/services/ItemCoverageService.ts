import { ItemCoverageDAO } from "../repos/ItemCoverageDAO";

export class ItemCoverageService{
    public sessionInfo: any;
    private itemCoverageDAO: ItemCoverageDAO;

    constructor() {
        this.itemCoverageDAO = new ItemCoverageDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.itemCoverageDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            // item.dataareaid = this.sessionInfo.dataareaid;
            let data: any = await this.itemCoverageDAO.search(item);
            return data;
        } catch (error) {
            throw error;
        }
    }
}