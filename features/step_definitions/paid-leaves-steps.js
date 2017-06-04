const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

// const { Education, ChildLaborType } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('一勞工在公司從 {int}/{int}/{int} 開始工作', function (year, month, date) {
    this.labor.onBoard(new Date(year, month, date))
  })

  When('到了 {int}/{int}/{int} 時', function (year, month, date) {
    this.endDate = new Date(year, month, date)
  })

  When('計算特休假時', function () {
    this.result = this.labor.paidLeaves(this.endDate)
  })

  Then('根據勞基法 {int} 條，特休假為 {int} 天', function (article, leaves) {
    expect(this.result.value).eq(leaves)
    expect(this.result.unit).eq('day')
    expect(this.result.according[0].article).eq(article.toString())
  })
})
