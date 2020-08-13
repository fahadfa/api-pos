import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Files } from "../entities/Files";

@Entity("products")
export class Products {
    @PrimaryColumn({ name: "id" })
    id: string;

    @Column({ name: "name_ar" })
    nameArabic: string;

    @Column({ name: "name_en" })
    nameEnglish: string;

    // @Column({ name: "general_info_en" })
    // generalInfoEn: string;

    // @Column({ name: "description_en" })
    // descriptionEn: string;

    // @Column({ name: "description_short_en" })
    // descriptionShortEn: string;

    // @Column({ name: "features_en" })
    // featuresEn: string;

    // @Column({ name: "specs_en" })
    // specsEn: string;

    // @Column({ name: "general_info_ar" })
    // generalInfoAr: string;

    // @Column({ name: "description_ar" })
    // descriptionAr: string;

    // @Column({ name: "description_short_ar" })
    // descriptionShortAr: string;

    // @Column({ name: "features_ar" })
    // featuresAr: string;

    // @Column({ name: "specs_ar" })
    // specsAr: string;

    // @Column({ name: "dry_time_en" })
    // dryTimeEn: Number;

    // @Column({ name: "dry_time_ar" })
    // dryTimeAr: Number;

    // @Column({ name: "recoat_time_ar" })
    // recoatTimeAr: Number;

    // @Column({ name: "recoat_time_en" })
    // recoatTimeEn: Number;

    // @Column({ name: "coverage_en" })
    // coverageEn: string;

    // @Column({ name: "coverage_ar" })
    // coverageAr: string;

    // @Column({ name: "resin_type_en" })
    // resignTypeEn: string;

    // @Column({ name: "resin_type_ar" })
    // resignTypeAr: string;

    // @Column({ name: "recommended_for_en" })
    // recommendedForEn: string;

    // @Column({ name: "recommended_for_ar" })
    // recommendedForAr: string;

    // @Column({ name: "surface_type_en" })
    // surfaceTypeEn: string;

    // @Column({ name: "surface_type_ar" })
    // surfaceTypeAr: string;

    // @Column({ name: "painting_system_en" })
    // paintingSystemEn: string;

    // @Column({ name: "painting_system_ar" })
    // paintingSystemAr: string;

    // @Column({ name: "application_tools_en" })
    // applicationToolsEn: string;

    // @Column({ name: "thinner_en" })
    // thinnerEn: string;

    // @Column({ name: "thinner_ar" })
    // thionnerAr: string;

    // @Column({ name: "recoat_time" })
    // recoatTime: string;

    // @Column({ name: "dry_time" })
    // dryTime: string;

    // @Column({ name: "coverage" })
    // coverage: Number;

    // @Column({ name: "resin_type" })
    // resinType: string;

    @Column({ name: "code" })
    code: string;

    // @Column({ name: "rating" })
    // rating: Number;

    @Column({ name: "active" })
    active: boolean;

    @Column({ name: "dataareaid" })
    dataareaid: string;

    // @Column({ name: "can_img_id" })
    // canImgId: Number;

    @Column({ name: "image_ids" })
    imageIds: string;

    // @JoinColumn({ name: "image_ids" })
    // @ManyToOne(type => Files)
    // images: Files;

    // @JoinColumn({ name: "can_img_id" })
    // @ManyToOne(type => Files)
    // canImages: Files;
}
