import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Gender, Org } from '../../src'

defineSupportCode(function ({ Given, When, Then }) {
  Given('一女性勞工', function () {
    this.labor.gender(Gender.FEMALE)
  })

  When('沒有經過工會或勞資會議同意', function () {
    this.worktime.approveBy(Org.LABOR_MANAGEMENT_MEETING, false)
    this.worktime.approveBy(Org.UNION, false)
  })

  When('沒有根據勞基法 84-1 條與資方另行約定', function () {
    this.worktime.sign841(false)
  })

  When('請產假時', function () {
    let leave = new Date(2017, 12, 1)
    let onboard = new Date(2016, 12 - this.workMonths, 1)
    this.labor.onBoard(onboard)
    this.result = this.labor.takeMaternityLeave(leave)
  })

  Then('根據勞基法 {int} 條，產假期間八週的薪資為 {int}', function (article, wages) {
    expect(this.result.wages).eq(wages)
    expect(this.result.according[0].article).eq(article.toString())
  })

  When('懷孕 {int} 個月但流產時', function (months) {
    this.result = this.labor.miscarry(months)
  })

  Then('根據勞基法 {int} 條，可以請 {int} 周的產假', function (article, weeks) {
    expect(this.result.leave).eq(weeks)
    expect(this.result.unit).eq('week')
  })
})
