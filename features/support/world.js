const { defineSupportCode } = require('cucumber')
const { Labor } = require('../../src/index')

defineSupportCode(function ({ setWorldConstructor }) {
  setWorldConstructor(function () {
    this.labor = {}
  })
})
