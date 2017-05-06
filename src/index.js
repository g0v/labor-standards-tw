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

  hourlySalary (monthly) {
    return monthly / 30 / 8
  },

  /* 兒童工作者 */
  overtimePay (hourlySalary, type, hours) {},
  isChildLabor (age, juniorHighSchoolGraduated, authorityAuthorized) {},
  validateChildWorkingHours (hours, durationType = this.Duration.DAILY, dayType = this.Day.REGULAR_DAY, start = 8) {}

  /* 女性工作者 */
}
