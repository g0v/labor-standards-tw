import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Result, Labor } from '../../src/index'

defineSupportCode(function ({ Given, When, Then }) {
  Given('他的平均薪資為 {int} 元', function (salary) {
    const labor: Labor = this.labor
    labor.setMonthlySalary(salary)
  })

  When('公司解僱該勞工', function () {
    const labor: Labor = this.labor
    this.result = labor.beDismissed(this.endDate)
  })

  Then('公司必須於 {int} 天前預告', function (days) {
    const result: Result = this.result
    expect(result.value.noticeDays).eq(days)
  })

  Then('公司發給勞工遣散費 {int} 元', function (severancePay) {
    const result: Result = this.result
    expect(result.value.severancePay).eq(severancePay)
  })
})
