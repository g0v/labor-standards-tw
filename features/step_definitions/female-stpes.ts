import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Gender, Org, Labor, Result } from '../../src'

defineSupportCode(function ({ Given, When, Then }) {
  Given('一女性勞工', function () {
    this.labor.setGender(Gender.FEMALE)
  })

  When('沒有經過工會或勞資會議同意', function () {
    this.worktime.approvedBy(Org.UNION_OR_LABOR_MANAGEMENT_MEETING, false)
  })

  When('沒有根據勞基法 84-1 條與資方另行約定', function () {
    this.worktime.signed841(false)
  })

  When('請產假時', function () {
    const labor: Labor = this.labor
    let leave = new Date(2017, 12, 1)
    let onboard = new Date(2017, 12 - this.workMonths, 1)
    labor.onBoard(onboard)
    this.result = labor.takeMaternityLeave(leave)
  })

  Then('根據勞基法 {int} 條，產假期間八週的薪資為 {int}', function (id, wages) {
    const result: Result = this.result
    expect(result.value.wages).eq(wages)
    expect(result.according[0].id).eq(id.toString())
  })

  When('懷孕 {int} 個月但流產時', function (months) {
    const labor: Labor = this.labor
    let leave = new Date(2017, 12, 1)
    let onboard = new Date(2017, 12 - months, 1)
    labor.onBoard(onboard)
    this.result = labor.takeMaternityLeave(leave, true, months)
  })

  Then('根據勞基法 {int} 條，可以請 {int} 周的產假', function (article, weeks) {
    const result: Result = this.result
    expect(result.value.leaves).eq(weeks)
    expect(result.value.unit).eq('week')
  })
})
