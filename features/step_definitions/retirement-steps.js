const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  When('驗證退休資格時', function () {
    this.result = std.retire(this.age)
  })

  Then('他 可 申請退休', function () {
    expect(this.result.value).eq(true)
  })

  Then('他 不可 申請退休', function () {
    expect(this.result.value).eq(false)
  })
})
