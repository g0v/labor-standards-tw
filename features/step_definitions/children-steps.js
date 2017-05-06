const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const std = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('無國民中學畢業', function () {
    this.labor.graduate(std.Education.JUNIOR_HIGH_SCHOOL, false)
  })

  Given('國中畢業', function () {
    this.labor.graduate(std.Education.JUNIOR_HIGH_SCHOOL, true)
  })

  Given('無經主管機關認定其工作性質及環境無礙其身心健康而許可', function () {
    this.labor.authorityAgree(false)
  })

  Given('驗證勞工身份時', function () {
    this.result = this.labor.isChildLabor()
  })

  When('週一到週六每天工作八小時', function () {
    this.labor.weeklyWork(8 * 6)
  })

  When('在例假日工作', function () {
    this.labor.workAt(std.Day.REGULAR_LEAVE)
  })

  When('驗證例假日工作是否違法時', function () {
    const result = this.labor.validate()
    const violation = result.violate()
    const penalty = result.penalize()
    expect(result.legal).eq(false)
    expect(violation[0].id).eq('LSA-47')
    expect(penalty[0].id).eq('LSA-77')
    expect(penalty[0].desc.zh).eq('違反第四十二條、第四十四條第二項、' +
      '第四十五條第一項、第四十七條、第四十八條、第四十九條第三項或第六十四條第一項規定者，' +
      '處六個月以下有期徒刑、拘役或科或併科新臺幣三十萬元以下罰金。')
    expect(penalty[0].desc.zh).eq('An employer who violates Article 42, ' +
      'Paragraph 2 of Article 44, Paragraph 1 of Articles 45, Article 47, ' +
      'Article 48, Paragraph 3 of Article 49 or Paragraph 1 of Article 64 ' +
      'shall be sentenced to a maximum of 6 months imprisonment, detained, ' +
      'or fined a concurrent maximum amount of NT$300,000.')
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
    expect(this.labor.isChildLabor()).eq(true)
  })

  Then('為一般勞工', function () {
    expect(this.labor.isChildLabor()).eq(false)
    expect(this.labor.treatLike()).eq(std.LaborType.REGULAR)
    expect(this.labor.dangerouslyWork()).eq(true)
  })

  Then('適用勞基法童工相關法令', function () {
    expect(this.labor.treatLike()).eq(std.LaborType.CHILDREN)
  })

  Then('不得從事危險性或有害性之工作', function () {
    // 勞基法 44 條第二款
    // 童工及十六歲以上未滿十八歲之人，不得從事危險性或有害性之工作。
    expect(this.labor.dangerouslyWork()).eq(false)
  })

  Then('雇主應置備其法定代理人同意書及其年齡證明文件', function () {
    // 勞基法 46 條
    // 未滿十八歲之人受僱從事工作者，雇主應置備其法定代理人同意書及其年齡證明文件。
    const requirements = this.labor.require()
    expect(requirements[0]).eq('法定代理人同意書')
    expect(requirements[1]).eq('年齡證明文件')
  })
})
