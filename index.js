'use strict'

module.exports = async (fn, expect, runForMs = 5000) => {
  let hasExpect = expect || expect === 0 || expect === false
  let ops = 0
  let ogNow = Date.now()
  let now = ogNow
  while (now < (ogNow + runForMs)) {
    let r = await fn()
    if (typeof r === 'function') r = await r()
    if (hasExpect && r !== expect) throw new Error(`Expected ${expect} got ${r}`)
    ops += 1
    now = Date.now()
  }
  return parseInt(ops / ((now - ogNow) / 1000))
}
