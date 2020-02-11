'use strict'

module.exports = async (fn, runForMs = 5000, expect) => {
  fn = typeof fn() === 'function' ? fn() : fn
  const isAsync = fn() instanceof Promise
  const hasExpect = expect !== undefined

  const start = process.hrtime.bigint()
  const ogNow = Date.now()
  const endAt = ogNow + runForMs

  let ops = 0n
  let now = ogNow
  while (now < endAt) {
    let r = fn()
    if (isAsync) r = await r
    if (hasExpect && r !== expect) throw new Error(`Expected ${expect} got ${r}`)

    ops += 1n
    now = Date.now()
  }

  const ranFor = process.hrtime.bigint() - start

  return parseInt((ops * 1000000000n) / ranFor, 10)
}
