const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')
const { Duration, WorkTime } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('一個 {int} 歲的勞工', function (age) {
    this.labor.age(age)
  })

  When('工作 {int} 小時', function (hours) {
    this.workHours = hours
  })

  When('在一公司工作 {int} 年', function (years) {
    this.workYears = years
  })

  When('週一到週六每天工作八小時', function () {
    let worktime = new WorkTime(Duration.WEEKLY, this.labor)
    worktime.add(new Date(2017, 6, 5, 8), 8) // Monday
    worktime.add(new Date(2017, 6, 6, 8), 8)
    worktime.add(new Date(2017, 6, 7, 8), 8)
    worktime.add(new Date(2017, 6, 8, 8), 8)
    worktime.add(new Date(2017, 6, 9, 8), 8)
    worktime.add(new Date(2017, 6, 10, 8), 8)
    this.worktime = worktime
  })

  When('在例假日工作時', function () {
    let worktime = new WorkTime(Duration.DAILY, this.labor)
    worktime.add(new Date(2017, 6, 11, 8), 8)
    this.worktime = worktime
    this.result = worktime.validate()
  })

  When('驗證單天工作時間是否違法時', function () {
    const hours = this.workHours || 8
    const date = this.date || new Date(2017, 6, 5, 8)
    const worktime = new WorkTime(Duration.DAILY, this.labor)
    worktime.add(date, hours)
    this.result = worktime.validate()
  })

  When('驗證單週工作時間是否違法時', function () {
    this.result = this.worktime.validate()
  })

  When('在 {int} 點時工作', function (hours) {
    const date = this.date || new Date(2017, 6, 5, hours)
    this.worktime = new WorkTime(Duration.DAILY)
    this.worktime.add(date, 1)
  })

  When('驗證是否在合法的時間範圍內工作', function () {
    this.result = this.worktime.validate()
  })

  Then('違反 {stringInDoubleQuotes} {int} 條', function (lawTitle, article) {
    const violations = this.result.violate()

    expect(violations.some(violation => {
      return (
        violation.lawTitle === lawTitle ||
        violation.lawTitleAbbr === lawTitle
      ) &&
        violation.article === article
    }))
  })

  Then('根據勞基法 {int} 條，罰款 {int} 元以下或處 {int} 個月以下有期徒刑、拘役或合併前面兩者罰則', function (article, max, years) {
    const penalties = this.result.violate().map(v => v.penalize())
    const penalty = penalties.filter(penalty => {
      return penalty.according[0].lawTitleAbbr === '勞基法' &&
        penalty.according[0].article === article
    })[0]
    expect(penalty.possibilities.length).eq(3)
    expect(penalty.possibilities[0].fine.max).eq(max)
    expect(penalty.possibilities[1].imprisonment.max).eq(years)
    expect(penalty.possibilities[2].fine.max).eq(max)
    expect(penalty.possibilities[2].imprisonment.max).eq(years)
  })
})
