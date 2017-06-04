const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const { Duration, WorkTime } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('正常工時情況下', function () {
    // do nothing
  })

  When('計算一日工作時間時', function () {
    let worktime = new WorkTime(Duration.DAY, this.labor)
    this.result = worktime.validate()
  })

  Then('根據勞基法 {int} 條，{int} 小時是正常工時，{int} 小時是加班', function (article, regular, overtime) {
    expect(this.result.regularHours).eq(regular)
    expect(this.overtimeHours).eq(overtime)
    expect(this.result.according[0].article).eq(article.toString())
  })

  When('勞工於 2017 年 6 月，每個工作日工作 9 小時', function () {
    let regularDates = [
      1, 2,
      5, 6, 7, 8, 9,
      12, 13, 14, 15, 16,
      19, 20, 21, 22, 23,
      26, 27, 28, 29, 30
    ]
    this.worktime = new WorkTime(Duration.MOONTH, this.labor)
    regularDates.forEach(date => {
      this.worktime.add(new Date(2017, 6, date, 8), 9)
    })
  })

  When('驗證單月加班時數時', function () {
    this.result = this.worktime.validate()
  })
})
