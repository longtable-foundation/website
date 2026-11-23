// The copy lives in ../src (content.js, config.js), shared with the static site.
// Vite cannot import CommonJS from outside its root, so this writes it out as JSON first.
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const content = require('../../src/content.js')
const cfg = require('../../src/config.js')

const out = new URL('../src/data.json', import.meta.url)
writeFileSync(out, JSON.stringify({ ...content, cfg }, null, 2) + '\n')
