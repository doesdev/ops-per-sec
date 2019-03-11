#! /usr/bin/env node
'use strict'

const opsPerSec = require('./index')
const vm = require('vm')
const sandbox = vm.createContext({})
const fn = process.argv[2]
const out = (ops) => console.log(`${ops} ops/sec for: ${process.argv[2]}`)
const runForMs = process.argv[4] ? parseInt(process.argv[4], 10) : null
let expect = process.argv[3]
if (expect) {
  if (!Number.isNaN(+expect)) expect = parseInt(expect, 10)
  else if (`${expect}` === 'true') expect = true
  else if (`${expect}` === 'false') expect = false
  else expect = `'${expect}'`
}

const code = `
const ops = ${opsPerSec}
ops(${fn}, ${expect || 'undefined'}, ${runForMs || 'undefined'})
`

vm.runInContext(code, sandbox).then(out).catch(console.error)
