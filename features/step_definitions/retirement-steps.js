const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  When('驗證退休資格時', function () {
    this.labor.onBoard(new Date(2017 - this.workYears, 6, 1))
    this.result = this.labor.retire(new Date(2017, 6, 1))
  })

  Then('他 可 申請退休', function () {
    expect(this.result.value).eq(true)
  })

  Then('他 不可 申請退休', function () {
    expect(this.result.value).eq(false)
  })
})
