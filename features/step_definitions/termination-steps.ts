import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

defineSupportCode(function ({ Given, When, Then }) {
  Given('他的平均薪資為 {int} 元', function (salary) {
    this.labor.monthlySalary(salary)
  })

  When('公司解僱該勞工', function () {
    this.result = this.labor.beDismissed(this.endDate)
  })

  Then('公司必須於 {int} 天前預告', function (days) {
    expect(this.result.noticeDays).eq(days)
  })

  Then('公司發給勞工遣散費 {int} 元', function (severancePay) {
    expect(this.result.severancePay).eq(severancePay)
  })
})
