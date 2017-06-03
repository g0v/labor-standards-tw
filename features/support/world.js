const { defineSupportCode } = require('cucumber')
const { Labor } = require('../../src')

defineSupportCode(function ({ setWorldConstructor }) {
  setWorldConstructor(function () {
    this.labor = new Labor()
  })
})
