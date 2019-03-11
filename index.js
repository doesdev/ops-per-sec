'use strict'

module.exports = async (fn, expect, runForMs = 5000) => {
  const hasExpect = expect || expect === 0 || expect === false
  const ogNow = Date.now()
  const endAt = ogNow + runForMs
  let ops = 0
  let now = ogNow
  while (now < endAt) {
    let r = fn()
    if (typeof r === 'function') r = r()
    if (r instanceof Promise) r = await r
    if (hasExpect && r !== expect) throw new Error(`Expected ${expect} got ${r}`)
    ops += 1
    now = Date.now()
  }
  return parseInt(ops / ((now - ogNow) / 1000))
}
