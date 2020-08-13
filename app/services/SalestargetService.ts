import { SalesTargets } from "../../entities/SalesTargets";
import { Brackets, Index } from "typeorm";

import { SalesTableDAO } from "../repos/SalesTableDAO";
import { SalesTargetsDAO } from "../repos/SalesTargetsDAO";
import { Props } from "../../constants/Props";
import { Calender } from "../../utils/Calendar";
import { SalesStatus } from "../../utils/SalesStatus";
import { App } from "../../utils/App";
import { SalesLineDAO } from "../repos/SalesLineDAO";
import { SalesLine } from "../../entities/SalesLine";
import { Inventtable } from "../../entities/Inventtable";
import { InventtableDAO } from "../repos/InventtableDAO";
import { InventoryOnhandDAO } from "../repos/InventoryOnhandDAO";
import { WorkDaysDAO } from "../repos/WorkDaysDAO";
import { HolidaysListDAO } from "../repos/HolidaysListDAO";
import { Products } from "../../entities/Products";

export class SalestargetService {
  public sessionInfo: any;

  private salestagetRepository: any;
  private salestableRepository: any;
  private saleslineRepository: SalesLineDAO;
  private inventtableRepository: InventtableDAO;
  private onHandInventoryRepository: InventoryOnhandDAO;
  private workDaysDAO: WorkDaysDAO;
  private holidaysListDAO: HolidaysListDAO;

  calender: Calender;

  constructor() {
    this.sessionInfo = { id: "SYSTEM", vid: "OWN" };
    this.salestableRepository = new SalesTableDAO().getDAO();
    this.salestagetRepository = new SalesTargetsDAO().getDAO();
    this.saleslineRepository = new SalesLineDAO();
    this.inventtableRepository = new InventtableDAO();
    this.onHandInventoryRepository = new InventoryOnhandDAO();
    this.workDaysDAO = new WorkDaysDAO();
    this.holidaysListDAO = new HolidaysListDAO();
    this.calender = new Calender();
  }

  async save(item: SalesTargets) {
    try {
      let cond = await this.validate(item);
      if (cond == true) {
        let pricediscgroupData: any = await this.salestagetRepository.save(item);
        let returnData = { message: "SAVED_SUCCESSFULLY" };
        return returnData;
      } else {
        throw { message: "INVALID_DATA" };
      }
    } catch (error) {
      throw error;
    }
  }
  async search(data: any) {
    try {
      let workWeeks = await this.workDaysDAO.search({
        storeCode: data.inventlocationid,
        year: new Date(App.DateNow()).getFullYear(),
      });
      let dayNos = workWeeks.map((item) => {
        return item.dayNo;
      });
      console.log("*******************  workweeks **********************");
      console.log(dayNos);
      console.log("*******************************************");

      let holidays = await this.holidaysListDAO.searchNot({
        type: "WEEkend",
      });

      let holidaysList = holidays.map((item) => {
        return this.calender.getMomentDate(new Date(item.date)).format("YYYY-MM-DD");
      });

      console.log("***************** Holidays ************************");
      console.log(holidaysList);
      console.log("*****************************************");

      this.calender.setWorkingDays("ar_SA", dayNos, holidaysList);
      this.calender.setWorkingDays("en", dayNos, holidaysList);

      this.calender.setHolidaysList("ar_SA", holidaysList);
      this.calender.setHolidaysList("en", holidaysList);

      console.log(this.calender.isBusinessDay(holidaysList[0]));
      let day = await this.getDayTargetStatus(data);
      let week = await this.getWeekTargetStatus(data);
      let month = await this.getMonthTargetStatus(data);
      let year = await this.getYearTargetStatus(data);
      return {
        day: day,
        week: week,
        month: month,
        year: year,
      };
    } catch (error) {
      throw error;
    }
  }

  async getWorkingWeekdays() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async searchTop20(data: any) {
    try {
      if (data.unittime && data.inventlocationid) {
        let dates: any = this.getDatesFromUnitTime(data.unittime);
        console.log("dates================", dates);
        let previousdates: any = this.getDatesFromUnitTime(data.unittime, true);
        console.log("Previous===================", previousdates);
        if (dates.from && dates.to) {
          let products: SalesLine[] = await this.saleslineRepository.findTop20FromToDate(
            data.inventlocationid,
            dates.from,
            dates.to
          );
          
          let ids =
            products.length > 0
              ? products.map((product: any) => {
                  return product.itemid;
                })
              : [];
          console.log(ids);
          let previousproducts: SalesLine[] =
            ids.length > 0
              ? await this.saleslineRepository.findTop20FromToDateWithItemIds(
                  data.inventlocationid,
                  previousdates.from,
                  previousdates.to,
                  ids
                )
              : [];
              console.log("products===========",products)
              console.log("privious products===========",previousproducts)
              products= products.map((item: any, index: any) => {
                let productNameObj: any = previousproducts.find((privoiusProduct: any) => {
                  return item.itemid == privoiusProduct.itemid;
                });
    
                return productNameObj ? Object.assign({}, products[index], productNameObj) : products[index];
              });

              console.log("after products===========",products)
          products = products.map((item: any) => {
            if (!item.hasOwnProperty("previousamount")) {
              item["previousamount"] = 0;
            }
            return item;
          });
          let productNames: Inventtable[] = ids.length > 0 ? await this.inventtableRepository.findByIds(ids) : [];
          // console.log("productNames=================", ids.length, productNames.length);
          let result = products.map((item: any, index: any) => {
            let productNameObj: any = productNames.find((productName: any) => {
              return item.itemid == productName.code;
            });

            return productNameObj ? Object.assign({}, products[index], productNameObj) : products[index];
          });
          console.log(result)
          return result;
        } else {
          throw { message: "INVALID_DATA" };
        }
      }
      throw { message: "INVALID_DATA" };
    } catch (error) {
      throw error;
    }
  }

  seachCriticalItems(data: any) {
    try {
      return this.onHandInventoryRepository.findCriticalItems(data);
    } catch (e) {}
  }

  getDatesFromUnitTime(unitTime: string, isPrevious?: boolean) {
    let dates: any = {};
    if (isPrevious) {
      if (Props.DAY.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getPreviousDaysOnly(new Date(), Props.DAY.toLowerCase());
      }
      if (Props.WEEK.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getPreviousDaysOnly(new Date(), Props.WEEK.toLowerCase());
      }

      if (Props.MONTH.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getPreviousDaysOnly(new Date(), Props.MONTH.toLowerCase());
      }

      if (Props.YEAR.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getPreviousDaysOnly(new Date(), Props.YEAR.toLowerCase());
      }
    } else {
      if (Props.DAY.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getCurrentDaysOnly(new Date(), Props.DAY.toLowerCase());
      }
      if (Props.WEEK.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getCurrentDaysOnly(new Date(), Props.WEEK.toLowerCase());
      }

      if (Props.MONTH.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getCurrentDaysOnly(new Date(), Props.MONTH.toLowerCase());
      }

      if (Props.YEAR.toLowerCase() == unitTime.toLowerCase()) {
        dates = this.calender.getCurrentDaysOnly(new Date(), Props.YEAR.toLowerCase());
      }
    }

    return dates;
  }

  async getDayTargetStatus(data: any) {
    // let workingDays = this.calender.getCurrentMonthWorkingDays();
    let currentDate = this.calender.getFormateDate(new Date(App.DateNow()));
    let previousDate = this.calender.getPreviousDate(new Date(App.DateNow()));
    let currentDateMonth = this.calender.getMonth(currentDate);
    let previusDateMonth = this.calender.getMonth(previousDate);
    let currentDateYear = this.calender.getYear(currentDate);
    let prevoiusDateYear = this.calender.getYear(previousDate);
    let currentDateMonthWorkingDays = this.calender.getCurrentMonthWorkingDays(currentDate);
    let previousDateMonthWorkingDays = this.calender.getCurrentMonthWorkingDays(previousDate);

    let currentMonthTaget = await this.getCurrentMonthTargetAmount(
      data.inventlocationid,
      currentDateYear,
      currentDateMonth
    );
    let previousMonthTaget = await this.getCurrentMonthTargetAmount(
      data.inventlocationid,
      prevoiusDateYear,
      previusDateMonth
    );

    console.log(
      "================ is today working ===============",
      currentDate,
      "===============",
      this.calender.isBusinessDay(currentDate)
    );

    let currentDayTarget = this.calender.isBusinessDay(new Date(App.DateNow()))
      ? this.getTargetAmont(currentMonthTaget, currentDateMonthWorkingDays)
      : 0;
    let previousDayTarget = this.calender.isBusinessDay(previousDate)
      ? this.getTargetAmont(previousMonthTaget, previousDateMonthWorkingDays)
      : 0;
    let todaySales: any = await this.getCurrentDaySales(data, { lastmodifieddate: currentDate });
    let yesterdaySale: any = await this.getCurrentDaySales(data, { lastmodifieddate: previousDate });
    console.log("=======================DAY======================");
    console.log(todaySales, " yesterday ", yesterdaySale);
    console.log("=============================================");
    let currentPercentage = currentDayTarget ? ((todaySales - currentDayTarget) / currentDayTarget) * 100 : 0;
    let previousPercentageDecimal = todaySales == 0 ? Infinity : ((yesterdaySale - todaySales) / todaySales) * 100;
    let previousPercentage = previousPercentageDecimal == Infinity ? 100 : previousPercentageDecimal;
    // todaySales ? ((yesterdaySale - todaySales) / todaySales) * 100 : (todaySales==0?100:0);
    let salesStatus = new SalesStatus();
    salesStatus.currentSale = todaySales;
    salesStatus.previousSale = yesterdaySale;
    salesStatus.currentSalesPercent = currentPercentage ? currentPercentage : 0;
    console.log("=======================DAY percent ======================");
    console.log(previousPercentage, " yesterday percent ", previousPercentage ? previousPercentage : 0);
    console.log("=============================================");
    salesStatus.previousSalesPercent = previousPercentage ? previousPercentage : 0;
    salesStatus.previousSalesPercentStatus = salesStatus.previousSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercentStatus = salesStatus.currentSalesPercent >= 0 ? "up" : "down";
    console.log("=======================DAY Before  percent ======================");
    console.log(salesStatus.previousSalesPercent);
    console.log(Math.abs(salesStatus.previousSalesPercent));
    console.log(Math.round(Math.abs(salesStatus.previousSalesPercent)));
    console.log("=============================================");

    salesStatus.currentSalesPercent = Math.abs(salesStatus.currentSalesPercent);
    salesStatus.previousSalesPercent = Math.abs(salesStatus.previousSalesPercent);

    console.log("=======================DAY percent ======================");
    console.log(salesStatus.currentSalesPercent, " yesterday percent ", salesStatus.previousSalesPercent);
    console.log("=============================================");

    salesStatus.currentTarget = currentDayTarget;
    return salesStatus;
  }

  async getWeekTargetStatus(data: any) {
    let currentWeekDates = this.calender.getCurrentWeekDates();
    let previousWeekDates = this.calender.getPreviousWeekDates();
    let currentTargetAmount = await this.getTargetAmountsBasedOnDates(data, currentWeekDates);
    let previousTargetAmount = await this.getTargetAmountsBasedOnDates(data, previousWeekDates);
    let currentWeekSales = await this.getSalesFromToDate(data, currentWeekDates);
    let previousWeekSales = await this.getSalesFromToDate(data, previousWeekDates);

    console.log("=================================================");
    console.log("========currentWeekSales=================", currentWeekSales);
    console.log("=========previousWeekSales=========================", previousWeekSales);
    let currentpercentage = currentTargetAmount
      ? ((currentWeekSales - currentTargetAmount) / currentTargetAmount) * 100
      : 0;
    let previousPercentage = currentWeekSales ? ((previousWeekSales - currentWeekSales) / currentWeekSales) * 100 : 0;
    let salesStatus = new SalesStatus();
    salesStatus.currentSale = currentWeekSales;
    salesStatus.previousSale = previousWeekSales;
    salesStatus.currentSalesPercent = currentpercentage ? currentpercentage : 0;
    salesStatus.previousSalesPercent = previousPercentage ? previousPercentage : 0;
    salesStatus.previousSalesPercentStatus = salesStatus.previousSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercentStatus = salesStatus.currentSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercent = Math.abs(salesStatus.currentSalesPercent);
    salesStatus.previousSalesPercent = Math.abs(salesStatus.previousSalesPercent);
    salesStatus.currentTarget = currentTargetAmount;
    return salesStatus;
  }
  async getMonthTargetStatus(data: any) {
    let currentMonthDates = this.calender.getCurrentMonthDates();
    let previousMonthDates = this.calender.getPreviousMonthDates();
    let currentMonthSales = await this.getSalesFromToDate(data, currentMonthDates);
    let previousMonthSales = await this.getSalesFromToDate(data, previousMonthDates);
    console.log("----------------- currentMonthSales-----------------", currentMonthSales);
    console.log("----------------- previousMonthSales-----------------", previousMonthSales);
    let currentTargetAmount = await this.getTargetAmountsBasedOnDates(data, currentMonthDates);
    let previousTargetAmount = await this.getTargetAmountsBasedOnDates(data, previousMonthDates);
    let currentPercentage = currentTargetAmount
      ? ((currentMonthSales - currentTargetAmount) / currentTargetAmount) * 100
      : 0;
    let previousPercentage = currentMonthSales
      ? ((previousMonthSales - currentMonthSales) / currentMonthSales) * 100
      : 0;
    let salesStatus = new SalesStatus();
    salesStatus.currentSale = currentMonthSales;
    salesStatus.previousSale = previousMonthSales;
    salesStatus.currentSalesPercent = currentPercentage ? currentPercentage : 0;
    salesStatus.previousSalesPercent = previousPercentage ? previousPercentage : 0;
    salesStatus.previousSalesPercentStatus = salesStatus.previousSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercentStatus = salesStatus.currentSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercent = Math.abs(salesStatus.currentSalesPercent);
    salesStatus.previousSalesPercent = Math.abs(salesStatus.previousSalesPercent);
    salesStatus.currentTarget = currentTargetAmount;
    return salesStatus;
  }
  async getYearTargetStatus(data: any) {
    let currentMonthDates = this.calender.getCurrentYearDates();
    let previousMonthDates = this.calender.getPreviousYearDates();
    let currentMonthSales = await this.getSalesFromToDate(data, currentMonthDates);
    let previousMonthSales = await this.getSalesFromToDate(data, previousMonthDates);
    console.log("===============currentYearSales===================", currentMonthSales);
    console.log("===============previousYearSales===================", previousMonthSales);
    let currentTargetAmount = await this.getTargetAmountsBasedOnDates(data, currentMonthDates, true);
    let previousTargetAmount = await this.getTargetAmountsBasedOnDates(data, previousMonthDates, true);

    console.log("===============currentTargetAmount===================", currentTargetAmount);
    console.log("===============previousTargetAmount===================", previousTargetAmount);

    let currentPercentage = currentTargetAmount
      ? ((currentMonthSales - currentTargetAmount) / currentTargetAmount) * 100
      : 0;
    let previousPercentage = currentMonthSales
      ? ((previousMonthSales - currentMonthSales) / currentMonthSales) * 100
      : 0;
    console.log("=============== currentTargetAmount===================", currentTargetAmount);
    let salesStatus = new SalesStatus();
    salesStatus.currentSale = currentMonthSales;
    salesStatus.previousSale = previousMonthSales;
    salesStatus.currentSalesPercent = currentPercentage ? currentPercentage : 0;
    salesStatus.previousSalesPercent = previousPercentage ? previousPercentage : 0;
    salesStatus.previousSalesPercentStatus = salesStatus.previousSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercentStatus = salesStatus.currentSalesPercent >= 0 ? "up" : "down";
    salesStatus.currentSalesPercent = Math.abs(salesStatus.currentSalesPercent);
    salesStatus.previousSalesPercent = Math.abs(salesStatus.previousSalesPercent);
    salesStatus.currentTarget = currentTargetAmount;
    return salesStatus;
  }
  getTargetAmont(amount: any, days: any) {
    amount = amount / days;
    return amount ? amount : 0;
  }
  async getTargetAmountsBasedOnDates(data: any, dates: any, onlyYear?: boolean) {
    let currentDateMonthWorkingDays = !onlyYear
      ? this.calender.getCurrentMonthWorkingDays(dates.fromDate)
      : this.calender.getCurrentYearWorkingDays(dates.fromDate);
    console.log("---------  working  --------", currentDateMonthWorkingDays);
    let currentMonthTaget = await this.getCurrentMonthTargetAmount(
      data.inventlocationid,
      dates.fromYear,
      !onlyYear ? dates.fromMonth : null
    );

    console.log("currentMonthTaget   in ", currentMonthTaget);
    let currentMonthTagetSegmentedTarget = 0;
    let currentDateMonthSegmentedWorkingDays = 0;
    let currentDayTarget = this.getTargetAmont(currentMonthTaget, currentDateMonthWorkingDays);
    console.log("currentDayTarget   in ", currentDayTarget);
    let currentTarget = !onlyYear
      ? currentDayTarget * dates.workingDays
      : currentDayTarget * currentDateMonthWorkingDays;

    console.log("currentTarget   in ", currentTarget);
    if (!onlyYear && dates.fromMonth != dates.toMonth) {
      currentMonthTagetSegmentedTarget = await this.getCurrentMonthTargetAmount(
        data.inventlocationid,
        dates.toYear,
        !onlyYear ? dates.toMonth : null
      );
      currentDateMonthSegmentedWorkingDays = this.calender.getCurrentMonthWorkingDays(dates.toDate);
      let currentDayTargetSegmented = this.getTargetAmont(
        currentMonthTagetSegmentedTarget,
        currentDateMonthSegmentedWorkingDays
      );
      let currentSegmentedTarget = currentDayTargetSegmented * dates.workingDaysSeg;
      currentTarget += currentSegmentedTarget;
    }

    console.log("currentTarget between dates ===== ", currentTarget);
    return currentTarget;
  }
  async validate(item: any) {
    if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
      item.id = null;
    }
    if (!item.id) {
      let uid = App.uuidv4();
      item.id = uid;
    }
    let sum = 0;
    for (let i = 1; i <= 12; i++) {
      let key: any = "month" + i;
      if (!item[key] || item[key].toString() == "" || item[key].toString() == "0") {
        return false;
      }
      sum += item[key];
    }
    item.yearTarget = sum;
    item.updatedOn = new Date(App.DateNow());
    return true;
  }
  async getCurrentMonthTargetAmount(inventlocationid: any, year: any, month?: number) {
    let targetItem: any = await this.salestagetRepository.findOne({
      where: {
        year: year,
        storeCode: inventlocationid,
      },
    });
    let target = 0;
    if (targetItem && month) {
      target = targetItem["month" + (month + 1)];
    } else if (targetItem && targetItem.hasOwnProperty("yearTarget") && targetItem["yearTarget"]) {
      target = targetItem.yearTarget;
    }
    console.log("=======================", target);
    return target;
  }

  async getCurrentDaySales(data: any, date: any) {
    let sumObj = await this.salestableRepository
      .createQueryBuilder("salestable")
      .select("SUM(salestable.netamount :: float)", "sum")
      // .andWhere("salestable.transkind IN (:...transkind)", { transkind: ["SALESORDER"] })
      .andWhere("salestable.transkind IN (:...transkind)", { transkind: ["SALESORDER","DESIGNERSERVICE"] })
      .andWhere("salestable.status IN (:...status)", { status: ["PAID", "POSTED"] })
      .andWhere("salestable.lastmodifieddate ::date = :lastmodifieddate", date)
      .andWhere("salestable.inventlocationid = :inventlocationid", data)
      .getRawOne();
    return sumObj.sum ? sumObj.sum : 0;
  }


  async getSalesFromToDate(data: any, dates: any) {
    let sumObj = await this.salestableRepository
      .createQueryBuilder("salestable")
      .select("SUM(salestable.netamount :: float)", "sum")
      // .andWhere("salestable.transkind IN (:...transkind)", { transkind: ["SALESORDER"] })
      .andWhere("salestable.transkind IN (:...transkind)", { transkind: ["SALESORDER","DESIGNERSERVICE"] })
      .andWhere("salestable.status IN (:...status)", { status: ["PAID", "POSTED"] })
      .andWhere("salestable.inventlocationid = :inventlocationid", data)
      .andWhere(
        new Brackets((qb) => {
          qb.where("salestable.lastmodifieddate::date >= :fromDate", {
            fromDate: dates.fromDate,
          }).andWhere("salestable.lastmodifieddate::date <= :today", { today: dates.today });
        })
      )
      .getRawOne();
    return sumObj.sum ? sumObj.sum : 0;
  }
}
