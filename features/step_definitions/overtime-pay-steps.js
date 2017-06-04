const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const { Duration, WorkTime } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {

  Given('一個月薪制的勞工，平均時薪為 {int} 元', function (hourlySalary) {
    this.hourly = hourlySalary
  })

  When('計算加班費時', function () {
    let worktime = new WorkTime(Duration.DAY, this.labor)
    worktime.add(this.date, this.workHours, this.holiday)
    this.result = worktime.overtimePay(this.accident, this.agreed)
  })

  Then('根據勞基法 {int} 條，他的加班費至少為 {int} 元', function (article, overtimePay) {
    expect(this.result.value).eq(overtimePay)
    expect(this.according[0].article).eq(article.toString())
  })

  When('該勞工同意上班', function () {
    this.agreed = true
  })

  When('發生天災、事變或突發事件', function () {
    this.accident = true
  })

  Then('根據勞基法 {int} 條與 {stringInDoubleQuotes}，他的加給工資為 {int} 元', function (article, explanation, overtimePay) {
    expect(this.result.value).eq(overtimePay)
    expect(this.according[0].article).eq(article.toString())
    expect(this.according[1].lawTitle).eq(explanation)
  })

  When('沒有發生天災、事變或突發事件', function () {
    this.accident = false
  })

  When('雇主認有繼續工作之必要而停止例假', function () {
    // do nothing
  })

  When('根據勞基法 {int} 條，有額外補休', function (article) {
    expect(this.result.according[0].article).eq(article.toString())
    expect(this.result.extraLeave).eq(true)
  })

  Then('根據 {stringInDoubleQuotes}，加給工資為 {int} 元', function (explanation, overtimePay) {
    expect(this.result.value).eq(overtimePay)
    expect(this.according[0].lawTitle).eq(explanation)
  })

  Then('無額外補休', function () {
    expect(this.result.extraLeave).eq(false)
  })

  Then('根據勞基法 {int} 條，實領加班費為 {int} 元', function (article, overtimePay) {
    expect(this.result.value).eq(overtimePay)
    expect(this.result.according[0].article).eq(article.toString())
  })
})
