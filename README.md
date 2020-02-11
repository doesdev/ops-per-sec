# ops-per-sec [![NPM version](https://badge.fury.io/js/ops-per-sec.svg)](https://npmjs.org/package/ops-per-sec)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)   

> Quickly test ops per second of a function

## Warning - eval like stuff going on in cli yo

When using the cli your string will be interpreted using Node's `vm` in a
sandboxed context. I'm no expert on the dangers of that, but it's always better
to be safe than sorry. Don't be dumb with that.

> "eval is evil" - some smart dude

## Install

node
```sh
$ npm install --save ops-per-sec
```

cli
```sh
$ npm install -g ops-per-sec
```

## Usage

```js
const opsPerSec = require('ops-per-sec')
let ops = opsPerSec(() => ['some', 'text', 'in'].includes('text'), 3000, true)
console.log(`${ops} ops/sec`)
```

```sh
$ ops-per-sec "() => ['some', 'text', 'in'].includes('text')" 3000 true
```

## API

#### `opsPerSec(*func, *expect, *runForMs)`

- **func** *[function - required]* function to test ops per second for
- **runForMs** *[integer - optional - default: 5000]* time in ms to let function run
- **expect** *[optional]* value you expect to be returned from function

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
