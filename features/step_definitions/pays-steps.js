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

  Then('他計算加班費用的平均時薪為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  Then('薪資為 {int} 元', function (int) {
    const result = std.pay(this.hourly, this.workHours, this.dayType)
    expect(result.value).eq(int)
  })
})
