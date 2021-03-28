import * as commander from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import { watch as chokidar } from 'chokidar'
import { Generator } from '../generator'
import { Fetcher } from '../fetcher'

const pkg = require('../../package.json')

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

      const needToFetch = file.startsWith('http')
      if (needToFetch && !!watch) {
        throw new Error('Cannot use watch mode for remote file')
      }

      // Get file
      let _file: string
      if (needToFetch) {
        const fetcher = new Fetcher(file)
        _file = await fetcher.fetch()
      } else {
        const filePath = path.resolve(process.cwd(), file)
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exist.')
        }
        _file = fs.readFileSync(filePath, 'utf-8')
      }

      if (/\.ya?ml$/.test(file)) {
        const yaml = YAML.safeLoad(_file)

        if (!watch) {
          new Generator(yaml, { dist, name }).generate()
        } else {
          // watch file change
          const watchFile = path.resolve(process.cwd(), file)
          const watcher = chokidar(watchFile)
          watcher
            .on('ready', () => {
              new Generator(yaml, { dist, name }).generate()
              console.log(`Code generated: ${ path.resolve(process.cwd(), dist) }/express.d.ts [${ new Date() }]`)
            })
            .on('error', (error: Error) => {throw error})
            .on('change', () => {
              new Generator(yaml, { dist, name }).generate()
              console.log(`Code generated: ${ path.resolve(process.cwd(), dist) }/express.d.ts [${ new Date() }]`)
            })
            .on('unlink', () => {
              new Generator(yaml, { dist, name }).generate()
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
