'use strict'

const test = require('mvt')
const opsPerSec = require('./index')
const runFor = 1000
const ary = ['some', 'text', 'in', 'an', 'array']

const funcs = [
  {
    desc: 'ary.indexOf !== -1',
    fn: () => ary.indexOf('text') !== -1 && ary.indexOf('in') !== -1
  },
  {
    desc: '~ary.indexOf',
    fn: () => !!(~ary.indexOf('text') && ~ary.indexOf('in'))
  },
  {
    desc: 'ary.includes',
    fn: () => ary.includes('text') && ary.includes('in')
  },
  {
    desc: 'as object',
    fn: () => {
      const obj = {}
      ary.forEach((e) => { obj[e] = true })
      return obj.text && obj.in
    }
  },
  {
    desc: 'as string',
    fn: () => {
      return !!`'${ary.join('\',\'')}'`.match(/('text'|'in').+('text'|'in')/)
    }
  }
]

test('sync: ops is a number', async (assert) => {
  for (const f of funcs) {
    const ops = await opsPerSec(f.fn, runFor, true)
    console.log(`sync ${f.desc}: ${ops} ops/sec`)

    assert.is(typeof ops, 'number')
  }
})

test('async: ops is a number', async (assert) => {
  for (const f of funcs) {
    const fn = () => new Promise((resolve, reject) => {
      process.nextTick(() => resolve(f.fn()))
    })

    const ops = await opsPerSec(fn, runFor, true)
    console.log(`async ${f.desc}: ${ops} ops/sec`)

    assert.is(typeof ops, 'number')
  }
})

test('ops should be fairly consistent regardless of run time', async (assert) => {
  const f = funcs[0]
  const opsA = await opsPerSec(f.fn, 150, true)
  const opsB = await opsPerSec(f.fn, 600, true)
  const opsC = await opsPerSec(f.fn, 2250, true)

  const pctDiff = (a, b) => 100 * Math.abs((a - b) / ((a + b) / 2))

  assert.lessThan(pctDiff(opsA, opsB), 10)
  assert.lessThan(pctDiff(opsB, opsC), 10)
  assert.lessThan(pctDiff(opsC, opsA), 10)
})
