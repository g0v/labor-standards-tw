/* tslint:disable:no-unused-expression */

import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Duration, WorkTime, Day, Result } from '../../src/index'

defineSupportCode(function ({ Given, When, Then }) {
  Given('正常工時情況下', function () {
    // do nothing
  })

  When('計算一日工作時間時', function () {
    const worktime = new WorkTime(Duration.DAY, this.labor)
    this.date = this.date || new Date(2017, 6, 1, 8)
    worktime.add(this.date, this.workHours, Day.REGULAR_DAY)
    this.result = worktime.validate()
  })

  Then('根據勞基法 {int} 條，{int} 小時是正常工時，{int} 小時是加班', function (id, regular, overtime) {
    const result: Result = this.result
    expect(result.value.regularHours).eq(regular)
    expect(result.value.overtimeHours).eq(overtime)
    expect(result.according.find(article => article.id === id.toString())).is.ok
  })

  When('勞工於 2017 年 6 月，每個工作日工作 {int} 小時', function (hours) {
    let regularDates = [
      1, 2,
      5, 6, 7, 8, 9,
      12, 13, 14, 15, 16,
      19, 20, 21, 22, 23,
      26, 27, 28, 29, 30
    ]
    this.worktime = new WorkTime(Duration.MONTH, this.labor)
    regularDates.forEach(date => {
      this.worktime.add(new Date(2017, 6, date, 8), hours, Day.REGULAR_DAY)
    })
  })

  When('驗證單月加班時數時', function () {
    this.result = this.worktime.validate()
  })
})
