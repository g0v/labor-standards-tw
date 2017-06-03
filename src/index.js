module.exports = {
  Day: Object.freeze({
    REGULAR_DAY: 1,
    REST_DAY: 2,
    REGULAR_LEAVE: 3
  }),

  Duration: Object.freeze({
    DAILY: 1,
    WEEKLY: 2
  }),

  Education: Object.freeze({
    JUNIOR_HIGH_SCHOOL: 1
  }),

  ChildLaborType: Object.freeze({
    ILLEGAL: 1,
    FOLLOW_CHILD_LABOR_ARTICLES: 2,
    CHILD_LABOR: 3,
    PRE_ADULT: 4,
    ADULT: 5
  }),

  Labor: require('./Labor'),
  WorkTime: require('./WorkTime')

  // hourlySalary (monthly) {
  //   return monthly / 30 / 8
  // },

  // /* 兒童工作者 */
  // overtimePay (hourlySalary, type, hours) {},
  // isChildLabor (age, juniorHighSchoolGraduated, authorityAuthorized) {},
  // validateChildWorkingHours (hours, durationType = this.Duration.DAILY, dayType = this.Day.REGULAR_DAY, start = 8) {}

  // /* 女性工作者 */
}
