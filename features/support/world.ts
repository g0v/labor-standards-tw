import { defineSupportCode } from 'cucumber'
import { Labor } from '../../src'

defineSupportCode(function ({ setWorldConstructor }) {
  setWorldConstructor(function () {
    this.labor = new Labor()
  })
})
