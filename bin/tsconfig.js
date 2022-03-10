const fs = require('fs')
const path = require('path')
const merge = require('lodash.merge')

const curDir = path.resolve('.')
let config = require(path.join(curDir, 'tsconfig.build.json'))
if (config.extends) {
  const base = require(path.join(curDir, config.extends))
  config = merge({}, base, config)
}
const dist = path.join(curDir, config.compilerOptions.outDir)

const { compilerOptions } = config

const map = {}
for (let k in compilerOptions.paths) {
  map[k.replace('/*', '')] = path.join(dist, compilerOptions.paths[k][0].replace('/*', ''))
}
function handleFile(p, ps) {
  return new Promise((resolve, reject) => {
    const m = {}
    for (let k in map) {
      m[k] = path.relative(p, map[k]).replace(/\\/g, '/')
      if (!m[k].startsWith('../')) m[k] = (m[k] ? './' : '.') + m[k]
    }
    fs.readFile(ps, (err, data) => {
      if (err) return reject(err)
      let cnt = data.toString()
      for (let k in m) {
        cnt = cnt.replace(new RegExp(`(['"\`])${k}/`, 'g'), `$1${m[k]}/`)
      }
      fs.writeFile(ps, cnt, (err) => {
        if (err) return reject(err)
        resolve(p)
      })
    })
  })
}

const jobs = []

function replace(p) {
  fs.readdirSync(p).forEach(f => {
    const ps = path.join(p, f)
    if (fs.lstatSync(ps).isDirectory()) {
      if (f !== 'node_modules') replace(ps)
    } else if (f.endsWith('.js') || f.endsWith('.ts')) {
      jobs.push(handleFile(p, ps))
    }
  })
}

replace(path.resolve(dist))

Promise.all(jobs).then((ps) => {
  console.log(`Replaced to resolve ${ps.length} modules`)
}).catch(console.err)
