#! /usr/bin/env node
'use strict'

const help = `
Ops Per Sec:

ops-per-sec "function" [runForMs] [expect]

ex: ops-per-sec "() => ['some', 'text', 'in'].includes('text')" 3000 true
`
if (process.argv.some((a) => a === '--help' || a === '-h')) {
  console.log(help)
  process.exit(0)
}

const ops = require('./index')
const vm = require('vm')
const sandbox = vm.createContext({ ops })
const fn = process.argv[2]
const out = (ops) => console.log(`${ops} ops/sec for: ${process.argv[2]}`)
const runForMs = process.argv[3] ? parseInt(process.argv[3], 10) : null
let expect = process.argv[4]

if (expect) {
  if (!Number.isNaN(+expect)) expect = parseInt(expect, 10)
  else if (`${expect}` === 'true') expect = true
  else if (`${expect}` === 'false') expect = false
  else expect = `'${expect}'`
} else {
  expect = 'undefined'
}

const code = `ops(${fn}, ${runForMs || 'undefined'}, ${expect})`

vm.runInContext(code, sandbox).then(out).catch(console.error)
