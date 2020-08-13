import { getManager } from "typeorm";
import { App } from "../..//utils/App";
import * as Config from "../../utils/Config";

export class WebService {
    public sessionInfo: any;
    private db: any;
    private transporter: any;

    constructor() {
        this.db = getManager();
        this.transporter = App.CreateEmailAccount();
    }

    async feedback(reqData: any) {
        try {
            const mailOptions = {
                from: Config.mailOptions.user,
                to: "admin@abcd.com",
                subject: "Feed backlink",
                html: App.HtmlRender("Feedback", {
                    data: {}
                })
            };
            this.transporter.sendMail(mailOptions, (err: any, info: any) => {
                // return Promise.resolve({ message: "Mail Sent Successfully" });
                if (err) {
                    return Promise.reject(err);
                }
                console.log(info);
            });
        } catch (error) {
            return Promise.reject({
                message: "Technical issue in Resetting Password, Sorry for Inconvience"
            });
        }
    }
}
