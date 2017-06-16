/* tslint:disable:no-unused-expression */

import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Duration, WorkTime, Labor, Result } from '../../src'

defineSupportCode(function ({ Given, When, Then }) {
  Given('一個月薪制的勞工，平均時薪為 {int} 元', function (hourlySalary) {
    const labor: Labor = this.labor
    labor.setHourlyWage(hourlySalary)
  })

  When('計算加班費時', function () {
    let worktime = new WorkTime(Duration.DAY, this.labor)
    worktime.add(this.date, this.workHours, this.dayType)
    this.result = worktime.overtimePay(this.accident, this.agreed)
  })

  Then('根據勞基法 {int} 條，他的加班費至少為 {int} 元', function (id, overtimePay) {
    const result: Result = this.result
    expect(this.result.value.overtimePay).eq(overtimePay)
    expect(this.result.according[0].id).eq(id.toString())
  })

  When('該勞工同意上班', function () {
    this.agreed = true
  })

  When('發生天災、事變或突發事件', function () {
    this.accident = true
  })

  Then('根據勞基法 {int} 條與函釋 {stringInDoubleQuotes}，他的加給工資為 {int} 元', function (id, explanation, overtimePay) {
    const result: Result = this.result

    expect(result.value.overtimePay).eq(overtimePay)
    expect(result.according.find(article => article.id === id.toString())).is.ok
    expect(result.according.find(article => article.id === explanation)).is.ok
  })

  When('沒有發生天災、事變或突發事件', function () {
    this.accident = false
  })

  When('雇主認有繼續工作之必要而停止例假', function () {
    // do nothing
  })

  When('根據勞基法 {int} 條，有額外補休', function (id) {
    const result: Result = this.result
    expect(result.according.find(article => article.id === id.toString())).is.ok
    expect(result.value.extraLeave).eq(true)
  })

  Then('根據函釋 {stringInDoubleQuotes}，加給工資為 {int} 元', function (explanation, overtimePay) {
    const result: Result = this.result
    expect(result.according.find(article => article.id === explanation)).is.ok
    expect(result.value.overtimePay).eq(overtimePay)
  })

  Then('無額外補休', function () {
    expect(this.result.value.extraLeave).eq(false)
  })

  Then('根據勞基法 {int} 條，實領加班費為 {int} 元', function (id, overtimePay) {
    const result: Result = this.result
    expect(result.value.overtimePay).eq(overtimePay)
    expect(result.according.find(article => article.id === id.toString())).is.ok
  })
})
