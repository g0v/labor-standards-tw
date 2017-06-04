module.exports = {
  Day: Object.freeze({
    REGULAR_DAY: 1,
    REST_DAY: 2,
    REGULAR_LEAVE: 3
  }),

  Duration: Object.freeze({
    DAY: 1,
    WEEK: 2
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

  Gender: Object.freeze({
    MALE: 'male',
    FEMALE: 'female',
    UNSPECIFIED: 'unspecified'
  }),

  Org: Object.freeze({
    LABOR_MANAGEMENT_MEETING: 'Labor-Management Meeting',
    UNION: 'union'
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
