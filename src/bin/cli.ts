import * as commander from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import { watch as chokidar } from 'chokidar'
import { Generator } from '../generator'

const pkg = require('../../package.json')

function generate(filePath: string, dist: string, name: string) {
  const target = fs.readFileSync(filePath, 'utf-8')
  const yaml = YAML.safeLoad(target)
  new Generator(yaml, { dist, name }).generate()
}

commander
  .version(pkg.version)
  .description("Generate declaration file from Open API targeting for Express usecase")
  .command("generate <file>")
  .option("-d, --dist <dist>", "output directory")
  .option("-n, --name <name>", "output filename. Default: express.d.ts")
  .option("-w, --watch", "watch your spec file change")
  .action(async (file: string, options: { dist?: string; watch?: boolean; name?: string }) => {
    const { dist, watch } = options
    const name = typeof options.name === 'string' ? options.name : 'express.d.ts'

    try {
      if (!dist) {
        throw new Error('Output directory is required. Please specify with --dist option.')
      }

      if (/\.ya?ml$/.test(file)) {
        const filePath = path.resolve(process.cwd(), file)
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exist.')
        }

        if (!watch) {
          generate(filePath, dist, name)
        } else {
          // watch file change
          const watcher = chokidar(filePath)
          watcher
            .on('ready', () => {
              generate(filePath, dist, name)
              console.log(`Code generated: ${ path.resolve(process.cwd(), dist) }/express.d.ts [${ new Date() }]`)
            })
            .on('error', (error: Error) => {throw error})
            .on('change', () => {
              generate(filePath, dist, name)
              console.log(`Code generated: ${ path.resolve(process.cwd(), dist) }/express.d.ts [${ new Date() }]`)
            })
            .on('unlink', () => {
              generate(filePath, dist, name)
              console.log(`Code generated: ${ path.resolve(process.cwd(), dist) }/express.d.ts [${ new Date() }]`)
            })
        }
      } else {
        throw new Error('Unsupported file type. Supported extensions: .yml or .yaml')
      }
    } catch (e) {
      console.error(e)
      process.exit(2)
    }
  })

commander.parse(process.argv)
