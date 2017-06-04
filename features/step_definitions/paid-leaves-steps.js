const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

// const { Education, ChildLaborType } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  When('計算特休假時', function () {
    this.result = this.labor.paidLeaves(this.endDate)
  })

  Then('根據勞基法 {int} 條，特休假為 {int} 天', function (article, leaves) {
    expect(this.result.value).eq(leaves)
    expect(this.result.unit).eq('day')
    expect(this.result.according[0].article).eq(article.toString())
  })
})
