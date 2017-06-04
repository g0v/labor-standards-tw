const {defineSupportCode} = require('cucumber')
const {expect} = require('chai')

defineSupportCode(function ({Given, When, Then}) {
  When('計算他的平均時薪時', function () {
    this.result = this.labor.hourlyWage()
  })

  Then('根據 {stringInDoubleQuotes}，他計算加班費用的平均時薪為 {int} 元', function (explanation, wage) {
    expect(this.result.value).eq(wage)
    expect(this.result.according[0].lawTitle).eq(explanation)
  })
})
