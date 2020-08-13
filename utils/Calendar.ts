var moment = require("moment-business-days");
// import moment from 'moment';
// import localization from 'moment/locale/fr';

export class Calender {
  constructor() {
    moment.locale("ar_SA");
    moment.updateLocale("en", {
      workingWeekdays: [1, 2, 3, 4, 5, 6]
    });
    // moment.updateLocale("ar_SA", {
    //   workingWeekdays: [0, 1, 2, 3, 4]
    // });
    
  }
  setWorkingDays(locale:string,workingWeekdays:any[],holidays?:any[]){
    let obj:any={};
    obj.workingWeekdays=workingWeekdays;
    if(holidays){
      obj.holidays= holidays,
      obj.holidayFormat= 'YYYY-MM-DD'
    }
    moment.updateLocale(locale, obj);
  }

  setHolidaysList(locale:string,holidays:any[]){
    moment.updateLocale(locale, {     
      holidays: holidays,
      holidayFormat: 'YYYY-MM-DD'
    });
  }
  getMomentDateForHolidays(date: Date) {
    return moment(date, "MM/DD");
  }
  getMomentDate(date: Date) {
    return moment(date, "YYYY-MM-DD hh:mm;ss");
  }

  getWorkingDays(date1: Date, date2: Date) {
    return this.getMomentDate(date1).businessDiff(this.getMomentDate(date2));
  }

  getCurrentMonthWorkingDays(date: any) {
    date = new Date(date);
    var startDate: any = moment(date).startOf("month");
    var endDate: any = moment(date).endOf("month");
    return this.getWorkingDays(startDate, endDate);
  }
  getCurrentYearWorkingDays(date: any) {
    date = new Date(date);
    var startDate: any = moment(date).startOf("year");
    var endDate: any = moment(date).endOf("year");
    return this.getWorkingDays(startDate, endDate);
  }
  getCurrentDate() {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() - 1;
    var startDate: any = new Date(y, m, 1);
    var endDate: any = new Date(y, m + 1, 0);
    return moment(startDate).format("YYYY-MM-DD");
  }

  getFormateDate(date: any) {
    return moment(date).format("YYYY-MM-DD");
  }

  isBusinessDay(date: Date) {    
    return moment(date, "YYYY-MM-DD").isBusinessDay();
  }
  getPreviousDate(date: any) {
    console.log(moment(new Date()).month());
    return moment(date)
      .subtract(1, "days")
      .format("YYYY-MM-DD");
  }
  getPreviousWorkingDay(date: any) {
    return moment(date)
      .prevBusinessDay()
      .format("YYYY-MM-DD");
  }
  getWeek(date: any) {
    return moment(date, "YYYY/MM/DD").week();
  }
  getWeekMonth(date: any) {
    return (
      moment(date, "YYYY/MM/DD").week() -
      moment(date)
        .startOf("month")
        .week() +
      1
    );
  }
  getMonth(date: any) {
    return moment(date, "YYYY/MM/DD").month();
  }
  getYear(date: any) {
    return moment(date, "YYYY/MM/DD").year();
  }
  getCurrentDaysOnly(date:Date,type:string) {
    const today = moment(date);
    const from_date = moment(today).startOf(type);
    const to_date = moment(today).endOf(type);
    return {from:from_date.format("YYYY-MM-DD"),to:to_date.format("YYYY-MM-DD")}
  }
  getPreviousDaysOnly(date:Date,type:string) {
    const today = moment().subtract(1, type+"s");
    const from_date = moment(today).startOf(type);
    const to_date = moment(today).endOf(type);
    return {from:from_date.format("YYYY-MM-DD"),to:to_date.format("YYYY-MM-DD")}
  }
  
  getCurrentWeekDates() {
    return this.getWeekDatesFromDate(moment());
  }

  getPreviousWeekDates() {
    return this.getWeekDatesFromDate(moment().subtract(1, "weeks"));
  }

  getCurrentMonthDates() {
    return this.getMonthDatesFromDate(moment());
  }
  getCurrentYearDates() {
    return this.getYearDatesFromDate(moment());
  }
  getPreviousMonthDates() {
    return this.getMonthDatesFromDate(moment().subtract(1, "months"));
  }
  getPreviousYearDates() {
    return this.getMonthDatesFromDate(moment().subtract(1, "year"));
  }
  getWeekDatesFromDate(date: any) {
    return this.getDateFromTo(date, "week");
  }

  getMonthDatesFromDate(date: any) {
    return this.getDateFromTo(date, "month");
  }

  getYearDatesFromDate(date: any) {
    return this.getDateFromTo(date, "year");
  }

  getDateFromTo(date: any, type: string) {
    const today = moment(date);
    const from_date = moment(today).startOf(type);
    const to_date = moment(today).endOf(type);
    const fromMonth = this.getMonth(from_date);
    const toMonth = this.getMonth(to_date);
    const fromMonthDaysDiff = fromMonth != toMonth ? from_date.daysInMonth() - from_date.date() : 0;
    const fromMonthDaySeg = moment(from_date).add(fromMonthDaysDiff, "days");
    const toMonthDaySeg = fromMonth != toMonth ? moment(fromMonthDaySeg).add(1, "days") : moment(to_date);
    const workingDays =
      fromMonth != toMonth ? this.getWorkingDays(from_date, fromMonthDaySeg) : this.getWorkingDays(from_date, to_date);
    const workingDaysSeg = fromMonth != toMonth ? this.getWorkingDays(fromMonthDaySeg, to_date) : 0;
    return {
      fromDate: from_date.format("YYYY-MM-DD"),
      today: today.format("YYYY-MM-DD"),
      toDate: to_date.format("YYYY-MM-DD"),
      fromWeek: this.getWeekMonth(from_date),
      toWeek: this.getWeekMonth(to_date),
      fromMonth: fromMonth,
      toMonth: toMonth,
      fromYear: this.getYear(from_date),
      toYear: this.getYear(to_date),
      fromMonthDays: from_date.daysInMonth(),
      toMonthDays: to_date.daysInMonth(),
      fromMonthDaysDiff: fromMonth != toMonth ? fromMonthDaysDiff + 1 : fromMonthDaysDiff,
      toMonthDaysDiff: fromMonth != toMonth ? 7 - fromMonthDaysDiff - 1 : 7 - fromMonthDaysDiff,
      fromMonthDaySeg: fromMonthDaySeg.format("YYYY-MM-DD"),
      toMonthDaySeg: toMonthDaySeg.format("YYYY-MM-DD"),
      workingDays: workingDays,
      workingDaysSeg: workingDaysSeg
    };

    
  }
}
