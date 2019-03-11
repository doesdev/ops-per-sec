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
  if (`${expect}`.match(/^(\d|\.)+$/)) expect = parseInt(expect, 10)
  if (`${expect}` === 'true') expect = true
  if (`${expect}` === 'false') expect = false
}

const code = `
const ops = ${opsPerSec}
ops(${fn}, ${expect || 'undefined'}, ${runForMs || 'undefined'})
`

vm.runInContext(code, sandbox).then(out).catch(console.error)
