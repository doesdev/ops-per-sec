#! /usr/bin/env node
'use strict'

// setup
const opsPerSec = require('./index')
const vm = require('vm')
const sandbox = vm.createContext({})
const fn = () => vm.runInContext(process.argv[2], sandbox)
const out = (ops) => console.log(`${ops} ops/sec for: ${process.argv[2]}`)
const runForMs = process.argv[4] ? parseInt(process.argv[4], 10) : null
let expect = process.argv[3]
if (expect) {
  if (`${expect}`.match(/^(\d|\.)+$/)) expect = parseInt(expect, 10)
  if (`${expect}` === 'true') expect = true
  if (`${expect}` === 'false') expect = false
}

// main
opsPerSec(fn, expect, runForMs).then(out).catch(console.error)
