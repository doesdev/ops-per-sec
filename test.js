'use strict'

import test from 'ava'
import opsPerSec from './index'
const runFor = 1000
const ary = ['some', 'text', 'in', 'an', 'array']
const funcs = [
  {
    desc: `ary.indexOf !== -1`,
    fn: () => ary.indexOf('text') !== -1 && ary.indexOf('in') !== -1
  },
  {
    desc: `~ary.indexOf`,
    fn: () => !!(~ary.indexOf('text') && ~ary.indexOf('in'))
  },
  {
    desc: `ary.includes`,
    fn: () => ary.includes('text') && ary.includes('in')
  },
  {
    desc: `as object`,
    fn: () => {
      let obj = {}
      ary.forEach((e) => { obj[e] = true })
      return obj.text && obj.in
    }
  },
  {
    desc: `as string`,
    fn: () => {
      return !!`'${ary.join(`','`)}'`.match(/('text'|'in').+('text'|'in')/)
    }
  }
]

test.serial(`synchronous functions return ops per second`, async (assert) => {
  for (let f of funcs) {
    let ops = await opsPerSec(f.fn, true, runFor)
    console.log(`${f.desc}: ${ops} ops/sec`)
    assert.truthy(ops)
  }
})

test.serial(`async functions return ops per second`, async (assert) => {
  for (let f of funcs) {
    let fn = () => new Promise((resolve, reject) => {
      process.nextTick(() => resolve(f.fn()))
    })
    let ops = await opsPerSec(fn, true, runFor)
    console.log(`async ${f.desc}: ${ops} ops/sec`)
    assert.truthy(ops)
  }
})
