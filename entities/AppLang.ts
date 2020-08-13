import {Entity, PrimaryColumn, Column, ManyToOne, JoinColumn} from "typeorm";


@Entity("app_lang")
export class AppLang {
    @PrimaryColumn({name: "id"})
    id: string;

    @Column({name: "en"})
    en: string;

    @Column({name: "ar"})
    ar: string;

    @Column({name: "updated_by"})
    updatedBy: string;

    @Column({name: "updated_on"})
    updatedOn: Date;

}

