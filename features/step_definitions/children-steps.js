const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('無國民中學畢業', function () {
    this.graduatedJuniorHighSchool = false
  })

  Given('國中畢業', function () {
    this.graduatedJuniorHighSchool = true
  })

  Given('無經主管機關認定其工作性質及環境無礙其身心健康而許可', function () {
    this.authorityAgreed = false
  })

  Given('驗證勞工身份時', function () {
    this.result = std.identifyChildLabor(this.age,
                                         this.graduatedJuniorHighSchool,
                                         this.authorityAgreed)
  })

  When('週一到週六每天工作八小時', function () {
    this.weeklyWorkingHours = 8 * 6
  })

  When('在例假日工作', function () {
    this.workInRegularLeave = true
  })

  When('驗證例假日工作是否違法時', function () {
    let childLabor = std.identifyChildLabor(this.age,
      this.graduatedJuniorHighSchool,
      this.authorityAgreed)
    // FIXME: this endpoint looks weird
    this.result = std.validateWorkInRegularLeave(childLabor, this.workInRegularLeave)
  })

  When('驗證單天工作時間是否違法時', function () {
    let childLabor = std.identifyChildLabor(this.age,
                                            this.graduatedJuniorHighSchool,
                                            this.authorityAgreed)
    this.result = std.validateWorkingHours(childLabor, std.DAILY_WORKING_HOURS, this.workHours)
  })

  When('驗證單週工作時間是否違法時', function () {
    let childLabor = std.identifyChildLabor(this.age,
                                            this.graduatedJuniorHighSchool,
                                            this.authorityAgreed)
    this.result = std.validateWorkingHours(childLabor, std.WEEKLY_WORKING_HOURS, this.weeklyWorkingHours)
  })

  Then('為童工', function () {
    expect(this.result.value).eq(true)
  })

  Then('為一般勞工', function () {
    expect(this.result.value).eq(false)
  })

  Then('適用勞基法童工相關法令', function () {
    // 勞基法 45 條第二款
    // 前項受僱之人，準用童工保護之規定。
    expect(this.result.rules.map(rule => rule.id).indexOf('LSA-45.2'))
  })

  Then('不得從事危險性或有害性之工作', function () {
    // 勞基法 44 條第二款
    // 童工及十六歲以上未滿十八歲之人，不得從事危險性或有害性之工作。
    expect(this.result.rules.map(rule => rule.id).indexOf('LSA-44.2'))
  })

  Then('雇主應置備其法定代理人同意書及其年齡證明文件', function () {
    // 勞基法 46 條
    // 未滿十八歲之人受僱從事工作者，雇主應置備其法定代理人同意書及其年齡證明文件。
    expect(this.result.rules.map(rule => rule.id).indexOf('LSA-46'))
  })
})
