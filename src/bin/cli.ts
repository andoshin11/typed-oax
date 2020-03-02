import * as commander from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import { Generator } from '../generator'

const pkg = require('../../package.json')

commander
  .version(pkg.version)
  .description("Generate declaration file from Open API targeting for Express usecase")
  .command("generate <file>")
  .option("-d, --dist <dist>", "Output directory")
  .action(async (file: string, options: { dist?: string }) => {
    const { dist } = options

    try {
      if (!dist) {
        throw new Error('Output directory is required. Please specify with --dist option.')
      }

      if (/\.ya?ml$/.test(file)) {
        const filePath = path.resolve(process.cwd(), file)
        if (!fs.existsSync(filePath)) {
          throw new Error('File does not exist.')
        }
        const target = fs.readFileSync(filePath, 'utf-8')
        const yaml = YAML.safeLoad(target)
        new Generator(yaml, { dist }).generate()
      }
    } catch (e) {
      console.error(e)
      process.exit(2)
    }
  })

commander.parse(process.argv)
