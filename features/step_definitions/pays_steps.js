const {defineSupportCode} = require('cucumber')
const {expect} = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({Given, When, Then}) {
  Given('一個勞工月薪為 {int} 元', function (int) {
    this.result = std.hourlySalary(int)
  })

  Then('他計算加班費用的平均時薪為 {int} 元', function (int) {
    expect(this.result.value).eq(int)
  })

  Given('一個月薪制的勞工，平均時薪為 {int} 元', function (int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })

  When('他平日工作 {int} 小時', function (int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })

  Then('他的加班費為 {int}', function (int, callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending')
  })

})
