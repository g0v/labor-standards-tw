import { defineSupportCode } from 'cucumber'
import { expect } from 'chai'

import { Result } from '../../src'

defineSupportCode(function ({ Given, When, Then }) {
  When('計算特休假時', function () {
    this.result = this.labor.paidLeaves(this.endDate)
  })

  Then('根據勞基法 {int} 條，特休假為 {int} 天', function (id, leaves) {
    const result: Result = this.result
    expect(result.value.leaves).eq(leaves)
    expect(result.value.unit).eq('day')
    expect(result.according[0].id).eq(id.toString())
  })
})
