const {defineSupportCode} = require('cucumber')
const {expect} = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({Given, When, Then}) {
  Given('一個勞工月薪為 {int} 元', function (int) {
    this.result = std.hourlySalary(int)
  })

  Given('一個時薪制的勞工，基本時薪為 {int} 元', function (int) {
    this.hourly = int
  })

  Given('一個月薪制的勞工，平均時薪為 {int} 元', function (int) {
    this.hourly = int
  })

  Then('他計算加班費用的平均時薪為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  When('在平常日', function () {
    this.dayType = std.NORMAL
  })

  When('在國定假日', function () {
    this.dayType = std.HOLIDAY
  })

  When('在休息日', function () {
    this.dayType = std.REST_DAY
  })

  When('在例假日', function () {
    this.dayType = std.REGULAR_LEAVE
  })

  When('發生天災、事變或突發事件', function () {
    this.accident = true
  })

  When('沒有發生天災、事變或突發事件', function () {
    this.accident = false
  })

  When('雇主認有繼續工作之必要而停止例假', function () {
    // do nothing
  })

  When('該勞工同意上班', function () {
    this.consent = true
  })

  When('計算加班費時', function () {
    this.result = std.overtimePay(this.hourly, this.workHours,
                                  this.dayType, this.consent, this.accident)
  })

  Then('他的加班費為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  Then('他的加給工資為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  Then('他實領加班費為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  Then('根據 {stringInDoubleQuotes}', function (stringInDoubleQuotes) {
    expect(this.result.reference.some(ref => ref.title === stringInDoubleQuotes))
  })

  Then('根據 {stringInDoubleQuotes} 罰款 {int} 至 {int} 元', function (stringInDoubleQuotes, int, int2) {
    const fine = this.result.fines.filter(fine => fine.according === stringInDoubleQuotes).pop()
    expect(fine.min).eq(int)
    expect(fine.max).eq(int2)
  })

  Then('有額外補休', function () {
    expect(this.result.extraLeave).eq(true)
  })

  Then('無額外補休', function () {
    expect(this.result.extraLeave).eq(false)
  })

  Then('為違法加班', function () {
    expect(this.result.status).eq(std.ILLEGAL)
  })

  Then('薪資為 {int} 元', function (int) {
    const result = std.pay(this.hourly, this.workHours, this.dayType)
    expect(result.value).eq(int)
  })
})
