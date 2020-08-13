import { App } from "../../utils/App";
import { BaseSizeColors } from "../../entities/BaseSizeColors";
import { ColorsDAO } from "../repos/ColorsDAO";
import { BasesDAO } from "../repos/BasesDAO";
import { BaseSizesDAO } from "../repos/BaseSizesDAO";
import { BaseSizeColorsDAO } from "../repos/BaseSizeColorsDAO";
import { RawQuery } from "../common/RawQuery";
import { Props } from "../../constants/Props";

export class BaseSizeColorsService {
    public sessionInfo: any;
    private baseSizeColorsDAO: BaseSizeColorsDAO;
    private rawQuery: RawQuery;
    private baseSizesDAO: BaseSizesDAO;

    constructor() {
        this.baseSizeColorsDAO = new BaseSizeColorsDAO();
        this.rawQuery = new RawQuery();
        this.baseSizesDAO = new BaseSizesDAO();
    }

    async entity(id: string) {
        try {
            let data: any = await this.baseSizeColorsDAO.entity(id);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async search(params: any) {
        try {
            let Items: any = [];
            let reqData = {
                inventlocationid: this.sessionInfo.inventlocationid,
                baseId: params.baseId
            };
            if (params.type == "salesorder") {
                let colorIds = await this.rawQuery.checkInventoryForColors(reqData);
                colorIds.map((v: any) => {
                    Items.push(v.id);
                });
            }

            let data: any = await this.baseSizeColorsDAO.search(params, Items);
            let result: any = this.groupBy(data, function(item: any) {
                return [item.colors.id];
            });

            let new_data: any = [];

            // result.map((v: any) => {
            //     new_data.push(v[0]);
            // });
            result.forEach(function(groupitem: any) {
                let new_baseSizes: any = [];
                groupitem.forEach(function(item: any) {
                    item.baseSizes.colorId = item.colors.id;
                    item.baseSizes.itemId = item.baseSizes.base.code;
                    new_baseSizes.push(item.baseSizes);
                });
                groupitem[0].baseSizes = new_baseSizes;
                new_data.push(groupitem[0]);
            });

            return new_data;
            // return data;
        } catch (error) {
            throw error;
        }
    }

    async find(params: any) {
        try {
            let data: any = await this.baseSizeColorsDAO.find(params);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async paginate(item: any) {
        try {
            // if (item == {}) {
            let data = await this.baseSizeColorsDAO.pagination(item);
            // console.log(data)
            return { totalCount: data.count, data: data.data };
        } catch (error) {
            throw error;
        }
    }

    async save(reqData: any) {
        try {
            let data = await this.validate(reqData);
            // console.log(data);
            let colors: any = await this.baseSizeColorsDAO.save(data.successfulRecords);
            // let returnData = { successfulRecords: data.successRecords, failedRecords: data.failedRecords, message: Props.SAVED_SUCCESSFULLY };
            let returnData = { failedRecords: data.failedRecords, message: Props.SAVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(reqData: any) {
        try {
            // console.log(reqData)
            let newData: any = { successfulRecords: [], failedRecords: [], successRecords: [] };
            let colors: any;
            if (reqData.length > 100) {
                colors = await this.baseSizeColorsDAO.find({});
            }
            for (let d of reqData) {
                console.log("=============", d);
                // console.log("=============", filterData);
                let color: any;
                if (reqData.length > 100) {
                    color = await colors.filter((v: any) => v.colors.code == d.colorCode && v.baseSizes.sizes.code == d.sizeCode && v.baseSizes.base.code == d.baseCode);
                    color = color.length > 0 ? color[0] : null;
                } else {
                    let filterData = { itemid: d.baseCode, sizeid: d.sizeCode, configid: d.colorCode };
                    color = await this.baseSizeColorsDAO.findOne(filterData);
                }

                let basesizecolorObj: any = {};
                if (color) {
                    basesizecolorObj = color;
                    basesizecolorObj.price = d.price;
                    basesizecolorObj.updatedAt = new Date();
                    newData.successfulRecords.push(basesizecolorObj);
                    newData.successRecords.push(d);
                } else {
                    let size: any = await this.rawQuery.getsizeid(d.sizeCode);
                    let color: any = await this.rawQuery.getColorid(d.colorCode);
                    let base: any = await this.rawQuery.getbaseid(d.baseCode);
                    let basesize: any;
                    if (size && base && color) {
                        basesize = await this.rawQuery.getbasesizeid({ baseId: base.id, sizeId: size.id });
                        console.log(basesize);
                        if (!basesize) {
                            let basesizeData: any = {
                                base: {
                                    id: base.id
                                },
                                sizes: {
                                    id: size.id
                                },
                                insertedAt: new Date(),
                                updatedAt: new Date()
                            };
                            await this.baseSizesDAO.save(basesizeData);
                        }
                        basesize = await this.rawQuery.getbasesizeid({ baseId: base.id, sizeId: size.id });
                        basesize.sizes = size;
                        basesize.base = base;
                        basesizecolorObj.colors = color;
                        basesizecolorObj.baseSizes = basesize;
                        basesizecolorObj.insertedAt = new Date();
                        basesizecolorObj.price = d.price;
                        basesizecolorObj.updatedAt = new Date();
                        newData.successfulRecords.push(basesizecolorObj);
                        newData.successRecords.push(d);
                    } else {
                        newData.failedRecords.push(d);
                    }
                }
            }
            colors = [];
            return newData;
        } catch (error) {
            throw error;
        }
    }

    groupBy(array: any, f: any) {
        let groups: any = {};
        array.forEach(function(o: any) {
            let group: any = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function(group) {
            return groups[group];
        });
    }

    async getBaseSizeColor(params: any) {
        try {
            let data: any = await this.baseSizeColorsDAO.findOne(params);
            return data;
        } catch (error) {
            throw error;
        }
    }
}
