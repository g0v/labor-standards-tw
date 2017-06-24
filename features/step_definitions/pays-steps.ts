/* tslint:disable:no-unused-expression */

import {defineSupportCode} from 'cucumber'
import {expect} from 'chai'

import { Result, Labor } from '../../src/index'

defineSupportCode(function ({Given, When, Then}) {
  When('計算他的平均時薪時', function () {
    const labor: Labor = this.labor
    this.result = labor.calculateHourlyWages()
  })

  Then('根據函釋 {stringInDoubleQuotes}，他計算加班費用的平均時薪為 {int} 元', function (explanation, wages) {
    const result: Result = this.result
    expect(this.result.value.wages).eq(wages)
    expect(this.result.according.find(article => article.id === explanation)).is.ok
  })
})
