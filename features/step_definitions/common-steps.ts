/* tslint:disable:no-unused-expression */

import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'
import { Duration, WorkTime, Labor, Result, Day } from '../../src/index'

defineSupportCode(function ({ Given, When, Then }) {
  Given('一個 {int} 歲的勞工', function (age) {
    const labor: Labor = this.labor
    labor.setAge(age)
  })

  Given('一個勞工月薪為 {int} 元', function (salary) {
    const labor: Labor = this.labor
    labor.setMonthlySalary(salary)
  })

  Given('月薪為 {int} 元', function (salary) {
    const labor: Labor = this.labor
    labor.setMonthlySalary(salary)
  })

  When('工作 {float} 小時', function (hours) {
    this.workHours = hours
  })

  Given('在一公司工作 {int} 個月', function (months) {
    this.workMonths = months
  })

  When('在一公司工作 {int} 年', function (years) {
    this.workYears = years
  })

  When('週一到週六每天工作八小時', function () {
    const labor: Labor = this.labor
    const worktime = new WorkTime(Duration.WEEK, labor)
    worktime.add(new Date(2017, 6, 5, 8), 8) // Monday
    worktime.add(new Date(2017, 6, 6, 8), 8)
    worktime.add(new Date(2017, 6, 7, 8), 8)
    worktime.add(new Date(2017, 6, 8, 8), 8)
    worktime.add(new Date(2017, 6, 9, 8), 8)
    worktime.add(new Date(2017, 6, 10, 8), 8)
    this.worktime = worktime
  })

  When('在例假日工作時', function () {
    const labor: Labor = this.labor
    const worktime = new WorkTime(Duration.DAY, labor)
    worktime.add(new Date(2017, 6, 11, 8), 8, Day.REGULAR_LEAVE)
    this.worktime = worktime
    this.result = worktime.validate()
  })

  When('驗證單天工作時間是否違法時', function () {
    const labor: Labor = this.labor
    const hours = this.workHours || 8
    const date = this.date || new Date(2017, 6, 5, 8)
    const worktime = new WorkTime(Duration.DAY, labor)
    worktime.add(date, hours)
    this.result = worktime.validate()
  })

  When('驗證單週工作時間是否違法時', function () {
    this.result = this.worktime.validate()
  })

  When('在 {int} 點時工作', function (hours) {
    const labor: Labor = this.labor
    this.date = this.date || new Date(2017, 6, 5, hours)
    this.worktime = new WorkTime(Duration.DAY, labor)
    this.worktime.add(this.date, 1)
  })

  When('在平常日', function () {
    this.date = new Date(2017, 6, 5, 8)
    this.dayType = Day.REGULAR_DAY
  })

  When('在國定假日', function () {
    this.date = new Date(2017, 5, 30, 8)
    this.dayType = Day.HOLIDAY
  })

  When('在休息日', function () {
    this.date = new Date(2017, 6, 3, 8)
    this.dayType = Day.REST_DAY
  })

  When('在例假日', function () {
    this.date = new Date(2017, 6, 4, 8)
    this.dayType = Day.REGULAR_LEAVE
  })

  When('不考慮變形工時的狀況', function () {
    // do nothing
  })

  When('驗證是否在合法的時間範圍內工作', function () {
    this.result = this.worktime.validate()
  })

  Given('一勞工在公司從 {int}/{int}/{int} 開始工作', function (year, month, date) {
    const labor: Labor = this.labor
    labor.onBoard(new Date(year, month, date))
  })

  When('到了 {int}/{int}/{int} 時', function (year, month, date) {
    this.endDate = new Date(year, month, date)
  })

  Then('違反 {stringInDoubleQuotes} {int} 條', function (lawTitle: string, id: number) {
    const result: Result = this.result
    const violations = result.violations
    expect(violations.find(v => v.lawTitle === lawTitle &&
                           v.id === id.toString())
                           ).is.ok
  })

  Then('違反 {stringInDoubleQuotes} {int} 條第 {int} 項', function (lawTitle: string, id: number, paragraph: number) {
    const result: Result = this.result
    const violations = result.violations
    expect(violations.find(v => v.lawTitle === lawTitle &&
                           v.id === id.toString() &&
                           v.paragraph === paragraph - 1)
                           ).is.ok
  })

  Then('根據勞基法 {int} 條，罰款 {int} 元以下或處 {int} 個月以下有期徒刑、拘役或合併前面兩者罰則', function (id, max, years) {
    const result: Result = this.result
    const penalties = result.violations.map(v => v.penalize())
    const penalty = penalties.filter(penalty => {
      return penalty.article.lawTitleAbbr === '勞基法' &&
        penalty.article.id === id.toString()
    })[0]

    expect(penalty.possibilities.length).eq(3)
    expect(penalty.possibilities[0].fine.max).eq(max)
    expect(penalty.possibilities[1].imprisonment.max).eq(years)
    expect(penalty.possibilities[2].fine.max).eq(max)
    expect(penalty.possibilities[2].imprisonment.max).eq(years)
  })

  Then('根據勞基法 {int} 條，罰款 {int} 元至 {int} 元', function (id, min, max) {
    const result: Result = this.result
    const penalties = result.violations.map(v => v.penalize())
    const penalty = penalties.filter(penalty => {
      return penalty.article.lawTitleAbbr === '勞基法' &&
        penalty.article.id === id.toString()
    })[0]
    expect(penalty.possibilities.length).eq(1)
    expect(penalty.possibilities[0].fine.min).eq(min)
    expect(penalty.possibilities[0].fine.max).eq(max)
  })

  When('計算休息時間時', function () {
    const worktime = new WorkTime(Duration.DAY, this.labor)
    this.result = worktime.calculateRestTime(this.workHours)
  })

  Then('根據勞基法 {int} 條，有 {float} 小時的休息時間', function (lawId, float) {
    const result: Result = this.result
    expect(result.according[0].id).equal(lawId.toString())
    expect(result.value.restTime).equal(float)
  })
})
