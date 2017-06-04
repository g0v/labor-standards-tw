const { defineSupportCode } = require('cucumber')
const { expect } = require('chai')

const { Education, ChildLaborType } = require('../../src/index')

defineSupportCode(function ({ Given, When, Then }) {
  Given('無國民中學畢業', function () {
    this.labor.graduate(Education.JUNIOR_HIGH_SCHOOL, false)
  })

  Given('國民中學畢業', function () {
    this.labor.graduate(Education.JUNIOR_HIGH_SCHOOL, true)
  })

  Given('無經主管機關認定其工作性質及環境無礙其身心健康而許可', function () {
    this.labor.authorityAgree(false)
  })

  Given('驗證是否為童工時', function () {
    this.result = this.labor.validateChildLabor()
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

  Then('根據勞基法 {int} 條，適用勞基法童工相關法令', function (article) {
    expect(this.result.type).eq(ChildLaborType.FOLLOW_CHILD_LAWS)
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })

  Then('根據勞基法 {int} 條，不為童工', function (article) {
    expect(this.result.type).not.eq(ChildLaborType.CHILD_LABOR)
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })

  Then('根據勞基法 {int} 條，為童工', function (article) {
    expect(this.result.type).eq(ChildLaborType.CHILD_LABOR)
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })

  Then('根據勞基法 {int} 條，為違法童工', function (article) {
    expect(this.result.type).eq(ChildLaborType.ILLEGAL)
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })

  Then('根據勞基法 {int} 條，不得從事危險性或有害性之工作', function (article) {
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })

  Then('根據勞基法 {int} 條，雇主應置備其法定代理人同意書及其年齡證明文件。', function (article) {
    expect(this.result.according.some(law => law.article === article)).eq(true)
  })
})
