const { defineSupportCode } = require('cucumber')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('一個 {int} 歲的勞工', function (int) {
    this.age = int
  })

  When('工作 {number} 小時', function (number) {
    this.workHours = number
  })

  When('在一公司工作 {int} 年', function (int) {
    this.workYears = int
  })

  When('在 {int} 點時工作', function (int) {
    this.workAt = int
  })

  When('驗證是否在合法的時間範圍內工作', function () {
    let childLabor = false
    if (this.result && this.result.value) {
      childLabor = true
    }
    this.result = std.validateWorkTime(childLabor, this.workAt)
  })
})
