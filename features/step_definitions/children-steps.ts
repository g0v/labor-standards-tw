// tslint:disable:typedef

import { expect } from 'chai'
import { defineSupportCode } from 'cucumber'

import { ChildLaborType, Education, Labor, Result } from '../../src'

defineSupportCode(function ({ Given, When, Then }) {
  Given('無國民中學畢業', function () {
    const labor: Labor = this.labor
    labor.graduate(Education.JUNIOR_HIGH_SCHOOL, false)
  })

  Given('國民中學畢業', function () {
    const labor: Labor = this.labor
    labor.graduate(Education.JUNIOR_HIGH_SCHOOL, true)
  })

  Given('無經主管機關認定其工作性質及環境無礙其身心健康而許可', function () {
    const labor: Labor = this.labor
    labor.authorityAgree(false)
  })

  Given('驗證是否為童工時', function () {
    this.result = this.labor.validateChildLabor()
  })

  Then('根據勞基法 {int} 條，適用勞基法童工相關法令', function (id) {
    const result: Result = this.result
    expect(result.value.type).eq(ChildLaborType.FOLLOW_CHILD_LABOR_ARTICLES)
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })

  Then('根據勞基法 {int} 條，不為童工', function (id) {
    const result: Result = this.result
    expect(result.value.type).not.eq(ChildLaborType.CHILD_LABOR)
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })

  Then('根據勞基法 {int} 條，為童工', function (id) {
    const result: Result = this.result
    expect(result.value.type).eq(ChildLaborType.CHILD_LABOR)
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })

  Then('根據勞基法 {int} 條，為違法童工', function (id) {
    const result: Result = this.result
    expect(result.value.type).eq(ChildLaborType.ILLEGAL)
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })

  Then('根據勞基法 {int} 條，不得從事危險性或有害性之工作', function (id) {
    const result: Result = this.result
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })

  Then('根據勞基法 {int} 條，雇主應置備其法定代理人同意書及其年齡證明文件。', function (id) {
    const result: Result = this.result
    expect(result.according.some(article => article.id === id.toString())).eq(true)
  })
})
