'use strict'

const { runTests, test } = require('mvt')
const opsPerSec = require('./index')
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

runTests('Testing ops-per-sec', async () => {
  for (let f of funcs) {
    const ops = await opsPerSec(f.fn, true, runFor)
    console.log(`sync ${f.desc}: ${ops} ops/sec`)

    test(`sync ${f.desc}: ops is a number`, !Number.isNaN(+ops))
  }

  for (let f of funcs) {
    const fn = () => new Promise((resolve, reject) => {
      process.nextTick(() => resolve(f.fn()))
    })

    const ops = await opsPerSec(fn, true, runFor)
    console.log(`async ${f.desc}: ${ops} ops/sec`)

    test(`async ${f.desc}: ops is a number`, !Number.isNaN(+ops))
  }
})
